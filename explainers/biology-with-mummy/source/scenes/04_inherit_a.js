/* ===== 2.1 Variation ===== */
const PPL=[{sk:'#f1c9a5',hr:'#2b1b12',ey:'#5b3a1e',h:150,cl:'#e5484d'},{sk:'#e0a97c',hr:'#6b3f1d',ey:'#2e6fb5',h:172,cl:'#3b6df0'},{sk:'#c68642',hr:'#111',ey:'#5b3a1e',h:135,cl:'#2faa4a'},{sk:'#8d5524',hr:'#111',ey:'#3c8f4b',h:182,cl:'#f0b030'},{sk:'#f5d5b8',hr:'#d9b44a',ey:'#2e6fb5',h:160,cl:'#9a4fd1'},{sk:'#d9a066',hr:'#a83a22',ey:'#7a5a2e',h:146,cl:'#1aa39a'}];
SCENES.push({id:'2.1',act:'gen',title:'Variation',idea:'Differences between living things: genes, environment, or both',
 setup(ctx){
  const s=ctx.svg();const X={s,people:[]};const base=360;
  s.append(L(30,base,770,base,{stroke:'var(--muted)','stroke-width':3}));
  PPL.forEach((p,i)=>{const x=100+i*120,g=G(x,0);const top=base-p.h;g.append(R(-22,top+36,44,p.h-36,{rx:10,fill:p.cl}),C(0,top+16,24,{fill:p.sk,'stroke-width':2.5}),S('path',{d:`M-24 ${top+12}Q-22 ${top-12} 0 ${top-10}Q22 ${top-12} 24 ${top+12}Q10 ${top}-24 ${top+12}Z`,fill:p.hr,stroke:'var(--ink)','stroke-width':2}));
    const eyes=S('g');eyes.append(C(-9,top+17,5,{fill:p.ey,'stroke-width':1}),C(9,top+17,5,{fill:p.ey,'stroke-width':1}));g.append(eyes,S('path',{d:`M-8 ${top+28}Q0 ${top+34} 8 ${top+28}`,fill:'none',stroke:'var(--ink)','stroke-width':2}));g.setAttribute('opacity',0);s.append(g);X.people.push({g,eyes,top,x})});
  X.hl=S('g');s.append(X.hl);X.note=T(400,44,'',{'font-size':22,fill:'var(--accent)','font-family':'Fredoka,sans-serif'});X.sub=T(400,410,'',{'font-size':19,fill:'var(--muted)'});s.append(X.note,X.sub);
  X.cause=S('g',{opacity:0});[['Genes','inherited from parents','eye colour, blood group',160,'#d6409f'],['Environment','the surroundings and life','diet, scars, learning',400,'#2f9e44'],['Both','genes and environment','height, body mass',640,'#e08a2c']].forEach(c=>{X.cause.append(R(c[3]-115,90,230,150,{rx:18,fill:'var(--paper)',stroke:c[4],'stroke-width':4}),T(c[3],130,c[0],{'font-size':26,'font-family':'Fredoka,sans-serif',fill:c[4]}),T(c[3],165,c[1],{'font-size':16,fill:'var(--muted)'}),T(c[3],205,c[2],{'font-size':17}))});s.append(X.cause);
  X.reset=()=>{X.hl.innerHTML='';X.cause.setAttribute('opacity',0);X.note.textContent='';X.sub.textContent='';X.people.forEach(p=>p.g.setAttribute('opacity',1))};return X},
 steps:[
  {k:'watch',run(X,ctx){X.reset();X.people.forEach((p,i)=>{p.g.setAttribute('opacity',0);ctx.after(500+i*500,()=>p.g.setAttribute('opacity',1))});ctx.after(4200,()=>{X.note.textContent='Same species, but all different';X.people.forEach(p=>p.eyes.querySelectorAll('circle').forEach(c=>c.setAttribute('r',9)))});ctx.after(7000,()=>{X.people.forEach(p=>p.eyes.querySelectorAll('circle').forEach(c=>c.setAttribute('r',5)));X.note.textContent='Eye colour, height, hair: this is variation'})}},
  {k:'watch',run(X,ctx){X.reset();X.people.forEach(p=>p.g.setAttribute('opacity',.25));X.cause.setAttribute('opacity',0);ctx.after(600,()=>X.cause.setAttribute('opacity',1));X.sub.textContent='Variation = differences between individuals of the same species'}},
  {k:'predict',q:'Which of these is caused only by the environment?',opts:['A scar from a fall','Eye colour','Blood group','Natural hair colour'],ans:0,why:'A scar comes from an accident, not from genes. The other three are inherited.',run(X){X.reset();X.cause.setAttribute('opacity',1);X.people.forEach(p=>p.g.setAttribute('opacity',.25))}},
  {k:'try',build(X,ctx){X.reset();X.cause.setAttribute('opacity',1);X.people.forEach(p=>p.g.setAttribute('opacity',.25));
   matchGame(ctx.panel,{help:'What causes each feature? Tap a feature, then a box.',items:[
    {label:'Eye colour',to:'g',hint:'You inherit it from your parents.'},{label:'Blood group',to:'g',hint:'Passed on in genes.'},{label:'A scar from a fall',to:'e',hint:'It happened to you; it is not inherited.'},{label:'Learning to play the guitar',to:'e',hint:'Learned through practice.'},{label:'Height',to:'b',hint:'Genes set the potential, and diet affects it too.'},{label:'Body mass',to:'b',hint:'Genes and diet and exercise.'}],
    buckets:[{id:'g',label:'Genes only'},{id:'e',label:'Environment only'},{id:'b',label:'Both genes and environment'}],onDone:ctx.done})}},
  {k:'sum',take:'Variation means differences between living things. It is caused by genes, by the environment, or by both.',run(X){X.reset();X.cause.setAttribute('opacity',1);X.people.forEach(p=>p.g.setAttribute('opacity',.25))}}],
 quiz:[Q('t','What is variation?',['Differences between individuals of the same species','Differences between species','Changes to the environment','Making identical copies'],0,'Variation is the differences between individuals, such as height or eye colour.'),
  Q('t','Which feature is controlled by genes only?',['Blood group','A scar','Speaking French','A tan'],0,'Blood group is inherited and does not change with the environment.'),
  Q('t','Height is affected by…',['both genes and diet','genes only','diet only','neither'],0,'Genes set the potential, but diet and health also matter.')]});

