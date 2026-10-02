/* ===== 1.5 Leaf structure ===== */
const LPARTS={cuticle:{n:'Cuticle',f:'a waxy, waterproof layer that reduces water loss',b:[40,70,500,9],ly:70},
 uep:{n:'Upper epidermis',f:'a thin, transparent layer that protects the leaf and lets light through',b:[40,79,500,30],ly:100},
 pal:{n:'Palisade mesophyll',f:'tall cells packed with chloroplasts: most photosynthesis happens here',b:[40,109,500,90],ly:150},
 spo:{n:'Spongy mesophyll',f:'loosely packed cells with air spaces so gases can move around',b:[40,199,500,100],ly:205},
 vein:{n:'Vein (xylem and phloem)',f:'xylem brings water and minerals; phloem carries sugars away',b:[254,214,72,72],ly:255},
 lep:{n:'Lower epidermis',f:'a protective layer with tiny holes called stomata',b:[40,299,500,30],ly:295},
 sto:{n:'Stoma and guard cells',f:'a gap that guard cells open and close for gas exchange',b:[376,296,48,36],ly:335}};
SCENES.push({id:'1.5',act:'plant',title:'Inside a leaf',idea:'Layers of a leaf and what each one does',
 setup(ctx){
  const s=ctx.svg();const X={s,on:null,P:{},labs:{}};
  const grp=k=>{const g=S('g',{class:'hit',role:'button','aria-label':LPARTS[k].n});g.onclick=()=>{if(X.on)X.on(k)};X.P[k]=g;s.append(g);return g};
  const cu=grp('cuticle');cu.append(R(40,70,500,9,{rx:2,fill:'#f0d77a','stroke-width':1.5}));
  const ue=grp('uep');for(let i=0;i<12;i++)ue.append(R(40+i*41.6,80,41.6,29,{rx:3,fill:'#e9f6ee','stroke-width':1.5}));
  const pa=grp('pal');for(let i=0;i<16;i++){pa.append(R(40+i*31.25,110,31.25,88,{rx:6,fill:'#74c476','stroke-width':1.5}));for(let k=0;k<3;k++)pa.append(C(40+i*31.25+15.6,128+k*24,4.2,{fill:'#1f6f31',stroke:'none'}))}
  const sp=grp('spo');sp.append(R(40,200,500,98,{rx:0,fill:'#f7fbf4',stroke:'none'}));[[70,225],[130,262],[110,214],[175,240],[215,215],[220,272],[360,222],[420,240],[470,215],[500,262],[430,278],[345,270],[170,282],[60,276],[310,225]].forEach(p=>{sp.append(C(p[0],p[1],24,{fill:'#a5d6a7','stroke-width':1.5}));sp.append(C(p[0]-6,p[1]+2,3.5,{fill:'#1f6f31',stroke:'none'}),C(p[0]+7,p[1]-4,3.5,{fill:'#1f6f31',stroke:'none'}))});
  const ve=grp('vein');ve.append(C(290,250,34,{fill:'#efe6d2','stroke-width':2.5}),S('path',{d:'M270 244a8 8 0 0 1 16 0a8 8 0 0 1 -16 0M290 236a7 7 0 0 1 14 0a7 7 0 0 1 -14 0',fill:'#6aa9e8',stroke:'var(--ink)','stroke-width':1.5}),C(290,266,11,{fill:'#f3a23b','stroke-width':1.5}),T(290,246,'',{}));
  const le=grp('lep');for(let i=0;i<12;i++){if(i===8||i===9)continue;le.append(R(40+i*41.6,299,41.6,30,{rx:3,fill:'#e9f6ee','stroke-width':1.5}))}
  const st=grp('sto');st.append(S('path',{d:'M394 300Q383 314 394 328Q401 314 394 300Z',fill:'#4fb35c',stroke:'var(--ink)','stroke-width':2}),S('path',{d:'M406 300Q417 314 406 328Q399 314 406 300Z',fill:'#4fb35c',stroke:'var(--ink)','stroke-width':2}));
  X.lab=S('g');Object.keys(LPARTS).forEach(k=>{const p=LPARTS[k],cx=p.b[0]+p.b[2],cy=p.b[1]+p.b[3]/2;const g=S('g',{opacity:0});g.append(L(Math.min(cx,545),cy,566,p.ly,{stroke:'var(--muted)','stroke-width':1.5}),T(572,p.ly+5,p.n,{'text-anchor':'start','font-size':15,fill:'var(--ink)'}));X.lab.append(g);X.labs[k]=g});s.append(X.lab);
  X.ring=S('rect',{x:0,y:0,width:10,height:10,rx:6,fill:'none',stroke:'var(--hot)','stroke-width':4,opacity:0,'pointer-events':'none'});s.append(X.ring);
  s.append(T(290,50,'a leaf in cross-section (magnified)',{'font-size':16,fill:'var(--muted)'}));X.note=T(400,425,'',{'font-size':18,fill:'var(--accent)','font-family':'Fredoka,sans-serif'});s.append(X.note);
  X.flash=k=>{if(!k){X.ring.setAttribute('opacity',0);return}const b=LPARTS[k].b;setA(X.ring,{x:b[0]-3,y:b[1]-3,width:b[2]+6,height:b[3]+6,opacity:1})};
  X.showAll=on=>{Object.values(X.labs).forEach(g=>g.setAttribute('opacity',on?1:0));Object.values(X.P).forEach(g=>g.setAttribute('opacity',1))};
  return X},
 steps:[
  {k:'watch',run(X,ctx){X.on=null;X.flash(null);X.note.textContent='';const ks=['cuticle','uep','pal','spo','vein','lep','sto'];Object.values(X.P).forEach(g=>g.setAttribute('opacity',0));Object.values(X.labs).forEach(g=>g.setAttribute('opacity',0));ks.forEach((k,i)=>ctx.after(700+i*1500,()=>{X.P[k].setAttribute('opacity',1);X.labs[k].setAttribute('opacity',1)}))}},
  {k:'watch',run(X,ctx){X.on=null;X.showAll(true);const seq=['pal','spo','sto','vein'];seq.forEach((k,i)=>ctx.after(600+i*3200,()=>{X.flash(k);X.note.textContent=LPARTS[k].n+': '+LPARTS[k].f}))}},
  {k:'predict',q:'Which layer of the leaf does most of the photosynthesis?',opts:['Palisade mesophyll','Upper epidermis','Cuticle','Lower epidermis'],ans:0,why:'Palisade cells are tall, near the top where the light is strongest, and packed with chloroplasts.',run(X){X.on=null;X.flash(null);X.note.textContent='';X.showAll(true)}},
  {k:'try',build(X,ctx){X.showAll(true);X.flash(null);X.note.textContent='';Object.values(X.labs).forEach(g=>g.setAttribute('opacity',0));
   const goals=[{t:'Click the layer where most photosynthesis happens.',a:'pal'},{t:'Click the waterproof, waxy layer.',a:'cuticle'},{t:'Click the part that lets gases in and out.',a:'sto'},{t:'Click the layer with air spaces between its cells.',a:'spo'},{t:'Click the vein that carries water and sugars.',a:'vein'}];let gi=0;
   const goal=H('div',{class:'fb info'},goals[0].t),fb=H('div'),pg=H('p',{class:'hint'},'Found 0 of 5');
   X.on=k=>{if(gi>=goals.length)return;if(k===goals[gi].a){fb.className='fb good';fb.textContent=LPARTS[k].n+': '+LPARTS[k].f+'.';cheer(true);X.labs[k].setAttribute('opacity',1);gi++;pg.textContent='Found '+gi+' of 5';if(gi>=goals.length){goal.textContent='All five found!';ctx.done()}else goal.textContent=goals[gi].t}
     else{fb.className='fb bad';fb.textContent='That is the '+LPARTS[k].n.toLowerCase()+'. Try again.';cheer(false)}};
   ctx.panel.append(goal,fb,pg)}},
  {k:'sum',take:'Cuticle waterproofs. Palisade layer makes most food. Spongy layer has air spaces. Stomata let gases in and out. Veins carry water, minerals and sugars.',run(X){X.on=null;X.flash(null);X.note.textContent='';X.showAll(true)}}],
 quiz:[Q('t','Why are the palisade cells near the top of the leaf?',['To absorb the most light','To lose water','To hold air','To protect the leaf'],0,'They are packed with chloroplasts and get the most light at the top.'),
  Q('t','What is the job of the air spaces in the spongy mesophyll?',['Let gases move through the leaf','Store starch','Carry water up','Absorb light'],0,'Air spaces let carbon dioxide reach the cells and oxygen escape.'),
  Q('t','What does the waxy cuticle do?',['Reduces water loss','Absorbs sunlight','Makes sugar','Carries water'],0,'The cuticle is waterproof, so the leaf loses less water.')]});

