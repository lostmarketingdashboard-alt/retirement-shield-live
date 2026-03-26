import { e as createComponent, g as addAttribute, r as renderTemplate, k as renderHead, h as createAstro } from '../../chunks/astro/server_B-8Lc69N.mjs';
import 'piccolore';
import 'clsx';
import { s as supabase } from '../../chunks/supabase_DUGQ5BJP.mjs';
/* empty css                                     */
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro();
const prerender = false;
async function getStaticPaths() {
  const { data } = await supabase.from("articles").select("slug");
  if (!data) return [];
  return data.map((row) => ({
    params: { slug: row.slug }
  }));
}
const $$slug = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$slug;
  const { slug } = Astro2.params;
  const { data: article } = await supabase.from("articles").select("*").eq("slug", slug).single();
  if (!article) {
    throw new Error(`Article not found: ${slug}`);
  }
  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };
  const tags = article.tags ? article.tags.split(",").map((t) => t.trim()) : [];
  return renderTemplate`<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${article.meta_title || article.headline}</title><meta name="description"${addAttribute(article.meta_description || "", "content")}>${article.og_image_url && renderTemplate`<meta property="og:image"${addAttribute(article.og_image_url, "content")}>`}<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">${renderHead()}</head> <nav data-astro-cid-xw3clhsd> <a href="/" class="nav-logo" data-astro-cid-xw3clhsd>Retirement<span data-astro-cid-xw3clhsd>Shield</span></a> <ul class="nav-links" data-astro-cid-xw3clhsd> <li data-astro-cid-xw3clhsd><a href="/lifeexpectancycalculator" data-astro-cid-xw3clhsd>Life Expectancy</a></li> <li data-astro-cid-xw3clhsd><a href="/quiz" data-astro-cid-xw3clhsd>Estate Planning</a></li> <!-- <li><a href="#">Calculators</a></li> --> <li data-astro-cid-xw3clhsd><a href="#" onclick="openNewsletterModal(event)" data-astro-cid-xw3clhsd>Newsletter</a></li> <li data-astro-cid-xw3clhsd><a href="/quiz" class="nav-cta" data-astro-cid-xw3clhsd>Free Assessment</a></li> </ul> </nav> <div class="container" data-astro-cid-xw3clhsd> <div class="eyebrow" data-astro-cid-xw3clhsd>${article.category} · ${article.pillar}</div> <h1 data-astro-cid-xw3clhsd>${article.headline}</h1> ${article.subheadline && renderTemplate`<div class="subheadline" data-astro-cid-xw3clhsd>${article.subheadline}</div>`} <div class="meta" data-astro-cid-xw3clhsd> ${formatDate(article.published_at) && renderTemplate`<span data-astro-cid-xw3clhsd>Published ${formatDate(article.published_at)}</span>`} ${article.author_name && renderTemplate`<span data-astro-cid-xw3clhsd>By ${article.author_name}</span>`} ${article.reviewer_name && renderTemplate`<span data-astro-cid-xw3clhsd>Reviewed by ${article.reviewer_name}</span>`} ${article.word_count && renderTemplate`<span data-astro-cid-xw3clhsd>${article.word_count} words</span>`} </div> <div class="section" data-astro-cid-xw3clhsd> ${article.lede && renderTemplate`<p data-astro-cid-xw3clhsd><strong data-astro-cid-xw3clhsd>${article.lede}</strong></p>`} ${article.section_1_heading && renderTemplate`<h2 data-astro-cid-xw3clhsd>${article.section_1_heading}</h2>`} ${article.section_1_body && renderTemplate`<p data-astro-cid-xw3clhsd>${article.section_1_body}</p>`} ${article.section_2_heading && renderTemplate`<h2 data-astro-cid-xw3clhsd>${article.section_2_heading}</h2>`} ${article.section_2_body && renderTemplate`<p data-astro-cid-xw3clhsd>${article.section_2_body}</p>`} ${article.section_3_heading && renderTemplate`<h2 data-astro-cid-xw3clhsd>${article.section_3_heading}</h2>`} ${article.section_3_body && renderTemplate`<p data-astro-cid-xw3clhsd>${article.section_3_body}</p>`} ${article.section_4_heading && renderTemplate`<h2 data-astro-cid-xw3clhsd>${article.section_4_heading}</h2>`} ${article.section_4_body && renderTemplate`<p data-astro-cid-xw3clhsd>${article.section_4_body}</p>`} </div> ${article.key_takeaways && renderTemplate`<div class="section key-takeaways" data-astro-cid-xw3clhsd> <h2 data-astro-cid-xw3clhsd>Key Takeaways</h2> <p data-astro-cid-xw3clhsd>${article.key_takeaways}</p> </div>`} ${article.sources && renderTemplate`<div class="section" data-astro-cid-xw3clhsd> <h2 data-astro-cid-xw3clhsd>Sources</h2> <p data-astro-cid-xw3clhsd>${article.sources}</p> </div>`} ${tags.length > 0 && renderTemplate`<div class="tags" data-astro-cid-xw3clhsd> ${tags.map((tag) => renderTemplate`<div class="tag" data-astro-cid-xw3clhsd>${tag}</div>`)} </div>`} </div> <footer data-astro-cid-xw3clhsd>
© ${(/* @__PURE__ */ new Date()).getFullYear()} Retirement Shield · Educational content only · Not legal or financial advice
</footer>`;
}, "/Users/benceabel/Desktop/retirement-shield-live/src/pages/articles/[slug].astro", void 0);

const $$file = "/Users/benceabel/Desktop/retirement-shield-live/src/pages/articles/[slug].astro";
const $$url = "/articles/[slug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$slug,
  file: $$file,
  getStaticPaths,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
