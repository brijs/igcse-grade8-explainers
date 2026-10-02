/* ===== 2.1 Why atoms bond ===== */
SCENES.push({id:'2.1',act:'bond',title:'Why do atoms bond?',idea:'To get a full outer shell',
 setup(ctx){
  const s=ctx.svg();const X={s,atoms:[]};
  const defs=[['Na',[2,8,1],170,'sodium  2,8,1'],['Ne',[2,8],400,'neon  2,8'],['Cl',[2,8,7],630,'chlorine  2,8,7']];
  defs.forEach(d=>{const g=S('g');g.append(atomSVG(d[2],190,d[1],{label:d[0],nuc:18,lf:15,r0:34,dr:24,er:6}),T(d[2],330,d[3],{'font-size':19,fill:'var(--muted)'}));s.append(g);X.atoms.push(g)});
  X.glow=S('circle',{cx:400,cy:190,r:68,fill:'none',stroke:'var(--good)','stroke-width':5,opacity:0});s.append(X.glow);
  X.cards=S('g',{opacity:0});[['lose electrons','metals',170],['gain electrons','non-metals',400],['share electrons','non-metals',630]].forEach((c,i)=>{X.cards.append(R(c[2]-110,355,220,70,{rx:14,fill:'var(--paper)','stroke-width':2}),T(c[2],384,c[0],{'font-size':20,fill:'var(--accent)'}),T(c[2],410,c[1],{'font-size':15,fill:'var(--muted)'}))});s.append(X.cards);
  X.note=T(400,60,'',{'font-size':24,fill:'var(--accent)','font-family':'Fredoka,sans-serif'});s.append(X.note);return X},
 steps:[
  {k:'watch',run(X,ctx){X.cards.setAttribute('opacity',0);X.glow.setAttribute('opacity',0);X.atoms.forEach(a=>a.setAttribute('opacity',.3));X.atoms[1].setAttribute('opacity',1);ctx.after(900,()=>{X.glow.setAttribute('opacity',1);X.note.textContent='Noble gas: full outer shell = stable'});ctx.after(5200,()=>{X.atoms.forEach(a=>a.setAttribute('opacity',1));X.glow.setAttribute('opacity',0);X.note.textContent='Other atoms want a full outer shell too'})}},
  {k:'watch',run(X,ctx){X.atoms.forEach(a=>a.setAttribute('opacity',1));X.note.textContent='Three ways to get a full outer shell';X.cards.setAttribute('opacity',0);ctx.after(900,()=>X.cards.setAttribute('opacity',1))}},
  {k:'predict',q:'Sodium has configuration 2,8,1. How can it get a full outer shell most easily?',opts:['Lose 1 electron','Gain 7 electrons','Share 7 electrons','Gain 1 electron'],ans:0,why:'Losing its single outer electron leaves 2,8, a full shell, which is easier than gaining 7.',run(X){X.cards.setAttribute('opacity',0);X.note.textContent=''}},
  {k:'try',build(X,ctx){X.cards.setAttribute('opacity',1);X.note.textContent='';
   matchGame(ctx.panel,{help:'Does the atom lose, gain or share electrons?',items:[
    {label:'Potassium (2,8,8,1) bonding',to:'lose',hint:'Just 1 outer electron: easiest to lose it.'},{label:'Magnesium (2,8,2) bonding',to:'lose',hint:'Metals lose their outer electrons.'},
    {label:'Fluorine (2,7) reacting with a metal',to:'gain',hint:'Needs only 1 more electron to fill the shell.'},{label:'Oxygen (2,6) reacting with a metal',to:'gain',hint:'Needs 2 more electrons.'},
    {label:'Two chlorine atoms bonding together',to:'share',hint:'Two non-metals: they share.'},{label:'Carbon bonding with hydrogen',to:'share',hint:'Non-metals bonding with non-metals share electrons.'}],
    buckets:[{id:'lose',label:'Lose electrons'},{id:'gain',label:'Gain electrons'},{id:'share',label:'Share electrons'}],onDone:ctx.done})}},
  {k:'sum',take:'Atoms bond to get a full outer shell like a noble gas. Metals lose electrons. Non-metals gain or share electrons.',run(X){X.cards.setAttribute('opacity',1);X.atoms.forEach(a=>a.setAttribute('opacity',1));X.note.textContent=''}}],
 quiz:[Q('t','Why do the noble gases not form bonds easily?',['They already have a full outer shell','They have one outer electron','They are metals','They have no electrons'],0,'A full outer shell is stable, so there is no need to gain, lose or share.'),
  Q('t','What do metal atoms usually do when they bond?',['Lose electrons','Gain electrons','Share all their electrons','Lose protons'],0,'Metals lose their outer electrons to reach a full shell.'),
  N('How many electrons does a magnesium atom (2,8,2) lose to get a full outer shell?',2,'','It loses its 2 outer electrons, leaving 2,8.',0.1)]});

