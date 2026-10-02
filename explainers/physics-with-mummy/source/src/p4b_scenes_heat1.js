/* ---------- heat helpers ---------- */
const mix=(a,b,t)=>a.map((v,i)=>Math.round(v+(b[i]-v)*t));
const tcol=T=>{const c=mix([47,127,224],[238,90,58],clamp(T,0,1));return `rgb(${c[0]},${c[1]},${c[2]})`};
function bouncers(parent,w,h,n,r){const arr=[];for(let i=0;i<n;i++){const el=C(0,0,r,{stroke:'none'});parent.append(el);arr.push({el,x:rnd(r,w-r),y:rnd(r,h-r),a:rnd(0,6.28)})}
  return {arr,step(dt,speed,col){arr.forEach(p=>{p.a+=rnd(-.6,.6);p.x+=Math.cos(p.a)*speed*dt;p.y+=Math.sin(p.a)*speed*dt;if(p.x<r||p.x>w-r){p.a=Math.PI-p.a;p.x=clamp(p.x,r,w-r)}if(p.y<r||p.y>h-r){p.a=-p.a;p.y=clamp(p.y,r,h-r)}p.el.setAttribute('cx',p.x);p.el.setAttribute('cy',p.y);p.el.setAttribute('fill',col)})}}}

/* ===== 4.1 ===== */
SCENES.push({id:'4.1',act:'heat',title:'Thermal energy and temperature',idea:'Thermal energy flows from hot to cold',
 setup(ctx){
  const s=ctx.svg();const st={T:20,TA:90,TB:20,shift:0,flow:false};
  s.append(S('path',{d:'M60 120V400H360V120',fill:'none',stroke:'var(--ink)','stroke-width':4,'stroke-linejoin':'round'}),R(62,170,296,228,{fill:'var(--water)',stroke:'none',rx:0,opacity:.35}));
  const gb=S('g',{transform:'translate(62 170)'});s.append(gb);const bb=bouncers(gb,296,228,22,9);
  const lbT=T(210,100,'Water: 20 °C',{'font-size':26,'font-family':'Fredoka,sans-serif'});s.append(lbT);
  const mkBlock=(x,name)=>{const g=S('g',{transform:`translate(${x} 160)`});const body=R(0,0,120,190,{rx:10,stroke:'var(--ink)'});const pg=S('g',{transform:'translate(0 0)'});g.append(body,pg);const bn=bouncers(pg,120,190,10,8);s.append(g);return {g,body,bn,name}};
  const A=mkBlock(450,'A'),B=mkBlock(600,'B');
  const tA=T(510,140,'',{'font-size':26,'font-family':'Fredoka,sans-serif'}),tB=T(660,140,'',{'font-size':26,'font-family':'Fredoka,sans-serif'}),arrow=T(585,400,'',{'font-size':24,fill:'var(--accent)'});
  s.append(tA,tB,arrow);
  const render=()=>{A.g.setAttribute('transform',`translate(${450+st.shift} 160)`);setA(A.body,{fill:tcol(st.TA/100)});setA(B.body,{fill:tcol(st.TB/100)});tA.setAttribute('x',510+st.shift);tA.textContent=Math.round(st.TA)+' °C';tB.textContent=Math.round(st.TB)+' °C';lbT.textContent='Water: '+Math.round(st.T)+' °C'};
  ctx.bg.raf(dt=>{bb.step(dt,20+st.T*2.2,tcol(st.T/100));A.bn.step(dt,20+st.TA*2.2,'#fff');B.bn.step(dt,20+st.TB*2.2,'#fff');render()});
  return {s,st,render,arrow};
 },
 steps:[
  {k:'watch',run(S,ctx){S.st.TA=90;S.st.TB=20;S.st.shift=0;S.arrow.textContent='';tween(ctx,4,p=>{S.st.T=20+70*Math.sin(p*Math.PI*0.5)},()=>{tween(ctx,3,p=>{S.st.T=90-70*p})})}},
  {k:'watch',run(S,ctx){S.st.T=20;S.st.TA=90;S.st.TB=20;S.st.shift=0;S.arrow.textContent='';ctx.after(1500,()=>tween(ctx,1,p=>{S.st.shift=30*p},()=>{S.arrow.textContent='energy flows A → B';let t=0;ctx.raf(dt=>{t+=dt;const k=Math.exp(-t*.5);S.st.TA=55+35*k;S.st.TB=55-35*k})}))}},
  {k:'predict',q:'A hot cup of tea sits in a cool room. Thermal energy flows...',opts:['from the tea to the room','from the room to the tea','neither way'],ans:0,why:'Thermal energy always flows from the hotter object to the cooler one.',run(S){S.st.shift=0;S.st.TA=90;S.st.TB=20}},
  {k:'try',build(S,ctx){const h=ctx.panel;S.st.shift=0;S.st.TB=20;let used=new Set(),run=false;
   const s1=H('input',{type:'range',min:20,max:100,value:20,id:'bt','aria-label':'Water temperature'}),s2=H('input',{type:'range',min:40,max:100,value:90,id:'at','aria-label':'Block A temperature'});
   s1.oninput=()=>{S.st.T=+s1.value;used.add('b');chk()};s2.oninput=()=>{if(!run){S.st.TA=+s2.value;S.st.TB=20;S.st.shift=0;S.arrow.textContent=''}};
   const chk=()=>{if(used.size>=2)ctx.done()};
   const go=H('button',{class:'btn small',onclick:()=>{if(run)return;run=true;S.st.TA=+s2.value;S.st.TB=20;tween(ctx,1,p=>{S.st.shift=30*p},()=>{S.arrow.textContent='energy flows A → B';const a=S.st.TA,b=S.st.TB,m=(a+b)/2;let t=0;ctx.raf(dt=>{t+=dt;const k=Math.exp(-t*.5);S.st.TA=m+(a-m)*k;S.st.TB=m-(m-b)*k;if(t>6){used.add('a');chk()}})})}},'Bring the blocks together');
   h.append(H('div',{class:'field'},H('label',{for:'bt'},'Water temperature'),s1),H('div',{class:'field'},H('label',{for:'at'},'Block A starts at'),s2),go,H('button',{class:'btn small ghost',onclick:()=>{S.st.shift=0;S.st.TA=+s2.value;S.st.TB=20;S.arrow.textContent='';run=false}},'Reset blocks'))}},
  {k:'sum',take:'Thermal energy flows from hot to cold. Hotter = particles move faster.'}],
 quiz:[Q('t','Thermal energy always flows...',['from hot to cold','from cold to hot','equally both ways','only through air'],0,'Hot to cold, until both are at the same temperature.'),Q('t','What happens to particles when something is heated?',['They move faster','They stop moving','They get bigger','They disappear'],0,'More thermal energy means faster particle movement.'),
  Q('t','A hot block touches a cold block. After a long time, their temperatures are...',['the same','the hot one is still hotter','the cold one is hotter','both zero'],0,'Energy flows until the temperatures match.')]});

