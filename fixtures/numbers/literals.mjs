// Numeric literal forms: hexadecimal, binary, and octal integers, underscore digit
// separators, and exponents. Each evaluates to a plain number, and the arithmetic
// over them must agree across runtimes.
console.log(0xff);
console.log(0b1010);
console.log(0o17);
console.log(1_000_000);
console.log(1.5e2);
console.log(1e-3);
console.log(0xff + 0b1010 + 0o17 + 1_000 + 1.5e2);
console.log(0xdead_beef);
console.log(0b1111_0000);
console.log(3.141_592);
console.log(2 ** 53);
console.log(0.1e1);
