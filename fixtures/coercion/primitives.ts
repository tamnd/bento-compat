// The three primitive coercions String(x), Number(x), and Boolean(x) across the
// number, string, and boolean argument types. Node is the oracle, so every line
// prints a value all runtimes must agree on.

// String(x): a number goes through Number::toString, a boolean is "true"/"false",
// and a string is the identity.
console.log(String(42));
console.log(String(-3.5));
console.log(String(0));
console.log(String(NaN));
console.log(String(Infinity));
console.log(String(-Infinity));
console.log(String(true));
console.log(String(false));
console.log(String("already"));

// Number(x): a string parses the StrNumericLiteral grammar, a boolean is 1/0, and
// a number is the identity. The non-numeric and separator strings are NaN.
console.log(Number("  42  "));
console.log(Number(".5"));
console.log(Number("1e3"));
console.log(Number("0x1F"));
console.log(Number("0b101"));
console.log(Number("0o17"));
console.log(Number("Infinity"));
console.log(Number("-Infinity"));
console.log(Number(""));
console.log(Number("abc"));
console.log(Number("1_000"));
console.log(Number(true));
console.log(Number(false));
console.log(Number(7.25));

// Boolean(x): a number is falsy only at zero or NaN, a string only when empty, and
// a boolean is the identity. "0" and "false" are truthy strings.
console.log(Boolean(0));
console.log(Boolean(-0));
console.log(Boolean(NaN));
console.log(Boolean(1));
console.log(Boolean(-0.001));
console.log(Boolean(""));
console.log(Boolean("0"));
console.log(Boolean("false"));
console.log(Boolean(" "));
console.log(Boolean(true));
console.log(Boolean(false));
