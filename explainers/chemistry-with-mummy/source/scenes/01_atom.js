/* ===== 1.1 Inside the atom ===== */
SCENES.push({id:'1.1',act:'atom',title:'Inside the atom',idea:'Protons, neutrons and electrons',
 setup(ctx){
  const s=ctx.svg(),holder=S('g');s.append(holder);const X={s,atom:null,rows:[]};
  X.draw=(p,n,e)=>{holder.innerHTML='';X.atom=atomSVG(570,225,shellsFor(e),{p,n,s:1.9,r0:62,dr:38,er:9});holder.append(X.atom)};
  spinAtom(ctx,()=>X.atom,16);
  const defs=[['proton','in the nucleus','var(--hot)','+1','1'],['neutron','in the nucleus','var(--metal)','0','1'],['electron','in the shells','var(--cold)','−1','tiny']];
  X.hdrC=T(290,64,'charge',{'font-size':16,fill:'var(--muted)'});X.hdrM=T(366,64,'mass',{'font-size':16,fill:'var(--muted)','text-anchor':'end'});X.hdr={set textContent(v){X.hdrC.setAttribute('opacity',v?1:0);X.hdrM.setAttribute('opacity',v?1:0)}};
  defs.forEach((d,i)=>{const y=80+i*96,g=S('g');g.append(R(20,y,370,80,{rx:14,'stroke-width':2}),C(62,y+40,14,{fill:d[2]}),T(94,y+36,d[0],{'text-anchor':'start','font-size':24}),T(94,y+60,d[1],{'text-anchor':'start','font-size':16,fill:'var(--muted)','font-weight':600}));
    const ch=T(290,y+48,d[3],{'font-size':34,fill:i===0?'var(--hot)':i===2?'var(--cold)':'var(--muted)','font-family':'Fredoka,sans-serif'}),ms=T(366,y+48,d[4],{'text-anchor':'end','font-size':26,'font-family':'Fredoka,sans-serif'});
    g.append(ch,ms);s.append(g);X.rows.push({g,ch,ms})});
  X.note=T(570,420,'',{'font-size':20,fill:'var(--accent)'});s.append(X.hdrC,X.hdrM,X.note);
  X.reset=()=>{X.rows.forEach(r=>{r.g.setAttribute('opacity',0);r.ch.setAttribute('opacity',0);r.ms.setAttribute('opacity',0)});X.hdr.textContent='';X.note.textContent=''};
  X.draw(3,4,3);return X},
 steps:[
  {k:'watch',run(X,ctx){X.reset();X.draw(3,4,3);X.rows.forEach((r,i)=>ctx.after(900+i*2300,()=>r.g.setAttribute('opacity',1)));ctx.after(1000,()=>X.note.textContent='A lithium atom');ctx.after(8200,()=>X.note.textContent='3 protons, 4 neutrons, 3 electrons')}},
  {k:'watch',run(X,ctx){X.rows.forEach(r=>r.g.setAttribute('opacity',1));X.rows.forEach(r=>{r.ch.setAttribute('opacity',0);r.ms.setAttribute('opacity',0)});X.hdr.textContent='on';
   X.rows.forEach((r,i)=>ctx.after(1200+i*2400,()=>{r.ch.setAttribute('opacity',1);r.ms.setAttribute('opacity',1)}));ctx.after(9000,()=>X.note.textContent='Neutral atom: protons = electrons')}},
  {k:'predict',q:'A neutral atom has 6 protons. How many electrons does it have?',opts:['6','12','0','3'],ans:0,why:'Neutral means the charges cancel: 6 protons (+6) need 6 electrons (−6).',run(X){X.reset();X.rows.forEach(r=>{r.g.setAttribute('opacity',1);r.ch.setAttribute('opacity',1);r.ms.setAttribute('opacity',1)});X.draw(6,6,6);X.note.textContent='6 protons, 6 electrons: neutral'}},
  {k:'try',build(X,ctx){const h=ctx.panel;let done=false;
   const pr=stepper('Protons',1,10,3,()=>upd()),ne=stepper('Neutrons',0,12,4,()=>upd()),el=stepper('Electrons',0,12,3,()=>upd());
   const info=H('div',{class:'fb info'}),goal=H('p',{class:'hint'},'Challenge: build a neutral atom of carbon (6 protons).');
   function upd(){const p=pr.get(),n=ne.get(),e=el.get();X.draw(p,n,e);const c=p-e;
     info.className='fb info';info.innerHTML=`<b>${EL[p-1].name}</b>: charge ${c===0?'neutral':(c>0?'+':'−')+Math.abs(c)}`+(c===0?'':' (an ion, not a neutral atom)');X.note.textContent=EL[p-1].name+', mass number '+(p+n);
     if(p===6&&e===6&&!done){done=true;info.className='fb good';info.innerHTML='<b>Carbon</b>: 6 protons and 6 electrons. Neutral!';ctx.done()}}
   h.append(goal,pr.el,ne.el,el.el,info);X.rows.forEach(r=>{r.g.setAttribute('opacity',.35)});upd()}},
  {k:'sum',take:'Protons (+1) and neutrons (0) are in the nucleus. Electrons (−1) are in shells. A neutral atom has equal protons and electrons.',run(X){X.rows.forEach(r=>{r.g.setAttribute('opacity',1);r.ch.setAttribute('opacity',1);r.ms.setAttribute('opacity',1)});X.draw(3,4,3);X.note.textContent=''}}],
 quiz:[Q('t','Which particle has a negative charge?',['Electron','Proton','Neutron','Nucleus'],0,'Electrons are −1. Protons are +1 and neutrons have no charge.'),
  Q('t','Where are the protons and neutrons found?',['In the nucleus','In the electron shells','Outside the atom','Between the electrons'],0,'Protons and neutrons make up the nucleus.'),
  N('A neutral atom has 11 protons. How many electrons does it have?',11,'','Neutral: electrons = protons = 11.',0.1)]});

