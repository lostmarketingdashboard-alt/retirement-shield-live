import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_CJAScfTm.mjs';
import { manifest } from './manifest_DgbaW6gG.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/articles/_slug_.astro.mjs');
const _page2 = () => import('./pages/articleslist.astro.mjs');
const _page3 = () => import('./pages/blog/_slug_.astro.mjs');
const _page4 = () => import('./pages/blog.astro.mjs');
const _page5 = () => import('./pages/disclaimer.astro.mjs');
const _page6 = () => import('./pages/estateplanningassessmentpdf/_userid_.astro.mjs');
const _page7 = () => import('./pages/estateplanningquiz.astro.mjs');
const _page8 = () => import('./pages/guide/_state_.astro.mjs');
const _page9 = () => import('./pages/guidelist.astro.mjs');
const _page10 = () => import('./pages/lifeexpectancycalculator.astro.mjs');
const _page11 = () => import('./pages/list.astro.mjs');
const _page12 = () => import('./pages/login.astro.mjs');
const _page13 = () => import('./pages/portal.astro.mjs');
const _page14 = () => import('./pages/privacy-policy.astro.mjs');
const _page15 = () => import('./pages/probate/_state_.astro.mjs');
const _page16 = () => import('./pages/quiz.astro.mjs');
const _page17 = () => import('./pages/register.astro.mjs');
const _page18 = () => import('./pages/terms-of-use.astro.mjs');
const _page19 = () => import('./pages/_state_/_county_.astro.mjs');
const _page20 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/articles/[slug].astro", _page1],
    ["src/pages/articleslist.astro", _page2],
    ["src/pages/blog/[slug].astro", _page3],
    ["src/pages/blog/index.astro", _page4],
    ["src/pages/disclaimer.astro", _page5],
    ["src/pages/EstatePlanningAssessmentpdf/[userid].astro", _page6],
    ["src/pages/estateplanningquiz.astro", _page7],
    ["src/pages/guide/[state].astro", _page8],
    ["src/pages/guidelist.astro", _page9],
    ["src/pages/lifeexpectancycalculator.astro", _page10],
    ["src/pages/list.astro", _page11],
    ["src/pages/login.astro", _page12],
    ["src/pages/portal.astro", _page13],
    ["src/pages/privacy-policy.astro", _page14],
    ["src/pages/probate/[state].astro", _page15],
    ["src/pages/quiz.astro", _page16],
    ["src/pages/register.astro", _page17],
    ["src/pages/terms-of-use.astro", _page18],
    ["src/pages/[state]/[county].astro", _page19],
    ["src/pages/index.astro", _page20]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./noop-entrypoint.mjs'),
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "1c594c50-b48a-425c-95ad-1f148e01b5a1",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) ;

export { __astrojsSsrVirtualEntry as default, pageMap };
