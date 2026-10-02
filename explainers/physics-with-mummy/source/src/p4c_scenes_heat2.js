/* ===== 4.4 ===== */
SCENES.push({id:'4.4',act:'heat',title:'Radiation',idea:'Infrared crosses a vacuum; dull black is best',
 setup(ctx){
  const s=ctx.svg();const se=S('g');
  se.append(C(90,225,60,{fill:'var(--gold)',stroke:'var(--hot)'}),C(700,225,48,{fill:'var(--cold)',stroke:'var(--ink)'}),T(90,315,'Sun',{'font-size':22}),T(700,300,'Earth',{'font-size':22}),
   R(190,150,420,150,{fill:'none',rx:10,'stroke-dasharray':'8 8',opacity:.5}),T(400,330,'space: a vacuum, no particles',{'font-size':22,fill:'var(--muted)'}));
  const wave=S('path',{fill:'none',stroke:'var(--hot)','stroke-width':4,'stroke-linecap':'round'});const lbl=T(400,130,'infrared radiation',{'font-size':26,fill:'var(--hot)','font-family':'Fredoka,sans-serif'});se.append(wave,lbl);s.append(se);
  const cans=S('g',{opacity:0});s.append(cans);
  const g=mkGraph(cans,{x:440,y:50,w:310,h:250,xmax:30,ymax:90,xs:10,ys:10,xl:'Time (min)',yl:'Temperature (°C)'});
  const defs=[['black','#26303f','var(--ink)'],['silver','#cfd6df','var(--metal)'],['white','#ffffff','var(--gold)']];
  const canEls=defs.map((d,i)=>{const x=40+i*120;const gg=S('g');gg.append(R(x,150,90,130,{fill:d[1],rx:8}),R(x,150,90,34,{fill:'none',rx:8}),T(x+45,310,d[0],{'font-size':18}));const tt=T(x+45,130,'',{'font-size':22,'font-family':'JetBrains Mono,monospace'});gg.append(tt);cans.append(gg);return {gg,tt}});
  const curves=defs.map(d=>{const p=S('path',{fill:'none',stroke:d[2]==='var(--ink)'?'var(--ink)':d[2],'stroke-width':5,'stroke-linejoin':'round',transform:'translate(440 50)'});cans.append(p);return p});
  ctx.bg.raf((dt,t)=>{let d='M';for(let x=190;x<=610;x+=6){d+=(x===190?'':'L')+x+' '+(225+Math.sin((x-t*160)/18)*18)+' '}wave.setAttribute('d',d)});
  const model={cool:{k:[.08,.025,.0],f:(i,t)=>[20+60*Math.exp(-.08*t),20+60*Math.exp(-.025*t),null][i]},warm:{f:(i,t)=>[20+50*(1-Math.exp(-.15*t)),20+15*(1-Math.exp(-.15*t)),20+10*(1-Math.exp(-.15*t))][i]}};
  const draw=(mode,p)=>{const tMax=30*p;[0,1,2].forEach(i=>{if(mode==='cool'&&i===2){curves[i].setAttribute('d','');canEls[i].gg.setAttribute('opacity',.2);canEls[i].tt.textContent='';return}canEls[i].gg.setAttribute('opacity',1);let d='';for(let x=0;x<=tMax+1e-9;x+=.5){d+=(d?'L':'M')+g.X(x)+' '+g.Y(model[mode].f(i,x))}curves[i].setAttribute('d',d);canEls[i].tt.textContent=fmt(model[mode].f(i,tMax),0)+'°'})};
  return {s,se,cans,draw,canEls,curves};
 },
 steps:[
  {k:'watch',run(S){setA(S.se,{opacity:1});setA(S.cans,{opacity:0})}},
  {k:'watch',run(S){setA(S.se,{opacity:1});setA(S.cans,{opacity:0})}},
  {k:'predict',q:'Hot water in a shiny silver can and in a matt black can. Which cools faster?',opts:['the matt black can','the shiny silver can','they cool the same'],ans:0,why:'Dull black surfaces give out radiation best, so the black can cools faster.',run(S){setA(S.se,{opacity:0});setA(S.cans,{opacity:1});S.draw('cool',0)}},
  {k:'try',build(S,ctx){const h=ctx.panel;setA(S.se,{opacity:0});setA(S.cans,{opacity:1});S.draw('cool',0);const ran=new Set();const fb=H('div',{class:'fb info'},'Choose a mode and press Run.');
   let mode='cool';const m1=H('button',{class:'btn small',onclick:()=>{mode='cool';m1.className='btn small';m2.className='btn small ghost'}},'Cooling down (80 °C)'),m2=H('button',{class:'btn small ghost',onclick:()=>{mode='warm';m2.className='btn small';m1.className='btn small ghost'}},'Warming in the Sun');
   const run=H('button',{class:'btn hot',onclick:()=>{const mm=mode;tween(ctx,5,p=>S.draw(mm,p),()=>{ran.add(mm);fb.className='fb good';fb.textContent=mm==='cool'?'Black cooled fastest: it is the best emitter. Silver loses energy slowly.':'Black warmed the most: it absorbs best. Silver and white reflect more.';if(ran.size>=2)ctx.done()})}},'Run');
   h.append(H('div',{class:'row'},m1,m2),run,fb)}},
  {k:'sum',take:'Radiation: no particles needed, works through a vacuum. Dull black = best absorber and emitter. Shiny and white = reflect.',run(S){setA(S.se,{opacity:1});setA(S.cans,{opacity:0})}}],
 quiz:[Q('t','How does the Sun’s energy reach the Earth?',['Radiation','Conduction','Convection','Evaporation'],0,'Radiation needs no particles, so it crosses space.'),Q('t','Which surface is best at absorbing thermal radiation?',['Dull black','Shiny silver','White','Mirror'],0,'Dull black surfaces absorb and emit best.'),
  Q('t','Why are houses in hot countries often painted white?',['White reflects radiation, so the house stays cooler','White is a better conductor','White makes more heat','White is cheaper to see'],0,'White surfaces reflect more of the Sun’s radiation.')]});

