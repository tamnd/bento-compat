// The legacy String.prototype.substr, which takes a start and a length rather
// than two bounds. A negative start counts from the end and clamps at 0, an
// omitted length runs to the end of the string, and a negative or zero length
// yields the empty string. The start and length are truncated toward zero.
// substr indexes by code unit, so a cut can land inside an astral pair and
// return a lone surrogate. Every runtime must produce the same string.

// A start and a length carve out an interior slice.
console.log("hello".substr(1, 3));

// One argument runs to the end.
console.log("hello".substr(2));

// A negative start counts from the end.
console.log("hello".substr(-2));

// A negative start past the front clamps to 0.
console.log("hello".substr(-10, 2));

// A start at or past the end is empty.
console.log("hello".substr(5));
console.log("hello".substr(10, 3));

// A length past the end clamps to what remains.
console.log("hello".substr(2, 100));

// A zero or negative length is empty.
console.log("hello".substr(1, 0));
console.log("hello".substr(1, -1));

// A fractional start and length truncate toward zero.
console.log("hello".substr(1.9, 2.9));

// Code units, not code points: a length of 1 into an astral pair returns the
// leading lone surrogate.
console.log("\u{1F600}".substr(0, 1).length);
