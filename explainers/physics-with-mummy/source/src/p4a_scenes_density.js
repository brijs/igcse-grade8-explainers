/* ---------- shared bits for density ---------- */
function cylinder(parent,x,y,h,max){
  const g=S('g',{transform:`translate(${x} ${y})`});const w=70,px=h/max;
  const water=R(0,h,w,0,{fill:'var(--water)',stroke:'none',rx:0});g.append(water,R(0,0,w,h,{fill:'none',rx:5}));
  for(let v=0;v<=max;v+=10){g.append(L(0,h-v*px,v%50?14:22,h-v*px,{'stroke-width':1.8}));if(v%20===0)g.append(T(-8,h-v*px+6,String(v),{'text-anchor':'end','font-size':14,fill:'var(--muted)'}))}
  const line=L(0,h,w,h,{stroke:'var(--cold)','stroke-width':3});g.append(line);
  const set=v=>{setA(water,{y:h-v*px,height:v*px});setA(line,{y1:h-v*px,y2:h-v*px})};
  parent.append(g);return {g,set,px,h,w};
}
function jiggle(ctx,g,pts,amp){ctx.bg.raf((dt,t)=>{pts.forEach((p,i)=>{p.el.setAttribute('cx',p.x+Math.sin(t*7+p.ph)*amp);p.el.setAttribute('cy',p.y+Math.cos(t*6.3+p.ph*1.7)*amp)})})}
function fillCube(g,n,x0,y0,size,color){
  g.innerHTML='';const cols=Math.ceil(Math.sqrt(n)),rows=Math.ceil(n/cols),pad=size*0.1,cw=(size-2*pad)/cols,rh=(size-2*pad)/rows;const r=Math.min(cw,rh)*0.42;const pts=[];
  for(let i=0;i<n;i++){const cx=x0+pad+(i%cols+.5)*cw+(Math.random()-.5)*(n<12?cw*.5:2),cy=y0+pad+(Math.floor(i/cols)+.5)*rh+(Math.random()-.5)*(n<12?rh*.5:2);const el=C(cx,cy,r,{fill:color,stroke:'none'});g.append(el);pts.push({el,x:cx,y:cy,ph:Math.random()*6})}
  return pts;
}

