// Promise ordering, async/await, and microtask versus timer sequencing. Every
// runtime should print these in the same order.
console.log("start");

Promise.resolve().then(() => console.log("microtask 1"));
queueMicrotask(() => console.log("microtask 2"));

(async () => {
  const a = await Promise.resolve(10);
  const b = await Promise.resolve(20);
  console.log("awaited", a + b);
})();

const all = await Promise.all([
  Promise.resolve("x"),
  Promise.resolve("y"),
  Promise.resolve("z"),
]);
console.log("all", all.join(""));

const race = await Promise.race([
  Promise.resolve("first"),
  new Promise((r) => setTimeout(() => r("slow"), 50)),
]);
console.log("race", race);

console.log("end sync");
