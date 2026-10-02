/* ---------- svg helpers for scenes ---------- */
const T=(x,y,s,o={})=>S('text',Object.assign({x,y,'font-size':20,fill:'var(--ink)','text-anchor':'middle','font-family':'Nunito,sans-serif','font-weight':700},o),s);
const R=(x,y,w,h,o={})=>S('rect',Object.assign({x,y,width:w,height:h,rx:8,fill:'var(--paper)',stroke:'var(--ink)','stroke-width':2.5},o));
const L=(x1,y1,x2,y2,o={})=>S('line',Object.assign({x1,y1,x2,y2,stroke:'var(--ink)','stroke-width':2.5,'stroke-linecap':'round'},o));
const C=(cx,cy,r,o={})=>S('circle',Object.assign({cx,cy,r,fill:'var(--paper)',stroke:'var(--ink)','stroke-width':2.5},o));
const Pth=(d,o={})=>S('path',Object.assign({d,fill:'none',stroke:'var(--ink)','stroke-width':3,'stroke-linecap':'round','stroke-linejoin':'round'},o));
const setA=(e,o)=>{for(const k in o)e.setAttribute(k,o[k]);return e};
const tween=(ctx,dur,fn,done)=>{let t=0;ctx.raf(dt=>{t+=dt;const p=clamp(t/dur,0,1);fn(p);if(p>=1){if(done)done();return false}})};
const ease=p=>p<.5?2*p*p:1-Math.pow(-2*p+2,2)/2;
const fmt=(v,d=1)=>String(+v.toFixed(d));
const Q=(t,q,o,a,why)=>({t:'mcq',q,o,a,why});
const N=(q,a,u,why,tol)=>({t:'num',q,a,u,why,tol});
const thumb=pts=>{const s=S('svg',{viewBox:'0 0 100 70',width:110,height:77});s.append(S('path',{d:'M8 62H94M8 62V6',stroke:'var(--ink)','stroke-width':2,fill:'none'}));s.append(S('path',{d:pts.map((p,i)=>(i?'L':'M')+(8+p[0]*0.86)+' '+(62-p[1]*0.9)).join(''),stroke:'var(--cold)','stroke-width':4,fill:'none','stroke-linejoin':'round'}));return s};

