import asyncio, json, random, sys
from playwright.async_api import async_playwright
STORE=open('store.json').read(); MOCK=open('mock.js').read()
URL="file:///home/claude/diendi_characters/artefactos/mesa/mesa.html"
CHARS=sys.argv[1].split(',') if len(sys.argv)>1 else ['usoryn','kiyaj','yevelda','auriana','darvin']
N=int(sys.argv[2]) if len(sys.argv)>2 else 300
CHECK="""()=>{const t=document.getElementById('app').innerText;const bad=[];
 for(const w of ['NaN','undefined','[object Object]','null PG','Infinity']) if(t.includes(w)) {const i=t.indexOf(w);bad.push(w+' @ '+t.slice(Math.max(0,i-60),i+40).replace(/\\n/g,' '));}
 const hp=document.getElementById('hpCur'); if(hp){const v=+hp.textContent; const mx=+((document.getElementById('hpMaxL')||{}).textContent||'').replace(/\\D/g,''); if(!(v>=0)||(mx&&v>mx)) bad.push('hp fuera de rango '+hp.textContent+'/'+mx);}
 document.querySelectorAll('.pip').length; return bad;}"""
async def run(p,ch,seed):
    random.seed(seed)
    b=await p.chromium.launch(); pg=await b.new_page(viewport={"width":1120,"height":900})
    errs=[]; issues=set(); log=[]
    pg.on("pageerror",lambda e:errs.append(("pageerror",str(e)[:300],list(log[-3:]))))
    pg.on("console",lambda m: m.type=="error" and errs.append(("console",m.text[:300],list(log[-3:]))))
    pg.on("dialog",lambda d: asyncio.ensure_future(d.accept()))
    await pg.add_init_script("window.__STORE__="+STORE+";\n"+MOCK)
    await pg.goto(URL+"#/"+ch); await pg.wait_for_timeout(800)
    for x in await pg.evaluate(CHECK): issues.add(("load",x))
    for i in range(N):
        cands=await pg.evaluate("""()=>{const out=[];document.querySelectorAll('#app button, #app select, #app summary, #app input[type=checkbox]').forEach((e,k)=>{
          if(e.disabled||e.id==='portraitBtn') return; const r=e.getBoundingClientRect(); if(!r.width||!r.height) return;
          if(e.closest('details:not([open])')&&e.tagName!=='SUMMARY') return;
          e.setAttribute('data-qa',k); out.push([k,e.tagName,(e.textContent||e.getAttribute('aria-label')||'').trim().slice(0,40)]);});return out;}""")
        if not cands: break
        k,tag,txt=random.choice(cands)
        log.append(f"{tag}:{txt}")
        try:
            if tag=='SELECT':
                await pg.evaluate("""k=>{const s=document.querySelector('[data-qa="'+k+'"]');const o=[...s.options].filter(o=>o.value);if(o.length){s.value=o[Math.floor(Math.random()*o.length)].value;s.dispatchEvent(new Event('change',{bubbles:true}));}}""",k)
            else:
                await pg.evaluate("k=>document.querySelector('[data-qa=\"'+k+'\"]').click()",k)
        except Exception as e: errs.append(("click",str(e)[:200],log[-1]))
        await pg.wait_for_timeout(random.choice([5,20,60]))
        if i%10==0:
            for x in await pg.evaluate(CHECK): issues.add((log[-1],x))
    await pg.wait_for_timeout(1500)
    # consistency: UI state vs stored state
    ui=await pg.evaluate("()=>document.getElementById('hpCur').textContent")
    st=await pg.evaluate(f"()=>window.__DB__['c/{ch}/sheet/state']&&window.__DB__['c/{ch}/sheet/state'].hp")
    if str(ui)!=str(st): issues.add(("sync","UI hp "+str(ui)+" vs guardado "+str(st)))
    inv=await pg.evaluate(f"""()=>{{const s=window.__DB__['c/{ch}/sheet/state']||{{}};const C=window.CHAR;const out=[];
      const G=C.grimoire; if(G&&Array.isArray(s.prepared)){{const L=(s.levels||[]).length;}}
      Object.entries(s.res||{{}}).forEach(([k,v])=>{{const r=(C.resources||[]).find(x=>x.id===k);if(r&&(v<0||v>r.max))out.push('recurso '+k+'='+v+' max '+r.max);}});
      Object.entries(s.slots||{{}}).forEach(([k,v])=>{{if(v<0)out.push('espacio '+k+'='+v);}});
      if(s.temp<0)out.push('temp<0'); if((s.exh||0)<0||(s.exh||0)>6)out.push('exh '+s.exh);
      const gc=document.getElementById('grimCount'); if(gc&&/(\\d+)\\s*\\/\\s*(\\d+)/.test(gc.textContent)){{const m=gc.textContent.match(/(\\d+)\\s*\\/\\s*(\\d+)/);if(+m[1]>+m[2])out.push('grimorio '+gc.textContent);}}
      return out;}}""")
    for x in inv: issues.add(("invariante",x))
    await b.close()
    return errs, issues
async def main():
    async with async_playwright() as p:
        for ch in CHARS:
            errs,issues=await run(p,ch,hash(ch)%1000)
            print("=====",ch,"errores:",len(errs),"anomalías:",len(issues))
            seen=set()
            for e in errs:
                if e[1] in seen: continue
                seen.add(e[1]); print("  ERR",e[0],e[1],"| tras:",e[2])
            for x in list(issues)[:15]: print("  ISS",x)
asyncio.run(main())
