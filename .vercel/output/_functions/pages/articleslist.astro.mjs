import { e as createComponent, k as renderHead, g as addAttribute, r as renderTemplate, l as renderScript, h as createAstro } from '../chunks/astro/server_CVC9IwxY.mjs';
import { createClient } from '@supabase/supabase-js';
/* empty css                                        */
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$Articleslist = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Articleslist;
  const supabase = createClient(
    "https://nyiturqeotdxucfdurzu.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55aXR1cnFlb3RkeHVjZmR1cnp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxMzI0ODgsImV4cCI6MjA4NzcwODQ4OH0.CvYju6UTaCGD_Zd-8FVTcB-yW9YVG_jQtwkd0l7mIV0"
  );
  const { data: articles, error } = await supabase.from("articles").select("slug, headline").order("headline", { ascending: true });
  if (error) {
    console.error(error);
  }
  const searchQuery = Astro2.url.searchParams.get("q") || "";
  return renderTemplate`<html lang="en" data-astro-cid-uff3lf5q> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Browse Counties — Retirement Shield</title><link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">${renderHead()}</head> <body data-astro-cid-uff3lf5q> <!-- NEWSLETTER MODAL --> <div id="newsletterModal" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.6); z-index:9999; align-items:center; justify-content:center; padding:20px; overflow:auto;" data-astro-cid-uff3lf5q> <div style="background:#1A2E4A; width:min(95%,700px); padding:32px; border-radius:12px; position:relative; box-shadow:0 20px 60px rgba(0,0,0,0.4);" data-astro-cid-uff3lf5q> <button onclick="closeNewsletterModal()" style="position:absolute; top:14px; right:16px; background:none; border:none; color:white; font-size:22px; cursor:pointer;" data-astro-cid-uff3lf5q>
×
</button> <div style="margin-bottom:20px;" data-astro-cid-uff3lf5q> <div style="font-size:11px; letter-spacing:1px; text-transform:uppercase; color:var(--gold); font-weight:600; margin-bottom:6px;" data-astro-cid-uff3lf5q>Free Newsletter</div> <h2 style="font-family:'Playfair Display',serif; color:white; font-size:22px; margin:0;" data-astro-cid-uff3lf5q>Join the Retirement Intelligence Report</h2> </div> <iframe src="https://api.leadconnectorhq.com/widget/form/1fEKSAEG00dBmEd1y8gn" style="width:100%; height:350px; border:none; border-radius:8px; background:transparent;" data-astro-cid-uff3lf5q>
      </iframe> </div> </div> <!-- NAV --> <nav data-astro-cid-uff3lf5q> <a href="/" class="nav-logo" data-astro-cid-uff3lf5q>Retirement<span data-astro-cid-uff3lf5q>Shield</span></a> <ul class="nav-links" data-astro-cid-uff3lf5q> <li data-astro-cid-uff3lf5q><a href="/lifeexpectancycalculator" data-astro-cid-uff3lf5q>Life Expectancy</a></li> <li data-astro-cid-uff3lf5q><a href="/quiz" data-astro-cid-uff3lf5q>Estate Planning</a></li> <!-- <li><a href="#">Calculators</a></li> --> <li data-astro-cid-uff3lf5q><a href="#" onclick="openNewsletterModal(event)" data-astro-cid-uff3lf5q>Newsletter</a></li> <li data-astro-cid-uff3lf5q><a href="/quiz" class="nav-cta" data-astro-cid-uff3lf5q>Free Assessment</a></li> </ul> </nav> <div class="header" data-astro-cid-uff3lf5q> <h1 id="pageTitle" data-astro-cid-uff3lf5q>Browse Retirement Intelligence Articles</h1> <p id="pageDescription" data-astro-cid-uff3lf5q>
Explore in-depth retirement, estate planning, probate, and income strategy articles. Use the search below to quickly find specific topics, strategies, or state-based insights.
</p> </div> <div class="container" data-astro-cid-uff3lf5q> <div class="section-title" data-astro-cid-uff3lf5q>Browse Articles</div> <input type="text" id="articleSearch"${addAttribute(searchQuery, "value")} placeholder="Search articles..." style="
      width:100%;
      padding:14px 16px;
      margin-bottom:24px;
      border:1px solid var(--border);
      font-size:14px;
      font-family:'DM Sans',sans-serif;
    " data-astro-cid-uff3lf5q> <div class="states-grid" data-astro-cid-uff3lf5q> ${articles && articles.map((article) => renderTemplate`<a class="state-btn"${addAttribute(`/articles/${article.slug}`, "href")} data-astro-cid-uff3lf5q> ${article.headline} </a>`)} </div> </div> ${renderScript($$result, "/Users/benceabel/Desktop/retirement-shield-live/src/pages/articleslist.astro?astro&type=script&index=0&lang.ts")} </body> </html>`;
}, "/Users/benceabel/Desktop/retirement-shield-live/src/pages/articleslist.astro", void 0);
const $$file = "/Users/benceabel/Desktop/retirement-shield-live/src/pages/articleslist.astro";
const $$url = "/articleslist";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Articleslist,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
