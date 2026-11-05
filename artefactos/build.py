import json, re
import os
HERE = os.path.dirname(os.path.abspath(__file__))
U = HERE + "/motor/"
UC = HERE + "/personajes/usoryn/"
K = HERE + "/personajes/kiyaj/"
M = HERE + "/mesa/"

def rd(p): return open(p, encoding="utf8").read()
def js(s): return json.dumps(s, ensure_ascii=False).replace("</", "<\\/")

# ---------- hub (from the published v1 page) ----------
hub = rd(M + "portada.html")
HUB_CSS = hub[hub.index("<style>") + 7:hub.index("</style>")]
HUB_HTML = hub[hub.index("<nav>"):hub.index("<script>")]
HUB_HTML = HUB_HTML.replace(
    'href="https://claude.ai/artifact/4yWA1PbBgiLv4P2zs8Qujs" target="_blank" rel="noopener"', 'href="#/usoryn"').replace(
    'href="https://claude.ai/artifact/UcjMbfRY5smhrA4iQptVd5" target="_blank" rel="noopener"', 'href="#/kiyaj"').replace(
    "Hoja-artefacto · en juego", "Hoja interactiva · en juego").replace(
    ">Hoja-artefacto<", ">Hoja interactiva<").replace(
    "Toca una carta para abrir la hoja. Las hojas-artefacto guardan estado, equipo y oro; las de GitHub son el registro anterior hasta migrarlas.",
    "Toca una carta para abrir la hoja aquí mismo; cada hoja tiene «← Mesa» para volver. Las interactivas guardan estado, equipo y oro; las de GitHub se abren aparte hasta migrarlas.")
HUB_HTML = HUB_HTML.replace('href="https://luippolhrm.github.io/diendi_characters/lucho/yevelda.html" target="_blank" rel="noopener"', 'href="#/yevelda"').replace('<a class="pc ext" href="#/yevelda"', '<a class="pc " href="#/yevelda"')
HUB_HTML = HUB_HTML.replace('<span>Orca · Bárbara 1</span><span class="where">GitHub · por migrar</span>', '<span>Orca · Bárbara 1 · Soldado</span><span class="where">Hoja interactiva</span>')
assert HUB_HTML.count('href="#/') == 3 and 'por migrar</span></a>' in HUB_HTML

# ---------- sheets ----------
SHEET_CSS = rd(U + "base.css") + rd(U + "sheet.css") + """
.idx .home{font-weight:700;color:var(--ink);border-right:1px solid var(--line-2);padding-right:12px;margin-right:2px}
@media (max-width:480px){.idx a{padding:6px 7px}.idx .home{padding-right:9px}}
"""
BODY = rd(U + "body.html")
ENG = rd(U + "engine.js").strip()
assert ENG.startswith("(function(){") and ENG.endswith("})();")
ENG_BODY = ENG[len("(function(){"):-len("})();")]

chars = {
    "usoryn": {"cfg": rd(UC + "cfg.js") + "\n" + rd(UC + "tree.js"), "css": "", "body": BODY},
    "kiyaj": {"cfg": rd(K + "cfg.js") + "\n" + rd(K + "tree.js"), "css": rd(K + "theme.css"),
              "body": BODY.replace("Grimorio del explorador", "Grimorio del paladín")},
    "yevelda": {"cfg": rd(HERE + "/personajes/yevelda/cfg.js") + "\n" + rd(HERE + "/personajes/yevelda/tree.js"), "css": rd(HERE + "/personajes/yevelda/theme.css"), "body": BODY},
}
ch_js = ",\n".join(
    f'{k}:{{css:{js(v["css"])},body:{js(v["body"])},cfg:function(){{\n{v["cfg"]}\n}}}}' for k, v in chars.items())

page = f'''<title>Mesa de Lucho</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,800&family=Fraunces:opsz,wght@9..144,500;9..144,700&family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap">
<style id="appcss"></style>
<div id="app"></div>
<script>
(function(){{
"use strict";
const HUB_CSS={js(HUB_CSS)};
const HUB_HTML={js(HUB_HTML)};
const SHEET_CSS={js(SHEET_CSS)};
const CH={{
{ch_js}
}};
const SHEET=function(){{
{ENG_BODY}
}};
function HUB(){{
  let obs=null;
  const links=document.querySelectorAll('#navLinks a');
  const sections=Array.prototype.map.call(links,a=>document.getElementById(a.getAttribute('href').slice(1)));
  if('IntersectionObserver' in window){{
    obs=new IntersectionObserver(entries=>{{entries.forEach(e=>{{if(e.isIntersecting){{links.forEach(a=>a.classList.remove('active'));const i=sections.indexOf(e.target);if(i>-1)links[i].classList.add('active');}}}});}},{{rootMargin:'-20% 0px -70% 0px'}});
    sections.forEach(s=>{{if(s)obs.observe(s);}});
  }}
  const q=document.getElementById('q'),qn=document.getElementById('qn');
  const cards=Array.prototype.slice.call(document.querySelectorAll('.fcard,.example-card'));
  const secs=Array.prototype.slice.call(document.querySelectorAll('main > section')).filter(s=>s.id!=='personajes'&&s.id!=='reglas');
  const norm=s=>(s||'').toLowerCase().normalize('NFD').replace(/[\\u0300-\\u036f]/g,'');
  q.addEventListener('input',()=>{{
    const t=norm(q.value.trim());let n=0;
    cards.forEach(c=>{{const ok=!t||norm(c.textContent).indexOf(t)>-1;c.hidden=!ok;if(ok)n++;}});
    secs.forEach(s=>{{s.hidden=!Array.prototype.some.call(s.querySelectorAll('.fcard,.example-card'),c=>!c.hidden);}});
    qn.textContent=t?(n+' resultado'+(n===1?'':'s')):'';
  }});
  return ()=>{{if(obs)obs.disconnect();}};
}}
const css=document.getElementById('appcss'), app=document.getElementById('app');
let cur=null, teardown=null;
function go(id,push){{
  if(!CH[id]) id="";
  if(id===cur) return;
  cur=id;
  if(teardown){{try{{teardown();}}catch(_){{}} teardown=null;}}
  if(push){{try{{history.replaceState(null,"",id?"#/"+id:"#/");}}catch(_){{}}}}
  window.scrollTo(0,0);
  if(id){{
    const c=CH[id];
    css.textContent=SHEET_CSS+c.css;
    app.innerHTML=c.body;
    c.cfg(); window.CHAR.ns="c/"+id;
    const nav=app.querySelector(".idx .in");
    if(nav) nav.insertAdjacentHTML("afterbegin",'<a href="#/" class="home">← Mesa</a>');
    teardown=SHEET();
  }}else{{
    css.textContent=HUB_CSS;
    app.innerHTML=HUB_HTML;
    document.title="Mesa de Lucho";
    teardown=HUB();
  }}
}}
document.addEventListener("click",e=>{{
  const a=e.target.closest&&e.target.closest('a[href^="#"]'); if(!a) return;
  const h=a.getAttribute("href");
  e.preventDefault();
  if(h.indexOf("#/")===0){{go(h.slice(2),true);return;}}
  const t=document.getElementById(h.slice(1)); if(t) t.scrollIntoView({{behavior:"smooth",block:"start"}});
}});
window.addEventListener("hashchange",()=>{{const m=location.hash.match(/^#\\/(\\w*)/);if(m)go(m[1],false);}});
const m0=location.hash.match(/^#\\/(\\w*)/); go(m0?m0[1]:"",false);
}})();
</script>
'''
open(M + "mesa.html", "w", encoding="utf8").write(page)
print(len(page))
