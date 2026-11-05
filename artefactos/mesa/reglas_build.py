"""Arma la vista «Reglas rápidas» (#/reglas) a partir de las secciones de mesa/portada.html.

El contenido de cada regla no se toca: solo se reorganiza en categorías y tarjetas plegables.
"""
import re
from bs4 import BeautifulSoup

ICON = {  # glifo corto por categoría (texto, no emoji)
    "fundamentos": "d20", "estados": "◐", "acciones": "▶", "descansos": "☾",
    "combate": "⚔", "dano-y-curacion": "♥", "exploracion": "◎", "conjuros": "✦",
    "equipo": "⚒", "ejemplos": "✎",
}
SECTION_TAG = {  # etiqueta que ya implica la sección y por eso no se repite en la tarjeta
    "fundamentos": "fundamentos", "estados": "estado", "acciones": "acción", "descansos": "descanso",
    "combate": "combate", "dano-y-curacion": "daño", "conjuros": "conjuros", "equipo": "equipo",
    "exploracion": "exploración", "ejemplos": "ejemplo",
}


def first_sentence(card):
    p = card.find("p")
    if not p:
        return ""
    t = re.sub(r"\s+", " ", p.get_text(" ", strip=True))
    return t[:170] + ("…" if len(t) > 170 else "")


def build(portada_html):
    soup = BeautifulSoup(portada_html, "html.parser")
    main = soup.find("main")
    sections = [s for s in main.find_all("section", recursive=False) if s.get("id") not in ("personajes", "reglas")]
    chips, panes = [], []
    for sec in sections:
        sid = sec["id"]
        h2 = sec.find("h2")
        cnt = h2.find(class_="count")
        if cnt:
            cnt.extract()
        title = h2.get_text(strip=True)
        note = sec.find("p", class_="section-note")
        cards = sec.select(".fcard, .example-card")
        chips.append(f'<button type="button" class="rchip" data-cat="{sid}" aria-pressed="false">'
                     f'<span class="gl" aria-hidden="true">{ICON.get(sid, "•")}</span>{title}<span class="n">{len(cards)}</span></button>')
        items = []
        for c in cards:
            cid = c.get("id", "")
            is_ex = "example-card" in c.get("class", [])
            head = c.find(class_="fhead")
            name_el = head.find(class_="fname")
            en = name_el.find(class_="en")
            en_txt = en.get_text(strip=True) if en else ""
            if en:
                en.extract()
            name = name_el.get_text(strip=True)
            tag_el = head.find(class_=["tag", "tag-ex"])
            tag = tag_el.get_text(strip=True) if tag_el else ""
            head.extract()
            gist = first_sentence(c) if not is_ex else re.sub(r"\s+", " ", (c.find(class_="setup") or c).get_text(" ", strip=True))[:170]
            show_tag = tag and tag.lower() != SECTION_TAG.get(sid, "").lower()
            body = c.decode_contents()
            items.append(
                f'<details class="rc{" ex" if is_ex else ""}" id="{cid}">'
                f'<summary><span class="rn">{name}{f" <i>{en_txt}</i>" if en_txt else ""}</span>'
                f'{f"<span class=rt>{tag}</span>" if show_tag else ""}'
                f'{f"<span class=rg>{gist}</span>" if gist else ""}</summary>'
                f'<div class="rb">{body}</div></details>')
        panes.append(
            f'<section class="rpane" id="cat-{sid}" data-cat="{sid}"><header class="rph"><h2>{title}</h2>'
            f'{f"<p>{note.get_text(strip=True)}</p>" if note else ""}</header>'
            f'<div class="rgrid">{"".join(items)}</div></section>')
    html = f'''<div class="rtop"><div class="rin">
  <a href="#/" class="rback">← Mesa</a>
  <h1>Reglas rápidas</h1>
  <label class="rsearch"><span class="sr">Buscar una regla</span><input type="search" id="rq" placeholder="Buscar: apresado, cobertura, ritual…" autocomplete="off"></label>
</div><div class="rin rchips" role="toolbar" aria-label="Categorías">{"".join(chips)}</div></div>
<main class="rmain"><p class="rnote" id="rqn" aria-live="polite"></p>{"".join(panes)}
<p class="rsrc">Fuente: Manual del Jugador 2024 (Devir), capítulos 1, 6 y 7 y Apéndice C, transcritos en Notion. Toca una regla para ver el detalle.</p></main>'''
    return html, len(sections)


