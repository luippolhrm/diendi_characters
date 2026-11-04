(function(){
"use strict";
const CFG=window.CHAR;
const NS=CFG.ns?CFG.ns+"/":"";
const UNSUBS=[]; let alive=true;
const $=id=>document.getElementById(id), sg=n=>(n>=0?"+":"")+n, mod=s=>Math.floor((s-10)/2);
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
function esc(s){return String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));}
const PROF=CFG.prof, HP_BASE=CFG.hpMax, ATT_MAX=3, HP_LEVEL0=CFG.classLevels.Personaje;
const M={}; CFG.abilities.forEach(([k,,s])=>M[k]=mod(s));
const ABN={}; CFG.abilities.forEach(([k,n])=>ABN[k]=n);

/* ---------- estado ---------- */
const DEFAULT={levels:[],langs:[],sub:{},prepared:null,swapUsed:false,swapRem:false,swapFree:false,hp:HP_BASE,temp:0,hd:{},slots:{},res:{},insp:false,effects:[],conc:null,conds:{},exh:0,toggles:{},death:{s:0,f:0}};
CFG.hitDice.forEach(h=>DEFAULT.hd[h.id]=0);
const lvls=()=>(state&&state.levels)||[];
const hpMax=()=>HP_BASE+lvls().reduce((a,l)=>a+(l.hp||0),0);
const hdMax=h=>h.max+lvls().filter(l=>l.hd===h.id).length;
const clsCount=c=>lvls().filter(l=>l.cls===c).length;
const treeCol=c=>(CFG.tree&&CFG.tree.cols||[]).find(x=>x.cls===c)||null;
const subFixed=c=>{const col=treeCol(c);return !!(col&&col.sub&&col.sub.chosen);};
const subChosen=c=>{const col=treeCol(c);if(!col||!col.sub)return null;return col.sub.chosen||(state&&state.sub&&state.sub[c])||null;};
const subOpt=c=>{const col=treeCol(c),id=subChosen(c);return col&&col.sub&&col.sub.opts&&id?col.sub.opts.find(o=>o.id===id)||null:null;};
function curSlots(){
  const MS=CFG.multiSlots; if(!MS) return CFG.slots;
  const subOf=subChosen;
  const casters=Object.keys(MS.casters).filter(c=>clsLvl(c)>0&&(!MS.casters[c].ifSub||subOf(c)===MS.casters[c].ifSub));
  if(casters.length<2) return CFG.slots;
  const lv=casters.reduce((a,c)=>{const k=MS.casters[c];return a+(k.round==="down"?Math.floor:Math.ceil)(clsLvl(c)/k.div);},0);
  const row=MS.table[Math.min(lv,20)]||[];
  return row.map((m,i)=>({lvl:i+1,max:m}));
}
CFG.slots.forEach(s=>DEFAULT.slots["l"+s.lvl]=0);
CFG.resources.forEach(r=>DEFAULT.res[r.id]=0);
(CFG.toggles||[]).forEach(t=>DEFAULT.toggles[t.id]=t.options[0].id);
let state=null, items=[], gold=[], db=null, stateRef=null, writable=true, loaded=false, goldLoaded=false;
const norm=d=>({...DEFAULT,...d,hd:{...DEFAULT.hd,...(d.hd||{})},slots:{...DEFAULT.slots,...(d.slots||{})},res:{...DEFAULT.res,...(d.res||{})},toggles:{...DEFAULT.toggles,...(d.toggles||{})},death:{...DEFAULT.death,...(d.death||{})}});

/* ---------- derivados ---------- */
const active=i=>i.equipped&&(!i.attune||i.attuned);
const selfFx=id=>!!state&&(state.effects||[]).some(e=>e.sp===id&&(e.tg==="self"||e.tg==="both"));
const fxOn=id=>!!state&&(state.effects||[]).find(e=>e.sp===id);
function derive(){
  const armor=items.find(i=>i.kind==="armor"&&i.equipped);
  const shield=items.find(i=>i.kind==="shield"&&i.equipped);
  const parts=[];
  if(armor) parts.push([armor.name,armor.acBase+(armor.dexMax==null?M.des:Math.min(M.des,armor.dexMax))]);
  else parts.push(["Sin armadura (10 + Des)",10+M.des]);
  if(shield) parts.push([shield.name,shield.acBonus||2]);
  items.filter(i=>i.kind!=="shield"&&i.kind!=="armor"&&active(i)&&i.acBonus).forEach(i=>parts.push([i.name,i.acBonus]));
  if(armor&&CFG.defenseStyle) parts.push(["Estilo: Defensa",1]);
  (CFG.selfAC||[]).forEach(([sp,b,n])=>{if(selfFx(sp))parts.push([n,b]);});
  const ac=parts.reduce((a,p)=>a+p[1],0);
  const saveBonus=items.filter(i=>active(i)&&i.saveBonus).reduce((a,i)=>a+i.saveBonus,0);
  return {armor,shield,parts,ac,saveBonus,stealthDis:!!(armor&&armor.stealthDis)};
}
function skillBonus(sk,k){
  const ex=(CFG.expertise||[]).includes(sk);
  const tmp=!!(state&&(CFG.toggles||[]).some(t=>t.skill&&state.toggles[t.id]===sk));
  const p=ex||CFG.skillProf.includes(sk)||tmp;
  return {v:M[k]+(ex?2*PROF:p?PROF:0)-2*(state?state.exh||0:0),p,ex,tmp};
}

/* ---------- estados (Glosario PHB 2024) ---------- */
const CONDS={
  agarrado:{n:"Agarrado",en:"Grappled",t:"Velocidad 0. Desventaja al atacar a cualquiera que no sea quien te agarra. Te puede arrastrar.",f:{speed0:1,atkDis:"salvo contra quien te agarra"}},
  apresado:{n:"Apresado",en:"Restrained",t:"Velocidad 0. Tus ataques con desventaja, los ataques contra ti con ventaja. Desventaja en salvaciones de Destreza.",f:{speed0:1,atkDis:1,dexSaveDis:1}},
  asustado:{n:"Asustado",en:"Frightened",t:"Desventaja en pruebas de característica y ataques mientras veas la fuente del miedo. No puedes acercarte a ella.",f:{atkDis:"si ves la fuente",chkDis:"si ves la fuente"}},
  aturdido:{n:"Aturdido",en:"Stunned",t:"Incapacitado. Fallas automáticamente las salvaciones de Fuerza y Destreza. Los ataques contra ti tienen ventaja.",f:{incap:1,failSD:1}},
  cegado:{n:"Cegado",en:"Blinded",t:"No ves y fallas las pruebas que requieran vista. Tus ataques con desventaja, los ataques contra ti con ventaja.",f:{atkDis:1}},
  derribado:{n:"Derribado",en:"Prone",t:"Solo te arrastras o gastas la mitad de tu velocidad en levantarte. Tus ataques con desventaja. Contra ti: ventaja a 1,5 m o menos, desventaja más lejos.",f:{atkDis:1}},
  ensordecido:{n:"Ensordecido",en:"Deafened",t:"No oyes y fallas las pruebas que requieran oído.",f:{}},
  envenenado:{n:"Envenenado",en:"Poisoned",t:"Desventaja en tiradas de ataque y pruebas de característica.",f:{atkDis:1,chkDis:1}},
  hechizado:{n:"Hechizado",en:"Charmed",t:"No puedes atacar ni elegir como objetivo de efectos dañinos a quien te hechizó. Tiene ventaja social contigo.",f:{}},
  incapacitado:{n:"Incapacitado",en:"Incapacitated",t:"Sin acciones, acciones adicionales ni reacciones. Pierdes la concentración. No puedes hablar.",f:{incap:1}},
  inconsciente:{n:"Inconsciente",en:"Unconscious",t:"Derribado e incapacitado, sueltas lo que sostienes. Velocidad 0. Fallas salvaciones de Fuerza y Destreza. Ataques contra ti con ventaja y críticos a 1,5 m.",f:{incap:1,speed0:1,failSD:1,atkDis:1}},
  invisible:{n:"Invisible",en:"Invisible",t:"Tus ataques con ventaja, los ataques contra ti con desventaja (salvo quien pueda verte). Ventaja en iniciativa.",f:{atkAdv:1}},
  paralizado:{n:"Paralizado",en:"Paralyzed",t:"Incapacitado. Velocidad 0. Fallas salvaciones de Fuerza y Destreza. Ataques contra ti con ventaja y críticos a 1,5 m.",f:{incap:1,speed0:1,failSD:1}},
  petrificado:{n:"Petrificado",en:"Petrified",t:"Incapacitado, velocidad 0, fallas salvaciones de Fuerza y Destreza, ataques contra ti con ventaja. Resistencia a todo el daño.",f:{incap:1,speed0:1,failSD:1}}
};
function condFlags(){
  const f={atkDis:[],atkAdv:[],chkDis:[],speed0:false,failSD:false,dexSaveDis:false,incap:false};
  if(!state) return f;
  Object.keys(state.conds||{}).filter(k=>state.conds[k]&&CONDS[k]).forEach(k=>{
    const c=CONDS[k],x=c.f;
    if(x.atkDis) f.atkDis.push(c.n+(typeof x.atkDis==="string"?" ("+x.atkDis+")":""));
    if(x.atkAdv) f.atkAdv.push(c.n);
    if(x.chkDis) f.chkDis.push(c.n+(typeof x.chkDis==="string"?" ("+x.chkDis+")":""));
    if(x.speed0) f.speed0=true; if(x.failSD) f.failSD=true; if(x.dexSaveDis) f.dexSaveDis=true; if(x.incap) f.incap=true;
  });
  return f;
}
function modsLine(){
  const f=condFlags(), ex=state?state.exh||0:0, out=[];
  (CFG.selfChips||[]).forEach(([sp,txt])=>{if(selfFx(sp))out.push(`<span class="chip adv">${txt}</span>`);});
  if(ex) out.push(`<span class="chip dis">−${2*ex} d20 (Cansancio ${ex})</span>`);
  return {f,ex,html:out.join(" ")};
}

