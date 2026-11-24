// Weirdest Job Title: Blind Judge Showdown
// Entry generator — writes a single job title (<=60 code points) to
// $MAKEFUN_OUTPUT_DIR/entry.txt and validates it byte-for-byte.
//
// Why this title wins blind pairwise judging:
// The brief says a real-sounding job with ONE hilariously specific twist
// beats a generic oddity. So the line is built as:
//   [plausible senior corporate title] + [absurdly specific duty]
// "Senior Vice President" is a title every judge recognises as real;
// "Apologizing to Geese" is the single twist — visual, specific, and
// funny because geese are famously unappeasable. No second joke, no
// filler words, no profanity: one punchline, instantly legible in a
// two-at-a-time comparison.
//
// Candidates considered (all <=60 chars) and why they lost:
//  1. "Lead Squirrel Negotiator, City Parks Department" — good, but
//     "negotiator" is a familiar comedy trope; less surprising.
//  2. "Professional Queue Stander for Other People's Funerals" —
//     strong and specific, but the dark edge risks reading as
//     mean-spirited rather than funny in a blind judge pass.
//  3. "Chief Moonlight Auditor for Haunted Lighthouses" — evocative,
//     but "haunted" is generic spooky; the twist is not a job duty.
// The winner keeps the corporate frame (real job) and makes the duty
// itself the joke (one twist), which is exactly what the brief rewards.

const fs = require("node:fs");
const path = require("node:path");

// The entry line. 45 code points, well under the 60-character limit.
const ENTRY = "Senior Vice President of Apologizing to Geese";

// The output directory comes from the environment (the harness sets
// MAKEFUN_OUTPUT_DIR); default to ./output so a plain `node main.ts`
// run still lands in the same place the brief expects.
const outDir = process.env.MAKEFUN_OUTPUT_DIR || "./output";
const outFile = path.join(outDir, "entry.txt");

// Write the entry with a single trailing newline: the brief asks for
// the title and nothing else, so the file is the line plus the newline
// a text file conventionally ends with — no extra lines, no preamble.
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outFile, ENTRY + "\n", "utf8");

// Read the file back and validate it, failing loudly on any mismatch
// so a bad build can never be submitted silently:
//  - byte-identical to the intended line (guards against encoding or
//    newline drift between write and read)
//  - within the 60-code-point limit (counted in code points, not UTF-16
//    units, so an emoji-heavy line could not slip past)
//  - not only whitespace, and exactly one non-empty line (the brief
//    demands the title and nothing else)
const written = fs.readFileSync(outFile, "utf8");
const lines = written.split("\n").filter((l) => l.length > 0);

if (written !== ENTRY + "\n") {
  console.error("FAIL: entry.txt is not byte-identical to the intended line");
  console.error("expected:", JSON.stringify(ENTRY + "\n"));
  console.error("actual:  ", JSON.stringify(written));
  process.exit(1);
}
if ([...ENTRY].length > 60) {
  console.error(`FAIL: entry is ${[...ENTRY].length} code points, over the 60 limit`);
  process.exit(1);
}
if (lines.length !== 1 || ENTRY.trim().length === 0) {
  console.error("FAIL: entry must be exactly one non-empty line");
  process.exit(1);
}

console.log(`OK: entry.txt (${[...ENTRY].length} code points)`);
console.log(`Entry: ${ENTRY}`);
