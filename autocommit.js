#!/usr/bin/env node

/**
 * autocommit.js — Mistral-powered GitHub Auto-Commit Bot
 * --------------------------------------------------------
 * Runs every night at 23:45 IST via GitHub Actions.
 * 1. Checks GitHub API → any commit today?
 * 2. YES → exits silently (your work is your work)
 * 3. NO  → asks Mistral to generate a useful JS utility
 * 4. Saves the file + commits + pushes to your repo
 */

import "dotenv/config";
import https from "https";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";

// ── Config (all from environment variables) ────────────────────────────────
const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;
const GITHUB_TOKEN    = process.env.GITHUB_TOKEN;
const REPO_OWNER      = process.env.REPO_OWNER;
const REPO_NAME       = process.env.REPO_NAME;
const GIT_USER_NAME   = process.env.GIT_USER_NAME  || "AutoCommit Bot";
const GIT_USER_EMAIL  = process.env.GIT_USER_EMAIL || "bot@users.noreply.github.com";
const OUTPUT_DIR      = "daily-utils";

// ── Tiny HTTPS helper (no axios needed) ───────────────────────────────────
function httpsRequest(options, body = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });
    req.on("error", reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

// ── STEP 1: Did I already commit today? ───────────────────────────────────
async function hasCommitToday() {
  const today = new Date().toISOString().split("T")[0];
  const since = `${today}T00:00:00Z`;
  const until = `${today}T23:59:59Z`;

  console.log(`\n🔍 Checking commits on ${today} for ${REPO_OWNER}/${REPO_NAME}...`);

  const { status, body } = await httpsRequest({
    hostname: "api.github.com",
    path: `/repos/${REPO_OWNER}/${REPO_NAME}/commits?since=${since}&until=${until}&per_page=5`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      "User-Agent": "AutoCommitBot/1.0",
      Accept: "application/vnd.github.v3+json",
    },
  });

  if (status !== 200) {
    throw new Error(`GitHub API error ${status}: ${JSON.stringify(body)}`);
  }

  const count = Array.isArray(body) ? body.length : 0;
  console.log(`   Found ${count} commit(s) today.`);
  return count > 0;
}

// ── STEP 2: Ask Mistral to generate a JS utility ──────────────────────────
async function generateWithMistral() {
  console.log("\n🤖 No commit found. Asking Mistral to generate a utility...");

  // Rotate category by day so content stays varied across the month
  const categories = [
    "array manipulation (e.g. groupBy, chunk, flatten, zip, unique)",
    "string helper (e.g. slugify, truncate, titleCase, maskEmail)",
    "date/time utility (e.g. relativeTime, businessDays, formatDuration)",
    "object utility (e.g. deepClone, deepMerge, pick, omit, diff)",
    "validation helper (e.g. isEmail, isURL, isStrongPassword)",
    "async utility (e.g. retry with backoff, timeout wrapper, debounce promise)",
    "number/math helper (e.g. clamp, lerp, formatCurrency, randomInt)",
    "functional helper (e.g. pipe, compose, memoize, once, curry)",
    "data structure (e.g. LRU cache, event emitter, queue, stack)",
    "DOM/browser utility (e.g. copyToClipboard, localStorageWithTTL)",
  ];

  const dayIndex = new Date().getDate() % categories.length;
  const category = categories[dayIndex];

  const prompt = `Generate a single, practical JavaScript utility in the category: "${category}".

STRICT REQUIREMENTS:
- One well-named function (or 2-3 tightly related functions)
- Modern JS (ES2020+), zero external dependencies
- Full JSDoc: @param, @returns, @example
- 3-4 usage examples as comments at the bottom
- Under 70 lines of code total

Reply with ONLY a raw JSON object — no markdown, no backticks, no explanation:
{
  "filename": "camelCaseName.js",
  "title": "Human Readable Title",
  "category": "Array | String | Date | Object | Validation | Async | Math | Functional | DataStructure | DOM",
  "difficulty": "Beginner | Intermediate | Advanced",
  "description": "One sentence — what it does.",
  "code": "// full JS source as a single string, use \\n for newlines",
  "explanation": "2 sentences on the approach and why it is useful."
}`;

  const { status, body } = await httpsRequest(
    {
      hostname: "api.mistral.ai",
      path: "/v1/chat/completions",
      method: "POST",
      headers: {
        Authorization: `Bearer ${MISTRAL_API_KEY}`,
        "Content-Type": "application/json",
      },
    },
    {
      model: "mistral-small-latest",
      max_tokens: 1500,
      temperature: 0.7,
      messages: [{ role: "user", content: prompt }],
    }
  );

  if (status !== 200) {
    throw new Error(`Mistral API error ${status}: ${JSON.stringify(body)}`);
  }

  // Mistral uses OpenAI-style response shape
  const raw = body.choices[0].message.content.trim();

  // Strip accidental markdown fences if model adds them
  const clean = raw.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "").trim();

  const result = JSON.parse(clean);
  console.log(`   ✅ Generated: "${result.title}" [${result.category}] (${result.difficulty})`);
  return result;
}

