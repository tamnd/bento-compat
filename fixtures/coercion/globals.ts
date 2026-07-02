// The ambient global numeric predicates and the parse functions, which sit next to
// the coercions in the runtime. Node is the oracle for the boundary between what
// each accepts.

// isNaN and isFinite coerce their argument to a number first.
console.log(isNaN(NaN));
console.log(isNaN(0));
console.log(isNaN("abc"));
console.log(isNaN("42"));
console.log(isFinite(1));
console.log(isFinite(Infinity));
console.log(isFinite("1e3"));
console.log(isFinite(NaN));

// Number.isNaN and Number.isFinite do not coerce, so a string is always false.
console.log(Number.isNaN(NaN));
console.log(Number.isNaN("abc"));
console.log(Number.isFinite(1));
console.log(Number.isFinite("1"));

// parseInt and parseFloat are lenient: they read a prefix and ignore the rest.
console.log(parseInt("42px"));
console.log(parseInt("0x1F"));
console.log(parseInt("101", 2));
console.log(parseInt("  -17  "));
console.log(parseInt("abc"));
console.log(parseFloat("3.14 is pi"));
console.log(parseFloat("1e3rest"));
console.log(parseFloat(".5"));
console.log(parseFloat("Infinity"));
console.log(parseFloat("abc"));
