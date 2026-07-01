package harness

import (
	"errors"
	"os/exec"
	"sort"
)

// asExit unwraps an *exec.ExitError so a runtime that exits nonzero is recorded
// with its real exit code rather than a generic failure.
func asExit(err error) (*exec.ExitError, bool) {
	return errors.AsType[*exec.ExitError](err)
}

// Scorecard summarizes a run: the per-runtime pass counts overall and by
// category. It is what CI gates on and what the README badge reflects.
type Scorecard struct {
	Total      int                       `json:"total"`
	Runtimes   []string                  `json:"runtimes"`
	Pass       map[string]int            `json:"pass"`
	ByCategory map[string]map[string]int `json:"byCategory"`
	CategoryN  map[string]int            `json:"categoryTotals"`
	Missing    []string                  `json:"missingReference"`
}

// Summarize folds fixture results into a scorecard.
func Summarize(results []FixtureResult) Scorecard {
	sc := Scorecard{
		Pass:       map[string]int{},
		ByCategory: map[string]map[string]int{},
		CategoryN:  map[string]int{},
	}
	seen := map[string]bool{}
	for _, fr := range results {
		if !fr.RefFound {
			sc.Missing = append(sc.Missing, fr.Fixture.Name)
			continue
		}
		sc.Total++
		sc.CategoryN[fr.Fixture.Category]++
		for name, matched := range fr.Matches {
			seen[name] = true
			if sc.ByCategory[name] == nil {
				sc.ByCategory[name] = map[string]int{}
			}
			if matched {
				sc.Pass[name]++
				sc.ByCategory[name][fr.Fixture.Category]++
			}
		}
	}
	for name := range seen {
		sc.Runtimes = append(sc.Runtimes, name)
	}
	sort.Strings(sc.Runtimes)
	return sc
}

// Rate returns the pass fraction for a runtime in the range 0 to 1.
func (s Scorecard) Rate(runtime string) float64 {
	if s.Total == 0 {
		return 0
	}
	return float64(s.Pass[runtime]) / float64(s.Total)
}