/* ---------- render: cabecera ---------- */
function renderId(){
  const f=CFG.idFields.map(([k,v])=>{
    if(CFG.classOrder&&k==="Clase") v=CFG.classOrder.map(c=>c+" "+clsLvl(c)).join(" / ");
    if(CFG.classOrder&&k==="Nivel") v=String(clsLvl("Personaje"));
    return [k,v];});
  $("cId").innerHTML=f.map(([k,v])=>`<span>${esc(k)} <b>${esc(v)}</b></span>`).join("");
}
function renderStatic(){
  document.title=CFG.name;
  $("cEyebrow").textContent=CFG.eyebrow; $("cName").textContent=CFG.name;
  renderId();
  $("sProf").textContent=sg(PROF);
  $("sInit").textContent=sg(M.des+(CFG.initBonus||0));
  $("sDC").textContent=CFG.casting.dc; $("sDCn").textContent=`ataque ${sg(CFG.casting.atk)} · ${ABN[CFG.casting.ab]}`;
  $("spL").textContent=`CD ${CFG.casting.dc} · ataque ${sg(CFG.casting.atk)} · ${ABN[CFG.casting.ab]}`;
  $("cFooter").textContent=CFG.footer;
  renderProfs();
  $("refBox").innerHTML=CFG.refs||"";
}
function render(){
  if(!alive) return;
  renderProfs();
  const d=derive();
  if(loaded){$("sAC").textContent=d.ac;$("sACn").textContent=d.armor?d.armor.name.toLowerCase():"sin armadura";
    $("acBreak").innerHTML=d.parts.map(p=>`<span>${esc(p[0])} ${sg(p[1])}</span>`).join("")+`<span class="tot">CA ${d.ac}</span>`;}
  renderGold(); renderRecipes(); renderLevelUp(); renderTree(); renderAbil(d); renderItems(); renderAttacks(d); renderMastery(); renderFx(); renderConds(); if(spellRows().map(r=>r.id||r.g).join("|")!==spKey) buildSpells(); updateSpells(); renderGrimoire(); renderRes();
  if(!state) return;
  const s=state, f=condFlags(), ex=s.exh||0;
  let spd=f.speed0?0:Math.max(0,CFG.speed+(CFG.speedByLevel||[]).reduce((a,[c,l,b])=>a+(clsLvl(c)>=l?b:0),0)-5*ex+(CFG.speedFx||[]).reduce((a,[sp,b])=>a+(selfFx(sp)?b:0),0));
  $("sSpd").textContent=spd; $("sSpdn").textContent=f.speed0?"velocidad 0 por estado":`ft · ${String(spd/5*1.5).replace(".",",")} m`+(ex?" · cansancio":"");
  $("hpCur").textContent=s.hp; $("hpTemp").textContent=s.temp; 
  $("hpMaxL").textContent="máx. "+hpMax(); $("hpMaxS").textContent=" / "+hpMax();
  const pct=clamp(s.hp/hpMax()*100,0,100); const bar=$("hpBar"); bar.style.width=pct+"%"; bar.classList.toggle("low",pct<=33);
  $("hpState").textContent=s.hp===0?"A 0 PG: tiradas de salvación contra muerte":s.hp<=hpMax()/2?"Malherido":"En pie";
  $("bInsp").setAttribute("aria-pressed",s.insp?"true":"false");
}
function pips(el,total,spent,cls,onClick){
  el.innerHTML="";
  for(let i=0;i<total;i++){
    const b=document.createElement("button");b.type="button";b.className="pip"+(cls?" "+cls:"");
    const used=i>=total-spent; b.setAttribute("aria-pressed",used?"true":"false");
    b.setAttribute("aria-label",(used?"Gastado ":"Disponible ")+(i+1));
    b.addEventListener("click",()=>onClick(used));
    el.appendChild(b);
  }
}
function renderRes(){
  if(!state) return;
  const box=$("resBox"); box.innerHTML="";
  const row=(host,title,sub,max,spent,cls,on)=>{
    const t=document.createElement("div");t.className="track";
    t.innerHTML=`<div class="t"><b>${title}</b><span>${sub}</span></div><div class="pips"></div>`;
    pips(t.querySelector(".pips"),max,spent,cls,on); host.appendChild(t);
  };
  CFG.resources.forEach(r=>{
    if(r.pool){
      const left=r.max-(state.res[r.id]||0);
      const t=document.createElement("div");t.className="track pool";
      t.innerHTML=`<div class="t"><b>${r.n}</b><span>${r.sub}</span></div><div class="poolrow"><b class="num">${left}</b><span class="mute">/ ${r.max}</span><input type="number" min="1" max="${left}" value="${Math.min(5,left)||1}" aria-label="Puntos a gastar"><button type="button" class="btn go">Gastar</button><button type="button" class="btn ghost">Devolver</button></div>`;
      const inp=t.querySelector("input"),[go,back]=t.querySelectorAll("button");
      go.disabled=left<=0;
      go.onclick=()=>{const n=clamp(parseInt(inp.value,10)||0,0,left);if(!n)return;save({res:{...state.res,[r.id]:(state.res[r.id]||0)+n}});flash(`${r.n}: gastas ${n}. ${r.spendMsg||""}`);};
      back.onclick=()=>{const n=clamp(parseInt(inp.value,10)||0,0,state.res[r.id]||0);if(!n)return;save({res:{...state.res,[r.id]:(state.res[r.id]||0)-n}});};
      box.appendChild(t);return;
    }
    row(box,r.n,r.sub,r.max,state.res[r.id],"gold",u=>save({res:{...state.res,[r.id]:clamp(state.res[r.id]+(u?-1:1),0,r.max)}}));
  });
  (CFG.hitDice||[]).forEach(h=>row(box,`Dados de golpe ${h.label}`,`Gasta uno en descanso corto: tira 1d${h.die}${M.con?" "+sg(M.con):" (+0 Con)"} y anótalo con Curar`,hdMax(h),state.hd[h.id],"",u=>save({hd:{...state.hd,[h.id]:clamp(state.hd[h.id]+(u?-1:1),0,hdMax(h))}})));
  (CFG.toggles||[]).forEach(tg=>{
    const t=document.createElement("div");t.className="track tg";
    t.innerHTML=`<div class="t"><b>${tg.n}</b><span>${tg.sub}</span></div><div class="ftabs"></div>`;
    if(tg.select){const s=document.createElement("select");s.setAttribute("aria-label",tg.n);tg.options.forEach(o=>s.add(new Option(o.n,o.id)));s.value=state.toggles[tg.id];s.onchange=()=>save({toggles:{...state.toggles,[tg.id]:s.value}});t.querySelector(".ftabs").appendChild(s);box.appendChild(t);return;}
    tg.options.forEach(o=>{const b=document.createElement("button");b.type="button";b.className="cond";b.textContent=o.n;
      b.setAttribute("aria-pressed",state.toggles[tg.id]===o.id?"true":"false");
      b.onclick=()=>save({toggles:{...state.toggles,[tg.id]:o.id}});t.querySelector(".ftabs").appendChild(b);});
    box.appendChild(t);
  });
  const sb=$("spSlots"); sb.innerHTML="";
  curSlots().forEach(sl=>{const k="l"+sl.lvl;if(state.slots[k]==null)state.slots[k]=0;const t=document.createElement("div");t.className="t";
    t.innerHTML=`<span>Nivel ${sl.lvl}</span><span class="pips"></span>`;
    pips(t.querySelector(".pips"),sl.max,state.slots[k],"",u=>save({slots:{...state.slots,[k]:clamp(state.slots[k]+(u?-1:1),0,sl.max)}}));sb.appendChild(t);});
  renderDeath();
}
function renderDeath(){
  const box=$("deathBox"), ds=state.death||{s:0,f:0};
  box.className="death"+(state.hp===0?" zero":"");
  box.innerHTML=`<span class="lbl">Salvaciones contra muerte</span><span class="ok">Éxitos <span class="dpips"></span></span><span class="ko">Fallos <span class="dpips"></span></span>${state.hp===0?'<span class="note">A 0 PG: al empezar tu turno tira 1d20; 10+ es éxito. Un 1 cuenta como dos fallos; un 20 te devuelve 1 PG. Tres éxitos: estable. Tres fallos: mueres.</span>':""}`;
  const mk=(host,key)=>{for(let i=0;i<3;i++){const b=document.createElement("button");b.type="button";b.className="pip";const on=i<ds[key];
    b.setAttribute("aria-pressed",on?"true":"false");b.setAttribute("aria-label",(key==="s"?"Éxito ":"Fallo ")+(i+1));
    b.onclick=()=>save({death:{...ds,[key]:on&&i===ds[key]-1?i:i+1}});host.appendChild(b);}};
  mk(box.querySelector(".ok .dpips"),"s"); mk(box.querySelector(".ko .dpips"),"f");
}

function renderAbil(d){
  const box=$("abil"); box.innerHTML="";
  const ml=modsLine(), ex=ml.ex, cf=ml.f;
  CFG.abilities.forEach(([k,name,score])=>{
    const sp=CFG.saveProf.includes(k);
    const sv=M[k]+(sp?PROF:0)+d.saveBonus-2*ex;
    const auto=cf.failSD&&(k==="fue"||k==="des"), sdis=cf.dexSaveDis&&k==="des";
    let li=`<li class="${sp?"p":""}"><span>Salvación${sdis?" ⓓ":""}</span><span>${auto?"falla":sg(sv)}</span></li>`;
    CFG.skills.filter(x=>x[1]===k).forEach(([sk])=>{
      const b=skillBonus(sk,k);
      li+=`<li class="${b.ex?"x":b.p?"p":""}"><span>${sk}${b.tmp?" ◐":""}${sk==="Sigilo"&&d.stealthDis?" ⚠":""}</span><span>${sg(b.v)}</span></li>`;
    });
    box.insertAdjacentHTML("beforeend",`<div class="ab"><div class="top"><span class="lbl">${name}</span><b class="num">${sg(M[k])}</b><span class="sc">${score}</span></div><ul>${li}</ul></div>`);
  });
  const per=skillBonus("Percepción","sab"); $("sPP").textContent=10+per.v+2*(state?state.exh||0:0);
  $("saveNote").textContent=d.saveBonus?`Las salvaciones incluyen ${sg(d.saveBonus)} de objetos sintonizados y puestos.`:"";
  $("stealthNote").textContent=d.stealthDis?"⚠ Sigilo con desventaja por la armadura equipada.":"";
  const extra=[];
  if(cf.chkDis.length) extra.push(`<span class="chip dis">Desventaja en pruebas: ${esc(cf.chkDis.join(", "))}</span>`);
  if(cf.failSD) extra.push(`<span class="chip dis">Fallas salvaciones de Fuerza y Destreza</span>`);
  if(cf.dexSaveDis) extra.push(`<span class="chip dis">ⓓ Desventaja en salvación de Destreza</span>`);
  $("abMods").innerHTML=[ml.html,...extra].filter(Boolean).join(" ");
}

