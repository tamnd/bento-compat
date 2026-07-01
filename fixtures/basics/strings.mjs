// String and template handling, plus a few ES2020 and later operators.
const name = "bento";
console.log(name.toUpperCase());
console.log(name.padStart(8, "-"));
console.log(name.replaceAll("n", "N"));
console.log("a,b,,c".split(",").filter(Boolean).join("|"));
console.log(`hello ${name} v${1 + 1}`);

const maybe = null;
console.log(maybe ?? "fallback");
console.log(maybe?.length ?? "no length");

const re = /(\d+)-(\d+)/;
const m = "12-34".match(re);
console.log(m[1], m[2]);

console.log([..."abc"].reverse().join(""));
console.log(Array.from({ length: 3 }, (_, i) => i * i).join(","));