/* ===== 1.1 ===== */
SCENES.push({id:'1.1',act:'qty',title:'What is a physical quantity?',idea:'A quantity is a number plus a unit',
 setup(ctx){
  const s=ctx.svg();const cards=[];const defs=[
   ['length','metre rule',g=>{g.append(R(25,52,110,26,{fill:'#f2d27a'}));for(let i=0;i<=10;i++)g.append(L(30+i*10,52,30+i*10,i%5?62:70,{'stroke-width':1.5}))}],
   ['mass','balance',g=>{g.append(R(25,70,110,22,{fill:'var(--metal)'}));g.append(R(45,48,70,10,{fill:'var(--paper)'}));g.append(T(80,89,'kg',{'font-size':15,fill:'#fff'}))}],
   ['time','stopwatch',g=>{g.append(C(80,64,34,{fill:'var(--paper)'}));g.append(L(80,64,80,40));g.append(L(80,64,98,70,{stroke:'var(--hot)'}));g.append(R(72,22,16,10,{rx:3}))}],
   ['volume of liquid','measuring cylinder',g=>{g.append(R(60,26,40,78,{rx:4}));g.append(R(60,56,40,48,{rx:4,fill:'var(--water)',stroke:'none'}));g.append(R(60,26,40,78,{rx:4,fill:'none'}));for(let i=0;i<5;i++)g.append(L(60,36+i*14,72,36+i*14,{'stroke-width':1.5}))}]];
  defs.forEach((d,i)=>{const g=S('g',{transform:`translate(${28+i*190} 28)`,opacity:.55});g.append(R(0,0,160,170,{fill:'var(--paper)',rx:16,'stroke-width':2}));const inner=S('g');d[2](inner);g.append(inner,T(80,138,d[0],{'font-size':18}),T(80,160,d[1],{'font-size':14,fill:'var(--muted)','font-weight':600}));s.append(g);cards.push(g)});
  const num=T(310,355,'5',{'font-size':130,'font-family':'Fredoka,sans-serif','text-anchor':'middle',fill:'var(--ink)'});
  const unit=T(520,355,'kg',{'font-size':100,'font-family':'Fredoka,sans-serif','text-anchor':'start',fill:'var(--accent)',opacity:0});
  const q=T(450,355,'?',{'font-size':100,fill:'var(--muted)',opacity:0,'font-family':'Fredoka,sans-serif'});
  const note=T(400,420,'',{'font-size':22,fill:'var(--muted)'});
  s.append(num,q,unit,note);return {cards,num,unit,q,note};
 },
 steps:[
  {k:'watch',run(S,ctx){S.cards.forEach(c=>c.setAttribute('opacity',.55));S.unit.setAttribute('opacity',0);S.q.setAttribute('opacity',0);S.num.setAttribute('x',310);S.note.textContent='';
   S.cards.forEach((c,i)=>ctx.after(900+i*1800,()=>{S.cards.forEach(x=>x.setAttribute('opacity',.55));c.setAttribute('opacity',1);S.note.textContent=['Length','Mass','Time','Volume'][i]+' can be measured'}))}},
  {k:'watch',run(S,ctx){S.cards.forEach(c=>c.setAttribute('opacity',.35));S.note.textContent='5 on its own means nothing';S.q.setAttribute('opacity',1);S.unit.setAttribute('opacity',0);S.num.setAttribute('x',310);
   ctx.after(3500,()=>{S.q.setAttribute('opacity',0);S.note.textContent='';let x=800;tween(ctx,1.2,p=>{x=800-(800-405)*ease(p);S.num.setAttribute('x',310+ (x-405)*0);S.unit.setAttribute('x',x);S.unit.setAttribute('opacity',1)},()=>{S.note.textContent='5 kg: now it means something';S.unit.setAttribute('fill','var(--good)')})})}},
  {k:'predict',q:'Which unit measures the mass of a bag of rice?',opts:['kg','m','s','cm³'],ans:0,why:'Mass is measured in kilograms (kg).',run(S){S.cards.forEach((c,i)=>c.setAttribute('opacity',i===1?1:.35))}},
  {k:'try',build(S,ctx,host){const h=ctx.panel;
   matchGame(h,{help:'Tap a unit, then tap the quantity it measures.',items:[
    {label:'kg',to:'mass',hint:'kg is a unit of mass.'},{label:'m',to:'length',hint:'Metre: the unit of length.'},{label:'s',to:'time',hint:'Seconds measure time.'},{label:'cm³',to:'vol',hint:'Used for the volume of a liquid.'},{label:'°C',to:'temp',hint:'Degrees Celsius.'},{label:'m/s',to:'speed',hint:'Distance divided by time.'}],
    buckets:[{id:'mass',label:'Mass'},{id:'length',label:'Length'},{id:'time',label:'Time'},{id:'vol',label:'Volume of liquid'},{id:'temp',label:'Temperature'},{id:'speed',label:'Speed'}],onDone:ctx.done})}},
  {k:'sum',take:'Quantity = number + unit. Length: metre (m). Mass: kilogram (kg). Time: second (s). Volume: cm³.',run(S){S.cards.forEach(c=>c.setAttribute('opacity',1))}}],
 quiz:[Q('t','What are the two parts of a physical quantity?',['A number and a unit','A name and a number','A unit and an instrument','A symbol and a name'],0,'Always write the number with its unit.'),
  Q('t','Which instrument measures the volume of a liquid?',['Measuring cylinder','Balance','Stopwatch','Thermometer'],0,'A measuring cylinder is marked in cm³.'),
  Q('t','What is the SI unit of mass?',['gram','kilogram','newton','tonne'],1,'The SI unit of mass is the kilogram (kg).')]});

