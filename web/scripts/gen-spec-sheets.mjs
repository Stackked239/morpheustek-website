#!/usr/bin/env node
/**
 * Renders branded two-page spec sheets from catalog.ts, in the MorpheusTEK
 * brand system (navy / Signal Yellow / scan line, Roboto Condensed + Mono).
 *
 * Layout follows the MRDVS S10 sheet:
 *   p1  yellow bar · lockup header · navy hero · product shot + why-bullets
 *       · 4 stat cards · application scenarios · navy contact footer
 *   p2  model + SPECIFICATIONS · two-column spec table · notes · footer
 *
 * Every value on the page comes from catalog.ts. Nothing is invented — the
 * page grows or shrinks with the data that actually exists for a product.
 *
 * STATUS: draft tooling, not wired into package.json yet. Requires playwright,
 * which is NOT currently a dependency of this repo:
 *   pnpm add -Dw playwright
 * It also reads the Roboto woff2 files out of .next/static/media, so run
 * `pnpm build` at least once first.
 *
 * Known gap: catalog.ts carries 3-16 spec rows per product where the MRDVS
 * reference sheets carry ~30, so page 2 is sparse for most OLEI SKUs. Fill
 * `specs` from the manufacturer datasheets before treating output as final.
 *
 * Usage (from web/):
 *   node scripts/gen-spec-sheets.mjs <slug> [<slug> ...]
 *   node scripts/gen-spec-sheets.mjs --brand OLEI
 *   node scripts/gen-spec-sheets.mjs --all
 *
 * Output: public/spec-sheets/<slug>.pdf  (+ --outdir to write elsewhere)
 */
let chromium;
try { ({ chromium } = await import("playwright")); }
catch { console.error("This script needs playwright: pnpm add -Dw playwright"); process.exit(1); }
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const WEB = resolve(__dirname, "..");

/* ---------- brand tokens (MorpheusTEK Brand System, 2026) ---------- */
const C = {
  navy: "#0F326C", navyDeep: "#0A2350", night: "#06163A",
  yellow: "#FFCC00", scan: "#007BBB", cyan: "#31B4E7",
  white: "#FFFFFF", paper: "#F4F6FA", mist: "#E9EDF3",
  hairline: "#D3DAE4", slate: "#4A5A78", fog: "#8290A8",
};

const CONTACT = "MORPHEUSTEK.COM · SALES@MORPHEUSTEK.COM";
const CONTACT2 = "(302) 789-0421 · HUNTERSVILLE, NORTH CAROLINA";

/* ---------- assets: real logo file + the build's own fonts ---------- */
const b64 = (p) => readFileSync(p).toString("base64");
const dataUri = (p, mime) => `data:${mime};base64,${b64(p)}`;

function fontFaces() {
  // next/font writes the Roboto families into .next/static/media. Embedding the
  // latin subsets keeps the PDF self-contained and identical to the website.
  const media = join(WEB, ".next/static/media");
  const pick = (name) => {
    const css = execFileSync("bash", ["-c",
      `grep -ho '@font-face{[^}]*}' ${WEB}/.next/static/chunks/*.css | grep 'unicode-range:U+??,' | grep -F 'font-family:${name};' | head -1`,
    ]).toString();
    const m = css.match(/media\/([^)]+\.woff2)/);
    if (!m) throw new Error(`Font "${name}" not found — run \`pnpm build\` first.`);
    return join(media, m[1]);
  };
  return `
@font-face{font-family:"RC";src:url(${dataUri(pick("Roboto Condensed"), "font/woff2")})format("woff2");font-weight:100 900;font-style:normal}
@font-face{font-family:"RM";src:url(${dataUri(pick("Roboto Mono"), "font/woff2")})format("woff2");font-weight:100 900;font-style:normal}`;
}

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/* ---------- page chrome ---------- */
const logoNavy = dataUri(join(WEB, "public/brand/morpheustek-logo.png"), "image/png");

const footer = () => `
<div class="foot">
  <div class="tag">GIVING <span>SIGHT</span> TO ROBOTICS</div>
  <div class="contact">${CONTACT}<br>${CONTACT2}</div>
</div>`;

/**
 * Headline is split into three lines the way the reference does it:
 * a descriptor, the model (in Signal Yellow), then the product type.
 * Descriptor + type come from the category, so they stay factual.
 */
