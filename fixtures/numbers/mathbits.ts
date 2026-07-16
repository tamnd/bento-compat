// The three Math methods that are integer or single-precision rather than
// transcendental: Math.fround, Math.clz32, and Math.imul. They are bit-exact, so
// every runtime must print the same digits with no last-bit wobble. Node is the
// oracle for the exact values.

// Math.fround snaps a double to the nearest single-precision float and back. An
// exact value is unchanged; 1.1 lands on its float32 neighbor; 2^24 + 1 is the
// first integer float32 cannot hold, so it rounds down to 2^24; a magnitude past
// the float32 range overflows to infinity rather than clamping; -0 keeps its sign.
console.log(Math.fround(1));
console.log(Math.fround(1.1));
console.log(Math.fround(16777217));
console.log(Math.fround(1e39));
console.log(Math.fround(-1e39));
console.log(Object.is(Math.fround(-0), -0));
console.log(Number.isNaN(Math.fround(NaN)));

// Math.clz32 counts the leading zero bits of the ToUint32 coercion. Zero counts
// all 32, a power of two counts its position, -1 coerces to all ones so counts 0,
// NaN and infinity coerce to 0 so count 32, and a fraction truncates first.
console.log(Math.clz32(0));
console.log(Math.clz32(1));
console.log(Math.clz32(2));
console.log(Math.clz32(0x80000000));
console.log(Math.clz32(-1));
console.log(Math.clz32(NaN));
console.log(Math.clz32(Infinity));
console.log(Math.clz32(3.9));

// Math.imul multiplies as 32-bit signed integers, keeping only the low 32 bits.
// The small case is ordinary; the large ones overflow and wrap negative; a
// fraction truncates through the ToInt32 coercion first.
console.log(Math.imul(3, 4));
console.log(Math.imul(-1, 8));
console.log(Math.imul(0xffffffff, 5));
console.log(Math.imul(0x7fffffff, 2));
console.log(Math.imul(6.9, 3));
