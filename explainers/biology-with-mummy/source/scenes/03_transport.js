/* ===== 1.8 The carbon cycle ===== */
SCENES.push({id:'1.8',act:'plant',title:'The carbon cycle',idea:'Carbon moves between air, living things, fossil fuels',
 setup(ctx){
  const s=ctx.svg();const X={s,g1:S('g'),g2:S('g')};
  s.append(R(30,30,740,62,{rx:30,fill:'#e4edf7',stroke:'var(--line)','stroke-width':2}),T(400,70,'carbon dioxide (CO₂) in the air',{'font-size':22,'font-family':'Fredoka,sans-serif',fill:'#4a5d80'}));
  s.append(X.g1,X.g2);
  const tree=G(120,255);tree.append(R(-8,10,16,50,{rx:3,fill:'#8d6e4a'}),C(0,-10,44,{fill:'#4caf50','stroke-width':2.5}),C(-26,12,26,{fill:'#43a047','stroke-width':2.5}),C(26,12,26,{fill:'#43a047','stroke-width':2.5}),T(0,92,'plants',{'font-size':18,'font-family':'Fredoka,sans-serif'}));
  const cow=G(310,262);cow.append(R(-40,-14,80,40,{rx:14,fill:'#f4efe6','stroke-width':2.5}),R(30,-28,30,28,{rx:8,fill:'#f4efe6','stroke-width':2.5}),C(40,-16,3,{fill:'var(--ink)',stroke:'none'}),R(-32,26,8,26,{rx:3,fill:'#f4efe6','stroke-width':2}),R(20,26,8,26,{rx:3,fill:'#f4efe6','stroke-width':2}),C(-18,0,9,{fill:'#555',stroke:'none'}),T(0,92,'animals',{'font-size':18,'font-family':'Fredoka,sans-serif'}));
  X.g1.append(tree,cow);
  const dead=G(505,265);dead.append(S('path',{d:'M-60 40Q-30 -10 0 -6Q40 -12 62 40Z',fill:'#7a5a3a','stroke-width':2.5,stroke:'var(--ink)'}),C(-20,20,5,{fill:'#d8c27a',stroke:'none'}),C(10,12,5,{fill:'#d8c27a',stroke:'none'}),C(30,26,4,{fill:'#d8c27a',stroke:'none'}),T(0,70,'dead matter and decomposers',{'font-size':15,'font-family':'Fredoka,sans-serif'}),T(0,90,'(bacteria and fungi)',{'font-size':14,fill:'var(--muted)'}));
  const fac=G(690,255);fac.append(R(-44,-10,88,64,{rx:4,fill:'#b8c1cf','stroke-width':2.5}),R(18,-52,18,44,{rx:2,fill:'#9aa5b5','stroke-width':2.5}),T(0,82,'burning fuels',{'font-size':18,'font-family':'Fredoka,sans-serif'}));
  const fos=G(690,395);fos.append(R(-70,-10,140,38,{rx:8,fill:'#2b2b2f','stroke-width':2.5}),T(0,48,'fossil fuels',{'font-size':16,'font-family':'Fredoka,sans-serif'}));
  X.g2.append(dead,fac,fos);
  const A={ph:flowLine(ctx,X.g1,[[85,100],[85,170]],{col:'#2f9e44',label:'photosynthesis',lx:85,ly:120,fs:15,n:2,speed:.3}),
   rp:flowLine(ctx,X.g1,[[160,175],[160,100]],{col:'#d65a5a',label:'respiration',lx:200,ly:128,fs:15,n:2,speed:.3}),
   eat:flowLine(ctx,X.g1,[[175,250],[255,250]],{col:'#e08a2c',label:'eating',lx:215,ly:236,fs:15,n:2,speed:.3}),
   ra:flowLine(ctx,X.g1,[[320,225],[320,100]],{col:'#d65a5a',label:'respiration',lx:380,ly:150,fs:15,n:3,speed:.3}),
   dd:flowLine(ctx,X.g2,[[120,358],[120,402],[505,402],[505,376]],{col:'#8d6e4a',label:'death',lx:250,ly:394,fs:15,n:4,speed:.2}),
   da:flowLine(ctx,X.g2,[[352,300],[385,400]],{col:'#8d6e4a',n:2,speed:.2,w:2}),
   dc:flowLine(ctx,X.g2,[[505,225],[505,100]],{col:'#d65a5a',label:'decay',lx:550,ly:170,fs:15,n:3,speed:.3}),
   fo:flowLine(ctx,X.g2,[[560,376],[630,392]],{col:'#555',label:'millions of years',lx:590,ly:436,fs:14,n:2,speed:.15}),
   bu:flowLine(ctx,X.g2,[[748,385],[748,300]],{col:'#e08a2c',n:2,speed:.2}),
   co:flowLine(ctx,X.g2,[[717,195],[717,100]],{col:'#d65a5a',label:'combustion',lx:717,ly:150,fs:15,n:3,speed:.3})};
  X.A=A;X.view=n=>{X.g1.setAttribute('opacity',1);X.g2.setAttribute('opacity',n>=2?1:0)};X.view(1);return X},
 steps:[
  {k:'watch',run(X){X.view(1)}},
  {k:'watch',run(X){X.view(2)}},
  {k:'predict',q:'Which process removes carbon dioxide from the air?',opts:['Photosynthesis','Respiration','Burning fuels','Decay'],ans:0,why:'Plants take carbon dioxide from the air to make glucose. The others all add carbon dioxide.',run(X){X.view(2)}},
  {k:'try',build(X,ctx){X.view(2);
   matchGame(ctx.panel,{help:'Does the process add CO₂ to the air or remove it?',items:[
    {label:'Photosynthesis',to:'rem',hint:'Plants use CO₂ to make food.'},{label:'A tree growing bigger',to:'rem',hint:'It is taking in carbon from the air.'},
    {label:'Respiration in animals',to:'add',hint:'Respiration releases CO₂.'},{label:'Burning fossil fuels',to:'add',hint:'Combustion makes CO₂.'},
    {label:'Decay by bacteria and fungi',to:'add',hint:'Decomposers respire and release CO₂.'},{label:'A forest fire',to:'add',hint:'Burning wood releases CO₂.'}],
    buckets:[{id:'rem',label:'Removes CO₂ from the air'},{id:'add',label:'Adds CO₂ to the air'}],onDone:ctx.done})}},
  {k:'sum',take:'Photosynthesis removes carbon dioxide. Respiration, decay and burning add it. Carbon passes along food chains when animals eat plants.',run(X){X.view(2)}}],
 quiz:[Q('t','Which of these adds carbon dioxide to the air?',['Burning fossil fuels','Photosynthesis','Growing trees','Planting a forest'],0,'Burning fossil fuels releases carbon dioxide.'),
  Q('t','How does carbon pass from plants to animals?',['By eating','By breathing','By photosynthesis','By decay'],0,'Animals eat plants and use their carbon compounds.'),
  Q('t','What forms over millions of years from the remains of dead plants and animals?',['Fossil fuels','Carbon dioxide','Starch','Glucose'],0,'Coal, oil and gas are fossil fuels.')]});

