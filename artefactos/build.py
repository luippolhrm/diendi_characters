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
    "Toca una carta para abrir la hoja aquí mismo; el botón ← Mesa te trae de vuelta. Cada hoja guarda estado, equipo y oro.").replace(
    "Hoja interactiva · en juego", "Hoja interactiva")
HUB_HTML = HUB_HTML.replace('href="https://luippolhrm.github.io/diendi_characters/lucho/yevelda.html" target="_blank" rel="noopener"', 'href="#/yevelda"').replace('<a class="pc ext" href="#/yevelda"', '<a class="pc " href="#/yevelda"')
HUB_HTML = HUB_HTML.replace('<span>Orca · Bárbara 1</span><span class="where">GitHub · por migrar</span>', '<span>Orca · Bárbara 1 · Soldado</span><span class="where">Hoja interactiva</span>')
HUB_HTML = HUB_HTML.replace('href="https://luippolhrm.github.io/diendi_characters/lucho/auriana.html" target="_blank" rel="noopener"', 'href="#/auriana"').replace('<a class="pc ext" href="#/auriana"', '<a class="pc " href="#/auriana"')
HUB_HTML = HUB_HTML.replace('<span>Aasimar · Clériga 3 · Dominio de la Vida</span><span class="where">GitHub · por migrar</span>', '<span>Aasimar · Clériga 3 · Dominio de la vida</span><span class="where">Hoja interactiva</span>')
HUB_HTML = HUB_HTML.replace('href="https://luippolhrm.github.io/diendi_characters/lucho/darvin.html" target="_blank" rel="noopener"', 'href="#/darvin"').replace('<a class="pc ext" href="#/darvin"', '<a class="pc " href="#/darvin"')
HUB_HTML = HUB_HTML.replace('<span>Humano · Monje 12 · Guerrero de la Mano Abierta</span><span class="where">GitHub · por migrar</span>', '<span>Humano · Monje 12 · Guerrero de la mano abierta</span><span class="where">Hoja interactiva</span>')
assert HUB_HTML.count('href="#/') == 5 and HUB_HTML.count('por migrar') == 0

# ---------- vista de reglas (#/reglas) y portada liviana ----------
import sys; sys.path.insert(0, M)
import reglas_build
RULES_HTML, _ncat = reglas_build.build(hub)
RULES_CSS = reglas_build.CSS
i0 = HUB_HTML.index('<section id="reglas"'); i1 = HUB_HTML.index('</main>')
CATS = [("fundamentos","Fundamentos"),("estados","Estados"),("acciones","Acciones"),("combate","Combate"),("dano-y-curacion","Daño y curación"),("exploracion","Exploración"),("conjuros","Conjuros"),("descansos","Descansos"),("equipo","Equipo"),("ejemplos","Ejemplos")]
HUB_HTML = HUB_HTML[:i0] + """<section id="reglas"><h2>Reglas rápidas</h2>
  <p class="section-note">Más de cien reglas del Manual del Jugador 2024, ordenadas por tema y con buscador. Pensadas para resolver una duda en plena partida.</p>
  <a class="rcta" href="#/reglas"><span><b>Abrir reglas rápidas</b><small>Estados, acciones, combate, conjuros y más</small></span><span class="go" aria-hidden="true">→</span></a>
  <div class="rquick">""" + "".join(f'<a href="#/reglas" data-goto="{k}">{v}</a>' for k, v in CATS) + """</div>
</section>
""" + HUB_HTML[i1:]
HUB_HTML = HUB_HTML.replace("Fuente de todas las reglas de esta página.", "Fuente de las reglas rápidas.")
_eb = '<span>Capítulo 1, la clase Artífice, en Notion.</span></a>'
assert HUB_HTML.count(_eb) == 1
HUB_HTML = HUB_HTML.replace(_eb, _eb + '\n    <a href="https://app.notion.com/p/41062efd3d4a81ad8cc4e89465c7318e" target="_blank" rel="noopener"><b>📖 Dungeon Master&#39;s Guide 2024</b><span>Objetos mágicos que usan los personajes, en Notion.</span></a>\n    <a href="https://app.notion.com/p/41062efd3d4a81328915c97dac7ce2e3" target="_blank" rel="noopener"><b>📖 Monsters of the Multiverse</b><span>Especie githyanki (Ki&#39;yaj), en Notion.</span></a>\n    <a href="https://app.notion.com/p/41062efd3d4a81eea40af25f6b499cf2" target="_blank" rel="noopener"><b>📖 Guía de Xanathar para todo</b><span>Juramento de la Conquista (Ki&#39;yaj), en Notion.</span></a>')
HUB_HTML = re.sub(r'<div class="links" id="navLinks">.*?</div>', '<div class="links" id="navLinks"><a href="#personajes">Personajes</a><a href="#/reglas">Reglas rápidas</a></div>', HUB_HTML, flags=re.S)
HUB_CSS += """
.rcta{display:flex;align-items:center;justify-content:space-between;gap:16px;background:var(--lr-tinta);color:#FFF3D6;border-radius:var(--r);padding:18px 20px;text-decoration:none;box-shadow:var(--shadow);transition:transform .15s}
.rcta:hover{transform:translateY(-2px)}
.rcta b{display:block;font-family:var(--display);font-weight:800;font-size:19px}
.rcta small{display:block;color:#E9DDC4;font-size:13px;margin-top:2px}
.rcta .go{flex:none;width:40px;height:40px;border-radius:50%;background:var(--lr-amarillo);color:#1B2A4A;display:grid;place-items:center;font-weight:800;font-size:20px}
.rquick{display:flex;flex-wrap:wrap;gap:6px;margin-top:12px}
.rquick a{font-size:13px;font-weight:600;text-decoration:none;color:var(--ink-2);background:var(--card-bg);border:1px solid var(--line);border-radius:999px;padding:6px 12px}
.rquick a:hover{border-color:var(--lr-amarillo);color:var(--ink)}
.rcta:focus-visible,.rquick a:focus-visible{outline:2px solid var(--lr-amarillo);outline-offset:2px}
"""
assert '<section id="estados"' not in HUB_HTML

