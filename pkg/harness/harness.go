// Package harness runs the same programs on bento, Node, Bun, and Deno and
// compares the results, so bento's compatibility can be measured rather than
// asserted. Node is the oracle: a fixture passes on a runtime when that
// runtime's stdout and exit code match Node's for the same program.
package harness

import (
	"bytes"
	"context"
	"os"
	"os/exec"
	"path/filepath"
	"sort"
	"strings"
	"time"
)

// Runtime is one JavaScript runtime under test. Args are the fixed arguments
// placed before the fixture path (for example Deno needs "run -A").
type Runtime struct {
	Name string
	Bin  string
	Args []string
}

// Reference is the runtime every other result is compared against.
const Reference = "node"

// DefaultRuntimes lists the runtimes the harness knows how to drive. The bento
// binary is resolved from the BENTO_BIN environment variable when set so CI can
// point at a freshly built binary.
func DefaultRuntimes() []Runtime {
	bento := os.Getenv("BENTO_BIN")
	if bento == "" {
		bento = "bento"
	}
	return []Runtime{
		{Name: "node", Bin: "node", Args: nil},
		{Name: "deno", Bin: "deno", Args: []string{"run", "-A", "--quiet"}},
		{Name: "bun", Bin: "bun", Args: []string{"run"}},
		{Name: "bento", Bin: bento, Args: []string{"run"}},
	}
}

// Available reports whether the runtime's binary is on PATH (or a direct path).
func (r Runtime) Available() bool {
	if strings.ContainsRune(r.Bin, filepath.Separator) {
		_, err := os.Stat(r.Bin)
		return err == nil
	}
	_, err := exec.LookPath(r.Bin)
	return err == nil
}

// RunResult is the outcome of running one fixture on one runtime.
type RunResult struct {
	Runtime  string
	Stdout   string
	ExitCode int
	Timeout  bool
	Duration time.Duration
}

// run executes a single fixture under a runtime with a timeout.
func (r Runtime) run(ctx context.Context, fixture string, timeout time.Duration) RunResult {
	cctx, cancel := context.WithTimeout(ctx, timeout)
	defer cancel()

	args := append(append([]string{}, r.Args...), fixture)
	cmd := exec.CommandContext(cctx, r.Bin, args...)
	var out bytes.Buffer
	cmd.Stdout = &out
	cmd.Stderr = &out
	// Keep runs deterministic and hermetic across runtimes.
	cmd.Env = append(os.Environ(), "NO_COLOR=1", "NODE_DISABLE_COLORS=1")

	start := time.Now()
	err := cmd.Run()
	res := RunResult{Runtime: r.Name, Stdout: out.String(), Duration: time.Since(start)}
	if cctx.Err() == context.DeadlineExceeded {
		res.Timeout = true
		res.ExitCode = -1
		return res
	}
	if exitErr, ok := asExit(err); ok {
		res.ExitCode = exitErr.ExitCode()
	} else if err != nil {
		res.ExitCode = -1
	}
	return res
}

// Fixture is one program to compare across runtimes.
type Fixture struct {
	Name     string
	Path     string
	Category string
}

// FixtureResult collects each runtime's result for a fixture plus the verdict
// of every non-reference runtime against the reference output.
type FixtureResult struct {
	Fixture  Fixture
	Runs     map[string]RunResult
	Matches  map[string]bool
	RefFound bool
}

// DiscoverFixtures walks root for .mjs, .js, and .ts programs and groups them by
// their parent directory name.
func DiscoverFixtures(root string) ([]Fixture, error) {
	var fixtures []Fixture
	err := filepath.WalkDir(root, func(path string, d os.DirEntry, err error) error {
		if err != nil {
			return err
		}
		if d.IsDir() {
			return nil
		}
		ext := filepath.Ext(path)
		if ext != ".mjs" && ext != ".js" && ext != ".ts" {
			return nil
		}
		rel, _ := filepath.Rel(root, path)
		fixtures = append(fixtures, Fixture{
			Name:     strings.TrimSuffix(rel, ext),
			Path:     path,
			Category: filepath.Base(filepath.Dir(path)),
		})
		return nil
	})
	sort.Slice(fixtures, func(i, j int) bool { return fixtures[i].Name < fixtures[j].Name })
	return fixtures, err
}

// Run executes every fixture on every available runtime and scores each against
// the reference. Runtimes that are not installed are skipped, not failed.
func Run(ctx context.Context, fixtures []Fixture, runtimes []Runtime, timeout time.Duration) []FixtureResult {
	active := make([]Runtime, 0, len(runtimes))
	for _, rt := range runtimes {
		if rt.Available() {
			active = append(active, rt)
		}
	}

	results := make([]FixtureResult, 0, len(fixtures))
	for _, f := range fixtures {
		fr := FixtureResult{Fixture: f, Runs: map[string]RunResult{}, Matches: map[string]bool{}}
		for _, rt := range active {
			fr.Runs[rt.Name] = rt.run(ctx, f.Path, timeout)
		}
		ref, ok := fr.Runs[Reference]
		fr.RefFound = ok
		if ok {
			for name, run := range fr.Runs {
				if name == Reference {
					continue
				}
				fr.Matches[name] = sameResult(ref, run)
			}
		}
		results = append(results, fr)
	}
	return results
}

// sameResult decides whether two runs are compatible: identical exit code and
// normalized stdout. Trailing whitespace per line is ignored so cosmetic
// differences do not count as incompatibilities.
func sameResult(a, b RunResult) bool {
	if a.Timeout || b.Timeout {
		return false
	}
	if a.ExitCode != b.ExitCode {
		return false
	}
	return normalize(a.Stdout) == normalize(b.Stdout)
}

func normalize(s string) string {
	lines := strings.Split(strings.ReplaceAll(s, "\r\n", "\n"), "\n")
	for i := range lines {
		lines[i] = strings.TrimRight(lines[i], " \t")
	}
	out := strings.Join(lines, "\n")
	return strings.TrimRight(out, "\n")
}