/* ===== 1.9 Roots and xylem ===== */
SCENES.push({id:'1.9',act:'plant',title:'Roots and the xylem',idea:'Water and minerals travel up the xylem',
 setup(ctx){
  const s=ctx.svg();const X={s,t:0};const pg=S('g'),cg=S('g');s.append(pg,cg);X.pg=pg;X.cg=cg;
  /* plant view */
  pg.append(R(0,330,500,120,{fill:'#8d6e4a',stroke:'none',rx:0}),T(70,430,'soil',{'font-size':16,fill:'#f3e3c8'}),R(292,120,16,220,{rx:4,fill:'#bfe0f7','stroke-width':2.5}),T(250,230,'xylem',{'font-size':17,fill:'var(--cold)','text-anchor':'end','font-family':'Fredoka,sans-serif'}));
  leafAt(pg,300,150,150,70,LEAFG,{rot:-30});leafAt(pg,300,190,130,64,LEAFG,{rot:-150});
  pg.append(Pth('M300 340L240 400M300 340L360 405M300 340L300 410M300 345L205 372M300 345L395 372',{stroke:'#c9a77a','stroke-width':3}));
  X.up=flowLine(ctx,pg,[[300,380],[300,150]],{col:'var(--cold)',n:6,speed:.18});
  X.root=S('g',{opacity:0});X.root.append(R(520,40,240,380,{rx:20,fill:'var(--paper)','stroke-width':2.5}),T(640,70,'root hair cell',{'font-size':18,'font-family':'Fredoka,sans-serif'}),R(522,300,236,118,{rx:0,fill:'#8d6e4a',stroke:'none'}),S('path',{d:'M580 260Q580 130 640 130Q700 130 700 260Z',fill:'#f1f7e6',stroke:'var(--ink)','stroke-width':3}),S('path',{d:'M600 260Q588 310 610 360M640 260Q640 315 640 365M680 260Q692 310 670 360',stroke:'var(--ink)','stroke-width':4,fill:'none','stroke-linecap':'round'}),C(640,185,20,{fill:'#c9b3e8','stroke-width':2.5}),T(640,398,'long thin hair = big surface area',{'font-size':13,fill:'#f3e3c8'}));
  for(let i=0;i<10;i++)X.root.append(C(550+(i%5)*40+rnd(-8,8),330+Math.floor(i/5)*34,5,{fill:'#9ccbf2',opacity:.9,stroke:'none'}));s.append(X.root);
  X.lab=T(300,60,'',{'font-size':20,fill:'var(--accent)','font-family':'Fredoka,sans-serif'});pg.append(X.lab);
  /* celery view */
  const bk=beaker(250,290,200,130,'#d7263d',{fill:.1,op:.55});cg.append(bk.g);
  X.stalk=R(340,110,20,310,{rx:4,fill:'#cfe6b4','stroke-width':2.5});cg.append(X.stalk);X.dye=R(341,420,18,0,{rx:2,fill:'#d7263d',stroke:'none',opacity:.85});cg.append(X.dye);
  leafAt(cg,350,110,90,44,LEAFG,{rot:-40});leafAt(cg,350,115,80,40,LEAFG,{rot:-140});cg.append(T(350,34,'celery stalk in red dye',{'font-size':18,fill:'var(--muted)'}));
  X.cs=S('g',{opacity:0});X.cs.append(R(540,100,220,220,{rx:20,fill:'var(--paper)','stroke-width':2.5}),T(650,128,'cross-section of the stalk',{'font-size':15,fill:'var(--muted)'}),C(650,215,70,{fill:'#d9ecb8','stroke-width':3}));for(let i=0;i<8;i++){const a=i*Math.PI/4;X.cs.append(C(650+44*Math.cos(a),215+44*Math.sin(a),9,{fill:'#d7263d','stroke-width':1.5}))}X.cs.append(T(650,308,'red dots = xylem',{'font-size':15,fill:'#d7263d'}));cg.append(X.cs);
  X.tm=T(150,360,'',{'font-size':20,'font-family':'Fredoka,sans-serif'});cg.append(X.tm);
  X.setT=t=>{X.t=t;const h=Math.min(300,t*10);X.dye.setAttribute('y',420-h);X.dye.setAttribute('height',h);X.tm.textContent=t+' minutes'};
  X.view=m=>{pg.setAttribute('opacity',m==='p'?1:0);cg.setAttribute('opacity',m==='c'?1:0)};X.view('p');return X},
 steps:[
  {k:'watch',run(X,ctx){X.view('p');X.root.setAttribute('opacity',0);X.lab.textContent='';ctx.after(1500,()=>{X.root.setAttribute('opacity',1);X.lab.textContent='Root hairs absorb water and minerals'});ctx.after(6500,()=>X.lab.textContent='The xylem carries them up to the leaves')}},
  {k:'watch',run(X,ctx){X.view('c');X.cs.setAttribute('opacity',0);X.setT(0);tween(ctx,7,p=>X.setT(Math.round(30*p)),()=>{X.cs.setAttribute('opacity',1)})}},
  {k:'predict',q:'Which tissue carries water and minerals up from the roots to the leaves?',opts:['Xylem','Phloem','Palisade layer','Cuticle'],ans:0,why:'Xylem tubes carry water and dissolved minerals upwards. Phloem carries sugars.',run(X){X.view('p');X.root.setAttribute('opacity',0)}},
  {k:'try',build(X,ctx){const h=ctx.panel;X.view('c');X.cs.setAttribute('opacity',0);X.setT(0);let cut=false,far=false;
   const fb=H('div',{class:'fb info'},'Slide the time forward, then cut a slice of the stalk.');const chk=()=>{if(cut&&far)ctx.done()};
   const sl=sliderRow('Time',0,30,0,1,v=>{X.setT(v);if(v>=20)far=true;fb.className='fb info';fb.textContent=v<20?'The dye is climbing the stalk through the xylem tubes.':'The dye has reached the top of the stalk.';chk()},' min');
   const cutB=H('button',{class:'btn small',onclick:()=>{cut=true;X.cs.setAttribute('opacity',1);fb.className='fb good';fb.textContent='Only the xylem tubes are stained red. They carry the water up.';chk()}},'Cut a slice');
   h.append(sl.el,cutB,fb,H('p',{class:'hint'},'Go to at least 20 minutes, then cut a slice.'))}},
  {k:'sum',take:'Root hair cells have a big surface area to absorb water and minerals. The xylem carries them up to the leaves.',run(X){X.view('p');X.root.setAttribute('opacity',1);X.lab.textContent=''}}],
 quiz:[Q('t','What does the xylem carry?',['Water and minerals','Sugars','Oxygen','Starch'],0,'Xylem carries water and dissolved minerals from the roots upwards.'),
  Q('t','Why do root hair cells have long, thin extensions?',['To give a large surface area','To make food','To absorb light','To store starch'],0,'A large surface area absorbs more water and minerals.'),
  Q('t','In the celery experiment, what is stained red?',['The xylem','The phloem','The stomata','The chlorophyll'],0,'The red dye rises up the xylem tubes.')]});

