import asyncio, json
from playwright.async_api import async_playwright
STORE=open('store.json').read(); MOCK=open('mock.js').read()
U="file:///home/claude/diendi_characters/artefactos/mesa/mesa.html#/"
PIPS="()=>{const r={};document.querySelectorAll('#resBox .pip, #spSlots .pip').forEach(p=>{const row=p.closest('[class]').parentElement; const k=(p.closest('.res, .slot, div')||{}).textContent||'';});return [...document.querySelectorAll('#resBox .pip, #spSlots .pip')].map(p=>p.getAttribute('aria-pressed')).join('')}"
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        for ch in ['usoryn','kiyaj','yevelda','auriana','darvin']:
            pg=await b.new_page(viewport={"width":1120,"height":900}); errs=[]
            pg.on("pageerror",lambda e:errs.append(str(e)[:200])); pg.on("dialog",lambda d: asyncio.ensure_future(d.accept()))
            await pg.add_init_script("window.__STORE__="+STORE+";\n"+MOCK)
            await pg.goto(U+ch); await pg.wait_for_timeout(900)
            # spend all
            for _ in range(60):
                n=await pg.evaluate("()=>{const b=[...document.querySelectorAll('#resBox .pip, #spSlots .pip')].find(x=>x.getAttribute('aria-pressed')==='false');if(b){b.click();return 1}return 0}")
                await pg.wait_for_timeout(15)
                if not n: break
            await pg.fill('#hpAmt','10'); await pg.evaluate("()=>[...document.querySelectorAll('#app button')].find(b=>b.textContent.trim()==='Daño').click()")
            await pg.wait_for_timeout(500)
            spent=await pg.evaluate(PIPS)
            await pg.click('#bShort'); await pg.wait_for_timeout(700)
            dlg=await pg.evaluate("()=>{const d=document.querySelector('dialog[open], .modal, .sheet-dlg');return d?d.innerText.slice(0,300):''}")
            afterS=await pg.evaluate(PIPS)
            await pg.click('#bLong'); await pg.wait_for_timeout(200); await pg.click('#bLong'); await pg.wait_for_timeout(700)
            dlg2=await pg.evaluate("()=>{const d=document.querySelector('dialog[open], .modal');return d?d.innerText.slice(0,300):''}")
            afterL=await pg.evaluate(PIPS); hp=await pg.evaluate("()=>document.getElementById('hpCur').textContent+'/'+document.getElementById('hpMaxL').textContent")
            print(f"== {ch}\n spent {spent}\n short {afterS}\n long  {afterL}\n hp {hp} dlg:{dlg[:120]!r} {dlg2[:120]!r} errs {errs}")
            await pg.close()
        await b.close()
asyncio.run(main())