/* ===== 1.6 Stomata and gas exchange ===== */
SCENES.push({id:'1.6',act:'plant',title:'Stomata and gas exchange',idea:'Guard cells open and close the stomata',
 setup(ctx){
  const s=ctx.svg();const X={s,o:1,target:1,parts:[]};const cx=400,cy=225;
  s.append(R(0,0,800,196,{fill:'#e9f3fb',stroke:'none',rx:0,opacity:.7}),R(0,254,800,196,{fill:'#d6edd3',stroke:'none',rx:0,opacity:.8}));
  s.append(T(70,40,'air outside the leaf',{'font-size':17,fill:'var(--muted)','text-anchor':'start'}),T(70,430,'inside the leaf',{'font-size':17,fill:'var(--muted)','text-anchor':'start'}));
  for(let i=0;i<5;i++){[[-1,0],[1,0]].forEach(d=>{});}
  X.guard=S('g');s.append(X.guard);
  X.draw=o=>{X.guard.innerHTML='';const gap=o*52,d=44+gap;[-1,1].forEach(sg=>{const p=`M${cx} ${cy-76}Q${cx+sg*d} ${cy} ${cx} ${cy+76}`;X.guard.append(S('path',{d:p,fill:'none',stroke:'var(--ink)','stroke-width':54,'stroke-linecap':'round',opacity:1}),S('path',{d:p,fill:'none',stroke:'#58b868','stroke-width':46,'stroke-linecap':'round'}),S('path',{d:p,fill:'none',stroke:'#2f8f43','stroke-width':3,'stroke-dasharray':'2 12','stroke-linecap':'round'}))});
    X.guard.append(T(cx-170,cy+6,'guard cell',{'font-size':16,fill:'var(--muted)'}),T(cx+170,cy+6,'guard cell',{'font-size':16,fill:'var(--muted)'}),T(cx,cy-112,o>.5?'stoma OPEN':'stoma CLOSED',{'font-size':20,fill:o>.5?'var(--good)':'var(--bad)','font-family':'Fredoka,sans-serif'}))};
  X.fx=S('g');s.append(X.fx);
  const kinds=[{t:'CO₂',col:'#6b7a99',dir:1},{t:'O₂',col:'#d65a5a',dir:-1},{t:'H₂O',col:'var(--cold)',dir:-1}];
  X.leg=S('g');kinds.forEach((k,i)=>{X.leg.append(C(600,100+i*32,11,{fill:k.col,'stroke-width':1.5}),T(620,106+i*32,['carbon dioxide IN','oxygen OUT','water vapour OUT'][i],{'text-anchor':'start','font-size':16}))});s.append(X.leg);
  X.cond=T(400,425,'',{'font-size':20,fill:'var(--accent)','font-family':'Fredoka,sans-serif'});s.append(X.cond);
  ctx.bg.raf(dt=>{X.o+=(X.target-X.o)*Math.min(1,3*dt);X.draw(X.o);
    if(X.flow&&X.o>.25&&Math.random()<dt*5*X.o){const k=kinds[Math.floor(Math.random()*3)];const g=S('g');g.append(C(0,0,13,{fill:k.col,'stroke-width':1.5}),T(0,4,k.t,{'font-size':10,fill:'#fff'}));g.dataset.dir=k.dir;g.dataset.y=k.dir>0?60:390;g.dataset.x=cx+rnd(-1,1)*X.o*20;X.fx.append(g)}
    [...X.fx.children].forEach(g=>{let y=+g.dataset.y+ +g.dataset.dir*70*dt;g.dataset.y=y;const xx=+g.dataset.x+Math.sin(y/20)*6;g.setAttribute('transform',`translate(${xx} ${y})`);if(y<40||y>410)g.remove()})});
  X.set=(o,flow,txt)=>{X.target=o;X.flow=flow;X.cond.textContent=txt||''};X.set(1,false,'');X.o=1;X.draw(1);return X},
 steps:[
  {k:'watch',run(X,ctx){X.fx.innerHTML='';X.set(1,true,'Daytime: stomata open')}},
  {k:'watch',run(X,ctx){X.fx.innerHTML='';X.set(1,true,'Guard cells full of water: swollen, so the stoma opens');ctx.after(4000,()=>X.set(.04,false,'Guard cells lose water: floppy, so the stoma closes'));ctx.after(8500,()=>X.set(1,true,'Water enters again: open'))}},
  {k:'predict',q:'On a hot, dry day, why might a plant close its stomata?',opts:['To reduce water loss','To take in more carbon dioxide','To let out more oxygen','To absorb sunlight'],ans:0,why:'Water vapour escapes through open stomata. Closing them saves water, though it also slows photosynthesis.',run(X){X.fx.innerHTML='';X.set(1,false,'')}},
  {k:'try',build(X,ctx){const h=ctx.panel;const seen=new Set();X.set(1,true,'Daytime: stomata open');
   const fb=H('div',{class:'fb info'},'Pick a situation and see what the stomata do.'),pg=H('p',{class:'hint'},'Seen 0 of 3');
   const cases={day:{o:1,flow:true,t:'Bright day, plenty of water: stomata OPEN. Carbon dioxide in, oxygen out, some water vapour out.'},night:{o:.04,flow:false,t:'Night: no light for photosynthesis, so the stomata CLOSE. This saves water.'},dry:{o:.08,flow:false,t:'Hot, dry day: stomata CLOSE to save water, even though it slows photosynthesis.'}};
   pickRow(h,[{id:'day',label:'Bright day'},{id:'night',label:'Night'},{id:'dry',label:'Hot dry day'}],id=>{const c=cases[id];X.fx.innerHTML='';X.set(c.o,c.flow,{day:'Bright day',night:'Night',dry:'Hot dry day'}[id]);fb.className='fb good';fb.textContent=c.t;seen.add(id);pg.textContent='Seen '+seen.size+' of 3';if(seen.size>=3)ctx.done()},'day');
   h.append(fb,pg)}},
  {k:'sum',take:'Stomata let carbon dioxide in and oxygen and water vapour out. Guard cells open them when swollen with water and close them when floppy.',run(X){X.fx.innerHTML='';X.set(1,true,'')}}],
 quiz:[Q('t','Which gas enters the leaf through the stomata for photosynthesis?',['Carbon dioxide','Oxygen','Nitrogen','Hydrogen'],0,'Carbon dioxide diffuses in through open stomata.'),
  Q('t','What opens and closes a stoma?',['Two guard cells','The cuticle','The xylem','The palisade layer'],0,'Guard cells change shape to open or close the gap.'),
  Q('t','Why do stomata close in hot, dry conditions?',['To save water','To let in more light','To make more oxygen','To absorb minerals'],0,'Closing them cuts down water loss by transpiration.')]});