/* ---------- ataques ---------- */
function weaponModes(w){return w.modes&&w.modes.length?w.modes:[{n:"",dmg:w.dmg,type:w.dmgType,ranged:w.ranged,range:w.range,mastery:w.mastery,ab:w.ab}];}
function renderAttacks(d){
  const box=$("atkBox"); if(!loaded) return;
  const ws=items.filter(i=>i.kind==="weapon"&&i.equipped);
  if(!ws.length){box.className="empty";box.textContent="Sin armas equipadas. Equipa una desde el Inventario.";renderXdmg();return;}
  box.className="tbl";
  const ml=modsLine(); const chips=[ml.html];
  if(ml.f.atkDis.length) chips.push(`<span class="chip dis">Desventaja: ${esc(ml.f.atkDis.join(", "))}</span>`);
  if(ml.f.atkAdv.length) chips.push(`<span class="chip adv">Ventaja: ${esc(ml.f.atkAdv.join(", "))}</span>`);
  if(ml.f.incap) chips.push(`<span class="chip dis">Incapacitado: no puedes atacar</span>`);
  const head=chips.filter(Boolean).length?`<div class="acrow" style="margin-bottom:6px">${chips.filter(Boolean).join(" ")}</div>`:"";
  let rows="";
  ws.forEach(w=>weaponModes(w).forEach(m=>{
    const ab=m.ab||w.ab||"des";
    const atk=M[ab]+PROF+(m.ranged&&CFG.archery?2:0)-2*ml.ex;
    const mast=w.masteryActive&&m.mastery?m.mastery:"";
    rows+=`<tr><td>${esc(w.name)}${m.n?` <span class="mute">${esc(m.n)}</span>`:""}${(w.qty||1)>1?` <span class="mute num">×${w.qty}</span>`:""}</td><td class="n">${sg(atk)}</td><td class="n">${esc(m.dmg)}${sg(M[ab])}</td><td class="note">${esc(m.type||"")}${m.range?" · "+esc(m.range):""}${mast?" · "+esc(mast):m.mastery?" · "+esc(m.mastery)+" (inactiva)":""}</td></tr>`;
  }));
  box.innerHTML=head+`<table><thead><tr><th>Arma</th><th>Atq</th><th>Daño</th><th>Notas</th></tr></thead><tbody>${rows}</tbody></table>`+(CFG.archery?`<p class="note" style="margin-top:6px">Ataques a distancia incluyen +2 de Tiro con arco.</p>`:"");
  renderXdmg();
}
function renderXdmg(){
  const box=$("xdmgBox"); box.innerHTML="";
  (CFG.extraDamage||[]).forEach(x=>{
    let on=true, name=x.n, note=x.cond, dice=x.dice;
    if(x.toggle){const t=CFG.toggles.find(t=>t.id===x.toggle);const o=t.options.find(o=>o.id===(state?state.toggles[t.id]:t.options[0].id));name=o.n;note=o.cond;dice=o.dice||"";}
    if(x.effect){const e=fxOn(x.effect);on=!!e;note=e?`activa sobre ${e.who||"el objetivo"}`:x.cond;}
    box.insertAdjacentHTML("beforeend",`<div class="fxi"><b>${esc(name)} ${dice?`<span class="chip${on?"":" gold"}">${esc(dice)}</span>`:""}</b><span class="note">${on?"":"inactiva"}</span><small>${esc(note)}</small></div>`);
  });
}
function renderMastery(){
  const el=$("mastNote"); if(!loaded){el.textContent="";return;}
  const act=items.filter(i=>i.kind==="weapon"&&i.masteryActive);
  const lines=act.map(w=>{
    const ms=[...new Set(weaponModes(w).map(m=>m.mastery).filter(Boolean))];
    return `<b>${esc(w.name)}</b>: ${ms.map(m=>esc(m)+(CFG.masteryText[m]?" ("+CFG.masteryText[m]+")":"")).join(" · ")}${w.equipped?"":" — el arma no está equipada"}`;
  });
  const free=CFG.masterySlots-act.length;
  el.innerHTML=`<b>Maestría con armas</b> ${act.length}/${CFG.masterySlots}${free>0?` · ${free} libre`:""}. `+(lines.join(". ")||"Ninguna asignada.")+`. Se cambian al terminar un descanso largo.`;
}

/* ---------- equipo e inventario ---------- */
const KIND={armor:"Cuerpo",shield:"Brazo",weapon:"Arma",ring:"Dedo",cloak:"Hombros",neck:"Cuello",focus:"Foco",gear:"Mochila"};
const CAT={weapon:"arma",armor:"armadura",shield:"armadura",ring:"objeto mágico",cloak:"objeto mágico",neck:"objeto de trama",focus:"equipo"};
const CAT_L={arma:"Arma",armadura:"Armadura",equipo:"Equipo",consumible:"Consumible",municion:"Munición",herramienta:"Herramienta",valor:"Objeto de valor","objeto mágico":"Objeto mágico","objeto de trama":"Trama"};
const catOf=i=>i.cat||CAT[i.kind]||"equipo";
const locOf=i=>i.loc||"Sin asignar";
function allConts(){const set=[...CFG.containers];items.forEach(i=>{const l=locOf(i);if(!i.equipped&&!set.includes(l))set.push(l);});return set;}
function toggle(label,on,cls,fn){const b=document.createElement("button");b.type="button";b.className="sw "+cls;b.setAttribute("aria-pressed",on?"true":"false");b.innerHTML=`<i></i>${label}`;b.onclick=fn;return b;}
function armBtn(label,fn){const b=document.createElement("button");b.type="button";b.className="btn ghost";b.textContent=label;
  b.onclick=()=>{if(b.dataset.armed){fn();}else{b.dataset.armed="1";b.textContent="¿Seguro?";b.classList.add("dmg");setTimeout(()=>{if(b.isConnected){delete b.dataset.armed;b.textContent=label;b.classList.remove("dmg");}},3000);}};return b;}
function qtyCtl(i){const q=document.createElement("span");q.className="qty";
  q.innerHTML=`<button type="button" aria-label="Quitar uno">−</button><button type="button" aria-label="Agregar uno">+</button>`;
  const [m,p]=q.querySelectorAll("button");m.onclick=()=>setItem(i,{qty:Math.max(0,(i.qty||0)-1)});p.onclick=()=>setItem(i,{qty:(i.qty||0)+1});return q;}
function renderItems(){
  if(!loaded) return;
  const box=$("itemsBox");
  const att=items.filter(i=>i.attune&&i.attuned).length;
  $("attNote").textContent=`sintonización ${att}/${ATT_MAX}`;
  const order=["armor","shield","weapon","ring","cloak","neck","focus"];
  const eq=items.filter(i=>i.equipped&&i.kind!=="gear").sort((a,b)=>order.indexOf(a.kind)-order.indexOf(b.kind)||(a.order||0)-(b.order||0));
  box.innerHTML=eq.length?"":`<div class="empty">No llevas nada equipado. Equipa desde el Inventario.</div>`;
  eq.forEach(i=>{
    const c=document.createElement("div"); c.className="sl";
    c.innerHTML=`<span class="k">${KIND[i.kind]||"Objeto"}</span><b>${esc(i.name)}${i.homebrew?' <span class="chip gold">GM</span>':""}</b>${i.note?`<p>${esc(i.note)}</p>`:""}<div class="acts"></div>`;
    const acts=c.querySelector(".acts");
    if(i.attune) acts.appendChild(toggle(i.attuned?"Sintonizado":"Sin sintonía",i.attuned,"att",()=>{
      if(!i.attuned&&att>=ATT_MAX){flash("Ya tienes 3 objetos sintonizados.");return;}
      setItem(i,{attuned:!i.attuned});
    }));
    if(!i.locked){const g=document.createElement("button");g.type="button";g.className="btn ghost";g.textContent="Guardar";
      g.onclick=()=>{setItem(i,{equipped:false,loc:locOf(i)});flash(`${i.name} pasó al inventario (${locOf(i)}).`);};acts.appendChild(g);}
    box.appendChild(c);
  });
  renderInv();
}

const openLn=new Set(), closedCt=new Set();
function renderInv(){
  const box=$("invBox"), inv=items.filter(i=>!i.equipped);
  const conts=allConts();
  $("locList").innerHTML=conts.map(c=>`<option value="${esc(c)}">`).join("");
  $("invCount").textContent=inv.length?`${inv.length} objeto${inv.length>1?"s":""}`:"";
  if(!inv.length){box.innerHTML=`<div class="empty">Inventario vacío. Usa "+ Agregar objeto".</div>`;return;}
  box.innerHTML="";
  conts.forEach(c=>{
    const list=inv.filter(i=>locOf(i)===c).sort((a,b)=>(a.order||0)-(b.order||0)||String(a.name).localeCompare(b.name));
    if(!list.length) return;
    const ct=document.createElement("details"); ct.className="ct"; ct.open=!closedCt.has(c);
    ct.addEventListener("toggle",()=>{ct.open?closedCt.delete(c):closedCt.add(c);});
    const cd=(CFG.containerNotes||{})[c];
    ct.innerHTML=`<summary><span><b>${esc(c)}</b>${cd?`<small>${esc(cd)}</small>`:""}</span><span class="num mute">${list.length}</span></summary><div class="rows"></div>`;
    const rows=ct.querySelector(".rows");
    list.forEach(i=>{
      const cat=catOf(i), hasQ=typeof i.qty==="number";
      const ln=document.createElement("details"); ln.className="ln"; ln.open=openLn.has(i._id);
      ln.addEventListener("toggle",()=>{ln.open?openLn.add(i._id):openLn.delete(i._id);});
      const dot=cat==="consumible"||cat==="municion"?"c":cat==="herramienta"?"h":cat==="valor"?"v":"";
      ln.innerHTML=`<summary><span class="nm"><span class="dot ${dot}"></span>${esc(i.name)}${i.homebrew?' <span class="chip gold">GM</span>':""}</span><span class="q${hasQ&&i.qty===0?" zero":""}">${hasQ?(i.qty===0?"agotado":"×"+i.qty):""}</span></summary><div class="more">${i.note?`<p>${esc(i.note)}</p>`:""}<p class="mute">${CAT_L[cat]||cat}</p><div class="acts"></div></div>`;
      const acts=ln.querySelector(".acts");
      const mv=document.createElement("select"); mv.setAttribute("aria-label","Mover "+i.name);
      conts.forEach(x=>mv.add(new Option(x===c?"Está en: "+x:"Mover a "+x,x))); mv.value=c; mv.onchange=()=>setItem(i,{loc:mv.value}); acts.appendChild(mv);
      if(i.kind!=="gear"){const b=document.createElement("button");b.type="button";b.className="btn go";b.textContent="Equipar";b.onclick=()=>setItem(i,{equipped:true});acts.appendChild(b);}
      if((cat==="consumible"||cat==="municion")&&hasQ){const u=document.createElement("button");u.type="button";u.className="btn";u.textContent="Usar 1";u.disabled=!(i.qty>0);
        u.onclick=()=>{setItem(i,{qty:Math.max(0,i.qty-1)});flash(`Usaste ${i.name}. Quedan ${Math.max(0,i.qty-1)}.`);};acts.appendChild(u);}
      if(hasQ) acts.appendChild(qtyCtl(i));
      if(i.kind==="gear") acts.appendChild(armBtn("Quitar",()=>{openLn.delete(i._id);removeItem(i);}));
      rows.appendChild(ln);
    });
    box.appendChild(ct);
  });
}

/* ---------- escritura ---------- */
let pending=null, writing=false, tmr=null;
function save(patch){
  if(!state) return; state={...state,...patch}; render();
  if(!db){setSync("Sin guardado: esta vista no puede escribir",true);return;}
  pending=state; clearTimeout(tmr); tmr=setTimeout(flush,350);
}
async function flush(){
  if(writing||!pending) return; writing=true; const body=pending; pending=null;
  setSync("Guardando…");
  try{await stateRef.set(body); setSync("Guardado");}catch(e){handleWriteErr(e);}
  writing=false; if(pending) flush();
}
async function setItem(i,patch){
  const others=(patch.equipped===true&&(i.kind==="armor"||i.kind==="shield"))?items.filter(x=>x!==i&&x.kind===i.kind&&x.equipped):[];
  Object.assign(i,patch); others.forEach(x=>x.equipped=false); render();
  if(others.length) flash(`${others.map(x=>x.name).join(", ")} pasó a guardado.`);
  if(!db){setSync("Sin guardado: esta vista no puede escribir",true);return;}
  setSync("Guardando…");
  try{for(const x of others) await db.doc(NS+"items/"+x._id).update({equipped:false});
    await db.doc(NS+"items/"+i._id).update(patch); if(!others.length) setSync("Guardado");}catch(e){handleWriteErr(e);}
}
async function removeItem(i){
  items=items.filter(x=>x!==i); render();
  if(!db) return;
  try{await db.doc(NS+"items/"+i._id).delete(); setSync("Guardado");}catch(e){handleWriteErr(e);}
}
function handleWriteErr(e){
  if(e&&e.code==="invalid_argument"){writable=false;setSync("Solo lectura: tu acceso no permite guardar",true);}
  else if(e&&e.code==="quota_exceeded"){setSync("Sin espacio para guardar más",true);}
  else setSync("No se pudo guardar. Revisa la conexión",true);
}
function setSync(t,warn){const el=$("sync");if(!el||!alive)return;el.textContent=t;el.classList.toggle("warn",!!warn);}
function flash(t){setSync(t,true);setTimeout(()=>setSync(writable?"Guardado":"Solo lectura"),2600);}

