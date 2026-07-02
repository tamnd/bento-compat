// Increment, decrement, and compound assignment as statements. The ++ and --
// forms update a number in place, += concatenates when the left side is a
// string, %= is the floating remainder that keeps the sign of the dividend, and
// the bitwise compounds coerce to 32 bits and back. Every runtime must agree.

// A for loop driven by i++ in the post clause.
let sum = 0;
for (let i = 0; i < 5; i++) {
  sum += i;
}
console.log(sum);

// Postfix and prefix ++ and -- net out to a plain step when the value is
// discarded.
let x = 10;
x++;
++x;
x--;
console.log(x);

// The arithmetic compounds.
let n = 3;
n += 4;
n -= 1;
n *= 2;
n /= 3;
console.log(n);

// %= is fmod: it keeps the sign of the dividend, so a negative left side stays
// negative, and a fractional operand is allowed.
let a = -7;
a %= 3;
console.log(a);
let b = 5.5;
b %= 2;
console.log(b);

// += on a string concatenates rather than adding.
let s = "foo";
s += "bar";
s += "baz";
console.log(s);

// The bitwise compounds operate on 32-bit integers and return a number.
let flags = 0b1010;
flags |= 0b0101;
flags &= 0b1100;
flags ^= 0b0010;
flags <<= 2;
flags >>= 1;
console.log(flags);

// >>>= is the unsigned right shift, so a negative left side becomes a large
// positive number before the shift.
let u = -8;
u >>>= 1;
console.log(u);
