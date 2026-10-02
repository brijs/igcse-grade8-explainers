/* ===== 3.1 The reactivity series ===== */
const RS=[['K','potassium'],['Na','sodium'],['Ca','calcium'],['Mg','magnesium'],['Al','aluminium'],['Zn','zinc'],['Fe','iron'],['Cu','copper'],['Ag','silver'],['Au','gold']];
const MCOL={Mg:'#d9dde3',Zn:'#b4bcc6',Fe:'#7e848e',Cu:'#d58452'};
SCENES.push({id:'3.1',act:'disp',title:'The reactivity series',idea:'Metals can be ranked by how readily they react',
 setup(ctx){
  const s=ctx.svg();const X={s,tubes:S('g'),ladder:S('g'),bubs:[]};s.append(X.tubes,X.ladder);
  const rates={Mg:16,Zn:6,Fe:1.6,Cu:0},words={Mg:'fizzes fast',Zn:'steady fizz',Fe:'a few bubbles',Cu:'no reaction'};X.lab={};
  ['Mg','Zn','Fe','Cu'].forEach((m,i)=>{const x=100+i*170;const g=G(x,70);g.append(R(0,0,80,250,{rx:14,fill:'#e9f3fb','stroke-width':3}),R(14,30,52,180,{rx:3,fill:MCOL[m],'stroke-width':2}),T(40,285,elBy2(m),{'font-size':22,'font-family':'Fredoka,sans-serif'}));const wl=T(40,312,words[m],{'font-size':16,fill:'var(--accent)'});wl.setAttribute('opacity',0);g.append(wl);X.lab[m]=wl;X.tubes.append(g);X.bubs.push({m,x:x+40,y0:70+240,rate:rates[m],acc:0,list:[]})});
  function elBy2(m){return RS.find(r=>r[0]===m)[1]}
  X.fx=S('g');X.tubes.append(X.fx);X.tubes.append(T(400,38,'Strips of metal in dilute acid',{'font-size':21,fill:'var(--muted)'}));
  ctx.bg.raf(dt=>{X.bubs.forEach(b=>{b.acc+=b.rate*dt;while(b.acc>=1){b.acc--;const c=C(b.x+rnd(-18,18),b.y0-rnd(0,30),rnd(2.5,5),{fill:'#fff',opacity:.9,'stroke-width':1});X.fx.append(c);b.list.push({c,vy:rnd(50,90)})}
    b.list=b.list.filter(o=>{const y=+o.c.getAttribute('cy')-o.vy*dt;o.c.setAttribute('cy',y);if(y<110){o.c.remove();return false}return true})})});
  RS.forEach((r,i)=>{const y=44+i*37,w=380-i*26;const t=i/9;const col=`rgb(${Math.round(238-100*t)},${Math.round(90+70*t)},${Math.round(58+100*t)})`;const g=S('g');g.append(R(60,y,w,31,{rx:8,fill:col,stroke:'none'}),T(76,y+22,r[0],{'text-anchor':'start','font-size':20,fill:'#fff','font-family':'Fredoka,sans-serif'}),T(140,y+22,r[1],{'text-anchor':'start','font-size':17,fill:'#fff'}));X.ladder.append(g)});
  X.ladder.append(Pth('M520 60V400',{stroke:'var(--muted)','stroke-width':4}),S('polygon',{points:'508,72 520,46 532,72',fill:'var(--muted)'}),T(560,70,'most reactive',{'text-anchor':'start','font-size':18,fill:'var(--hot)'}),T(560,400,'least reactive',{'text-anchor':'start','font-size':18,fill:'var(--muted)'}));
  X.view=v=>{X.tubes.setAttribute('opacity',v==='t'?1:0);X.ladder.setAttribute('opacity',v==='l'?1:v==='d'?.25:0)};X.view('t');return X},
 steps:[
  {k:'watch',run(X,ctx){X.view('t');Object.values(X.lab).forEach(l=>l.setAttribute('opacity',0));['Mg','Zn','Fe','Cu'].forEach((m,i)=>ctx.after(2200+i*2000,()=>X.lab[m].setAttribute('opacity',1)))}},
  {k:'watch',run(X,ctx){X.view('l');const rows=[...X.ladder.children].slice(0,10);rows.forEach((r,i)=>{r.setAttribute('opacity',0);ctx.after(500+i*600,()=>r.setAttribute('opacity',1))})}},
  {k:'predict',q:'Which metal is more reactive: zinc or copper?',opts:['Zinc','Copper','They are equal','Neither reacts'],ans:0,why:'Zinc is higher in the series, and it fizzes in acid while copper does not.',run(X){X.view('l');[...X.ladder.children].slice(0,10).forEach(r=>r.setAttribute('opacity',1))}},
  {k:'try',build(X,ctx){X.view('d');orderGame(ctx.panel,{help:'Tap the metals from MOST reactive to LEAST reactive.',items:['Potassium','Magnesium','Zinc','Copper','Gold'],why:['Potassium is at the top.','Magnesium is next.','Zinc is below magnesium.','Copper is less reactive than zinc.','Gold is at the bottom.'],onDone:()=>{X.view('l');ctx.done()}})}},
  {k:'sum',take:'Reactivity series, most to least: K, Na, Ca, Mg, Al, Zn, Fe, Cu, Ag, Au. The higher a metal, the more vigorously it reacts.',run(X){X.view('l');[...X.ladder.children].slice(0,10).forEach(r=>r.setAttribute('opacity',1))}}],
 quiz:[Q('t','Which of these metals is the most reactive?',['Potassium','Copper','Iron','Gold'],0,'Potassium is at the top of the reactivity series.'),
  Q('t','Which of these metals does NOT react with dilute acid?',['Copper','Zinc','Iron','Magnesium'],0,'Copper is below hydrogen-releasing metals, so it does not fizz.'),
  Q('t','Which is more reactive: magnesium or iron?',['Magnesium','Iron','They are equal','Neither'],0,'Magnesium is above iron in the series.')]});