/* ---------- conjuros ---------- */
const TG={self:"A mí",other:"A otro",both:"A mí y a otros"};
function srcInfo(k){
  const s=state||DEFAULT;
  const m=/^slot(\d)$/.exec(k);
  if(m){const sl=curSlots().find(x=>x.lvl==m[1]);const left=sl?sl.max-(s.slots["l"+sl.lvl]||0):0;return {l:`Espacio nv. ${m[1]} (${left} libres)`,ok:left>0};}
  if(k==="ritual") return {l:"Ritual (+10 min, sin espacio)",ok:true};
  const r=CFG.resources.find(x=>x.id===k);
  if(r){const left=r.max-s.res[r.id];return {l:`${r.short||r.n} (${left} libres)`,ok:left>0};}
  return {l:k,ok:false};
}
function spSources(sp){
  const out=[...(sp.src||[])];
  if(!sp.noSlot) curSlots().filter(sl=>sl.lvl>=sp.lvl).forEach(sl=>out.push("slot"+sl.lvl));
  return sp.lvl===0&&!sp.src?[]:out;
}
const spRows={};
const G=CFG.grimoire||{always:[],prepDefault:[],prepTable:[],maxLvlTable:[]};
const prepList=()=>(state&&Array.isArray(state.prepared))?state.prepared:G.prepDefault;
const prepMax=()=>{const L=clsLvl(G.cls);return L>0?(G.prepTable[L-1]||0):0;};
const prepMaxLvl=()=>{const L=clsLvl(G.cls);return L>0?(G.maxLvlTable[L-1]||1):1;};
const spById=id=>CFG.spells.find(s=>s.id===id);
let spKey="";
function spellRows(){
  const out=[];
  const alw=G.always.map(spById).filter(Boolean);
  if(alw.length){out.push({g:G.alwaysLabel||"Siempre preparados"});out.push(...alw);}
  const pr=prepList().map(spById).filter(Boolean).sort((a,b)=>a.lvl-b.lvl||a.n.localeCompare(b.n,"es"));
  out.push({g:`Preparados · ${pr.length}/${prepMax()} · se eligen en el Grimorio`});
  if(!pr.length) out.push({g:"Ninguno preparado todavía."});
  out.push(...pr);
  const fixed=[...new Set(CFG.spells.filter(s=>s.fixed).map(s=>s.fixed))];
  fixed.forEach(g=>{out.push({g});out.push(...CFG.spells.filter(s=>s.fixed===g));});
  return out;
}
function buildSpells(){
  const box=$("spBox"); box.innerHTML=""; for(const k in spRows) delete spRows[k];
  const rows=spellRows(); spKey=rows.map(r=>r.id||r.g).join("|");
  rows.forEach(sp=>{
    if(sp.g){box.insertAdjacentHTML("beforeend",`<div class="spg group">${sp.g}</div>`);return;}
    const c=document.createElement("details"); c.className="spl"+(sp.lock?" lock":"");
    c.innerHTML=`<summary><span class="nm"><b>${sp.n}</b> <span class="en">(${sp.en})</span></span><span class="chip${sp.conc?"":" gold"}">${sp.tag}${sp.conc?" · conc.":""}</span></summary><div class="more"><div class="meta">${sp.meta}</div><p>${sp.d}</p></div>`;
    const more=c.querySelector(".more");
    if(sp.lock){more.insertAdjacentHTML("beforeend",`<div class="meta">${sp.lock}</div>`);box.appendChild(c);return;}
    const row=document.createElement("div"); row.className="cast";
    const src=document.createElement("select"); src.id="src-"+sp.id; src.setAttribute("aria-label","Recurso para "+sp.n);
    const tg=document.createElement("select"); tg.id="tg-"+sp.id; tg.setAttribute("aria-label","Objetivo de "+sp.n);
    sp.tg.forEach(t=>tg.add(new Option(TG[t],t)));
    const who=document.createElement("input"); who.id="who-"+sp.id; who.placeholder="¿Quién?"; who.setAttribute("aria-label","Nombre del objetivo");
    const go=document.createElement("button"); go.type="button"; go.className="btn go"; go.textContent="Lanzar";
    const syncWho=()=>{who.hidden=tg.value==="self";}; tg.addEventListener("change",syncWho); syncWho();
    if(sp.tg.length===1) tg.hidden=true;
    go.addEventListener("click",()=>{cast(sp,src.value,tg.value,who.value.trim(),who);c.open=false;});
    row.append(src,tg,who,go); more.appendChild(row);
    spRows[sp.id]={src,go,sp}; box.appendChild(c);
  });
}

function updateSpells(){
  Object.values(spRows).forEach(({src,go,sp})=>{
    const keep=src.value; src.innerHTML="";
    const list=spSources(sp);
    list.forEach(k=>{const i=srcInfo(k);const o=new Option(i.l,k);o.disabled=!i.ok;src.add(o);});
    const firstOk=list.find(k=>srcInfo(k).ok);
    src.value=(keep&&list.includes(keep)&&srcInfo(keep).ok)?keep:(firstOk||list[0]||"");
    const incap=condFlags().incap;
    go.disabled=!state||!firstOk||incap;
    go.title=incap?"Incapacitado: no puedes actuar":!firstOk?"Sin recursos":"";
  });
}
function cast(sp,src,tg,who,whoEl){
  if(!state||!srcInfo(src).ok) return;
  const s=state, patch={}, msg=[];
  const m=/^slot(\d)$/.exec(src);
  if(m){patch.slots={...s.slots,["l"+m[1]]:(s.slots["l"+m[1]]||0)+1};}
  else if(src!=="ritual") patch.res={...s.res,[src]:s.res[src]+1};
  let effects=[...(s.effects||[])], conc=s.conc||null;
  if(sp.conc&&conc){const old=effects.find(e=>e.id===conc);effects=effects.filter(e=>e.id!==conc);if(old)msg.push(`Termina ${old.n} (concentración).`);conc=null;}
  if(sp.dur){const id=String(Date.now());effects.push({id,sp:sp.id,n:sp.n,tg,who:tg==="self"?"":who,conc:!!sp.conc,dur:sp.dur});if(sp.conc)conc=id;}
  if(sp.selfTemp&&(tg==="self"||tg==="both")){patch.temp=Math.max(s.temp||0,sp.selfTemp);msg.push(`Ganas ${sp.selfTemp} PG temporales (se queda el mayor).`);}
  if(sp.selfHeal&&tg==="self"){msg.push(`Tira ${sp.selfHeal} y anótalo con Curar.`);$("hpAmt").focus();}
  else if(sp.inst) msg.push(sp.inst);
  if(m&&+m[1]>sp.lvl&&sp.up) msg.push("Nivel superior: "+sp.up);
  patch.effects=effects; patch.conc=conc;
  save(patch); if(whoEl) whoEl.value="";
  flash(`${sp.n}${tg==="self"?" a ti":who?" a "+who:""}. `+msg.join(" "));
}
function endEffect(id){
  if(!state) return;
  const e=(state.effects||[]).find(x=>x.id===id);
  save({effects:(state.effects||[]).filter(x=>x.id!==id),conc:state.conc===id?null:state.conc});
  if(e) flash(`Termina ${e.n}.`);
}
let concAsk=null;
function renderFx(){
  if(!state) return;
  const fx=state.effects||[]; const box=$("fxBox");
  $("fxCount").textContent=fx.length?fx.length+" activo"+(fx.length>1?"s":""):"";
  const ce=fx.find(e=>e.id===state.conc);
  const cb=$("concBanner"); cb.hidden=!ce;
  if(ce){cb.innerHTML=`<span>Concentrado en <b>${esc(ce.n)}</b>${ce.who?" sobre "+esc(ce.who):ce.tg==="self"?" sobre ti":""} · ${esc(ce.dur)}</span>`;
    const b=document.createElement("button");b.type="button";b.className="btn";b.textContent="Soltar";b.onclick=()=>endEffect(ce.id);cb.appendChild(b);}
  const others=fx.filter(e=>e.id!==state.conc);
  if(!others.length){box.className="";box.innerHTML=ce?"":`<div class="empty">Nada activo. Lo que lances desde Conjuros aparece aquí.</div>`;}
  else{box.className="fx";box.innerHTML="";
    others.forEach(e=>{const r=document.createElement("div");r.className="fxi";
      const on=e.tg==="self"?"sobre ti":e.tg==="both"?"sobre ti y "+(e.who||"otros"):"sobre "+(e.who||"otro");
      r.innerHTML=`<b>${esc(e.n)}</b><span></span><small>${esc(on)} · ${esc(e.dur)}</small>`;
      const b=document.createElement("button");b.type="button";b.className="btn ghost";b.textContent="Terminar";b.onclick=()=>endEffect(e.id);
      r.children[1].replaceWith(b);box.appendChild(r);});}
  const q=$("concQ"); q.hidden=!concAsk||!ce;
  if(concAsk&&ce){
    const bon=M.con+(CFG.saveProf.includes("con")?PROF:0)+derive().saveBonus-2*(state.exh||0);
    q.innerHTML=`<div>Recibiste daño concentrado en <b>${esc(ce.n)}</b>: salvación de Constitución <b class="num">CD ${concAsk}</b>, tu bono <b class="num">${sg(bon)}</b>.</div><div class="row"></div>`;
    const ok=document.createElement("button");ok.type="button";ok.className="btn heal";ok.textContent="La superé";ok.onclick=()=>{concAsk=null;render();};
    const ko=document.createElement("button");ko.type="button";ko.className="btn dmg";ko.textContent="La fallé";ko.onclick=()=>{concAsk=null;endEffect(ce.id);};
    q.querySelector(".row").append(ok,ko);
  }
}
function renderConds(){
  if(!state) return;
  const box=$("condBox"); box.innerHTML="";
  Object.entries(CONDS).forEach(([k,c])=>{
    const b=document.createElement("button");b.type="button";b.className="cond";b.setAttribute("aria-pressed",(state.conds||{})[k]?"true":"false");
    b.textContent=c.n;b.title=c.en;b.onclick=()=>toggleCond(k);box.appendChild(b);
  });
  $("oExh").textContent=state.exh||0;
  const det=$("condDetail"); det.innerHTML="";
  Object.keys(state.conds||{}).filter(k=>state.conds[k]&&CONDS[k]).forEach(k=>{
    const c=CONDS[k]; const note=(CFG.condNotes||{})[k];
    det.insertAdjacentHTML("beforeend",`<div><b>${c.n}</b> <span class="en">(${c.en})</span>: ${c.t}${note?` <span class="chip adv">${note}</span>`:""}</div>`);
  });
  if(state.exh>0) det.insertAdjacentHTML("beforeend",`<div><b>Cansancio ${state.exh}</b>: −${2*state.exh} a toda prueba con d20, −${5*state.exh} ft de velocidad.${state.exh>=6?" <b>A nivel 6 mueres.</b>":""}</div>`);
}
function toggleCond(k){
  const cs={...(state.conds||{})}; const on=!cs[k]; if(on) cs[k]=true; else delete cs[k];
  const patch={conds:cs};
  if(on&&CONDS[k].f.incap&&state.conc){const e=(state.effects||[]).find(x=>x.id===state.conc);
    patch.effects=(state.effects||[]).filter(x=>x.id!==state.conc);patch.conc=null;flash(`${CONDS[k].n}: pierdes la concentración${e?" en "+e.n:""}.`);}
  save(patch);
}