/* ===== 4.5 vacuum flask ===== */
SCENES.push({id:'4.5',act:'heat',title:'The vacuum flask',idea:'Vacuum stops conduction and convection; silver reflects',
 setup(ctx){
  const s=ctx.svg();const st={vac:true,silver:true,plastic:true,cold:false,show:0};
  const fl=S('g');
  const casing=R(106,84,188,312,{rx:30,fill:'var(--paper)',stroke:'var(--ink)'}),gap=R(122,100,156,282,{rx:22,fill:'var(--cold-soft)',stroke:'none'}),inner=R(138,116,124,262,{rx:16,fill:'var(--paper)',stroke:'var(--ink)','stroke-width':3});
  const drink=R(144,186,112,186,{rx:10,fill:'#8a4b2a',stroke:'none'});
  const silverL=L(133,116,133,372,{stroke:'#e8edf4','stroke-width':7}),silverR=L(267,116,267,372,{stroke:'#e8edf4','stroke-width':7}),silverL2=L(127,116,127,372,{stroke:'var(--metal)','stroke-width':2}),silverR2=L(273,116,273,372,{stroke:'var(--metal)','stroke-width':2});
  const stopper=R(160,56,80,46,{rx:8,fill:'var(--hot)',stroke:'var(--ink)'});
  const air=S('g');for(let i=0;i<40;i++)air.append(C(rnd(124,134),rnd(104,376),2.6,{fill:'var(--muted)',stroke:'none'}),C(rnd(266,276),rnd(104,376),2.6,{fill:'var(--muted)',stroke:'none'}));
  fl.append(casing,gap,air,inner,drink,silverL,silverR,silverL2,silverR2,stopper);
  const arrows=S('g');const aCond=S('g'),aConv=S('g'),aRad=S('g'),aStop=S('g');
  const arr=(g,d,c)=>{g.append(S('path',{d,fill:'none',stroke:c,'stroke-width':5,'stroke-linecap':'round','stroke-dasharray':'10 8'}))};
  arr(aCond,'M262 250H300','var(--hot)');arr(aCond,'M138 250H100','var(--hot)');arr(aConv,'M262 300Q284 290 284 250Q284 210 262 200','#c05a00');arr(aRad,'M262 160Q272 150 282 160T302 160','#d9a000');arr(aStop,'M200 108V40','var(--hot)');
  arrows.append(aCond,aConv,aRad,aStop);fl.append(arrows);s.append(fl);
  const lab=S('g');
  [['stopper','plastic stopper',200,52,340,40],['vac','vacuum gap',130,200,40,150],['silver','silvered walls',270,330,356,330],['drink','hot drink',200,300,60,420]].forEach(l=>{});
  const labels={stopper:T(330,66,'plastic stopper',{'text-anchor':'start','font-size':18,opacity:0}),vac:T(318,190,'vacuum gap',{'text-anchor':'start','font-size':18,opacity:0}),silver:T(318,230,'silvered walls',{'text-anchor':'start','font-size':18,opacity:0}),drink:T(200,420,'hot drink',{'font-size':18,opacity:0})};
  Object.values(labels).forEach(l=>fl.append(l));
  // status + graph
  let gr=null,mug=null,cur=null;
  const stat=S('g');s.append(stat);const rows=['Conduction','Convection','Radiation'].map((n,i)=>{const t=T(500,330+i*34,n+': ',{'text-anchor':'start','font-size':20});const v=T(640,330+i*34,'',{'text-anchor':'start','font-size':20,'font-family':'Fredoka,sans-serif'});stat.append(t,v);return v});
  const k=()=>{let kk=.004;if(!st.vac)kk+=.03;if(!st.silver)kk+=.02;if(!st.plastic)kk+=.012;return kk};
  const build=()=>{if(gr)gr.g.remove();if(mug)mug.remove();if(cur)cur.remove();
    gr=mkGraph(s,st.cold?{x:505,y:40,w:245,h:200,xmax:60,ymax:40,xs:10,ys:10,xl:'Time (min)',yl:'Temperature (°C)'}:{x:505,y:40,w:245,h:200,xmax:60,ymax:100,xs:10,ys:20,xl:'Time (min)',yl:'Temperature (°C)'});
    mug=S('path',{fill:'none',stroke:'var(--muted)','stroke-width':4,'stroke-dasharray':'7 6',transform:'translate(505 40)'});cur=S('path',{fill:'none',stroke:'var(--accent)','stroke-width':5,'stroke-linejoin':'round',transform:'translate(505 40)'});s.append(mug,cur);update()};
  const update=()=>{setA(silverL,{opacity:st.silver?1:0});setA(silverR,{opacity:st.silver?1:0});setA(silverL2,{opacity:st.silver?1:0});setA(silverR2,{opacity:st.silver?1:0});setA(air,{opacity:st.vac?0:1});setA(gap,{fill:st.vac?'var(--cold-soft)':'var(--bg)'});
   setA(stopper,{fill:st.plastic?'var(--hot)':'var(--metal)'});labels.stopper.textContent=st.plastic?'plastic stopper':'metal stopper';setA(drink,{fill:st.cold?'#8fc3ee':'#8a4b2a'});
   labels.drink.textContent=st.cold?'cold drink':'hot drink';
   const leak={cond:!st.vac||!st.plastic,conv:!st.vac,rad:!st.silver};setA(aCond,{opacity:!st.vac?1:0});setA(aConv,{opacity:leak.conv?1:0});setA(aRad,{opacity:leak.rad?1:0});setA(aStop,{opacity:!st.plastic?1:0});
   [leak.cond,leak.conv,leak.rad].forEach((l,i)=>{rows[i].textContent=l?'LEAKING':'blocked';rows[i].setAttribute('fill',l?'var(--bad)':'var(--good)')});
   const T0=st.cold?5:90,Ta=st.cold?30:22,kk=k(),km=.045;const pf=(kv,i)=>{let d='';for(let t=0;t<=60;t+=2){const v=Ta+(T0-Ta)*Math.exp(-kv*t);d+=(d?'L':'M')+gr.X(t)+' '+gr.Y(v)}return d};
   mug.setAttribute('d',pf(km));cur.setAttribute('d',pf(kk))};
  build();
  ctx.bg.raf((dt,t)=>{[aCond,aConv,aRad,aStop].forEach(a=>{[...a.children].forEach(p=>p.setAttribute('stroke-dashoffset',-t*22))})});
  return {s,st,update,build,labels,fl,stat};
 },
 steps:[
  {k:'watch',run(S,ctx){S.st.vac=S.st.silver=S.st.plastic=true;S.st.cold=false;S.build();Object.values(S.labels).forEach(l=>l.setAttribute('opacity',0));['stopper','vac','silver','drink'].forEach((k,i)=>ctx.after(1500+i*3500,()=>S.labels[k].setAttribute('opacity',1)))}},
  {k:'watch',run(S,ctx){S.st.vac=S.st.silver=S.st.plastic=true;S.st.cold=false;S.build();Object.values(S.labels).forEach(l=>l.setAttribute('opacity',1))}},
  {k:'predict',q:'What if the vacuum is replaced by air?',opts:['Conduction and convection can cross the gap','Nothing changes','The drink gets hotter'],ans:0,why:'Air particles carry energy across by conduction and convection, so the drink cools much faster.',reveal(S){S.st.vac=false;S.update()}},
  {k:'try',build(S,ctx){const h=ctx.panel;S.st.vac=S.st.silver=S.st.plastic=true;S.st.cold=false;S.build();const tog=new Set();
   const mk=(key,lab,onT)=>{const b=H('button',{class:'tool','aria-pressed':'true',onclick:()=>{S.st[key]=!S.st[key];b.setAttribute('aria-pressed',String(S.st[key]));b.textContent=lab+(S.st[key]?': ON':': OFF');tog.add(key);S.update();if(['vac','silver','plastic'].every(k=>tog.has(k)))ctx.done()}},lab+': ON');return b};
   const cold=H('button',{class:'tool','aria-pressed':'false',onclick:()=>{S.st.cold=!S.st.cold;cold.setAttribute('aria-pressed',String(S.st.cold));cold.textContent=S.st.cold?'Cold drink':'Hot drink';S.build()}},'Hot drink');
   h.append(H('p',{class:'hint'},'Switch features off and see which method starts leaking. Dashed grey line: an ordinary mug.'),H('div',{class:'chips'},mk('vac','Vacuum gap'),mk('silver','Silvered walls'),mk('plastic','Plastic stopper'),cold))}},
  {k:'sum',take:'Vacuum: stops conduction and convection. Silver: reflects radiation. Plastic stopper: poor conductor. Works for cold drinks too.',run(S){S.st.vac=S.st.silver=S.st.plastic=true;S.st.cold=false;S.build()}}],
 quiz:[Q('t','What does the vacuum between the walls of a flask stop?',['Conduction and convection','Radiation only','Nothing','Evaporation only'],0,'A vacuum has no particles, so there is nothing to conduct or flow.'),Q('t','Why are the glass walls of a flask silvered?',['To reflect thermal radiation','To conduct heat faster','To make it look nice','To let radiation through'],0,'Shiny surfaces reflect radiation back.'),
  Q('t','Why is the stopper of a flask made of plastic?',['It is a poor conductor','It is a good conductor','It is shiny','It is heavy'],0,'A poor conductor stops energy leaking through the top.')]});

