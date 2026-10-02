/* ===== 1.1 Plants make their own food ===== */
SCENES.push({id:'1.1',act:'plant',title:'Plants make their own food',idea:'Photosynthesis: the word and symbol equation',
 setup(ctx){
  const s=ctx.svg();const X={s};const sc=S('g'),eq=S('g');s.append(sc,eq);X.sc=sc;X.eq=eq;
  sc.append(R(0,380,800,70,{fill:'#8d6e4a',stroke:'none',rx:0}),T(70,430,'soil',{'font-size':16,fill:'#f3e3c8'}));
  const sun=S('g');sun.append(C(90,80,40,{fill:'#ffd34d','stroke-width':3}));for(let i=0;i<10;i++){const a=i*36*Math.PI/180;sun.append(L(90+52*Math.cos(a),80+52*Math.sin(a),90+68*Math.cos(a),80+68*Math.sin(a),{stroke:'#ffb000','stroke-width':4}))}sc.append(sun);
  sc.append(Pth('M400 380V200',{stroke:'#4a8f3a','stroke-width':10}),Pth('M400 380V440M400 400L350 440M400 400L450 440M400 395L330 425M400 395L470 425',{stroke:'#c9a77a','stroke-width':3}));
  leafAt(sc,402,250,170,90,LEAFG,{rot:-35});leafAt(sc,398,285,150,80,LEAFG,{rot:-155});leafAt(sc,400,205,110,60,LEAFG,{rot:-70});
  X.light=flowLine(ctx,sc,[[150,100],[300,160],[390,215]],{col:'#e6a100',label:'light energy',lx:215,ly:106});
  X.co2=flowLine(ctx,sc,[[740,150],[620,170],[540,190]],{col:'#6b7a99',label:'carbon dioxide',lx:650,ly:130,n:3});
  X.water=flowLine(ctx,sc,[[330,430],[400,400],[400,300],[400,230]],{col:'var(--cold)',label:'water',lx:300,ly:420,n:4});
  X.o2=flowLine(ctx,sc,[[455,335],[560,335],[690,325]],{col:'#d65a5a',label:'oxygen',lx:640,ly:300,n:3});
  X.gl=S('g',{transform:'translate(-70 -25)'});X.gl.append(S('polygon',{points:'400,320 418,310 436,320 436,340 418,350 400,340',fill:'#ffe08a',stroke:'var(--ink)','stroke-width':2}),T(418,334,'',{}),T(418,372,'glucose',{'font-size':17,fill:'var(--accent)','font-family':'Fredoka,sans-serif'}));sc.append(X.gl);
  [X.light,X.co2,X.water,X.o2,X.gl].forEach(g=>g.setAttribute('opacity',0));
  X.eqSet=(rows)=>{eq.innerHTML='';rows.forEach(r=>{const els=eqRow(eq,r.y,r.toks,{sz:r.sz||22});if(r.note)eq.append(T(400,r.y-14,r.note,{'font-size':17,fill:'var(--accent)'}))})};
  X.view=m=>{sc.setAttribute('opacity',m==='sc'?1:.15);eq.setAttribute('opacity',m==='eq'?1:0)};X.view('sc');return X},
 steps:[
  {k:'watch',run(X,ctx){X.view('sc');[X.light,X.co2,X.water,X.o2,X.gl].forEach((g,i)=>{g.setAttribute('opacity',0);ctx.after([800,4200,7600,11500,13500][i],()=>g.setAttribute('opacity',1))})}},
  {k:'watch',run(X,ctx){X.view('eq');X.eqSet([{y:90,note:'in words',toks:[{t:'carbon dioxide',k:'r'},{t:'+',k:'op'},{t:'water',k:'r'},{t:'→',k:'op'},{t:'glucose',k:'p'},{t:'+',k:'op'},{t:'oxygen',k:'p'}],sz:22},{y:230,note:'in symbols',toks:[{t:'6CO₂',k:'r'},{t:'+',k:'op'},{t:'6H₂O',k:'r'},{t:'→',k:'op'},{t:'C₆H₁₂O₆',k:'p'},{t:'+',k:'op'},{t:'6O₂',k:'p'}],sz:24}]);
   X.eq.append(T(400,360,'needs light energy and chlorophyll',{'font-size':22,fill:'var(--accent)','font-family':'Fredoka,sans-serif'}),T(400,392,'blue = raw materials (reactants)   green = made (products)',{'font-size':16,fill:'var(--muted)'}))}},
  {k:'predict',q:'Which gas do plants take in for photosynthesis?',opts:['Carbon dioxide','Oxygen','Nitrogen','Hydrogen'],ans:0,why:'Carbon dioxide is one of the two raw materials. Oxygen is given out.',run(X){X.view('sc');[X.light,X.co2,X.water,X.o2,X.gl].forEach(g=>g.setAttribute('opacity',1))}},
  {k:'try',build(X,ctx){X.view('sc');[X.light,X.co2,X.water,X.o2,X.gl].forEach(g=>g.setAttribute('opacity',1));
   matchGame(ctx.panel,{help:'Tap an item, then tap the box it belongs in.',items:[
    {label:'carbon dioxide',to:'r',hint:'It enters the leaf from the air.'},{label:'water',to:'r',hint:'It comes up from the roots.'},{label:'glucose',to:'p',hint:'The food the plant makes.'},{label:'oxygen',to:'p',hint:'The gas given out.'},
    {label:'light energy',to:'c',hint:'It is not a substance; it is the energy source.'},{label:'chlorophyll',to:'c',hint:'The green pigment that absorbs the light.'}],
    buckets:[{id:'r',label:'Raw materials (reactants)'},{id:'p',label:'Products'},{id:'c',label:'Needed for the reaction'}],onDone:ctx.done})}},
  {k:'sum',take:'carbon dioxide + water → glucose + oxygen, using light energy absorbed by chlorophyll. 6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂.',run(X){X.view('eq');X.eqSet([{y:140,toks:[{t:'carbon dioxide',k:'r'},{t:'+',k:'op'},{t:'water',k:'r'},{t:'→',k:'op'},{t:'glucose',k:'p'},{t:'+',k:'op'},{t:'oxygen',k:'p'}],sz:22,note:'light energy + chlorophyll'},{y:260,toks:[{t:'6CO₂',k:'r'},{t:'+',k:'op'},{t:'6H₂O',k:'r'},{t:'→',k:'op'},{t:'C₆H₁₂O₆',k:'p'},{t:'+',k:'op'},{t:'6O₂',k:'p'}],sz:24}])}}],
 quiz:[Q('t','What are the products of photosynthesis?',['Glucose and oxygen','Carbon dioxide and water','Glucose and carbon dioxide','Oxygen and water'],0,'Plants make glucose and give out oxygen.'),
  Q('t','Which energy source drives photosynthesis?',['Light','Heat from the soil','Wind','Water'],0,'Chlorophyll absorbs light energy.'),
  Q('t','Where does a plant get the carbon dioxide for photosynthesis?',['From the air','From the soil','From the roots','From glucose'],0,'Carbon dioxide enters the leaves from the air.')]});

