// The transcendental Math functions: the trig, inverse-trig, and hyperbolic
// families, the exponential and logarithms, the cube root, and the two-argument
// atan2 and hypot. Each engine's libm rounds the last bit its own way, so the
// raw doubles can differ past the fifteenth digit; rounding to ten decimals
// lands well inside that noise and still catches a wrong function or a swapped
// argument. Every runtime must agree on the rounded values.
const r = (x) => x.toFixed(10);

console.log(r(Math.sin(0.5)), r(Math.cos(0.5)), r(Math.tan(0.5)));
console.log(r(Math.asin(0.5)), r(Math.acos(0.5)), r(Math.atan(0.5)));
console.log(r(Math.sinh(1)), r(Math.cosh(1)), r(Math.tanh(1)));
console.log(r(Math.asinh(1)), r(Math.acosh(2)), r(Math.atanh(0.5)));
console.log(r(Math.exp(1)), r(Math.expm1(0.001)));
console.log(r(Math.log(10)), r(Math.log2(8)), r(Math.log10(1000)), r(Math.log1p(0.001)));
console.log(r(Math.cbrt(27)), r(Math.cbrt(-8)));

// atan2 takes (y, x), so all four quadrants pin the argument order.
console.log(r(Math.atan2(1, 1)), r(Math.atan2(1, -1)), r(Math.atan2(-1, -1)), r(Math.atan2(-1, 1)));

// hypot is the two-argument Pythagorean length.
console.log(r(Math.hypot(3, 4)), r(Math.hypot(5, 12)), r(Math.hypot(-8, 15)));