/* ===== 3.1 ===== */
SCENES.push({id:'3.1',act:'dens',title:'What is density?',idea:'Density = mass ÷ volume; packed particles',
 setup(ctx){
  const s=ctx.svg();const A={x:80,y:110,size:240},B={x:480,y:110,size:240};
  const solid=(o,c,name,mass)=>{const g=S('g');g.append(R(o.x,o.y,o.size,o.size,{fill:c,rx:12}));g.append(T(o.x+o.size/2,o.y+o.size/2-4,name,{'font-size':30,fill:'#fff','font-family':'Fredoka,sans-serif'}),T(o.x+o.size/2,o.y+o.size/2+30,mass,{'font-size':20,fill:'#fff'}));s.append(g);return g};
  const sa=solid(A,'#9fb4c9','Foam','mass 0.05 g'),sb=solid(B,'#4e5d73','Lead','mass 11.3 g');
  const pa=S('g',{opacity:0}),pb=S('g',{opacity:0});s.append(R(A.x,A.y,A.size,A.size,{fill:'none',rx:12}),R(B.x,B.y,B.size,B.size,{fill:'none',rx:12}),pa,pb);
  const ta=T(A.x+A.size/2,A.y+A.size+40,'Same volume: 1 cm³',{'font-size':20,fill:'var(--muted)'}),tb=T(B.x+B.size/2,B.y+B.size+40,'Same volume: 1 cm³',{'font-size':20,fill:'var(--muted)'});
  const den=[T(A.x+A.size/2,B.y-16,'',{'font-size':26,fill:'var(--accent)','font-family':'Fredoka,sans-serif'}),T(B.x+B.size/2,B.y-16,'',{'font-size':26,fill:'var(--accent)','font-family':'Fredoka,sans-serif'})];
  s.append(ta,tb,...den);s.append(T(400,230,'vs',{'font-size':30,fill:'var(--muted)'}));
  let A_pts=fillCube(pa,4,A.x,A.y,A.size,'var(--cold)'),B_pts=fillCube(pb,36,B.x,B.y,B.size,'var(--hot)');
  const refresh=()=>{ctx.bg.raf((dt,t)=>{[A_pts,B_pts].forEach(arr=>arr.forEach(p=>{p.el.setAttribute('cx',p.x+Math.sin(t*7+p.ph)*2.5);p.el.setAttribute('cy',p.y+Math.cos(t*6.3+p.ph*1.7)*2.5)}))})};
  const bgT=ctx.bg.raf((dt,t)=>{[A_pts,B_pts].forEach(arr=>arr.forEach(p=>{p.el.setAttribute('cx',p.x+Math.sin(t*7+p.ph)*2.5);p.el.setAttribute('cy',p.y+Math.cos(t*6.3+p.ph*1.7)*2.5)}))});
  const S1={s,sa,sb,pa,pb,den,B,setB(n,name,d,mass){B_pts=fillCube(pb,n,B.x,B.y,B.size,'var(--hot)');sb.children[1].textContent=name;sb.children[2].textContent='mass '+mass+' g';den[1].textContent=d+' g/cm³'},ta,tb};
  return S1;
 },
 steps:[
  {k:'watch',run(S,ctx){setA(S.sa,{opacity:1});setA(S.sb,{opacity:1});setA(S.pa,{opacity:0});setA(S.pb,{opacity:0});S.den[0].textContent='';S.den[1].textContent='';S.setB(36,'Lead',11.3,11.3)}},
  {k:'watch',run(S,ctx){tween(ctx,1.5,p=>{S.sa.setAttribute('opacity',1-p*.9);S.sb.setAttribute('opacity',1-p*.9);S.pa.setAttribute('opacity',p);S.pb.setAttribute('opacity',p)});ctx.after(2500,()=>{S.den[0].textContent='0.05 g/cm³';S.den[1].textContent='11.3 g/cm³'})}},
  {k:'predict',q:'200 g in 50 cm³. What is the density?',opts:['0.25 g/cm³','4 g/cm³','40 g/cm³','10 000 g/cm³'],ans:1,why:'200 ÷ 50 = 4 g/cm³.'},
  {k:'try',build(S,ctx){const h=ctx.panel;S.sa.setAttribute('opacity',.1);S.sb.setAttribute('opacity',.1);S.pa.setAttribute('opacity',1);S.pb.setAttribute('opacity',1);
   const M=[['Cork',0.25],['Ice',0.92],['Water',1.0],['Aluminium',2.7],['Iron',7.9],['Lead',11.3]];const seen=new Set();
   const fb=H('div',{class:'fb info mono'},'Choose a material for the right-hand cube.');
   const chips=H('div',{class:'chips'},M.map(m=>H('button',{class:'chip',onclick:()=>{S.setB(clamp(Math.round(m[1]*3.2),3,40),m[0],m[1],m[1]);fb.innerHTML=`${m[0]}: 1 cm³ has a mass of ${m[1]} g, so density = ${m[1]} ÷ 1 = ${m[1]} g/cm³`;seen.add(m[0]);if(seen.size>=3&&cov.size>=1)ctx.done()}},m[0])));
   const cov=new Set(),tri=H('div',{class:'fb info mono'},'Cover a letter to see the formula.');
   const mk=(l,txt)=>H('button',{class:'btn small ghost',onclick:()=>{tri.textContent=txt;cov.add(l);if(seen.size>=3)ctx.done()}},l);
   h.append(chips,fb,H('div',{class:'row'},H('span',{class:'hint'},'Cover:'),mk('mass','mass = density × volume'),mk('density','density = mass ÷ volume'),mk('volume','volume = mass ÷ density')),tri)}},
  {k:'sum',take:'density = mass ÷ volume. Units: g/cm³ or kg/m³.',run(S){S.sa.setAttribute('opacity',.1);S.pa.setAttribute('opacity',1)}}],
 quiz:[Q('t','Which equation gives density?',['mass ÷ volume','volume ÷ mass','mass × volume','mass + volume'],0,'Density = mass ÷ volume.'),N('A block has a volume of 90 cm³ and a mass of 270 g. What is its density (g/cm³)?',3,'g/cm³','270 ÷ 90 = 3 g/cm³.'),N('Oil has a density of 0.8 g/cm³. What is the mass of 200 cm³ of oil (g)?',160,'g','mass = density × volume = 0.8 × 200 = 160 g.')]});