/* ===== 1.7 Minerals ===== */
function plantDraw(g,x,type){const sc=type==='n'?.62:1;const ys=380;const pg=G(x,0);g.append(pg);pg.append(R(-50,ys,100,50,{rx:8,fill:'#a1704a','stroke-width':2.5}));
  pg.append(Pth(`M0 ${ys}V${ys-200*sc}`,{stroke:type==='mg'?'#6aa84f':'#4a8f3a','stroke-width':8}));
  const col=type==='ok'?'#4caf50':type==='n'?'#d9d36a':'#e6dd5a';const n=type==='n'?3:5;
  for(let i=0;i<n;i++){const side=i%2?-1:1,y=ys-60*sc-i*34*sc-(i>2?8:0);const lg=S('g',{transform:`translate(0 ${y}) scale(${side} 1) rotate(-25)`});lg.append(S('path',{d:leafPath(76*sc+8,38*sc+6),fill:col,stroke:'var(--ink)','stroke-width':2.2}));
    if(type==='mg'){for(let k=1;k<=3;k++)lg.append(S('path',{d:`M0 0L${(76*sc+8)*.85} ${(k-2)*10}`,stroke:'#2e8b3a','stroke-width':2.4,fill:'none'}));lg.append(L(0,0,(76*sc+8)*.9,0,{stroke:'#2e8b3a','stroke-width':3}))}
    else lg.append(L(0,0,(76*sc+8)*.9,0,{stroke:'rgba(0,0,0,.25)','stroke-width':2}));pg.append(lg)}
  return pg}