/* ===== 1.2 Chlorophyll and light ===== */
const LIGHTS={red:{col:'#e5484d',rate:80,mode:'abs',name:'Red'},blue:{col:'#3b6df0',rate:90,mode:'abs',name:'Blue'},green:{col:'#2faa4a',rate:10,mode:'ref',name:'Green'},white:{col:'#f4d35e',rate:100,mode:'abs',name:'White'}};
SCENES.push({id:'1.2',act:'plant',title:'Chlorophyll and light',idea:'Chlorophyll absorbs red and blue light, and reflects green',
 setup(ctx){
  const s=ctx.svg();const X={s,busy:false};
  X.cell=S('g');X.cell.append(R(40,100,440,290,{rx:26,fill:'#e8f5e0','stroke-width':4}),R(60,120,400,250,{rx:18,fill:'none',stroke:'var(--line)','stroke-width':2}),S('ellipse',{cx:140,cy:190,rx:34,ry:26,fill:'#c9b3e8',stroke:'var(--ink)','stroke-width':2.5}),T(140,196,'nucleus',{'font-size':14,fill:'#13203a'}));
  X.chl=[[260,170],[360,230],[230,300],[400,320],[300,255]].map(p=>{const g=G(p[0],p[1]);g.append(S('ellipse',{cx:0,cy:0,rx:34,ry:20,fill:'#3da34d',stroke:'var(--ink)','stroke-width':2.5}));for(let i=0;i<3;i++)g.append(S('ellipse',{cx:-14+i*14,cy:0,rx:5,ry:9,fill:'#1f6f31'}));X.cell.append(g);return g});
  s.append(X.cell);X.lab=S('g',{opacity:0});X.lab.append(T(260,140,'chloroplast',{'font-size':18,fill:'var(--accent)','font-family':'Fredoka,sans-serif'}),T(250,402,'plant cell',{'font-size':18,fill:'var(--muted)'}),T(300,355,'',{}));s.append(X.lab);
  X.lamp=S('g');X.lamp.append(R(690,150,70,90,{rx:14,fill:'var(--metal)'}),C(690,195,22,{fill:'#ffe066',stroke:'var(--ink)','stroke-width':3}));s.append(X.lamp);
  X.beam=S('g');s.append(X.beam);X.fx=S('g');s.append(X.fx);
  X.gauge=S('g');X.gauge.append(R(560,300,200,24,{rx:12,fill:'var(--paper)','stroke-width':2.5}),T(660,350,'rate of photosynthesis',{'font-size':16,fill:'var(--muted)'}));X.bar=R(562,302,0,20,{rx:10,fill:'var(--good)',stroke:'none'});X.gauge.append(X.bar);X.note=T(400,44,'',{'font-size':22,fill:'var(--accent)','font-family':'Fredoka,sans-serif'});s.append(X.gauge,X.note);
  X.clear=()=>{X.beam.innerHTML='';X.fx.innerHTML='';X.bar.setAttribute('width',0);X.note.textContent='';X.chl.forEach(c=>c.firstChild.setAttribute('stroke','var(--ink)'))};
  X.shine=(k,done)=>{X.busy=true;X.clear();const d=LIGHTS[k];const tgt=X.chl[1];const tx=360+34,ty=230;
   const ln=S('path',{d:`M690 195L${tx} ${ty}`,stroke:d.col,'stroke-width':8,fill:'none','stroke-linecap':'round',opacity:.85});X.beam.append(ln);
   tween(ctx,1.4,p=>ln.setAttribute('d',`M690 195L${690+(tx-690)*p} ${195+(ty-195)*p}`),()=>{
     if(d.mode==='ref'){const rf=S('path',{d:`M${tx} ${ty}L${tx+120} ${ty-110}`,stroke:d.col,'stroke-width':8,fill:'none','stroke-linecap':'round',opacity:.85});X.beam.append(rf);X.note.textContent='Green light is reflected';
       tween(ctx,1,p=>X.bar.setAttribute('width',d.rate*1.96*p),()=>{X.busy=false;if(done)done()})}
     else{tgt.firstChild.setAttribute('stroke',d.col);tgt.firstChild.setAttribute('stroke-width',5);X.note.textContent=(k==='white'?'White light: red and blue absorbed (green reflected)':d.name+' light is absorbed');
       tween(ctx,1.6,p=>{X.bar.setAttribute('width',d.rate*1.96*p);if(Math.random()<.15*p){const b=C(360+rnd(-20,20),215,rnd(3,6),{fill:'#fff',opacity:.9,'stroke-width':1.2});X.fx.append(b);b.dataset.y=215}},()=>{X.busy=false;if(done)done()})}})};
  ctx.bg.raf(dt=>{[...X.fx.children].forEach(b=>{const y=+b.getAttribute('cy')-45*dt;b.setAttribute('cy',y);if(y<110)b.remove()})});
  return X},
 steps:[
  {k:'watch',run(X,ctx){X.clear();X.lab.setAttribute('opacity',0);ctx.after(1200,()=>X.lab.setAttribute('opacity',1));ctx.after(2200,()=>X.note.textContent='Chloroplasts contain green chlorophyll')}},
  {k:'watch',run(X,ctx){X.clear();X.lab.setAttribute('opacity',1);ctx.after(600,()=>X.shine('red'));ctx.after(5200,()=>X.shine('blue'));ctx.after(9800,()=>X.shine('green'))}},
  {k:'predict',q:'Which colour of light do plants use the least for photosynthesis?',opts:['Green','Red','Blue','They use all equally'],ans:0,why:'Chlorophyll reflects green light, which is why leaves look green. Red and blue are absorbed.',run(X){X.clear()}},
  {k:'try',build(X,ctx){const h=ctx.panel;X.clear();let k='red';const seen=new Set();
   const fb=H('div',{class:'fb info'},'Choose a colour of light, then press Shine.'),pg=H('p',{class:'hint'},'Tested 0 of 4');
   pickRow(h,Object.keys(LIGHTS).map(c=>({id:c,label:LIGHTS[c].name})),id=>k=id,'red');
   const go=H('button',{class:'btn small',onclick:()=>{if(X.busy)return;go.disabled=true;X.shine(k,()=>{go.disabled=false;seen.add(k);const d=LIGHTS[k];fb.className='fb '+(d.rate>50?'good':'bad');fb.textContent=d.mode==='ref'?'Green light is mostly reflected, so photosynthesis is slow.':d.name+' light is absorbed, so photosynthesis is '+(d.rate>85?'fastest':'fast')+'.';pg.textContent='Tested '+seen.size+' of 4';if(seen.size>=4)ctx.done()})}},'Shine');
   h.append(go,fb,pg)}},
  {k:'sum',take:'Chlorophyll is a green pigment in the chloroplasts. It absorbs red and blue light and reflects green, so leaves look green.',run(X){X.clear();X.lab.setAttribute('opacity',1)}}],
 quiz:[Q('t','What does chlorophyll do?',['Absorbs light energy','Makes proteins','Absorbs water','Stores starch'],0,'Chlorophyll absorbs light energy for photosynthesis.'),
  Q('t','Why do leaves look green?',['Chlorophyll reflects green light','Chlorophyll absorbs green light','Leaves contain green water','Starch is green'],0,'Green light is reflected back to our eyes.'),
  Q('t','Which part of the cell contains chlorophyll?',['Chloroplasts','Nucleus','Cell wall','Vacuole'],0,'Chlorophyll is found in the chloroplasts.')]});

