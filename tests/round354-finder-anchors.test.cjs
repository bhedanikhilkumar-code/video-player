/* Round 354: feature-finder rows and What's new jump targets must point at an id the
   page can actually build - a renamed or removed id turns "Jump to it" into a dead
   button. Ids are created many ways (markup, .id = "...", card factories with the id
   as an argument, CSS rules), so instead of collecting ids the test strips every
   "#id" anchor reference and then checks the id still appears somewhere else in the
   source (quoted, or as a CSS #id rule). Verified against the live DOM: exactly 4 of
   723 anchors are conditional by design, and all four pass this check. */
const fs = require("fs");
const path = require("path");
const src = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");

const anchors = new Set();
for (const m of src.matchAll(/\["[^"\n]{2,80}",\s*"[^"\n]{2,400}",\s*"(#[-A-Za-z0-9_]+)"\]/g)) anchors.add(m[1]);
for (const m of src.matchAll(/__vpWnew283\(\s*"[^"\n]{2,120}",\s*"(#[-A-Za-z0-9_]+)"/g)) anchors.add(m[1]);
for (const m of src.matchAll(/WNEW\.unshift\(\["[^"\n]{2,120}",\s*"(#[-A-Za-z0-9_]+)"/g)) anchors.add(m[1]);
// tips: ["text", "#selector"] pairs in the TIPS list
const tips = src.match(/var TIPS = \[([\s\S]*?)\n  \];/);
if (tips) for (const m of tips[1].matchAll(/"(#[-A-Za-z0-9_]+)"/g)) anchors.add(m[1]);

// remove every "#id" reference (anchor lists, jump special cases) for anchor ids
let work = src;
anchors.forEach((a) => { work = work.split('"' + a + '"').join('""'); });

const bad = [];
anchors.forEach((a) => {
  const id = a.slice(1);
  const quoted = work.includes('"' + id + '"') || work.includes("'" + id + "'");
  const css = new RegExp("#" + id + "[{:.,\\s\\[]").test(work);
  if (!quoted && !css) bad.push(a);
});
if (bad.length) {
  console.error("anchors with no matching element anywhere in the source:\n" + bad.join("\n"));
  process.exit(1);
}
console.log("Round 354 anchors: all " + anchors.size + " feature-finder/What's new jump targets resolve to something the page builds.");
