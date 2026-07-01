package harness

import (
	"os"
	"path/filepath"
	"testing"
)

func TestNormalize(t *testing.T) {
	cases := map[string]string{
		"a\r\nb\r\n": "a\nb",
		"a  \nb\t":   "a\nb",
		"x\n\n\n":    "x",
		"same":       "same",
	}
	for in, want := range cases {
		if got := normalize(in); got != want {
			t.Errorf("normalize(%q) = %q, want %q", in, got, want)
		}
	}
}

func TestSameResult(t *testing.T) {
	base := RunResult{ExitCode: 0, Stdout: "hello\n"}
	if !sameResult(base, RunResult{ExitCode: 0, Stdout: "hello"}) {
		t.Error("trailing newline should not matter")
	}
	if sameResult(base, RunResult{ExitCode: 1, Stdout: "hello"}) {
		t.Error("exit code mismatch should fail")
	}
	if sameResult(base, RunResult{ExitCode: 0, Stdout: "world"}) {
		t.Error("different stdout should fail")
	}
	if sameResult(base, RunResult{Timeout: true}) {
		t.Error("a timeout is never a match")
	}
}

func TestDiscoverFixtures(t *testing.T) {
	dir := t.TempDir()
	must := func(err error) {
		if err != nil {
			t.Fatal(err)
		}
	}
	must(os.MkdirAll(filepath.Join(dir, "basics"), 0o755))
	must(os.WriteFile(filepath.Join(dir, "basics", "a.mjs"), []byte("1"), 0o644))
	must(os.WriteFile(filepath.Join(dir, "basics", "b.ts"), []byte("1"), 0o644))
	must(os.WriteFile(filepath.Join(dir, "readme.md"), []byte("skip"), 0o644))

	fixtures, err := DiscoverFixtures(dir)
	if err != nil {
		t.Fatal(err)
	}
	if len(fixtures) != 2 {
		t.Fatalf("want 2 fixtures, got %d", len(fixtures))
	}
	if fixtures[0].Category != "basics" {
		t.Errorf("category = %q, want basics", fixtures[0].Category)
	}
}

func TestSummarize(t *testing.T) {
	results := []FixtureResult{
		{
			Fixture:  Fixture{Name: "x", Category: "basics"},
			RefFound: true,
			Matches:  map[string]bool{"bento": true, "bun": true},
		},
		{
			Fixture:  Fixture{Name: "y", Category: "fs"},
			RefFound: true,
			Matches:  map[string]bool{"bento": false, "bun": true},
		},
	}
	sc := Summarize(results)
	if sc.Total != 2 {
		t.Fatalf("total = %d, want 2", sc.Total)
	}
	if sc.Pass["bento"] != 1 || sc.Pass["bun"] != 2 {
		t.Errorf("pass counts wrong: %v", sc.Pass)
	}
	if r := sc.Rate("bento"); r != 0.5 {
		t.Errorf("bento rate = %v, want 0.5", r)
	}
}