/* ===== 1.3 Testing a leaf for starch ===== */
const STP=[{t:'1. Boil in water',s:'kills the leaf and stops reactions'},{t:'2. Boil in ethanol',s:'removes the green chlorophyll'},{t:'3. Rinse in water',s:'softens the brittle leaf'},{t:'4. Add iodine',s:'blue-black means starch'}];
SCENES.push({id:'1.3',act:'plant',title:'Testing a leaf for starch',idea:'Boil, ethanol, rinse, iodine',
 setup(ctx){
  const s=ctx.svg();const X={s,pan:[],leaf:[]};
  STP.forEach((st,i)=>{const x=20+i*195;const g=G(x,60);g.append(R(0,0,180,250,{rx:18,fill:'var(--paper)','stroke-width':2.5}),T(90,32,st.t,{'font-size':19,'font-family':'Fredoka,sans-serif'}));
    const cap=S('g');{const w=st.s.split(' '),m=Math.ceil(w.length/2);cap.append(T(x+90,338,w.slice(0,m).join(' '),{'font-size':14,fill:'var(--muted)'}),T(x+90,356,w.slice(m).join(' '),{'font-size':14,fill:'var(--muted)'}))};
    if(i===0){const b=beaker(40,80,100,120,'#9ccbf2',{fill:.35});g.append(b.g);for(let k=0;k<4;k++)g.append(C(60+k*18,112+(k%2)*10,4,{fill:'#fff','stroke-width':1}))}
    if(i===1){const b=beaker(20,110,140,90,'#9ccbf2',{fill:.3});g.append(b.g);g.append(R(64,70,52,120,{rx:10,fill:'#fdf6c8','stroke-width':2.5}),T(90,215,'ethanol in a water bath',{'font-size':12,fill:'var(--muted)'}))}
    if(i===2){g.append(R(30,150,120,26,{rx:6,fill:'#dfe6ee','stroke-width':2.5}));for(let k=0;k<5;k++)g.append(S('path',{d:`M${50+k*22} 90q4 10 0 18`,stroke:'var(--cold)','stroke-width':3,fill:'none'}))}
    if(i===3){g.append(R(30,150,120,26,{rx:6,fill:'#f5f5f5','stroke-width':2.5}),R(110,60,12,40,{rx:4,fill:'#c97b2c'}),C(116,112,6,{fill:'#c97b2c',stroke:'none'}))}
    const lf=leafAt(g,45,i===1?150:132,70,36,LEAFG);X.leaf.push(lf);X.pan.push(g);s.append(g,cap)});
  X.cap=T(400,410,'',{'font-size':20,fill:'var(--accent)','font-family':'Fredoka,sans-serif'});s.append(X.cap);
  X.cols=['#4caf50','#3f9a45','#f2f0d8','#f2f0d8','#1a1a55'];
  X.set=(i,on)=>{X.pan[i].setAttribute('opacity',on?1:.3)};
  X.res=S('g',{opacity:0});X.res.append(R(60,100,320,200,{rx:18,fill:'var(--paper)','stroke-width':2.5}),R(420,100,320,200,{rx:18,fill:'var(--paper)','stroke-width':2.5}));leafAt(X.res,130,200,180,100,'#1a1a55');leafAt(X.res,490,200,180,100,'#d98b3a');X.res.append(T(220,128,'starch present',{'font-size':20,fill:'var(--accent)'}),T(580,128,'no starch',{'font-size':20,fill:'var(--muted)'}),T(220,332,'blue-black',{'font-size':22,'font-family':'Fredoka,sans-serif'}),T(580,332,'orange-brown (iodine colour)',{'font-size':19,'font-family':'Fredoka,sans-serif'}));s.append(X.res);
  X.reset=()=>{X.pan.forEach(p=>p.setAttribute('opacity',1));X.leaf.forEach(l=>l.firstChild.setAttribute('fill',LEAFG));X.res.setAttribute('opacity',0);X.cap.textContent='';[...s.children].forEach(c=>{if(c!==X.res)c.style&&(c.style.display='')})};
  X.hideSteps=h=>{X.pan.forEach(p=>p.style.display=h?'none':'');[...s.children].forEach(c=>{if(c.tagName==='g'&&c!==X.res&&!X.pan.includes(c))c.style.display=h?'none':''})};
  return X},
 steps:[
  {k:'watch',run(X,ctx){X.hideSteps(false);X.res.setAttribute('opacity',0);X.reset();X.pan.forEach(p=>p.setAttribute('opacity',.3));[0,1,2,3].forEach(i=>ctx.after(900+i*3600,()=>{X.pan.forEach(p=>p.setAttribute('opacity',.3));X.pan[i].setAttribute('opacity',1);X.leaf[i].firstChild.setAttribute('fill',X.cols[i+1]);X.cap.textContent=STP[i].t.slice(3)+': '+STP[i].s;if(i===2)X.leaf[3].firstChild.setAttribute('fill','#f2f0d8')}));ctx.after(15500,()=>X.cap.textContent='The leaf is now white, ready for iodine')}},
  {k:'watch',run(X,ctx){X.hideSteps(true);X.res.setAttribute('opacity',0);ctx.after(600,()=>X.res.setAttribute('opacity',1))}},
  {k:'predict',q:'Why is the leaf boiled in ethanol?',opts:['To remove the green chlorophyll','To make starch','To add iodine','To make it grow'],ans:0,why:'Chlorophyll would hide the colour change. Ethanol removes it so the iodine result is easy to see.',run(X){X.hideSteps(false);X.reset();X.res.setAttribute('opacity',0);X.pan.forEach(p=>p.setAttribute('opacity',1));X.leaf[1].firstChild.setAttribute('fill','#f2f0d8')}},
  {k:'try',build(X,ctx){X.hideSteps(false);X.reset();X.res.setAttribute('opacity',0);
   orderGame(ctx.panel,{help:'Tap the steps in the right order.',items:['Dip the leaf in boiling water','Boil the leaf in ethanol in a water bath','Rinse the leaf in water','Add iodine solution'],why:['First, kill the leaf and stop reactions.','Then remove the chlorophyll.','Rinse and soften the leaf.','Finally add iodine and look for blue-black.'],onDone:ctx.done})}},
  {k:'sum',take:'Boil in water, boil in ethanol (in a water bath, no flame), rinse, add iodine. Blue-black means starch is present.',run(X){X.hideSteps(true);X.res.setAttribute('opacity',1)}}],
 quiz:[Q('t','What colour does iodine turn when starch is present?',['Blue-black','Orange-brown','Red','Colourless'],0,'Blue-black means starch. Orange-brown means no starch.'),
  Q('t','Why is the ethanol heated in a water bath, not directly with a flame?',['Ethanol is flammable','Water makes the leaf green','It makes starch faster','Ethanol evaporates too slowly'],0,'Ethanol catches fire easily, so we heat it safely with hot water.'),
  Q('t','Why is the leaf first dipped in boiling water?',['To kill it and stop reactions','To add chlorophyll','To make starch','To turn it blue'],0,'Boiling kills the leaf cells and stops chemical reactions, and it makes the leaf soft.')]});

