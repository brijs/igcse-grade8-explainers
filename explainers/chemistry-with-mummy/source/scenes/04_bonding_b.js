/* ===== 2.4 Covalent bonding ===== */
const MOLCOL={H:'#ffffff',C:'#8a93a3',O:'#ef6a5a',N:'#6b94f0',Cl:'#7bc96f'};
const MOLS={
 H2:{name:'hydrogen',f:'H₂',a:[['H',-45,0],['H',45,0]],b:[[0,1,1]],lone:[0,0],why:'Each H shares 1 pair, so each has 2 electrons: a full first shell.'},
 Cl2:{name:'chlorine',f:'Cl₂',a:[['Cl',-55,0],['Cl',55,0]],b:[[0,1,1]],lone:[3,3],why:'Each Cl has 7 outer electrons and shares 1 pair, making 8. The dots on the outside are pairs not used for bonding.'},
 HCl:{name:'hydrogen chloride',f:'HCl',a:[['H',-60,0],['Cl',50,0]],b:[[0,1,1]],lone:[0,3],why:'H gets 2 electrons and Cl gets 8, so both have full shells.'},
 H2O:{name:'water',f:'H₂O',a:[['O',0,-15],['H',-62,42],['H',62,42]],b:[[0,1,1],[0,2,1]],lone:[2,0,0],why:'Oxygen has 6 outer electrons and shares 2 pairs, so it gets 8. Each H gets 2.'},
 NH3:{name:'ammonia',f:'NH₃',a:[['N',0,-24],['H',-68,34],['H',68,34],['H',0,62]],b:[[0,1,1],[0,2,1],[0,3,1]],lone:[1,0,0,0],why:'Nitrogen has 5 outer electrons and shares 3 pairs, so it gets 8.'},
 CH4:{name:'methane',f:'CH₄',a:[['C',0,0],['H',0,-70],['H',0,70],['H',-70,0],['H',70,0]],b:[[0,1,1],[0,2,1],[0,3,1],[0,4,1]],lone:[0,0,0,0,0],why:'Carbon has 4 outer electrons and shares 4 pairs, so it gets 8. Each H gets 2.'},
 CO2:{name:'carbon dioxide',f:'CO₂',a:[['O',-105,0],['C',0,0],['O',105,0]],b:[[0,1,2],[1,2,2]],lone:[2,0,2],why:'Carbon forms two double bonds: 4 shared pairs in all. Every atom ends up with a full outer shell.'}};
function molDraw(g,key){g.innerHTML='';if(!key)return;const m=MOLS[key];const rad=a=>a[0]==='H'?20:28;
  const ang=(i,j)=>Math.atan2(m.a[j][2]-m.a[i][2],m.a[j][1]-m.a[i][1])*180/Math.PI;
  m.b.forEach(([i,j,o])=>{const A=m.a[i],B=m.a[j];const dx=B[1]-A[1],dy=B[2]-A[2],len=Math.hypot(dx,dy),ux=dx/len,uy=dy/len,px=-uy,py=ux;
    for(let k=0;k<o;k++){const off=(k-(o-1)/2)*11;g.append(L(A[1]+px*off,A[2]+py*off,B[1]+px*off,B[2]+py*off,{'stroke-width':3,stroke:'var(--muted)'}));
      const mx=(A[1]+B[1])/2+px*off,my=(A[2]+B[2])/2+py*off;g.append(C(mx-ux*5,my-uy*5,3.6,{fill:'var(--hot)','stroke-width':1}),S('path',{d:`M${mx+ux*5-3} ${my+uy*5-3}l6 6m0 -6l-6 6`,stroke:'var(--cold)','stroke-width':2.4,'stroke-linecap':'round'}))}});
  m.a.forEach((a,i)=>{g.append(C(a[1],a[2],rad(a),{fill:MOLCOL[a[0]],'stroke-width':2.5}),T(a[1],a[2]+6,a[0],{'font-size':a[0]==='H'?19:22,fill:a[0]==='H'?'#13203a':'#fff','font-family':'Fredoka,sans-serif'}));
    const used=[];m.b.forEach(([p,q])=>{if(p===i)used.push(ang(i,q));if(q===i)used.push(ang(i,p))});
    for(let k=0;k<m.lone[i];k++){let best=0,bd=-1;for(let c=0;c<360;c+=15){const d=Math.min(...used.map(u=>{return Math.abs(((c-u)%360+540)%360-180)}).concat([360]));if(d>bd){bd=d;best=c}}used.push(best);
      [-11,11].forEach(o=>{const t=(best+o)*Math.PI/180;g.append(C(a[1]+(rad(a)+11)*Math.cos(t),a[2]+(rad(a)+11)*Math.sin(t),3,{fill:'var(--ink)',stroke:'none'}))})}})}
