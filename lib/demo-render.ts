export type DemoBlock = {
  id: string;
  type:
    | "hero"
    | "features"
    | "proof"
    | "cta"
    | "footer"
    | "stats"
    | "process"
    | "pricing"
    | "faq"
    | "gallery"
    | "html";
  eyebrow?: string;
  title: string;
  body: string;
  button?: string;
  buttonHref?: string;
  items?: string[];
  meta?: string;
  html?: string;
};

export type DemoBrand = {
  primary: string;
  accent: string;
  background: string;
  text?: string;
  muted?: string;
  font: string;
  logo?: string;
  radius?: string;
  style?: "minimal" | "editorial" | "bold" | "soft";
};

const escapeHtml = (value: string) =>
  value.replace(
    /[&<>'"]/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[
        char
      ] ?? char,
  );

const cleanUrl = (value?: string) => {
  if (!value) return "";
  if (
    value.startsWith("#") ||
    value.startsWith("/") ||
    value.startsWith("mailto:")
  )
    return value;
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol) ? value : "";
  } catch {
    return "";
  }
};

const listItems = (items?: string[]) =>
  (items ?? [])
    .filter(Boolean)
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join("");

const blockButton = (block: DemoBlock) => {
  if (!block.button) return "";
  const href = cleanUrl(block.buttonHref) || "#contact";
  return `<a class="button" href="${escapeHtml(href)}">${escapeHtml(block.button)}</a>`;
};

const blockInner = (block: DemoBlock) => {
  const eyebrow = block.eyebrow || block.type;
  const intro = `<p class="eyebrow">${escapeHtml(eyebrow)}</p><h2>${escapeHtml(block.title)}</h2><p class="lede">${escapeHtml(block.body)}</p>`;

  if (["features", "proof", "process", "faq", "gallery"].includes(block.type)) {
    return `${intro}<ul class="cards">${listItems(block.items)}</ul>${blockButton(block)}`;
  }

  if (block.type === "stats") {
    return `${intro}<ul class="stats">${listItems(block.items)}</ul>${blockButton(block)}`;
  }

  if (block.type === "pricing") {
    return `${intro}<div class="price">${escapeHtml(block.meta || "Custom scope")}</div><ul class="cards">${listItems(block.items)}</ul>${blockButton(block)}`;
  }

  return `${intro}${blockButton(block)}`;
};

export function demoHtml(title: string, brand: DemoBrand, blocks: DemoBlock[]) {
  const importedHtml = blocks.find((block) => block.type === "html")?.html;
  if (importedHtml) return importedHtml;

  const text = brand.text ?? "#171717";
  const muted = brand.muted ?? "#6b6b6b";
  const radius = brand.radius ?? "18px";
  const style = brand.style ?? "minimal";
  const sections = blocks
    .map(
      (block) =>
        `<section class="section ${block.type}"><div class="wrap">${blockInner(block)}</div></section>`,
    )
    .join("");

  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${escapeHtml(title)}</title><style>*{box-sizing:border-box}body{margin:0;background:${escapeHtml(brand.background)};color:${escapeHtml(text)};font-family:${escapeHtml(brand.font)},Arial,sans-serif}.wrap{width:min(1120px,calc(100% - 40px));margin:auto}.section{padding:84px 0;border-bottom:1px solid color-mix(in srgb,${escapeHtml(text)} 12%,transparent)}.hero{padding:120px 0;background:${escapeHtml(brand.primary)};color:white}.cta{background:${escapeHtml(brand.accent)};color:white}.footer{padding:42px 0}.eyebrow{text-transform:uppercase;letter-spacing:.16em;font-size:.72rem;font-weight:700;opacity:.72}.lede{font-size:1.08rem;line-height:1.75;max-width:730px;color:${escapeHtml(muted)}}.hero .lede,.cta .lede{color:inherit;opacity:.82}h2{font-size:clamp(2.1rem,6vw,4.75rem);line-height:.98;margin:.24em 0}.button{display:inline-block;margin-top:24px;padding:14px 20px;background:white;color:#111;text-decoration:none;border-radius:${escapeHtml(radius)};font-weight:700}.cards,.stats{display:grid;gap:14px;margin:30px 0 0;padding:0;list-style:none}.cards{grid-template-columns:repeat(auto-fit,minmax(220px,1fr))}.cards li,.stats li{padding:20px;border:1px solid color-mix(in srgb,${escapeHtml(text)} 14%,transparent);border-radius:${escapeHtml(radius)};background:rgba(255,255,255,.48);line-height:1.55}.stats{grid-template-columns:repeat(auto-fit,minmax(150px,1fr))}.stats li{font-size:1.7rem;font-weight:800}.price{display:inline-block;margin-top:20px;border-radius:${escapeHtml(radius)};background:${escapeHtml(brand.primary)};color:white;padding:16px 20px;font-weight:800}.bold h2{letter-spacing:-.06em}.editorial .section:nth-child(even){background:rgba(255,255,255,.42)}.soft .section{border:0}.soft .cards li,.soft .stats li{box-shadow:0 20px 60px rgba(0,0,0,.08);border:0}@media(max-width:600px){.hero,.section{padding:64px 0}h2{font-size:2.35rem}}</style></head><body class="${escapeHtml(style)}">${sections}</body></html>`;
}
