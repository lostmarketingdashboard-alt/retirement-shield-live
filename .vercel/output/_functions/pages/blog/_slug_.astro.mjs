import { e as createComponent, g as addAttribute, r as renderTemplate, k as renderHead, n as renderComponent, h as createAstro, u as unescapeHTML, o as Fragment } from '../../chunks/astro/server_B-8Lc69N.mjs';
import 'piccolore';
/* empty css                                     */
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro();
const $$slug = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$slug;
  const { slug } = Astro2.params;
  const url = `${"https://retirement-shield-strapi-production.up.railway.app"}/api/articles?filters[slug][$eq]=${slug}&populate=*`;
  let article = null;
  let fetchError = null;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Strapi error: ${res.status}`);
    }
    const json = await res.json();
    const items = Array.isArray(json?.data) ? json.data : [];
    article = items[0] ?? null;
  } catch (err) {
    console.error("Blog slug fetch failed:", err);
    fetchError = err;
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
  return renderTemplate`<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${article.meta_title || article.headline}</title><meta name="description"${addAttribute(article.meta_description || "", "content")}>${article.og_image_url && renderTemplate`<meta property="og:image"${addAttribute(article.og_image_url, "content")}>`}<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">${renderHead()}</head> <!-- NAV --> <nav data-astro-cid-4sn4zg3r> <a href="/" class="nav-logo" data-astro-cid-4sn4zg3r>Retirement<span data-astro-cid-4sn4zg3r>Shield</span></a> <ul class="nav-links" data-astro-cid-4sn4zg3r> <li data-astro-cid-4sn4zg3r><a href="/lifeexpectancycalculator" data-astro-cid-4sn4zg3r>Life Expectancy</a></li> <li data-astro-cid-4sn4zg3r><a href="/quiz" data-astro-cid-4sn4zg3r>Estate Planning</a></li> <!-- <li><a href="#">Calculators</a></li> --> <li data-astro-cid-4sn4zg3r><a href="#" onclick="openNewsletterModal(event)" data-astro-cid-4sn4zg3r>Newsletter</a></li> <li data-astro-cid-4sn4zg3r><a href="/quiz" class="nav-cta" data-astro-cid-4sn4zg3r>Free Assessment</a></li> </ul> </nav> <div class="container" data-astro-cid-4sn4zg3r> ${!article && renderTemplate`<div data-astro-cid-4sn4zg3r> <h1 data-astro-cid-4sn4zg3r>Article not found</h1> ${fetchError && renderTemplate`<p data-astro-cid-4sn4zg3r>Something went wrong loading this article.</p>`} </div>`} ${article && renderTemplate`${renderComponent($$result, "Fragment", Fragment, { "data-astro-cid-4sn4zg3r": true }, { "default": async ($$result2) => renderTemplate` <h1 data-astro-cid-4sn4zg3r>${article.title}</h1> ${article.cover && (article.cover.url || article.cover.data?.attributes?.url) && renderTemplate`<div class="cover" data-astro-cid-4sn4zg3r> <img${addAttribute(`${"https://retirement-shield-strapi-production.up.railway.app"}${article.cover.url || article.cover.data?.attributes?.url}`, "src")}${addAttribute(article.title, "alt")} data-astro-cid-4sn4zg3r> </div>`}<div class="meta" data-astro-cid-4sn4zg3r> ${formatDate(article.publishedAt) && renderTemplate`<span data-astro-cid-4sn4zg3r>Published ${formatDate(article.publishedAt)}</span>`} </div> <div class="section" data-astro-cid-4sn4zg3r> ${(article.excerpt || article.description) && renderTemplate`<div class="subheadline" data-astro-cid-4sn4zg3r> ${article.excerpt || article.description} </div>`} ${article.content && renderTemplate`<div data-astro-cid-4sn4zg3r>${unescapeHTML(article.content)}</div>`} </div> ` })}`} </div>`;
}, "/Users/benceabel/Desktop/retirement-shield-live/src/pages/blog/[slug].astro", void 0);
const $$file = "/Users/benceabel/Desktop/retirement-shield-live/src/pages/blog/[slug].astro";
const $$url = "/blog/[slug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$slug,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
