import re
def chip(pg, text, exact=True):
    pg.locator('.panel .chip', has_text=re.compile('^' + re.escape(text) + '$') if exact else text).first.click()
def btn(pg, text, exact=False):
    pg.locator('.panel button', has_text=re.compile('^' + re.escape(text) + '$') if exact else text).first.click()
def slider(pg, v):
    pg.evaluate("(v)=>{const s=document.querySelector('.panel input[type=range]');s.value=v;s.dispatchEvent(new Event('input'))}", v)
def clicksvg(pg, label):
    pg.evaluate("(l)=>{[...document.querySelectorAll('svg g[aria-label]')].find(g=>g.getAttribute('aria-label')===l).dispatchEvent(new MouseEvent('click',{bubbles:true}))}", label)
def b12(pg):
    for c in ('Red', 'Blue', 'Green', 'White'): chip(pg, c); btn(pg, 'Shine', True); pg.wait_for_timeout(4200)
def b14(pg):
    for e in ('Variegated leaf', 'Leaf covered with foil', 'No carbon dioxide'): chip(pg, e); btn(pg, 'Do the starch test'); pg.wait_for_timeout(200)
def b15(pg):
    for l in ('Palisade mesophyll', 'Cuticle', 'Stoma and guard cells', 'Spongy mesophyll', 'Vein (xylem and phloem)'): clicksvg(pg, l); pg.wait_for_timeout(200)
def b16(pg):
    for c in ('Bright day', 'Night', 'Hot dry day'): chip(pg, c); pg.wait_for_timeout(200)
def b19(pg): slider(pg, 20); pg.wait_for_timeout(200); btn(pg, 'Cut a slice')
def b110(pg):
    for _ in range(2):
        for c in ('Hot', 'Windy', 'Dry air', 'Bright light'): chip(pg, c); pg.wait_for_timeout(80)
def b23(pg):
    for b in 'TAGCCT': chip(pg, b); pg.wait_for_timeout(120)
def b27(pg):
    for _ in range(3): btn(pg, 'Make a child'); pg.wait_for_timeout(2000)
CUSTOM.update({'1.2': b12, '1.4': b14, '1.5': b15, '1.6': b16, '1.9': b19, '1.10': b110, '2.3': b23, '2.7': b27})