/* ===== 1.2 Atomic number and mass number ===== */
SCENES.push({id:'1.2',act:'atom',title:'Atomic number and mass number',idea:'Neutrons = mass number − atomic number',
 setup(ctx){
  const s=ctx.svg();const X={s};
  const g=S('g');const A=T(110,120,'23',{'font-size':64,'font-family':'Fredoka,sans-serif','text-anchor':'middle',fill:'var(--hot)'}),Z=T(110,236,'11',{'font-size':64,'font-family':'Fredoka,sans-serif',fill:'var(--cold)'}),Y=T(220,205,'Na',{'font-size':130,'font-family':'Fredoka,sans-serif','text-anchor':'start'});
  const la=T(30,60,'mass number',{'font-size':18,fill:'var(--hot)','text-anchor':'start'}),lz=T(30,282,'atomic number',{'font-size':18,fill:'var(--cold)','text-anchor':'start'});
  const bar=S('g',{transform:'translate(30 340)'});const bp=R(0,0,0,40,{fill:'var(--hot)',rx:6}),bn=R(0,0,0,40,{fill:'var(--metal)',rx:6});const tp=T(0,30,'',{'font-size':18,fill:'#fff'}),tn=T(0,30,'',{'font-size':18,fill:'#fff'});bar.append(bp,bn,tp,tn);
  const cap=T(400,430,'',{'font-size':20,fill:'var(--accent)'});
  const e1=T(440,120,'',{'text-anchor':'start','font-size':22}),e2=T(440,170,'',{'text-anchor':'start','font-size':22}),e3=T(440,220,'',{'text-anchor':'start','font-size':22});
  s.append(la,lz,A,Z,Y,bar,cap,e1,e2,e3);
  X.set=(sym,hide)=>{const e=elBy(sym);X.e=e;A.textContent=hide==='a'?'?':e.a;Z.textContent=hide==='z'?'?':e.z;Y.textContent=e.sym;
    const W=740;bp.setAttribute('width',e.z/e.a*W);bn.setAttribute('x',e.z/e.a*W);bn.setAttribute('width',(e.a-e.z)/e.a*W);tp.setAttribute('x',e.z/e.a*W/2);tp.textContent=e.z+' protons';tn.setAttribute('x',e.z/e.a*W+(e.a-e.z)/e.a*W/2);tn.textContent=(e.a-e.z)>3?(e.a-e.z)+' neutrons':'';};
  X.txt=(a,b,c)=>{e1.textContent=a||'';e2.textContent=b||'';e3.textContent=c||''};X.cap=cap;X.bar=bar;bar.setAttribute('opacity',0);
  X.set('Na');return X},
 steps:[
  {k:'watch',run(X,ctx){X.set('Na');X.bar.setAttribute('opacity',0);X.cap.textContent='';X.txt('','','');ctx.after(1200,()=>X.txt('Mass number = protons + neutrons'));ctx.after(4800,()=>X.txt('Mass number = protons + neutrons','Atomic number = protons'))}},
  {k:'watch',run(X,ctx){X.set('Na');X.txt('Protons = atomic number = 11','Neutrons = 23 − 11 = 12','Electrons = 11 (neutral atom)');X.bar.setAttribute('opacity',0);ctx.after(1000,()=>X.bar.setAttribute('opacity',1));X.cap.textContent='sodium: 11 + 12 = 23'}},
  {k:'predict',q:'Chlorine has mass number 35 and atomic number 17. How many neutrons?',opts:['17','18','35','52'],ans:1,why:'Neutrons = mass number − atomic number = 35 − 17 = 18.',run(X){X.set('Cl');X.bar.setAttribute('opacity',0);X.txt('','','');X.cap.textContent=''}},
  {k:'try',build(X,ctx){const h=ctx.panel;const pool=['Li','C','O','Mg','Cl','K','Ca','Al','Na'];let ok=0;
   const mk=()=>{const sym=pool[Math.floor(Math.random()*pool.length)];X.set(sym);X.bar.setAttribute('opacity',0);X.txt('','','');X.cap.textContent='';return elBy(sym)};
   let e=mk();const inP=H('input',{type:'text',inputmode:'numeric',id:'ip'}),inN=H('input',{type:'text',inputmode:'numeric',id:'in'}),inE=H('input',{type:'text',inputmode:'numeric',id:'ie'});
   const fb=H('div',{class:'fb info'},'Fill in all three, then Check.'),prog=H('p',{class:'hint'},'Correct rounds: 0 of 3');
   const chk=H('button',{class:'btn small',onclick:()=>{const p=+inP.value,n=+inN.value,el=+inE.value;const good=p===e.z&&n===e.a-e.z&&el===e.z;
     if(good){ok++;fb.className='fb good';fb.textContent='Correct! '+e.sym+': '+e.z+' protons, '+(e.a-e.z)+' neutrons, '+e.z+' electrons.';cheer(true);prog.textContent='Correct rounds: '+ok+' of 3';X.set(e.sym);X.bar.setAttribute('opacity',1);
       if(ok>=3)ctx.done();else{nx.disabled=false;chk.disabled=true}}
     else{fb.className='fb bad';fb.textContent='Not quite. Protons = atomic number ('+e.z+'). Neutrons = mass number − atomic number. Electrons = protons.';cheer(false)}}},'Check');
   const nx=H('button',{class:'btn small ghost',onclick:()=>{e=mk();inP.value=inN.value=inE.value='';fb.className='fb info';fb.textContent='Fill in all three, then Check.';nx.disabled=true;chk.disabled=false}},'Next element');nx.disabled=true;
   h.append(H('p',{class:'hint'},'Work out the particles in a neutral atom of the element shown.'),H('div',{class:'row'},H('div',{class:'field',style:'flex:1'},H('label',{for:'ip'},'Protons'),inP),H('div',{class:'field',style:'flex:1'},H('label',{for:'in'},'Neutrons'),inN),H('div',{class:'field',style:'flex:1'},H('label',{for:'ie'},'Electrons'),inE)),H('div',{class:'row'},chk,nx),fb,prog)}},
  {k:'sum',take:'Atomic number = protons. Mass number = protons + neutrons. Neutrons = mass number − atomic number. Electrons = protons.',run(X){X.set('Na');X.bar.setAttribute('opacity',1);X.txt('Protons = atomic number','Neutrons = mass number − atomic number','Electrons = protons (neutral atom)')}}],
 quiz:[N('Magnesium has mass number 24 and atomic number 12. How many neutrons?',12,'','24 − 12 = 12.',0.1),N('How many electrons are in a neutral potassium atom (atomic number 19)?',19,'','Electrons = protons = 19.',0.1),
  Q('t','The atomic number of an atom is the number of…',['protons','neutrons','protons + neutrons','shells'],0,'The atomic number is the number of protons.')]});

