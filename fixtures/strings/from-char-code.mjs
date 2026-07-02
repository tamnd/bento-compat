// String.fromCharCode builds a string from UTF-16 code units. Each argument is
// coerced to a 16-bit unsigned integer by ECMAScript ToUint16, so a value past
// 2^16 wraps and a fraction truncates, and the units are taken verbatim so a
// surrogate half is kept rather than replaced. Every runtime must produce the
// same string.

// No arguments gives the empty string.
console.log(JSON.stringify(String.fromCharCode()));

// ASCII code units spell out their characters.
console.log(String.fromCharCode(72, 105, 33));

// A value past 2^16 wraps: 65536 + 65 reads back as 'A'. A fraction truncates:
// 66.9 becomes 'B'. A negative wraps too: -1 is 65535.
console.log(String.fromCharCode(65536 + 65, 66.9, 67));
console.log(String.fromCharCode(-1).charCodeAt(0));

// A surrogate pair supplied as two code units rejoins into one astral rune.
console.log(String.fromCharCode(0xd83d, 0xde00));

// A lone high surrogate survives as a single code unit. Its length is one and
// its code unit reads back unchanged.
const lone = String.fromCharCode(0xd83d);
console.log(lone.length, lone.charCodeAt(0));

// A run of code units, including a Greek letter and the copyright sign, taken
// from their code points.
console.log(String.fromCharCode(945, 946, 947, 169));