/* ===== 4.2 ===== */
SCENES.push({id:'4.2',act:'heat',title:'Conduction',idea:'Particles pass vibrations on; metals conduct best',
 setup(ctx){
  const s=ctx.svg();const st={t:0,scale:1,run:false,on:false};
  const chain=S('g');const P=[];for(let i=0;i<14;i++){const el=C(0,0,15,{fill:'var(--cold)',stroke:'var(--ink)'});chain.append(el);P.push({el,x:90+i*46,y:76})}
  s.append(L(60,76,740,76,{'stroke-width':3,opacity:.15}),chain,T(110,128,'hot end',{'font-size':18,fill:'var(--hot)'}),T(690,128,'cold end',{'font-size':18,fill:'var(--cold)'}));
  const rods=[['copper',60,'#d08a4a'],['iron',26,'#8c8c8c'],['glass',9,'#cfe7f0'],['wood',3.5,'#c9a36a']];
  const rodEls=[];const x0=170,len=540;
  s.append(R(130,170,30,260,{fill:'var(--hot)',stroke:'var(--ink)',rx:4}),T(145,448,'heat',{'font-size':18,fill:'var(--hot)'}));
  rods.forEach((r,i)=>{const y=190+i*62;const g=S('g');const body=R(x0,y,len,26,{fill:r[2],rx:4});const glow=S('rect',{x:x0,y,width:0,height:26,fill:'var(--hot)',opacity:.55,rx:4});
   g.append(body,glow,T(x0-8,y+20,r[0],{'text-anchor':'end','font-size':18}));const pins=[150,300,450].map(d=>{const pg=S('g');pg.append(S('line',{x1:x0+d,y1:y+26,x2:x0+d,y2:y+46,stroke:'var(--ink)','stroke-width':3}),C(x0+d,y+50,5,{fill:'var(--ink)'}),C(x0+d,y+26,5,{fill:'#f2e29a',stroke:'var(--ink)','stroke-width':1.5}));g.append(pg);return {pg,d,fall:0,done:false}});
   s.append(g);rodEls.push({r,y,glow,pins})});
  const clock=T(430,462,'time: 0 s',{'font-size':20,fill:'var(--muted)'});s.append(clock);
  const note=T(400,28,'',{'font-size':22,fill:'var(--accent)'});s.append(note);
  const reset=()=>{st.t=0;rodEls.forEach(e=>{e.glow.setAttribute('width',0);e.pins.forEach(p=>{p.fall=0;p.done=false;p.pg.setAttribute('transform','');p.pg.setAttribute('opacity',1)})})};
  ctx.bg.raf(dt=>{
    if(st.run)st.t+=dt*st.scale;
    const tt=st.t;clock.textContent='time: '+Math.round(tt)+' s';
    if(st.on)rodEls.forEach(e=>{const front=Math.min(len,e.r[1]*tt);e.glow.setAttribute('width',front);e.pins.forEach(p=>{if(front>=p.d&&!p.done){p.done=true}if(p.done&&p.fall<200){p.fall+=dt*220;p.pg.setAttribute('transform',`translate(0 ${p.fall})`);p.pg.setAttribute('opacity',Math.max(0,1-p.fall/200))}})});
    const fr=st.on?Math.min(1,tt/ (st.run?1:1)):0;
    const cf=(st.chain||0);P.forEach((p,i)=>{const amp=clamp((cf*680-(i*46))/150+.1,0,1)*(cf>0?9:0);p.el.setAttribute('cx',p.x+Math.sin(performance.now()/55+i)*amp);p.el.setAttribute('cy',p.y+Math.cos(performance.now()/48+i*2)*amp);p.el.setAttribute('fill',tcol(clamp((cf*680-i*46)/300,0,1)))});
  });
  return {s,st,reset,note,rodEls,clock};
 },
 steps:[
  {k:'watch',run(S,ctx){S.reset();S.st.on=false;S.st.chain=0;S.note.textContent='Hot particles shake their neighbours';tween(ctx,8,p=>{S.st.chain=p})}},
  {k:'watch',run(S,ctx){S.st.chain=1;S.note.textContent='Metals pass energy on quickly: good conductors';ctx.after(4500,()=>{S.note.textContent='Glass, wood, plastic: slow. These are insulators'})}},
  {k:'predict',q:'Which rod’s pin falls off first?',opts:['copper','iron','glass','wood'],ans:0,why:'Copper is the best conductor of these four.',run(S){S.st.chain=1;S.note.textContent=''}},
  {k:'try',build(S,ctx){const h=ctx.panel;S.reset();S.st.chain=1;S.st.on=true;S.st.run=false;S.st.scale=1;S.note.textContent='';
   const fb=H('div',{class:'fb info'},'Press Start, then speed up time.');
   const go=H('button',{class:'btn small',onclick:()=>{S.st.run=!S.st.run;go.textContent=S.st.run?'Pause':'Start'}},'Start');
   const sp=[1,5,20].map(k=>H('button',{class:'btn small ghost',onclick:()=>{S.st.scale=k}},k+'×'));
   const rs=H('button',{class:'btn small ghost',onclick:()=>{S.reset();S.st.run=false;go.textContent='Start'}},'Reset');
   ctx.every(1000,()=>{const n=S.rodEls.reduce((a,e)=>a+e.pins.filter(p=>p.done).length,0);fb.textContent=n+' of 12 pins have fallen.';fb.className='fb info';if(S.st.t>=60&&S.rodEls[0].pins.every(p=>p.done)&&!ctx.flag){ctx.flag=1;fb.className='fb good';fb.textContent='Copper first, then iron, then glass. Wood is slowest.';ctx.done()}});
   h.append(H('div',{class:'row'},go,rs),H('div',{class:'row'},H('span',{class:'hint'},'Time speed:'),sp),fb)}},
  {k:'sum',take:'Conduction: solids, particles vibrate and pass on energy. Metals are the best conductors. Fair test: same length and thickness.'}],
 quiz:[Q('t','Conduction mainly happens in...',['solids','empty space','only gases','only liquids'],0,'Particles in solids vibrate and pass energy to neighbours.'),Q('t','Which material is the best conductor of thermal energy?',['copper','wood','plastic','glass'],0,'Metals conduct best.'),
  Q('t','In a fair test with four rods, which should be the same for every rod?',['Length and thickness','The material','The colour','The name'],0,'Only the material should change.')]});