/* ===== 1.2 ===== */
SCENES.push({id:'1.2',act:'qty',title:'Measuring and converting',idea:'Eye level with the meniscus; unit ladder',
 setup(ctx){
  const s=ctx.svg(),cx=110,top=40,hgt=340,lvl=36,pxv=hgt/100;
  const y=v=>top+hgt-v*pxv;
  s.append(R(cx,top,90,hgt,{rx:6,fill:'none'}));
  s.append(S('path',{d:`M${cx+2} ${y(lvl)-8}Q${cx+45} ${y(lvl)+10} ${cx+88} ${y(lvl)-8}V${top+hgt-2}H${cx+2}Z`,fill:'var(--water)',stroke:'var(--cold)','stroke-width':2}));
  for(let v=0;v<=100;v+=10){s.append(L(cx,y(v),cx+(v%50?18:28),y(v),{'stroke-width':2}));s.append(T(cx-8,y(v)+6,String(v),{'text-anchor':'end','font-size':15,fill:'var(--muted)'}))}
  s.append(T(cx+45,top-12,'cm³',{'font-size':16,fill:'var(--muted)'}));
  const eye=S('g');const ey=y(lvl)+6;
  eye.append(S('ellipse',{cx:0,cy:0,rx:30,ry:18,fill:'#fff',stroke:'var(--ink)','stroke-width':3}),C(0,0,11,{fill:'var(--cold)'}),C(0,0,4,{fill:'#000'}));
  const sight=L(0,0,0,0,{stroke:'var(--hot)','stroke-dasharray':'8 6','stroke-width':3});
  const mark=S('g');mark.append(S('path',{d:`M${cx+98} ${y(lvl)}h70`,stroke:'var(--accent)','stroke-width':3}));
  const read=T(320,70,'',{'font-size':30,'font-family':'Fredoka,sans-serif','text-anchor':'start'});
  const lab=T(cx+170,y(lvl)-10,'meniscus',{'text-anchor':'start','font-size':20,fill:'var(--accent)'});
  s.append(sight,eye,read,lab);
  const set=off=>{const yy=y(lvl)+off;eye.setAttribute('transform',`translate(400 ${yy})`);setA(sight,{x1:370,y1:yy,x2:cx+90,y2:y(lvl)});const shown=lvl-off/pxv*0.7;read.textContent='Reading: '+fmt(shown,1)+' cm³';read.setAttribute('fill',Math.abs(off)<5?'var(--good)':'var(--hot)');return shown};
  set(0);
  const ladder=S('g',{opacity:.25});const us=[['km',0],['m',1],['cm',2],['mm',3]];
  us.forEach((u,i)=>{ladder.append(R(560,40+i*92,130,56,{fill:'var(--paper)'}),T(625,78+i*92,u[0],{'font-size':28,'font-family':'Fredoka,sans-serif'}))});
  [['×1000',0],['×100',1],['×10',2]].forEach(a=>{ladder.append(Pth(`M740 ${68+a[1]*92}V${108+a[1]*92}`,{stroke:'var(--accent)','stroke-width':3}),T(745,96+a[1]*92,a[0],{'text-anchor':'start','font-size':17,fill:'var(--accent)'}))});
  s.append(ladder);
  return {s,set,eye,sight,read,lab,ladder,y,lvl,ladderHi:null};
 },
 steps:[
  {k:'watch',run(S,ctx){S.ladder.setAttribute('opacity',.25);let o=-70;S.set(o);tween(ctx,2.5,p=>S.set(-70*(1-ease(p))))}},
  {k:'try',build(S,ctx){const h=ctx.panel;const sl=H('input',{type:'range',min:-90,max:90,value:-60,id:'eyeS','aria-label':'Eye height'});let found=false;
   const out=H('div',{class:'fb info'},'Slide the eye until the reading is right.');
   const upd=()=>{const off=+sl.value;S.set(off);if(Math.abs(off)<6&&!found){found=true;out.className='fb good';out.textContent='Yes! Eye level with the bottom of the meniscus gives 36 cm³.';ctx.done()}else if(Math.abs(off)>=6){out.className='fb info';out.textContent=off<0?'Eye too high: the reading looks different.':'Eye too low: the reading looks different.'}};
   sl.oninput=upd;S.set(-60);h.append(H('div',{class:'field'},H('label',{for:'eyeS'},'Eye height'),sl),out)}},
  {k:'watch',run(S,ctx){S.ladder.setAttribute('opacity',1);S.set(0);}},
  {k:'try',build(S,ctx){const h=ctx.panel;
   const U={length:{km:1000,m:1,cm:.01,mm:.001},mass:{kg:1000,g:1,mg:.001},time:{h:3600,min:60,s:1}};
   const sel=H('select',{id:'qsel'},Object.keys(U).map(k=>H('option',{value:k},k)));
   const val=H('input',{type:'number',value:3.5,step:'any',id:'v'}),f=H('select',{id:'f'}),t=H('select',{id:'t'});
   const fill=()=>{[f,t].forEach(x=>{x.innerHTML='';Object.keys(U[sel.value]).forEach(u=>x.append(H('option',{value:u},u)))});t.selectedIndex=1};
   sel.onchange=fill;fill();f.value=Object.keys(U.length)[0];
   const out=H('div',{class:'fb info'},'Press Convert.');let n=0;
   const go=H('button',{class:'btn small',onclick:()=>{const tbl=U[sel.value],a=+val.value,r=tbl[f.value]/tbl[t.value],res=a*r;
     out.className='fb good';out.innerHTML=`<span class="mono">${fmt(a,3)} ${f.value} = ${fmt(res,4)} ${t.value}</span><br>${r>1?'Smaller unit, bigger number: multiply by '+fmt(r,3):r<1?'Bigger unit, smaller number: divide by '+fmt(1/r,3):'Same unit.'}`;
     if(++n>=3)ctx.done()}},'Convert');
   h.append(H('div',{class:'field'},H('label',{for:'qsel'},'Quantity'),sel),H('div',{class:'row'},H('div',{class:'field',style:'flex:1'},H('label',{for:'v'},'Number'),val),H('div',{class:'field',style:'flex:1'},H('label',{for:'f'},'From'),f),H('div',{class:'field',style:'flex:1'},H('label',{for:'t'},'To'),t)),go,out)}},
  {k:'sum',take:'Eye level with the bottom of the meniscus. Smaller unit = bigger number. Repeat readings and take the mean.'}],
 quiz:[N('Convert 3.5 kg into grams.',3500,'g','1 kg = 1000 g, so 3.5 × 1000 = 3500 g.'),N('Convert 450 cm into metres.',4.5,'m','100 cm = 1 m, so 450 ÷ 100 = 4.5 m.'),
  Q('t','Where should your eye be when reading a measuring cylinder?',['Level with the bottom of the meniscus','Above the water surface','Below the water surface','Anywhere is fine'],0,'This avoids a parallax error.')]});

