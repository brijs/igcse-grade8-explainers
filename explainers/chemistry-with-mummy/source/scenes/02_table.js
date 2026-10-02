/* ===== 1.4 The periodic table ===== */
const PT_POS=(()=>{const m={};m.H=[0,0];m.He=[0,7];for(let i=0;i<8;i++){m[EL[2+i].sym]=[1,i];m[EL[10+i].sym]=[2,i]}m.K=[3,0];m.Ca=[3,1];return m})();
const PT_CAT=s=>['Li','Be','Na','Mg','Al','K','Ca'].includes(s)?'m':['B','Si'].includes(s)?'x':['He','Ne','Ar'].includes(s)?'n':'o';
const PT_COL={m:'#9ec5f4',x:'#c3e3a8',n:'#d9c5f2',o:'#f6d98b'};
SCENES.push({id:'1.4',act:'atom',title:'The periodic table',idea:'Groups are columns, periods are rows',
 setup(ctx){
  const s=ctx.svg();const X={s,cells:{},on:null};const x0=130,y0=96,w=68,h=62;
  ['1','2','3','4','5','6','7','0'].forEach((g,i)=>s.append(T(x0+i*w+w/2,y0-12,g,{'font-size':18,fill:'var(--muted)'})));
  s.append(T(x0+4*w,y0-40,'Group',{'font-size':20,fill:'var(--accent)'}));
  ['1','2','3','4'].forEach((p,i)=>s.append(T(x0-18,y0+i*h+h/2+6,p,{'font-size':18,fill:'var(--muted)'})));
  s.append(T(48,y0+2*h+6,'Period',{'font-size':20,fill:'var(--accent)',transform:`rotate(-90 48 ${y0+2*h+6})`}));
  EL.forEach(e=>{const [r,c]=PT_POS[e.sym];const g=S('g',{class:'hit',role:'button','aria-label':e.name});
    g.append(R(x0+c*w+3,y0+r*h+3,w-6,h-6,{fill:PT_COL[PT_CAT(e.sym)],'stroke-width':2,rx:8}),T(x0+c*w+w/2,y0+r*h+36,e.sym,{'font-size':26,fill:'#13203a','font-family':'Fredoka,sans-serif'}),T(x0+c*w+10,y0+r*h+19,String(e.z),{'font-size':12,fill:'#33415c','text-anchor':'start'}));
    g.onclick=()=>{if(X.on)X.on(e.sym)};s.append(g);X.cells[e.sym]=g});
  const lg=[['m','metal'],['o','non-metal'],['x','metalloid'],['n','noble gas']];lg.forEach((l,i)=>{s.append(R(150+i*140,372,22,22,{fill:PT_COL[l[0]],rx:5,'stroke-width':2}),T(180+i*140,390,l[1],{'text-anchor':'start','font-size':17,fill:'var(--muted)'}))});
  X.note=T(400,432,'',{'font-size':20,fill:'var(--accent)'});s.append(X.note);
  X.dim=(syms)=>{EL.forEach(e=>X.cells[e.sym].setAttribute('opacity',!syms||syms.includes(e.sym)?1:.3))};
  X.ring=S('rect',{x:0,y:0,width:w-2,height:h-2,rx:10,fill:'none',stroke:'var(--hot)','stroke-width':4,opacity:0,'pointer-events':'none'});s.append(X.ring);
  X.at=(sym)=>{if(!sym){X.ring.setAttribute('opacity',0);return}const [r,c]=PT_POS[sym];setA(X.ring,{x:x0+c*w+1,y:y0+r*h+1,opacity:1})};
  return X},
 steps:[
  {k:'watch',run(X,ctx){X.dim(null);X.at(null);X.on=null;X.note.textContent='';const rows=[0,1,2,3];EL.forEach(e=>{X.cells[e.sym].setAttribute('opacity',0)});rows.forEach(r=>ctx.after(600+r*900,()=>EL.filter(e=>PT_POS[e.sym][0]===r).forEach(e=>X.cells[e.sym].setAttribute('opacity',1))));ctx.after(4600,()=>X.note.textContent='Rows are periods. Columns are groups.')}},
  {k:'watch',run(X,ctx){X.dim(null);X.on=null;X.note.textContent='';X.at('Na');ctx.after(1200,()=>{X.dim(['Li','Na','K','H']);X.note.textContent='Group 1: one outer electron'});ctx.after(4800,()=>{X.dim(['Na','Mg','Al','Si','P','S','Cl','Ar']);X.note.textContent='Period 3: three shells'});ctx.after(8200,()=>{X.dim(null);X.note.textContent='Sodium: 2,8,1 → Group 1, Period 3'})}},
  {k:'predict',q:'An element has configuration 2,8,6. Which group and period is it in?',opts:['Group 3, period 6','Group 6, period 3','Group 8, period 3','Group 2, period 8'],ans:1,why:'6 outer electrons: Group 6. Three numbers: three shells, so Period 3. It is sulfur.',run(X){X.dim(null);X.at(null);X.note.textContent='2,8,6 = ?';X.on=null},reveal(X){X.at('S');X.note.textContent='Sulfur (S)'}},
  {k:'try',build(X,ctx){const h=ctx.panel;X.dim(null);X.at(null);X.note.textContent='';
   const goals=[{t:'Click the element in Group 2, Period 3.',a:'Mg'},{t:'Click the metal in Group 1 that has 2 shells.',a:'Li'},{t:'Click the element with configuration 2,8,7.',a:'Cl'},{t:'Click the noble gas that has 3 shells.',a:'Ar'}];let gi=0;
   const goal=H('div',{class:'fb info'},goals[0].t),fb=H('div'),pg=H('p',{class:'hint'},'Found 0 of 4');
   X.on=sym=>{if(gi>=goals.length)return;if(sym===goals[gi].a){fb.className='fb good';fb.textContent='Yes: '+elBy(sym).name+' ('+cfgStr(elBy(sym).z)+').';cheer(true);X.at(sym);gi++;pg.textContent='Found '+gi+' of 4';if(gi>=goals.length){goal.textContent='All four found!';ctx.done()}else goal.textContent=goals[gi].t}
     else{fb.className='fb bad';fb.textContent=elBy(sym).name+' is Group '+(PT_POS[sym][1]===7?0:PT_POS[sym][1]+1)+', Period '+(PT_POS[sym][0]+1)+'. Try again.';cheer(false)}};
   h.append(goal,fb,pg)}},
  {k:'sum',take:'Group number = outer electrons. Period number = number of shells. Metals are on the left, non-metals on the right.',run(X){X.on=null;X.dim(null);X.at(null);X.note.textContent=''}}],
 quiz:[Q('t','Elements in the same group have the same number of…',['outer electrons','shells','protons','neutrons'],0,'Same group means the same number of outer electrons, so similar reactions.'),
  N('Aluminium has configuration 2,8,3. Which period is it in?',3,'','Three numbers means three shells, so Period 3.',0.1),
  Q('t','Which of these is a metal?',['Magnesium','Sulfur','Chlorine','Neon'],0,'Magnesium is on the left of the table. The others are non-metals.')]});