/* ===== 4.6 ===== */
SCENES.push({id:'4.6',act:'heat',title:'Insulation in daily life',idea:'Trapped air is a poor conductor and cannot circulate',
 setup(ctx){
  const s=ctx.svg();const cards=[];
  const defs=[['Woolly jumper','traps air',g=>{g.append(S('path',{d:'M30 40L60 20H100L130 40L150 80L125 90V160H35V90L10 80Z',fill:'#e0a15a',stroke:'var(--ink)','stroke-width':2.5}));for(let i=0;i<6;i++)g.append(Pth(`M${45+i*12} 100q6 8 0 16t0 16`,{'stroke-width':2,opacity:.6}))}],
   ['Double glazing','air gap',g=>{g.append(R(30,30,40,130,{fill:'var(--cold-soft)',rx:2}),R(90,30,40,130,{fill:'var(--cold-soft)',rx:2}),R(70,30,20,130,{fill:'var(--bg)',rx:0,'stroke-dasharray':'4 4',stroke:'var(--muted)'}),T(80,100,'air',{'font-size':16,fill:'var(--muted)'}))}],
   ['Pan handle','plastic',g=>{g.append(S('ellipse',{cx:60,cy:95,rx:44,ry:30,fill:'var(--metal)',stroke:'var(--ink)','stroke-width':2.5}),R(98,85,50,20,{fill:'var(--hot)',rx:6}))}],
   ['Lagged pipe','thick lagging',g=>{g.append(R(30,70,100,50,{fill:'#e8d27a',rx:8}),R(40,85,80,20,{fill:'var(--metal)',rx:6}))}],
   ['Foil blanket','shiny: reflects',g=>{g.append(S('path',{d:'M20 60Q80 20 140 60V140Q80 170 20 140Z',fill:'#e6ecf3',stroke:'var(--ink)','stroke-width':2.5}),Pth('M40 70Q70 90 60 130',{stroke:'#fff','stroke-width':4}))}]];
  defs.forEach((d,i)=>{const g=S('g',{transform:`translate(${24+i*152} 90)`,opacity:1});g.append(R(0,0,142,250,{rx:16,fill:'var(--paper)','stroke-width':2}));const inner=S('g',{transform:'translate(-1 8)'});d[2](inner);g.append(inner,T(71,208,d[0],{'font-size':17}),T(71,234,d[1],{'font-size':15,fill:'var(--muted)','font-weight':600}));s.append(g);cards.push(g)});
  const note=T(400,60,'Everyday insulators',{'font-size':28,'font-family':'Fredoka,sans-serif',fill:'var(--accent)'});s.append(note);return {cards,note};
 },
 steps:[
  {k:'watch',run(S,ctx){S.cards.forEach(c=>c.setAttribute('opacity',.35));S.cards.forEach((c,i)=>ctx.after(1500+i*3000,()=>{S.cards.forEach(x=>x.setAttribute('opacity',.35));c.setAttribute('opacity',1)}))}},
  {k:'watch',run(S,ctx){S.cards.forEach(c=>c.setAttribute('opacity',.35));S.cards[0].setAttribute('opacity',1);S.cards[1].setAttribute('opacity',1);S.note.textContent='Trapped air: poor conductor, cannot circulate'}},
  {k:'predict',q:'Why does a plastic pan handle stay cool?',opts:['Plastic is a poor conductor','Plastic is a good conductor','Plastic is shiny'],ans:0,why:'Plastic is an insulator, so thermal energy passes along it very slowly.',run(S){S.cards.forEach(c=>c.setAttribute('opacity',.35));S.cards[2].setAttribute('opacity',1)}},
  {k:'try',build(S,ctx){S.cards.forEach(c=>c.setAttribute('opacity',1));matchGame(ctx.panel,{help:'Tap an example, then the idea that explains it.',items:[
   {label:'Plastic pan handle',to:'cond',hint:'The handle is a poor conductor.'},{label:'Metal spoon in hot tea',to:'cond',hint:'Energy passes along the solid.'},
   {label:'Freezer at the top of a fridge',to:'conv',hint:'Cold air sinks.'},{label:'Warm air above a radiator',to:'conv',hint:'Warm fluid is less dense and rises.'},
   {label:'Sunlight warming your face',to:'rad',hint:'Energy arrives through space.'},{label:'Shiny foil blanket',to:'rad',hint:'Shiny surfaces reflect radiation.'},
   {label:'Woolly jumper',to:'air',hint:'Trapped air.'},{label:'Double glazing',to:'air',hint:'Air or vacuum between the glass.'}],
   buckets:[{id:'cond',label:'Conduction'},{id:'conv',label:'Convection'},{id:'rad',label:'Radiation'},{id:'air',label:'Trapped air: stops conduction and convection'}],onDone:ctx.done})}},
  {k:'sum',take:'Poor conductors = insulators. Trapped air stops conduction and convection. Shiny surfaces reflect radiation.'}],
 quiz:[Q('t','Why does a woolly jumper keep you warm?',['It traps air, which is a poor conductor','It makes heat','It is shiny','It is a good conductor'],0,'Trapped air cannot circulate, so convection and conduction are reduced.'),Q('t','A shiny foil blanket mainly reduces energy loss by...',['reflecting radiation','blocking convection','conducting heat','making heat'],0,'Shiny surfaces reflect radiation.'),
  Q('t','Which material is a thermal insulator?',['Plastic','Copper','Iron','Aluminium'],0,'Plastic is a poor conductor.')]});