/* ===== 1.3 ===== */
SCENES.push({id:'1.3',act:'qty',title:'Speed and derived units',idea:'Speed = distance ÷ time; km/h ÷ 3.6 = m/s',
 setup(ctx){
  const s=ctx.svg();s.append(R(30,250,740,70,{fill:'var(--metal)',stroke:'none',rx:4}));
  for(let i=0;i<=10;i++){s.append(L(60+i*68,250,60+i*68,335,{'stroke-width':2,stroke:'var(--ink)'}));s.append(T(60+i*68,358,String(i*40)+' m',{'font-size':15,fill:'var(--muted)'}))}
  for(let i=0;i<12;i++)s.append(L(40+i*64,285,70+i*64,285,{stroke:'#fff','stroke-width':4,'stroke-dasharray':'20 14'}));
  const car=S('g');car.append(R(-40,-34,80,28,{fill:'var(--hot)',rx:8}),R(-22,-54,44,24,{fill:'var(--cold-soft)',rx:6}),C(-24,-4,10,{fill:'var(--ink)'}),C(24,-4,10,{fill:'var(--ink)'}));car.setAttribute('transform','translate(60 285)');
  const f=T(400,70,'speed = distance ÷ time',{'font-size':40,'font-family':'Fredoka,sans-serif',fill:'var(--accent)'});
  const clock=T(400,130,'',{'font-size':30}),res=T(400,190,'',{'font-size':34,'font-family':'Fredoka,sans-serif',fill:'var(--hot)'});
  s.append(car,f,clock,res);
  const place=(d)=>car.setAttribute('transform',`translate(${60+d/400*680} 285)`);
  return {car,f,clock,res,place,s};
 },
 steps:[
  {k:'watch',run(S,ctx){S.place(0);S.res.textContent='';S.clock.textContent='Speed tells you how far you go every second'}},
  {k:'watch',run(S,ctx){S.place(0);S.clock.textContent='';tween(ctx,5,p=>{S.place(150*p);S.clock.textContent=`${fmt(150*p,0)} m in ${fmt(10*p,1)} s`},()=>{S.res.textContent='150 ÷ 10 = 15 m/s'})}},
  {k:'predict',q:'Which is faster?',opts:['20 m/s','60 km/h','They are the same'],ans:0,why:'60 km/h ÷ 3.6 = 16.7 m/s, so 20 m/s is faster.',run(S){S.res.textContent='20 m/s  or  60 km/h ?'}},
  {k:'try',build(S,ctx){const h=ctx.panel;let d=200,t=10,kmh=false,ran=false;
   const sd=H('input',{type:'range',min:50,max:400,step:10,value:d,id:'sd','aria-label':'Distance'}),st=H('input',{type:'range',min:2,max:40,step:1,value:t,id:'st','aria-label':'Time'});
   const out=H('div',{class:'fb info mono'}),upd=()=>{d=+sd.value;t=+st.value;const v=d/t;out.innerHTML=kmh?`${fmt(v,2)} m/s × 3.6 = ${fmt(v*3.6,1)} km/h`:`${d} ÷ ${t} = ${fmt(v,2)} m/s`;S.res.textContent=out.textContent;S.place(0);S.clock.textContent=''};
   sd.oninput=upd;st.oninput=upd;upd();let tgl;
   const run=H('button',{class:'btn small',onclick:()=>{ran=true;tween(ctx,Math.max(1.5,t/4),p=>{S.place(d*p);S.clock.textContent=`${fmt(d*p,0)} m in ${fmt(t*p,1)} s`},()=>{if(ran&&kmh)ctx.done()})}},'Run the car');
   tgl=H('button',{class:'btn small ghost',onclick:()=>{kmh=!kmh;tgl.textContent=kmh?'Show in m/s':'Show in km/h';upd();if(ran)ctx.done()}},'Show in km/h');
   h.append(H('div',{class:'field'},H('label',{for:'sd'},'Distance (m)'),sd),H('div',{class:'field'},H('label',{for:'st'},'Time (s)'),st),out,H('div',{class:'row'},run,tgl))}},
  {k:'sum',take:'speed = distance ÷ time. km/h ÷ 3.6 = m/s. m/s × 3.6 = km/h.'}],
 quiz:[N('A car travels 150 m in 10 s. What is its speed in m/s?',15,'m/s','150 ÷ 10 = 15 m/s.'),N('Convert 72 km/h into m/s.',20,'m/s','72 ÷ 3.6 = 20 m/s.'),N('A runner covers 400 m in 50 s. What is her average speed in m/s?',8,'m/s','400 ÷ 50 = 8 m/s.')]});

