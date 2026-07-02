// node:buffer encodings and helpers.
import { Buffer } from "node:buffer";

console.log(Buffer.from("hello").toString("hex"));
console.log(Buffer.from("hello").toString("base64"));
console.log(Buffer.from("aGVsbG8=", "base64").toString());
console.log(Buffer.from("6869", "hex").toString());
console.log(Buffer.concat([Buffer.from("foo"), Buffer.from("bar")]).toString());
console.log(Buffer.byteLength("naïve"));
console.log(Buffer.alloc(4, 0).join(","));
console.log(Buffer.isBuffer(Buffer.from("x")), Buffer.isBuffer("x"));

const b = Buffer.alloc(4);
b.writeUInt16LE(513, 0);
console.log(b.readUInt16LE(0), b[0], b[1]);
