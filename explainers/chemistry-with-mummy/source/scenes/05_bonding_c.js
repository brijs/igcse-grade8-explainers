/* ===== 2.6 Giant covalent structures ===== */
const GC={diamond:{n:'Diamond (carbon)',hard:'Very hard: the hardest natural substance.',cond:'Does not conduct: all 4 outer electrons are used in bonds.',mp:'Very high: over 3500 °C.'},
 graphite:{n:'Graphite (carbon)',hard:'Soft and slippery: the layers slide over each other.',cond:'Conducts: each carbon has a free (delocalised) electron.',mp:'Very high: over 3500 °C.'},
 sio2:{n:'Silicon dioxide (sand)',hard:'Very hard, like quartz and sand grains.',cond:'Does not conduct: no free electrons or ions.',mp:'Very high: 1710 °C.'}};
SCENES.push({id:'2.6',act:'bond',title:'Giant covalent structures',idea:'Diamond, graphite and silicon dioxide',
 setup(ctx){
  const s=ctx.svg();const X={s,mat:null,e:[],slide:0};const g=S('g');s.append(g);X.g=g;
  X.cards=[0,1,2].map(i=>{const gg=S('g');gg.append(R(500,100+i*100,270,86,{rx:12,fill:'var(--paper)','stroke-width':2}),T(512,126+i*100,['Hardness','Conductivity','Melting point'][i],{'text-anchor':'start','font-size':15,fill:'var(--muted)'}));const t=S('foreignObject',{x:508,y:132+i*100,width:256,height:52});gg.append(t);s.append(gg);return {gg,t}});
  X.name=T(250,44,'',{'font-size':24,'font-family':'Fredoka,sans-serif',fill:'var(--accent)'});X.note=T(250,418,'',{'font-size':18,fill:'var(--muted)'});s.append(X.name,X.note);
  X.setCard=(i,txt,good)=>{X.cards[i].t.innerHTML=txt?`<div xmlns="http://www.w3.org/1999/xhtml" style="font:700 15px Nunito,system-ui,sans-serif;color:${good?'var(--ink)':'var(--ink)'};line-height:1.25">${txt}</div>`:''};
  X.clearCards=()=>[0,1,2].forEach(i=>X.setCard(i,''));
  X.draw=m=>{X.mat=m;g.innerHTML='';X.e=[];X.slide=0;X.name.textContent=GC[m].n;
    if(m==='diamond'||m==='sio2'){const x0=70,y0=90,dx=62,dy=56;const pts=[];for(let r=0;r<6;r++)for(let c=0;c<7;c++)if((r+c)%2===0)pts.push([r,c,x0+c*dx,y0+r*dy]);
      const at=(r,c)=>pts.find(p=>p[0]===r&&p[1]===c);const hl=at(2,2);const hot=[];
      pts.forEach(p=>[[1,1],[1,-1]].forEach(d=>{const q=at(p[0]+d[0],p[1]+d[1]);if(q){const isHl=(p===hl||q===hl);g.append(L(p[2],p[3],q[2],q[3],{'stroke-width':isHl?5:3,stroke:isHl?'var(--hot)':'var(--muted)'}));if(m==='sio2')g.append(C((p[2]+q[2])/2,(p[3]+q[3])/2,9,{fill:'#ef6a5a','stroke-width':1.5}))}}));
      pts.forEach(p=>g.append(C(p[2],p[3],m==='sio2'?15:13,{fill:m==='sio2'?'#8a93a3':'#4b5563','stroke-width':2})));
      if(m==='sio2')g.append(T(250,392,'silicon (large) and oxygen (small)',{'font-size':16,fill:'var(--muted)'}))}
    else{const lay=S('g'),mid=S('g'),low=S('g');X.layers=[lay,mid,low];[0,1,2].forEach(i=>{const grp=X.layers[i];for(let k=0;k<9;k++){const x=70+k*42,y=120+i*100+(k%2?14:0);if(k<8){const x2=70+(k+1)*42,y2=120+i*100+((k+1)%2?14:0);grp.append(L(x,y,x2,y2,{'stroke-width':3,stroke:'var(--muted)'}))}grp.append(C(x,y,11,{fill:'#4b5563','stroke-width':2}))}g.append(grp)});
      [0,1].forEach(i=>g.append(L(80,172+i*100,420,172+i*100,{'stroke-dasharray':'3 8','stroke-width':2,stroke:'var(--muted)',opacity:.7})));
      for(let i=0;i<10;i++){const o=C(100+i*34,rnd(150,194)+Math.floor(i/5)*100,4.2,{fill:'var(--cold)','stroke-width':1});g.append(o);X.e.push({o,x:100+i*34,y:o.getAttribute('cy')*1,vx:rnd(25,55)})}
      X.eLabel=T(250,92,'',{'font-size':16,fill:'var(--cold)'});g.append(X.eLabel)}};
  ctx.bg.raf(dt=>{if(X.mat==='graphite'){X.e.forEach(o=>{o.x+=o.vx*dt*(X.flow?1:.25);if(o.x>430)o.x=70;o.o.setAttribute('cx',o.x)});}});
  X.slideTop=on=>{if(X.layers)X.layers[0].setAttribute('transform',on?'translate(46 0)':'translate(0 0)');X.layers&&(X.layers[0].style.transition='transform 1.2s')};
  X.draw('diamond');return X},
 steps:[
  {k:'watch',run(X,ctx){X.clearCards();X.draw('diamond');X.note.textContent='';ctx.after(1200,()=>X.note.textContent='Each carbon atom: 4 strong covalent bonds');ctx.after(5200,()=>X.note.textContent='One giant structure: very hard, very high melting point, no free electrons')}},
  {k:'watch',run(X,ctx){X.clearCards();X.draw('graphite');X.flow=false;X.note.textContent='Graphite: carbon in layers';ctx.after(2500,()=>{X.note.textContent='Weak forces between layers: they slide';X.slideTop(true)});ctx.after(6500,()=>{X.slideTop(false);X.flow=true;X.eLabel.textContent='free electrons carry current';X.note.textContent='Each carbon has one spare, free electron'})}},
  {k:'predict',q:'Why can graphite conduct electricity?',opts:['Each carbon atom has a free (delocalised) electron','It contains positive and negative ions','It is a metal','Its layers are very strong'],ans:0,why:'Each carbon is bonded to only 3 others, so one electron is free to move along the layers.',run(X){X.clearCards();X.draw('graphite');X.flow=true;X.note.textContent=''}},
  {k:'try',build(X,ctx){const h=ctx.panel;let m='diamond';const done=new Set();X.clearCards();X.draw('diamond');X.flow=false;
   const fb=H('div',{class:'fb info'},'Choose a material, then run each test.'),pg=H('p',{class:'hint'},'Tests done: 0 of 6 needed');
   pickRow(h,[{id:'diamond',label:'Diamond'},{id:'graphite',label:'Graphite'},{id:'sio2',label:'Silicon dioxide'}],id=>{m=id;X.clearCards();X.draw(m);X.flow=m==='graphite'},'diamond');
   const run=(k,i,label)=>H('button',{class:'btn small ghost',onclick:()=>{X.setCard(i,GC[m][k]);done.add(m+k);if(k==='hard'&&m==='graphite')X.slideTop(true);if(k==='cond')X.flow=true;fb.className='fb good';fb.textContent=GC[m].n+': '+GC[m][k];pg.textContent='Tests done: '+Math.min(6,done.size)+' of 6 needed';if(done.size>=6)ctx.done()}},label);
   h.append(H('div',{class:'row'},run('hard',0,'Hit it'),run('cond',1,'Test conductivity'),run('mp',2,'Heat it')),fb,pg)}},
  {k:'sum',take:'Giant covalent structures have millions of strong covalent bonds. Diamond is very hard. Graphite has slippery layers and conducts. All have very high melting points.',run(X){X.clearCards();X.draw('diamond');X.note.textContent=''}}],
 quiz:[Q('t','Why is diamond so hard?',['Each carbon has four strong covalent bonds in a giant structure','It contains ions','It has weak forces between layers','It has free electrons'],0,'Millions of strong covalent bonds hold the atoms rigidly in place.'),
  Q('t','Why does graphite conduct electricity?',['Each carbon has a free (delocalised) electron','It has ions that can move','It is very hard','It has four bonds per atom'],0,'Each carbon uses only 3 outer electrons for bonds, leaving one free to move.'),
  Q('t','What type of structure does silicon dioxide have?',['Giant covalent','Simple molecular','Ionic lattice','Single atoms'],0,'Silicon dioxide is a giant covalent structure, so it is hard with a high melting point.')]});

