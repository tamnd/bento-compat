// Command bento-compat runs the compatibility harness: it executes every
// fixture on bento, Node, Bun, and Deno, scores bento against Node, prints a
// table, and optionally writes a JSON scorecard and a Markdown summary. It exits
// nonzero when bento's pass rate is below the required threshold so CI can gate.
package main

import (
	"context"
	"encoding/json"
	"flag"
	"fmt"
	"os"
	"time"

	"github.com/tamnd/bento-compat/pkg/harness"
)

func main() {
	var (
		dir       = flag.String("fixtures", "fixtures", "directory of fixture programs")
		timeout   = flag.Duration("timeout", 20*time.Second, "per-fixture timeout")
		threshold = flag.Float64("min-rate", 0, "minimum bento pass rate (0 to 1); exit nonzero if below")
		jsonOut   = flag.String("json", "", "write the scorecard as JSON to this path")
		mdOut     = flag.String("markdown", "", "write the scorecard as Markdown to this path")
		target    = flag.String("target", "bento", "runtime whose pass rate the threshold applies to")
	)
	flag.Parse()

	fixtures, err := harness.DiscoverFixtures(*dir)
	if err != nil {
		fmt.Fprintf(os.Stderr, "bento-compat: %v\n", err)
		os.Exit(2)
	}
	if len(fixtures) == 0 {
		fmt.Fprintf(os.Stderr, "bento-compat: no fixtures found under %s\n", *dir)
		os.Exit(2)
	}

	runtimes := harness.DefaultRuntimes()
	reportAvailability(runtimes)

	results := harness.Run(context.Background(), fixtures, runtimes, *timeout)
	sc := harness.Summarize(results)
	if err := harness.WriteReport(os.Stdout, results, sc); err != nil {
		fmt.Fprintf(os.Stderr, "bento-compat: write report: %v\n", err)
		os.Exit(2)
	}

	if *jsonOut != "" {
		if err := writeJSON(*jsonOut, sc); err != nil {
			fmt.Fprintf(os.Stderr, "bento-compat: write json: %v\n", err)
			os.Exit(2)
		}
	}
	if *mdOut != "" {
		f, err := os.Create(*mdOut)
		if err != nil {
			fmt.Fprintf(os.Stderr, "bento-compat: write markdown: %v\n", err)
			os.Exit(2)
		}
		err = harness.WriteMarkdown(f, sc)
		_ = f.Close()
		if err != nil {
			fmt.Fprintf(os.Stderr, "bento-compat: write markdown: %v\n", err)
			os.Exit(2)
		}
	}

	if *threshold > 0 && sc.Rate(*target) < *threshold {
		fmt.Fprintf(os.Stderr, "\n%s pass rate %.1f%% is below the required %.1f%%\n",
			*target, sc.Rate(*target)*100, *threshold*100)
		os.Exit(1)
	}
}

func reportAvailability(runtimes []harness.Runtime) {
	fmt.Fprintln(os.Stderr, "Runtimes:")
	for _, rt := range runtimes {
		status := "not found"
		if rt.Available() {
			status = "ready"
		}
		fmt.Fprintf(os.Stderr, "  %-6s %s\n", rt.Name, status)
	}
	fmt.Fprintln(os.Stderr)
}

func writeJSON(path string, sc harness.Scorecard) error {
	f, err := os.Create(path)
	if err != nil {
		return err
	}
	defer func() { _ = f.Close() }()
	enc := json.NewEncoder(f)
	enc.SetIndent("", "  ")
	return enc.Encode(sc)
}