/* ===== 1.4 What does a plant need? ===== */
const EXPS={var:{n:'Variegated leaf',c:'Chlorophyll is needed. Only the green parts made starch.'},cov:{n:'Leaf covered with foil',c:'Light is needed. The covered part made no starch.'},co2:{n:'No carbon dioxide',c:'Carbon dioxide is needed. With no CO₂ the leaf made no starch.'}};
SCENES.push({id:'1.4',act:'plant',title:'What does photosynthesis need?',idea:'Light, carbon dioxide and chlorophyll',
 setup(ctx){
  const s=ctx.svg();const X={s,cur:'var'};
  X.before=S('g');X.after=S('g');s.append(X.before,X.after);X.title=T(400,44,'',{'font-size':22,fill:'var(--accent)','font-family':'Fredoka,sans-serif'});X.res=T(400,420,'',{'font-size':19,fill:'var(--ink)'});s.append(X.title,X.res);
  X.draw=(k,tested)=>{X.before.innerHTML='';X.after.innerHTML='';X.cur=k;X.title.textContent=EXPS[k].n;X.res.textContent='';
   X.before.append(T(200,100,'before the test',{'font-size':17,fill:'var(--muted)'}),R(40,115,320,250,{rx:18,fill:'var(--paper)','stroke-width':2.5}));
   X.after.append(T(600,100,tested?'after the starch test':'after the starch test (not done yet)',{'font-size':17,fill:'var(--muted)'}),R(440,115,320,250,{rx:18,fill:'var(--paper)','stroke-width':2.5}));
   const id='cp'+k+Math.random().toString(36).slice(2,6);
   const lf=(parent,x,y,w,h,patch)=>{const g=S('g',{transform:`translate(${x} ${y})`});const defs=S('defs');const cp=S('clipPath',{id});cp.append(S('path',{d:leafPath(w,h)}));defs.append(cp);g.append(defs,patch(w,h,id));g.append(S('path',{d:leafPath(w,h),fill:'none',stroke:'var(--ink)','stroke-width':2.5}),L(0,0,w*.92,0,{stroke:'rgba(0,0,0,.25)','stroke-width':2}));parent.append(g)};
   const clipG=(col,rects)=>(w,h,i)=>{const g=S('g',{'clip-path':`url(#${i})`});g.append(R(-5,-h,w+10,2*h,{fill:col,stroke:'none',rx:0}));rects.forEach(r=>g.append(R(r[0]*w,r[1]*h,r[2]*w,r[3]*h,{fill:r[4],stroke:'none',rx:0})));return g};
   if(k==='var'){lf(X.before,80,240,250,140,clipG('#4caf50',[[0,-1,1,.28,'#f4f4ec'],[0,.72,1,.28,'#f4f4ec'],[0,-.72,.12,1.44,'#f4f4ec'],[.88,-.72,.12,1.44,'#f4f4ec']]));X.before.append(T(200,330,'green centre, white edge',{'font-size':15,fill:'var(--muted)'}));
     if(tested){lf(X.after,480,240,250,140,clipG('#1a1a55',[[0,-1,1,.28,'#d98b3a'],[0,.72,1,.28,'#d98b3a'],[0,-.72,.12,1.44,'#d98b3a'],[.88,-.72,.12,1.44,'#d98b3a']]));X.after.append(T(600,330,'blue-black only where green',{'font-size':15,fill:'var(--muted)'}))}}
   if(k==='cov'){lf(X.before,80,240,250,140,clipG('#4caf50',[[.35,-1,.3,2,'#2b2b2b']]));X.before.append(T(200,330,'black foil covers part of the leaf',{'font-size':15,fill:'var(--muted)'}),T(200,150,'in the light for a day',{'font-size':15,fill:'var(--accent)'}));
     if(tested){lf(X.after,480,240,250,140,clipG('#1a1a55',[[.35,-1,.3,2,'#d98b3a']]));X.after.append(T(600,330,'covered strip: orange-brown',{'font-size':15,fill:'var(--muted)'}))}}
   if(k==='co2'){const b=S('g');b.append(S('path',{d:'M110 250Q110 140 200 140Q290 140 290 250V330H110Z',fill:'rgba(156,203,242,.35)',stroke:'var(--ink)','stroke-width':3}),R(150,320,100,16,{rx:4,fill:'#bfa5e8','stroke-width':2}),T(200,352,'soda lime absorbs CO₂',{'font-size':14,fill:'var(--muted)'}),Pth('M200 320V230',{stroke:'#4a8f3a','stroke-width':6}));leafAt(b,202,255,70,36,LEAFG,{rot:-30});leafAt(b,198,275,60,32,LEAFG,{rot:-150});X.before.append(b);
     if(tested){lf(X.after,480,290,120,70,clipG('#d98b3a',[]));lf(X.after,625,290,115,70,clipG('#1a1a55',[]));X.after.append(T(540,225,'no CO₂',{'font-size':15,fill:'var(--muted)'}),T(685,225,'with CO₂',{'font-size':15,fill:'var(--muted)'}),T(600,330,'no starch without carbon dioxide',{'font-size':15,fill:'var(--muted)'}))}}
   if(tested)X.res.textContent=EXPS[k].c;};
  X.draw('var',false);return X},
 steps:[
  {k:'watch',run(X,ctx){X.draw('var',false);ctx.after(2800,()=>X.draw('var',true))}},
  {k:'watch',run(X,ctx){X.draw('cov',false);ctx.after(3000,()=>X.draw('cov',true));ctx.after(7500,()=>X.draw('co2',false));ctx.after(10500,()=>X.draw('co2',true))}},
  {k:'predict',q:'A strip of a leaf is covered with foil for a day, then the leaf is tested for starch. What colour is the covered strip?',opts:['Orange-brown: no starch','Blue-black: starch','Green','White'],ans:0,why:'No light reached the strip, so no photosynthesis and no starch: it stays iodine orange-brown.',run(X){X.draw('cov',false)},reveal(X){X.draw('cov',true)}},
  {k:'try',build(X,ctx){const h=ctx.panel;let k='var';const seen=new Set();X.draw('var',false);
   const fb=H('div',{class:'fb info'},'Pick an experiment and do the starch test.'),pg=H('p',{class:'hint'},'Done 0 of 3');
   pickRow(h,Object.keys(EXPS).map(e=>({id:e,label:EXPS[e].n})),id=>{k=id;X.draw(id,false)},'var');
   const go=H('button',{class:'btn small',onclick:()=>{X.draw(k,true);seen.add(k);fb.className='fb good';fb.textContent=EXPS[k].c;pg.textContent='Done '+seen.size+' of 3';if(seen.size>=3)ctx.done()}},'Do the starch test');
   h.append(go,fb,pg)}},
  {k:'sum',take:'Photosynthesis needs light, carbon dioxide and chlorophyll. Test a leaf for starch to see if photosynthesis happened. Destarch the plant first.',run(X){X.draw('var',true)}}],
 quiz:[Q('t','In a variegated leaf, where is starch found after the test?',['Only in the green parts','Only in the white parts','Everywhere','Nowhere'],0,'Only the parts with chlorophyll photosynthesise.'),
  Q('t','Why is a plant kept in the dark for 24 hours before the experiment?',['To use up its starch','To make it grow','To add chlorophyll','To make it warm'],0,'Destarching makes sure any starch found was made during the experiment.'),
  Q('t','What does soda lime do in a bell jar experiment?',['Absorbs carbon dioxide','Adds oxygen','Gives light','Waters the plant'],0,'Soda lime removes CO₂ so we can test if the plant needs it.')]});
