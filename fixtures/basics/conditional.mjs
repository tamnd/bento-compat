// The ternary conditional operator. It picks one of two branches by a boolean,
// chains right when nested, and evaluates only the branch it takes, so a side
// effect in the untaken branch does not fire. Every runtime must agree.

// A plain ternary over each side of the condition.
console.log(5 > 0 ? "pos" : "nonpos");
console.log(-5 > 0 ? "pos" : "nonpos");

// A chained ternary reads as a sign function.
function sign(n) {
  return n > 0 ? 1 : n < 0 ? -1 : 0;
}
console.log(sign(8), sign(-3), sign(0));

// Only the taken branch runs: the untaken side would push to the log, and it
// must not.
const trail = [];
const tick = (tag) => {
  trail.push(tag);
  return tag;
};
const chosen = true ? tick("a") : tick("b");
console.log(chosen, trail.join(","));

// A number-valued ternary, exercising both signs and zero.
console.log([2, -2, 0].map((n) => (n >= 0 ? n * 10 : n)).join(","));