/* ===== 1.3 Electron shells ===== */
SCENES.push({id:'1.3',act:'atom',title:'Electrons in shells',idea:'Shells fill 2, 8, 8',
 setup(ctx){
  const s=ctx.svg(),holder=S('g');s.append(holder);const X={s,atom:null,z:11};
  const name=T(60,90,'',{'text-anchor':'start','font-size':44,'font-family':'Fredoka,sans-serif'}),conf=T(60,160,'',{'text-anchor':'start','font-size':34,'font-family':'Fredoka,sans-serif',fill:'var(--accent)'}),l1=T(60,210,'',{'text-anchor':'start','font-size':20,fill:'var(--muted)'}),l2=T(60,244,'',{'text-anchor':'start','font-size':20,fill:'var(--muted)'}),rule=T(60,330,'',{'text-anchor':'start','font-size':20,fill:'var(--hot)'}),rule2=T(60,362,'',{'text-anchor':'start','font-size':20,fill:'var(--hot)'}),rule3=T(60,394,'',{'text-anchor':'start','font-size':20,fill:'var(--hot)'});
  s.append(name,conf,l1,l2,rule,rule2,rule3);X.rules=[rule,rule2,rule3];
  X.set=z=>{X.z=z;holder.innerHTML='';const sh=shellsFor(z);X.atom=atomSVG(570,225,sh,{label:String(z),nuc:18,er:7,r0:40,dr:30});holder.append(X.atom);
    const e=EL[z-1];name.textContent=e.name+' ('+e.sym+')';conf.textContent='configuration '+cfgStr(z);l1.textContent=z+' electrons in '+sh.length+(sh.length===1?' shell':' shells');l2.textContent=sh[sh.length-1]+' outer '+(sh[sh.length-1]===1?'electron':'electrons')};
  spinAtom(ctx,()=>X.atom,12);X.set(11);return X},
 steps:[
  {k:'watch',run(X,ctx){X.rules.forEach(r=>r.textContent='');let z=0;const iv=ctx.every(650,()=>{z++;X.set(z);if(z>=11){clearInterval(iv.iv)}});X.set(1)}},
  {k:'watch',run(X,ctx){X.set(18);X.rules[0].textContent='Shell 1 holds up to 2';X.rules[1].textContent='Shell 2 holds up to 8';X.rules[2].textContent='Shell 3 holds 8 (up to calcium)';X.rules.forEach((r,i)=>{r.setAttribute('opacity',0);ctx.after(600+i*1800,()=>r.setAttribute('opacity',1))})}},
  {k:'predict',q:'What is the electronic configuration of magnesium (12 electrons)?',opts:['2,8,2','2,10','2,8,1','8,4'],ans:0,why:'2 in the first shell, 8 in the second, and the last 2 go in the third: 2,8,2.',run(X){X.rules.forEach(r=>r.textContent='');X.set(12)}},
  {k:'try',build(X,ctx){const h=ctx.panel;
   const goals=[{t:'Find the atom with configuration 2,8,3',f:z=>cfgStr(z)==='2,8,3'},{t:'Find the atom with 3 shells and 7 outer electrons',f:z=>shellsFor(z).length===3&&shellsFor(z)[2]===7},{t:'Find an atom with 2 shells and a full outer shell',f:z=>shellsFor(z).length===2&&shellsFor(z)[1]===8}];
   let gi=0;const goal=H('div',{class:'fb info'},goals[0].t),fb=H('div');
   const sl=sliderRow('Atomic number',1,20,11,1,z=>{X.set(z);if(goals[gi]&&goals[gi].f(z)){fb.className='fb good';fb.textContent='Yes! '+EL[z-1].name+' ('+cfgStr(z)+').';cheer(true);gi++;if(gi>=goals.length){goal.textContent='All three found!';ctx.done()}else goal.textContent=goals[gi].t}});
   h.append(H('p',{class:'hint'},'Move the slider to add electrons.'),goal,sl.el,fb)}},
  {k:'sum',take:'Shells fill 2, 8, 8. Sodium is 2,8,1. The last number is the number of outer electrons.',run(X){X.set(11)}}],
 quiz:[Q('t','What is the electronic configuration of sodium?',['2,8,1','2,9','2,8,2','8,3'],0,'Sodium has 11 electrons: 2, then 8, then 1.'),N('How many outer electrons does a chlorine atom (2,8,7) have?',7,'','The last number, 7, is the outer shell.',0.1),
  Q('t','How many electron shells does calcium (2,8,8,2) have?',['4','2','3','5'],0,'Four numbers in the configuration means four shells.')]});