function headlineParts(p, category) {
  const type = (category?.label ?? "SENSOR").toUpperCase();
  const first = p.tagline.split(/[—–-]/)[0].trim().split(/\s+/).slice(0, 2).join(" ");
  return { descriptor: first.toUpperCase(), model: `${p.brand} ${p.model}`.toUpperCase(), type };
}

function page1(p, category, imgUri) {
  const { descriptor, model, type } = headlineParts(p, category);
  const stats = p.keySpecs.slice(0, 4);
  // Why-bullets are the product's own spec rows, stated as fact: bold label,
  // then the value. No claim appears here that is not already in catalog.ts.
  const bullets = p.specs.map((s) => `<li><b>${esc(s.label)}</b> — ${esc(s.value)}</li>`).join("");
  const scen = p.bestFor.map((b) => {
    const [head, ...rest] = b.split(/\s*[—–(]\s*/);
    const desc = rest.join(" ").replace(/\)$/, "").trim();
    return `<div class="scen"><div class="sh">${esc(head)}</div>${desc ? `<div class="sd">${esc(desc)}</div>` : ""}</div>`;
  }).join("");
  const certs = (p.certifications ?? []).map((c) => `<span class="cert">${esc(c)}</span>`).join("");

  return `
<section class="page">
  <div class="bar"></div>
  <header>
    <img class="lockup" src="${logoNavy}" alt="MorpheusTEK">
    <div class="dist">EXCLUSIVE NORTH AMERICAN DISTRIBUTOR<br>FOR ${esc(p.brand)} · ${esc(type)}</div>
  </header>
  <div class="rule"></div>

  <div class="hero">
    <div class="eyebrow-c">${esc(category?.keyword?.toUpperCase() ?? type)}</div>
    <h1>${esc(descriptor)}<br><span class="y">${esc(model)}</span><br>${esc(type)}</h1>
    <p class="lead">${esc(p.summary)}</p>
  </div>

  <div class="cols">
    <div class="shot">${imgUri ? `<img src="${imgUri}" alt="${esc(p.name)}">` : `<div class="noshot">PRODUCT IMAGE</div>`}</div>
    <div>
      <h2><i class="sq y"></i>WHY THIS ${esc(type.split(" ").pop())}</h2>
      <ul class="why">${bullets}</ul>
      ${certs ? `<div class="certs">${certs}</div>` : ""}
    </div>
  </div>

  <div class="stats">${stats.map((s) => `
    <div class="stat"><div class="sv${s.value.length > 13 ? " long" : ""}">${esc(s.value)}</div><div class="sl">${esc(s.label)}</div></div>`).join("")}
  </div>

  <h2 class="ascn"><i class="sq b"></i>APPLICATION SCENARIOS</h2>
  <div class="scens">${scen}</div>

  ${footer()}
</section>`;
}

function page2(p) {
  const rows = p.specs;
  const half = Math.ceil(rows.length / 2);
  const table = (list) => list.length ? `
    <table>
      <thead><tr><th>PARAMETER</th><th>TECHNICAL DATA</th></tr></thead>
      <tbody>${list.map((s) => `<tr><td class="pl">${esc(s.label)}</td><td class="pv">${esc(s.value)}</td></tr>`).join("")}</tbody>
    </table>` : "";

  const price = p.price !== undefined ? `$${p.price.toLocaleString("en-US")}` : "Contact for pricing";

  return `
<section class="page">
  <div class="bar"></div>
  <header class="h2">
    <h3><b>${esc(p.brand)} ${esc(p.model)}</b> <span>— SPECIFICATIONS</span></h3>
    <img class="lockup sm" src="${logoNavy}" alt="MorpheusTEK">
  </header>
  <div class="rule"></div>

  <div class="tables">${table(rows.slice(0, half))}${table(rows.slice(half))}</div>

  <div class="notes">
    <p><b>Availability.</b> ${esc(p.availability === "in-stock" ? "In stock" : p.availability === "pre-order" ? "Pre-order" : "Contact for availability")}${p.availabilityNote ? ` — ${esc(p.availabilityNote)}` : ""}. List price ${esc(price)}.${p.trial ? " Includes a 90-day risk-free trial." : ""}</p>
    ${p.certifications?.length ? `<p><b>Certification.</b> ${esc(p.certifications.join(" · "))}. Confirm the certificate revision with MorpheusTEK before design-in.</p>` : ""}
    <p><b>Best for.</b> ${esc(p.bestFor.join(" · "))}.</p>
    <p class="fine">${esc(p.brand)} and the ${esc(p.brand)} logo are trademarks of their respective owner. MorpheusTEK is the exclusive North American distributor for ${esc(p.brand)} LiDAR. Specifications are subject to change without notice; confirm current values with MorpheusTEK before design-in. Doc. MTK-${esc(p.model)}-${new Date().toISOString().slice(0, 7)} · Source: MorpheusTEK product catalog.</p>
  </div>

  ${footer()}
</section>`;
}