/* ===== 2.7 Which structure is it? ===== */
SCENES.push({id:'2.7',act:'bond',title:'Which structure is it?',idea:'Use properties to decide: ionic, simple molecular or giant covalent',
 setup(ctx){
  const s=ctx.svg();const X={s};const tb=S('g'),fl=S('g');s.append(tb,fl);X.tb=tb;X.fl=fl;
  const cols=[['Ionic','var(--hot)',305],['Simple molecular','var(--cold)',500],['Giant covalent','var(--gold)',695]];
  cols.forEach(c=>tb.append(R(c[2]-92,36,184,44,{rx:12,fill:c[1],stroke:'none'}),T(c[2],65,c[0],{'font-size':18,fill:c[1]==='var(--gold)'?'#2a1d00':'#fff','font-family':'Fredoka,sans-serif'})));
  const rows=[['Particles',['ions','molecules','atoms in a network']],['Bonding',['ionic (strong)','weak between molecules','strong covalent']],['Melting point',['high','low','very high']],['Conducts when solid?',['no','no','no (graphite: yes)']],['Conducts when molten?',['yes','no','no']]];
  X.rows=rows.map((r,i)=>{const g=S('g');g.append(T(32,132+i*62,r[0],{'text-anchor':'start','font-size':16,fill:'var(--muted)'}),L(24,150+i*62,775,150+i*62,{stroke:'var(--line)','stroke-width':2}));r[1].forEach((v,k)=>g.append(T(cols[k][2],132+i*62,v,{'font-size':15})));tb.append(g);return g});
  const bx=(x,y,w,h,t,col)=>{fl.append(R(x-w/2,y-h/2,w,h,{rx:14,fill:col||'var(--paper)','stroke-width':2.5}),T(x,y+6,t,{'font-size':17,fill:col?'#fff':'var(--ink)'}))};
  bx(400,70,260,56,'High melting point?');bx(190,250,200,56,'Simple molecular','var(--cold)');bx(610,190,300,56,'Conducts when molten or dissolved?');bx(480,350,150,56,'Ionic','var(--hot)');bx(700,350,170,56,'Giant covalent','var(--gold)');
  [['M270 70H190V222','NO',215,120],['M530 70H610V162','YES',620,110],['M570 218V250H480V322','YES',520,244],['M650 218V250H700V322','NO',690,244]].forEach(a=>fl.append(Pth(a[0],{'stroke-width':3,stroke:'var(--muted)'}),T(a[2],a[3],a[1],{'font-size':14,fill:'var(--accent)'})));
  fl.append(T(400,420,'Exception: graphite conducts when solid',{'font-size':15,fill:'var(--muted)'}));
  X.show=m=>{tb.setAttribute('opacity',m==='tb'?1:0);fl.setAttribute('opacity',m==='fl'?1:0)};X.show('tb');return X},
 steps:[
  {k:'watch',run(X,ctx){X.show('tb');X.rows.forEach((r,i)=>{r.setAttribute('opacity',0);ctx.after(700+i*1500,()=>r.setAttribute('opacity',1))})}},
  {k:'watch',run(X,ctx){X.show('fl');X.fl.querySelectorAll('*');}},
  {k:'predict',q:'A substance melts at −90 °C and does not conduct electricity. What is it most likely to be?',opts:['Simple molecular','Ionic','Giant covalent','A metal'],ans:0,why:'A very low melting point means weak forces between molecules.',run(X){X.show('tb');X.rows.forEach(r=>r.setAttribute('opacity',1))}},
  {k:'try',build(X,ctx){const h=ctx.panel;X.show('fl');
   const subs=[{d:'Melts at 801 °C. Does not conduct when solid, but conducts when molten.',a:0,why:'High melting point and conducts only when molten: ionic.'},
    {d:'Melts at −7 °C, so it is a liquid at room temperature. Does not conduct.',a:1,why:'Low melting point and no conduction: simple molecular.'},
    {d:'Melts at 1710 °C and is very hard. Does not conduct, even when molten.',a:2,why:'Very high melting point, no ions or free electrons: giant covalent.'},
    {d:'Soft and grey-black. Melts above 3500 °C. Conducts when solid.',a:2,why:'Graphite is the exception: giant covalent, with free electrons.'}];
   let i=0;const host=H('div');h.append(host);
   const step=()=>{if(i>=subs.length){host.innerHTML='';host.append(H('div',{class:'fb good'},'All four identified!'));ctx.done();return}
     const sb=subs[i];const box=H('div');host.innerHTML='';host.append(H('p',{class:'hint'},'Substance '+(i+1)+' of '+subs.length),H('div',{class:'fb info'},sb.d),box);
     ask({q:'What structure does it have?',o:['Ionic','Simple molecular','Giant covalent'],a:sb.a,why:sb.why},box,()=>{box.append(H('button',{class:'btn small',onclick:()=>{i++;step()}},i>=subs.length-1?'Finish':'Next substance'))})};step()}},
  {k:'sum',take:'Ionic: high melting point, conducts when molten. Simple molecular: low melting point, never conducts. Giant covalent: very high melting point, usually does not conduct.',run(X){X.show('tb');X.rows.forEach(r=>r.setAttribute('opacity',1))}}],
 quiz:[Q('t','A solid has a high melting point and conducts when molten but not when solid. It is…',['ionic','simple molecular','giant covalent','a noble gas'],0,'Conducting only when molten is the sign of an ionic compound.'),
  Q('t','A liquid at room temperature does not conduct electricity. It is most likely…',['simple molecular','ionic','giant covalent','a metal'],0,'Low melting points mean weak forces between molecules.'),
  Q('t','Why does silicon dioxide have a very high melting point?',['Many strong covalent bonds must be broken','Weak forces between molecules','Ions are free to move','It has free electrons'],0,'It is a giant network held together by strong covalent bonds.')]});
