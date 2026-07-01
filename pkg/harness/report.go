package harness

import (
	"fmt"
	"io"
	"sort"
	"strings"
)

// printer writes formatted lines to an io.Writer and remembers the first error,
// so report code stays readable without an error check on every line.
type printer struct {
	w   io.Writer
	err error
}

func (p *printer) printf(format string, a ...any) {
	if p.err != nil {
		return
	}
	_, p.err = fmt.Fprintf(p.w, format, a...)
}

func (p *printer) line(s string) {
	if p.err != nil {
		return
	}
	_, p.err = fmt.Fprintln(p.w, s)
}

// writef appends a formatted fragment to a builder. Builder writes never fail,
// and splitting the Sprintf from the WriteString keeps both errcheck and
// staticcheck happy when building a single line piece by piece.
func writef(b *strings.Builder, format string, a ...any) {
	s := fmt.Sprintf(format, a...)
	b.WriteString(s)
}

// WriteReport prints a human-readable table: one row per fixture with a mark for
// each runtime, followed by the per-runtime totals. bento is the column that
// matters; node is the reference and is not scored against itself.
func WriteReport(w io.Writer, results []FixtureResult, sc Scorecard) error {
	p := &printer{w: w}
	runtimes := sc.Runtimes

	p.line("Compatibility against Node (the reference).")
	p.line("")

	var header strings.Builder
	writef(&header, "%-34s", "fixture")
	for _, rt := range runtimes {
		writef(&header, "  %-6s", rt)
	}
	p.line(header.String())
	p.line(strings.Repeat("-", header.Len()))

	for _, fr := range results {
		if !fr.RefFound {
			p.printf("%-34s  (no node reference)\n", fr.Fixture.Name)
			continue
		}
		var row strings.Builder
		writef(&row, "%-34s", fr.Fixture.Name)
		for _, rt := range runtimes {
			writef(&row, "  %-6s", mark(fr.Matches[rt]))
		}
		p.line(row.String())
	}

	p.line("")
	p.printf("%d fixtures with a node reference\n", sc.Total)
	for _, rt := range runtimes {
		p.printf("  %-6s %3d/%-3d  %5.1f%%\n", rt, sc.Pass[rt], sc.Total, sc.Rate(rt)*100)
	}
	if len(sc.Missing) > 0 {
		p.printf("\n%d fixtures skipped (node not available or errored): %s\n",
			len(sc.Missing), strings.Join(sc.Missing, ", "))
	}
	return p.err
}

// WriteMarkdown renders the scorecard as a Markdown table for the CI job summary
// and the docs. Categories are sorted for stable output.
func WriteMarkdown(w io.Writer, sc Scorecard) error {
	p := &printer{w: w}
	p.line("# bento compatibility scorecard")
	p.line("")
	p.printf("Measured against Node across %d fixtures.\n\n", sc.Total)

	p.line("| runtime | pass | rate |")
	p.line("| --- | --- | --- |")
	for _, rt := range sc.Runtimes {
		p.printf("| %s | %d/%d | %.1f%% |\n", rt, sc.Pass[rt], sc.Total, sc.Rate(rt)*100)
	}

	cats := make([]string, 0, len(sc.CategoryN))
	for c := range sc.CategoryN {
		cats = append(cats, c)
	}
	sort.Strings(cats)
	if len(cats) == 0 {
		return p.err
	}

	p.line("")
	p.line("## By category")
	p.line("")

	var head, sep strings.Builder
	head.WriteString("| category | total |")
	sep.WriteString("| --- | --- |")
	for _, rt := range sc.Runtimes {
		writef(&head, " %s |", rt)
		sep.WriteString(" --- |")
	}
	p.line(head.String())
	p.line(sep.String())
	for _, c := range cats {
		var row strings.Builder
		writef(&row, "| %s | %d |", c, sc.CategoryN[c])
		for _, rt := range sc.Runtimes {
			writef(&row, " %d |", sc.ByCategory[rt][c])
		}
		p.line(row.String())
	}
	return p.err
}

func mark(ok bool) string {
	if ok {
		return "pass"
	}
	return "FAIL"
}
