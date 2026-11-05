import asyncio, json, sys
from playwright.async_api import async_playwright
STORE=open('store.json').read(); MOCK=open('mock.js').read()
U="file:///home/claude/diendi_characters/artefactos/mesa/mesa.html#/"
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        for ch in sys.argv[1].split(','):
            pg=await b.new_page(viewport={"width":1120,"height":900}); errs=[]
            pg.on("pageerror",lambda e:errs.append(str(e)[:200]))
            await pg.add_init_script("window.__LAT__=40;window.__STORE__="+STORE+";\n"+MOCK)
            await pg.goto(U+ch); await pg.wait_for_timeout(900)
            n=await pg.evaluate("()=>[...document.querySelectorAll('#spBox button')].filter(b=>b.textContent.trim()==='Lanzar').length")
            print("==",ch,n,"conjuros/técnicas")
            for i in range(n):
                await pg.click('#bLong'); await pg.wait_for_timeout(100); await pg.click('#bLong'); await pg.wait_for_timeout(600)
                if ch: await pg.fill('#hpAmt','5'); await pg.evaluate("()=>[...document.querySelectorAll('#app button')].find(b=>b.textContent.trim()==='Daño').click()"); await pg.wait_for_timeout(500)
                before=await pg.evaluate(f"()=>JSON.stringify(window.__DB__['c/{ch}/sheet/state'])")
                info=await pg.evaluate("""i=>{const b=[...document.querySelectorAll('#spBox button')].filter(b=>b.textContent.trim()==='Lanzar')[i];let r=b;for(let k=0;k<6&&r&&!r.querySelector('h3,h4,b,strong');k++)r=r.parentElement;
                   const name=(r&&(r.querySelector('h3,h4,b,strong')||{}).textContent||'?').trim(); b.click(); return name;}""",i)
                await pg.wait_for_timeout(700)
                msg=await pg.evaluate("()=>{const f=document.querySelector('.flash,.toast,[role=status]');return f?f.textContent.trim().slice(0,140):''}")
                after=await pg.evaluate(f"()=>JSON.stringify(window.__DB__['c/{ch}/sheet/state'])")
                A=json.loads(before); B=json.loads(after)
                d={k:(A.get(k),B.get(k)) for k in set(A)|set(B) if A.get(k)!=B.get(k)}
                for k in ('res','slots'):
                    if k in d: d[k]={kk:v for kk,v in d[k][1].items() if d[k][0].get(kk)!=v}
                if 'effects' in d: d['effects']=[e.get('n',e.get('id')) for e in (B.get('effects') or [])]
                print(f"  {info[:38]:38} -> {d if d else 'SIN CAMBIO'} | {msg[:90]}")
            print("  errs",errs); await pg.close()
        await b.close()
asyncio.run(main())
