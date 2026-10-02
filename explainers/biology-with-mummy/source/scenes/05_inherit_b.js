/* ===== 2.4 Asexual and sexual reproduction ===== */
SCENES.push({id:'2.4',act:'gen',title:'Asexual and sexual reproduction',idea:'One parent → clones; two parents → variation',
 setup(ctx){
  const s=ctx.svg();const X={s};const face=(g,x,y,r,col)=>{g.append(C(x,y,r,{fill:col,'stroke-width':2.5}),C(x-r*.3,y-r*.1,r*.1,{fill:'var(--ink)',stroke:'none'}),C(x+r*.3,y-r*.1,r*.1,{fill:'var(--ink)',stroke:'none'}),S('path',{d:`M${x-r*.3} ${y+r*.3}Q${x} ${y+r*.55} ${x+r*.3} ${y+r*.3}`,fill:'none',stroke:'var(--ink)','stroke-width':2}))};
  X.as=S('g');X.sx=S('g');s.append(L(400,60,400,420,{stroke:'var(--line)','stroke-width':3,'stroke-dasharray':'6 8'}),X.as,X.sx);
  X.as.append(T(200,60,'Asexual: one parent',{'font-size':22,'font-family':'Fredoka,sans-serif',fill:'var(--accent)'}));const pa=S('g');face(pa,90,230,40,'#58b868');X.as.append(pa);
  X.asf=flowLine(ctx,X.as,[[140,230],[230,160]],{col:'#2f9e44',n:2,speed:.3});flowLine(ctx,X.as,[[140,230],[230,230]],{col:'#2f9e44',n:2,speed:.3});flowLine(ctx,X.as,[[140,230],[230,300]],{col:'#2f9e44',n:2,speed:.3});
  [160,230,300].forEach(y=>face(X.as,270,y,26,'#58b868'));X.as.append(T(270,355,'identical copies (clones)',{'font-size':17}),T(200,395,'e.g. bacteria, strawberry runners',{'font-size':15,fill:'var(--muted)'}));
  X.sx.append(T(600,60,'Sexual: two parents',{'font-size':22,'font-family':'Fredoka,sans-serif',fill:'var(--accent)'}));
  face(X.sx,450,140,34,'#6f94f2');face(X.sx,450,300,34,'#f0a65a');X.sx.append(T(450,100,'parent 1',{'font-size':14,fill:'var(--muted)'}),T(450,350,'parent 2',{'font-size':14,fill:'var(--muted)'}));
  flowLine(ctx,X.sx,[[490,150],[560,215]],{col:'#6f94f2',n:2,speed:.3});flowLine(ctx,X.sx,[[490,290],[560,225]],{col:'#f0a65a',n:2,speed:.3});X.sx.append(T(540,190,'gametes',{'font-size':14,fill:'var(--muted)'}),C(580,220,12,{fill:'#c9b3e8','stroke-width':2}));
  [[150,.2],[230,.5],[310,.85]].forEach(a=>{face(X.sx,690,a[0],26,mixc('#6f94f2','#f0a65a',a[1]))});X.sx.append(T(690,355,'all different',{'font-size':17}),T(630,395,'a mix of both parents',{'font-size':15,fill:'var(--muted)'}));
  flowLine(ctx,X.sx,[[600,220],[650,160]],{col:'#8a63d2',n:1,speed:.25});flowLine(ctx,X.sx,[[600,225],[650,230]],{col:'#8a63d2',n:1,speed:.25});flowLine(ctx,X.sx,[[600,230],[650,300]],{col:'#8a63d2',n:1,speed:.25});
  X.show=(a,b)=>{X.as.setAttribute('opacity',a);X.sx.setAttribute('opacity',b)};X.show(1,1);return X},
 steps:[
  {k:'watch',run(X,ctx){X.show(0,.15);ctx.after(600,()=>X.show(1,.15))}},
  {k:'watch',run(X,ctx){X.show(.15,0);ctx.after(600,()=>X.show(.15,1))}},
  {k:'predict',q:'Which type of reproduction produces offspring that are genetically identical to the parent?',opts:['Asexual reproduction','Sexual reproduction','Both of them','Neither of them'],ans:0,why:'With only one parent, the offspring copy its genes exactly. Sexual reproduction mixes genes from two parents.',run(X){X.show(1,1)}},
  {k:'try',build(X,ctx){X.show(1,1);
   matchGame(ctx.panel,{help:'Is it asexual or sexual reproduction?',items:[
    {label:'One parent only',to:'a',hint:'Only one parent is involved.'},{label:'Offspring are genetically identical',to:'a',hint:'They are clones.'},{label:'Strawberry runners',to:'a',hint:'A new plant grows from the parent.'},
    {label:'Two parents',to:'s',hint:'Two parents give genes.'},{label:'Gametes fuse in fertilisation',to:'s',hint:'Gametes only fuse in sexual reproduction.'},{label:'Offspring show variation',to:'s',hint:'Mixing genes makes each one different.'}],
    buckets:[{id:'a',label:'Asexual'},{id:'s',label:'Sexual'}],onDone:ctx.done})}},
  {k:'sum',take:'Asexual: one parent, identical offspring. Sexual: two parents, gametes fuse, offspring are different. Variation helps a species survive change.',run(X){X.show(1,1)}}],
 quiz:[Q('t','How many parents are needed for asexual reproduction?',['One','Two','Three','None'],0,'Asexual reproduction needs just one parent.'),Q('t','Why does sexual reproduction produce variation?',['Genes from two parents are mixed','Offspring are clones','There are no gametes','Only one parent gives genes'],0,'Each offspring gets a new combination of genes from both parents.'),
  Q('t','Which is an example of asexual reproduction?',['Bacteria dividing','Humans having a baby','A bird laying eggs','Pollination'],0,'Bacteria divide to make identical copies.')]});