/* ===== 3.2 ===== */
SCENES.push({id:'3.2',act:'dens',title:'Measuring density',idea:'Regular: l × w × h. Irregular: displacement',
 setup(ctx){
  const s=ctx.svg();
  const blk=S('g');blk.append(R(180,120,300,110,{fill:'#c9a36a',rx:6}),S('path',{d:'M180 120L230 80H530L480 120Z',fill:'#dcba83',stroke:'var(--ink)','stroke-width':2.5}),S('path',{d:'M480 120L530 80V190L480 230Z',fill:'#b48b52',stroke:'var(--ink)','stroke-width':2.5}),
   T(330,262,'length 10 cm',{'font-size':22,fill:'var(--hot)'}),T(560,155,'3 cm',{'text-anchor':'start','font-size':22,fill:'var(--hot)'}),T(150,185,'3 cm',{'text-anchor':'end','font-size':22,fill:'var(--hot)'}),
   T(400,320,'volume = 10 × 3 × 3 = 90 cm³',{'font-size':30,'font-family':'Fredoka,sans-serif',fill:'var(--accent)'}),T(400,362,'mass 270 g,  density = 270 ÷ 90 = 3 g/cm³',{'font-size':26,'font-family':'Fredoka,sans-serif'}));
  s.append(blk);
  const lab=S('g',{opacity:0});const cy=cylinder(lab,150,60,330,100);cy.set(40);
  const stone=S('path',{d:'M0 0C14-14 38-10 44 6C50 24 28 32 8 28C-8 24-10 10 0 0Z',fill:'#8a8a8a',stroke:'var(--ink)','stroke-width':2.5});stone.setAttribute('transform','translate(300 20)');lab.append(stone);
  const sc=S('g');sc.append(R(430,330,240,40,{fill:'var(--metal)',rx:6}),R(480,372,140,50,{fill:'var(--paper)'}),T(550,408,'0 g',{'font-size':28,'font-family':'JetBrains Mono,monospace'}));lab.append(sc);
  const info=T(580,120,'',{'font-size':24,fill:'var(--accent)','font-family':'Fredoka,sans-serif'}),info2=T(580,160,'',{'font-size':24,fill:'var(--hot)','font-family':'Fredoka,sans-serif'});lab.append(info,info2);
  s.append(lab);
  return {blk,lab,cy,stone,sc,info,info2,massT:sc.children[2]};
 },
 steps:[
  {k:'watch',run(S){setA(S.blk,{opacity:1});setA(S.lab,{opacity:0})}},
  {k:'watch',run(S,ctx){setA(S.blk,{opacity:0});setA(S.lab,{opacity:1});S.cy.set(40);S.stone.setAttribute('transform','translate(172 20)');S.info.textContent='';S.info2.textContent='';
   ctx.after(1500,()=>tween(ctx,2,p=>{const e=ease(p);S.stone.setAttribute('transform',`translate(172 ${20+e*270})`);S.cy.set(40+25*e)},()=>{S.info.textContent='40 → 65 cm³';S.info2.textContent='volume = 25 cm³'}))}},
  {k:'predict',q:'Why can’t a ruler find the volume of a stone?',opts:['It has an irregular shape','Stones have no volume','A ruler only measures mass'],ans:0,why:'You cannot use length × width × height on an odd shape, so use displacement.',run(S){setA(S.blk,{opacity:0});setA(S.lab,{opacity:1})}},
  {k:'try',build(S,ctx){const h=ctx.panel;setA(S.blk,{opacity:0});setA(S.lab,{opacity:1});S.cy.set(40);S.stone.setAttribute('transform','translate(172 20)');S.massT.textContent='0 g';S.info.textContent='';S.info2.textContent='';
   let weighed=false,lowered=false;const fb=H('div',{class:'fb info'},'Step 1: weigh the stone.');
   const b1=H('button',{class:'btn small',onclick:()=>{weighed=true;S.massT.textContent='60 g';fb.textContent='Mass = 60 g. Step 2: lower the stone into the water.';b1.disabled=true;b2.disabled=false}},'1. Weigh the stone');
   const b2=H('button',{class:'btn small',disabled:true,onclick:()=>{b2.disabled=true;tween(ctx,2,p=>{const e=ease(p);S.stone.setAttribute('transform',`translate(172 ${20+e*270})`);S.cy.set(40+25*e)},()=>{lowered=true;fb.textContent='Water went 40 → 65 cm³. Enter the volume and the density.';box.hidden=false})}},'2. Lower into the cylinder');
   const v=H('input',{type:'text',inputmode:'decimal',placeholder:'Volume (cm³)',id:'vv'}),d=H('input',{type:'text',inputmode:'decimal',placeholder:'Density (g/cm³)',id:'dd'});
   const chk=H('button',{class:'btn small',onclick:()=>{const okv=+v.value===25,okd=Math.abs(+d.value-2.4)<0.05;if(okv&&okd){fb.className='fb good mono';fb.textContent='Volume 65 − 40 = 25 cm³. Density 60 ÷ 25 = 2.4 g/cm³.';S.info.textContent='25 cm³';S.info2.textContent='2.4 g/cm³';ctx.done()}else{fb.className='fb bad';fb.textContent=okv?'Volume is right. Density = mass ÷ volume = 60 ÷ 25.':'Volume = final reading − starting reading.'}}},'Check');
   const box=H('div',{class:'row',hidden:true},H('div',{class:'field',style:'flex:1'},v),H('div',{class:'field',style:'flex:1'},d),chk);
   h.append(H('div',{class:'row'},b1,b2),fb,box)}},
  {k:'sum',take:'Irregular solid: volume = final reading − starting reading. Then density = mass ÷ volume.'}],
 quiz:[N('Water rises from 50 to 85 cm³ when a rock is added. What is the volume of the rock (cm³)?',35,'cm³','85 − 50 = 35 cm³.'),N('That rock has a mass of 98 g. What is its density (g/cm³)?',2.8,'g/cm³','98 ÷ 35 = 2.8 g/cm³.',0.05),Q('t','Which method finds the volume of an irregular solid?',['Displacement of water','Multiplying length by width','Using a balance','Using a stopwatch'],0,'The solid pushes aside its own volume of water.')]});