CSS = r"""
/* Vista Reglas: barra fija con buscador + categorías; una categoría a la vez; reglas plegables en 1–2 columnas */
.rview{min-height:100%;background:var(--paper)}
.rtop{position:sticky;top:env(safe-area-inset-top,0px);z-index:20;background:color-mix(in srgb,var(--paper) 92%,transparent);backdrop-filter:blur(8px);border-bottom:1px solid var(--line)}
.rin{max-width:1040px;margin:0 auto;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px))}
.rtop .rin:first-child{display:grid;grid-template-columns:auto auto minmax(0,1fr);align-items:center;gap:14px;padding-block:10px 8px}
.rback{font-weight:700;font-size:14px;color:var(--ink);text-decoration:none;padding:6px 10px;border-radius:999px;border:1px solid var(--line-2);white-space:nowrap}
.rback:hover{background:var(--accent-soft)}
.rtop h1{font-family:var(--display);font-weight:800;font-size:20px;white-space:nowrap}
.rsearch{display:block;min-width:0}
.rsearch input{width:100%;font:inherit;font-size:15px;padding:9px 14px;border:1.5px solid var(--line-2);border-radius:999px;background:var(--card-bg);color:var(--ink)}
.rsearch input:focus{outline:2px solid var(--lr-amarillo);outline-offset:1px}
.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}
.rchips{display:flex;gap:6px;overflow-x:auto;scrollbar-width:none;padding-block:2px 10px}
.rchips::-webkit-scrollbar{display:none}
.rchip{flex:none;display:inline-flex;align-items:center;gap:7px;font:inherit;font-size:13px;font-weight:600;color:var(--ink-2);background:var(--card-bg);border:1px solid var(--line);border-radius:999px;padding:6px 12px;cursor:pointer}
.rchip .gl{font-family:'Space Grotesk',monospace;font-size:11px;color:var(--amber-d);min-width:1.2em;text-align:center}
.rchip .n{font-family:'Space Grotesk',monospace;font-size:11px;color:var(--ink-3);font-variant-numeric:tabular-nums}
.rchip:hover{border-color:var(--line-2)}
.rchip[aria-pressed="true"]{background:var(--ink);border-color:var(--ink);color:var(--paper)}
.rchip[aria-pressed="true"] .gl{color:var(--lr-naranja)}
.rchip[aria-pressed="true"] .n{color:var(--paper);opacity:.75}
.rchip:focus-visible,.rc summary:focus-visible,.rback:focus-visible{outline:2px solid var(--lr-amarillo);outline-offset:2px}
.rmain{max-width:1040px;margin:0 auto;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px));padding-block:20px 70px}
.rnote{margin:0;color:var(--ink-3);font-size:13px}
.rnote:empty{display:none}
.rpane{padding-top:6px;scroll-margin-top:120px}
.rpane+.rpane{margin-top:26px}
.rph h2{font-family:var(--display);font-weight:800;font-size:26px;display:flex;align-items:baseline;gap:10px;text-wrap:balance}
.rph h2::after{content:"";width:.3em;height:.3em;border-radius:50%;background:var(--lr-naranja);display:inline-block}
.rph p{margin:4px 0 16px;color:var(--ink-2);font-size:14px;max-width:68ch}
.rgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,440px),1fr));gap:10px;align-items:start}
.rc{min-width:0;background:var(--card-bg);border:1px solid var(--line);border-radius:12px;scroll-margin-top:130px;transition:border-color .15s}
.rc[open]{border-color:var(--line-2);box-shadow:var(--shadow);grid-column:1/-1}
.rc summary{list-style:none;cursor:pointer;display:grid;grid-template-columns:minmax(0,1fr) auto;gap:2px 10px;padding:12px 40px 12px 14px;position:relative}
.rc summary::-webkit-details-marker{display:none}
.rc summary::after{content:"+";position:absolute;right:14px;top:10px;font-family:var(--display);font-weight:700;font-size:20px;line-height:1;color:var(--ink-3);transition:transform .15s}
.rc[open] summary::after{transform:rotate(45deg);color:var(--amber-d)}
.rn{font-family:var(--display);font-weight:700;font-size:16px;line-height:1.25;color:var(--ink)}
.rn i{font-style:normal;font-family:var(--body);font-weight:400;font-size:12px;color:var(--ink-3)}
.rt{align-self:start;font-family:'Space Grotesk',monospace;font-size:10px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--amber-d);background:var(--amber-soft);padding:2px 8px;border-radius:20px;white-space:nowrap}
.rg{grid-column:1/-1;font-size:13px;color:var(--ink-2);line-height:1.45;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.rc[open] .rg{display:none}
.rb{padding:0 14px 14px;border-top:1px dashed var(--line);margin:0 14px;padding-inline:0;padding-top:12px;min-width:0;overflow-wrap:anywhere}
.rb p{margin:0 0 8px;font-size:14.5px;line-height:1.6;max-width:72ch}
.rb p:last-child{margin-bottom:0}
.rb b{font-weight:650;color:var(--ink)}
.rb ol,.rb ul{margin:6px 0 8px;padding-left:20px}
.rb li{font-size:14.5px;margin-bottom:6px;max-width:70ch}
.rb .setup{font-style:italic;color:var(--ink-2);font-size:13.5px}
.rb .rule-table{display:table;width:100%;max-width:640px;border-collapse:separate;border-spacing:0;font-size:13.5px;margin:4px 0 10px;border:1px solid var(--line);border-radius:10px;overflow:hidden;font-variant-numeric:tabular-nums}
.rb .twrap{overflow-x:auto;max-width:100%}
.rb .rule-table th{text-align:left;font-weight:600;font-size:12px;color:var(--ink-2);background:var(--mist);padding:8px 10px;border-bottom:1px solid var(--line);white-space:nowrap}
.rb .rule-table td{padding:7px 10px;border-bottom:1px solid var(--line)}
.rb .rule-table tr:nth-child(odd) td{background:color-mix(in srgb,var(--mist) 45%,transparent)}
.rb .rule-table tr:last-child td{border-bottom:none}
.rc.ex{background:var(--accent-soft)}
.rc.ex .rn{color:var(--accent-d)}
.rc.hit{border-color:var(--lr-amarillo)}
.rsrc{margin-top:34px;color:var(--ink-3);font-size:12.5px;border-top:1px solid var(--line);padding-top:14px}
.rempty{padding:26px;text-align:center;color:var(--ink-3);border:1px dashed var(--line-2);border-radius:12px}
@media (max-width:620px){
  .rtop .rin:first-child{grid-template-columns:auto minmax(0,1fr);gap:8px 10px}
  .rtop h1{font-size:18px}
  .rsearch{grid-column:1/-1}
  .rph h2{font-size:22px}
}
@media (prefers-reduced-motion:reduce){.rc,.rc summary::after{transition:none}}
"""

