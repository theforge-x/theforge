export type DemoBlock = {
  id: string;
  type: "hero" | "features" | "proof" | "cta" | "footer";
  title: string;
  body: string;
  button?: string;
};
export type DemoBrand = {
  primary: string;
  accent: string;
  background: string;
  font: string;
  logo?: string;
};
const escapeHtml = (value: string) =>
  value.replace(
    /[&<>'"]/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[
        char
      ] ?? char,
  );
export function demoHtml(title: string, brand: DemoBrand, blocks: DemoBlock[]) {
  const sections = blocks
    .map(
      (block) =>
        `<section class="${block.type}"><div class="wrap"><p class="eyebrow">${escapeHtml(block.type)}</p><h2>${escapeHtml(block.title)}</h2><p>${escapeHtml(block.body)}</p>${block.button ? `<a href="#contact">${escapeHtml(block.button)}</a>` : ""}</div></section>`,
    )
    .join("");
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${escapeHtml(title)}</title><style>*{box-sizing:border-box}body{margin:0;background:${escapeHtml(brand.background)};color:#141414;font-family:${escapeHtml(brand.font)},Arial,sans-serif}.wrap{width:min(1100px,calc(100% - 40px));margin:auto}.hero{padding:120px 0;background:${escapeHtml(brand.primary)};color:white}.features,.proof,.cta,.footer{padding:80px 0;border-bottom:1px solid #ddd}.cta{background:${escapeHtml(brand.accent)};color:white}h2{font-size:clamp(2rem,6vw,4.5rem);line-height:1;margin:.25em 0}p{font-size:1.05rem;line-height:1.7;max-width:720px}.eyebrow{text-transform:uppercase;letter-spacing:.15em;font-size:.7rem}a{display:inline-block;margin-top:20px;padding:14px 20px;background:white;color:#111;text-decoration:none;border-radius:6px}.footer{padding:40px 0}@media(max-width:600px){.hero,.features,.proof,.cta{padding:64px 0}}</style></head><body>${sections}</body></html>`;
}