/* ===== 2.2 Ionic bonding ===== */
const IONM={Li:{n:'lithium',c:1},Na:{n:'sodium',c:1},K:{n:'potassium',c:1},Mg:{n:'magnesium',c:2},Ca:{n:'calcium',c:2}},IONX={F:{n:'fluoride',c:1},Cl:{n:'chloride',c:1},O:{n:'oxide',c:2}};
function ionFormula(m,x){const a=IONM[m].c,b=IONX[x].c;const g=(p,q)=>q?g(q,p%q):p,l=a*b/g(a,b);const nm=l/a,nx=l/b;return {nm,nx,f:m+(nm>1?sub(nm):'')+x+(nx>1?sub(nx):''),name:IONM[m].n+' '+IONX[x].n}}
SCENES.push({id:'2.2',act:'bond',title:'Ionic bonding',idea:'Electrons transfer; opposite charges attract',
 setup(ctx){
  const s=ctx.svg();const X={s};const gA=S('g'),gB=S('g'),fx=S('g');s.append(gA,gB,fx);
  X.atoms=()=>{gA.innerHTML='';gB.innerHTML='';gA.append(atomSVG(230,215,[2,8,1],{label:'Na',nuc:18,lf:15,r0:34,dr:26,er:7}),T(230,345,'sodium atom  2,8,1',{'font-size':18,fill:'var(--muted)'}));gB.append(atomSVG(570,215,[2,8,7],{label:'Cl',nuc:18,lf:15,r0:34,dr:26,er:7}),T(570,345,'chlorine atom  2,8,7',{'font-size':18,fill:'var(--muted)'}))};
  X.ions=(dx)=>{gA.innerHTML='';gB.innerHTML='';const d=dx||0;gA.append(atomSVG(230+d,215,[2,8],{label:'Na⁺',nuc:20,lf:15,r0:36,dr:26,er:7}),T(230+d,345,'Na⁺  2,8',{'font-size':20,fill:'var(--hot)'}),T(230+d,110,'+',{'font-size':54,fill:'var(--hot)','font-family':'Fredoka,sans-serif'}));
    gB.append(atomSVG(570-d,215,[2,8,8],{label:'Cl⁻',nuc:20,lf:15,r0:36,dr:26,er:7}),T(570-d,345,'Cl⁻  2,8,8',{'font-size':20,fill:'var(--cold)'}),T(570-d,100,'−',{'font-size':54,fill:'var(--cold)','font-family':'Fredoka,sans-serif'}))};
  X.note=T(400,44,'',{'font-size':22,fill:'var(--accent)','font-family':'Fredoka,sans-serif'});X.bond=T(400,400,'',{'font-size':20,fill:'var(--ink)'});s.append(X.note,X.bond);X.fx=fx;X.gA=gA;X.gB=gB;
  X.atoms();return X},
 steps:[
  {k:'watch',run(X,ctx){X.fx.innerHTML='';X.atoms();X.note.textContent='';X.bond.textContent='';const e=C(230,215-86,7,{fill:'var(--accent)',stroke:'var(--ink)','stroke-width':2});X.fx.append(e);
   ctx.after(800,()=>{X.note.textContent='Sodium gives away its outer electron'});
   ctx.after(1600,()=>tween(ctx,2.2,p=>{const q=ease(p);e.setAttribute('cx',230+(570-86-230)*q);e.setAttribute('cy',129+(215-129)*q)},()=>{X.fx.innerHTML='';X.ions(0);X.note.textContent='Now both have full outer shells'}))}},
  {k:'watch',run(X,ctx){X.fx.innerHTML='';X.ions(0);X.bond.textContent='';X.note.textContent='Na⁺ is a positive ion. Cl⁻ is a negative ion.';ctx.after(2500,()=>{tween(ctx,1.4,p=>X.ions(80*ease(p)),()=>{X.note.textContent='Opposite charges attract: the ionic bond';X.bond.textContent='sodium chloride, NaCl'})});
   ctx.after(9000,()=>{X.note.textContent='Mg loses 2 → Mg²⁺.   O gains 2 → O²⁻'})}},
  {k:'predict',q:'What is the charge on a magnesium ion?',opts:['2+','2−','1+','0'],ans:0,why:'Magnesium loses 2 electrons, so it has 2 more protons than electrons: 2+.',run(X){X.fx.innerHTML='';X.ions(80);X.note.textContent='';X.bond.textContent=''}},
  {k:'try',build(X,ctx){const h=ctx.panel;let m='Na',x='Cl';const seen=new Set();X.fx.innerHTML='';X.gA.innerHTML='';X.gB.innerHTML='';X.note.textContent='';X.bond.textContent='';
   const fb=H('div',{class:'fb info'},'Choose a metal and a non-metal, then press Make the compound.'),pg=H('p',{class:'hint'},'Compounds made: 0 of 3');
   h.append(H('b',null,'Metal'));pickRow(h,Object.keys(IONM).map(k=>({id:k,label:k})),id=>m=id,'Na');h.append(H('b',null,'Non-metal'));pickRow(h,Object.keys(IONX).map(k=>({id:k,label:k})),id=>x=id,'Cl');
   const go=H('button',{class:'btn small',onclick:()=>{const r=ionFormula(m,x);X.fx.innerHTML='';X.gA.innerHTML='';X.gB.innerHTML='';
     const tot=r.nm+r.nx,gap=Math.min(110,640/tot);let k=0;const cat=IONM[m].c,an=IONX[x].c;
     const draw=(n,col,ch,sym,off)=>{for(let i=0;i<n;i++){const cx=400+(off+i-(tot-1)/2)*gap,cy=200;X.fx.append(C(cx,cy,cat===2&&col==='var(--hot)'?44:34,{fill:col,opacity:.85,'stroke-width':2}),T(cx,cy+6,sym+sup(ch),{'font-size':20,fill:'#fff','font-family':'Fredoka,sans-serif'}))}};
     draw(r.nm,'var(--hot)',cat+'+',m,0);draw(r.nx,'var(--cold)',an+'−',x,r.nm);
     X.note.textContent=r.name;X.bond.textContent='formula: '+r.f;seen.add(m+x);
     fb.className='fb good';fb.innerHTML=`<b>${r.f}</b>: ${m} gives ${cat} electron${cat>1?'s':''}; each ${x} takes ${an}. Charges balance: ${r.nm}×(+${cat}) + ${r.nx}×(−${an}) = 0.`;pg.textContent='Compounds made: '+seen.size+' of 3';if(seen.size>=3)ctx.done()}},'Make the compound');
   h.append(go,fb,pg)}},
  {k:'sum',take:'Metals lose electrons to form positive ions. Non-metals gain electrons to form negative ions. Opposite charges attract: the ionic bond.',run(X){X.fx.innerHTML='';X.ions(80);X.note.textContent='';X.bond.textContent='sodium chloride, NaCl'}}],
 quiz:[Q('t','What is an ionic bond?',['Attraction between oppositely charged ions','A shared pair of electrons','A bond between two non-metal atoms','A bond between neutrons'],0,'Ionic bonds are the electrostatic attraction between positive and negative ions.'),
  Q('t','What happens to a chlorine atom when it forms a chloride ion?',['It gains an electron','It loses an electron','It gains a proton','It loses a neutron'],0,'Chlorine gains 1 electron to make Cl⁻ with a full outer shell.'),
  Q('t','What is the formula of magnesium oxide (Mg²⁺ and O²⁻)?',['MgO','MgO₂','Mg₂O','Mg₂O₂'],0,'One 2+ ion balances one 2− ion, so the formula is MgO.')]});

