/* eslint-disable no-console */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import axios from "axios";

// ===== PATH HELPERS (ESM) =====
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ===== CONFIG =====
const INPUT_FILE = path.resolve(__dirname, "../src/data/catalog.json");
const OUTPUT_FILE = path.resolve(__dirname, "../src/data/catalog.updated.json");
const FAILED_FILE = path.resolve(__dirname, "../src/data/catalog.failed.json");

const DELAY_MS = 1200; // polite delay between requests
const ONLY_UPDATE_PLACEHOLDERS = true; // update only blank/placehold.co images
const OVERWRITE_EXISTING = false; // if true and above is false, overwrites existing images

const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isPlaceholder(url) {
  if (!url || typeof url !== "string") return true;
  const u = url.trim().toLowerCase();
  return u === "" || u.includes("placehold.co");
}

async function ddgFirstImageUrl(query) {
  // 1) Get DuckDuckGo HTML page and extract vqd token
  const searchUrl = `https://duckduckgo.com/?q=${encodeURIComponent(query)}&iax=images&ia=images`;
  const htmlResp = await axios.get(searchUrl, {
    headers: HEADERS,
    timeout: 20000,
  });
  const html = htmlResp.data;

  let match = html.match(/vqd=['"]([^'"]+)['"]/);
  if (!match) {
    match = html.match(/"vqd":"([^"]+)"/);
  }
  if (!match || !match[1]) return null;
  const vqd = match[1];

  // 2) Get first image from DDG image endpoint
  const imgResp = await axios.get("https://duckduckgo.com/i.js", {
    headers: {
      ...HEADERS,
      Referer: "https://duckduckgo.com/",
      Accept: "application/json, text/javascript, */*; q=0.01",
    },
    params: {
      l: "us-en",
      o: "json",
      q: query,
      vqd,
      f: ",,,",
      p: "1",
    },
    timeout: 20000,
  });

  const results = imgResp.data?.results ?? [];
  if (!results.length) return null;

  return results[0]?.image ?? null;
}

async function main() {
  if (!fs.existsSync(INPUT_FILE)) {
    console.error(`Input file not found: ${INPUT_FILE}`);
    process.exit(1);
  }

  let products;
  try {
    const raw = fs.readFileSync(INPUT_FILE, "utf8");
    products = JSON.parse(raw);
  } catch (e) {
    console.error("Failed to read/parse input JSON:", e.message);
    process.exit(1);
  }

  if (!Array.isArray(products)) {
    console.error("catalog.json must be a JSON array.");
    process.exit(1);
  }

  const failed = [];
  let updated = 0;
  let skipped = 0;

  for (let i = 0; i < products.length; i++) {
    const item = products[i] ?? {};
    const name = String(item.name ?? "").trim();
    const brand = String(item.brand ?? "").trim();
    const weight = String(item.weight ?? "").trim();

    // Query format: object name + brand + kgs/weight
    const query = [name, brand, weight].filter(Boolean).join(" ");

    const currentImage = item.image ?? "";
    const placeholder = isPlaceholder(currentImage);

    if (ONLY_UPDATE_PLACEHOLDERS && !placeholder) {
      skipped++;
      continue;
    }

    if (!ONLY_UPDATE_PLACEHOLDERS && !OVERWRITE_EXISTING && currentImage && !placeholder) {
      skipped++;
      continue;
    }

    if (!query) {
      failed.push({
        index: i,
        id: item.id ?? null,
        query,
        reason: "Empty query",
      });
      console.log(`[NO QUERY] #${i}`);
      continue;
    }

    try {
      const imageUrl = await ddgFirstImageUrl(query);
      if (imageUrl) {
        products[i].image = imageUrl;
        updated++;
        console.log(`[OK] #${i} ${query} -> ${imageUrl}`);
      } else {
        failed.push({
          index: i,
          id: item.id ?? null,
          query,
          reason: "No image results",
        });
        console.log(`[NO RESULT] #${i} ${query}`);
      }
    } catch (err) {
      failed.push({
        index: i,
        id: item.id ?? null,
        query,
        reason: err?.message || String(err),
      });
      console.log(`[ERROR] #${i} ${query} -> ${err?.message || err}`);
    }

    await sleep(DELAY_MS);
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(products, null, 2), "utf8");
  fs.writeFileSync(FAILED_FILE, JSON.stringify(failed, null, 2), "utf8");

  console.log("\n===== DONE =====");
  console.log(`Updated: ${updated}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Failed:  ${failed.length}`);
  console.log(`Output:  ${OUTPUT_FILE}`);
  console.log(`Failed:  ${FAILED_FILE}`);
}

main().catch((e) => {
  console.error("Fatal error:", e);
  process.exit(1);
});
