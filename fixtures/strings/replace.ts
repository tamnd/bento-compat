// String.prototype.replace and replaceAll with string patterns. replace touches
// only the first occurrence, replaceAll touches every non-overlapping one, and
// both return the string unchanged when the pattern is absent. The replacement
// string expands the ECMAScript substitution patterns: $$ for a literal dollar,
// $& for the matched text, $` for the text before the match, and $' for the text
// after; a $ before a digit stays literal because a string pattern has no
// capture groups. Every runtime must produce the same string.

// replace hits only the first match, replaceAll hits all of them.
console.log("a-b-c".replace("-", "+"));
console.log("a-b-c".replaceAll("-", "+"));

// An absent pattern leaves the string alone.
console.log("hello".replace("xyz", "Q"));

// An empty pattern inserts at the front for replace and weaves between every
// code unit for replaceAll.
console.log("abc".replace("", "["));
console.log("abc".replaceAll("", "-"));

// The replacement is not rescanned, so replaceAll does not loop on its own output.
console.log("aaa".replaceAll("a", "aa"));

// Substitution patterns: $& the match, $` the prefix, $' the suffix.
console.log("one two three".replace("two", "[$&]"));
console.log("one two three".replace("two", "<$`>"));
console.log("one two three".replace("two", "<$'>"));

// $$ is a literal dollar, and $1 has no capture so it stays verbatim.
console.log("price".replace("price", "$$9.99"));
console.log("ab".replaceAll("a", "$1x"));

// Code units, not bytes: an astral pattern is matched and replaced as a whole.
console.log("x\u{1F600}y".replace("\u{1F600}", "_"));
