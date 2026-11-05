import asyncio, json
from playwright.async_api import async_playwright
STORE=open('store.json').read(); MOCK=open('mock.js').read()
URL="file:///home/claude/diendi_characters/artefactos/mesa/mesa.html#/darvin"
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={"width":1120,"height":900})
        await pg.add_init_script("window.__LAT__=700;window.__STORE__="+STORE+";\n"+MOCK)
        await pg.goto(URL); await pg.wait_for_timeout(1500)
        # spend 4 ki quickly, 250ms apart (slower than 350 debounce? mix)
        for gap in [400,400,400,400,400,400]:
            await pg.evaluate("()=>{const b=[...document.querySelectorAll('#resBox .pip')].find(x=>x.getAttribute('aria-pressed')==='false');b&&b.click();}")
            await pg.wait_for_timeout(gap)
        await pg.wait_for_timeout(3000)
        ui=await pg.evaluate("()=>[...document.querySelectorAll('#resBox .pip')].filter(x=>x.getAttribute('aria-pressed')==='true').length")
        db=await pg.evaluate("()=>window.__DB__['c/darvin/sheet/state'].res")
        print("pips gastados en UI:",ui,"| guardado:",db, "| esperado: 6 en total")
        # hp rapid
        for n in range(5):
            await pg.fill('#hpAmt','3'); await pg.evaluate("()=>[...document.querySelectorAll('#app button')].find(b=>b.textContent.trim()==='Daño').click()"); await pg.wait_for_timeout(450)
        await pg.wait_for_timeout(3000)
        print("hp UI",await pg.evaluate("()=>document.getElementById('hpCur').textContent"),"guardado",await pg.evaluate("()=>window.__DB__['c/darvin/sheet/state'].hp"),"esperado 134")
        await b.close()
asyncio.run(main())