SCENES.push({id:'2.4',act:'bond',title:'Covalent bonding',idea:'Non-metal atoms share pairs of electrons',
 setup(ctx){
  const s=ctx.svg();const X={s};const mg=S('g',{transform:'translate(400 215) scale(1.55)'}),fx=S('g');s.append(fx,mg);X.mg=mg;X.fx=fx;
  X.note=T(400,44,'',{'font-size':22,fill:'var(--accent)','font-family':'Fredoka,sans-serif'});X.cap=T(400,418,'',{'font-size':18,fill:'var(--muted)'});s.append(X.note,X.cap);
  X.show=k=>{molDraw(mg,k);X.fx.innerHTML=''};return X},
 steps:[
  {k:'watch',run(X,ctx){X.show(null);X.note.textContent='Two hydrogen atoms';X.cap.textContent='';
   const mk=(cx)=>{const g=S('g');g.append(C(0,0,72,{fill:'none',stroke:'var(--line)','stroke-width':3,'stroke-dasharray':'5 5'}),C(0,0,16,{fill:'var(--hot)','stroke-width':2}),T(0,6,'H',{'font-size':16,fill:'#fff'}));return g};
   const a=mk(),b=mk();const ea=C(0,0,7,{fill:'var(--hot)','stroke-width':1.5}),eb=C(0,0,7,{fill:'var(--cold)','stroke-width':1.5});X.fx.append(a,b,ea,eb);
   const place=p=>{const xa=210+(345-210)*p,xb=590-(590-455)*p;a.setAttribute('transform',`translate(${xa} 225)`);b.setAttribute('transform',`translate(${xb} 225)`);const sh=p>.98;ea.setAttribute('cx',sh?390:xa+72);ea.setAttribute('cy',sh?210:225);eb.setAttribute('cx',sh?410:xb-72);eb.setAttribute('cy',sh?240:225)};place(0);
   ctx.after(1200,()=>tween(ctx,2.4,p=>place(ease(p)),()=>{X.note.textContent='A shared pair: both atoms have 2 electrons';X.cap.textContent='Hydrogen molecule, H₂: one covalent bond'}))}},
  {k:'watch',run(X,ctx){X.show('H2O');X.note.textContent='Water, H₂O';X.cap.textContent='Each line is one shared pair of electrons.  Dots on their own are pairs not used for bonding.';ctx.after(6000,()=>{X.show('CH4');X.note.textContent='Methane, CH₄: four shared pairs'})}},
  {k:'predict',q:'How many covalent bonds does the carbon atom form in methane, CH₄?',opts:['4','1','2','8'],ans:0,why:'Carbon has 4 outer electrons and shares each with a hydrogen atom: 4 single bonds.',run(X){X.show('CH4');X.note.textContent='CH₄';X.cap.textContent=''}},
  {k:'try',build(X,ctx){const h=ctx.panel;const seen=new Set();X.show('H2');X.note.textContent='Pick a molecule';
   const info=H('div',{class:'fb info'},'Look at four different molecules.'),pg=H('p',{class:'hint'},'Viewed 0 of 4');
   pickRow(h,Object.keys(MOLS).map(k=>({id:k,label:MOLS[k].f})),k=>{X.show(k);const m=MOLS[k];const pairs=m.b.reduce((t,b)=>t+b[2],0);X.note.textContent=m.name+', '+m.f;X.cap.textContent=pairs+' shared pair'+(pairs>1?'s':'')+' of electrons';info.className='fb good';info.textContent=m.why;seen.add(k);pg.textContent='Viewed '+Math.min(4,seen.size)+' of 4';if(seen.size>=4)ctx.done()},null);
   h.append(info,pg)}},
  {k:'sum',take:'Covalent bonds form when non-metal atoms share pairs of electrons. Each line in a diagram is one shared pair. Every atom ends up with a full outer shell.',run(X){X.show('CO2');X.note.textContent='Carbon dioxide has two double bonds';X.cap.textContent=''}}],
 quiz:[Q('t','What is a covalent bond?',['A shared pair of electrons','An attraction between ions','A transfer of electrons','A bond between neutrons'],0,'Covalent bonds are shared pairs of electrons between non-metal atoms.'),
  N('How many shared pairs of electrons are in one water molecule, H₂O?',2,'','Oxygen shares one pair with each hydrogen: 2 pairs.',0.1),
  Q('t','Which pair of elements will form a covalent compound?',['Carbon and oxygen','Sodium and chlorine','Magnesium and oxygen','Potassium and fluorine'],0,'Carbon and oxygen are both non-metals, so they share electrons.')]});

