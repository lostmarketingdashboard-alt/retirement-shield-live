import { e as createComponent, r as renderTemplate, k as renderHead } from '../chunks/astro/server_CVC9IwxY.mjs';
/* empty css                                 */
export { renderers } from '../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const prerender = false;
const ssr = false;
const $$Login = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate(_a || (_a = __template(['<html lang="en"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Login | Retirement Shield</title>', `</head> <body> <a href="/" class="logo">Retirement<span>Shield</span></a> <div class="login-card"> <h1>Secure Portal Login</h1> <div class="login-sub">
Access your personalized estate planning report and protection dashboard.
</div> <form id="loginForm"> <div class="input-group"> <label>Email Address</label> <input type="email" id="email" required> </div> <div class="input-group"> <label>Password</label> <input type="password" id="password" required> </div> <div class="forgot-link" id="forgotPassword">Forgot password?</div> <button type="submit" class="login-btn">Login to Portal \u2192</button> <button type="button" class="register-btn" onclick="window.location.href='/quiz'">
New here? Start Free Assessment \u2192
</button> </form> <div id="error" class="error-msg"></div> <div id="success" class="success-msg"></div> <div class="footer-note">
Protected access. Encrypted authentication via Supabase.
</div> </div> <script type="module">
  import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

  const supabase = createClient(
    "https://nyiturqeotdxucfdurzu.supabase.co",  
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55aXR1cnFlb3RkeHVjZmR1cnp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxMzI0ODgsImV4cCI6MjA4NzcwODQ4OH0.CvYju6UTaCGD_Zd-8FVTcB-yW9YVG_jQtwkd0l7mIV0",              
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: 'pkce'
      }
    }
  )

      const form = document.getElementById('loginForm')
      const errorEl = document.getElementById('error')
      const successEl = document.getElementById('success')
      const forgotLink = document.getElementById('forgotPassword')

      forgotLink.addEventListener('click', async () => {
        const email = document.getElementById('email').value

        if (!email) {
          errorEl.textContent = 'Please enter your email above first.'
          return
        }

        errorEl.textContent = ''
        successEl.textContent = ''

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin + '/reset-password'
        })

        if (error) {
          errorEl.textContent = error.message
        } else {
          successEl.textContent = 'Password reset link sent. Check your email.'
        }
      })

      form.addEventListener('submit', async (e) => {
        e.preventDefault()

        const email = document.getElementById('email').value
        const password = document.getElementById('password').value

        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) {
          errorEl.textContent = error.message
          return
        }

        window.location.href = '/portal'
      })
    <\/script> </body> </html>`])), renderHead());
}, "/Users/benceabel/Desktop/retirement-shield-live/src/pages/login.astro", void 0);

const $$file = "/Users/benceabel/Desktop/retirement-shield-live/src/pages/login.astro";
const $$url = "/login";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Login,
  file: $$file,
  prerender,
  ssr,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