/* ===== 2.1 ===== */
const motionStage=(ctx,xmax,ymax,xs,ys,xl,yl)=>{const s=ctx.svg();const g=mkGraph(s,{x:90,y:175,w:620,h:190,xmax,ymax,xs,ys,xl,yl});return {s,g}};
SCENES.push({id:'2.1',act:'motion',title:'Distance-time graphs',idea:'Gradient = speed; flat = stopped',
 setup(ctx){
  const {s,g}=motionStage(ctx,50,150,10,25,'Time (s)','Distance (m)');
  s.append(R(30,40,740,62,{fill:'var(--metal)',stroke:'none',rx:4}));for(let i=0;i<=10;i++)s.append(L(70+i*68,40,70+i*68,102,{'stroke-width':1.5,stroke:'var(--ink)',opacity:.5}));
  const bike=S('g');bike.append(C(-24,-6,16,{fill:'none','stroke-width':3.5}),C(24,-6,16,{fill:'none','stroke-width':3.5}),Pth('M-24 -6L-6 -34L14 -34L24 -6M-6 -34L-12 -6L14 -34'),C(-2,-52,10,{fill:'#f1be99'}),Pth('M-2 -44L-4 -34'));
  bike.setAttribute('transform','translate(70 98)');s.append(bike);
  const path=S('path',{d:'',fill:'none',stroke:'var(--cold)','stroke-width':5,'stroke-linejoin':'round'}),dot=C(g.X(0)+90,g.Y(0)+175,7,{fill:'var(--hot)'});
  s.append(path);s.append(dot);
  const note=T(400,150,'',{'font-size':20,fill:'var(--accent)'});s.append(note);
  const upd=(t,d)=>{bike.setAttribute('transform',`translate(${70+d/150*680} 98)`);dot.setAttribute('cx',90+g.X(t));dot.setAttribute('cy',175+g.Y(d))};
  return {s,g,path,dot,bike,note,upd,pts:[[0,0]]};
 },
 steps:[
  {k:'watch',run(S,ctx){const sc=[[0,0],[20,60],[30,60],[50,140]];const dist=t=>{if(t<=20)return t*3;if(t<=30)return 60;return 60+(t-30)*4};S.note.textContent='';
   S.path.setAttribute('d','');let pts=[];tween(ctx,10,p=>{const t=p*50,d=dist(t);pts.push([t,d]);S.path.setAttribute('d',S.g.D(pts).replace(/M([\d.]+) ([\d.]+)/,(m,a,b)=>`M${+a+90} ${+b+175}`).replace(/L([\d.]+) ([\d.]+)/g,(m,a,b)=>`L${+a+90} ${+b+175}`));S.upd(t,d)})}},
  {k:'watch',run(S,ctx){const g=S.g,off=(a,b)=>[90+g.X(a),175+g.Y(b)];const d=[[0,0],[20,60],[30,60],[50,140]].map((p,i)=>(i?'L':'M')+off(p[0],p[1]).join(' ')).join('');S.path.setAttribute('d',d);S.upd(50,140);
   S.note.textContent='Rides steadily...';ctx.after(2500,()=>{S.note.textContent='Flat line = stopped (20 s to 30 s)';S.note.setAttribute('fill','var(--hot)')});ctx.after(6000,()=>{S.note.textContent='Steeper line = faster (30 s to 50 s)';S.note.setAttribute('fill','var(--good)')})}},
  {k:'predict',q:'Which graph shows: slow, then stopped, then faster?',opts:[thumb([[0,0],[25,12],[50,12],[100,70]]),thumb([[0,0],[25,50],[50,50],[100,62]]),thumb([[0,0],[33,12],[66,28],[100,60]])],ans:0,why:'Slow (gentle slope), stopped (flat), then faster (steeper).'},
  {k:'try',build(S,ctx){const h=ctx.panel;let mode='stop',t=0,d=0,used=new Set(),pts=[[0,0]];const sp={slow:1.5,fast:3.5,stop:0};
   S.path.setAttribute('d','');S.upd(0,0);
   const off=()=>pts.map((p,i)=>(i?'L':'M')+(90+S.g.X(p[0]))+' '+(175+S.g.Y(p[1]))).join('');
   ctx.raf(dt=>{if(t>=50||d>=150)return;const k=1.2;t+=dt*k;d+=sp[mode]*dt*k;d=Math.min(d,150);pts.push([Math.min(t,50),d]);S.path.setAttribute('d',off());S.upd(Math.min(t,50),d)});
   const mk=(m,l,c)=>H('button',{class:'btn '+c,onclick:()=>{mode=m;used.add(m);if(used.size===3)ctx.done()}},l);
   h.append(H('p',{class:'hint'},'Change the riding speed any time. Try all three.'),H('div',{class:'row'},mk('slow','Slow','cold'),mk('fast','Fast','hot'),mk('stop','Stop','ghost')),H('button',{class:'btn ghost small',onclick:()=>{t=0;d=0;pts=[[0,0]];S.path.setAttribute('d','');S.upd(0,0)}},'Start again'))}},
  {k:'sum',take:'Distance-time graph: flat = stopped. Steeper = faster. Gradient = speed.'}],
 quiz:[Q('t','On a distance-time graph, a horizontal line means the object is...',['stationary','moving at constant speed','speeding up','slowing down'],0,'The distance is not changing, so it is stopped.'),
  Q('t','Two lines on a distance-time graph: line P is steeper than line Q. Which object is faster?',['P','Q','Both the same','Cannot tell'],0,'A steeper line has a bigger gradient, so a higher speed.'),
  Q('t','What does the gradient of a distance-time graph show?',['Speed','Acceleration','Distance','Time'],0,'Gradient = distance ÷ time = speed.')]});