/* ===== 4.7 ===== */
SCENES.push({id:'4.7',act:'heat',title:'Which method? Sorting',idea:'Real situations often use more than one method',
 setup(ctx){
  const s=ctx.svg();
  const camp=S('g'),rad=S('g',{opacity:0});s.append(camp,rad);
  camp.append(L(20,400,780,400,{'stroke-width':4}),S('path',{d:'M395 400Q380 350 400 330Q405 360 420 345Q440 370 430 400Z',fill:'#ff9a1f',stroke:'#c25a00','stroke-width':2}),L(400,380,190,320,{stroke:'var(--metal)','stroke-width':6}),C(190,320,14,{fill:'#fff'}),C(160,300,18,{fill:'#f1be99'}),T(160,262,'hand',{'font-size':16,fill:'var(--muted)'}),
   C(660,300,40,{fill:'#f1be99'}),C(648,292,5,{fill:'#000'}),C(672,292,5,{fill:'#000'}),Pth('M644 314Q660 326 676 314'),T(660,360,'you',{'font-size':18}));
  const up=S('g');[390,420,450].forEach((x,i)=>up.append(Pth(`M${x} 300Q${x-10} 250 ${x} 200T${x} 120`,{stroke:'var(--hot)','stroke-dasharray':'8 8','stroke-width':4})));camp.append(up);
  const rays=S('g');[330,365,400].forEach(y=>rays.append(Pth(`M470 ${y-30}Q520 ${y-40} 560 ${y-10}T610 ${y}`,{stroke:'#d9a000','stroke-width':3.5,'stroke-dasharray':'4 8'})));camp.append(rays);
  rad.append(R(40,60,720,360,{fill:'var(--paper)',rx:10,'stroke-width':2}),R(70,260,70,140,{fill:'var(--hot)',stroke:'var(--ink)',rx:6}),T(105,248,'radiator',{'font-size':16}),C(560,320,40,{fill:'#f1be99'}),T(560,382,'you',{'font-size':18}),L(520,330,560,330,{opacity:0}));
  const up2=S('g');[150,200].forEach(x=>up2.append(Pth(`M${x} 250Q${x-14} 200 ${x} 150T${x+40} 90`,{stroke:'var(--hot)','stroke-dasharray':'8 8','stroke-width':4})));rad.append(up2);
  rad.append(Pth('M150 85H600',{stroke:'var(--hot)','stroke-dasharray':'8 8','stroke-width':4,opacity:.5}));
  const rays2=S('g');[290,320,350].forEach(y=>rays2.append(Pth(`M150 ${y}Q250 ${y-14} 350 ${y}T500 ${y}`,{stroke:'#d9a000','stroke-width':3.5,'stroke-dasharray':'4 8'})));rad.append(rays2);
  const spots={camp:[{x:290,y:350,m:'conduction',label:'metal stick'},{x:420,y:210,m:'convection',label:'rising warm air'},{x:540,y:330,m:'radiation',label:'warmth on your face'}],
               rad:[{x:105,y:330,m:'conduction',label:'metal panel heats air touching it'},{x:200,y:170,m:'convection',label:'warm air rising'},{x:360,y:320,m:'radiation',label:'warmth on your skin'}]};
  const spEls={camp:[],rad:[]};
  ['camp','rad'].forEach(k=>spots[k].forEach((sp,i)=>{const g=S('g',{class:'hit'});const c=C(sp.x,sp.y,24,{fill:'var(--gold)',opacity:.5,stroke:'var(--gold)','stroke-width':3});const n=T(sp.x,sp.y+7,String(i+1),{'font-size':20,fill:'#2a1d00'});const lb=T(sp.x,sp.y+48,'',{'font-size':16,fill:'var(--good)'});g.append(c,n,lb);(k==='camp'?camp:rad).append(g);spEls[k].push({g,c,lb,sp,done:false})}));
  ctx.bg.raf((dt,t)=>{up.childNodes.forEach(p=>p.setAttribute('stroke-dashoffset',-t*30));up2.childNodes.forEach(p=>p.setAttribute('stroke-dashoffset',-t*30));rays.childNodes.forEach(p=>p.setAttribute('stroke-dashoffset',-t*30));rays2.childNodes.forEach(p=>p.setAttribute('stroke-dashoffset',-t*30));
    [...spEls.camp,...spEls.rad].forEach(e=>{if(!e.done)e.c.setAttribute('r',24+Math.sin(t*4)*3)})});
  return {camp,rad,spEls,show:k=>{setA(camp,{opacity:k==='camp'?1:0});setA(rad,{opacity:k==='rad'?1:0});camp.style.pointerEvents=k==='camp'?'auto':'none';rad.style.pointerEvents=k==='rad'?'auto':'none'},hotspots:true};
 },
 steps:[
  {k:'watch',run(S){S.show('camp')}},
  {k:'watch',run(S,ctx){S.show('camp');S.spEls.camp.forEach((e,i)=>ctx.after(1200+i*2600,()=>{e.lb.textContent=e.sp.label+': '+e.sp.m;e.c.setAttribute('opacity',1)}))}},
  {k:'predict',q:'Sitting beside a bonfire, which method warms your face?',opts:['radiation','conduction','convection'],ans:0,why:'Radiation travels through the air in straight lines to your skin, as the rising warm air goes upwards.',run(S){S.show('camp')}},
  {k:'try',build(S,ctx){const h=ctx.panel;let scene='camp',sel=null,found=0;const fb=H('div',{class:'fb info'},'Tap a glowing number on the picture.');
   S.spEls.camp.concat(S.spEls.rad).forEach(e=>{e.done=false;e.lb.textContent='';e.c.setAttribute('opacity',.5);e.c.setAttribute('fill','var(--gold)')});
   const pick=(k,i)=>{sel={k,i};fb.className='fb info';fb.textContent='Which method is spot '+(i+1)+'?'};
   ['camp','rad'].forEach(k=>S.spEls[k].forEach((e,i)=>{e.g.onclick=()=>{if(!e.done)pick(k,i)}}));
   const m=['conduction','convection','radiation'].map(n=>H('button',{class:'btn small ghost',onclick:()=>{if(!sel){fb.textContent='Tap a glowing number first.';return}const e=S.spEls[sel.k][sel.i];
     if(e.sp.m===n){e.done=true;e.c.setAttribute('fill','var(--good)');e.c.setAttribute('opacity',1);e.c.setAttribute('r',24);e.lb.textContent=n;fb.className='fb good';fb.textContent='Yes: '+e.sp.label+' is '+n+'.';cheer(true);found++;sel=null;if(found>=6)ctx.done()}
     else{fb.className='fb bad';fb.textContent='Not '+n+'. Think about what is carrying the energy.';cheer(false)}}},n[0].toUpperCase()+n.slice(1)));
   const tabs=H('div',{class:'row'},['camp','rad'].map(k=>{const b=H('button',{class:'tool','aria-pressed':String(k==='camp'),onclick:()=>{scene=k;S.show(k);[...tabs.children].forEach(c=>c.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed','true')}},k==='camp'?'Campfire':'Radiator room');return b}));
   S.show('camp');h.append(tabs,fb,H('div',{class:'row'},m))}},
  {k:'sum',take:'Conduction: solids. Convection: liquids and gases. Radiation: anywhere, even a vacuum. Often more than one at once.',run(S){S.show('camp')}}],
 quiz:[Q('t','A metal spoon in hot soup gets hot mainly by...',['conduction','convection','radiation','evaporation'],0,'Energy passes along the solid metal.'),Q('t','Warm air rising above a heater is an example of...',['convection','conduction','radiation','insulation'],0,'Warm fluid rises: convection.'),
  Q('t','Which method of energy transfer can happen in a vacuum?',['Radiation','Conduction','Convection','All three'],0,'Only radiation does not need particles.')]});