/* ===== 2.5 Gametes ===== */
SCENES.push({id:'2.5',act:'gen',title:'Gametes: sperm and egg',idea:'Sex cells with adaptations; half the chromosomes',
 setup(ctx){
  const s=ctx.svg();const X={s,t:0,lab:[]};
  const sp=G(0,0);sp.append(S('ellipse',{cx:110,cy:225,rx:36,ry:25,fill:'#e8dcf7','stroke-width':3,stroke:'var(--ink)'}),S('ellipse',{cx:82,cy:225,rx:14,ry:19,fill:'#f4a9cf',stroke:'var(--ink)','stroke-width':2}),C(120,225,12,{fill:'#8a63d2','stroke-width':2}),R(146,215,66,20,{rx:6,fill:'#f7c27a','stroke-width':2.5}));for(let i=0;i<5;i++)sp.append(C(155+i*12,225,3.8,{fill:'#e08a2c',stroke:'var(--ink)','stroke-width':1}));
  X.tail=S('path',{d:'',fill:'none',stroke:'#8a63d2','stroke-width':5,'stroke-linecap':'round'});sp.append(X.tail);s.append(sp);
  const egg=S('g');egg.append(C(620,225,108,{fill:'none',stroke:'#f0b030','stroke-width':7,'stroke-dasharray':'9 6'}),C(620,225,92,{fill:'#fff4d6','stroke-width':3.5}),C(620,225,22,{fill:'#8a63d2','stroke-width':2.5}));for(let i=0;i<16;i++){const a=i*2.4,r=34+(i%4)*13;egg.append(C(620+r*Math.cos(a),225+r*Math.sin(a),3.5,{fill:'#f0b030',stroke:'none',opacity:.8}))}s.append(egg);X.egg=egg;X.sp=sp;
  ctx.bg.raf(dt=>{X.t+=dt;let d='M214 225';for(let x=222;x<=420;x+=6){const k=(x-214)/206;d+=`L${x} ${225+Math.sin(x/14-X.t*9)*16*k}`}X.tail.setAttribute('d',d)});
  const mk=(txt,x,y,lx,ly,col)=>{const g=S('g',{opacity:0});g.append(L(x,y,lx,ly,{stroke:'var(--muted)','stroke-width':1.5}),T(lx,ly+(ly<225?-6:18),txt,{'font-size':15,fill:col||'var(--ink)','font-family':'Fredoka,sans-serif'}));s.append(g);return g};
  X.l={tail:mk('tail: swims',330,230,330,320),mito:mk('mitochondria: energy',180,215,190,150),acro:mk('enzymes: digest the egg coat',80,238,120,318),nuc:mk('nucleus: 23 chromosomes',120,215,200,95),
   jelly:mk('jelly coat',620,120,620,60),food:mk('food store in cytoplasm',650,260,650,365),enuc:mk('nucleus: 23 chromosomes',620,225,540,375)};
  X.title=T(250,380,'sperm cell',{'font-size':20,'font-family':'Fredoka,sans-serif',fill:'var(--accent)'});X.title2=T(620,40,'egg cell',{'font-size':20,'font-family':'Fredoka,sans-serif',fill:'var(--accent)'});s.append(X.title,X.title2);
  X.hideL=()=>Object.values(X.l).forEach(g=>g.setAttribute('opacity',0));X.view=(a,b)=>{sp.setAttribute('opacity',a);egg.setAttribute('opacity',b);X.title.setAttribute('opacity',a);X.title2.setAttribute('opacity',b)};X.view(1,1);return X},
 steps:[
  {k:'watch',run(X,ctx){X.view(1,.2);X.hideL();[['tail',1000],['mito',3800],['acro',6600],['nuc',9400]].forEach(a=>ctx.after(a[1],()=>X.l[a[0]].setAttribute('opacity',1)))}},
  {k:'watch',run(X,ctx){X.view(.2,1);X.hideL();[['jelly',900],['food',3600],['enuc',6500]].forEach(a=>ctx.after(a[1],()=>X.l[a[0]].setAttribute('opacity',1)))}},
  {k:'predict',q:'How many chromosomes are in a human sperm cell?',opts:['23','46','92','2'],ans:0,why:'Gametes have half the usual number: 23. When sperm and egg fuse, the baby gets 46.',run(X){X.view(1,1);X.hideL()}},
  {k:'try',build(X,ctx){X.view(1,1);X.hideL();
   matchGame(ctx.panel,{help:'Tap a job, then tap the feature that does it.',items:[
    {label:'Swim to the egg',to:'tail',hint:'The sperm moves with its tail.'},{label:'Release energy for swimming',to:'mito',hint:'Mitochondria release energy.'},{label:'Digest the outer layer of the egg',to:'enz',hint:'Enzymes are in the head.'},{label:'Feed the early embryo',to:'food',hint:'The egg stores food.'}],
    buckets:[{id:'tail',label:'Long tail'},{id:'mito',label:'Many mitochondria'},{id:'enz',label:'Enzymes in the head'},{id:'food',label:'Food store in the egg'}],onDone:ctx.done})}},
  {k:'sum',take:'Gametes are sex cells. A sperm has a tail, many mitochondria and enzymes. An egg has a food store. Each has 23 chromosomes, half the normal number.',run(X){X.view(1,1);X.hideL();Object.values(X.l).forEach(g=>g.setAttribute('opacity',1))}}],
 quiz:[Q('t','Why does a sperm cell have many mitochondria?',['To release energy for swimming','To store food','To digest the egg','To carry water'],0,'Mitochondria release the energy the tail needs.'),Q('t','How many chromosomes does a human egg cell contain?',['23','46','92','12'],0,'Gametes have half the chromosomes: 23.'),
  Q('t','What is a gamete?',['A sex cell','A body cell','A chromosome','A protein'],0,'Gametes are sex cells: sperm and egg in humans.')]});