/* ===== 1.5 Group 1: the alkali metals ===== */
const G1={Li:{name:'lithium',sp:.5,col:'#b8bfc9',note:'Lithium floats and fizzes steadily.'},Na:{name:'sodium',sp:1.1,col:'#d3d8df',note:'Sodium melts into a ball and fizzes fast.'},K:{name:'potassium',sp:1.9,col:'#c6cbd6',note:'Potassium zooms about with a lilac flame.',flame:true}};
SCENES.push({id:'1.5',act:'atom',title:'Group 1: the alkali metals',idea:'Reactivity increases down the group',
 setup(ctx){
  const s=ctx.svg();const X={s,cur:null,ran:{}};
  const bk=beaker(270,200,260,170,'#9ccbf2',{fill:.22,op:.8});X.bk=bk;s.append(bk.g);
  s.append(T(400,400,'water + a few drops of universal indicator',{'font-size':16,fill:'var(--muted)'}));
  X.fx=S('g');s.append(X.fx);X.note=T(400,44,'',{'font-size':22,fill:'var(--accent)'});X.eq=T(400,430,'',{'font-size':19,fill:'var(--ink)'});s.append(X.note,X.eq);
  X.rank=S('g');['Li','Na','K'].forEach((m,i)=>{X.rank.append(R(570,100+i*78,200,60,{rx:12,fill:'var(--paper)','stroke-width':2}),T(670,138+i*78,m+'',{'font-size':30,'font-family':'Fredoka,sans-serif'}))});s.append(X.rank);X.rank.setAttribute('opacity',0);
  X.bars=[0,1,2].map(i=>{const b=R(580,150+i*78,0,6,{fill:'var(--hot)',rx:3,stroke:'none'});s.append(b);return b});
  X.reset=()=>{X.fx.innerHTML='';X.bk.liq.setAttribute('fill','#9ccbf2');X.note.textContent='';X.eq.textContent='';X.bars.forEach(b=>b.setAttribute('width',0))};
  X.react=(m,done)=>{X.fx.innerHTML='';X.bk.liq.setAttribute('fill','#9ccbf2');const d=G1[m];const piece=C(0,0,12,{fill:d.col,'stroke-width':2});const flame=S('path',{d:'M-10 0Q-14 -20 0 -34Q14 -20 10 0Z',fill:'#b48cf0',opacity:0});const ball=S('g');ball.append(flame,piece);X.fx.append(ball);
   const bubs=[];X.note.textContent=d.note;X.eq.textContent=d.name+' + water → '+d.name+' hydroxide + hydrogen';
   let t=0,x=400,vx=d.sp*70,dur=6.5;const idx=['Li','Na','K'].indexOf(m);
   ctx.raf(dt=>{t+=dt;x+=vx*dt;if(x>500){x=500;vx=-Math.abs(vx)}if(x<300){x=300;vx=Math.abs(vx)}if(m!=='Li'&&Math.random()<.02)vx=-vx;
     const y=210+Math.sin(t*6*d.sp)*3;const sc=clamp(1-t/dur*.9,.12,1);ball.setAttribute('transform',`translate(${x} ${y}) scale(${sc})`);if(d.flame)flame.setAttribute('opacity',Math.random()>.2?.9:.4);
     if(t<dur&&Math.random()<dt*28*d.sp){const b=C(x+rnd(-8,8),y+8,rnd(2,5),{fill:'#fff',opacity:.8,'stroke-width':1});X.fx.append(b);bubs.push({b,vy:rnd(40,90)})}
     bubs.forEach(o=>{const cy=+o.b.getAttribute('cy')-o.vy*dt;o.b.setAttribute('cy',cy);if(cy<120)o.b.setAttribute('opacity',0)});
     const k=clamp(t/dur,0,1);X.bk.liq.setAttribute('fill',`rgb(${Math.round(156+(120-156)*k)},${Math.round(203+(70-203)*k)},${Math.round(242+(190-242)*k)})`);
     X.bars[idx].setAttribute('width',Math.min(180,k*d.sp*95));
     if(t>=dur+1){X.ran[m]=1;if(done)done();return false}})};
  return X},
 steps:[
  {k:'watch',run(X,ctx){X.reset();X.rank.setAttribute('opacity',0);X.note.textContent='Group 1: lithium, sodium, potassium';const g=S('g');X.fx.append(g);['Li','Na','K'].forEach((m,i)=>{const gg=G(150+i*250,150);gg.append(R(-40,-20,80,50,{fill:G1[m].col,rx:6}),T(0,12,m,{'font-size':28,fill:'#13203a','font-family':'Fredoka,sans-serif'}),T(0,60,G1[m].name,{'font-size':17,fill:'var(--muted)'}));g.append(gg)});X.eq.textContent='soft and shiny when cut, stored under oil'}},
  {k:'watch',run(X,ctx){X.reset();X.rank.setAttribute('opacity',1);ctx.after(300,()=>X.react('Li',()=>{}));ctx.after(8300,()=>X.react('Na',()=>{}));ctx.after(16300,()=>X.react('K',()=>{X.note.textContent='Reactivity increases down the group'}))}},
  {k:'predict',q:'Rubidium is below potassium in Group 1. How will it react with water?',opts:['Even more vigorously than potassium','More slowly than potassium','Exactly like potassium','Not at all'],ans:0,why:'Reactivity increases down Group 1, so rubidium is even more reactive than potassium.',run(X){X.reset();X.rank.setAttribute('opacity',1);X.bars.forEach((b,i)=>b.setAttribute('width',[50,100,180][i]));X.note.textContent='Li  <  Na  <  K  <  Rb ?'}},
  {k:'try',build(X,ctx){const h=ctx.panel;X.reset();X.rank.setAttribute('opacity',1);let pick='Li',busy=false;
   const fb=H('div',{class:'fb info'},'Choose a metal, then drop it into the water.'),pg=H('p',{class:'hint'},'Tested 0 of 3');
   pickRow(h,[{id:'Li',label:'Lithium'},{id:'Na',label:'Sodium'},{id:'K',label:'Potassium'}],id=>pick=id,'Li');
   const go=H('button',{class:'btn small',onclick:()=>{if(busy)return;busy=true;go.disabled=true;fb.className='fb info';fb.textContent='Watch carefully...';X.react(pick,()=>{busy=false;go.disabled=false;fb.className='fb good';fb.textContent=G1[pick].note+' Hydrogen gas and an alkaline solution are made.';const n=Object.keys(X.ran).length;pg.textContent='Tested '+n+' of 3';if(n>=3)ctx.done()})}},'Drop it in');
   h.append(go,fb,pg)}},
  {k:'sum',take:'Group 1 metals react with water to make hydrogen and an alkaline hydroxide. Reactivity increases down the group: Li, Na, K.',run(X){X.reset();X.rank.setAttribute('opacity',1);X.bars.forEach((b,i)=>b.setAttribute('width',[50,100,180][i]));X.eq.textContent='metal + water → metal hydroxide + hydrogen'}}],
 quiz:[Q('t','Which gas is made when a Group 1 metal reacts with water?',['Hydrogen','Oxygen','Carbon dioxide','Chlorine'],0,'Metal + water → metal hydroxide + hydrogen.'),
  Q('t','Which of these metals is the most reactive?',['Potassium','Lithium','Sodium','They are all the same'],0,'Reactivity increases down Group 1, and potassium is lowest of the three.'),
  Q('t','Universal indicator turns purple in the solution. So the solution is…',['alkaline','acidic','neutral','a salt'],0,'Metal hydroxides are alkaline.')]});