const CSS = (fonts) => `
${fonts}
@page{size:letter;margin:0}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:"RC","Arial Narrow",Arial,sans-serif;color:${C.navy};-webkit-print-color-adjust:exact;print-color-adjust:exact}
.page{width:8.5in;height:11in;position:relative;padding:0 .55in;display:flex;flex-direction:column;overflow:hidden;page-break-after:always}
.page:last-child{page-break-after:auto}
.bar{position:absolute;inset:0 0 auto 0;height:7px;background:${C.yellow}}
header{display:flex;align-items:flex-start;justify-content:space-between;padding-top:.34in}
.lockup{width:150px;height:auto;display:block}
.lockup.sm{width:118px}
.dist{font-family:"RM",Consolas,monospace;font-size:6.6pt;font-weight:600;letter-spacing:.12em;color:${C.slate};text-align:right;line-height:1.8;padding-top:6px}
.rule{height:3px;background:${C.yellow};margin:.1in 0 .16in}
.h2{align-items:center}
h3{font-size:19pt;font-weight:400;color:${C.slate};letter-spacing:-.01em}
h3 b{font-weight:800;color:${C.navyDeep}}

.hero{background:${C.night};color:#fff;border-radius:2px;padding:.32in .34in .34in;position:relative;overflow:hidden}
.hero::after{content:"";position:absolute;right:-1.5in;top:-1.9in;width:4.1in;height:4.1in;border:1.5px solid rgba(49,180,231,.30);border-radius:50%}
.eyebrow-c{font-family:"RM",Consolas,monospace;font-size:7pt;font-weight:600;letter-spacing:.16em;color:${C.cyan};text-transform:uppercase;margin-bottom:10px}
h1{font-size:31pt;font-weight:800;line-height:1.03;letter-spacing:-.015em;text-transform:uppercase}
h1 .y{color:${C.yellow}}
.lead{margin-top:12px;max-width:5.6in;font-size:9.6pt;line-height:1.55;color:#D8DEE9}

.cols{display:grid;grid-template-columns:2.55in 1fr;gap:.26in;margin-top:.26in}
.shot{border:1px solid ${C.hairline};border-radius:10px;display:flex;align-items:center;justify-content:center;padding:14px;min-height:2.5in}
.shot img{max-width:100%;max-height:2.45in;object-fit:contain}
.noshot{font-family:"RM",monospace;font-size:7pt;letter-spacing:.12em;color:${C.fog}}
h2{display:flex;align-items:center;gap:9px;font-size:12.5pt;font-weight:800;color:${C.navyDeep};text-transform:uppercase;margin-bottom:11px}
.sq{width:11px;height:11px;display:inline-block;flex:none}
.sq.y{background:${C.yellow}}
.sq.b{background:${C.scan}}
.why{list-style:none}
.why li{position:relative;padding-left:15px;margin-bottom:7.5px;font-size:8.9pt;line-height:1.42;color:${C.navy}}
.why li::before{content:"";position:absolute;left:0;top:5px;width:6px;height:6px;border-radius:50%;background:${C.scan}}
.why b{font-weight:700;color:${C.navyDeep}}
.certs{margin-top:11px;display:flex;flex-wrap:wrap;gap:6px}
.cert{font-family:"RM",monospace;font-size:6.6pt;font-weight:600;letter-spacing:.1em;background:${C.navyDeep};color:#fff;padding:4px 8px;border-radius:99px}

.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:.13in;margin-top:.26in}
.stat{background:${C.navyDeep};color:#fff;border-radius:3px;padding:13px 13px 12px;min-height:.86in;display:flex;flex-direction:column;justify-content:space-between}
.sv{font-size:15pt;font-weight:800;letter-spacing:-.01em;line-height:1.1}
.sv.long{font-size:11.5pt;line-height:1.15}
.sl{font-family:"RM",monospace;font-size:6.2pt;font-weight:600;letter-spacing:.13em;color:#9FB0CC;margin-top:6px;text-transform:uppercase}

.ascn{margin-top:.26in}
.scens{display:grid;grid-template-columns:repeat(auto-fit,minmax(0,1fr));gap:.13in}
.scen{background:${C.mist};border-radius:10px;padding:13px 12px;text-align:center;display:flex;flex-direction:column;justify-content:center;min-height:.62in}
.sh{font-size:8.4pt;font-weight:700;color:${C.navyDeep};text-transform:uppercase;line-height:1.25}
.sd{font-size:7.8pt;color:${C.slate};margin-top:5px;line-height:1.4}

.tables{display:grid;grid-template-columns:1fr 1fr;gap:.22in;align-items:start}
table{width:100%;border-collapse:collapse}
th{background:${C.navyDeep};color:#fff;font-family:"RM",monospace;font-size:6.4pt;font-weight:600;letter-spacing:.12em;text-align:left;padding:8px 10px}
td{font-size:8.4pt;padding:7px 10px;border-bottom:1px solid ${C.hairline};vertical-align:top}
tbody tr:nth-child(odd) td{background:${C.paper}}
.pl{color:${C.slate};width:46%}
.pv{font-weight:700;color:${C.navyDeep}}

.notes{margin-top:.26in;font-size:7.4pt;line-height:1.5;color:${C.slate}}
.notes p{margin-bottom:5px}
.notes b{color:${C.navyDeep}}
.notes .fine{color:${C.fog};margin-top:9px}

.foot{margin-top:auto;margin-left:-.55in;margin-right:-.55in;background:${C.navyDeep};color:#fff;padding:15px .55in;display:flex;align-items:center;justify-content:space-between}
.tag{font-size:11.5pt;font-weight:800;text-transform:uppercase;letter-spacing:-.01em}
.tag span{color:${C.yellow}}
.contact{font-family:"RM",monospace;font-size:6.4pt;font-weight:600;letter-spacing:.11em;text-align:right;line-height:1.9;color:#C9D3E4}
`;

