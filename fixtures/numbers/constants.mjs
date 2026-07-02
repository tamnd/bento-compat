// The numeric constants the Math and Number namespaces expose as properties. Each
// is a fixed double the specification names, so every runtime must print the same
// digits with no last-bit wobble, including the two infinities and NaN. Node is
// the oracle for the exact values.

// The eight Math constants: e, the two natural logs, the two logs of e, pi, and
// the two square roots. Printing them bare shows the full precision each runtime
// carries for the constant.
console.log(Math.E);
console.log(Math.LN10);
console.log(Math.LN2);
console.log(Math.LOG10E);
console.log(Math.LOG2E);
console.log(Math.PI);
console.log(Math.SQRT1_2);
console.log(Math.SQRT2);

// The Number constants: the gap above one, the safe-integer bounds, the largest
// finite double and the smallest positive subnormal, then the two infinities and
// NaN, which print as Infinity, -Infinity, and NaN on every runtime.
console.log(Number.EPSILON);
console.log(Number.MAX_SAFE_INTEGER);
console.log(Number.MIN_SAFE_INTEGER);
console.log(Number.MAX_VALUE);
console.log(Number.MIN_VALUE);
console.log(Number.POSITIVE_INFINITY);
console.log(Number.NEGATIVE_INFINITY);
console.log(Number.NaN);