/* ===== 2.2 ===== */
SCENES.push({id:'2.2',act:'motion',title:'Reading distance-time graphs',idea:'Rise ÷ run; average speed uses total distance',
 setup(ctx){
  const {s,g}=motionStage(ctx,50,150,10,25,'Time (s)','Distance (m)');g.g.setAttribute('transform','translate(90 40)');
  const X=v=>90+g.X(v),Y=v=>40+g.Y(v);
  const P=[[0,0],[20,60],[30,60],[50,140]];
  s.append(S('path',{d:P.map((p,i)=>(i?'L':'M')+X(p[0])+' '+Y(p[1])).join(''),fill:'none',stroke:'var(--cold)','stroke-width':5,'stroke-linejoin':'round'}));
  const tri=S('g');s.append(tri);const note=T(400,432,'',{'font-size':24,'font-family':'Fredoka,sans-serif',fill:'var(--hot)'});s.append(note);
  const dots=P.map((p,i)=>{const c=C(X(p[0]),Y(p[1]),11,{fill:'var(--paper)',stroke:'var(--cold)','stroke-width':4,class:'hit'});s.append(c);return c});
  const showTri=(a,b)=>{tri.innerHTML='';const [t1,d1]=P[a],[t2,d2]=P[b];tri.append(S('path',{d:`M${X(t1)} ${Y(d1)}H${X(t2)}V${Y(d2)}`,fill:'var(--hot-soft)',stroke:'var(--hot)','stroke-width':3,'stroke-dasharray':'8 5',opacity:.9}));
   tri.append(T((X(t1)+X(t2))/2,Y(d1)+22,'run '+Math.abs(t2-t1)+' s',{'font-size':17,fill:'var(--hot)'}),T(X(t2)+(t2>=t1?36:-36),(Y(d1)+Y(d2))/2,'rise '+Math.abs(d2-d1)+' m',{'font-size':17,fill:'var(--hot)'}))};
  return {s,g,P,tri,note,dots,showTri,X,Y};
 },
 steps:[
  {k:'watch',run(S,ctx){S.tri.innerHTML='';S.note.textContent='';ctx.after(1500,()=>{S.showTri(2,3);S.note.textContent='rise = 80 m, run = 20 s'})}},
  {k:'watch',run(S,ctx){S.showTri(2,3);S.note.textContent='80 ÷ 20 = 4 m/s'}},
  {k:'predict',q:'To find the average speed for the whole trip we use...',opts:['total distance ÷ total time','the speed of the fastest section','the speed of the last section'],ans:0,why:'Average speed = total distance ÷ total time, including any time stopped.',run(S){S.tri.innerHTML='';S.note.textContent='whole trip: 140 m in 50 s'}},
  {k:'try',build(S,ctx){const h=ctx.panel;let first=null,pairs=new Set();const out=H('div',{class:'fb info mono'},'Tap two points on the graph.');
   S.tri.innerHTML='';S.note.textContent='';
   S.dots.forEach((c,i)=>{c.onclick=()=>{if(first===null){first=i;S.dots.forEach(x=>x.setAttribute('fill','var(--paper)'));c.setAttribute('fill','var(--hot)');out.textContent='Now tap a second point.';return}
     if(i===first)return;const a=Math.min(first,i),b=Math.max(first,i);S.showTri(a,b);const [t1,d1]=S.P[a],[t2,d2]=S.P[b];const v=(d2-d1)/(t2-t1);
     out.className='fb good mono';out.innerHTML=`(${d2} − ${d1}) ÷ (${t2} − ${t1}) = ${fmt(v,2)} m/s`+(v===0?'<br>Flat: not moving.':'');S.note.textContent=fmt(v,2)+' m/s';
     pairs.add(a+'-'+b);first=null;S.dots.forEach(x=>x.setAttribute('fill','var(--paper)'));if(pairs.size>=3)ctx.done()}});
   h.append(out,H('button',{class:'btn small ghost',onclick:()=>{out.className='fb good mono';out.textContent='Average: 140 m ÷ 50 s = 2.8 m/s';S.note.textContent='average 2.8 m/s';S.tri.innerHTML=''}},'Show the average speed'))}},
  {k:'sum',take:'speed = rise ÷ run. Average speed = total distance ÷ total time.'}],
 quiz:[N('Using this graph, what is the speed between 0 and 20 s (in m/s)?',3,'m/s','60 m ÷ 20 s = 3 m/s.'),N('What is the average speed for the whole 50 s (in m/s)?',2.8,'m/s','140 ÷ 50 = 2.8 m/s.'),
  Q('t','What does a gradient of zero on a distance-time graph mean?',['The object is stopped','The object moves at constant speed','The object is accelerating','The object is falling'],0,'No change in distance, so no movement.')]});