/* ---------- driver ---------- */
async function main() {
  const args = process.argv.slice(2);
  const outIdx = args.indexOf("--outdir");
  const outDir = outIdx !== -1 ? args[outIdx + 1] : join(WEB, "public/spec-sheets");
  const clean = args.filter((a, i) => !a.startsWith("--") && i !== outIdx + 1);

  const { products, categories, productImages } = await import("../src/lib/catalog.ts");

  let picked;
  if (args.includes("--all")) picked = products;
  else if (args.includes("--brand")) {
    const b = args[args.indexOf("--brand") + 1];
    picked = products.filter((p) => p.brand.toLowerCase() === b.toLowerCase());
  } else picked = products.filter((p) => clean.includes(p.slug));

  if (picked.length === 0) {
    console.error("Nothing selected. Pass slugs, --brand <OLEI|MRDVS|Sintrones>, or --all.");
    process.exit(1);
  }

  mkdirSync(outDir, { recursive: true });
  const fonts = fontFaces();
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM ?? "/opt/pw-browsers/chromium" });
  const page = await browser.newPage();

  for (const p of picked) {
    const cat = categories.find((c) => c.slug === p.category);
    const imgRel = productImages[p.slug];
    const imgPath = imgRel ? join(WEB, "public", imgRel.replace(/^\//, "")) : null;
    const imgUri = imgPath && existsSync(imgPath) ? dataUri(imgPath, "image/png") : null;

    const html = `<!doctype html><meta charset="utf-8"><style>${CSS(fonts)}</style>${page1(p, cat, imgUri)}${page2(p)}`;
    await page.setContent(html, { waitUntil: "load" });
    await page.evaluate(() => document.fonts.ready);

    const out = join(outDir, `${p.slug}.pdf`);
    await page.pdf({ path: out, format: "Letter", printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 } });
    console.log(`• ${p.slug.padEnd(36)} ${p.specs.length} spec rows${imgUri ? "" : "  (no product image)"}`);
  }

  await browser.close();
  console.log(`\n${picked.length} sheet(s) → ${outDir}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
