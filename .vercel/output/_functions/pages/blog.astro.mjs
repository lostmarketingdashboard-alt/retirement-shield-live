import { e as createComponent, k as renderHead, r as renderTemplate, g as addAttribute } from '../chunks/astro/server_B-8Lc69N.mjs';
import 'piccolore';
import 'clsx';
/* empty css                                 */
export { renderers } from '../renderers.mjs';

const prerender = false;
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  let articles = [];
  let base;
  try {
    const envUrl = "https://retirement-shield-strapi-production.up.railway.app";
    if (!envUrl) ; else {
      base = envUrl.startsWith("http") ? envUrl : `https://${envUrl}`;
    }
    if (!base) {
      throw new Error("Invalid Strapi base URL");
    }
    const res = await fetch(`${base}/api/articles?populate=*&pagination[pageSize]=100`);
    if (!res.ok) {
      console.error(`Strapi error: ${res.status}`);
      articles = [];
    } else {
      const json = await res.json();
      const items = Array.isArray(json?.data) ? json.data : [];
      articles = items.map(
        (item) => item?.attributes ? { id: item.id, ...item.attributes } : item
      );
    }
  } catch (err) {
    console.error("Blog fetch failed:", err);
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
  return renderTemplate`<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">${renderHead()}</head> <!-- NAV --> <nav data-astro-cid-5tznm7mj> <a href="/" class="nav-logo" data-astro-cid-5tznm7mj>Retirement<span data-astro-cid-5tznm7mj>Shield</span></a> <ul class="nav-links" data-astro-cid-5tznm7mj> <li data-astro-cid-5tznm7mj><a href="/lifeexpectancycalculator" data-astro-cid-5tznm7mj>Life Expectancy</a></li> <li data-astro-cid-5tznm7mj><a href="/quiz" data-astro-cid-5tznm7mj>Estate Planning</a></li> <!-- <li><a href="#">Calculators</a></li> --> <li data-astro-cid-5tznm7mj><a href="#" onclick="openNewsletterModal(event)" data-astro-cid-5tznm7mj>Newsletter</a></li> <li data-astro-cid-5tznm7mj><a href="/quiz" class="nav-cta" data-astro-cid-5tznm7mj>Free Assessment</a></li> </ul> </nav> <div class="container" data-astro-cid-5tznm7mj> <h1 data-astro-cid-5tznm7mj>Explore our latest insights on retirement, estate planning, and financial protection.</h1> <br data-astro-cid-5tznm7mj> ${articles.length === 0 && renderTemplate`<p data-astro-cid-5tznm7mj>No articles found</p>`} ${articles.filter((a) => a?.slug).map((a) => renderTemplate`<a${addAttribute(`/blog/${a.slug}`, "href")} class="card" data-astro-cid-5tznm7mj> ${(a.cover?.data?.attributes?.url || a.cover?.url) && renderTemplate`<img${addAttribute(`${base}${a.cover?.data?.attributes?.url || a.cover?.url}`, "src")} data-astro-cid-5tznm7mj>`} <div class="meta" data-astro-cid-5tznm7mj> ${formatDate(a.publishedAt || a.published_at)} </div> <div class="title" data-astro-cid-5tznm7mj> ${a.title || a.headline} </div> ${(a.excerpt || a.description) && renderTemplate`<div class="excerpt" data-astro-cid-5tznm7mj> ${a.excerpt || a.description} </div>`} </a>`)} </div>`;
}, "/Users/benceabel/Desktop/retirement-shield-live/src/pages/blog/index.astro", void 0);
const $$file = "/Users/benceabel/Desktop/retirement-shield-live/src/pages/blog/index.astro";
const $$url = "/blog";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
