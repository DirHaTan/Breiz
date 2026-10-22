// Breiz writes Breton in the skolveurieg orthography, never with "zh".
// This check runs before every build: if any "zh" spelling (e.g. "Breizh")
// is found in the site's text, the build stops and shows where it is.
//
// Run it yourself with:  npm run check:breton

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const zh = /\p{L}*zh\p{L}*/giu;
const problems = [];

// Breton interface text, sample Breton articles, the sign-in email, and every source file.
function walk(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path);
    else if (/\.(tsx?|json|md|mdx|html)$/.test(name) && !name.endsWith("fr.json")) checkFile(path);
  }
}

function checkFile(path) {
  const content = readFileSync(path, "utf8");
  // A file that implements the rule itself can opt out with this marker.
  if (content.includes("check-breton: ignore-file")) return;
  content
    .split("\n")
    .forEach((line, i) => {
      // In the articles file, French text sits next to Breton; skip the French lines.
      if (path.endsWith("sample-articles.json") && isInsideFrench(path, i)) return;
      for (const match of line.matchAll(zh)) {
        problems.push(`${relative(root, path)}:${i + 1}  "${match[0]}"`);
      }
    });
}

// Marks which lines of the articles file belong to a "fr" block.
const frenchLines = new Map();
function isInsideFrench(path, lineIndex) {
  if (!frenchLines.has(path)) {
    const lines = readFileSync(path, "utf8").split("\n");
    const inFr = new Set();
    let depth = 0;
    let frDepth = -1;
    lines.forEach((line, i) => {
      if (/^\s*"fr":\s*\{/.test(line)) frDepth = depth;
      if (frDepth !== -1) inFr.add(i);
      depth += (line.match(/[{[]/g) ?? []).length - (line.match(/[}\]]/g) ?? []).length;
      if (frDepth !== -1 && depth <= frDepth) frDepth = -1;
    });
    frenchLines.set(path, inFr);
  }
  return frenchLines.get(path).has(lineIndex);
}

walk(join(root, "src"));
walk(join(root, "supabase"));

if (problems.length) {
  console.error('\n✗ "zh" spelling found. Breiz uses skolveurieg (e.g. "Breiz", not "Breizh"):\n');
  for (const p of problems) console.error("  " + p);
  console.error("");
  process.exit(1);
}
console.log('✓ Breton check passed: no "zh" spellings found.');
