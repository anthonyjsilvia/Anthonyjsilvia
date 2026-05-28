#!/usr/bin/env node
/**
 * generate-subject-masks.mjs
 *
 * Build-time tool. Walks `public/testimonials/` and produces a matching
 * `*-subject.png` file for each portrait — the same image with the
 * background removed (transparent), so the component can layer the
 * subject on top of the original background and parallax them
 * independently (Apple TV style).
 *
 * Usage:
 *   node scripts/generate-subject-masks.mjs
 *
 * The model weights are downloaded on first run by @imgly/background-removal-node
 * and cached locally; subsequent runs are fast. Output PNGs are committed
 * to git so the production bundle has no runtime ML dependency.
 */

import { removeBackground } from "@imgly/background-removal-node";
import { readdir, writeFile, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, extname, basename, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const TESTIMONIALS_DIR = join(__dirname, "..", "public", "testimonials");

const SUPPORTED = new Set([".png", ".jpg", ".jpeg", ".webp"]);
const SUBJECT_SUFFIX = "-subject.png";

/**
 * @param {string} file Absolute path to source image
 * @returns {string} Absolute path of the subject output PNG
 */
function subjectPathFor(file) {
  const ext = extname(file);
  const name = basename(file, ext);
  return join(dirname(file), `${name}${SUBJECT_SUFFIX}`);
}

async function isSkippable(file) {
  if (basename(file).endsWith(SUBJECT_SUFFIX)) return true;
  return false;
}

async function run() {
  console.log(`→ Scanning ${TESTIMONIALS_DIR}`);
  const entries = await readdir(TESTIMONIALS_DIR);

  const sources = [];
  for (const entry of entries) {
    const full = join(TESTIMONIALS_DIR, entry);
    if (await isSkippable(full)) continue;
    const ext = extname(entry).toLowerCase();
    if (!SUPPORTED.has(ext)) continue;
    const st = await stat(full);
    if (!st.isFile()) continue;
    sources.push(full);
  }

  if (sources.length === 0) {
    console.log("No source images found.");
    return;
  }

  console.log(`→ Found ${sources.length} portraits to process.`);

  for (const file of sources) {
    const outPath = subjectPathFor(file);
    if (existsSync(outPath)) {
      const inStat = await stat(file);
      const outStat = await stat(outPath);
      if (outStat.mtimeMs >= inStat.mtimeMs) {
        console.log(`  ✓ ${basename(file)} (up to date)`);
        continue;
      }
    }

    console.log(`  ↻ ${basename(file)} …`);
    const t0 = Date.now();
    const blob = await removeBackground(file, {
      output: { format: "image/png", quality: 0.95 },
    });
    const buf = Buffer.from(await blob.arrayBuffer());
    await writeFile(outPath, buf);
    console.log(`    → ${basename(outPath)} (${(Date.now() - t0)}ms, ${(buf.length / 1024).toFixed(1)}KB)`);
  }

  console.log("Done.");
}

run().catch((err) => {
  console.error("Subject mask generation failed:", err);
  process.exit(1);
});