/* ===== 2.3 Properties of ionic compounds ===== */
SCENES.push({id:'2.3',act:'bond',title:'Ionic compounds: structure and properties',idea:'Giant lattice; conducts only when molten or dissolved',
 setup(ctx){
  const s=ctx.svg();const X={s,mode:'solid',ions:[],lit:false};
  const bx=230,by=220,bw=340,bh=170;
  X.water=R(bx+3,by+3,bw-6,bh-6,{fill:'#9ccbf2',stroke:'none',rx:6,opacity:0});s.append(X.water,Pth(`M${bx} ${by}V${by+bh}H${bx+bw}V${by}`,{'stroke-width':4}));
  X.wire=S('g');X.wire.append(Pth(`M${bx+70} ${by-20}V96H345`,{'stroke-width':3}),Pth(`M${bx+bw-70} ${by-20}V96H455`,{'stroke-width':3}),R(bx+60,by-60,20,100,{rx:3,fill:'var(--metal)'}),R(bx+bw-80,by-60,20,100,{rx:3,fill:'var(--metal)'}));s.append(X.wire);
  X.bulb=C(400,96,32,{fill:'var(--paper)','stroke-width':3});X.glow=C(400,96,46,{fill:'#ffe066',opacity:0,stroke:'none'});s.append(X.glow,X.bulb,L(386,116,414,116,{'stroke-width':4}));
  const cols=10,rows=4,gap=30,gx=bx+bw/2-(cols-1)*gap/2,gy=by+bh/2-(rows-1)*gap/2+10;
  for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){const pos=(r+c)%2===0;const x=gx+c*gap,y=gy+r*gap;const g=S('g');g.append(C(0,0,11,{fill:pos?'var(--hot)':'var(--cold)','stroke-width':1.5}),T(0,5,pos?'+':'−',{'font-size':15,fill:'#fff'}));g.setAttribute('transform',`translate(${x} ${y})`);s.append(g);X.ions.push({g,gx:x,gy:y,x,y,vx:rnd(-1,1),vy:rnd(-1,1)})}
  X.note=T(400,40,'',{'font-size':21,fill:'var(--accent)','font-family':'Fredoka,sans-serif'});X.lbl=T(400,430,'',{'font-size':19,fill:'var(--ink)'});s.append(X.note,X.lbl);
  X.setMode=m=>{X.mode=m;X.water.setAttribute('opacity',m==='dissolved'?.8:0);X.lit=m!=='solid';X.glow.setAttribute('opacity',X.lit?.9:0);X.bulb.setAttribute('fill',X.lit?'#ffe066':'var(--paper)')};
  ctx.bg.raf(dt=>{X.ions.forEach(o=>{if(X.mode==='solid'){o.x+=(o.gx-o.x)*Math.min(1,6*dt)+rnd(-.4,.4);o.y+=(o.gy-o.y)*Math.min(1,6*dt)+rnd(-.4,.4)}
     else{const sp=X.mode==='molten'?60:45;o.x+=o.vx*sp*dt;o.y+=o.vy*sp*dt;if(o.x<bx+14){o.x=bx+14;o.vx=Math.abs(o.vx)}if(o.x>bx+bw-14){o.x=bx+bw-14;o.vx=-Math.abs(o.vx)}if(o.y<by+14){o.y=by+14;o.vy=Math.abs(o.vy)}if(o.y>by+bh-14){o.y=by+bh-14;o.vy=-Math.abs(o.vy)}if(Math.random()<.02){o.vx=rnd(-1,1);o.vy=rnd(-1,1)}}
     o.g.setAttribute('transform',`translate(${o.x} ${o.y})`)})});
  X.setMode('solid');return X},
 steps:[
  {k:'watch',run(X,ctx){X.setMode('solid');X.note.textContent='A giant ionic lattice';X.lbl.textContent='';ctx.after(2500,()=>X.lbl.textContent='Strong attraction in every direction');ctx.after(6200,()=>X.lbl.textContent='So: very high melting point (sodium chloride melts at 801 °C)')}},
  {k:'watch',run(X,ctx){X.setMode('solid');X.note.textContent='Solid: ions stuck in place. Bulb off.';X.lbl.textContent='';ctx.after(3000,()=>{X.setMode('molten');X.note.textContent='Molten: ions free to move. Bulb on!'});ctx.after(7000,()=>{X.setMode('dissolved');X.note.textContent='Dissolved in water: ions free. Bulb on!'})}},
  {k:'predict',q:'Does solid sodium chloride conduct electricity?',opts:['No: the ions cannot move','Yes: it has free electrons','Yes: it contains ions','Only when slightly warm'],ans:0,why:'In the solid the ions are locked in the lattice. There are no free ions and no free electrons to carry current.',run(X){X.setMode('solid');X.note.textContent='';X.lbl.textContent=''}},
  {k:'try',build(X,ctx){const h=ctx.panel;const tested=new Set();X.setMode('solid');X.note.textContent='Pick a state, then press Test';X.lbl.textContent='';let st='solid';
   const fb=H('div',{class:'fb info'},'Test each of the three states.'),pg=H('p',{class:'hint'},'Tested 0 of 3');
   pickRow(h,[{id:'solid',label:'Solid'},{id:'molten',label:'Molten (melted)'},{id:'dissolved',label:'Dissolved in water'}],id=>{st=id;X.setMode(id);X.note.textContent='';},'solid');
   const go=H('button',{class:'btn small',onclick:()=>{X.setMode(st);tested.add(st);const on=st!=='solid';fb.className='fb '+(on?'good':'bad');
     fb.textContent=on?(st==='molten'?'The bulb lights: melting freed the ions to carry charge.':'The bulb lights: the ions are free to move in the solution.'):'The bulb stays off: the ions are fixed in the lattice.';X.note.textContent=on?'Conducts':'Does not conduct';pg.textContent='Tested '+tested.size+' of 3';if(tested.size>=3)ctx.done()}},'Test it');
   h.append(go,fb,pg)}},
  {k:'sum',take:'Ionic compounds have a giant lattice, high melting points, and conduct only when molten or dissolved, because then the ions can move.',run(X){X.setMode('solid');X.note.textContent='';X.lbl.textContent=''}}],
 quiz:[Q('t','Why do ionic compounds have high melting points?',['Strong attraction between oppositely charged ions','Weak forces between molecules','They contain free electrons','They are made of atoms sharing electrons'],0,'Lots of energy is needed to overcome the strong electrostatic forces in the lattice.'),
  Q('t','Why does molten sodium chloride conduct electricity?',['Its ions are free to move','Its electrons are free to move','It contains molecules','It is a metal'],0,'Melting frees the ions, and moving ions carry the charge.'),
  Q('t','Does solid sodium chloride conduct electricity?',['No','Yes','Only if it is pure','Only if it is hot'],0,'Solid ionic compounds do not conduct: the ions cannot move.')]});
