// String methods and operators the compiler lowers directly: case mapping with the
// full Unicode rules, code-unit comparison, concatenation, indexing, padding, and
// trimming. The Unicode cases are the ones Go's simple mapping would get wrong.

// Case mapping follows the locale-independent full Unicode rules, so the German
// sharp s expands and a word-final sigma lowercases to its final form.
console.log("straße".toUpperCase());
console.log("ΟΔΟΣ".toLowerCase());
console.log("Hello, World".toUpperCase());
console.log("HELLO".toLowerCase());
console.log("ﬀ".toUpperCase()); // the ff ligature

// Relational comparison is by UTF-16 code unit, so it agrees on astral text.
console.log("apple" < "banana");
console.log("Zebra" < "apple");
console.log("abc" <= "abc");
console.log("abc" >= "abd");
console.log("a" < "ab");

// Concatenation, both the operator and the method with several arguments.
console.log("foo" + "bar");
console.log("a".concat("b", "c", "d"));

// Indexing, char access, and code points.
const s = "bento";
console.log(s.length);
console.log(s.charAt(1));
console.log(s.charCodeAt(0));
console.log(s.indexOf("nt"));
console.log(s.includes("ent"));
console.log(s.startsWith("be"));
console.log(s.endsWith("to"));
console.log(s.slice(1, 3));
console.log(s.substring(2));

// Padding and trimming.
console.log("7".padStart(3, "0"));
console.log("7".padEnd(3, "."));
console.log("  spaced  ".trim());
console.log("  left".trimStart());
console.log("right  ".trimEnd());
