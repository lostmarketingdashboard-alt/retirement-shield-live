import { e as createComponent, r as renderTemplate, k as renderHead } from '../chunks/astro/server_CVC9IwxY.mjs';
export { renderers } from '../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Register = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate(_a || (_a = __template(["<html> <head><title>Register</title>", `</head> <body> <h1>Create Account</h1> <form id="registerForm"> <input type="text" id="name" placeholder="Full Name" required> <input type="email" id="email" placeholder="Email" required> <input type="password" id="password" placeholder="Password" required> <button type="submit">Register</button> </form> <p id="error" style="color:red;"></p> <script type="module">
      import { supabase } from '/src/lib/supabase.js'

      const form = document.getElementById('registerForm')
      const errorEl = document.getElementById('error')

      form.addEventListener('submit', async (e) => {
        e.preventDefault()

        const name = document.getElementById('name').value
        const email = document.getElementById('email').value
        const password = document.getElementById('password').value

        // 1\uFE0F\u20E3 Create auth user
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        })

        if (error) {
          errorEl.textContent = error.message
          return
        }

        const user = data.user

        // 2\uFE0F\u20E3 Insert into profiles table
        await supabase.from('profiles').insert({
          id: user.id,
          full_name: name,
          email: email,
          role: 'user'
        })

        window.location.href = '/portal'
      })
    <\/script> </body> </html>`])), renderHead());
}, "/Users/benceabel/Desktop/retirement-shield-live/src/pages/register.astro", void 0);

const $$file = "/Users/benceabel/Desktop/retirement-shield-live/src/pages/register.astro";
const $$url = "/register";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Register,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