# ---------- sheets ----------
SHEET_CSS = rd(U + "base.css") + rd(U + "sheet.css") + """
.idx .home{font-weight:700;color:var(--ink);border-right:1px solid var(--line-2);padding-right:12px;margin-right:2px}
@media (max-width:480px){.idx a{padding:6px 7px}.idx .home{padding-right:9px}}
@media (max-width:420px){.idx a{padding:6px 5px}.idx a b{margin-right:2px}.idx .home{padding-right:6px}}
@media (max-width:480px){.idx .sync{display:none}.idx .sync.warn{display:block;position:fixed;left:16px;right:16px;bottom:calc(12px + env(safe-area-inset-bottom,0px));max-width:none;white-space:normal;background:var(--surface);border:1px solid var(--ruby);border-radius:12px;padding:10px 12px;z-index:30;box-shadow:0 6px 20px rgba(0,0,0,.18)}}
"""
BODY = rd(U + "body.html")
ENG = rd(U + "engine.js").strip()
assert ENG.startswith("(function(){") and ENG.endswith("})();")
ENG_BODY = ENG[len("(function(){"):-len("})();")]

chars = {
    "usoryn": {"cfg": rd(UC + "cfg.js") + "\n" + rd(UC + "tree.js"), "css": "", "body": BODY},
    "kiyaj": {"cfg": rd(K + "cfg.js") + "\n" + rd(K + "tree.js"), "css": rd(K + "theme.css"),
              "body": BODY.replace("Grimorio del explorador", "Grimorio del paladín")},
    "auriana": {"cfg": rd(HERE + "/personajes/auriana/cfg.js") + "\n" + rd(HERE + "/personajes/auriana/tree.js"), "css": rd(HERE + "/personajes/auriana/theme.css"), "body": BODY.replace("Grimorio del explorador", "Grimorio de la clériga")},
    "darvin": {"cfg": rd(HERE + "/personajes/darvin/cfg.js") + "\n" + rd(HERE + "/personajes/darvin/tree.js"), "css": rd(HERE + "/personajes/darvin/theme.css"), "body": BODY},
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
const RULES_CSS={js(RULES_CSS)};
const RULES_HTML={js(RULES_HTML)};
const CH={{
{ch_js}
}};
const SHEET=function(){{
{ENG_BODY}
}};
function HUB(){{
  document.querySelectorAll('[data-goto]').forEach(a=>a.addEventListener('click',()=>{{try{{localStorage.setItem('mesa-reglas-cat',a.dataset.goto);}}catch(_){{}}}}));
  return ()=>{{}};
}}
{reglas_build.JS}
const css=document.getElementById('appcss'), app=document.getElementById('app');
let cur=null, teardown=null;
function go(id,push){{
  if(!CH[id]&&id!=="reglas") id="";
  if(id===cur) return;
  cur=id;
  if(teardown){{try{{teardown();}}catch(_){{}} teardown=null;}}
  if(push){{try{{history.replaceState(null,"",id?"#/"+id:"#/");}}catch(_){{}}}}
  window.scrollTo(0,0);
  if(id==="reglas"){{
    css.textContent=HUB_CSS+RULES_CSS;
    app.innerHTML='<div class="rview">'+RULES_HTML+'</div>';
    document.title="Reglas rápidas · Mesa de Lucho";
    teardown=RULES();
  }}else if(id){{
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
  if(cur==="reglas"&&window.__rulesJump&&window.__rulesJump(h.slice(1))) return;
  const t=document.getElementById(h.slice(1)); if(t) t.scrollIntoView({{behavior:"smooth",block:"start"}});
}});
window.addEventListener("hashchange",()=>{{const m=location.hash.match(/^#\\/(\\w*)/);if(m)go(m[1],false);}});
const m0=location.hash.match(/^#\\/(\\w*)/); go(m0?m0[1]:"",false);
}})();
</script>
'''
open(M + "mesa.html", "w", encoding="utf8").write(page)
print(len(page))
