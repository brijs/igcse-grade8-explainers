import re
def chip(pg, text, exact=True):
    pg.locator('.panel .chip', has_text=re.compile('^' + re.escape(text) + '$') if exact else text).first.click()
def btn(pg, text, exact=False):
    pg.locator('.panel button', has_text=re.compile('^' + re.escape(text) + '$') if exact else text).first.click()
def slider(pg, i, v):
    pg.evaluate("([i,v])=>{const s=document.querySelectorAll('.panel input[type=range]')[i];s.value=v;s.dispatchEvent(new Event('input'))}", [i, v])
def enter(pg, cell, formula):
    pg.evaluate("([c,f])=>{const sh=window.__sheets[window.__sheets.length-1];sh.select(c);sh.fxi.value=f;sh.fxi.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter'}))}", [cell, formula])
def c14(pg):
    pg.evaluate("[...document.querySelectorAll('svg rect.hit')].slice(0,4).forEach(r=>r.dispatchEvent(new MouseEvent('click',{bubbles:true})))")
def c16(pg):
    pg.fill('#pw', 'Tr!ck-Banana-Moon-47'); pg.wait_for_timeout(300)
def tasks(pg, fallback=None):
    t = pg.evaluate("window.__st.tasks.map(t=>[t.cell,t.hint||''])")
    for i, (cell, hint) in enumerate(t):
        m = re.search(r'=[A-Z]+\([^)]*\)', hint); f = m.group(0) if m else (fallback or {}).get(i)
        enter(pg, cell, f); pg.wait_for_timeout(1500)
def s21(pg): tasks(pg)
def s25(pg): tasks(pg, {2: '=VLOOKUP(A4,$E$2:$G$6,3,FALSE)'})
def s22(pg):
    chip(pg, 'Relative: =B4*B1'); btn(pg, 'Type in C4'); pg.wait_for_timeout(200)
    chip(pg, 'Absolute: =B4*$B$1'); btn(pg, 'Type in C4'); pg.wait_for_timeout(200)
def s23(pg):
    enter(pg, 'C2', '=IF(B2>=50,"Pass","Fail")'); pg.wait_for_timeout(300); btn(pg, 'Fill down'); pg.wait_for_timeout(300)
    enter(pg, 'B9', '=COUNTIF(C2:C7,"Pass")'); pg.wait_for_timeout(300)
def s24(pg):
    pg.fill('#nv', '50'); btn(pg, 'Apply rule'); pg.wait_for_timeout(300)
    enter(pg, 'C2', '150'); pg.wait_for_timeout(200); enter(pg, 'C2', '90'); pg.wait_for_timeout(300)
def s26(pg):
    for f, a, label in (('Region', 'Sum of Units', ''), ('Product', 'Count of sales', ''), ('Region', 'Average Units', '')):
        chip(pg, f); chip(pg, a); btn(pg, 'Check my pivot table'); pg.wait_for_timeout(250)
def l31(pg):
    sol = {'NOT': [1, 0], 'AND': [0, 0, 0, 1], 'OR': [0, 1, 1, 1]}
    for g, outs in sol.items():
        chip(pg, g); pg.wait_for_timeout(150)
        for i, v in enumerate(outs):
            b = pg.locator('.panel table button').nth(i)
            for _ in range(v + 1): b.click()
        btn(pg, 'Check', True); pg.wait_for_timeout(200)
def toggles(pg, seq):
    for i in seq:
        pg.locator('.panel .chips button').nth(i).click(); pg.wait_for_timeout(120)
def l33(pg): toggles(pg, [0, 1, 0, 1, 0, 1, 2])
def l34(pg):
    toggles(pg, [1, 0, 1]); pg.wait_for_timeout(300); pg.locator('.panel .opt', has_text='AND').first.click(); pg.wait_for_timeout(300)
def d43(pg):
    slider(pg, 0, 10); slider(pg, 1, 11); btn(pg, 'Test it'); pg.wait_for_timeout(300)
def d44(pg):
    for t in ('1. Add a box', '2. Add a cylinder', '3. Set the cylinder to Hole', '4. Move it onto the box', '5. Group'): btn(pg, t); pg.wait_for_timeout(150)
CUSTOM.update({'1.4': c14, '1.6': c16, '2.1': s21, '2.2': s22, '2.3': s23, '2.4': s24, '2.5': s25, '2.6': s26, '3.1': l31, '3.3': l33, '3.4': l34, '4.3': d43, '4.4': d44})
