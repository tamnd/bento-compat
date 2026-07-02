# bento-compat

Compatibility harness for [bento](https://github.com/tamnd/bento), the TypeScript runtime built in Go.

The idea is simple: run the same program on bento, Node, Bun, and Deno, then compare.
Node is the reference, so a program passes on a runtime when that runtime's stdout and exit code match Node's for the same input.
The result is a scorecard that measures how close bento is to running real Node code unchanged, and it moves as bento grows.

## How it works

Each fixture under `fixtures/` is an ordinary ES module that every runtime can execute.
The harness runs each one under every runtime it can find on PATH, normalizes the output (line endings and trailing whitespace), and checks each non-reference runtime against Node.
Bun and Deno are scored too, so you can see where all three third-party runtimes agree and where they diverge.

Fixtures avoid printing anything platform-specific (absolute temp paths, timestamps, hostnames), so a match means the observable behavior is the same, not just similar.

## Running it

You need Go, and whichever runtimes you want to compare on your PATH.
Point the harness at a bento binary with `BENTO_BIN`.

```
go run ./cmd/bento-compat
BENTO_BIN=/path/to/bento go run ./cmd/bento-compat --min-rate 0.8
```

Useful flags:

- `--fixtures DIR` the fixture directory, default `fixtures`
- `--timeout D` per-fixture timeout, default 20s
- `--min-rate R` exit nonzero if the target runtime's pass rate is below R
- `--target NAME` which runtime the threshold applies to, default `bento`
- `--json PATH` write the scorecard as JSON
- `--markdown PATH` write the scorecard as Markdown

A runtime that is not installed is skipped, not failed, so the harness is useful even with only some runtimes present.

## Fixtures

- `basics/` language features every runtime must agree on: arithmetic, arrays, objects, strings, optional chaining, regex.
- `coercion/` the primitive coercions String, Number, and Boolean, plus the ambient numeric predicates and the parse functions.
- `numbers/` numeric literal forms, the exact Number::toString across the exponential thresholds, signed zero, and subnormals, and the bit-exact Math methods fround, clz32, and imul at their boundaries.
- `strings/` string methods and operators: full Unicode case mapping, code-unit comparison, concatenation, indexing, padding, and trimming.
- `async/` promise ordering, async/await, microtask versus timer sequencing.
- `node-core/` the Node core modules bento implements: path, buffer, events.
- `fs/` filesystem round trips through node:fs and node:os.

Fixtures grow with bento. As each milestone lands a new slice of the Node surface, its fixtures come here so the scorecard reflects the gain.

## Known gaps

The harness is honest about where bento is not there yet.
Top-level await in modules is one current gap: bento runs modules through a CommonJS lowering that does not allow it, so `async/promises` fails until the ESM module path lands.
Gaps like this are the point of the scorecard, not something to hide.

## License

MIT
