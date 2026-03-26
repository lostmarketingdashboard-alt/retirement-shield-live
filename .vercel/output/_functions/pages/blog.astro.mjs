import { e as createComponent, m as maybeRenderHead, g as addAttribute, r as renderTemplate } from '../chunks/astro/server_CVC9IwxY.mjs';
/* empty css                                 */
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const res = await fetch(`${"retirement-shield-strapi-production.up.railway.app"}/api/articles?populate=*`);
  const json = await res.json();
  const articles = json.data || [];
  return renderTemplate`${maybeRenderHead()}<h1 data-astro-cid-5tznm7mj>Blog</h1> <div class="grid" data-astro-cid-5tznm7mj> ${articles.map((a) => renderTemplate`<a${addAttribute(`/blog/${a.attributes.slug}`, "href")} class="card" data-astro-cid-5tznm7mj> <h2 data-astro-cid-5tznm7mj>${a.attributes.title}</h2> <p data-astro-cid-5tznm7mj>${a.attributes.excerpt}</p> </a>`)} </div> `;
}, "/Users/benceabel/Desktop/retirement-shield-live/src/pages/blog/index.astro", void 0);
const $$file = "/Users/benceabel/Desktop/retirement-shield-live/src/pages/blog/index.astro";
const $$url = "/blog";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