/* ===== 3.2 Metal displacement ===== */
const SALT={Cu:{n:'copper sulfate',col:'#3d86e0',cn:'blue'},Zn:{n:'zinc sulfate',col:'#e9f2fb',cn:'colourless'},Fe:{n:'iron sulfate',col:'#cfe6b4',cn:'pale green'},Mg:{n:'magnesium sulfate',col:'#e9f2fb',cn:'colourless'}};
const DEP={Cu:{col:'#c8663a',n:'brown copper'},Zn:{col:'#9aa3ae',n:'grey zinc'},Fe:{col:'#4f545d',n:'dark grey iron'}};
const NAMEOF=m=>RS.find(r=>r[0]===m)[1];
const mix=(a,b,t)=>{const p=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));const A=p(a),B=p(b);return '#'+A.map((v,i)=>Math.round(v+(B[i]-v)*t).toString(16).padStart(2,'0')).join('')};
SCENES.push({id:'3.2',act:'disp',title:'Metal displacement reactions',idea:'A more reactive metal displaces a less reactive one',
 setup(ctx){
  const s=ctx.svg();const X={s,busy:false};const bw=S('g'),sw=S('g');s.append(bw,sw);X.bw=bw;X.sw=sw;
  const bk=beaker(290,150,220,230,SALT.Cu.col,{fill:.28,op:.9});bw.append(bk.g);X.liq=bk.liq;
  X.strip=S('g');bw.append(X.strip);X.dep=S('g');bw.append(X.dep);X.note=T(400,40,'',{'font-size':21,fill:'var(--accent)','font-family':'Fredoka,sans-serif'});X.eq=T(400,432,'',{'font-size':19});X.obs=T(400,76,'',{'font-size':16,fill:'var(--muted)'});s.append(X.note,X.eq,X.obs);
  X.lbl=T(400,410,'',{'font-size':17,fill:'var(--muted)'});s.append(X.lbl);
  X.setup=(m,salt)=>{X.strip.innerHTML='';X.dep.innerHTML='';X.liq.setAttribute('fill',SALT[salt].col);X.strip.append(R(392,90,16,200,{rx:3,fill:MCOL[m],'stroke-width':2}));X.lbl.textContent=NAMEOF(m)+' in '+SALT[salt].n+' solution';X.note.textContent='';X.eq.textContent='';X.obs.textContent=''};
  X.run=(m,salt,done)=>{X.busy=true;X.setup(m,salt);const ok=RS.findIndex(r=>r[0]===m)<RS.findIndex(r=>r[0]===salt);
    if(!ok){let t=0;ctx.raf(dt=>{t+=dt;if(t>3){X.note.textContent='No reaction';X.obs.textContent=NAMEOF(m)+' is less reactive than '+NAMEOF(salt)+', so it cannot displace it.';X.busy=false;if(done)done(false);return false}});return}
    const dep=DEP[salt],blobs=[];for(let i=0;i<22;i++){const c=C(400+(i%2?10:-10)+rnd(-3,3),130+(i*7)%150,rnd(2.5,4.5),{fill:dep.col,stroke:'none',opacity:0});X.dep.append(c);blobs.push(c)}
    const from=SALT[salt].col,to=SALT[m].col;tween(ctx,6,p=>{X.liq.setAttribute('fill',mix(from,to,p));blobs.forEach((b,i)=>b.setAttribute('opacity',p>i/blobs.length?1:0));X.note.textContent=p>.2?'The '+NAMEOF(m)+' takes the place of '+NAMEOF(salt):''},()=>{
      X.eq.textContent=NAMEOF(m)+' + '+SALT[salt].n+' → '+SALT[m].n+' + '+NAMEOF(salt);X.obs.textContent='Solution: '+SALT[salt].cn+' → '+SALT[m].cn+'.  A '+dep.n+' solid forms on the strip.';X.busy=false;if(done)done(true)})};
  X.swapDraw=()=>{sw.innerHTML='';sw.setAttribute('opacity',1)};
  X.view=v=>{bw.setAttribute('opacity',v==='b'?1:0);sw.setAttribute('opacity',v==='s'?1:0)};X.setup('Zn','Cu');X.view('b');return X},
 steps:[
  {k:'watch',run(X,ctx){X.view('b');X.setup('Zn','Cu');ctx.after(1200,()=>X.run('Zn','Cu'))}},
  {k:'watch',run(X,ctx){X.view('s');X.note.textContent='';X.obs.textContent='';X.eq.textContent='';const g=X.sw;g.innerHTML='';
   const zn=G(250,230),cu=G(550,230);zn.append(C(0,0,46,{fill:'#b4bcc6','stroke-width':3}),T(0,8,'Zn',{'font-size':28,'font-family':'Fredoka,sans-serif'}));cu.append(C(0,0,46,{fill:'#3d86e0','stroke-width':3,opacity:.85}),T(0,8,'Cu²⁺',{'font-size':24,fill:'#fff','font-family':'Fredoka,sans-serif'}));g.append(zn,cu,T(250,150,'zinc atom',{'font-size':18,fill:'var(--muted)'}),T(550,150,'copper ion (in solution)',{'font-size':18,fill:'var(--muted)'}));
   ctx.after(1500,()=>tween(ctx,2.2,p=>{const q=ease(p);zn.setAttribute('transform',`translate(${250+300*q} 230)`);cu.setAttribute('transform',`translate(${550-300*q} 230)`);if(p>.5){zn.children[0].setAttribute('fill','#3d86e0');zn.children[1].textContent='Zn²⁺';zn.children[1].setAttribute('fill','#fff');cu.children[0].setAttribute('fill','#c8663a');cu.children[0].setAttribute('opacity',1);cu.children[1].textContent='Cu';cu.children[1].setAttribute('fill','#fff')}},()=>{X.note.textContent='Zinc swaps places with copper';X.eq.textContent='zinc + copper sulfate → zinc sulfate + copper'}))}},
  {k:'predict',q:'Will iron displace copper from copper sulfate solution?',opts:['Yes: iron is more reactive than copper','No: iron is less reactive than copper','Only if heated','Only with zinc'],ans:0,why:'Iron is above copper in the reactivity series, so it displaces copper.',run(X){X.view('b');X.setup('Fe','Cu')},reveal(X,ctx){X.run('Fe','Cu')}},
  {k:'try',build(X,ctx){const h=ctx.panel;X.view('b');let m='Mg',sa='Cu';const seen=new Set();let react=0,none=0;
   const fb=H('div',{class:'fb info'},'Choose a metal and a solution, then press Add the metal.'),pg=H('p',{class:'hint'},'Tests: 0 of 4');
   h.append(H('b',null,'Metal'));pickRow(h,['Mg','Zn','Fe','Cu'].map(k=>({id:k,label:NAMEOF(k)})),id=>{m=id;X.setup(m,sa)},'Mg');h.append(H('b',null,'Solution'));pickRow(h,['Cu','Zn','Fe','Mg'].map(k=>({id:k,label:SALT[k].n})),id=>{sa=id;X.setup(m,sa)},'Cu');
   X.setup(m,sa);const go=H('button',{class:'btn small',onclick:()=>{if(X.busy)return;go.disabled=true;fb.className='fb info';fb.textContent='Watch the strip and the colour...';X.run(m,sa,ok=>{go.disabled=false;seen.add(m+sa);if(ok)react++;else none++;fb.className='fb '+(ok?'good':'bad');fb.textContent=ok?NAMEOF(m)+' is more reactive than '+NAMEOF(sa)+': displacement happens.':'No reaction: '+NAMEOF(m)+' is not more reactive than '+NAMEOF(sa)+'.';pg.textContent='Tests: '+Math.min(4,seen.size)+' of 4'+(react&&none?'':' (try to see both a reaction and no reaction)');if(seen.size>=4&&react&&none)ctx.done()})}},'Add the metal');
   h.append(go,fb,pg)}},
  {k:'sum',take:'A more reactive metal displaces a less reactive metal from its compound. If the metal is less reactive, there is no reaction.',run(X){X.view('b');X.setup('Zn','Cu');X.eq.textContent='zinc + copper sulfate → zinc sulfate + copper'}}],
 quiz:[Q('t','Copper is added to zinc sulfate solution. What happens?',['No reaction','Zinc is displaced','The solution turns blue','Bubbles form'],0,'Copper is less reactive than zinc, so it cannot displace it.'),
  Q('t','Zinc is added to blue copper sulfate solution. What do you see?',['The blue fades and brown copper forms','Nothing changes','The solution turns purple','The zinc turns blue'],0,'Zinc displaces copper: the blue colour fades and brown copper is deposited.'),
  Q('t','Which metal can displace zinc from zinc sulfate?',['Magnesium','Copper','Silver','Gold'],0,'Only a metal more reactive than zinc can do it: magnesium.')]});