/* ===== 3.3 ===== */
SCENES.push({id:'3.3',act:'dens',title:'Float or sink?',idea:'Floats if less dense than the liquid',
 setup(ctx){
  const s=ctx.svg();const wt=190,bot=410;
  const tank=S('g');tank.append(R(60,wt,440,bot-wt,{fill:'var(--water)',stroke:'none',rx:6,opacity:.9}),S('path',{d:`M60 90V${bot}H500V90`,fill:'none',stroke:'var(--ink)','stroke-width':3.5,'stroke-linejoin':'round'}),T(280,wt-10,'water: 1.0 g/cm³',{'font-size':20,fill:'var(--cold)'}));
  const legend=S('g');[['cork',0.25],['wood',0.6],['ice',0.92],['aluminium',2.7],['iron',7.9],['lead',11.3]].forEach((m,i)=>{legend.append(T(560,120+i*38,m[0],{'text-anchor':'start','font-size':20}),T(770,120+i*38,m[1]+' g/cm³',{'text-anchor':'end','font-size':20,'font-family':'JetBrains Mono,monospace',fill:'var(--muted)'}))});
  s.append(tank,legend);const holder=S('g');s.append(holder);
  const syr=S('g',{opacity:0});syr.append(R(120,170,420,110,{fill:'var(--paper)',rx:10}),L(540,225,690,225,{'stroke-width':8}),R(690,190,18,70,{rx:4,fill:'var(--ink)'}));
  const gas=S('g');syr.append(gas);const plunger=R(520,172,14,106,{fill:'var(--metal)',rx:3});syr.append(plunger);
  const sdn=T(330,330,'',{'font-size':28,fill:'var(--accent)','font-family':'Fredoka,sans-serif'});syr.append(sdn,T(330,160,'air in a syringe',{'font-size':20,fill:'var(--muted)'}));s.append(syr);
  const pts=[];for(let i=0;i<30;i++){const el=C(0,0,6,{fill:'var(--cold)',stroke:'none'});gas.append(el);pts.push({el,u:Math.random(),v:Math.random(),ph:Math.random()*6})}
  let Vol=50;ctx.bg.raf((dt,t)=>{const w=Vol/50*380,x1=128+w;plunger.setAttribute('x',x1+2);syr.children[1].setAttribute('x2',x1+2+0);pts.forEach(p=>{p.el.setAttribute('cx',136+p.u*(w-16)+Math.sin(t*5+p.ph)*3);p.el.setAttribute('cy',182+p.v*86+Math.cos(t*4+p.ph)*3)})});
  const setVol=v=>{Vol=v;sdn.textContent=`${v} cm³: density ×${fmt(50/v,2)}`};
  return {s,tank,holder,syr,wt,bot,setVol,legend};
 },
 steps:[
  {k:'watch',run(S,ctx){setA(S.syr,{opacity:0});setA(S.tank,{opacity:1});setA(S.legend,{opacity:1});S.holder.innerHTML='';const blocks=[['cork',.25,'#d6a36a'],['iron',7.9,'#6d7a89']];blocks.forEach((b,i)=>S.drop(b,ctx,200+i*160,i*900))}},
  {k:'watch',run(S,ctx){setA(S.syr,{opacity:0});S.holder.innerHTML='';[['cork',.25,'#d6a36a'],['wood',.6,'#b8854a'],['iron',7.9,'#6d7a89'],['lead',11.3,'#4e5d73']].forEach((b,i)=>S.drop(b,ctx,130+i*105,i*500))}},
  {k:'predict',q:'Ice has a density of 0.92 g/cm³. In water it will...',opts:['float','sink'],ans:0,why:'0.92 is less than 1.0, so ice floats (mostly submerged).',run(S){S.holder.innerHTML=''}},
  {k:'try',build(S,ctx){const h=ctx.panel;S.holder.innerHTML='';let pick=null,done=0;const fb=H('div',{class:'fb info'},'Pick an object, then guess.');
   const O=[['cork',.25,'#d6a36a'],['wood',.6,'#b8854a'],['ice',.92,'#cfe9f5'],['aluminium',2.7,'#aab3bd'],['iron',7.9,'#6d7a89'],['lead',11.3,'#4e5d73']];
   const g=H('div',{class:'row'}),chips=H('div',{class:'chips'});
   const guess=(f)=>{if(!pick)return;const o=pick,ok=(o[1]<1)===f;S.holder.innerHTML='';S.drop(o,ctx,280,0);fb.className='fb '+(ok?'good':'bad');fb.textContent=(ok?'Yes! ':'Not quite. ')+o[0]+' has density '+o[1]+' g/cm³, which is '+(o[1]<1?'less':'more')+' than water, so it '+(o[1]<1?'floats':'sinks')+'.';cheer(ok);if(ok){done++;if(done>=4)ctx.done()}pick=null;[...chips.children].forEach(c=>c.classList.remove('sel'))};
   O.forEach(o=>{const c=H('button',{class:'chip',onclick:()=>{pick=o;[...chips.children].forEach(x=>x.classList.remove('sel'));c.classList.add('sel');fb.className='fb info';fb.textContent='Will the '+o[0]+' float or sink?'}},o[0]);chips.append(c)});
   h.append(chips,H('div',{class:'row'},H('button',{class:'btn small',onclick:()=>guess(true)},'Float'),H('button',{class:'btn small ghost',onclick:()=>guess(false)},'Sink')),fb)}},
  {k:'try',build(S,ctx){const h=ctx.panel;setA(S.syr,{opacity:1});setA(S.tank,{opacity:0});setA(S.legend,{opacity:0});S.holder.innerHTML='';S.setVol(50);let moved=false;
   const sl=H('input',{type:'range',min:10,max:50,value:50,id:'sy','aria-label':'Syringe volume'});sl.oninput=()=>{S.setVol(+sl.value);if(+sl.value<=25&&!moved){moved=true;ctx.done()}};
   h.append(H('div',{class:'field'},H('label',{for:'sy'},'Push the plunger in'),sl),H('div',{class:'fb info'},'The mass of air stays the same, the volume gets smaller, so the density goes up.'))}},
  {k:'sum',take:'Floats if less dense than the liquid; sinks if more dense. Squeeze a gas: same mass, smaller volume, higher density.',run(S){setA(S.syr,{opacity:0});setA(S.tank,{opacity:1});setA(S.legend,{opacity:1})}}],
 quiz:[Q('t','Which of these floats in water? (water is 1.0 g/cm³)',['Cork, 0.25 g/cm³','Iron, 7.9 g/cm³','Lead, 11.3 g/cm³','Aluminium, 2.7 g/cm³'],0,'Cork is less dense than water.'),
  Q('t','Why does a steel ship float?',['Its average density is less than water','Steel is lighter than water','The sea pushes it up only','It has no mass'],0,'The hollow shape holds air, so the ship’s average density is less than water.'),N('What is the mass of 50 cm³ of lead, density 11.3 g/cm³ (g)?',565,'g','11.3 × 50 = 565 g.')]});
// float/sink dropper
SCENES.find(s=>s.id==='3.3').setup=(orig=>function(ctx){const S0=orig(ctx);S0.drop=(b,ctx2,x,delay)=>{const [name,d,col]=b;const sz=56,h=sz;const g=S('g');const r=R(0,0,sz*1.4,sz,{fill:col,rx:6});g.append(r,T(sz*.7,sz*.62,name,{'font-size':15,fill:d>2?'#fff':'#222'}));S0.holder.append(g);
  const f=Math.min(1,d/1.0);const finalY=f>=1?S0.bot-sz-4:S0.wt-(1-f)*sz;g.setAttribute('transform',`translate(${x} 40)`);
  ctx2.after(delay||0,()=>tween(ctx2,f>=1?1.6:1.2,p=>{const e=ease(p);const y=40+(finalY-40)*e;g.setAttribute('transform',`translate(${x} ${y+(p>.8&&f<1?Math.sin(p*40)*2:0)})`)}))};return S0})(SCENES.find(s=>s.id==='3.3').setup);
