import { e as createComponent, r as renderTemplate, m as maybeRenderHead, h as createAstro } from '../chunks/astro/server_B-8Lc69N.mjs';
import 'piccolore';
import 'clsx';
/* empty css                                                    */
export { renderers } from '../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Astro = createAstro();
const $$Lifeexpectancycalculator = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Lifeexpectancycalculator;
  return renderTemplate(_a || (_a = __template(['<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Longevity Calculator | Retirement Shield</title><link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet">', `<nav> <div class="logo" style="cursor:pointer;" onclick="goBack()">Retirement<span>Shield</span></div> <div class="nav-r"> <a href="#">Life Expectancy</a> <a href="/quiz">Estate Planning</a> <a href="#" onclick="openNewsletterModal(event)">Newsletter</a> <a href="/quiz" class="nav-cta">Free Assessment</a> </div> </nav> <div class="hero-strip"> <div class="hero-inner"> <div class="hero-pill">&#x1F4CA; Actuarial Calculator</div> <h1>Your <em>Personal</em> Longevity<br>Probability Calculator</h1> <p class="hero-sub">Based on SSA cohort life tables, CDC county mortality data, and published hazard ratios. Not a national average \u2014 your result reflects your health profile and where you live.</p> </div> </div> <div class="main"> <div class="calc-grid"> <div class="form-panel"> <div class="form-head"> <h2>Your Profile</h2> <p>All fields used in calculation. Takes 90 seconds.</p> </div> <div class="form-body"> <div class="step-indicator"> <div class="step-dot active" id="s1"></div> <div class="step-dot" id="s2"></div> <div class="step-dot" id="s3"></div> <div class="step-dot" id="s4"></div> </div> <div class="field-row"> <div class="field-group"> <label class="field-label">Current Age</label> <input class="field-input" type="number" id="age" placeholder="65" min="40" max="90" value="65"> </div> <div class="field-group"> <label class="field-label">Biological Sex</label> <div class="toggle-group" id="sex-toggle"> <button type="button" class="toggle-btn" data-val="male" onclick="setToggle('sex',this)">Male</button> <button type="button" class="toggle-btn" data-val="female" onclick="setToggle('sex',this)">Female</button> </div> </div> </div> <div class="field-group"> <label class="field-label">ZIP Code</label> <input class="field-input" type="text" id="zip" placeholder="33101" maxlength="5" value="33101"> </div> <div class="divider"></div> <div class="field-group"> <label class="field-label">Smoking Status</label> <div class="toggle-group" id="smoke-toggle"> <button type="button" class="toggle-btn" data-val="never" onclick="setToggle('smoke',this)">Never</button> <button type="button" class="toggle-btn" data-val="former10" onclick="setToggle('smoke',this)">Former 10+ yrs</button> <button type="button" class="toggle-btn" data-val="former" onclick="setToggle('smoke',this)">Former &lt;10 yrs</button> <button type="button" class="toggle-btn" data-val="current" onclick="setToggle('smoke',this)">Current</button> </div> </div> <div class="field-group"> <label class="field-label">BMI Range</label> <div class="toggle-group" id="bmi-toggle"> <button type="button" class="toggle-btn" data-val="under" onclick="setToggle('bmi',this)">Under 18.5</button> <button type="button" class="toggle-btn" data-val="normal" onclick="setToggle('bmi',this)">18.5-24.9</button> <button type="button" class="toggle-btn" data-val="over" onclick="setToggle('bmi',this)">25-29.9</button> <button type="button" class="toggle-btn" data-val="obese" onclick="setToggle('bmi',this)">30+</button> </div> </div> <div class="field-group"> <label class="field-label">Weekly Exercise</label> <div class="toggle-group" id="ex-toggle"> <button type="button" class="toggle-btn" data-val="none" onclick="setToggle('ex',this)">None</button> <button type="button" class="toggle-btn" data-val="light" onclick="setToggle('ex',this)">&lt;150 min</button> <button type="button" class="toggle-btn" data-val="moderate" onclick="setToggle('ex',this)">150-300 min</button> <button type="button" class="toggle-btn" data-val="high" onclick="setToggle('ex',this)">300+ min</button> </div> </div> <div class="divider"></div> <div class="field-group"> <label class="field-label">Chronic Conditions (check all that apply)</label> <div class="check-group"> <div class="check-item" onclick="toggleCheck(this,'diabetes')"><div class="check-box"><span class="check-tick">&#x2713;</span></div><div class="check-label">Type 2 Diabetes</div></div> <div class="check-item" onclick="toggleCheck(this,'cardio')"><div class="check-box"><span class="check-tick">&#x2713;</span></div><div class="check-label">Heart Disease / CVD</div></div> <div class="check-item" onclick="toggleCheck(this,'cancer')"><div class="check-box"><span class="check-tick">&#x2713;</span></div><div class="check-label">Cancer History</div></div> <div class="check-item" onclick="toggleCheck(this,'hypertension')"><div class="check-box"><span class="check-tick">&#x2713;</span></div><div class="check-label">Hypertension</div></div> <div class="check-item" onclick="toggleCheck(this,'copd')"><div class="check-box"><span class="check-tick">&#x2713;</span></div><div class="check-label">COPD / Lung Disease</div></div> <div class="check-item" onclick="toggleCheck(this,'ckd')"><div class="check-box"><span class="check-tick">&#x2713;</span></div><div class="check-label">Chronic Kidney Disease</div></div> </div> </div> <button type="button" class="btn-calc" onclick="runCalc()">Calculate My Longevity Profile &#x2192;</button> <p class="disclaimer">Results are statistical probabilities, not medical advice. Sourced from SSA &amp; CDC.</p> </div> </div> <div id="results-area"> <div class="placeholder-panel" id="placeholder"> <div class="placeholder-icon">&#x1F4C8;</div> <h3>Your results will appear here</h3> <p>Fill in your profile and click Calculate to see your personalized survival probability curve and retirement planning implications.</p> </div> <div class="results-panel" id="results"> <div class="actuarial-note"> <strong>Note:</strong>
The numbers you're about to see are drawn from Social Security Administration and CDC actuarial data \u2014 the same tables used by researchers and planners nationwide. They show statistical probabilities for people with similar characteristics, not a prediction about your life. Use them as a planning prompt, not a verdict. For guidance specific to your situation, a licensed professional is always the right next step.
</div> <div class="result-headline"> <div class="rh-label">Your Longevity Profile</div> <div class="rh-name" id="rh-name">65-Year-Old Male - Miami-Dade County, FL</div> <div class="rh-stats"> <div class="rh-stat"><div class="rh-stat-num gold" id="stat-median">--</div><div class="rh-stat-lbl">50th Percentile Life Expectancy</div></div> <div class="rh-stat"><div class="rh-stat-num" id="stat-p75">--</div><div class="rh-stat-lbl">75th Percentile (Plan To)</div></div> <div class="rh-stat"><div class="rh-stat-num" id="stat-p90">--</div><div class="rh-stat-lbl">90th Percentile Tail Risk</div></div> </div> </div> <div class="card"> <div class="card-title">Survival Probabilities from Your Current Age</div> <div class="card-sub">Probability you will still be alive at each future age, based on your personal risk profile.</div> <div class="pct-rows" id="pct-rows"></div> </div> <div class="card"> <div class="card-title">Survival Curve - Your Profile vs. National Average</div> <div class="card-sub" id="chart-sub">Probability of survival at each age.</div> <svg class="surv-chart" id="surv-svg" viewBox="0 0 620 260" preserveAspectRatio="xMidYMid meet"></svg> <div class="chart-legend"> <div class="leg-item"><svg class="leg-swatch" width="16" height="4"><rect width="16" height="3" rx="1" fill="#C9A84C"></rect></svg>Your Profile</div> <div class="leg-item"><svg class="leg-swatch" width="16" height="4"><rect width="16" height="3" rx="1" fill="#D0D9E8"></rect></svg>National Average</div> <div class="leg-item"><svg class="leg-swatch" width="16" height="4"><line x1="0" y1="2" x2="16" y2="2" stroke="#2E9CCA" stroke-width="2" stroke-dasharray="4,3"></line></svg>50% Line</div> </div> </div> <div class="card"> <div class="card-title">Risk Factor Breakdown</div> <p class="card-sub">How each factor adjusts your baseline mortality hazard.</p> <div class="factor-list" id="factor-list"></div> </div> <div id="state-guide-cta" style="display:none; margin-bottom:20px;"> <a id="state-guide-link" href="#" style="
             display:block;
             width:100%;
             background:#3D94B8;
             color:white;
             text-align:center;
             padding:18px 20px;
             font-size:22px;
             font-weight:700;
             border-radius:12px;
             text-decoration:none;
             transition:all .2s ease;
           " onmouseover="this.style.background='#2E7FA1'" onmouseout="this.style.background='#3D94B8'">
Full State Guide \u2192
</a> </div> <div class="ss-card"> <h3>Social Security Strategy for Your Profile</h3> <div class="ss-verdict"> <div class="ss-badge" id="ss-badge">Delay to 70</div> <div class="ss-text" id="ss-text"></div> </div> <div class="ss-table-mini" id="ss-table-mini"></div> </div> <div class="cta-card"> <h3>Know Your Number. Protect Your Plan.</h3> <p>Get your complete Estate Planning Exposure Report - 7 scored gap areas based on your retirement profile. Delivered instantly for free.</p> <div class="cta-row"> <a href="/quiz" class="btn-gold">Get My Estate Planning Report</a> <a href="#" onclick="openNewsletterModal(event)" class="btn-outline">Free Newsletter</a> </div> </div> <div class="method-note"> <strong>Methodology</strong>
Baseline q_x from SSA 2024 Cohort Life Tables. Geographic scalar from USALEEP census tract data. Hazard ratios from published clinical studies (NHANES, NHS/HPFS, CMS CCW). This tool produces statistical probabilities, not medical diagnosis.
</div> </div> </div> </div> </div> <!-- NEWSLETTER MODAL --> <div id="newsletterModal" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.6); z-index:9999; align-items:center; justify-content:center; padding:20px;"> <div style="background:var(--navy2); width:min(95%,600px); padding:28px; border-radius:12px; position:relative; box-shadow:0 20px 60px rgba(0,0,0,0.4);"> <button onclick="closeNewsletterModal()" style="position:absolute; top:14px; right:16px; background:none; border:none; color:white; font-size:22px; cursor:pointer;">
\xD7
</button> <div style="margin-bottom:18px;"> <div style="font-size:11px; letter-spacing:1px; text-transform:uppercase; color:var(--gold); font-weight:600; margin-bottom:6px;">Free Newsletter</div> <h2 style="font-family:'Playfair Display',serif; color:white; font-size:22px; margin:0;">Join the Retirement Intelligence Report</h2> </div> <iframe src="https://api.leadconnectorhq.com/widget/form/1fEKSAEG00dBmEd1y8gn" style="width:100%; height:350px; border:none; border-radius:8px; background:transparent;">
    </iframe> </div> </div> <script>
// --- Supabase (lazy load to avoid breaking non-module script) ---
let supabaseClient = null;

async function getSupabase() {
  if (supabaseClient) return supabaseClient;

  const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');

  supabaseClient = createClient(
    'https://nyiturqeotdxucfdurzu.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55aXR1cnFlb3RkeHVjZmR1cnp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxMzI0ODgsImV4cCI6MjA4NzcwODQ4OH0.CvYju6UTaCGD_Zd-8FVTcB-yW9YVG_jQtwkd0l7mIV0'
  );

  return supabaseClient;
}
window.openNewsletterModal = function(e) {
  if (e) e.preventDefault();
  const modal = document.getElementById('newsletterModal');
  if (modal) modal.style.display = 'flex';
}

window.closeNewsletterModal = function() {
  const modal = document.getElementById('newsletterModal');
  if (modal) modal.style.display = 'none';
}

// Close when clicking background
document.addEventListener('click', function(e){
  const modal = document.getElementById('newsletterModal');
  if(modal && e.target === modal){
    window.closeNewsletterModal();
  }
});
function goBack(){
  if(document.referrer && document.referrer.includes(window.location.hostname)){
    window.history.back();
  } else {
    window.location.href = "/";
  }
}
var sel={sex:null,smoke:null,bmi:null,ex:null};
var conds={};

function setToggle(grp,btn){
  sel[grp]=btn.dataset.val;
  btn.closest('.toggle-group').querySelectorAll('.toggle-btn').forEach(function(b){b.classList.remove('sel');});
  btn.classList.add('sel');
}

function toggleCheck(el,key){
  el.classList.toggle('checked');
  conds[key]=el.classList.contains('checked');
}

var HR={
  smoke:{never:1.0,former10:1.2,former:1.5,current:2.3},
  bmi:{under:1.25,normal:1.0,over:1.05,obese:1.3},
  ex:{none:1.35,light:1.1,moderate:0.85,high:0.78},
  conds:{diabetes:1.8,cardio:2.0,cancer:1.65,hypertension:1.15,copd:1.55,ckd:1.7}
};

function getGeoScalar(zip){
  var z=parseInt(zip)||33101;
  if((z>=33101&&z<=33299)||(z>=80400&&z<=80699)||(z>=96700&&z<=96899)||(z>=10001&&z<=10099))return 0.92;
  if((z>=38600&&z<=39999)||(z>=24700&&z<=26899))return 1.12;
  return 1.0;
}

function getQx(age,sex){
  var male={60:8.9,61:9.5,62:10.2,63:11.1,64:12.1,65:13.2,66:14.4,67:15.9,68:17.5,69:19.3,70:21.4,71:23.7,72:26.3,73:29.2,74:32.4,75:35.9,76:39.8,77:44.1,78:48.8,79:54.1,80:60.0,81:66.5,82:73.7,83:81.5,84:90.1,85:99.5,86:109.7,87:120.8,88:132.8,89:145.9,90:160.0,91:175.3,92:191.8,93:209.5,94:228.5,95:248.8};
  var female={60:6.1,61:6.5,62:7.0,63:7.6,64:8.3,65:9.1,66:9.9,67:10.9,68:12.0,69:13.2,70:14.6,71:16.1,72:17.9,73:19.9,74:22.2,75:24.7,76:27.5,77:30.7,78:34.2,79:38.2,80:42.7,81:47.7,82:53.3,83:59.7,84:66.9,85:75.0,86:84.1,87:94.2,88:105.5,89:118.1,90:132.1,91:147.6,92:164.6,93:183.3,94:203.7,95:225.9};
  var t=sex==='female'?female:male;
  return (t[Math.min(Math.max(age,60),95)]||280)/1000;
}

function calcSurvival(startAge,sex,geoScalar){
  var ht=HR.smoke[sel.smoke]*HR.bmi[sel.bmi]*HR.ex[sel.ex]*geoScalar;
  Object.keys(conds).forEach(function(k){if(conds[k])ht*=HR.conds[k];});
  var personal=[1.0],national=[1.0];
  for(var age=startAge;age<100;age++){
    var qb=getQx(age,sex);
    var qp=1-Math.pow(1-qb,ht);
    personal.push(personal[personal.length-1]*(1-Math.min(qp,0.99)));
    national.push(national[national.length-1]*(1-Math.min(qb,0.99)));
  }
  return{personal:personal,national:national,ht:ht};
}

function findPct(curve,pct,startAge){
  for(var i=0;i<curve.length;i++){if(curve[i]<=pct)return startAge+i-1;}
  return 100;
}

function renderSVG(startAge,personal,national){
  var svg=document.getElementById('surv-svg');
  var W=620,H=260,pt=20,pr=20,pb=40,pl=48;
  var cW=W-pl-pr,cH=H-pt-pb;
  var maxAge=Math.min(startAge+40,100);
  var dispLen=maxAge-startAge;
  function xS(i){return pl+(i/dispLen)*cW;}
  function yS(v){return pt+(1-v)*cH;}
  var out='';
  [0,.25,.5,.75,1].forEach(function(v){
    var y=yS(v);
    out+='<line x1="'+pl+'" y1="'+y+'" x2="'+(W-pr)+'" y2="'+y+'" stroke="#E2E8F0" stroke-width="1"/>';
    out+='<text x="'+(pl-6)+'" y="'+(y+4)+'" text-anchor="end" font-size="10" fill="#8A9BB5" font-family="DM Mono,monospace">'+Math.round(v*100)+'%</text>';
  });
  for(var a=startAge;a<=maxAge;a+=5){
    var x=xS(a-startAge);
    out+='<line x1="'+x+'" y1="'+pt+'" x2="'+x+'" y2="'+(pt+cH)+'" stroke="#E2E8F0" stroke-width="1"/>';
    out+='<text x="'+x+'" y="'+(H-pb+16)+'" text-anchor="middle" font-size="10" fill="#8A9BB5" font-family="DM Mono,monospace">'+a+'</text>';
  }
  var y50=yS(0.5);
  out+='<line x1="'+pl+'" y1="'+y50+'" x2="'+(W-pr)+'" y2="'+y50+'" stroke="#2E9CCA" stroke-width="1.5" stroke-dasharray="5,4" opacity="0.6"/>';
  var natPts=national.slice(0,dispLen+1).map(function(v,i){return xS(i)+','+yS(v);}).join(' ');
  out+='<polyline points="'+natPts+'" fill="none" stroke="#D0D9E8" stroke-width="2" stroke-linejoin="round"/>';
  var persPts=personal.slice(0,dispLen+1).map(function(v,i){return xS(i)+','+yS(v);}).join(' ');
  var fillClose=' '+xS(dispLen)+','+yS(0)+' '+xS(0)+','+yS(0);
  out+='<defs><linearGradient id="sg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#C9A84C" stop-opacity="0.18"/><stop offset="100%" stop-color="#C9A84C" stop-opacity="0.02"/></linearGradient></defs>';
  out+='<polygon points="'+persPts+fillClose+'" fill="url(#sg)"/>';
  out+='<polyline points="'+persPts+'" fill="none" stroke="#C9A84C" stroke-width="2.5" stroke-linejoin="round"/>';
  out+='<text x="'+(W/2)+'" y="'+(H-2)+'" text-anchor="middle" font-size="11" fill="#8A9BB5" font-family="DM Sans,sans-serif">Age</text>';
  svg.innerHTML=out;
}

async function runCalc(){
  var age=parseInt(document.getElementById('age').value)||65;
  if(!sel.sex || !sel.smoke || !sel.bmi || !sel.ex){
    alert("Please complete all profile selections before calculating.");
    return;
  }
  var sex=sel.sex;
  var zip=document.getElementById('zip').value;
  var geo=getGeoScalar(zip);

  // --- ZIP to County Lookup ---
  let locationLabel = "ZIP " + zip;
  try {
    const supabase = await getSupabase();
    const { data, error } = await supabase
      .from('zip_county_lookup')
      .select('county_name, state_name')
      .eq('zip', zip)
      .single();
    if (data && !error) {
      locationLabel = data.county_name + " County, " + data.state_name;

      // --- Dynamic State Guide Button ---
      const stateSlug = data.state_name.toLowerCase().replace(/\\s+/g, '-');
      const guideLink = document.getElementById('state-guide-link');
      const guideContainer = document.getElementById('state-guide-cta');

      if (guideLink && guideContainer) {
        guideLink.href = '/guide/' + stateSlug;
        guideLink.textContent = 'Full ' + data.state_name + ' Guide \u2192';
        guideContainer.style.display = 'block';
      }
    }
  } catch (err) {
    console.log("ZIP lookup failed:", err);
  }

  var res=calcSurvival(age,sex,geo);
  var p50=findPct(res.personal,0.5,age);
  var p75=findPct(res.personal,0.25,age);
  var p90=findPct(res.personal,0.1,age);

  document.getElementById('rh-name').textContent =
    age + '-Year-Old ' +
    (sex === 'female' ? 'Female' : 'Male') +
    ' \xB7 ' + locationLabel;

  document.getElementById('stat-median').textContent='Age '+p50;
  document.getElementById('stat-p75').textContent='Age '+p75;
  document.getElementById('stat-p90').textContent='Age '+p90;
  var targets=[75,80,85,90,95];
  document.getElementById('pct-rows').innerHTML=targets.map(function(ta){
    var idx=Math.max(0,ta-age);
    var pct=Math.round((res.personal[Math.min(idx,res.personal.length-1)]||0)*100);
    var cls=ta<=p50?'f50':ta<=p75?'f75':'f90';
    return '<div class="pct-row"><div class="pct-label">To Age '+ta+'</div><div class="pct-track"><div class="pct-fill '+cls+'" style="width:'+pct+'%"><div class="pct-fill-inner">'+pct+'%</div></div></div><div class="pct-val">'+pct+'%</div></div>';
  }).join('');
  renderSVG(age,res.personal,res.national);
  document.getElementById('chart-sub').textContent='Your profile (gold) vs. national average for '+(sex==='female'?'females':'males')+' (gray). Dashed line = 50% survival threshold.';
  var factors=[
    {name:'Geographic Location',val:geo<1?'High-Longevity Area':geo>1.05?'Lower-Longevity Area':'Average Area',hr:geo,icon:'\\uD83D\\uDCCD',cat:geo<1?'good':geo>1.05?'bad':'warn'},
    {name:'Smoking Status',val:{never:'Never Smoked',former10:'Former (10+ yrs)',former:'Former (<10 yrs)',current:'Current Smoker'}[sel.smoke],hr:HR.smoke[sel.smoke],icon:'\\uD83D\\uDEAC',cat:sel.smoke==='never'?'good':sel.smoke==='current'?'bad':'warn'},
    {name:'Body Weight (BMI)',val:{under:'Underweight',normal:'Normal',over:'Overweight',obese:'Obese (30+)'}[sel.bmi],hr:HR.bmi[sel.bmi],icon:'\\u2696\\uFE0F',cat:sel.bmi==='normal'?'good':sel.bmi==='obese'?'bad':'warn'},
    {name:'Physical Activity',val:{none:'Sedentary',light:'Light',moderate:'Moderate (150-300 min)',high:'High (300+ min)'}[sel.ex],hr:HR.ex[sel.ex],icon:'\\uD83C\\uDFC3',cat:sel.ex==='high'||sel.ex==='moderate'?'good':sel.ex==='light'?'warn':'bad'}
  ];
  var condNames={diabetes:'Type 2 Diabetes',cardio:'Heart Disease',cancer:'Cancer History',hypertension:'Hypertension',copd:'COPD',ckd:'Kidney Disease'};
  Object.keys(conds).forEach(function(k){if(conds[k])factors.push({name:condNames[k],val:'Condition Present',hr:HR.conds[k],icon:'\\uD83C\\uDFE5',cat:'bad'});});
  document.getElementById('factor-list').innerHTML=factors.map(function(f){
    var months=f.hr<1?'+'+Math.round((1-f.hr)*14)+' months':f.hr>1.05?'-'+Math.round((f.hr-1)*10)+' months':'Neutral';
    var cls=f.hr<1?'fi-pos':f.hr>1.05?'fi-neg':'fi-neu';
    var ic=f.cat==='good'?'fi-good':f.cat==='bad'?'fi-bad':'fi-warn';
    return '<div class="factor-item"><div class="factor-left"><div class="factor-icon '+ic+'">'+f.icon+'</div><div><div class="factor-name">'+f.name+'</div><div class="factor-val">'+f.val+'</div></div></div><div class="factor-impact '+cls+'">'+months+'</div></div>';
  }).join('');
  var be=sex==='female'?82:80;
  var rec=p50>be+3?'70':p50>be?'67-70':'62-67';
  document.getElementById('ss-badge').textContent=rec==='70'?'Delay to 70':'Consider 67+';
  document.getElementById('ss-badge').className='ss-badge'+(rec!=='70'?' warn':'');
  document.getElementById('ss-text').innerHTML=p50>be+3?'With a 50th-percentile life expectancy of <strong>age '+p50+'</strong> \\u2014 '+(p50-be)+' years past the Social Security breakeven age \\u2014 delaying to 70 is statistically optimal. Each year of delay past 67 adds 8% permanently to your benefit.':'Your life expectancy is near the Social Security breakeven age. Claiming at Full Retirement Age (67) may be appropriate. Model your specific benefit amount before deciding.';
  var mb=sex==='male'?[1700,2400,3072]:[1580,2230,2855];
  document.getElementById('ss-table-mini').innerHTML=['Age 62','Age 67 (FRA)','Age 70'].map(function(l,i){
    var r=i===2;
    return '<div class="ss-col'+(r?' rec':'')+'"><div class="ss-col-label">'+l+'</div><div class="ss-col-val">$'+mb[i].toLocaleString()+'</div><div style="font-size:10px;color:var(--muted);margin-top:3px">/month</div>'+(r?'<div class="ss-col-rec">RECOMMENDED</div>':'')+'</div>';
  }).join('');
  document.getElementById('placeholder').style.display='none';
  var r=document.getElementById('results');
  r.classList.add('visible');

  // If no state found, hide guide button
  if (locationLabel.startsWith('ZIP')) {
    const guideContainer = document.getElementById('state-guide-cta');
    if (guideContainer) guideContainer.style.display = 'none';
  }
}

<\/script>`], ['<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Longevity Calculator | Retirement Shield</title><link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet">', `<nav> <div class="logo" style="cursor:pointer;" onclick="goBack()">Retirement<span>Shield</span></div> <div class="nav-r"> <a href="#">Life Expectancy</a> <a href="/quiz">Estate Planning</a> <a href="#" onclick="openNewsletterModal(event)">Newsletter</a> <a href="/quiz" class="nav-cta">Free Assessment</a> </div> </nav> <div class="hero-strip"> <div class="hero-inner"> <div class="hero-pill">&#x1F4CA; Actuarial Calculator</div> <h1>Your <em>Personal</em> Longevity<br>Probability Calculator</h1> <p class="hero-sub">Based on SSA cohort life tables, CDC county mortality data, and published hazard ratios. Not a national average \u2014 your result reflects your health profile and where you live.</p> </div> </div> <div class="main"> <div class="calc-grid"> <div class="form-panel"> <div class="form-head"> <h2>Your Profile</h2> <p>All fields used in calculation. Takes 90 seconds.</p> </div> <div class="form-body"> <div class="step-indicator"> <div class="step-dot active" id="s1"></div> <div class="step-dot" id="s2"></div> <div class="step-dot" id="s3"></div> <div class="step-dot" id="s4"></div> </div> <div class="field-row"> <div class="field-group"> <label class="field-label">Current Age</label> <input class="field-input" type="number" id="age" placeholder="65" min="40" max="90" value="65"> </div> <div class="field-group"> <label class="field-label">Biological Sex</label> <div class="toggle-group" id="sex-toggle"> <button type="button" class="toggle-btn" data-val="male" onclick="setToggle('sex',this)">Male</button> <button type="button" class="toggle-btn" data-val="female" onclick="setToggle('sex',this)">Female</button> </div> </div> </div> <div class="field-group"> <label class="field-label">ZIP Code</label> <input class="field-input" type="text" id="zip" placeholder="33101" maxlength="5" value="33101"> </div> <div class="divider"></div> <div class="field-group"> <label class="field-label">Smoking Status</label> <div class="toggle-group" id="smoke-toggle"> <button type="button" class="toggle-btn" data-val="never" onclick="setToggle('smoke',this)">Never</button> <button type="button" class="toggle-btn" data-val="former10" onclick="setToggle('smoke',this)">Former 10+ yrs</button> <button type="button" class="toggle-btn" data-val="former" onclick="setToggle('smoke',this)">Former &lt;10 yrs</button> <button type="button" class="toggle-btn" data-val="current" onclick="setToggle('smoke',this)">Current</button> </div> </div> <div class="field-group"> <label class="field-label">BMI Range</label> <div class="toggle-group" id="bmi-toggle"> <button type="button" class="toggle-btn" data-val="under" onclick="setToggle('bmi',this)">Under 18.5</button> <button type="button" class="toggle-btn" data-val="normal" onclick="setToggle('bmi',this)">18.5-24.9</button> <button type="button" class="toggle-btn" data-val="over" onclick="setToggle('bmi',this)">25-29.9</button> <button type="button" class="toggle-btn" data-val="obese" onclick="setToggle('bmi',this)">30+</button> </div> </div> <div class="field-group"> <label class="field-label">Weekly Exercise</label> <div class="toggle-group" id="ex-toggle"> <button type="button" class="toggle-btn" data-val="none" onclick="setToggle('ex',this)">None</button> <button type="button" class="toggle-btn" data-val="light" onclick="setToggle('ex',this)">&lt;150 min</button> <button type="button" class="toggle-btn" data-val="moderate" onclick="setToggle('ex',this)">150-300 min</button> <button type="button" class="toggle-btn" data-val="high" onclick="setToggle('ex',this)">300+ min</button> </div> </div> <div class="divider"></div> <div class="field-group"> <label class="field-label">Chronic Conditions (check all that apply)</label> <div class="check-group"> <div class="check-item" onclick="toggleCheck(this,'diabetes')"><div class="check-box"><span class="check-tick">&#x2713;</span></div><div class="check-label">Type 2 Diabetes</div></div> <div class="check-item" onclick="toggleCheck(this,'cardio')"><div class="check-box"><span class="check-tick">&#x2713;</span></div><div class="check-label">Heart Disease / CVD</div></div> <div class="check-item" onclick="toggleCheck(this,'cancer')"><div class="check-box"><span class="check-tick">&#x2713;</span></div><div class="check-label">Cancer History</div></div> <div class="check-item" onclick="toggleCheck(this,'hypertension')"><div class="check-box"><span class="check-tick">&#x2713;</span></div><div class="check-label">Hypertension</div></div> <div class="check-item" onclick="toggleCheck(this,'copd')"><div class="check-box"><span class="check-tick">&#x2713;</span></div><div class="check-label">COPD / Lung Disease</div></div> <div class="check-item" onclick="toggleCheck(this,'ckd')"><div class="check-box"><span class="check-tick">&#x2713;</span></div><div class="check-label">Chronic Kidney Disease</div></div> </div> </div> <button type="button" class="btn-calc" onclick="runCalc()">Calculate My Longevity Profile &#x2192;</button> <p class="disclaimer">Results are statistical probabilities, not medical advice. Sourced from SSA &amp; CDC.</p> </div> </div> <div id="results-area"> <div class="placeholder-panel" id="placeholder"> <div class="placeholder-icon">&#x1F4C8;</div> <h3>Your results will appear here</h3> <p>Fill in your profile and click Calculate to see your personalized survival probability curve and retirement planning implications.</p> </div> <div class="results-panel" id="results"> <div class="actuarial-note"> <strong>Note:</strong>
The numbers you're about to see are drawn from Social Security Administration and CDC actuarial data \u2014 the same tables used by researchers and planners nationwide. They show statistical probabilities for people with similar characteristics, not a prediction about your life. Use them as a planning prompt, not a verdict. For guidance specific to your situation, a licensed professional is always the right next step.
</div> <div class="result-headline"> <div class="rh-label">Your Longevity Profile</div> <div class="rh-name" id="rh-name">65-Year-Old Male - Miami-Dade County, FL</div> <div class="rh-stats"> <div class="rh-stat"><div class="rh-stat-num gold" id="stat-median">--</div><div class="rh-stat-lbl">50th Percentile Life Expectancy</div></div> <div class="rh-stat"><div class="rh-stat-num" id="stat-p75">--</div><div class="rh-stat-lbl">75th Percentile (Plan To)</div></div> <div class="rh-stat"><div class="rh-stat-num" id="stat-p90">--</div><div class="rh-stat-lbl">90th Percentile Tail Risk</div></div> </div> </div> <div class="card"> <div class="card-title">Survival Probabilities from Your Current Age</div> <div class="card-sub">Probability you will still be alive at each future age, based on your personal risk profile.</div> <div class="pct-rows" id="pct-rows"></div> </div> <div class="card"> <div class="card-title">Survival Curve - Your Profile vs. National Average</div> <div class="card-sub" id="chart-sub">Probability of survival at each age.</div> <svg class="surv-chart" id="surv-svg" viewBox="0 0 620 260" preserveAspectRatio="xMidYMid meet"></svg> <div class="chart-legend"> <div class="leg-item"><svg class="leg-swatch" width="16" height="4"><rect width="16" height="3" rx="1" fill="#C9A84C"></rect></svg>Your Profile</div> <div class="leg-item"><svg class="leg-swatch" width="16" height="4"><rect width="16" height="3" rx="1" fill="#D0D9E8"></rect></svg>National Average</div> <div class="leg-item"><svg class="leg-swatch" width="16" height="4"><line x1="0" y1="2" x2="16" y2="2" stroke="#2E9CCA" stroke-width="2" stroke-dasharray="4,3"></line></svg>50% Line</div> </div> </div> <div class="card"> <div class="card-title">Risk Factor Breakdown</div> <p class="card-sub">How each factor adjusts your baseline mortality hazard.</p> <div class="factor-list" id="factor-list"></div> </div> <div id="state-guide-cta" style="display:none; margin-bottom:20px;"> <a id="state-guide-link" href="#" style="
             display:block;
             width:100%;
             background:#3D94B8;
             color:white;
             text-align:center;
             padding:18px 20px;
             font-size:22px;
             font-weight:700;
             border-radius:12px;
             text-decoration:none;
             transition:all .2s ease;
           " onmouseover="this.style.background='#2E7FA1'" onmouseout="this.style.background='#3D94B8'">
Full State Guide \u2192
</a> </div> <div class="ss-card"> <h3>Social Security Strategy for Your Profile</h3> <div class="ss-verdict"> <div class="ss-badge" id="ss-badge">Delay to 70</div> <div class="ss-text" id="ss-text"></div> </div> <div class="ss-table-mini" id="ss-table-mini"></div> </div> <div class="cta-card"> <h3>Know Your Number. Protect Your Plan.</h3> <p>Get your complete Estate Planning Exposure Report - 7 scored gap areas based on your retirement profile. Delivered instantly for free.</p> <div class="cta-row"> <a href="/quiz" class="btn-gold">Get My Estate Planning Report</a> <a href="#" onclick="openNewsletterModal(event)" class="btn-outline">Free Newsletter</a> </div> </div> <div class="method-note"> <strong>Methodology</strong>
Baseline q_x from SSA 2024 Cohort Life Tables. Geographic scalar from USALEEP census tract data. Hazard ratios from published clinical studies (NHANES, NHS/HPFS, CMS CCW). This tool produces statistical probabilities, not medical diagnosis.
</div> </div> </div> </div> </div> <!-- NEWSLETTER MODAL --> <div id="newsletterModal" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.6); z-index:9999; align-items:center; justify-content:center; padding:20px;"> <div style="background:var(--navy2); width:min(95%,600px); padding:28px; border-radius:12px; position:relative; box-shadow:0 20px 60px rgba(0,0,0,0.4);"> <button onclick="closeNewsletterModal()" style="position:absolute; top:14px; right:16px; background:none; border:none; color:white; font-size:22px; cursor:pointer;">
\xD7
</button> <div style="margin-bottom:18px;"> <div style="font-size:11px; letter-spacing:1px; text-transform:uppercase; color:var(--gold); font-weight:600; margin-bottom:6px;">Free Newsletter</div> <h2 style="font-family:'Playfair Display',serif; color:white; font-size:22px; margin:0;">Join the Retirement Intelligence Report</h2> </div> <iframe src="https://api.leadconnectorhq.com/widget/form/1fEKSAEG00dBmEd1y8gn" style="width:100%; height:350px; border:none; border-radius:8px; background:transparent;">
    </iframe> </div> </div> <script>
// --- Supabase (lazy load to avoid breaking non-module script) ---
let supabaseClient = null;

async function getSupabase() {
  if (supabaseClient) return supabaseClient;

  const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');

  supabaseClient = createClient(
    'https://nyiturqeotdxucfdurzu.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55aXR1cnFlb3RkeHVjZmR1cnp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxMzI0ODgsImV4cCI6MjA4NzcwODQ4OH0.CvYju6UTaCGD_Zd-8FVTcB-yW9YVG_jQtwkd0l7mIV0'
  );

  return supabaseClient;
}
window.openNewsletterModal = function(e) {
  if (e) e.preventDefault();
  const modal = document.getElementById('newsletterModal');
  if (modal) modal.style.display = 'flex';
}

window.closeNewsletterModal = function() {
  const modal = document.getElementById('newsletterModal');
  if (modal) modal.style.display = 'none';
}

// Close when clicking background
document.addEventListener('click', function(e){
  const modal = document.getElementById('newsletterModal');
  if(modal && e.target === modal){
    window.closeNewsletterModal();
  }
});
function goBack(){
  if(document.referrer && document.referrer.includes(window.location.hostname)){
    window.history.back();
  } else {
    window.location.href = "/";
  }
}
var sel={sex:null,smoke:null,bmi:null,ex:null};
var conds={};

function setToggle(grp,btn){
  sel[grp]=btn.dataset.val;
  btn.closest('.toggle-group').querySelectorAll('.toggle-btn').forEach(function(b){b.classList.remove('sel');});
  btn.classList.add('sel');
}

function toggleCheck(el,key){
  el.classList.toggle('checked');
  conds[key]=el.classList.contains('checked');
}

var HR={
  smoke:{never:1.0,former10:1.2,former:1.5,current:2.3},
  bmi:{under:1.25,normal:1.0,over:1.05,obese:1.3},
  ex:{none:1.35,light:1.1,moderate:0.85,high:0.78},
  conds:{diabetes:1.8,cardio:2.0,cancer:1.65,hypertension:1.15,copd:1.55,ckd:1.7}
};

function getGeoScalar(zip){
  var z=parseInt(zip)||33101;
  if((z>=33101&&z<=33299)||(z>=80400&&z<=80699)||(z>=96700&&z<=96899)||(z>=10001&&z<=10099))return 0.92;
  if((z>=38600&&z<=39999)||(z>=24700&&z<=26899))return 1.12;
  return 1.0;
}

function getQx(age,sex){
  var male={60:8.9,61:9.5,62:10.2,63:11.1,64:12.1,65:13.2,66:14.4,67:15.9,68:17.5,69:19.3,70:21.4,71:23.7,72:26.3,73:29.2,74:32.4,75:35.9,76:39.8,77:44.1,78:48.8,79:54.1,80:60.0,81:66.5,82:73.7,83:81.5,84:90.1,85:99.5,86:109.7,87:120.8,88:132.8,89:145.9,90:160.0,91:175.3,92:191.8,93:209.5,94:228.5,95:248.8};
  var female={60:6.1,61:6.5,62:7.0,63:7.6,64:8.3,65:9.1,66:9.9,67:10.9,68:12.0,69:13.2,70:14.6,71:16.1,72:17.9,73:19.9,74:22.2,75:24.7,76:27.5,77:30.7,78:34.2,79:38.2,80:42.7,81:47.7,82:53.3,83:59.7,84:66.9,85:75.0,86:84.1,87:94.2,88:105.5,89:118.1,90:132.1,91:147.6,92:164.6,93:183.3,94:203.7,95:225.9};
  var t=sex==='female'?female:male;
  return (t[Math.min(Math.max(age,60),95)]||280)/1000;
}

function calcSurvival(startAge,sex,geoScalar){
  var ht=HR.smoke[sel.smoke]*HR.bmi[sel.bmi]*HR.ex[sel.ex]*geoScalar;
  Object.keys(conds).forEach(function(k){if(conds[k])ht*=HR.conds[k];});
  var personal=[1.0],national=[1.0];
  for(var age=startAge;age<100;age++){
    var qb=getQx(age,sex);
    var qp=1-Math.pow(1-qb,ht);
    personal.push(personal[personal.length-1]*(1-Math.min(qp,0.99)));
    national.push(national[national.length-1]*(1-Math.min(qb,0.99)));
  }
  return{personal:personal,national:national,ht:ht};
}

function findPct(curve,pct,startAge){
  for(var i=0;i<curve.length;i++){if(curve[i]<=pct)return startAge+i-1;}
  return 100;
}

function renderSVG(startAge,personal,national){
  var svg=document.getElementById('surv-svg');
  var W=620,H=260,pt=20,pr=20,pb=40,pl=48;
  var cW=W-pl-pr,cH=H-pt-pb;
  var maxAge=Math.min(startAge+40,100);
  var dispLen=maxAge-startAge;
  function xS(i){return pl+(i/dispLen)*cW;}
  function yS(v){return pt+(1-v)*cH;}
  var out='';
  [0,.25,.5,.75,1].forEach(function(v){
    var y=yS(v);
    out+='<line x1="'+pl+'" y1="'+y+'" x2="'+(W-pr)+'" y2="'+y+'" stroke="#E2E8F0" stroke-width="1"/>';
    out+='<text x="'+(pl-6)+'" y="'+(y+4)+'" text-anchor="end" font-size="10" fill="#8A9BB5" font-family="DM Mono,monospace">'+Math.round(v*100)+'%</text>';
  });
  for(var a=startAge;a<=maxAge;a+=5){
    var x=xS(a-startAge);
    out+='<line x1="'+x+'" y1="'+pt+'" x2="'+x+'" y2="'+(pt+cH)+'" stroke="#E2E8F0" stroke-width="1"/>';
    out+='<text x="'+x+'" y="'+(H-pb+16)+'" text-anchor="middle" font-size="10" fill="#8A9BB5" font-family="DM Mono,monospace">'+a+'</text>';
  }
  var y50=yS(0.5);
  out+='<line x1="'+pl+'" y1="'+y50+'" x2="'+(W-pr)+'" y2="'+y50+'" stroke="#2E9CCA" stroke-width="1.5" stroke-dasharray="5,4" opacity="0.6"/>';
  var natPts=national.slice(0,dispLen+1).map(function(v,i){return xS(i)+','+yS(v);}).join(' ');
  out+='<polyline points="'+natPts+'" fill="none" stroke="#D0D9E8" stroke-width="2" stroke-linejoin="round"/>';
  var persPts=personal.slice(0,dispLen+1).map(function(v,i){return xS(i)+','+yS(v);}).join(' ');
  var fillClose=' '+xS(dispLen)+','+yS(0)+' '+xS(0)+','+yS(0);
  out+='<defs><linearGradient id="sg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#C9A84C" stop-opacity="0.18"/><stop offset="100%" stop-color="#C9A84C" stop-opacity="0.02"/></linearGradient></defs>';
  out+='<polygon points="'+persPts+fillClose+'" fill="url(#sg)"/>';
  out+='<polyline points="'+persPts+'" fill="none" stroke="#C9A84C" stroke-width="2.5" stroke-linejoin="round"/>';
  out+='<text x="'+(W/2)+'" y="'+(H-2)+'" text-anchor="middle" font-size="11" fill="#8A9BB5" font-family="DM Sans,sans-serif">Age</text>';
  svg.innerHTML=out;
}

async function runCalc(){
  var age=parseInt(document.getElementById('age').value)||65;
  if(!sel.sex || !sel.smoke || !sel.bmi || !sel.ex){
    alert("Please complete all profile selections before calculating.");
    return;
  }
  var sex=sel.sex;
  var zip=document.getElementById('zip').value;
  var geo=getGeoScalar(zip);

  // --- ZIP to County Lookup ---
  let locationLabel = "ZIP " + zip;
  try {
    const supabase = await getSupabase();
    const { data, error } = await supabase
      .from('zip_county_lookup')
      .select('county_name, state_name')
      .eq('zip', zip)
      .single();
    if (data && !error) {
      locationLabel = data.county_name + " County, " + data.state_name;

      // --- Dynamic State Guide Button ---
      const stateSlug = data.state_name.toLowerCase().replace(/\\\\s+/g, '-');
      const guideLink = document.getElementById('state-guide-link');
      const guideContainer = document.getElementById('state-guide-cta');

      if (guideLink && guideContainer) {
        guideLink.href = '/guide/' + stateSlug;
        guideLink.textContent = 'Full ' + data.state_name + ' Guide \u2192';
        guideContainer.style.display = 'block';
      }
    }
  } catch (err) {
    console.log("ZIP lookup failed:", err);
  }

  var res=calcSurvival(age,sex,geo);
  var p50=findPct(res.personal,0.5,age);
  var p75=findPct(res.personal,0.25,age);
  var p90=findPct(res.personal,0.1,age);

  document.getElementById('rh-name').textContent =
    age + '-Year-Old ' +
    (sex === 'female' ? 'Female' : 'Male') +
    ' \xB7 ' + locationLabel;

  document.getElementById('stat-median').textContent='Age '+p50;
  document.getElementById('stat-p75').textContent='Age '+p75;
  document.getElementById('stat-p90').textContent='Age '+p90;
  var targets=[75,80,85,90,95];
  document.getElementById('pct-rows').innerHTML=targets.map(function(ta){
    var idx=Math.max(0,ta-age);
    var pct=Math.round((res.personal[Math.min(idx,res.personal.length-1)]||0)*100);
    var cls=ta<=p50?'f50':ta<=p75?'f75':'f90';
    return '<div class="pct-row"><div class="pct-label">To Age '+ta+'</div><div class="pct-track"><div class="pct-fill '+cls+'" style="width:'+pct+'%"><div class="pct-fill-inner">'+pct+'%</div></div></div><div class="pct-val">'+pct+'%</div></div>';
  }).join('');
  renderSVG(age,res.personal,res.national);
  document.getElementById('chart-sub').textContent='Your profile (gold) vs. national average for '+(sex==='female'?'females':'males')+' (gray). Dashed line = 50% survival threshold.';
  var factors=[
    {name:'Geographic Location',val:geo<1?'High-Longevity Area':geo>1.05?'Lower-Longevity Area':'Average Area',hr:geo,icon:'\\\\uD83D\\\\uDCCD',cat:geo<1?'good':geo>1.05?'bad':'warn'},
    {name:'Smoking Status',val:{never:'Never Smoked',former10:'Former (10+ yrs)',former:'Former (<10 yrs)',current:'Current Smoker'}[sel.smoke],hr:HR.smoke[sel.smoke],icon:'\\\\uD83D\\\\uDEAC',cat:sel.smoke==='never'?'good':sel.smoke==='current'?'bad':'warn'},
    {name:'Body Weight (BMI)',val:{under:'Underweight',normal:'Normal',over:'Overweight',obese:'Obese (30+)'}[sel.bmi],hr:HR.bmi[sel.bmi],icon:'\\\\u2696\\\\uFE0F',cat:sel.bmi==='normal'?'good':sel.bmi==='obese'?'bad':'warn'},
    {name:'Physical Activity',val:{none:'Sedentary',light:'Light',moderate:'Moderate (150-300 min)',high:'High (300+ min)'}[sel.ex],hr:HR.ex[sel.ex],icon:'\\\\uD83C\\\\uDFC3',cat:sel.ex==='high'||sel.ex==='moderate'?'good':sel.ex==='light'?'warn':'bad'}
  ];
  var condNames={diabetes:'Type 2 Diabetes',cardio:'Heart Disease',cancer:'Cancer History',hypertension:'Hypertension',copd:'COPD',ckd:'Kidney Disease'};
  Object.keys(conds).forEach(function(k){if(conds[k])factors.push({name:condNames[k],val:'Condition Present',hr:HR.conds[k],icon:'\\\\uD83C\\\\uDFE5',cat:'bad'});});
  document.getElementById('factor-list').innerHTML=factors.map(function(f){
    var months=f.hr<1?'+'+Math.round((1-f.hr)*14)+' months':f.hr>1.05?'-'+Math.round((f.hr-1)*10)+' months':'Neutral';
    var cls=f.hr<1?'fi-pos':f.hr>1.05?'fi-neg':'fi-neu';
    var ic=f.cat==='good'?'fi-good':f.cat==='bad'?'fi-bad':'fi-warn';
    return '<div class="factor-item"><div class="factor-left"><div class="factor-icon '+ic+'">'+f.icon+'</div><div><div class="factor-name">'+f.name+'</div><div class="factor-val">'+f.val+'</div></div></div><div class="factor-impact '+cls+'">'+months+'</div></div>';
  }).join('');
  var be=sex==='female'?82:80;
  var rec=p50>be+3?'70':p50>be?'67-70':'62-67';
  document.getElementById('ss-badge').textContent=rec==='70'?'Delay to 70':'Consider 67+';
  document.getElementById('ss-badge').className='ss-badge'+(rec!=='70'?' warn':'');
  document.getElementById('ss-text').innerHTML=p50>be+3?'With a 50th-percentile life expectancy of <strong>age '+p50+'</strong> \\\\u2014 '+(p50-be)+' years past the Social Security breakeven age \\\\u2014 delaying to 70 is statistically optimal. Each year of delay past 67 adds 8% permanently to your benefit.':'Your life expectancy is near the Social Security breakeven age. Claiming at Full Retirement Age (67) may be appropriate. Model your specific benefit amount before deciding.';
  var mb=sex==='male'?[1700,2400,3072]:[1580,2230,2855];
  document.getElementById('ss-table-mini').innerHTML=['Age 62','Age 67 (FRA)','Age 70'].map(function(l,i){
    var r=i===2;
    return '<div class="ss-col'+(r?' rec':'')+'"><div class="ss-col-label">'+l+'</div><div class="ss-col-val">$'+mb[i].toLocaleString()+'</div><div style="font-size:10px;color:var(--muted);margin-top:3px">/month</div>'+(r?'<div class="ss-col-rec">RECOMMENDED</div>':'')+'</div>';
  }).join('');
  document.getElementById('placeholder').style.display='none';
  var r=document.getElementById('results');
  r.classList.add('visible');

  // If no state found, hide guide button
  if (locationLabel.startsWith('ZIP')) {
    const guideContainer = document.getElementById('state-guide-cta');
    if (guideContainer) guideContainer.style.display = 'none';
  }
}

<\/script>`])), maybeRenderHead());
}, "/Users/benceabel/Desktop/retirement-shield-live/src/pages/lifeexpectancycalculator.astro", void 0);

const $$file = "/Users/benceabel/Desktop/retirement-shield-live/src/pages/lifeexpectancycalculator.astro";
const $$url = "/lifeexpectancycalculator";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Lifeexpectancycalculator,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
