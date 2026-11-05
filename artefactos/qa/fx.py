import asyncio, sys
from playwright.async_api import async_playwright
STORE=open('store.json').read(); MOCK=open('mock.js').read()
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        for ch,spname in [('yevelda','Furia'),('auriana','Bendición'),('kiyaj','Bendición'),('usoryn','Marca del cazador'),('darvin','Rugido del Dragón'),('kiyaj','Armadura de Agathys'),('auriana','Escudo de fe')]:
            pg=await b.new_page(viewport={"width":1120,"height":900})
            await pg.add_init_script("window.__LAT__=40;window.__STORE__="+STORE+";\n"+MOCK)
            await pg.goto("file:///home/claude/diendi_characters/artefactos/mesa/mesa.html#/"+ch); await pg.wait_for_timeout(900)
            snap="()=>({ac:document.getElementById('sAC').textContent,atk:document.getElementById('atkBox').innerText.replace(/\\n+/g,' | ').slice(0,260),x:(document.getElementById('xdmgBox')||{}).innerText||'',fx:document.getElementById('fxBox').innerText.replace(/\\n+/g,' | ').slice(0,200),ab:document.getElementById('abil').innerText.slice(0,0)})"
            a=await pg.evaluate(snap)
            await pg.evaluate("n=>{const d=[...document.querySelectorAll('#spBox details')].find(d=>d.querySelector('b')&&d.querySelector('b').textContent.trim()===n);const t=d.querySelector('select[id^=tg-]');if(t&&[...t.options].some(o=>o.value==='self')){t.value='self';t.dispatchEvent(new Event('change'));}d.querySelector('button').click();}",spname)
            await pg.wait_for_timeout(700)
            c=await pg.evaluate(snap)
            print("==",ch,spname)
            for k in ['ac','atk','x','fx']:
                if a[k]!=c[k]: print("  ",k,":",a[k][:200],"\n    ->",c[k][:200])
            await pg.close()
        await b.close()
asyncio.run(main())