JS = r"""
function RULES(){
  const KEY="mesa-reglas-cat";
  const chips=[...document.querySelectorAll(".rchip")], panes=[...document.querySelectorAll(".rpane")];
  const q=document.getElementById("rq"), qn=document.getElementById("rqn");
  document.querySelectorAll(".rb .rule-table").forEach(t=>{if(t.parentElement.classList.contains("twrap"))return;const w=document.createElement("div");w.className="twrap";t.before(w);w.appendChild(t);});
  let cat=null; try{cat=localStorage.getItem(KEY);}catch(_){}
  if(!panes.some(p=>p.dataset.cat===cat)) cat=panes[0].dataset.cat;
  const norm=s=>(s||"").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"");
  function show(c,scroll){
    cat=c; try{localStorage.setItem(KEY,c);}catch(_){}
    chips.forEach(b=>b.setAttribute("aria-pressed",b.dataset.cat===c&&!q.value.trim()?"true":"false"));
    panes.forEach(p=>{p.hidden=p.dataset.cat!==c;p.querySelectorAll(".rc").forEach(r=>{r.hidden=false;r.classList.remove("hit");});});
    if(scroll) window.scrollTo({top:0,behavior:"auto"});
    const on=chips.find(b=>b.dataset.cat===c); if(on) on.scrollIntoView({block:"nearest",inline:"center"});
  }
  function search(){
    const t=norm(q.value.trim());
    if(!t){qn.textContent="";show(cat,false);return;}
    let n=0;
    chips.forEach(b=>b.setAttribute("aria-pressed","false"));
    panes.forEach(p=>{let k=0;p.querySelectorAll(".rc").forEach(r=>{const ok=norm(r.textContent).includes(t);r.hidden=!ok;r.classList.toggle("hit",ok);if(ok)k++;});p.hidden=!k;n+=k;});
    qn.textContent=n?`${n} regla${n===1?"":"s"} con «${q.value.trim()}»`:`Nada con «${q.value.trim()}». Prueba otra palabra.`;
  }
  chips.forEach(b=>b.addEventListener("click",()=>{q.value="";qn.textContent="";show(b.dataset.cat,true);}));
  q.addEventListener("input",search);
  function jump(id){
    const el=document.getElementById(id); if(!el) return false;
    const pane=el.closest(".rpane"); if(pane){q.value="";qn.textContent="";show(pane.dataset.cat,false);}
    if(el.tagName==="DETAILS") el.open=true;
    el.scrollIntoView({behavior:"smooth",block:"start"}); return true;
  }
  show(cat,false);
  window.__rulesJump=jump;
  return ()=>{window.__rulesJump=null;};
}
"""
