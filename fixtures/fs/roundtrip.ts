// node:fs and node:os working together: create a temp dir, write and read a
// file, list it, stat it, and clean up. Output must match across runtimes, so
// nothing platform-specific (like the temp path itself) is printed.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const dir = fs.mkdtempSync(path.join(os.tmpdir(), "compat-"));
const file = path.join(dir, "note.txt");

fs.writeFileSync(file, "hello from the harness");
console.log("read", fs.readFileSync(file, "utf8"));
console.log("exists", fs.existsSync(file));
console.log("size", fs.statSync(file).size);
console.log("isFile", fs.statSync(file).isFile());

fs.appendFileSync(file, "!");
console.log("appended", fs.readFileSync(file, "utf8"));

const names = fs.readdirSync(dir);
console.log("entries", names.join(","));

fs.rmSync(dir, { recursive: true, force: true });
console.log("cleaned", fs.existsSync(dir));