/* ===== 2.5 Simple molecular substances ===== */
function makeTank(ctx,parent,x,y,w,h,n,mp,bp,sz){
  const g=S('g');parent.append(g);g.append(Pth(`M${x} ${y}V${y+h}H${x+w}V${y}`,{'stroke-width':3}));const ties=S('g');g.append(ties);const mols=[];const cols=Math.ceil(n/2);const T0={st:'solid'};
  for(let i=0;i<n;i++){const col=i%cols,row=Math.floor(i/cols);const sx=x+(col+.5)*w/cols,sy=y+h-(row+.5)*sz*3.4-6;const m=S('g');m.append(L(-sz,0,sz,0,{'stroke-width':sz*.45,stroke:'var(--ink)'}),C(-sz,0,sz*.85,{fill:'var(--cold)','stroke-width':1.5}),C(sz,0,sz*.85,{fill:'var(--hot)','stroke-width':1.5}));g.append(m);
    mols.push({m,sx,sy,x:sx,y:sy,vx:rnd(-1,1),vy:rnd(-1,1),a:rnd(0,360),va:rnd(-40,40)})}
  mols.forEach((o,i)=>{const col=i%cols,row=Math.floor(i/cols);if(col<cols-1&&mols[i+1])ties.append(L(o.sx,o.sy,mols[i+1].sx,mols[i+1].sy,{'stroke-width':2,'stroke-dasharray':'4 4',stroke:'var(--muted)'}));if(mols[i+cols])ties.append(L(o.sx,o.sy,mols[i+cols].sx,mols[i+cols].sy,{'stroke-width':2,'stroke-dasharray':'4 4',stroke:'var(--muted)'}))});
  const t={g,state:'solid',setT(T){const s=T<mp?'solid':T<bp?'liquid':'gas';t.state=s;ties.setAttribute('opacity',s==='solid'?1:0);return s}};
  ctx.bg.raf(dt=>{mols.forEach(o=>{if(t.state==='solid'){o.x+=(o.sx-o.x)*Math.min(1,8*dt)+rnd(-.5,.5);o.y+=(o.sy-o.y)*Math.min(1,8*dt)+rnd(-.5,.5);o.a+=o.va*dt*.2}
    else{const sp=t.state==='liquid'?32:95;const top=t.state==='liquid'?y+h*.45:y+sz*2;o.x+=o.vx*sp*dt;o.y+=o.vy*sp*dt;o.a+=o.va*dt*3;const l=x+sz*2,r=x+w-sz*2,b=y+h-sz*2;if(o.x<l){o.x=l;o.vx=Math.abs(o.vx)}if(o.x>r){o.x=r;o.vx=-Math.abs(o.vx)}if(o.y<top){o.y=top;o.vy=Math.abs(o.vy)}if(o.y>b){o.y=b;o.vy=-Math.abs(o.vy)}if(Math.random()<.03){o.vx=rnd(-1,1);o.vy=rnd(-1,1)}}
    o.m.setAttribute('transform',`translate(${o.x} ${o.y}) rotate(${o.a})`)})});
  return t}
