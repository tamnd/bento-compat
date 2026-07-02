// Number::toString (the decimal String(x) on a number) across the cases where a
// naive formatter diverges from the specification: the exponential thresholds, the
// unpadded exponent, signed zero, subnormals, and the largest finite double. Node
// is the oracle for the exact digit strings.

// The exponential thresholds. 1e21 goes exponential, 1e20 stays as an integer;
// 1e-7 goes exponential, 1e-6 stays as a decimal.
console.log(String(1e20));
console.log(String(1e21));
console.log(String(1e-6));
console.log(String(1e-7));

// The exponent is written with a sign and no zero padding.
console.log(String(1.5e300));
console.log(String(1.5e-300));
console.log(String(5e-324)); // the smallest positive subnormal
console.log(String(1.7976931348623157e308)); // the largest finite double

// Ordinary magnitudes and fractions round-trip to their shortest form.
console.log(String(0.1));
console.log(String(0.2));
console.log(String(0.1 + 0.2));
console.log(String(123456.789));
console.log(String(-0.0000015));
console.log(String(100));
console.log(String(1 / 3));

// Signed zero both print as "0".
console.log(String(0));
console.log(String(-0));

// Template literals and implicit string conversion take the same path.
console.log(`${255} ${1e21} ${0.1 + 0.2}`);
console.log("" + 42 + true);