/* ===== 3.3 Writing displacement equations ===== */
SCENES.push({id:'3.3',act:'disp',title:'Writing the equations',idea:'Word equations and symbol equations',
 setup(ctx){
  const s=ctx.svg();const X={s};const row=S('g');s.append(row);X.row=row;
  X.cap=T(400,60,'',{'font-size':22,fill:'var(--accent)','font-family':'Fredoka,sans-serif'});X.low=T(400,372,'',{'font-size':20,fill:'var(--ink)'});X.low2=T(400,405,'',{'font-size':17,fill:'var(--muted)'});s.append(X.cap,X.low,X.low2);
  X.eq=(toks,o={})=>{row.innerHTML='';const wd=t=>t.t.length*(o.sz||24)*.62+30;const gap=10;const tot=toks.reduce((a,t)=>a+(t.k==='op'?36:wd(t)),0)+gap*(toks.length-1);let x=400-tot/2;const els=[];
    toks.forEach(t=>{const w=t.k==='op'?36:wd(t);const g=S('g');if(t.k!=='op')g.append(R(x,170,w,64,{rx:14,fill:t.k==='r'?'var(--cold-soft)':t.k==='p'?'var(--good-soft)':'var(--bad-soft)',stroke:t.k==='r'?'var(--cold)':t.k==='p'?'var(--good)':'var(--bad)','stroke-width':3}));g.append(T(x+w/2,214,t.t,{'font-size':t.k==='op'?36:(o.sz||24),'font-family':'Fredoka,sans-serif'}));row.append(g);els.push(g);x+=w+gap});return els};
  X.eq([]);return X},
 steps:[
  {k:'watch',run(X,ctx){X.low.textContent='';X.low2.textContent='';X.cap.textContent='';const els=X.eq([{t:'zinc',k:'r'},{t:'+',k:'op'},{t:'copper sulfate',k:'r'},{t:'→',k:'op'},{t:'zinc sulfate',k:'p'},{t:'+',k:'op'},{t:'copper',k:'p'}]);els.forEach((e,i)=>{e.setAttribute('opacity',0);ctx.after(700+i*700,()=>e.setAttribute('opacity',1))});ctx.after(5800,()=>X.cap.textContent='Reactants → products');ctx.after(6500,()=>{X.low.textContent='blue boxes: reactants (what we start with)';X.low2.textContent='green boxes: products (what we make)'})}},
  {k:'watch',run(X,ctx){X.cap.textContent='';X.low.textContent='';X.low2.textContent='';X.eq([{t:'Zn',k:'r'},{t:'+',k:'op'},{t:'CuSO₄',k:'r'},{t:'→',k:'op'},{t:'ZnSO₄',k:'p'},{t:'+',k:'op'},{t:'Cu',k:'p'}]);ctx.after(2800,()=>{X.eq([{t:'Zn(s)',k:'r'},{t:'+',k:'op'},{t:'CuSO₄(aq)',k:'r'},{t:'→',k:'op'},{t:'ZnSO₄(aq)',k:'p'},{t:'+',k:'op'},{t:'Cu(s)',k:'p'}]);X.cap.textContent='(s) = solid   (aq) = dissolved in water'});ctx.after(7000,()=>{X.low.textContent='Both sides: 1 Zn, 1 Cu, 1 S, 4 O: the equation balances'})}},
  {k:'predict',q:'Magnesium + copper sulfate → ? + copper. What goes in the gap?',opts:['magnesium sulfate','magnesium copper','copper magnesium','magnesium oxide'],ans:0,why:'Magnesium takes the place of copper, so the new compound is magnesium sulfate.',run(X){X.low.textContent='';X.low2.textContent='';X.cap.textContent='';X.eq([{t:'magnesium',k:'r'},{t:'+',k:'op'},{t:'copper sulfate',k:'r'},{t:'→',k:'op'},{t:'?',k:'p'},{t:'+',k:'op'},{t:'copper',k:'p'}])},reveal(X){X.eq([{t:'magnesium',k:'r'},{t:'+',k:'op'},{t:'copper sulfate',k:'r'},{t:'→',k:'op'},{t:'magnesium sulfate',k:'p'},{t:'+',k:'op'},{t:'copper',k:'p'}],{sz:21})}},
  {k:'try',build(X,ctx){const h=ctx.panel;X.eq([]);X.cap.textContent='';X.low.textContent='';
   const qs=[{q:'Iron + copper sulfate → ? + copper',o:['iron sulfate','iron copper','copper iron sulfate','no reaction'],a:0,why:'Iron displaces copper, making iron sulfate.',eq:[['iron','r'],['copper sulfate','r'],['iron sulfate','p'],['copper','p']]},
    {q:'Which is the correct symbol equation for magnesium and copper sulfate?',o:['Mg + CuSO₄ → MgSO₄ + Cu','Mg + CuSO₄ → Cu + SO₄','Mg + CuSO₄ → MgCu + SO₄','Mg + Cu → MgSO₄'],a:0,why:'Mg takes the place of Cu in the sulfate: MgSO₄, and Cu is left over.',eq:[['Mg','r'],['CuSO₄','r'],['MgSO₄','p'],['Cu','p']]},
    {q:'Magnesium + zinc sulfate → ?',o:['magnesium sulfate + zinc','zinc + magnesium','no reaction','magnesium zinc sulfate'],a:0,why:'Magnesium is more reactive than zinc, so it displaces it.',eq:[['magnesium','r'],['zinc sulfate','r'],['magnesium sulfate','p'],['zinc','p']]}];
   let i=0;const host=H('div');h.append(host);
   const nxt=()=>{if(i>=qs.length){host.innerHTML='';host.append(H('div',{class:'fb good'},'All three equations done!'));ctx.done();return}
     const q=qs[i];const box=H('div');host.innerHTML='';host.append(H('p',{class:'hint'},'Equation '+(i+1)+' of '+qs.length),box);
     ask(q,box,()=>{const e=q.eq;X.eq([{t:e[0][0],k:'r'},{t:'+',k:'op'},{t:e[1][0],k:'r'},{t:'→',k:'op'},{t:e[2][0],k:'p'},{t:'+',k:'op'},{t:e[3][0],k:'p'}],{sz:i===1?24:20});box.append(H('button',{class:'btn small',onclick:()=>{i++;nxt()}},i>=qs.length-1?'Finish':'Next equation'))})};nxt()}},
  {k:'sum',take:'Write the reactants, an arrow, then the products. The more reactive metal takes the place of the less reactive one. Check that both sides balance.',run(X){X.cap.textContent='';X.low.textContent='';X.low2.textContent='';X.eq([{t:'Zn(s)',k:'r'},{t:'+',k:'op'},{t:'CuSO₄(aq)',k:'r'},{t:'→',k:'op'},{t:'ZnSO₄(aq)',k:'p'},{t:'+',k:'op'},{t:'Cu(s)',k:'p'}])}}],
 quiz:[Q('t','In an equation, which side shows the reactants?',['The left, before the arrow','The right, after the arrow','Both sides','Above the arrow'],0,'Reactants are what you start with, written before the arrow.'),
  Q('t','Iron + copper sulfate → ?',['iron sulfate + copper','copper iron + sulfate','no reaction','iron oxide + copper'],0,'Iron is more reactive than copper, so it displaces it.'),
  Q('t','Copper + magnesium sulfate → ?',['No reaction','copper sulfate + magnesium','magnesium + copper sulfate','copper oxide'],0,'Copper is less reactive than magnesium, so there is no displacement.')]});