/* ===== 2.3 ===== */
SCENES.push({id:'2.3',act:'motion',title:'Velocity-time graphs',idea:'Gradient = acceleration; flat = constant velocity',
 setup(ctx){
  const {s,g}=motionStage(ctx,40,25,5,5,'Time (s)','Velocity (m/s)');
  s.append(R(30,36,740,60,{fill:'var(--metal)',stroke:'none',rx:4}));
  const lanes=S('g');for(let i=0;i<14;i++)lanes.append(L(i*60,66,i*60+30,66,{stroke:'#fff','stroke-width':4}));s.append(lanes);
  const car=S('g');car.append(R(-40,-30,80,26,{fill:'var(--cold)',rx:8}),R(-20,-48,40,22,{fill:'var(--cold-soft)',rx:6}),C(-22,-4,9,{fill:'var(--ink)'}),C(22,-4,9,{fill:'var(--ink)'}));car.setAttribute('transform','translate(400 92)');s.append(car);
  const path=S('path',{fill:'none',stroke:'var(--hot)','stroke-width':5,'stroke-linejoin':'round'});s.append(path);
  const read=T(400,145,'',{'font-size':22,fill:'var(--accent)'});s.append(read);
  let off=0;const upd=v=>{off=(off+v*0.9)%60;lanes.setAttribute('transform','translate('+(-off)+' 0)')};
  const drawPts=pts=>path.setAttribute('d',pts.map((p,i)=>(i?'L':'M')+(90+g.X(p[0]))+' '+(175+g.Y(p[1]))).join(''));
  return {s,g,path,car,read,upd,drawPts,lanes};
 },
 steps:[
  {k:'watch',run(S,ctx){const vel=t=>t<=10?2*t:t<=30?20:Math.max(0,20-(t-30)*2);let pts=[];S.read.textContent='';tween(ctx,10,p=>{const t=p*40,v=vel(t);pts.push([t,v]);S.drawPts(pts);S.upd(v);S.read.textContent='speedometer: '+fmt(v,0)+' m/s'})}},
  {k:'watch',run(S,ctx){S.drawPts([[0,0],[10,20],[30,20],[40,0]]);S.read.textContent='Slope up: speeding up';S.read.setAttribute('fill','var(--hot)');ctx.after(2500,()=>{S.read.textContent='Flat: constant velocity (NOT stopped)';S.read.setAttribute('fill','var(--good)')});ctx.after(6000,()=>{S.read.textContent='Slope down: slowing down';S.read.setAttribute('fill','var(--cold)')})}},
  {k:'predict',q:'0 to 20 m/s in 10 s. What is the acceleration?',opts:['2 m/s²','20 m/s²','0.5 m/s²','200 m/s²'],ans:0,why:'20 ÷ 10 = 2 m/s²: the speed rises by 2 m/s every second.'},
  {k:'try',build(S,ctx){const h=ctx.panel;let v=0,t=0,mode='coast',used=new Set(),pts=[[0,0]];S.drawPts(pts);S.read.textContent='';
   ctx.raf(dt=>{if(t>=40)return;const k=1.5;t+=dt*k;v=clamp(v+(mode==='gas'?2.2:mode==='brake'?-3:0)*dt*k,0,25);pts.push([Math.min(t,40),v]);S.drawPts(pts);S.upd(v);S.read.textContent=`speed ${fmt(v,1)} m/s`});
   const mk=(m,l,c)=>{const b=H('button',{class:'btn '+c,onpointerdown:()=>{mode=m;used.add(m);if(used.has('gas')&&used.has('brake'))ctx.done()},onpointerup:()=>{mode='coast'},onpointerleave:()=>{mode='coast'}},l);return b};
   h.append(H('p',{class:'hint'},'Hold a button. Let go to coast at steady speed.'),H('div',{class:'row'},mk('gas','Throttle','hot'),mk('brake','Brake','cold')),
    H('button',{class:'btn ghost small',onclick:()=>{t=0;v=0;pts=[[0,0]];S.drawPts(pts)}},'Start again'))}},
  {k:'sum',take:'Velocity-time: slope = acceleration. Flat = constant velocity. a = change in velocity ÷ time (m/s²).'}],
 quiz:[N('A car goes from 0 to 30 m/s in 6 s. What is its acceleration (m/s²)?',5,'m/s²','30 ÷ 6 = 5 m/s².'),
  Q('t','On a velocity-time graph a horizontal line means...',['constant velocity','stopped','speeding up','slowing down'],0,'The velocity is not changing, so the speed is steady.'),
  Q('t','A line sloping downwards on a velocity-time graph shows the object is...',['slowing down','speeding up','stopped','moving backwards at constant speed'],0,'The velocity is decreasing.')]});