SCENES.push({id:'1.7',act:'plant',title:'Minerals plants need',idea:'Nitrate for proteins, magnesium for chlorophyll',
 setup(ctx){
  const s=ctx.svg();const X={s};s.append(R(0,380,800,70,{fill:'#8d6e4a',stroke:'none',rx:0}));
  X.pl={};X.healthy=S('g');X.n=S('g');X.mg=S('g');s.append(X.healthy,X.n,X.mg);plantDraw(X.healthy,400,'ok');plantDraw(X.n,140,'n');plantDraw(X.mg,660,'mg');
  X.lbl={ok:T(400,442,'healthy plant',{'font-size':17,fill:'#f3e3c8'}),n:T(140,442,'short of nitrate',{'font-size':17,fill:'#f3e3c8'}),mg:T(660,442,'short of magnesium',{'font-size':17,fill:'#f3e3c8'})};Object.values(X.lbl).forEach(l=>s.append(l));
  X.flow=S('g');s.append(X.flow);X.flow.append(flowLine(ctx,X.flow,[[290,430],[345,415],[400,400]],{col:'#7a5bd0',label:'nitrate',lx:285,ly:408,n:3}),flowLine(ctx,X.flow,[[510,430],[455,415],[400,400]],{col:'#e08a2c',label:'magnesium',lx:520,ly:408,n:3}));
  X.info=S('g');X.info.append(T(560,120,'nitrate → proteins for growth',{'font-size':18,fill:'#7a5bd0','font-family':'Fredoka,sans-serif'}),T(560,152,'magnesium → chlorophyll',{'font-size':18,fill:'#e08a2c','font-family':'Fredoka,sans-serif'}));s.append(X.info);
  X.show=m=>{X.healthy.setAttribute('opacity',m==='h'||m==='a'?1:0);X.n.setAttribute('opacity',m==='a'?1:0);X.mg.setAttribute('opacity',m==='a'?1:0);X.flow.setAttribute('opacity',m==='h'?1:0);X.info.setAttribute('opacity',m==='h'?1:0);X.lbl.ok.setAttribute('opacity',m==='h'||m==='a'?1:0);X.lbl.n.setAttribute('opacity',m==='a'?1:0);X.lbl.mg.setAttribute('opacity',m==='a'?1:0)};
  X.show('h');return X},
 steps:[
  {k:'watch',run(X,ctx){X.show('h');X.info.setAttribute('opacity',0);X.flow.setAttribute('opacity',0);ctx.after(900,()=>X.flow.setAttribute('opacity',1));ctx.after(3500,()=>X.info.setAttribute('opacity',1))}},
  {k:'watch',run(X,ctx){X.show('h');ctx.after(1200,()=>X.show('a'))}},
  {k:'predict',q:'A plant has stunted growth and pale yellow leaves. Which mineral is it most likely short of?',opts:['Nitrate','Magnesium','Oxygen','Glucose'],ans:0,why:'Nitrate is needed to make proteins for growth. Without it, growth is poor and leaves turn pale.',run(X){X.show('a')}},
  {k:'try',build(X,ctx){X.show('a');const h=ctx.panel;
   const cases=[{d:'The plant is small and slow-growing, and the older leaves are pale yellow.',a:0,why:'Stunted growth and pale leaves point to a shortage of nitrate.'},{d:'The leaves are yellow, but the veins stay green.',a:1,why:'Magnesium is needed for chlorophyll. Yellow leaves with green veins mean a magnesium shortage.'},{d:'The plant grows very slowly and its leaves are small and yellow-green.',a:0,why:'Slow growth means not enough proteins, so nitrate is low.'}];
   let i=0;const host=H('div');h.append(host);
   const nxt=()=>{if(i>=cases.length){host.innerHTML='';host.append(H('div',{class:'fb good'},'All diagnosed!'));ctx.done();return}
     const c=cases[i],box=H('div');host.innerHTML='';host.append(H('p',{class:'hint'},'Plant '+(i+1)+' of '+cases.length),H('div',{class:'fb info'},c.d),box);
     ask({q:'Which mineral is it short of?',o:['Nitrate','Magnesium'],a:c.a,why:c.why},box,()=>{box.append(H('button',{class:'btn small',onclick:()=>{i++;nxt()}},i>=cases.length-1?'Finish':'Next plant'))})};nxt()}},
  {k:'sum',take:'Nitrate makes proteins, so a shortage means poor growth. Magnesium makes chlorophyll, so a shortage means yellow leaves with green veins.',run(X){X.show('a')}}],
 quiz:[Q('t','What do plants use magnesium for?',['Making chlorophyll','Making starch','Making wax','Making roots'],0,'Magnesium is part of the chlorophyll molecule.'),
  Q('t','What do plants use nitrate for?',['Making proteins','Making oxygen','Absorbing light','Making glucose from air'],0,'Nitrates provide the nitrogen needed to make proteins.'),
  Q('t','Yellow leaves with green veins suggest a shortage of…',['magnesium','nitrate','carbon dioxide','water'],0,'Without magnesium, chlorophyll cannot be made properly.')]});
