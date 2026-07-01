// Plain language features that every runtime must agree on.
const nums = [1, 2, 3, 4, 5];
const sum = nums.reduce((a, b) => a + b, 0);
const doubled = nums.map((n) => n * 2);
console.log("sum", sum);
console.log("doubled", doubled.join(","));
console.log("max", Math.max(...nums));
console.log("last", nums.at(-1));
console.log("has", nums.includes(3));

const obj = { a: 1, b: 2, c: 3 };
console.log("keys", Object.keys(obj).join(","));
console.log("entries", Object.entries(obj).map(([k, v]) => `${k}=${v}`).join(","));
console.log("spread", JSON.stringify({ ...obj, d: 4 }));
