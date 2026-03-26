import { e as createComponent, r as renderTemplate, n as defineScriptVars, g as addAttribute, k as renderHead } from '../chunks/astro/server_CVC9IwxY.mjs';
import { createClient } from '@supabase/supabase-js';
/* empty css                                */
export { renderers } from '../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$List = createComponent(async ($$result, $$props, $$slots) => {
  const supabase = createClient(
    "https://nyiturqeotdxucfdurzu.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55aXR1cnFlb3RkeHVjZmR1cnp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxMzI0ODgsImV4cCI6MjA4NzcwODQ4OH0.CvYju6UTaCGD_Zd-8FVTcB-yW9YVG_jQtwkd0l7mIV0"
  );
  let rows = [];
  let from = 0;
  const pageSize = 1e3;
  while (true) {
    const { data, error } = await supabase.from("counties").select("State, County").range(from, from + pageSize - 1);
    if (error) {
      console.error(error);
      break;
    }
    if (!data || data.length === 0) break;
    rows = rows.concat(data);
    if (data.length < pageSize) break;
    from += pageSize;
  }
  const stateMap = {};
  rows?.forEach((r) => {
    const state = r.State;
    const county = r.County?.replace(" County", "");
    if (!stateMap[state]) stateMap[state] = /* @__PURE__ */ new Set();
    if (county) stateMap[state].add(county);
  });
  Object.keys(stateMap).forEach((state) => {
    stateMap[state] = Array.from(stateMap[state]);
  });
  const states = [...new Set(rows?.map((r) => r.State))].filter(Boolean).sort();
  return renderTemplate(_a || (_a = __template(['<html lang="en" data-astro-cid-d4gzbk66> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Browse Counties — Retirement Shield</title><link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">', `</head> <body data-astro-cid-d4gzbk66> <!-- NEWSLETTER MODAL --> <div id="newsletterModal" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.6); z-index:9999; align-items:center; justify-content:center; padding:20px; overflow:auto;" data-astro-cid-d4gzbk66> <div style="background:#1A2E4A; width:min(95%,700px); padding:32px; border-radius:12px; position:relative; box-shadow:0 20px 60px rgba(0,0,0,0.4);" data-astro-cid-d4gzbk66> <button onclick="closeNewsletterModal()" style="position:absolute; top:14px; right:16px; background:none; border:none; color:white; font-size:22px; cursor:pointer;" data-astro-cid-d4gzbk66>
×
</button> <div style="margin-bottom:20px;" data-astro-cid-d4gzbk66> <div style="font-size:11px; letter-spacing:1px; text-transform:uppercase; color:var(--gold); font-weight:600; margin-bottom:6px;" data-astro-cid-d4gzbk66>Free Newsletter</div> <h2 style="font-family:'Playfair Display',serif; color:white; font-size:22px; margin:0;" data-astro-cid-d4gzbk66>Join the Retirement Intelligence Report</h2> </div> <iframe src="https://api.leadconnectorhq.com/widget/form/1fEKSAEG00dBmEd1y8gn" style="width:100%; height:350px; border:none; border-radius:8px; background:transparent;" data-astro-cid-d4gzbk66>
      </iframe> </div> </div> <!-- NAV --> <nav data-astro-cid-d4gzbk66> <a href="/" class="nav-logo" data-astro-cid-d4gzbk66>Retirement<span data-astro-cid-d4gzbk66>Shield</span></a> <ul class="nav-links" data-astro-cid-d4gzbk66> <li data-astro-cid-d4gzbk66><a href="/lifeexpectancycalculator" data-astro-cid-d4gzbk66>Life Expectancy</a></li> <li data-astro-cid-d4gzbk66><a href="/quiz" data-astro-cid-d4gzbk66>Estate Planning</a></li> <!-- <li><a href="#">Calculators</a></li> --> <li data-astro-cid-d4gzbk66><a href="#" onclick="openNewsletterModal(event)" data-astro-cid-d4gzbk66>Newsletter</a></li> <li data-astro-cid-d4gzbk66><a href="/quiz" class="nav-cta" data-astro-cid-d4gzbk66>Free Assessment</a></li> </ul> </nav> <div class="header" data-astro-cid-d4gzbk66> <h1 data-astro-cid-d4gzbk66>Browse Retirement Data by County</h1> <p data-astro-cid-d4gzbk66>Select your state to explore life expectancy insights, Social Security strategy guidance, and retirement planning exposure by county.</p> </div> <div class="container" data-astro-cid-d4gzbk66> <div class="section-title" data-astro-cid-d4gzbk66>Select a State</div> <div class="states-grid" data-astro-cid-d4gzbk66> `, ' </div> <div id="countiesSection" data-astro-cid-d4gzbk66> <div class="section-title" id="selectedStateTitle" data-astro-cid-d4gzbk66></div> <div class="counties-grid" id="countiesGrid" data-astro-cid-d4gzbk66></div> </div> </div> <script>(function(){', "\n\n window.openNewsletterModal = function(e) {\n      if (e) e.preventDefault();\n      const modal = document.getElementById('newsletterModal');\n      if (modal) modal.style.display = 'flex';\n    }\n\n    window.closeNewsletterModal = function() {\n      const modal = document.getElementById('newsletterModal');\n      if (modal) modal.style.display = 'none';\n    }\n\n     // Close on background click\n    document.addEventListener('click', function(e){\n      const newsletter = document.getElementById('newsletterModal');\n      const contact = document.getElementById('contactModal');\n\n      if(newsletter && e.target === newsletter){\n        window.closeNewsletterModal();\n      }\n\n      if(contact && e.target === contact){\n        window.closeContactModal();\n      }\n    });\n\n\nconst stateData = stateMap\n\nfunction slugify(str){\n  return str.toLowerCase().replace(/\\s+/g,'-')\n}\n\nwindow.showCounties = function(state){\n  const counties = stateData[state] || []\n\n  const section = document.getElementById('countiesSection')\n  section.style.display = 'block'\n  document.getElementById('selectedStateTitle').innerText = state + ' Counties'\n\n  // Smooth scroll to counties section\n  section.scrollIntoView({ behavior: 'smooth', block: 'start' })\n\n  const grid = document.getElementById('countiesGrid')\n  grid.innerHTML = ''\n\n  counties.sort().forEach(c => {\n    const a = document.createElement('a')\n    a.className = 'county-link'\n    a.href = '/' + slugify(state) + '/' + slugify(c)\n    a.innerText = c + ' County'\n    grid.appendChild(a)\n  })\n}\n})();</script> </body> </html>"], ['<html lang="en" data-astro-cid-d4gzbk66> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Browse Counties — Retirement Shield</title><link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">', `</head> <body data-astro-cid-d4gzbk66> <!-- NEWSLETTER MODAL --> <div id="newsletterModal" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.6); z-index:9999; align-items:center; justify-content:center; padding:20px; overflow:auto;" data-astro-cid-d4gzbk66> <div style="background:#1A2E4A; width:min(95%,700px); padding:32px; border-radius:12px; position:relative; box-shadow:0 20px 60px rgba(0,0,0,0.4);" data-astro-cid-d4gzbk66> <button onclick="closeNewsletterModal()" style="position:absolute; top:14px; right:16px; background:none; border:none; color:white; font-size:22px; cursor:pointer;" data-astro-cid-d4gzbk66>
×
</button> <div style="margin-bottom:20px;" data-astro-cid-d4gzbk66> <div style="font-size:11px; letter-spacing:1px; text-transform:uppercase; color:var(--gold); font-weight:600; margin-bottom:6px;" data-astro-cid-d4gzbk66>Free Newsletter</div> <h2 style="font-family:'Playfair Display',serif; color:white; font-size:22px; margin:0;" data-astro-cid-d4gzbk66>Join the Retirement Intelligence Report</h2> </div> <iframe src="https://api.leadconnectorhq.com/widget/form/1fEKSAEG00dBmEd1y8gn" style="width:100%; height:350px; border:none; border-radius:8px; background:transparent;" data-astro-cid-d4gzbk66>
      </iframe> </div> </div> <!-- NAV --> <nav data-astro-cid-d4gzbk66> <a href="/" class="nav-logo" data-astro-cid-d4gzbk66>Retirement<span data-astro-cid-d4gzbk66>Shield</span></a> <ul class="nav-links" data-astro-cid-d4gzbk66> <li data-astro-cid-d4gzbk66><a href="/lifeexpectancycalculator" data-astro-cid-d4gzbk66>Life Expectancy</a></li> <li data-astro-cid-d4gzbk66><a href="/quiz" data-astro-cid-d4gzbk66>Estate Planning</a></li> <!-- <li><a href="#">Calculators</a></li> --> <li data-astro-cid-d4gzbk66><a href="#" onclick="openNewsletterModal(event)" data-astro-cid-d4gzbk66>Newsletter</a></li> <li data-astro-cid-d4gzbk66><a href="/quiz" class="nav-cta" data-astro-cid-d4gzbk66>Free Assessment</a></li> </ul> </nav> <div class="header" data-astro-cid-d4gzbk66> <h1 data-astro-cid-d4gzbk66>Browse Retirement Data by County</h1> <p data-astro-cid-d4gzbk66>Select your state to explore life expectancy insights, Social Security strategy guidance, and retirement planning exposure by county.</p> </div> <div class="container" data-astro-cid-d4gzbk66> <div class="section-title" data-astro-cid-d4gzbk66>Select a State</div> <div class="states-grid" data-astro-cid-d4gzbk66> `, ' </div> <div id="countiesSection" data-astro-cid-d4gzbk66> <div class="section-title" id="selectedStateTitle" data-astro-cid-d4gzbk66></div> <div class="counties-grid" id="countiesGrid" data-astro-cid-d4gzbk66></div> </div> </div> <script>(function(){', "\n\n window.openNewsletterModal = function(e) {\n      if (e) e.preventDefault();\n      const modal = document.getElementById('newsletterModal');\n      if (modal) modal.style.display = 'flex';\n    }\n\n    window.closeNewsletterModal = function() {\n      const modal = document.getElementById('newsletterModal');\n      if (modal) modal.style.display = 'none';\n    }\n\n     // Close on background click\n    document.addEventListener('click', function(e){\n      const newsletter = document.getElementById('newsletterModal');\n      const contact = document.getElementById('contactModal');\n\n      if(newsletter && e.target === newsletter){\n        window.closeNewsletterModal();\n      }\n\n      if(contact && e.target === contact){\n        window.closeContactModal();\n      }\n    });\n\n\nconst stateData = stateMap\n\nfunction slugify(str){\n  return str.toLowerCase().replace(/\\\\s+/g,'-')\n}\n\nwindow.showCounties = function(state){\n  const counties = stateData[state] || []\n\n  const section = document.getElementById('countiesSection')\n  section.style.display = 'block'\n  document.getElementById('selectedStateTitle').innerText = state + ' Counties'\n\n  // Smooth scroll to counties section\n  section.scrollIntoView({ behavior: 'smooth', block: 'start' })\n\n  const grid = document.getElementById('countiesGrid')\n  grid.innerHTML = ''\n\n  counties.sort().forEach(c => {\n    const a = document.createElement('a')\n    a.className = 'county-link'\n    a.href = '/' + slugify(state) + '/' + slugify(c)\n    a.innerText = c + ' County'\n    grid.appendChild(a)\n  })\n}\n})();</script> </body> </html>"])), renderHead(), states.map((state) => renderTemplate`<button class="state-btn"${addAttribute(`showCounties('${state}')`, "onclick")} data-astro-cid-d4gzbk66> ${state} </button>`), defineScriptVars({ stateMap }));
}, "/Users/benceabel/Desktop/retirement-shield-live/src/pages/list.astro", void 0);
const $$file = "/Users/benceabel/Desktop/retirement-shield-live/src/pages/list.astro";
const $$url = "/list";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$List,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
