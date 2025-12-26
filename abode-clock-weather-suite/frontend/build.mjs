import fs from "fs";
import path from "path";

const watch = process.argv.includes("--watch");
const srcPath = path.resolve("src/abode-clock-weather-card.js");
const outPath = path.resolve("../www/abode-clock-weather-card.js");

function build() {
  const src = fs.readFileSync(srcPath, "utf-8");
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, src, "utf-8");
  console.log(`[build] wrote ${outPath}`);
}

build();

if (watch) {
  fs.watch(path.dirname(srcPath), { recursive: true }, () => {
    try { build(); } catch (e) { console.error(e); }
  });
  console.log("[build] watching...");
}