/* ===== 2.6 Fertilisation ===== */
const ex=600,ey=225;
SCENES.push({id:'2.6',act:'gen',title:'Fertilisation',idea:'23 + 23 = 46: the zygote',
 setup(ctx){
  const s=ctx.svg();const X={s,t:0};
  X.egg=S('g');X.egg.append(C(ex,ey,96,{fill:'none',stroke:'#f0b030','stroke-width':6,'stroke-dasharray':'8 6'}),C(ex,ey,82,{fill:'#fff4d6','stroke-width':3.5}));s.append(X.egg);
  X.div=S('g');X.nuc=S('g');X.spg=S('g');s.append(X.div,X.nuc,X.spg);
  X.sperm=[0,1,2,3,4,5,6].map(i=>{const y=120+i*38;const g=S('g');const tail=S('path',{d:'',fill:'none',stroke:'#8a63d2','stroke-width':2.5});g.append(tail,S('ellipse',{cx:0,cy:0,rx:10,ry:7,fill:'#8a63d2',stroke:'var(--ink)','stroke-width':1.5}));X.spg.append(g);return {g,tail,y,x:50,ph:rnd(0,6)}});
  ctx.bg.raf(dt=>{X.t+=dt;X.sperm.forEach((o,i)=>{o.g.setAttribute('transform',`translate(${o.x} ${o.y})`);let d='M-10 0';for(let k=1;k<=5;k++)d+=`L${-10-k*7} ${Math.sin(k*1.1-X.t*10-o.ph)*5}`;o.tail.setAttribute('d',d)})});
  X.note=T(400,44,'',{'font-size':22,fill:'var(--accent)','font-family':'Fredoka,sans-serif'});X.cnt=T(400,420,'',{'font-size':26,'font-family':'Fredoka,sans-serif'});s.append(X.note,X.cnt);
  X.reset=()=>{X.nuc.innerHTML='';X.div.innerHTML='';X.note.textContent='';X.cnt.textContent='';X.sperm.forEach((o,i)=>{o.x=50;o.g.setAttribute('opacity',1)});X.nuc.append(C(ex,ey,22,{fill:'#c9b3e8','stroke-width':2.5}),T(ex,ey+5,'23',{'font-size':15}))};
  X.cells=n=>{X.div.innerHTML='';const pos={1:[[0,0]],2:[[-24,0],[24,0]],4:[[-24,-24],[24,-24],[-24,24],[24,24]],8:[[-30,-34],[10,-38],[50,-26],[-44,2],[-4,0],[40,10],[-24,38],[18,40]]}[n];const r={1:40,2:36,4:30,8:21}[n];pos.forEach(p=>X.div.append(C(ex+p[0]-(n===8?6:0),ey+p[1],r,{fill:'#e8dcf7','stroke-width':2.5}),C(ex+p[0]-(n===8?6:0),ey+p[1],r*.35,{fill:'#c9b3e8','stroke-width':1.5})))};
  X.reset();return X},
 steps:[
  {k:'watch',run(X,ctx){X.reset();X.note.textContent='Many sperm swim towards the egg';const tg=[300,360,330,505,340,290,380];tween(ctx,5.5,p=>{const q=ease(p);X.sperm.forEach((o,i)=>o.x=50+(tg[i]-50)*q)},()=>{X.note.textContent='Only one sperm gets in';tween(ctx,1.6,p=>{const w=X.sperm[3];w.x=505+(575-505)*p;X.sperm.forEach((o,i)=>{if(i!==3)o.g.setAttribute('opacity',1-p*.8)})},()=>{X.note.textContent='Fertilisation: the sperm nucleus meets the egg nucleus';X.sperm[3].g.setAttribute('opacity',0);X.nuc.append(C(ex-40,ey,13,{fill:'#8a63d2','stroke-width':2}),T(ex-40,ey+5,'23',{'font-size':12,fill:'#fff'}))})})}},
  {k:'watch',run(X,ctx){X.reset();X.sperm.forEach(o=>o.g.setAttribute('opacity',0));X.nuc.append(C(ex-40,ey,13,{fill:'#8a63d2','stroke-width':2}),T(ex-40,ey+5,'23',{'font-size':12,fill:'#fff'}));X.note.textContent='The nuclei fuse';
   ctx.after(1200,()=>{X.nuc.innerHTML='';X.nuc.append(C(ex,ey,30,{fill:'#a58ae0','stroke-width':3}),T(ex,ey+6,'46',{'font-size':20,fill:'#fff','font-family':'Fredoka,sans-serif'}));X.cnt.textContent='23 + 23 = 46: a zygote';X.note.textContent='A zygote has the full 46 chromosomes'});
   ctx.after(5200,()=>{X.nuc.innerHTML='';X.cells(2);X.note.textContent='It divides into two cells...'});ctx.after(8000,()=>{X.cells(4);X.note.textContent='...then four...'});ctx.after(10500,()=>{X.cells(8);X.note.textContent='...and grows into an embryo'})}},
  {k:'predict',q:'A sperm (23 chromosomes) fertilises an egg (23 chromosomes). How many chromosomes does the zygote have?',opts:['46','23','69','12'],ans:0,why:'23 from the sperm plus 23 from the egg makes 46: half from each parent.',run(X){X.reset();X.sperm.forEach(o=>o.g.setAttribute('opacity',0))}},
  {k:'try',build(X,ctx){X.reset();X.sperm.forEach(o=>o.g.setAttribute('opacity',0));const h=ctx.panel;
   const qs=[N('Sperm: 23 chromosomes. Egg: 23 chromosomes. How many in the zygote?',46,'','23 + 23 = 46.',0.1),N('A fruit fly body cell has 8 chromosomes. How many are in one of its gametes?',4,'','Gametes have half: 8 ÷ 2 = 4.',0.1),N('A cat body cell has 38 chromosomes. How many are in its zygote?',38,'','The zygote has the full number again: 19 from each parent = 38.',0.1)];
   let i=0;const host=H('div');h.append(host);
   const nxt=()=>{if(i>=qs.length){host.innerHTML='';host.append(H('div',{class:'fb good'},'All three correct!'));ctx.done();return}const box=H('div');host.innerHTML='';host.append(H('p',{class:'hint'},'Question '+(i+1)+' of '+qs.length),box);ask(qs[i],box,()=>{box.append(H('button',{class:'btn small',onclick:()=>{i++;nxt()}},i>=qs.length-1?'Finish':'Next question'))})};nxt()}},
  {k:'sum',take:'Fertilisation is when the nuclei of a sperm and an egg fuse to make a zygote. 23 + 23 = 46. The zygote divides to make an embryo.',run(X){X.reset();X.sperm.forEach(o=>o.g.setAttribute('opacity',0));X.nuc.innerHTML='';X.cells(8);X.cnt.textContent='23 + 23 = 46'}}],
 quiz:[Q('t','What is fertilisation?',['The fusion of a sperm and an egg nucleus','The division of a body cell','The making of sperm','The growth of an embryo'],0,'Fertilisation is when the male and female gametes fuse.'),N('A sperm has 23 chromosomes and an egg has 23. How many does the zygote have?',46,'','23 + 23 = 46.',0.1),
  Q('t','What does the zygote do next?',['Divides to form an embryo','Turns into a gamete','Stops growing','Loses chromosomes'],0,'The zygote divides again and again to form an embryo.')]});

