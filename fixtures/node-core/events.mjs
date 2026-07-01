// node:events EventEmitter semantics.
import { EventEmitter } from "node:events";

const bus = new EventEmitter();
let total = 0;
bus.on("add", (n) => { total += n; });
bus.emit("add", 5);
bus.emit("add", 7);
console.log("total", total);

let onceHits = 0;
bus.once("boot", () => { onceHits += 1; });
bus.emit("boot");
bus.emit("boot");
console.log("onceHits", onceHits);

console.log("listenerCount", bus.listenerCount("add"));
console.log("eventNames", bus.eventNames().sort().join(","));

const handler = () => {};
bus.on("temp", handler);
bus.off("temp", handler);
console.log("afterOff", bus.listenerCount("temp"));