/* ===== 3.4 Halogen displacement ===== */
const HX=[['Cl','chlorine','chloride','#e3edb0','pale green'],['Br','bromine','bromide','#f0a64a','orange'],['I','iodine','iodide','#8c5a2e','brown']];
SCENES.push({id:'3.4',act:'disp',title:'Halogen displacement',idea:'A more reactive halogen displaces a less reactive one',
 setup(ctx){
  const s=ctx.svg();const X={s,busy:false};
  X.lad=S('g');[['Cl',0],['Br',1],['I',2]].forEach(r=>{X.lad.append(R(60,90+r[1]*90,150,66,{rx:14,fill:HX[r[1]][3],'stroke-width':2.5}),T(135,134+r[1]*90,HX[r[1]][1],{'font-size':22,'font-family':'Fredoka,sans-serif',fill:'#13203a'}))});X.lad.append(Pth('M240 90V370',{stroke:'var(--muted)','stroke-width':4}),S('polygon',{points:'228,102 240,76 252,102',fill:'var(--muted)'}),T(262,100,'more reactive',{'text-anchor':'start','font-size':17,fill:'var(--hot)'}),T(262,370,'less reactive',{'text-anchor':'start','font-size':17,fill:'var(--muted)'}));s.append(X.lad);
  X.tube=S('g');const bk=beaker(500,150,120,220,'#eaf2fb',{fill:.35,op:.95});X.tube.append(bk.g);X.liq=bk.liq;X.drop=C(560,100,10,{fill:'#e3edb0',opacity:0});X.tube.append(X.drop);s.append(X.tube);
  X.note=T(400,40,'',{'font-size':21,fill:'var(--accent)','font-family':'Fredoka,sans-serif'});X.eq=T(400,426,'',{'font-size':19});X.obs=T(560,404,'',{'font-size':16,fill:'var(--muted)'});X.lbl=T(560,128,'',{'font-size':15,fill:'var(--muted)'});s.append(X.note,X.eq,X.obs,X.lbl);
  X.setup=(h,x)=>{X.liq.setAttribute('fill','#eaf2fb');X.drop.setAttribute('opacity',0);X.lbl.textContent='potassium '+HX[x][2]+' solution';X.obs.textContent='';X.eq.textContent='';X.note.textContent=''};
  X.run=(hi,xi,done)=>{X.busy=true;X.setup(hi,xi);const ok=hi<xi;const addCol=HX[hi][3];X.drop.setAttribute('fill',addCol);X.drop.setAttribute('opacity',1);X.drop.setAttribute('cy',100);X.note.textContent='Add '+HX[hi][1]+' water';
   tween(ctx,1.2,p=>X.drop.setAttribute('cy',100+(215-100)*p),()=>{X.drop.setAttribute('opacity',0);const to=ok?HX[xi][3]:(hi===xi?'#f1f6df':addCol);tween(ctx,3,p=>X.liq.setAttribute('fill',mix('#eaf2fb',to,p)),()=>{
     if(ok){X.eq.textContent=HX[hi][1]+' + potassium '+HX[xi][2]+' → potassium '+HX[hi][2]+' + '+HX[xi][1];X.obs.textContent='Solution turns '+HX[xi][4]+': '+HX[xi][1]+' is displaced.';X.note.textContent=HX[hi][1]+' displaces '+HX[xi][1]}
     else{X.obs.textContent=hi===xi?'Same halogen: nothing to displace.':'No reaction: '+HX[hi][1]+' is less reactive than '+HX[xi][1]+'.';X.note.textContent='No reaction'}
     X.busy=false;if(done)done(ok)})})};
  X.view=v=>{X.lad.setAttribute('opacity',v==='l'?1:.25)};X.setup(0,1);X.view('t');return X},
 steps:[
  {k:'watch',run(X,ctx){X.view('l');X.setup(0,1);X.lbl.textContent='';X.note.textContent='Reactivity decreases down Group 7'}},
  {k:'watch',run(X,ctx){X.view('t');X.setup(0,1);ctx.after(1200,()=>X.run(0,1))}},
  {k:'predict',q:'Bromine water is added to potassium chloride solution. What happens?',opts:['No reaction','Chlorine is displaced','The solution turns brown','The solution turns colourless'],ans:0,why:'Bromine is less reactive than chlorine, so it cannot displace it.',run(X){X.view('t');X.setup(1,0)},reveal(X,ctx){X.run(1,0)}},
  {k:'try',build(X,ctx){const h=ctx.panel;X.view('t');let hi=0,xi=1;const seen=new Set();let react=0,none=0;
   const fb=H('div',{class:'fb info'},'Choose a halogen water and a halide solution, then press Add.'),pg=H('p',{class:'hint'},'Tests: 0 of 4');
   h.append(H('b',null,'Add this halogen water'));pickRow(h,HX.map((x,i)=>({id:i,label:x[1]})),id=>{hi=id;X.setup(hi,xi)},0);h.append(H('b',null,'to this solution'));pickRow(h,HX.map((x,i)=>({id:i,label:'potassium '+x[2]})),id=>{xi=id;X.setup(hi,xi)},1);
   X.setup(hi,xi);const go=H('button',{class:'btn small',onclick:()=>{if(X.busy)return;go.disabled=true;fb.className='fb info';fb.textContent='Watch the colour...';X.run(hi,xi,ok=>{go.disabled=false;seen.add(hi+'-'+xi);if(ok)react++;else none++;fb.className='fb '+(ok?'good':'bad');fb.textContent=ok?HX[hi][1]+' is more reactive than '+HX[xi][1]+': it displaces it.':'No reaction (or same halogen).';pg.textContent='Tests: '+Math.min(4,seen.size)+' of 4'+(react&&none?'':' (see both a reaction and no reaction)');if(seen.size>=4&&react&&none)ctx.done()})}},'Add');
   h.append(go,fb,pg)}},
  {k:'sum',take:'Reactivity decreases down Group 7: chlorine, bromine, iodine. A more reactive halogen displaces a less reactive one from its halide solution.',run(X){X.view('l');X.setup(0,1);X.lbl.textContent='';X.eq.textContent='chlorine + potassium bromide → potassium chloride + bromine'}}],
 quiz:[Q('t','Which of these halogens is the most reactive?',['Chlorine','Bromine','Iodine','They are the same'],0,'Reactivity decreases down the group, so chlorine is the most reactive of the three.'),
  Q('t','Chlorine water is added to potassium iodide solution. What colour does the solution turn?',['Brown','Colourless','Blue','Green'],0,'Chlorine displaces iodine, which makes the solution brown.'),
  Q('t','Bromine water is added to potassium chloride solution. What happens?',['No reaction','Chlorine is displaced','Iodine forms','A gas is made'],0,'Bromine is less reactive than chlorine, so it cannot displace chlorine.')]});