SCENES.push({id:'2.5',act:'bond',title:'Simple molecular substances',idea:'Weak forces between molecules, so low melting and boiling points',
 setup(ctx){
  const s=ctx.svg();const X={s};const mono=S('g'),quad=S('g');s.append(mono,quad);X.mono=mono;X.quad=quad;
  X.mt=makeTank(ctx,mono,190,100,420,250,12,0,100,15);
  X.temp=T(400,50,'',{'font-size':26,'font-family':'Fredoka,sans-serif',fill:'var(--hot)'});X.st=T(400,390,'',{'font-size':22,fill:'var(--accent)','font-family':'Fredoka,sans-serif'});X.lab=T(400,425,'',{'font-size':18,fill:'var(--muted)'});s.append(X.temp,X.st,X.lab);
  X.subs=[{n:'methane',mp:-182,bp:-162},{n:'ethanol',mp:-114,bp:78},{n:'water',mp:0,bp:100},{n:'iodine',mp:114,bp:184}];
  X.tanks=X.subs.map((d,i)=>{const x=30+i*190;quad.append(T(x+85,104,d.n,{'font-size':19,'font-family':'Fredoka,sans-serif'}),T(x+85,126,'melts '+d.mp+' °C',{'font-size':13,fill:'var(--muted)'}),T(x+85,144,'boils '+d.bp+' °C',{'font-size':13,fill:'var(--muted)'}));const t=makeTank(ctx,quad,x,160,170,190,6,d.mp,d.bp,10);t.lb=T(x+85,378,'',{'font-size':19,fill:'var(--accent)','font-family':'Fredoka,sans-serif'});quad.append(t.lb);return t});
  X.setMono=T_=>{const st=X.mt.setT(T_);X.temp.textContent=Math.round(T_)+' °C';X.st.textContent=st;return st};
  X.setQuad=T_=>{X.tanks.forEach(t=>{t.lb.textContent=t.setT(T_)});X.temp.textContent=Math.round(T_)+' °C'};
  X.view=m=>{mono.setAttribute('opacity',m==='mono'?1:0);quad.setAttribute('opacity',m==='quad'?1:0)};X.view('mono');X.setMono(-20);return X},
 steps:[
  {k:'watch',run(X,ctx){X.view('mono');X.setMono(-20);X.st.textContent='solid';X.lab.textContent='';X.temp.textContent='';ctx.after(1200,()=>X.lab.textContent='Thick line: strong covalent bond inside each molecule');ctx.after(4800,()=>X.lab.textContent='Dashed lines: weak forces between molecules')}},
  {k:'watch',run(X,ctx){X.view('mono');X.setMono(-20);X.lab.textContent='Heating (like water)';ctx.after(900,()=>tween(ctx,9,p=>{X.setMono(-20+140*p)},()=>{X.lab.textContent='Only the weak forces were overcome. The molecules are still whole.'}))}},
  {k:'predict',q:'When water boils, what is broken?',opts:['The weak forces between molecules','The covalent bonds inside molecules','Both of these','Nothing is broken'],ans:0,why:'Boiling only separates the molecules from each other. Each molecule is still H₂O, so the strong covalent bonds stay.',run(X){X.view('mono');X.setMono(60);X.lab.textContent=''}},
  {k:'try',build(X,ctx){const h=ctx.panel;X.view('quad');X.setQuad(-200);X.lab.textContent='';let moved=false,won=false;
   const goal=H('div',{class:'fb info'},'Challenge: find a temperature where methane is a gas, water is a liquid and iodine is still a solid.');
   const sl=sliderRow('Temperature',-200,250,-200,1,v=>{moved=true;X.setQuad(v);if(!won&&v>0&&v<100){won=true;goal.className='fb good';goal.textContent='Yes! Around '+v+' °C: methane is a gas, water a liquid, iodine a solid. Weak forces mean low melting points.';ctx.done()}},' °C');
   h.append(goal,sl.el,H('p',{class:'hint'},'Drag the slider and watch each substance change state.'))}},
  {k:'sum',take:'Simple molecules have strong covalent bonds inside but weak forces between molecules. So low melting and boiling points, and they do not conduct electricity.',run(X){X.view('mono');X.setMono(20);X.lab.textContent=''}}],
 quiz:[Q('t','Why do simple molecular substances have low melting points?',['Only weak forces between molecules need to be overcome','The covalent bonds are weak','They contain ions','They have free electrons'],0,'Melting separates the molecules from each other; the covalent bonds inside them stay intact.'),
  Q('t','Do simple molecular substances conduct electricity?',['No: no free ions or electrons','Yes: they contain ions','Yes: they have free electrons','Only when solid'],0,'Their molecules are neutral, with no ions or free electrons to carry charge.'),
  Q('t','Iodine melts at 114 °C. What state is it at room temperature (20 °C)?',['Solid','Liquid','Gas','Plasma'],0,'20 °C is well below 114 °C, so iodine is a solid.')]});
