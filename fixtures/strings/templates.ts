// Template literals: the head, the interpolated expressions coerced to strings,
// and the trailing literals joined in order. The coercion is ECMAScript ToString,
// so a number formats as Number::toString, a boolean as its word, and a nested
// string passes through. The cooked parts resolve the same escapes a quoted
// string would, plus an escaped backtick and an escaped dollar-brace that is a
// literal rather than a substitution. Every runtime must produce the same string.

// A no-substitution template is just its cooked content.
console.log(`hello world`);

// A number and a string interpolated together, the common case.
const n = 42;
const s = "mid";
console.log(`a${n}b${s}c`);

// Number coercion across the Number::toString spread: integer, fraction,
// negative, and the exponential thresholds, all inside a template.
console.log(`${0} ${-7} ${3.5} ${1e21} ${1e-7} ${1e20}`);

// Boolean coercion to the word, not a number.
console.log(`flag is ${true} and ${false}`);

// Escapes in the cooked parts: a tab, a newline, an escaped backtick, and an
// escaped dollar-brace that stays literal because the brace is escaped.
console.log(`tab\tafter${n}and a \` and \${ literal`);

// A multi-line template keeps its literal newline.
console.log(`line one
line two ${n}`);

// Nesting: a template inside a substitution of another template.
console.log(`outer[${`inner ${n}`}]`);