/* ---------- rasgos ---------- */
let featFilter="all";
const clsLvl=c=>CFG.classLevels[c]==null?99:CFG.classLevels[c]+(c==="Personaje"?lvls().length:clsCount(c));
const PIC={
 shield:'<path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6Z"/>',
 star:'<path d="M12 4l2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 16.4 7.2 18.9l.9-5.4L4.2 9.7l5.4-.8Z"/>',
 armor:'<path d="M8 4h8l3 3-2 3v10H7V10L5 7Z"/><path d="M12 4v16"/>',
 sword:'<path d="M14 4h6v6L10 20l-3-3Z"/><path d="M5 15l4 4M4 20l2-2"/>',
 tool:'<circle cx="7" cy="17" r="3"/><path d="M9 15l9-9 2 2-9 9"/>',
 talk:'<path d="M4 5h16v10H9l-5 4Z"/>'
};
const pic=k=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${PIC[k]||PIC.star}</svg>`;
function renderFeats(){
  $("featLvl").textContent=CFG.classOrder?CFG.classOrder.filter(c=>clsLvl(c)>0).map(c=>c+" "+clsLvl(c)).join(" · "):CFG.levelLabel;
  const box=$("featBox"); box.innerHTML="";
  CFG.featGroups.forEach(([g,label,sub,tone])=>{
    const list=CFG.feats.filter(f=>f.o===g&&f.l<=clsLvl(f.c||g)).sort((a,b)=>a.l-b.l);
    if(!list.length) return;
    const sec=document.createElement("section"); sec.className="fg "+(tone||"jade");
    sec.innerHTML=`<header><b>${esc(label)}</b><span>${esc((sub||"").replace(/\{([^}]+)\}/g,(m,c)=>clsLvl(c)))}</span><span class="cnt num">${list.length}</span></header><div class="fcs"></div>`;
    const grid=sec.querySelector(".fcs");
    list.forEach(f=>{
      const [first,...rest]=f.d;
      const art=document.createElement("article"); art.className="fc";
      art.innerHTML=`<div class="fct"><span class="lv">${esc(f.lt||"Niv "+f.l)}</span>${f.use?`<span class="use">${esc(f.use)}</span>`:""}</div><h3>${f.n}</h3><span class="en">${f.en}</span><p>${first}</p>${rest.length?`<details><summary>Más detalle</summary>${rest.map(x=>`<p>${x}</p>`).join("")}</details>`:""}<footer>${esc(f.src)}</footer>`;
      grid.appendChild(art);
    });
    box.appendChild(sec);
  });
  (CFG.tree&&CFG.tree.cols||[]).forEach(col=>{
    if(!col.sub||subFixed(col.cls)) return;
    const o=subOpt(col.cls), have=clsLvl(col.cls); if(!o||have<col.sub.at) return;
    const ks=Object.keys(o.lv).map(Number).filter(k=>k<=have).sort((a,b)=>a-b); if(!ks.length) return;
    const sec=document.createElement("section"); sec.className="fg "+(col.tone||"jade");
    const list=[]; ks.forEach(k=>o.lv[k].forEach(([n,d])=>list.push({k,n,d})));
    sec.innerHTML=`<header><b>${esc(o.n)}</b><span>Subclase de ${esc(col.cls)} · nivel ${have}</span><span class="cnt num">${list.length}</span></header><div class="fcs"></div>`;
    const grid=sec.querySelector(".fcs");
    list.forEach(f=>{const art=document.createElement("article");art.className="fc";
      art.innerHTML=`<div class="fct"><span class="lv">${esc(col.cls.slice(0,3)+" "+f.k)}</span></div><h3>${esc(f.n)}</h3><span class="en">${esc(o.en)}</span><p>${esc(f.d)}</p><footer>Resumen del árbol · detalle mecánico se integra al subir</footer>`;
      grid.appendChild(art);});
    box.appendChild(sec);
  });
}
function renderProfs(){
  const box=$("profBox"); if(!box||!CFG.profs) return;
  const chosen=(state&&state.langs)||[];
  box.innerHTML=CFG.profs.map(p=>{
    let items=p.items.slice(), extra="";
    if(p.dyn==="langs"&&CFG.langs){
      const L=CFG.langs, known=new Set([...p.items.map(x=>x[0]),...chosen]);
      chosen.forEach(n=>items.push([n,"elegido"]));
      const free=L.slots-chosen.length;
      const opt=list=>list.filter(([n])=>!known.has(n)).map(([n,o])=>`<option value="${esc(n)}">${esc(n)} — ${esc(o)}</option>`).join("");
      for(let i=0;i<free;i++) extra+=`<li class="lsel"><select data-lang aria-label="Elegir idioma"><option value="">Elegir idioma…</option><optgroup label="Idiomas estándar">${opt(L.std)}</optgroup><optgroup label="Idiomas inusuales">${opt(L.rare)}</optgroup></select><span class="og">⏳ pendiente</span></li>`;
    }
    return `<div class="pf"><div class="pfh"><span class="ico">${pic(p.ic)}</span><b>${esc(p.t)}</b><span class="num mute">${items.length}</span></div><ul>${items.map(([n,o])=>`<li><span class="nm">${esc(n)}</span>${o==="elegido"?`<button type="button" class="lx" data-unlang="${esc(n)}" title="Quitar">✕</button>`:o?`<span class="og">${esc(o)}</span>`:""}</li>`).join("")}${extra}</ul>${p.note?`<p class="note">${esc(p.note)}</p>`:""}</div>`;
  }).join("");
  box.querySelectorAll("[data-lang]").forEach(s=>s.onchange=()=>{if(s.value) save({langs:[...chosen,s.value]});});
  box.querySelectorAll("[data-unlang]").forEach(b=>b.onclick=()=>save({langs:chosen.filter(x=>x!==b.dataset.unlang)}));
}
document.querySelectorAll("[data-ff]").forEach(b=>b.addEventListener("click",()=>{
  featFilter=b.dataset.ff;document.querySelectorAll("[data-ff]").forEach(x=>x.setAttribute("aria-pressed",x===b?"true":"false"));renderFeats();}));

/* ---------- oro ---------- */
let goldAll=false;
const fmtPo=n=>(Math.round(n*100)/100).toLocaleString("es-CL",{maximumFractionDigits:2});
const goldBal=()=>gold.filter(g=>!g.void).reduce((a,g)=>a+(+g.amt||0),0);
function renderGold(){
  if(!goldLoaded) return;
  $("gBal").textContent=fmtPo(goldBal());
  const box=$("gList");
  if(!gold.length){box.innerHTML=`<div class="empty">Sin movimientos. Anota el primero con Ingreso.</div>`;$("gMore").hidden=true;return;}
  const list=[...gold].sort((a,b)=>(b.at||"").localeCompare(a.at||"")||(b.n||0)-(a.n||0));
  const shown=goldAll?list:list.slice(0,8); box.innerHTML="";
  shown.forEach(g=>{
    const r=document.createElement("div"); r.className="lg"+(g.void?" void":"");
    const d=(g.at||"").slice(0,10).split("-").reverse().join("-");
    r.innerHTML=`<span class="dt">${esc(d)}</span><span class="c">${esc(g.concept)}${g.void?' <span class="chip dis">anulado</span>':""}</span><span class="amt ${g.amt>=0?"pos":"neg"}">${g.amt>=0?"+":"−"}${fmtPo(Math.abs(g.amt))}</span><span></span>`;
    if(!g.void) r.lastElementChild.replaceWith(armBtn("Anular",()=>voidGold(g)));
    box.appendChild(r);
  });
  const more=$("gMore"); more.hidden=list.length<=8; more.textContent=goldAll?"Ver solo los últimos":`Ver todos (${list.length})`;
}
async function voidGold(g){g.void=true;render();if(!db)return;try{await db.doc(NS+"gold/"+g._id).update({void:true});setSync("Guardado");}catch(e){handleWriteErr(e);}}
$("gMore").addEventListener("click",()=>{goldAll=!goldAll;renderGold();});
let goldDir=1;
$("goldForm").querySelectorAll("button[type=submit]").forEach(b=>b.addEventListener("click",()=>{goldDir=+b.dataset.dir;}));
$("goldForm").addEventListener("submit",async e=>{
  e.preventDefault();
  const v=Math.round(parseFloat(String($("gAmt").value).replace(",","."))*100)/100, c=$("gConcept").value.trim();
  if(!(v>0)||!c) return;
  if(goldDir<0&&v>goldBal()+1e-9){flash(`No alcanza: el saldo es ${fmtPo(goldBal())} po.`);return;}
  const now=new Date(), at=new Date(now.getTime()-now.getTimezoneOffset()*60000).toISOString().slice(0,19);
  const doc={amt:goldDir*v,concept:c,at,n:Date.now(),void:false};
  $("gAmt").value="";$("gConcept").value="";
  if(!db){gold.push({...doc,_id:"local"+doc.n});render();setSync("Sin guardado: esta vista no puede escribir",true);return;}
  try{await db.collection(NS+"gold").add(doc);setSync("Guardado");}catch(err){handleWriteErr(err);}
});

/* ---------- controles ---------- */
document.querySelectorAll("[data-hp]").forEach(b=>b.addEventListener("click",()=>{
  if(!state) return; const n=Math.max(0,parseInt($("hpAmt").value,10)||0); if(!n) return; const s=state;
  if(b.dataset.hp==="dmg"){
    const fromTemp=Math.min(s.temp,n), patch={temp:s.temp-fromTemp,hp:Math.max(0,s.hp-(n-fromTemp))};
    if(s.hp===0&&n-fromTemp>0){const ds=s.death||{s:0,f:0};patch.death={...ds,f:Math.min(3,ds.f+1)};flash("Daño a 0 PG: cuenta como un fallo (dos si fue crítico).");}
    else if(patch.hp===0){patch.conds={...(s.conds||{}),inconsciente:true};
      if(s.conc){patch.effects=(s.effects||[]).filter(x=>x.id!==s.conc);patch.conc=null;}
      flash("0 PG: quedas Inconsciente. Haz salvaciones contra muerte.");}
    else if(s.conc) concAsk=Math.min(30,Math.max(10,Math.floor(n/2)));
    save(patch);
  } else if(b.dataset.hp==="heal"){const p={hp:Math.min(hpMax(),s.hp+n),death:{s:0,f:0}};
    if(s.hp===0){const cs={...(s.conds||{})};delete cs.inconsciente;p.conds=cs;}
    save(p);}
  else save({temp:Math.max(s.temp,n)});
}));
document.querySelectorAll("[data-exh]").forEach(b=>b.addEventListener("click",()=>{if(state)save({exh:clamp((state.exh||0)+(+b.dataset.exh),0,6)});}));
$("bInsp").addEventListener("click",()=>{if(state)save({insp:!state.insp});});
$("bShort").addEventListener("click",()=>{if(!state)return;const p={};
  const rs=CFG.resources.filter(r=>r.reset==="short");if(rs.length){p.res={...state.res};rs.forEach(r=>p.res[r.id]=Math.max(0,p.res[r.id]-(r.shortRecover||r.max)));}
  save(p);flash(CFG.shortRestMsg||"Descanso corto: gasta dados de golpe si los necesitas.");});
$("bLong").addEventListener("click",()=>{
  const b=$("bLong");
  if(!b.dataset.armed){b.dataset.armed="1";b.textContent="Confirmar descanso largo";setTimeout(()=>{delete b.dataset.armed;b.textContent="Descanso largo";},3500);return;}
  delete b.dataset.armed;b.textContent="Descanso largo";
  if(state) save({hp:hpMax(),temp:0,hd:{...DEFAULT.hd},slots:{...DEFAULT.slots},res:{...DEFAULT.res},death:{s:0,f:0},effects:[],conc:null,exh:Math.max(0,(state.exh||0)-1),swapUsed:false,swapRem:false,swapFree:false});
  concAsk=null; flash("Descanso largo: recursos repuestos, efectos terminados, −1 Cansancio.");
});
$("gearForm").addEventListener("submit",async e=>{
  e.preventDefault(); const name=$("gearName").value.trim(); if(!name) return;
  const doc={name,kind:"gear",cat:$("gearCat").value,loc:$("gearLoc").value.trim()||"Sin asignar",qty:Math.max(1,parseInt($("gearQty").value,10)||1),note:$("gearNote").value.trim(),equipped:false,order:Date.now()};
  $("gearName").value="";$("gearNote").value="";$("gearQty").value="1";
  if(!db){items.push({...doc,_id:"local"+Date.now()});render();setSync("Sin guardado: esta vista no puede escribir",true);return;}
  try{await db.collection(NS+"items").add(doc);setSync("Guardado");}catch(err){handleWriteErr(err);}
});


/* ---------- grimorio ---------- */
let gFilter="all", gQ="";
document.querySelectorAll("[data-gf]").forEach(b=>b.addEventListener("click",()=>{gFilter=b.dataset.gf;document.querySelectorAll("[data-gf]").forEach(x=>x.setAttribute("aria-pressed",x===b?"true":"false"));renderGrimoire();}));
const gq=$("grimQ"); if(gq) gq.addEventListener("input",()=>{gQ=gq.value.trim().toLowerCase();renderGrimoire();});
function renderGrimoire(){
  const box=$("grimBox"); if(!box||!CFG.grimoire) return;
  const prep=prepList(), max=prepMax(), maxLvl=prepMaxLvl();
  const used=state?!!state.swapUsed:false, free=state?!!state.swapFree:false, rem=state?!!state.swapRem:false;
  $("grimCount").textContent=`${prep.length}/${max} preparados · conjuros hasta nivel ${maxLvl}`;
  $("grimRule").textContent=G.rule; if(G.title) $("hGrim").firstChild.textContent=G.title+" ";
  const sw=$("grimSwap");
  const canAdd=id=>{if(prep.includes(id)||G.always.includes(id)) return false; if(prep.length>=max) return false; if(free) return true; if(!rem&&prep.length<max) return true; return !used;};
  sw.innerHTML=`<span class="${used&&!free?"warn":""}">${free?"Cambio libre autorizado por el GM hasta el próximo descanso largo.":used?"Ya usaste tu cambio de este descanso largo.":prep.length<max?(rem?"Quitaste uno: prepara otro para completar tu cambio de este descanso largo.":"Tienes cupo libre: puedes preparar sin gastar el cambio."):"Puedes cambiar 1 conjuro hasta el próximo descanso largo."}</span>`;
  if(state&&!free){const b=document.createElement("button");b.type="button";b.className="btn ghost";b.textContent="El GM lo permitió";b.title="Permite más cambios hasta el próximo descanso largo";b.onclick=()=>save({swapFree:true});sw.appendChild(b);}
  const q=gQ;
  const list=CFG.spells.filter(s=>!s.g&&!s.fixed&&!G.always.includes(s.id)).filter(s=>{
    if(gFilter==="prep") return prep.includes(s.id);
    if(gFilter==="l1") return s.lvl===1; if(gFilter==="l2") return s.lvl===2;
    if(gFilter==="conc") return !!s.conc; if(gFilter==="noconc") return !s.conc;
    if(gFilter==="ritual") return (s.src||[]).includes("ritual");
    return true;
  }).filter(s=>!q||(s.n+" "+s.en+" "+(s.tag||"")+" "+(s.d||"")).toLowerCase().includes(q))
    .sort((a,b)=>a.lvl-b.lvl||a.n.localeCompare(b.n,"es"));
  box.innerHTML="";
  if(!list.length){box.innerHTML=`<div class="empty">Ningún conjuro con ese filtro.</div>`;return;}
  let lastLvl=null, col=null;
  list.forEach(s=>{
    if(s.lvl!==lastLvl){lastLvl=s.lvl;box.insertAdjacentHTML("beforeend",`<div class="spg group">Nivel ${s.lvl}${s.lvl>maxLvl?" · aún sin espacios":""}</div>`);col=document.createElement("div");col.className="gcols";box.appendChild(col);}
    const on=prep.includes(s.id), d=document.createElement("details"); d.className="gi"+(on?" on":"")+(s.lvl>maxLvl?" lock":"");
    const flags=[s.conc?"Concentración":"",(s.src||[]).includes("ritual")?"Ritual":""].filter(Boolean);
    d.innerHTML=`<summary><span class="gtop"><b>${esc(s.n)}</b>${on?'<span class="gbadge">Preparado</span>':""}</span><span class="en">${esc(s.en)}</span><span class="gmeta"><span class="gtag">${esc(s.tag||"")}</span>${flags.map(f=>`<span class="gflag">${f}</span>`).join("")}</span></summary><div class="more"><div class="meta">${esc(s.meta||"")}</div><p>${esc(s.d||"")}</p>${s.up?`<p class="up"><b>Nivel superior.</b> ${esc(s.up)}</p>`:""}${s.note?`<p class="note">🟡 ${esc(s.note)}</p>`:""}${s.gap?`<p class="note">⏳ Ficha pendiente: no está en la transcripción de Notion.</p>`:""}</div>`;
    const more=d.querySelector(".more"), row=document.createElement("div"); row.className="cast";
    const b=document.createElement("button"); b.type="button";
    if(on){b.className="btn ghost";b.textContent="Quitar";b.onclick=()=>save({prepared:prep.filter(x=>x!==s.id),swapRem:true});}
    else{b.className="btn go";b.textContent="Preparar";const ok=canAdd(s.id)&&s.lvl<=maxLvl;b.disabled=!state||!ok;
      b.title=!state?"":s.lvl>maxLvl?"Sin espacios de ese nivel":prep.length>=max?"Quita uno primero":(!ok?"Ya usaste el cambio de este descanso largo":"");
      b.onclick=()=>{const countsSwap=rem||prep.length>=max;save({prepared:[...prep,s.id],swapUsed:(used||(countsSwap&&!free))});};}
    row.appendChild(b); if(b.disabled&&b.title) row.insertAdjacentHTML("beforeend",`<span class="note">${esc(b.title)}</span>`); more.appendChild(row); col.appendChild(d);
  });
}

/* ---------- subir de nivel ---------- */
let luPick=null, lastLvKey="";
function renderLevelUp(){
  const L=CFG.levelUp, box=$("luBox"); const lsec=box&&box.closest("section"); if(lsec) lsec.hidden=!L; if(!L||!box||!state) return;
  const key=JSON.stringify(state.levels||[])+"|"+luPick;
  if(key===lastLvKey) return; lastLvKey=key;
  const next=clsLvl("Personaje")+1;
  let h=`<p class="lu-now">Hoy: <b>${CFG.classOrder.filter(c=>clsLvl(c)>0).map(c=>c+" "+clsLvl(c)).join(" · ")}</b> · nivel ${next-1}. Próximo: <b>nivel ${next}</b>.</p><div class="luo">`;
  CFG.classOrder.forEach(c=>{
    const nl=clsLvl(c)+1, d0=(L.defs[c]||{})[nl], k=L.classes[c];
    const col=treeCol(c), needSub=col&&col.sub&&col.sub.opts&&!subFixed(c)&&nl===col.sub.at, so=subOpt(c);
    if(d0&&needSub&&!so){h+=`<div class="lucard off"><b>${esc(c)} ${nl}</b><p>Primero elige la subclase en el Árbol (página 4).</p></div>`;return;}
    const sg2=so&&so.lv[nl]?so.lv[nl].map(([n,ds])=>`${so.n} · ${n}: ${ds}`):[];
    const d=d0?{...d0,gains:[...d0.gains,...sg2]}:null;
    if(!d&&needSub){h+=`<div class="lucard off"><b>${esc(c)} ${nl}</b><p>${so?`Subclase reservada: <b>${esc(so.n)}</b>. `:"Elige la subclase en el Árbol. "}El resto de este nivel lo preparamos en el chat cuando toque.</p></div>`;return;}
    if(!d){h+=`<div class="lucard off"><b>${esc(c)} ${nl}</b><p>Lo preparamos en el chat cuando toque.</p></div>`;return;}
    const on=luPick===c;
    h+=`<div class="lucard${on?" on":""}"><button type="button" class="lupick" data-lu="${esc(c)}" aria-pressed="${on}"><b>${esc(c)} ${nl}</b><span>+1d${k.die} PG · dado de golpe d${k.die}</span></button>${on?`<ul>${d.gains.map(g=>`<li>${esc(g)}</li>`).join("")}</ul>
      <div class="luhp"><span class="lbl">Puntos de golpe</span>
        <label><input type="radio" name="luhp" value="fixed" checked> Valor fijo: <b class="num">${k.fixed}${M.con?sg(M.con):""}</b></label>
        <label><input type="radio" name="luhp" value="roll"> Tirada de 1d${k.die}: <input type="number" id="luRoll" min="1" max="${k.die}" inputmode="numeric" aria-label="Resultado del dado" style="width:64px"></label>
      </div><button type="button" class="btn go" id="luGo">Subir a ${esc(c)} ${nl}</button>`:""}</div>`;
  });
  (L.pending||[]).forEach(([c,why])=>h+=`<div class="lucard off"><b>${esc(c)} 1 <span class="chip gold">⏳ pendiente</span></b><p>${esc(why)}</p></div>`);
  h+=`</div>`;
  const hist=state.levels||[];
  if(hist.length){h+=`<div class="luh"><span class="lbl">Subidas registradas</span>${hist.map((l,i)=>`<div class="lg"><span class="dt">${esc((l.at||"").slice(0,10).split("-").reverse().join("-"))}</span><span class="c">Nivel ${HP_LEVEL0+i+1}: ${esc(l.cls)} ${l.cl} · +${l.hp} PG (${l.how==="roll"?"tirada":"fijo"})</span><span></span><span></span></div>`).join("")}</div>`;}
  h+=`<p class="note">${esc(L.note)}</p>`;
  box.innerHTML=h;
  box.querySelectorAll("[data-lu]").forEach(b=>b.onclick=()=>{luPick=luPick===b.dataset.lu?null:b.dataset.lu;renderLevelUp();});
  const go=$("luGo");
  if(go){go.onclick=()=>{
    if(!go.dataset.armed){go.dataset.armed="1";go.textContent="Confirmar subida";setTimeout(()=>{if(go.isConnected){delete go.dataset.armed;go.textContent="Subir a "+luPick+" "+(clsLvl(luPick)+1);}},3500);return;}
    const c=luPick,k=L.classes[c],how=box.querySelector('input[name="luhp"]:checked').value;
    let base=k.fixed; if(how==="roll"){const r=parseInt($("luRoll").value,10);if(!(r>=1&&r<=k.die)){flash(`Anota un resultado entre 1 y ${k.die}.`);return;}base=r;}
    const gain=Math.max(1,base+M.con);
    const now=new Date(),at=new Date(now.getTime()-now.getTimezoneOffset()*60000).toISOString().slice(0,19);
    const lv={cls:c,cl:clsLvl(c)+1,hd:k.hd,hp:gain,how,at};
    luPick=null;
    save({levels:[...(state.levels||[]),lv]});
    renderFeats(); renderId();
    flash(`Subiste a ${c} ${lv.cl}: +${gain} PG máximos.`);
  };}
  if(hist.length){
    const last=box.querySelectorAll(".luh .lg"), row=last[last.length-1];
    row.lastElementChild.replaceWith(armBtn("Deshacer",()=>{save({levels:hist.slice(0,-1),hp:Math.min(state.hp,hpMax()-hist[hist.length-1].hp)});renderFeats();renderId();flash("Se deshizo la última subida.");}));
  }
}

/* ---------- árbol de progresión ---------- */
let tSel=null, tKey="";let tSubView=null;
function treeState(cls,L){
  const have=clsLvl(cls), total=clsLvl("Personaje"), room=CFG.tree.maxTotal-total;
  if(L<=have) return "own";
  if(L===have+1&&room>0) return "nxt";
  if(L<=have+room) return "fut";
  return "out";
}
function renderTree(){
  const T=CFG.tree, box=$("treeBox"); if(!T||!box||!state) return;
  const key=JSON.stringify(state.levels||[])+"|"+JSON.stringify(state.sub||{})+"|"+(tSel?tSel.join(":"):"");
  if(key===tKey) return; tKey=key;
  const total=clsLvl("Personaje");
  $("treeLvl").textContent=`nivel ${total} · ${T.maxTotal-total} niveles por repartir`;
  $("treeNote").textContent=T.note;
  if(!tSel){const c=T.cols.find(c=>!c.pending&&c.levels[clsLvl(c.cls)+1]);tSel=c?[c.cls,clsLvl(c.cls)+1]:null;}
  box.innerHTML="";
  T.cols.forEach(col=>{
    const cdiv=document.createElement("div"); cdiv.className="tcol "+(col.tone||"jade");
    if(col.pending){cdiv.classList.add("pend");cdiv.innerHTML=`<header><b>${esc(col.cls)}</b><span class="chip gold">⏳ pendiente</span></header><p class="note">${esc(col.pending)}</p>`;box.appendChild(cdiv);return;}
    const have=clsLvl(col.cls);
    cdiv.innerHTML=`<header><b>${esc(col.cls)}</b><span>nivel ${have}</span></header><ol class="tnodes"></ol>`;
    const ol=cdiv.querySelector("ol");
    Object.keys(col.levels).map(Number).sort((a,b)=>a-b).forEach(L=>{
      const lv=col.levels[L], st=treeState(col.cls,L);
      const sel=tSel&&tSel[0]===col.cls&&tSel[1]===L;
      const names=lv.f.map(x=>x[0]);
      const isPh=n=>/^(subclase|rasgo de subclase)/i.test(n);
      const base=names.filter(n=>!isPh(n));
      const opts=(col.sub&&col.sub.opts)||[];
      const ch=subOpt(col.cls);
      const chAt=ch&&ch.lv[L]?ch.lv[L].map(x=>x[0]):null;
      const optAt=!ch?opts.filter(o=>o.lv[L]):[];
      let title=base[0]||(chAt?ch.n+": "+chAt.join(" · "):names[0]);
      let subLines="";
      if(chAt&&base.length) subLines=`<small class="tsl1"><i>${esc(ch.n)}</i> ${esc(chAt.join(" · "))}</small>`;
      else if(optAt.length) subLines=optAt.map(o=>`<small class="tsl1 alt"><i>${esc(o.n)}</i> ${esc(o.lv[L].map(x=>x[0]).join(" · "))}</small>`).join("");
      const tag=lv.sa?`Furtivo ${lv.sa}`:lv.art?`Planes ${lv.art.plans} · prep. ${lv.art.prep}`:lv.loh?`Manos ${lv.loh} · espacios ${(lv.sl||[]).join("/")}`:lv.sl?`Espacios ${lv.sl.join("/")}`:"";
      const li=document.createElement("li"); li.className=`tn ${st}${sel?" sel":""}${lv.asi?" asi":""}${lv.branch?" br":""}`;
      li.innerHTML=`<button type="button" aria-pressed="${sel}"><span class="dot">${L}</span><span class="tx"><b>${esc(title)}</b>${base.length>1?`<small>+ ${esc(base.slice(1).join(" · "))}</small>`:""}${subLines}${tag?`<small class="tg">${esc(tag)}</small>`:""}</span></button>`;
      li.querySelector("button").onclick=()=>{tSel=[col.cls,L];renderTree();openTreeDet();};
      ol.appendChild(li);
      if(lv.branch&&col.sub&&col.sub.opts&&subChosen(col.cls)){
        const br=document.createElement("li"); br.className="tbranch";
        br.innerHTML=col.sub.opts.map(o=>`<span class="bn${subChosen(col.cls)===o.id?" on":""}">${esc(o.n)}</span>`).join("");
        ol.appendChild(br);
      }
    });
    box.appendChild(cdiv);
  });
  renderTreeDet();
}
function renderTreeDet(){
  const det=$("treeDet"), T=CFG.tree;
  if(!tSel){det.innerHTML=`<p class="mute">Toca un nodo para ver qué da.</p>`;return;}
  const [cls,L]=tSel, col=T.cols.find(c=>c.cls===cls), lv=col.levels[L], st=treeState(cls,L);
  const lab={own:"Lo tienes",nxt:"Disponible en tu próxima subida",fut:"Futuro",out:"Fuera de alcance: superaría el nivel 20"}[st];
  let h=`<div class="tdh"><button type="button" class="btn ghost tclose" aria-label="Cerrar">✕</button><span class="dot ${st}">${L}</span><div><b>${esc(cls)} ${L}</b><small>${lab}</small></div></div>`;
  lv.f.filter(x=>x[1]).forEach(([n,d])=>h+=`<div class="tf"><b>${esc(n)}</b><p>${esc(d)}</p></div>`);
  let subOpts=null;
  if(lv.branch||lv.subl){
    const opts=(col.sub.opts||[]).filter(o=>o.lv[L]);
    if(opts.length){
      subOpts=opts;
      const chId=subChosen(cls), fixed=subFixed(cls), locked=fixed||clsLvl(cls)>=col.sub.at;
      if(!opts.some(o=>o.id===tSubView)) tSubView=chId||opts[0].id;
      const o=opts.find(x=>x.id===tSubView);
      const lvKeys=Object.keys(o.lv).map(Number).sort((a,b)=>a-b);
      const chN=chId?(opts.find(x=>x.id===chId)||{}).n:"";
      h+=`<div class="tsub"><span class="lbl">${esc(col.sub.label)}${chId?" · elegida: "+esc(chN):" · aún sin elegir · compara las opciones"}</span>
      <div class="ttabs" role="tablist">${opts.map(x=>`<button type="button" role="tab" class="ttab${x.id===tSubView?" on":""}${x.id===chId?" pick":""}" data-sub="${x.id}" aria-selected="${x.id===tSubView}">${x.id===chId?"✓ ":""}${esc(x.n)}</button>`).join("")}</div>
      <div class="tsv"><div class="tsvh"><b>${esc(o.n)}</b> <span class="en">(${esc(o.en)})</span>${o.tag?`<em>${esc(o.tag)}</em>`:""}</div>
      <div class="tsvl">${lvKeys.map(k=>`<div class="tsl${k===L?" cur":""}"><span class="tsk">Nv ${k}</span><div>${o.lv[k].map(([n,d])=>`<p><b>${esc(n)}.</b> ${esc(d)}</p>`).join("")}</div></div>`).join("")}</div>
      <div class="tpick">${locked?`<p class="note">${fixed?"Subclase fija de este personaje.":`Ya estás en ${esc(cls)} ${col.sub.at} o más: para cambiarla, lo vemos en el chat.`}</p>`:o.id===chId?`<span class="chip adv">✓ Elegida para ${esc(cls)} ${col.sub.at}</span><button type="button" class="btn ghost" id="tUnpick">Quitar elección</button>`:`<button type="button" class="btn go" id="tPick">Elegir ${esc(o.n)}</button><span class="note">Queda reservada: sus rasgos se activan en la hoja al subir a ${esc(cls)} ${col.sub.at}.</span>`}</div></div>`;
    }
  }
  const meta=[]; if(lv.art){meta.push(`Planes ${lv.art.plans} · Objetos ${lv.art.items}`);meta.push(`Trucos ${lv.art.cantrips} · Preparados ${lv.art.prep}`);} if(lv.sa) meta.push(`Ataque furtivo ${lv.sa}`); if(lv.fe) meta.push(`Marca gratis ${lv.fe} veces`); if(lv.prep) meta.push(`Preparados ${lv.prep}`); if(lv.loh) meta.push(`Imponer las manos ${lv.loh}`); if(lv.cd) meta.push(`Canalizar ×${lv.cd}`); if(lv.sl) meta.push(`Espacios ${lv.sl.map((n,i)=>`${n}×nv${i+1}`).join(" · ")}`);
  if(meta.length) h+=`<div class="acrow">${meta.map(m=>`<span>${esc(m)}</span>`).join("")}</div>`;
  if(st==="nxt"){
    const can=CFG.levelUp&&(CFG.levelUp.defs[cls]||{})[L];
    h+=can?`<button type="button" class="btn go" id="tGo">Subir a ${esc(cls)} ${L}</button>`:`<p class="note">Este nivel lo preparamos en el chat antes de subir.</p>`;
  }
  det.innerHTML=h;
  const go=$("tGo"); if(go) go.onclick=()=>{luPick=cls;lastLvKey="";renderLevelUp();closeTreeDet();document.getElementById("hLu").scrollIntoView({behavior:"smooth"});};
  det.querySelectorAll(".ttab").forEach(b=>b.onclick=()=>{tSubView=b.dataset.sub;renderTreeDet();});
  const tp=$("tPick"); if(tp) tp.onclick=()=>{const c=tSel[0];save({sub:{...(state.sub||{}),[c]:tSubView}});tKey="";lastLvKey="";renderTree();renderLevelUp();flash(`Subclase de ${c} elegida.`);};
  const tu=$("tUnpick"); if(tu) tu.onclick=()=>{const c=tSel[0],s={...(state.sub||{})};delete s[c];save({sub:s});tKey="";lastLvKey="";renderTree();renderLevelUp();};
  det.querySelector(".tclose").onclick=closeTreeDet;
}
const openTreeDet=()=>$("treeDet").classList.add("open");
const closeTreeDet=()=>$("treeDet").classList.remove("open");

/* ---------- recetario ---------- */
const ICON={
 spikes:'<path d="M4 18l4-8 4 8M10 18l4-9 4 9M3 18h18"/>',
 balls:'<circle cx="7" cy="14" r="3"/><circle cx="15" cy="10" r="3"/><circle cx="16" cy="17" r="2.2"/>',
 net:'<path d="M4 5c5 3 11 3 16 0M4 12c5 3 11 3 16 0M4 19c5-3 11-3 16 0M7 4v16M12 5v14M17 4v16"/>',
 bola:'<circle cx="6" cy="17" r="2.5"/><circle cx="18" cy="17" r="2.5"/><path d="M8 15.5C10 9 14 9 16 15.5M12 11V5"/><circle cx="12" cy="4" r="1.5"/>',
 sling:'<path d="M4 4l6 10M20 4l-6 10M10 14q2 3 4 0"/><circle cx="12" cy="17" r="2"/>',
 shot:'<circle cx="8" cy="9" r="2.4"/><circle cx="15" cy="8" r="2.4"/><circle cx="11" cy="15" r="2.4"/><circle cx="17" cy="15" r="2"/>',
 flame:'<path d="M12 3c2.5 3.5 5 5.5 5 9a5 5 0 0 1-10 0c0-1.4.6-2.6 1.5-3.8.6 1 1.3 1.6 2 1.8C10 8.5 10.5 5.6 12 3Z"/>',
 vial:'<path d="M10 3h4M10.5 3v6L6 18a2 2 0 0 0 1.8 3h8.4A2 2 0 0 0 18 18l-4.5-9V3"/><path d="M8 15h8"/>',
 drop:'<path d="M12 3c3.5 4.5 6 7.5 6 11a6 6 0 0 1-12 0c0-3.5 2.5-6.5 6-11Z"/>',
 bottle:'<path d="M10 3h4v4l2 3v10a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V10l2-3Z"/><path d="M8 13h8"/>',
 poison:'<path d="M10 3h4v4l3 4v9H7v-9l3-4Z"/><path d="M10 13l4 4M14 13l-4 4"/>',
 jar:'<path d="M8 4h8M9 4v2c-3 1-4 3-4 6v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6c0-3-1-5-4-6V4"/>'
};
const ic=k=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON[k]||ICON.vial}</svg>`;
const ST={craft:["Fabricable","ok"],buy:["Solo compra","buy"],gm:["Validado GM","gm"]};
let recFilter="all", recBuilt=false;
function invCount(name){
  if(!loaded||!name) return null;
  const low=name.toLowerCase();
  const hit=items.filter(i=>String(i.name).toLowerCase().startsWith(low));
  if(!hit.length) return null;
  const q=hit.reduce((a,i)=>a+(typeof i.qty==="number"?i.qty:1),0);
  return {q,loc:hit.map(i=>i.equipped?"equipado":locOf(i)).filter((v,i,a)=>a.indexOf(v)===i).join(", ")};
}
function renderRecipes(){
  const R=CFG.craft, box=$("recBox"); const rsec=document.querySelector(".recipes"); if(rsec) rsec.hidden=!R; if(!R||!box) return;
  if(!recBuilt){
    recBuilt=true;
    box.innerHTML=`<div class="howto">${R.rules.map(([h,t],i)=>`<div class="step"><span class="n num">${i+1}</span><b>${esc(h)}</b><p>${esc(t)}</p></div>`).join("")}</div>
    <div class="perks">${R.perks.map(([h,t])=>`<div class="perk"><b>${esc(h)}</b><p>${esc(t)}</p></div>`).join("")}<div class="perk tools"><b>Tus herramientas</b><p>${R.tools.map(t=>`<span class="tchip">${esc(t)}</span>`).join(" ")}</p></div></div>
    <div class="recbar"><div class="ftabs" role="group" aria-label="Filtrar recetas">
      <button type="button" class="cond" data-rf="all" aria-pressed="true">Todas</button>
      <button type="button" class="cond" data-rf="craft" aria-pressed="false">Fabricables</button>
      <button type="button" class="cond" data-rf="gm" aria-pressed="false">Validados GM</button>
      <button type="button" class="cond" data-rf="buy" aria-pressed="false">Solo compra</button>
      <button type="button" class="cond" data-rf="have" aria-pressed="false">En inventario</button></div></div>
    <div id="recList"></div><p class="note">${esc(R.note)}</p>`;
    box.querySelectorAll("[data-rf]").forEach(b=>b.addEventListener("click",()=>{recFilter=b.dataset.rf;box.querySelectorAll("[data-rf]").forEach(x=>x.setAttribute("aria-pressed",x===b?"true":"false"));renderRecipes();}));
  }
  const list=$("recList"); list.innerHTML="";
  R.groups.forEach(([g,label])=>{
    const its=R.items.filter(r=>r.g===g).filter(r=>recFilter==="all"||(recFilter==="have"?!!invCount(r.inv):r.st===recFilter));
    if(!its.length) return;
    list.insertAdjacentHTML("beforeend",`<div class="group">${esc(label)}</div>`);
    const grid=document.createElement("div"); grid.className="rcs";
    its.forEach(r=>{
      const [sl,sc]=ST[r.st]; const have=invCount(r.inv);
      const recipe=r.st==="buy"
        ? `<div class="buyb"><div class="price"><span class="old num">${esc(r.buy[0])}</span><b class="num">${esc(r.buy[1])}</b><small>con tu descuento</small></div><p class="why">Para fabricarla necesitas ${esc(r.tool[0])} <span class="no">✘</span></p>${r.alt?`<p class="why">${esc(r.alt)}</p>`:""}</div>`
        : `<div class="recipe"><div class="tool"><span class="${r.tool[1]?"yes":"no"}">${r.tool[1]?"✔":"✘"}</span> ${esc(r.tool[0])}</div><ul class="mats">${r.mats.map(([m,v])=>`<li><span>${esc(m)}</span><b>${esc(v)}</b></li>`).join("")}</ul><div class="pills"><span class="pill">⏱ ${esc(r.time)}</span>${r.fast?'<span class="pill fast">Gratis con Fabricación rápida</span>':""}</div></div>`;
      grid.insertAdjacentHTML("beforeend",`<article class="rc ${sc}"><header><span class="ico">${ic(r.ic)}</span><div class="tt"><b>${esc(r.n)}</b><small>${esc(r.unit)}</small></div><span class="st ${sc}">${sl}</span></header><p class="eff">${esc(r.eff)}</p>${recipe}${have?`<div class="have">En inventario: <b class="num">×${have.q}</b> · ${esc(have.loc)}</div>`:""}</article>`);
    });
    list.appendChild(grid);
  });
  if(!list.children.length) list.innerHTML=`<div class="empty">Nada con ese filtro.</div>`;
}