/* ===== 2.2 Cells, chromosomes and genes ===== */
SCENES.push({id:'2.2',act:'gen',title:'Cells, chromosomes and genes',idea:'Cell → nucleus → chromosome → DNA → gene',
 setup(ctx){
  const s=ctx.svg();const X={s,fr:[]};const cxs=[90,245,400,555,710];const names=['person','cell','nucleus','chromosomes','gene on DNA'];
  cxs.forEach((cx,i)=>{const g=G(cx,0);g.append(R(-65,100,130,230,{rx:18,fill:'var(--paper)','stroke-width':2.5}),T(0,360,names[i],{'font-size':17,'font-family':'Fredoka,sans-serif'}));
    if(i===0){g.append(C(0,160,22,{fill:'#f1c9a5','stroke-width':2.5}),R(-22,184,44,80,{rx:10,fill:'var(--accent)'}),L(-10,264,-10,300),L(10,264,10,300))}
    if(i===1){g.append(C(0,215,52,{fill:'#e8f5e0','stroke-width':3}),C(0,215,20,{fill:'#c9b3e8','stroke-width':2.5}))}
    if(i===2){g.append(C(0,215,52,{fill:'#c9b3e8','stroke-width':3}));[[-20,-18],[22,-14],[-8,20],[24,24],[-30,14]].forEach(p=>g.append(S('path',{d:`M${p[0]-9} ${215+p[1]-12}L${p[0]+9} ${215+p[1]+12}M${p[0]+9} ${215+p[1]-12}L${p[0]-9} ${215+p[1]+12}`,stroke:'#5b3a99','stroke-width':5,'stroke-linecap':'round'})))}
    if(i===3){g.append(S('path',{d:'M-26 140L26 290M26 140L-26 290',stroke:'#5b3a99','stroke-width':16,'stroke-linecap':'round'}),T(0,318,'46 in a human cell',{'font-size':12,fill:'var(--muted)'}))}
    if(i===4){for(let k=0;k<14;k++){const y=130+k*14,a=Math.sin(k*.9)*26,b=-a;g.append(L(a,y,b,y,{stroke:[ '#e5484d','#3b6df0','#2faa4a','#f0b030'][k%4],'stroke-width':3,opacity:k>=4&&k<=8?1:.35}))}g.append(R(-38,182,76,70,{rx:8,fill:'none',stroke:'var(--hot)','stroke-width':3.5}),T(0,282,'gene',{'font-size':16,fill:'var(--hot)'}));g.append(Pth('M-28 124Q0 200 -28 320',{stroke:'var(--muted)','stroke-width':2.5}),Pth('M28 124Q0 200 28 320',{stroke:'var(--muted)','stroke-width':2.5}))}
    g.setAttribute('opacity',0);s.append(g);X.fr.push(g)});
  for(let i=0;i<4;i++)s.append(S('polygon',{points:`${cxs[i]+72},206 ${cxs[i]+72},224 ${cxs[i]+92},215`,fill:'var(--muted)'}));
  X.note=T(400,60,'',{'font-size':22,fill:'var(--accent)','font-family':'Fredoka,sans-serif'});s.append(X.note);
  X.show=n=>X.fr.forEach((g,i)=>g.setAttribute('opacity',i<n?1:0));return X},
 steps:[
  {k:'watch',run(X,ctx){X.show(0);X.note.textContent='';[0,1,2].forEach(i=>ctx.after(700+i*2800,()=>{X.fr[i].setAttribute('opacity',1);X.note.textContent=['Your body is made of cells','Each cell has a nucleus','The nucleus holds chromosomes'][i]}))}},
  {k:'watch',run(X,ctx){X.show(3);X.note.textContent='';[3,4].forEach((i,k)=>ctx.after(700+k*5000,()=>{X.fr[i].setAttribute('opacity',1);X.note.textContent=['Humans have 46 chromosomes: 23 pairs','A gene is a section of DNA'][k]}))}},
  {k:'predict',q:'How many chromosomes are in a normal human body cell?',opts:['46','23','92','4'],ans:0,why:'Humans have 46 chromosomes, arranged as 23 pairs.',run(X){X.show(5);X.note.textContent=''}},
  {k:'try',build(X,ctx){X.show(5);X.note.textContent='';orderGame(ctx.panel,{help:'Tap from the biggest to the smallest.',items:['Cell','Nucleus','Chromosome','Gene'],why:['A cell is the biggest of these.','The nucleus is inside the cell.','Chromosomes are inside the nucleus.','A gene is a short section of a chromosome.'],onDone:ctx.done})}},
  {k:'sum',take:'Cells have a nucleus. The nucleus has chromosomes made of DNA. A gene is a section of DNA that carries instructions. Humans have 46 chromosomes.',run(X){X.show(5);X.note.textContent=''}}],
 quiz:[N('How many chromosomes are in a human body cell?',46,'','Humans have 46 chromosomes, in 23 pairs.',0.1),Q('t','Where are the chromosomes found in a cell?',['In the nucleus','In the cell wall','In the cytoplasm only','In the vacuole'],0,'Chromosomes are inside the nucleus.'),
  Q('t','What is a gene?',['A section of DNA that carries instructions','A whole chromosome','A type of cell','A protein'],0,'Each gene is a section of DNA coding for a feature.')]});