/* ===== 1.10 Transpiration and the phloem ===== */
SCENES.push({id:'1.10',act:'plant',title:'Transpiration and the phloem',idea:'Water loss from leaves; sugars carried by the phloem',
 setup(ctx){
  const s=ctx.svg();const X={s,rate:2};
  s.append(R(0,350,800,100,{fill:'#8d6e4a',stroke:'none',rx:0}),R(286,150,12,200,{rx:3,fill:'#bfe0f7','stroke-width':2}),R(302,150,12,200,{rx:3,fill:'#ffd9a8','stroke-width':2}));
  leafAt(s,300,170,160,76,LEAFG,{rot:-28});leafAt(s,300,210,140,70,LEAFG,{rot:-152});s.append(Pth('M300 350L250 410M300 350L350 412M300 350V415',{stroke:'#c9a77a','stroke-width':3}));
  X.xy=flowLine(ctx,s,[[292,410],[292,160]],{col:'var(--cold)',n:6,speed:()=>.07+X.rate*.045});
  X.ph=S('g',{opacity:0});s.append(X.ph);X.ph.append(flowLine(ctx,X.ph,[[308,170],[308,400]],{col:'#e08a2c',n:5,speed:.16}),flowLine(ctx,X.ph,[[308,400],[308,170]],{col:'#e08a2c',n:3,speed:.1}));
  X.puff=S('g');s.append(X.puff);
  ctx.bg.raf(dt=>{if(Math.random()<dt*X.rate*3.4){const x=rnd(360,440)+(Math.random()>.5?0:-190),y=rnd(110,190);const p=C(x,y,rnd(4,7),{fill:'var(--cold)',opacity:.6,stroke:'none'});X.puff.append(p)}[...X.puff.children].forEach(p=>{const y=+p.getAttribute('cy')-30*dt*(.5+X.rate/3),o=+p.getAttribute('opacity')-.25*dt;p.setAttribute('cy',y);p.setAttribute('opacity',o);if(o<=0)p.remove()})});
  X.lab=S('g');X.lab.append(T(560,120,'water vapour leaves through the stomata',{'font-size':16,fill:'var(--cold)','text-anchor':'start'}),T(170,300,'xylem: water UP',{'font-size':16,fill:'var(--cold)','font-family':'Fredoka,sans-serif'}),T(450,330,'phloem: sugars UP and DOWN',{'font-size':16,fill:'#e08a2c','font-family':'Fredoka,sans-serif'}));s.append(X.lab);
  X.meter=S('g');X.meter.append(R(560,200,200,26,{rx:13,fill:'var(--paper)','stroke-width':2.5}),T(660,252,'rate of water loss',{'font-size':16,fill:'var(--muted)'}));X.mb=R(562,202,40,22,{rx:11,fill:'var(--cold)',stroke:'none'});X.meter.append(X.mb);s.append(X.meter);X.meter.setAttribute('opacity',0);
  X.note=T(400,44,'',{'font-size':21,fill:'var(--accent)','font-family':'Fredoka,sans-serif'});s.append(X.note);
  X.setRate=r=>{X.rate=r;X.mb.setAttribute('width',Math.min(196,r/9.8*196))};
  X.view=m=>{X.ph.setAttribute('opacity',m==='ph'?1:0);X.xy.setAttribute('opacity',m==='ph'?.3:1);X.meter.setAttribute('opacity',m==='tr'?1:0);X.lab.setAttribute('opacity',m==='ph'?1:0)};X.view('tr');X.setRate(2);return X},
 steps:[
  {k:'watch',run(X,ctx){X.view('tr');X.setRate(2);X.note.textContent='Transpiration: water evaporates from the leaves';ctx.after(5000,()=>X.note.textContent='It pulls more water up the xylem, like a straw')}},
  {k:'watch',run(X,ctx){X.view('ph');X.setRate(2);X.note.textContent='Phloem carries sugars made in the leaves'}},
  {k:'predict',q:'Which weather makes a plant lose water the fastest?',opts:['Hot, dry and windy','Cool, humid and still','Cool and windy','Cold and dark'],ans:0,why:'Heat, dry air and wind all speed up evaporation from the leaves, so transpiration is fastest.',run(X){X.view('tr');X.setRate(2);X.note.textContent=''}},
  {k:'try',build(X,ctx){const h=ctx.panel;X.view('tr');const st={hot:false,wind:false,dry:false,bright:false};let max=false,min=false;
   const calc=()=>{const r=(st.hot?2:1)*(st.wind?1.8:1)*(st.dry?1.8:1)*(st.bright?1.5:1);return r};
   const fb=H('div',{class:'fb info'},'Switch the conditions on and off. Find the fastest and the slowest water loss.');
   const upd=()=>{const r=calc();X.setRate(r*1.0);if(st.hot&&st.wind&&st.dry&&st.bright)max=true;if(!st.hot&&!st.wind&&!st.dry&&!st.bright)min=true;fb.className='fb '+(r>5?'bad':'info');fb.textContent='Rate of water loss: '+(r>7?'very fast':r>3?'fast':r>1.5?'moderate':'slow')+'.';if(max&&min)ctx.done()};
   const mk=(k,lab)=>{const b=H('button',{class:'chip','aria-pressed':'false',onclick:()=>{st[k]=!st[k];b.classList.toggle('sel',st[k]);b.setAttribute('aria-pressed',String(st[k]));upd()}},lab);return b};
   h.append(H('div',{class:'chips'},mk('hot','Hot'),mk('wind','Windy'),mk('dry','Dry air'),mk('bright','Bright light')),fb,H('p',{class:'hint'},'Try all four on, and then all four off.'));upd()}},
  {k:'sum',take:'Transpiration is loss of water vapour from the leaves, faster when hot, dry, windy and bright. Xylem carries water up; phloem carries sugars both ways.',run(X){X.view('tr');X.setRate(2);X.note.textContent=''}}],
 quiz:[Q('t','What is transpiration?',['Loss of water vapour from the leaves','Making sugar in the leaves','Absorbing water in the roots','Moving sugar to the roots'],0,'Transpiration is evaporation of water from the leaves, mostly through the stomata.'),
  Q('t','What does the phloem carry?',['Sugars (sucrose)','Water only','Minerals only','Oxygen'],0,'Phloem carries sugars made in the leaves to where they are needed.'),
  Q('t','Which condition reduces the rate of transpiration?',['Humid air','Wind','High temperature','Bright light'],0,'In humid air there is less difference in water content, so less water evaporates.')]});