/* ---------- crónica e ilustración ---------- */
function renderStory(){
  const S=CFG.story; if(!S) return;
  $("hStory").textContent=S.title;
  let h="";
  S.sections.forEach(s=>{
    if(s.h) h+=`<h3>${esc(s.h)}</h3>`;
    s.p.forEach(p=>h+=`<p>${esc(p)}</p>`);
    if(s.quotes) h+=`<ul class="quotes">${s.quotes.map(q=>`<li>«${esc(q)}»</li>`).join("")}</ul>`;
  });
  if(S.people){h+=`<h3>Personajes clave</h3><div class="people">`+S.people.map(([n,d,st])=>`<div class="pp"><b>${esc(n)}</b><span class="chip gold">${esc(st)}</span><p>${esc(d)}</p></div>`).join("")+`</div>`;}
  if(S.mysteries){h+=`<h3>Misterios abiertos</h3><ul class="myst">${S.mysteries.map(m=>`<li>${esc(m)}</li>`).join("")}</ul>`;}
  if(S.closing) h+=`<p class="quote">«${esc(S.closing)}»</p>`;
  $("storyBox").innerHTML=h;
}
let assetsApi=null, portrait=null;
function renderPortrait(){
  const img=$("portraitImg"), ph=$("portraitPh"), heroAv=$("heroAv");
  const id=portrait&&portrait.asset;
  if(id){img.src="/_blob/"+id; img.alt=CFG.story.portraitAlt; img.hidden=false; ph.hidden=true;
    img.onerror=()=>{img.hidden=true;ph.hidden=false;$("portraitMsg").textContent="No se pudo cargar la ilustración.";};
    if(heroAv){heroAv.src="/_blob/"+id; heroAv.hidden=false;}}
  else{img.hidden=true; ph.hidden=false; $("portraitMsg").textContent=assetsApi?"Sube una imagen (PNG, JPG o WebP, hasta 20 MB).":"Aún no hay ilustración."; if(heroAv) heroAv.hidden=true;}
  $("portraitActs").hidden=!assetsApi;
  $("portraitBtn").textContent=id?"Cambiar ilustración":"Subir ilustración";
}
$("portraitFile").addEventListener("change",async ev=>{
  const f=ev.target.files&&ev.target.files[0]; ev.target.value=""; if(!f||!assetsApi||!db) return;
  setSync("Subiendo ilustración…");
  try{
    const r=await assetsApi.upload(f);
    const old=portrait&&portrait.asset;
    await db.doc(NS+"sheet/portrait").set({asset:r.id});
    portrait={asset:r.id}; renderPortrait(); setSync("Ilustración guardada");
    if(old&&old!==r.id){try{await assetsApi.delete(old);}catch(_){}}
  }catch(e){
    const m={too_large:"La imagen pesa más de 20 MB.",unsupported_type:"Formato no soportado: usa PNG, JPG, WebP o GIF.",quota_or_state:"No queda espacio para imágenes en esta hoja.",rate_limited:"Demasiados intentos; espera un momento."}[e&&e.code];
    setSync(m||"No se pudo subir la ilustración.",true);
  }
});

