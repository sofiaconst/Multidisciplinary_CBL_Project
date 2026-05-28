/**
 * Remove opaque backgrounds from Sippy logo PNGs.
 *
 * logo-wordmark.png  — white background → transparent
 * logo-icon.png      — beige rounded-square + teal border → transparent
 *                      (keeps only the blue drop mark)
 */
import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const ROOT = process.cwd();

async function loadRaw(rel) {
  const p = resolve(ROOT, rel);
  const { data, info } = await sharp(readFileSync(p))
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  return { data: new Uint8ClampedArray(data), w: info.width, h: info.height, path: p };
}

function idx(x, y, w) { return (y * w + x) * 4; }

function colorDist(data, i, r, g, b) {
  return Math.sqrt(
    (data[i]   - r) ** 2 +
    (data[i+1] - g) ** 2 +
    (data[i+2] - b) ** 2
  );
}

/**
 * Flood-fill background-colored pixels transparent starting from image edges.
 * Also removes pixels that are within `threshold` of `bgR,bgG,bgB` which are
 * reachable from the already-transparent region.
 */
function floodFillTransparent(data, w, h, bgR, bgG, bgB, threshold = 32) {
  const visited = new Uint8Array(w * h);
  const queue = [];

  const enqueue = (x, y) => {
    const i = y * w + x;
    if (visited[i]) return;
    visited[i] = 1;
    const pi = i * 4;
    const d = colorDist(data, pi, bgR, bgG, bgB);
    if (d < threshold) {
      data[pi + 3] = 0;
      queue.push(x, y);
    }
  };

  // Seed from all four edges
  for (let x = 0; x < w; x++) { enqueue(x, 0); enqueue(x, h - 1); }
  for (let y = 0; y < h; y++) { enqueue(0, y); enqueue(w - 1, y); }

  let qi = 0;
  while (qi < queue.length) {
    const x = queue[qi++], y = queue[qi++];
    if (x > 0)     enqueue(x - 1, y);
    if (x < w - 1) enqueue(x + 1, y);
    if (y > 0)     enqueue(x, y - 1);
    if (y < h - 1) enqueue(x, y + 1);
  }
}

/** Replace near-white pixels with transparency (smooth falloff). */
function removeWhite(data, w, h, lo = 15, hi = 50) {
  for (let i = 0; i < w * h * 4; i += 4) {
    const maxChannel = Math.max(data[i], data[i+1], data[i+2]);
    const nonWhite = 255 - maxChannel;
    const alpha = Math.min(255, Math.max(0, (nonWhite - lo) / (hi - lo) * 255));
    data[i + 3] = Math.round(alpha);
  }
}

async function save(imgObj) {
  const { data, w, h, path } = imgObj;
  await sharp(Buffer.from(data), { raw: { width: w, height: h, channels: 4 } })
    .png()
    .toFile(path + '.tmp');
  writeFileSync(path, readFileSync(path + '.tmp'));
  const { unlinkSync } = await import('fs');
  unlinkSync(path + '.tmp');
  console.log(`✓  ${path}`);
}

// ── Wordmark: white background → transparent ──────────────────────
async function processWordmark(srcRel, outRel) {
  console.log(`Processing ${srcRel} → ${outRel} …`);
  const img = await loadRaw(srcRel);
  img.path = resolve(ROOT, outRel);
  removeWhite(img.data, img.w, img.h, 15, 50);
  await save(img);
}

// ── Icon: remove beige background + teal border, keep drop mark ───
// Source: the original upload file (unprocessed) to avoid accumulated artifacts.
async function processIcon(srcRel, outRel) {
  console.log(`Processing ${srcRel} → ${outRel} …`);
  const img = await loadRaw(srcRel);
  const { data, w, h } = img;
  img.path = resolve(ROOT, outRel); // write to destination

  // Saturation helper
  const sat = (pi) => {
    const r = data[pi], g = data[pi+1], b = data[pi+2];
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
    return mx === 0 ? 0 : (mx - mn) / mx;
  };

  // Step 1: whole-image saturation cut — anything with S < SAT_KEEP becomes transparent.
  // Drop mark blue: S ≈ 0.86 → keeps (> 0.65)
  // Border ring:    S ≈ 0.50 → removes (< 0.65)
  // Beige fill:     S ≈ 0.04 → removes (< 0.65)
  // Dark navy smile S ≈ 0.67 → just above threshold → keeps
  const SAT_KEEP = 0.64;
  const SAT_FADE = 0.10; // fade width below threshold
  for (let i = 0; i < w * h * 4; i += 4) {
    const s = sat(i);
    if (s < SAT_KEEP) {
      const fade = Math.min(1, (SAT_KEEP - s) / SAT_FADE);
      data[i + 3] = Math.round(data[i + 3] * (1 - fade));
    }
  }

  // Step 2: clean up stray near-transparent pixels (alpha < 20) → fully transparent
  for (let i = 3; i < w * h * 4; i += 4) {
    if (data[i] < 20) data[i] = 0;
  }

  await save(img);
}

// Original upload = clean source with no prior processing
const iconSrc = 'Hydration App/uploads/Sipopy new app logo.png';
const wordmarkSrc = 'Hydration App/uploads/Sippy new main logo.png';

await processWordmark(wordmarkSrc, 'static/logo-wordmark.png');
await processIcon(iconSrc, 'static/logo-icon.png');

// Mirror to Hydration App/app/ (used by the static site at port 5273)
await processWordmark(wordmarkSrc, 'Hydration App/app/logo-wordmark.png');
await processIcon(iconSrc, 'Hydration App/app/logo-icon.png');

console.log('\nDone. Check the PNGs in static/ and Hydration App/app/');