/* ===== 2.7 Why brothers and sisters differ ===== */
const MUMC=[['#e5484d','#f5a3a6'],['#e08a2c','#f6c98f'],['#9a4fd1','#d3b0ee']],DADC=[['#3b6df0','#9cb8f7'],['#1aa39a','#8fd9d3'],['#2f9e44','#9fd7a9']];
SCENES.push({id:'2.7',act:'gen',title:'Why siblings are different',idea:'Random mixing of chromosomes and random fertilisation',
 setup(ctx){
  const s=ctx.svg();const X={s,kids:[],mumB:[],dadB:[]};
  const bar=(g,x,y,h,col,o={})=>{const b=R(x,y,13,h,{rx:6,fill:col,'stroke-width':2,...o});g.append(b);return b};
  s.append(T(185,38,'Mum: 3 of her pairs',{'font-size':17,'font-family':'Fredoka,sans-serif'}),T(615,38,'Dad: 3 of his pairs',{'font-size':17,'font-family':'Fredoka,sans-serif'}));
  for(let i=0;i<3;i++){X.mumB.push([bar(s,90+i*70,50,60,MUMC[i][0]),bar(s,106+i*70,50,60,MUMC[i][1])]);X.dadB.push([bar(s,520+i*70,50,60,DADC[i][0]),bar(s,536+i*70,50,60,DADC[i][1])])}
  X.gm=S('g');X.gd=S('g');s.append(X.gm,X.gd);X.note=T(400,148,'',{'font-size':20,fill:'var(--accent)','font-family':'Fredoka,sans-serif'});s.append(X.note);
  X.kg=S('g');s.append(X.kg);
  X.pick=()=>({m:[0,1,2].map(()=>Math.random()<.5?0:1),d:[0,1,2].map(()=>Math.random()<.5?0:1)});
  X.showKid=(k,idx,cnt)=>{const cx=130+idx*270;const g=S('g');g.append(R(cx-100,260,200,150,{rx:16,fill:'var(--paper)','stroke-width':2.5}),T(cx,284,'child '+(idx+1),{'font-size':16,fill:'var(--muted)'}));for(let i=0;i<3;i++){bar(g,cx-72+i*52,300,86,MUMC[i][k.m[i]]);bar(g,cx-56+i*52,300,86,DADC[i][k.d[i]])}X.kg.append(g)};
  X.gam=(k)=>{X.gm.innerHTML='';X.gd.innerHTML='';for(let i=0;i<3;i++){bar(X.gm,150+i*30,175,46,MUMC[i][k.m[i]]);bar(X.gd,540+i*30,175,46,DADC[i][k.d[i]])}X.gm.append(T(190,242,'mum gamete',{'font-size':14,fill:'var(--muted)'}));X.gd.append(T(580,242,'dad gamete',{'font-size':14,fill:'var(--muted)'}))};
  X.hl=(k)=>{for(let i=0;i<3;i++){[0,1].forEach(j=>{X.mumB[i][j].setAttribute('opacity',k.m[i]===j?1:.25);X.dadB[i][j].setAttribute('opacity',k.d[i]===j?1:.25)})}};
  X.clear=()=>{X.gm.innerHTML='';X.gd.innerHTML='';X.kg.innerHTML='';X.kids=[];X.note.textContent='';for(let i=0;i<3;i++)[0,1].forEach(j=>{X.mumB[i][j].setAttribute('opacity',1);X.dadB[i][j].setAttribute('opacity',1)})};
  X.make=(k,after)=>{X.hl(k);X.gam(k);X.note.textContent='Each gamete gets one chromosome from each pair, at random';X.kids.push(k);ctx.after(1500,()=>{X.hl({m:[2,2,2].map(()=>-1),d:[-1,-1,-1]});X.showKid(k,X.kids.length-1);X.note.textContent='Fertilisation: a new combination';if(after)after()})};
  X.same=(a,b)=>a.m.join()===b.m.join()&&a.d.join()===b.d.join();
  return X},
 steps:[
  {k:'watch',run(X,ctx){X.clear();const ks=[X.pick(),X.pick(),X.pick()];let i=0;const cyc=ctx.every(900,()=>{const k=ks[i%3];X.hl(k);i++;if(i>5){clearInterval(cyc.iv);X.hl(ks[0]);X.gam(ks[0]);X.note.textContent='A gamete: one chromosome from each pair, chosen at random'}});X.note.textContent='Each parent has pairs of chromosomes'}},
  {k:'watch',run(X,ctx){X.clear();const k1=X.pick();let k2=X.pick();while(X.same(k1,k2))k2=X.pick();X.make(k1,()=>{ctx.after(2500,()=>{X.hl({m:[0,0,0],d:[0,0,0]});for(let i=0;i<3;i++)[0,1].forEach(j=>{X.mumB[i][j].setAttribute('opacity',1);X.dadB[i][j].setAttribute('opacity',1)});X.make(k2,()=>{X.note.textContent='Same parents, different children'})})})}},
  {k:'predict',q:'Why are brothers and sisters from the same parents not identical?',opts:['Each gamete gets a different random mix of chromosomes','They have different parents','They never share any genes','They are clones of each other'],ans:0,why:'Gametes get a random mix of chromosomes, and any sperm can meet any egg, so each child is a new combination.',run(X){X.clear()}},
  {k:'try',build(X,ctx){X.clear();const h=ctx.panel;const fb=H('div',{class:'fb info'},'Press the button to make three children.'),pg=H('p',{class:'hint'},'Children made: 0 of 3');
   const go=H('button',{class:'btn small',onclick:()=>{if(X.kids.length>=3)return;go.disabled=true;const k=X.pick();X.make(k,()=>{go.disabled=false;const n=X.kids.length;pg.textContent='Children made: '+n+' of 3';const dif=X.kids.slice(0,-1).every(o=>!X.same(o,k));fb.className='fb good';fb.textContent=n===1?'Child 1 has a mix of chromosomes from each parent.':(dif?'This child is different from the others, even with the same parents.':'This child happens to match a sibling, which is rare.');if(n>=3){go.disabled=true;ctx.done()}})}},'Make a child');
   h.append(go,fb,pg)}},
  {k:'sum',take:'Siblings differ because each gamete gets a random mix of chromosomes, and fertilisation is random. Sexual reproduction creates variation.',run(X){X.clear();const a=X.pick();X.make(a)}}],
 quiz:[Q('t','Why do siblings look different from each other?',['Random mixing of chromosomes in gametes and random fertilisation','They have different parents','They were not fertilised','They have no DNA'],0,'Every gamete is different, and any sperm can fertilise any egg.'),
  Q('t','How many chromosomes from each pair does a gamete get?',['One','Both','None','Three'],0,'A gamete gets one chromosome from each pair.'),
  Q('t','What increases variation in a species?',['Sexual reproduction','Cloning','Asexual reproduction','Mitosis only'],0,'Sexual reproduction creates new gene combinations in every offspring.')]});