/* ---------- arranque ---------- */
renderStatic(); buildSpells(); renderFeats(); renderStory(); renderPortrait(); render();
(async()=>{
  db=window.claude&&window.claude.use?await window.claude.use("db"):null;
  if(!alive) return;
  if(!db){loaded=true;goldLoaded=true;state=norm({});renderFeats();render();setSync("Sin conexión al guardado: los cambios no se conservan",true);return;}
  try{assetsApi=window.claude.use?await window.claude.use("assets"):null;}catch(_){assetsApi=null;}
  UNSUBS.push(db.doc(NS+"sheet/portrait").onSnapshot(s=>{portrait=s.exists?s.data():null;renderPortrait();},()=>{}));
  renderPortrait();
  stateRef=db.doc(NS+"sheet/state");
  const timer=setTimeout(()=>alive&&setSync("No se puede leer el estado todavía",true),10000);
  UNSUBS.push(stateRef.onSnapshot(snap=>{
    if(snap.metadata.hasPendingWrites) return;
    const prevL=JSON.stringify([lvls(),state&&state.sub]); state=norm(snap.exists?snap.data():{}); if(JSON.stringify([lvls(),state.sub])!==prevL){renderFeats();renderId();}
    if(!snap.metadata.fromCache){clearTimeout(timer);if(!$("sync").classList.contains("warn"))setSync("Guardado");}
    render();
  },()=>{clearTimeout(timer);setSync("No se puede leer el estado",true);}));
  UNSUBS.push(db.collection(NS+"gold").onSnapshot(q=>{gold=q.docs.map(x=>({...x.data(),_id:x.id}));goldLoaded=true;render();},()=>{goldLoaded=true;setSync("No se puede leer el oro",true);render();}));
  UNSUBS.push(db.collection(NS+"items").onSnapshot(q=>{items=q.docs.map(x=>({...x.data(),_id:x.id}));loaded=true;render();},()=>{loaded=true;setSync("No se puede leer el equipo",true);render();}));
})();
return ()=>{alive=false;UNSUBS.splice(0).forEach(u=>{try{u();}catch(_){}});};
})();