/* ===== 2.3 DNA ===== */
const BASEC={A:'#e5484d',T:'#3b6df0',C:'#2faa4a',G:'#f0b030'},PAIR={A:'T',T:'A',C:'G',G:'C'};
SCENES.push({id:'2.3',act:'gen',title:'DNA and base pairs',idea:'Double helix; A pairs with T, C pairs with G',
 setup(ctx){
  const s=ctx.svg();const X={s,ph:0,spin:true};const hx=S('g'),lad=S('g'),lab=S('g');s.append(hx,lad,lab);X.hx=hx;X.lad=lad;X.lab=lab;
  const seq='ATCGGATCTAGCCGTA'.split('');
  ctx.bg.raf(dt=>{if(X.spin)X.ph+=dt*2.2;hx.innerHTML='';const x0=60,x1=740,N=36;let d1='',d2='';for(let i=0;i<=N;i++){const x=x0+(x1-x0)*i/N,a=Math.sin(X.ph+i*.45)*64;d1+=(i?'L':'M')+x+' '+(225+a);d2+=(i?'L':'M')+x+' '+(225-a)}
    for(let i=0;i<=N;i+=1){const x=x0+(x1-x0)*i/N,a=Math.sin(X.ph+i*.45)*64;const b=seq[i%seq.length];const front=Math.cos(X.ph+i*.45)>0;
      hx.append(L(x,225+a,x,225,{stroke:BASEC[b],'stroke-width':8,'stroke-linecap':'butt',opacity:.9}),L(x,225,x,225-a,{stroke:BASEC[PAIR[b]],'stroke-width':8,'stroke-linecap':'butt',opacity:.9}))}
    hx.append(Pth(d1,{stroke:'#8a63d2','stroke-width':6}),Pth(d2,{stroke:'#d6409f','stroke-width':6}))});
  lab.append(T(400,60,'',{}));X.note=T(400,60,'',{'font-size':22,fill:'var(--accent)','font-family':'Fredoka,sans-serif'});X.sub=T(400,410,'',{'font-size':19,fill:'var(--muted)'});s.append(X.note,X.sub);
  /* ladder for the game */
  seq.slice(0,6).forEach((b,i)=>{const x=150+i*100;lad.append(C(x,170,26,{fill:BASEC[b],'stroke-width':2.5}),T(x,179,b,{'font-size':26,fill:'#fff','font-family':'Fredoka,sans-serif'}),L(x,196,x,254,{stroke:'var(--muted)','stroke-width':3,'stroke-dasharray':'4 6'}),C(x,280,26,{fill:'var(--paper)','stroke-width':2.5,'stroke-dasharray':'5 5'}))});
  lad.append(T(60,176,'strand 1',{'font-size':14,fill:'var(--muted)','text-anchor':'start'}),T(60,284,'strand 2',{'font-size':14,fill:'var(--muted)','text-anchor':'start'}));
  X.filled=S('g');lad.append(X.filled);
  X.mode=m=>{hx.setAttribute('opacity',m==='h'?1:0);lad.setAttribute('opacity',m==='l'?1:0);X.spin=m==='h'};X.seq=seq;X.mode('h');return X},
 steps:[
  {k:'watch',run(X,ctx){X.mode('h');X.note.textContent='DNA is a double helix';X.sub.textContent='';ctx.after(3500,()=>X.sub.textContent='two strands joined by pairs of bases');ctx.after(7500,()=>X.sub.textContent='A, T, C and G: the code of life')}},
  {k:'watch',run(X,ctx){X.mode('l');X.note.textContent='Base pairing rule';X.sub.textContent='';X.filled.innerHTML='';ctx.after(900,()=>{X.sub.textContent='A pairs with T.   C pairs with G.';[0,1,2,3,4,5].forEach(i=>{const b=PAIR[X.seq[i]];ctx.after(300*i,()=>{const x=150+i*100;X.filled.append(C(x,280,26,{fill:BASEC[b],'stroke-width':2.5}),T(x,289,b,{'font-size':26,fill:'#fff','font-family':'Fredoka,sans-serif'}))})})});ctx.after(6000,()=>X.sub.textContent='A gene is a section of DNA: a code for one protein')}},
  {k:'predict',q:'Which base pairs with adenine (A)?',opts:['Thymine (T)','Cytosine (C)','Guanine (G)','Adenine (A)'],ans:0,why:'A always pairs with T, and C always pairs with G.',run(X){X.mode('l');X.filled.innerHTML='';X.note.textContent='';X.sub.textContent=''}},
  {k:'try',build(X,ctx){X.mode('l');X.filled.innerHTML='';X.note.textContent='Complete strand 2';X.sub.textContent='';const h=ctx.panel;let i=0;
   const fb=H('div',{class:'fb info'},'Tap the base that pairs with the top one, one by one.');const row=H('div',{class:'chips'});
   ['A','T','C','G'].forEach(b=>{const c=H('button',{class:'chip',onclick:()=>{if(i>=6)return;const need=PAIR[X.seq[i]];if(b===need){const x=150+i*100;X.filled.append(C(x,280,26,{fill:BASEC[b],'stroke-width':2.5}),T(x,289,b,{'font-size':26,fill:'#fff','font-family':'Fredoka,sans-serif'}));fb.className='fb good';fb.textContent=X.seq[i]+' pairs with '+b+'.';cheer(true);i++;if(i>=6){fb.textContent='Strand complete!';ctx.done()}}else{fb.className='fb bad';fb.textContent='Not '+b+'. Remember: A–T and C–G.';cheer(false)}}},b);row.append(c)});
   h.append(row,fb)}},
  {k:'sum',take:'DNA is a double helix. A pairs with T, and C pairs with G. A gene is a section of DNA that carries the instructions for a feature.',run(X){X.mode('h');X.note.textContent='';X.sub.textContent=''}}],
 quiz:[Q('t','Which base pairs with cytosine (C)?',['Guanine (G)','Adenine (A)','Thymine (T)','Cytosine (C)'],0,'C always pairs with G.'),Q('t','What is the shape of DNA?',['A double helix','A single ring','A flat sheet','A cube'],0,'DNA has two strands twisted into a double helix.'),
  Q('t','What is a gene?',['A section of DNA that codes for a protein','A whole chromosome','A base','A cell'],0,'A gene is a length of DNA with instructions for making one protein.')]});