/* ===== 1.6 Halogens and noble gases ===== */
const HAL=[{s:'F',n:'fluorine',st:'pale yellow gas',c:'#f4e58c',kind:'gas'},{s:'Cl',n:'chlorine',st:'pale green gas',c:'#b9d96a',kind:'gas'},{s:'Br',n:'bromine',st:'red-brown liquid',c:'#b5481f',v:'#e08a4a',kind:'liq'},{s:'I',n:'iodine',st:'grey-black solid',c:'#4a4560',v:'#9b6bd1',kind:'sol'}];
SCENES.push({id:'1.6',act:'atom',title:'Halogens and noble gases',idea:'Group 7 gets less reactive down; Group 0 is unreactive',
 setup(ctx){
  const s=ctx.svg();const X={s,jars:[],ng:null};
  s.append(T(215,36,'Group 7: the halogens',{'font-size':22,fill:'var(--accent)'}),T(620,36,'Group 0: noble gases',{'font-size':22,fill:'var(--accent)'}));
  HAL.forEach((h,i)=>{const g=G(35+i*98,70);const jar=R(0,0,72,200,{rx:12,fill:'var(--paper)','stroke-width':3});g.append(jar);
    if(h.kind==='gas'){g.append(R(4,4,64,192,{rx:9,fill:h.c,opacity:.55,stroke:'none'}))}
    if(h.kind==='liq'){g.append(R(4,4,64,192,{rx:9,fill:h.v,opacity:.3,stroke:'none'}),R(4,150,64,46,{rx:9,fill:h.c,stroke:'none'}))}
    if(h.kind==='sol'){g.append(R(4,4,64,192,{rx:9,fill:h.v,opacity:.25,stroke:'none'}));for(let k=0;k<7;k++)g.append(S('polygon',{points:`${8+k*9},196 ${14+k*9},176 ${20+k*9},196`,fill:h.c}))}
    g.append(T(36,236,h.s,{'font-size':30,'font-family':'Fredoka,sans-serif'}),T(36,262,h.n,{'font-size':15,fill:'var(--muted)'}));const lab=T(36,284,h.st,{'font-size':13,fill:'var(--ink)'});g.append(lab);
    const rows=[h.st.split(' ').slice(0,-1).join(' '),h.st.split(' ').slice(-1)[0]];lab.textContent='';rows.forEach((r,k)=>g.append(T(36,284+k*16,r,{'font-size':14,fill:'var(--ink)'})));
    g.setAttribute('opacity',0);s.append(g);X.jars.push(g)});
  X.arrow=S('g',{opacity:0});X.arrow.append(Pth('M425 90V330',{stroke:'var(--hot)','stroke-width':5}),S('polygon',{points:'413,320 425,345 437,320',fill:'var(--hot)'}),T(437,205,'reactivity',{'font-size':13,fill:'var(--hot)','text-anchor':'start',transform:'rotate(90 437 205)'}));s.append(X.arrow);
  X.ng=S('g',{opacity:0});[['He',[2],485,'2'],['Ne',[2,8],575,'2,8'],['Ar',[2,8,8],700,'2,8,8']].forEach(a=>{const at=atomSVG(a[2],185,a[1],{label:a[0],nuc:14,lf:14,r0:28,dr:16,er:3.6,gap:12});X.ng.append(at,T(a[2],290,a[0]+'  '+a[3],{'font-size':18,fill:'var(--accent)','font-family':'Fredoka,sans-serif'}))});X.ng.append(T(620,330,'full outer shells',{'font-size':17,fill:'var(--muted)'}));s.append(X.ng);
  X.note=T(400,432,'',{'font-size':19,fill:'var(--accent)'});s.append(X.note);return X},
 steps:[
  {k:'watch',run(X,ctx){X.arrow.setAttribute('opacity',0);X.ng.setAttribute('opacity',0);X.jars.forEach((j,i)=>{j.setAttribute('opacity',0);ctx.after(700+i*1600,()=>j.setAttribute('opacity',1))});ctx.after(7800,()=>X.note.textContent='7 outer electrons. Darker and denser down the group.')}},
  {k:'watch',run(X,ctx){X.jars.forEach(j=>j.setAttribute('opacity',1));X.note.textContent='';ctx.after(500,()=>X.arrow.setAttribute('opacity',1));ctx.after(3500,()=>{X.note.textContent='Group 7: reactivity decreases down'});ctx.after(6000,()=>X.ng.setAttribute('opacity',1));ctx.after(9500,()=>X.note.textContent='Group 0: full outer shells, so unreactive')}},
  {k:'predict',q:'Astatine is below iodine in Group 7. What do you expect at room temperature?',opts:['A dark solid','A pale yellow gas','A green gas','A red-brown liquid'],ans:0,why:'Halogens get darker and denser down the group: gas, liquid, solid. Astatine is below iodine, so a dark solid.',run(X){X.jars.forEach(j=>j.setAttribute('opacity',1));X.arrow.setAttribute('opacity',0);X.ng.setAttribute('opacity',0);X.note.textContent='F → Cl → Br → I → At ?'}},
  {k:'try',build(X,ctx){X.jars.forEach(j=>j.setAttribute('opacity',.4));X.ng.setAttribute('opacity',1);X.note.textContent='';
   matchGame(ctx.panel,{help:'Tap a fact, then tap its group.',items:[
    {label:'Soft metals stored in oil',to:'g1',hint:'Think of lithium, sodium and potassium.'},{label:'Reactivity increases down the group',to:'g1',hint:'Which group gets more reactive downwards?'},
    {label:'Coloured; darker down the group',to:'g7',hint:'Chlorine, bromine and iodine.'},{label:'Reactivity decreases down the group',to:'g7',hint:'Fluorine is the most reactive.'},
    {label:'Full outer shell, so unreactive',to:'g0',hint:'These do not need to gain or lose electrons.'},{label:'Used in balloons and lights',to:'g0',hint:'Helium, neon and argon.'},
    {label:'Chlorine gas, iodine solid',to:'g7',hint:'The halogens change state down the group.'},{label:'React with water to make hydrogen',to:'g1',hint:'The alkali metals.'}],
    buckets:[{id:'g1',label:'Group 1: alkali metals'},{id:'g7',label:'Group 7: halogens'},{id:'g0',label:'Group 0: noble gases'}],onDone:ctx.done})}},
  {k:'sum',take:'Group 7: coloured, darker down, reactivity decreases down. Group 0: full outer shell, so unreactive.',run(X){X.jars.forEach(j=>j.setAttribute('opacity',1));X.arrow.setAttribute('opacity',1);X.ng.setAttribute('opacity',1);X.note.textContent=''}}],
 quiz:[Q('t','Why are the noble gases unreactive?',['They have a full outer shell','They have one outer electron','They are metals','They are very heavy'],0,'A full outer shell is stable, so they do not need to gain, lose or share electrons.'),
  Q('t','Which halogen is a liquid at room temperature?',['Bromine','Chlorine','Iodine','Fluorine'],0,'Chlorine is a gas, bromine a liquid, iodine a solid.'),
  N('How many outer electrons does a halogen atom have?',7,'','Group 7 means 7 outer electrons.',0.1)]});
