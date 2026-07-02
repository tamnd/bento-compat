// toString and valueOf called as methods on a number or a boolean value, as
// opposed to the String(x) coercion covered in tostring.mjs. The no-argument
// number.toString takes the same decimal path as String(x), valueOf returns the
// primitive itself, and a boolean stringifies to its word. Every runtime must
// agree.

// number.toString() with no radix, across the cases a naive formatter gets
// wrong: the exponential thresholds, signed zero, and a fraction.
console.log((0).toString());
console.log((42).toString());
console.log((-7).toString());
console.log((3.5).toString());
console.log((1e21).toString());
console.log((1e-7).toString());
console.log((0.1 + 0.2).toString());

// valueOf returns the number itself, so arithmetic on it is unchanged.
console.log((42).valueOf() + 1);
console.log((3.5).valueOf() * 2);

// A number held in a variable dispatches the same way.
const n = 255;
console.log(n.toString());
console.log(n.valueOf());

// boolean.toString() is the word, and valueOf returns the boolean.
console.log(true.toString());
console.log(false.toString());
console.log(true.valueOf() && false.valueOf());