// ── STEP 3: Save the file + update index ──────────────────────────────────
function saveFiles(utility) {
  const today = new Date().toISOString().split("T")[0];
  const dir   = path.join(OUTPUT_DIR, today);

  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  // Write the actual JS utility
  const jsPath = path.join(dir, utility.filename);
  fs.writeFileSync(jsPath, utility.code, "utf8");

  // Write a metadata sidecar
  const meta = {
    date:        today,
    title:       utility.title,
    filename:    utility.filename,
    category:    utility.category,
    difficulty:  utility.difficulty,
    description: utility.description,
    explanation: utility.explanation,
    generatedAt: new Date().toISOString(),
    generatedBy: "mistral-small-latest",
  };
  fs.writeFileSync(path.join(dir, "meta.json"), JSON.stringify(meta, null, 2), "utf8");

  // Update the rolling index.json at the root of daily-utils/
  updateIndex(meta);

  console.log(`\n💾 Saved → ${jsPath}`);
  return dir;
}

function updateIndex(newEntry) {
  const indexPath = path.join(OUTPUT_DIR, "index.json");
  let index = [];

  if (fs.existsSync(indexPath)) {
    try { index = JSON.parse(fs.readFileSync(indexPath, "utf8")); }
    catch { index = []; }
  }

  // Remove duplicate for same date (idempotent re-runs)
  index = index.filter((e) => e.date !== newEntry.date);
  index.unshift(newEntry); // newest first

  fs.writeFileSync(indexPath, JSON.stringify(index, null, 2), "utf8");
  console.log(`   Index updated — ${index.length} total entries.`);
}

// ── STEP 4: Git commit & push ─────────────────────────────────────────────
function commitAndPush(utility) {
  const today = new Date().toISOString().split("T")[0];
  console.log("\n📦 Committing and pushing to GitHub...");

  const run = (cmd) => execSync(cmd, { stdio: "inherit" });

  run(`git config user.name "${GIT_USER_NAME}"`);
  run(`git config user.email "${GIT_USER_EMAIL}"`);
  run(`git add ${OUTPUT_DIR}/`);

  const commitMsg =
    `feat(daily-util): ${utility.title} [${utility.category}] — ${today}\n\n` +
    `${utility.description}\n\n` +
    `Difficulty: ${utility.difficulty}\n` +
    `Generated by: Mistral AI (mistral-small-latest)\n` +
    `Auto-committed by: AutoCommit Bot`;

  run(`git commit -m "${commitMsg.replace(/"/g, '\\"')}"`);
  run("git push");

  console.log("   ✅ Pushed successfully.\n");
}

// ── Main ──────────────────────────────────────────────────────────────────
async function main() {
  console.log("╔══════════════════════════════════════════╗");
  console.log("║   Mistral GitHub Auto-Commit Bot v1.0    ║");
  console.log("╚══════════════════════════════════════════╝");

  // Validate all required env vars are present
  const required = { MISTRAL_API_KEY, GITHUB_TOKEN, REPO_OWNER, REPO_NAME };
  const missing  = Object.entries(required).filter(([, v]) => !v).map(([k]) => k);

  if (missing.length) {
    console.error(`\n❌ Missing env variables: ${missing.join(", ")}`);
    console.error("   Add them to your .env file or GitHub Actions secrets.\n");
    process.exit(1);
  }

  try {
    const alreadyDone = await hasCommitToday();

    if (alreadyDone) {
      console.log("\n✅ You already committed today. Nothing to do. Good work!\n");
      process.exit(0);
    }

    const utility = await generateWithMistral();
    saveFiles(utility);
    commitAndPush(utility);

    console.log(`🎉 Done! "${utility.title}" is now live on GitHub.\n`);

  } catch (err) {
    console.error("\n❌ Bot error:", err.message);
    process.exit(1);
  }
}

main();