/* ===== 4.3 ===== */
SCENES.push({id:'4.3',act:'heat',title:'Convection',idea:'Warm fluid is less dense and rises',
 setup(ctx){
  const s=ctx.svg();const bx=232,by=120,bw=336,bh=260;const st={heater:false};
  const beaker=S('g');beaker.append(R(bx-4,by,bw+8,bh+12,{fill:'var(--water)',stroke:'none',rx:0,opacity:.3}),S('path',{d:`M${bx-6} 80V${by+bh+10}H${bx+bw+6}V80`,fill:'none',stroke:'var(--ink)','stroke-width':4,'stroke-linejoin':'round'}));
  const flame=S('g');flame.append(S('path',{d:'M-30 0Q-26 -30 -8 -48Q-6 -20 4 -34Q22 -16 30 0Z',fill:'#ff9a1f'}),S('path',{d:'M-14 0Q-12 -16 0 -26Q4 -12 14 0Z',fill:'#ffd34a'}));flame.setAttribute('transform','translate(330 445)');flame.setAttribute('opacity',0);
  const burner=R(280,448,100,12,{fill:'var(--metal)',rx:3});
  beaker.append(burner,flame);s.append(beaker);
  const ps=[];const pg=S('g');for(let i=0;i<86;i++){const dye=i>=66;const el=C(0,0,dye?6:8,{stroke:'none'});pg.append(el);ps.push({el,dye,x:dye?rnd(bx+10,bx+60):rnd(bx+10,bx+bw-10),y:dye?rnd(by+bh-30,by+bh-8):rnd(by+10,by+bh-10),T:.35})}
  s.append(pg);
  const loop=S('g',{opacity:0});const arr=(x,y,rot)=>S('path',{d:'M-10 -9L10 0L-10 9Z',fill:'var(--ink)',transform:`translate(${x} ${y}) rotate(${rot})`});
  loop.append(S('path',{d:`M${bx+60} ${by+bh-40}V${by+50}H${bx+bw-60}V${by+bh-40}H${bx+60}`,fill:'none',stroke:'var(--ink)','stroke-width':3,'stroke-dasharray':'10 8',opacity:.6}),arr(bx+60,by+120,-90),arr(bx+bw/2,by+50,0),arr(bx+bw-60,by+bh/2,90),arr(bx+bw/2,by+bh-40,180));
  const lh=T(bx+34,by+bh/2,'warm: less dense, rises',{'font-size':17,fill:'var(--hot)','text-anchor':'middle',opacity:0}),lc=T(bx+bw-30,by+bh/2+40,'cool: denser, sinks',{'font-size':17,fill:'var(--cold)',opacity:0});
  s.append(loop,lh,lc);
  const uses=S('g',{opacity:0});s.append(uses);
  // kettle
  const kg=S('g',{transform:'translate(30 70)'});kg.append(R(30,60,170,240,{rx:20,fill:'var(--paper)'}),R(40,150,150,140,{rx:12,fill:'var(--water)',stroke:'none',opacity:.6}),S('path',{d:'M50 285h40l10-14l14 14l14-14l14 14l14-14h24',fill:'none',stroke:'var(--hot)','stroke-width':5}),T(115,330,'Kettle: element at the bottom',{'font-size':16}),Pth('M200 120Q250 130 240 220',{'stroke-width':8}));
  // fridge
  const fg=S('g',{transform:'translate(295 70)'});fg.append(R(40,50,150,250,{rx:10,fill:'var(--paper)'}),R(48,58,134,60,{rx:6,fill:'var(--cold-soft)',stroke:'var(--cold)'}),T(115,94,'Freezer',{'font-size':18,fill:'var(--cold)'}),L(40,126,190,126),T(115,330,'Fridge: freezer at the top',{'font-size':16}));
  // radiator
  const rg=S('g',{transform:'translate(535 70)'});rg.append(R(0,50,220,250,{rx:6,fill:'var(--paper)'}),R(14,200,60,80,{rx:4,fill:'var(--hot)',stroke:'var(--ink)'}),T(110,330,'Radiator: warm air rises',{'font-size':16}));
  const dash=[];const ar=(g,d,c)=>{const p=Pth(d,{stroke:c,'stroke-width':5,'stroke-dasharray':'12 10'});g.append(p);dash.push(p)};
  ar(kg,'M60 270V120','var(--hot)');ar(kg,'M60 100H170','var(--hot)');ar(kg,'M170 100V270','var(--cold)');
  ar(fg,'M80 130V280','var(--cold)');ar(fg,'M150 130V280','var(--cold)');
  ar(rg,'M60 190V70H180V230','var(--hot)');
  uses.append(kg,fg,rg);
  ctx.bg.raf((dt,t)=>{
    dash.forEach(d=>d.setAttribute('stroke-dashoffset',-t*24));
    ps.forEach(p=>{
      const u=(p.x-bx)/bw,v=(p.y-by)/bh;
      if(st.heater){if(u<.4&&v>.72)p.T=Math.min(1,p.T+1.5*dt);else if(v<.28)p.T=Math.max(.05,p.T-.8*dt);else p.T+=(.3-p.T)*.06*dt}else p.T+=(.35-p.T)*.7*dt;
      const vy=st.heater?-(p.T-.35)*120:0;let vx=0;if(st.heater){if(v<.22)vx=60;else if(v>.84)vx=-60}
      p.x=clamp(p.x+(vx+rnd(-14,14))*dt,bx+8,bx+bw-8);p.y=clamp(p.y+(vy+rnd(-14,14))*dt,by+8,by+bh-8);
      p.el.setAttribute('cx',p.x);p.el.setAttribute('cy',p.y);p.el.setAttribute('fill',p.dye?'#8e2fd0':tcol(clamp((p.T-.2)/.8,0,1)))});
    flame.setAttribute('opacity',st.heater?(0.8+Math.sin(t*14)*.2):0);loop.setAttribute('opacity',st.heater?.9:0);lh.setAttribute('opacity',st.heater?1:0);lc.setAttribute('opacity',st.heater?1:0)});
  return {s,st,beaker,pg,uses,loop};
 },
 steps:[
  {k:'watch',run(S,ctx){S.st.heater=false;setA(S.uses,{opacity:0});setA(S.beaker,{opacity:1});setA(S.pg,{opacity:1})}},
  {k:'watch',run(S,ctx){setA(S.uses,{opacity:0});setA(S.beaker,{opacity:1});setA(S.pg,{opacity:1});S.st.heater=true}},
  {k:'predict',q:'Why is the element at the bottom of a kettle?',opts:['Warm water rises, so the whole kettle heats up','Metal sinks','It looks neater'],ans:0,why:'Warm water rises and cooler water sinks, setting up a convection current through the whole kettle.',run(S){S.st.heater=false}},
  {k:'try',build(S,ctx){const h=ctx.panel;S.st.heater=false;let n=0;const b=H('button',{class:'btn hot',onclick:()=>{S.st.heater=!S.st.heater;b.textContent=S.st.heater?'Heater off':'Heater on';if(++n>=2)ctx.done()}},'Heater on');h.append(b,H('p',{class:'hint'},'Purple dye shows how the water moves. Turn it on and off.'))}},
  {k:'watch',run(S,ctx){S.st.heater=false;setA(S.uses,{opacity:1});setA(S.beaker,{opacity:0});setA(S.pg,{opacity:0})}},
  {k:'sum',take:'Convection (liquids and gases): warm fluid expands, less dense, rises; cool fluid sinks. Not in solids.',run(S){setA(S.uses,{opacity:0});setA(S.beaker,{opacity:1});setA(S.pg,{opacity:1});S.st.heater=true}}],
 quiz:[Q('t','Why can convection not happen in a solid?',['The particles cannot flow','Solids are too cold','Solids have no mass','Solids are too dense to be heated'],0,'Particles in a solid are held in place, so there is no flow.'),Q('t','Why is the freezer compartment at the top of a fridge?',['Cold air sinks and cools the food below','Cold air rises','It is easier to reach','Heat rises into it'],0,'Cold air is denser, so it sinks.'),
  Q('t','When water is heated, the warm water rises because it is...',['less dense','more dense','heavier','solid'],0,'Its particles spread out, so its density falls.')]});
