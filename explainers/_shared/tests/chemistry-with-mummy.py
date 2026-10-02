import re
def chip(pg, text, exact=True):
    pg.locator('.panel .chip', has_text=re.compile('^' + re.escape(text) + '$') if exact else text).first.click()
def btn(pg, text):
    pg.locator('.panel button', has_text=text).first.click()
def slider(pg, v):
    pg.evaluate("(v)=>{const s=document.querySelector('.panel input[type=range]');s.value=v;s.dispatchEvent(new Event('input'))}", v)
def clicksvg(pg, label):
    pg.evaluate("(l)=>{document.querySelector('svg g[aria-label=\"'+l+'\"]').dispatchEvent(new MouseEvent('click',{bubbles:true}))}", label)
def c11(pg):
    for _ in range(3): pg.locator('button[aria-label="more Protons"]').click()
    for _ in range(3): pg.locator('button[aria-label="more Electrons"]').click()
def c12(pg):
    for r in range(3):
        A, Z, sym = pg.evaluate("[...document.querySelectorAll('svg.main text')].slice(2,5).map(t=>t.textContent)")
        A, Z = int(A), int(Z)
        pg.fill('#ip', str(Z)); pg.fill('#in', str(A - Z)); pg.fill('#ie', str(Z)); btn(pg, 'Check'); pg.wait_for_timeout(200)
        if r < 2: btn(pg, 'Next element'); pg.wait_for_timeout(200)
def c13(pg):
    for v in (13, 17, 10): slider(pg, v); pg.wait_for_timeout(250)
def c14(pg):
    for l in ('magnesium', 'lithium', 'chlorine', 'argon'): clicksvg(pg, l); pg.wait_for_timeout(200)
def c15(pg):
    for m in ('Lithium', 'Sodium', 'Potassium'):
        chip(pg, m); btn(pg, 'Drop it in'); pg.wait_for_timeout(8800)
def c22(pg):
    for m, x in (('Na', 'Cl'), ('Mg', 'Cl'), ('Ca', 'O')):
        chip(pg, m); chip(pg, x); btn(pg, 'Make the compound'); pg.wait_for_timeout(250)
def c23(pg):
    for t in ('Solid', 'Molten (melted)', 'Dissolved in water'):
        chip(pg, t); btn(pg, 'Test it'); pg.wait_for_timeout(250)
def c24(pg):
    for t in ('H₂', 'Cl₂', 'HCl', 'H₂O'): chip(pg, t); pg.wait_for_timeout(200)
def c25(pg): slider(pg, 20)
def c26(pg):
    for m in ('Diamond', 'Graphite'):
        chip(pg, m)
        for t in ('Hit it', 'Test conductivity', 'Heat it'): btn(pg, t); pg.wait_for_timeout(120)
def runm(pg, m, s, wait):
    chip(pg, m); chip(pg, s); btn(pg, 'Add the metal' if 'sulfate' in s else 'Add'); pg.wait_for_timeout(wait)
def c32(pg):
    for m, s, w in (('magnesium', 'copper sulfate', 7000), ('copper', 'zinc sulfate', 3500), ('zinc', 'copper sulfate', 7000), ('iron', 'zinc sulfate', 3500)): runm(pg, m, s, w)
def c34(pg):
    for m, s, w in (('chlorine', 'potassium bromide', 5500), ('bromine', 'potassium chloride', 5500), ('iodine', 'potassium bromide', 5500), ('chlorine', 'potassium iodide', 5500)):
        chip(pg, m); chip(pg, s); btn(pg, 'Add'); pg.wait_for_timeout(w)
CUSTOM.update({'1.1': c11, '1.2': c12, '1.3': c13, '1.4': c14, '1.5': c15, '2.2': c22, '2.3': c23, '2.4': c24, '2.5': c25, '2.6': c26, '3.2': c32, '3.4': c34})