/* ===== 2.4 ===== */
SCENES.push({id:'2.4',act:'motion',title:'Area under a velocity-time graph',idea:'Area = distance travelled',
 setup(ctx){
  const {s,g}=motionStage(ctx,40,25,5,5,'Time (s)','Velocity (m/s)');g.g.setAttribute('transform','translate(90 30)');
  const X=v=>90+g.X(v),Y=v=>30+g.Y(v);
  const tri1=S('path',{d:`M${X(0)} ${Y(0)}L${X(10)} ${Y(20)}V${Y(0)}Z`,fill:'var(--hot)',opacity:0}),rect=S('path',{d:`M${X(10)} ${Y(0)}V${Y(20)}H${X(30)}V${Y(0)}Z`,fill:'var(--cold)',opacity:0}),tri2=S('path',{d:`M${X(30)} ${Y(0)}V${Y(20)}L${X(40)} ${Y(0)}Z`,fill:'var(--good)',opacity:0});
  s.append(tri1,rect,tri2,S('path',{d:`M${X(0)} ${Y(0)}L${X(10)} ${Y(20)}H${X(30)}L${X(40)} ${Y(0)}`,fill:'none',stroke:'var(--ink)','stroke-width':4,'stroke-linejoin':'round'}));
  const lbl=[T(X(5),Y(6),'',{'font-size':18,fill:'#fff'}),T(X(20),Y(10),'',{'font-size':24,fill:'#fff'}),T(X(35),Y(6),'',{'font-size':18,fill:'#fff'})];lbl.forEach(l=>s.append(l));
  const note=T(400,432,'',{'font-size':24,'font-family':'Fredoka,sans-serif',fill:'var(--accent)'});s.append(note);
  return {s,tri1,rect,tri2,lbl,note};
 },
 steps:[
  {k:'watch',run(S,ctx){[S.tri1,S.rect,S.tri2].forEach(e=>{e.setAttribute('opacity',0)});S.lbl.forEach(l=>l.textContent='');S.note.textContent='';
   [S.tri1,S.rect,S.tri2].forEach((e,i)=>ctx.after(800+i*500,()=>{e.setAttribute('fill','var(--cold)');e.setAttribute('opacity',.45)}));ctx.after(2800,()=>S.note.textContent='The area under the line = distance travelled')}},
  {k:'watch',run(S,ctx){const cols=['var(--hot)','var(--cold)','var(--good)'];[S.tri1,S.rect,S.tri2].forEach((e,i)=>{e.setAttribute('fill',cols[i]);e.setAttribute('opacity',.75)});
   ctx.after(800,()=>S.lbl[0].textContent='½×10×20');ctx.after(2200,()=>S.lbl[1].textContent='20 × 20');ctx.after(3600,()=>S.lbl[2].textContent='½×10×20');S.note.textContent='Triangle, rectangle, triangle'}},
  {k:'predict',q:'20 m/s for 20 s. How far?',opts:['400 m','40 m','1 m','200 m'],ans:0,why:'Rectangle: 20 × 20 = 400 m.'},
  {k:'try',build(S,ctx){const h=ctx.panel;const info=[['Triangle 1: ½ × 10 × 20 = 100 m',S.tri1],['Rectangle: 20 × 20 = 400 m',S.rect],['Triangle 2: ½ × 10 × 20 = 100 m',S.tri2]];let seen=new Set();
   const fb=H('div',{class:'fb info'},'Tap each piece to reveal its area.');const inp=H('input',{type:'text',inputmode:'decimal',placeholder:'Total distance (m)',id:'tot'});
   const btns=info.map((f,i)=>H('button',{class:'btn small ghost',onclick:()=>{fb.className='fb info mono';fb.textContent=f[0];seen.add(i);S.note.textContent=f[0];f[1].setAttribute('opacity',1)}},['Triangle 1','Rectangle','Triangle 2'][i]));
   const chk=H('button',{class:'btn small',onclick:()=>{if(+inp.value===600){fb.className='fb good mono';fb.textContent='100 + 400 + 100 = 600 m. Correct!';S.note.textContent='Total distance = 600 m';ctx.done()}else{fb.className='fb bad';fb.textContent='Add the three areas: 100 + 400 + 100.'}}},'Check');
   h.append(H('div',{class:'row'},btns),fb,H('div',{class:'row'},H('div',{class:'field',style:'flex:1'},inp),chk))}},
  {k:'sum',take:'Area under a velocity-time graph = distance. Rectangle = base × height. Triangle = ½ × base × height.'}],
 quiz:[N('A car travels at 12 m/s for 10 s. What distance does it cover (m)?',120,'m','12 × 10 = 120 m.'),N('A triangle on a velocity-time graph has base 8 s and height 12 m/s. What is its area (m)?',48,'m','½ × 8 × 12 = 48 m.'),
  Q('t','Which part of a velocity-time graph gives the distance travelled?',['The area under the line','The gradient','The y-intercept','The highest point'],0,'Area = velocity × time = distance.')]});
