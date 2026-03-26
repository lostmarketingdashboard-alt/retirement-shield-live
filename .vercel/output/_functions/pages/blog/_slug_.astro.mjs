import { e as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate, h as createAstro } from '../../chunks/astro/server_CVC9IwxY.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro();
const $$slug = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$slug;
  const { slug } = Astro2.params;
  const res = await fetch(
    `${"retirement-shield-strapi-production.up.railway.app"}/api/articles?filters[slug][$eq]=${slug}&populate=*`
  );
  const json = await res.json();
  const article = json.data[0]?.attributes;
  return renderTemplate`${maybeRenderHead()}<h1>${article.title}</h1> <p>${article.excerpt}</p> <div>${unescapeHTML(article.content)}</div>`;
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
