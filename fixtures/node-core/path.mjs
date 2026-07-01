// node:path behavior. The posix variant is used explicitly so the result is the
// same regardless of the host OS.
import path from "node:path";

const p = path.posix;
console.log(p.join("a", "b", "c"));
console.log(p.normalize("/a/./b/../c"));
console.log(p.basename("/x/y/file.ts"));
console.log(p.basename("/x/y/file.ts", ".ts"));
console.log(p.extname("archive.tar.gz"));
console.log(p.dirname("/x/y/z"));
console.log(p.isAbsolute("/root"), p.isAbsolute("rel"));
console.log(p.relative("/a/b/c", "/a/b/d/e"));

const parsed = p.parse("/home/user/app.ts");
console.log(parsed.dir, parsed.name, parsed.ext);
console.log(p.format({ dir: "/tmp", name: "out", ext: ".log" }));
