const NS='http://www.w3.org/2000/svg';
const S=(t,a,...k)=>{const e=document.createElementNS(NS,t);if(a)for(const x in a){if(a[x]!=null)e.setAttribute(x,a[x])}k.flat(9).forEach(c=>{if(c!=null)e.append(c)});return e};
const H=(t,a,...k)=>{const e=document.createElement(t);if(a)for(const x in a){const v=a[x];if(v==null)continue;if(x.startsWith('on'))e[x]=v;else if(x==='html')e.innerHTML=v;else e.setAttribute(x,v)}k.flat(9).forEach(c=>{if(c!=null)e.append(c)});return e};
const $=s=>document.querySelector(s);
const rnd=(a,b)=>a+Math.random()*(b-a);
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const store={get(){try{return JSON.parse(localStorage.getItem(CFG.key)||'{}')}catch(e){return {}}},set(o){try{localStorage.setItem(CFG.key,JSON.stringify(o))}catch(e){}}};
let prog=store.get();prog.done=prog.done||{};
const saveProg=()=>store.set(prog);

/* ---------- Mummy ---------- */
function mummySVG(){
  const s=S('svg',{viewBox:'0 0 200 215',class:'mum','aria-hidden':'true'});
  s.innerHTML=`<g class="pony"><path d="M146 58C192 50 202 114 172 162C168 128 154 104 146 84Z" fill="#1b1220"/><path d="M152 72C178 84 184 112 172 142" stroke="#3a2a46" stroke-width="3" fill="none" opacity=".7"/></g>
  <circle cx="148" cy="62" r="7" fill="var(--hot)"/>
  <path d="M26 215C26 168 66 152 100 152C134 152 174 168 174 215Z" fill="var(--accent)"/>
  <rect x="88" y="132" width="24" height="28" rx="8" fill="#e9b08a"/>
  <path d="M80 152L100 180L120 152Z" fill="#e9b08a"/>
  <ellipse cx="49" cy="104" rx="6" ry="10" fill="#e2a47c"/><ellipse cx="151" cy="104" rx="6" ry="10" fill="#e2a47c"/>
  <ellipse cx="100" cy="94" rx="52" ry="57" fill="#f1be99"/>
  <path d="M46 98C38 36 76 18 102 18C134 18 162 42 154 98C142 68 124 52 100 52C76 52 58 68 46 98Z" fill="#1b1220"/>
  <path d="M60 60C74 40 98 36 118 40" stroke="#3a2a46" stroke-width="3" fill="none" opacity=".6"/>
  <g class="blink">
   <ellipse cx="78" cy="101" rx="15" ry="18" fill="#fff"/><circle cx="79" cy="103" r="10.5" fill="#3a2316"/><circle cx="79" cy="103" r="5.6" fill="#0b0605"/><circle cx="74.5" cy="97" r="3.8" fill="#fff"/><circle cx="84" cy="108" r="1.8" fill="#fff"/>
   <ellipse cx="122" cy="101" rx="15" ry="18" fill="#fff"/><circle cx="121" cy="103" r="10.5" fill="#3a2316"/><circle cx="121" cy="103" r="5.6" fill="#0b0605"/><circle cx="116.5" cy="97" r="3.8" fill="#fff"/><circle cx="126" cy="108" r="1.8" fill="#fff"/>
   <path d="M63 91L57 86M68 85L65 78M137 91L143 86M132 85L135 78" stroke="#1b1220" stroke-width="3" stroke-linecap="round"/>
  </g>
  <g class="brows"><path d="M62 75Q78 66 94 75" stroke="#1b1220" stroke-width="4.5" stroke-linecap="round" fill="none"/><path d="M106 75Q122 66 138 75" stroke="#1b1220" stroke-width="4.5" stroke-linecap="round" fill="none"/></g>
  <ellipse cx="62" cy="124" rx="9" ry="5.5" fill="#ee7f78" opacity=".35"/><ellipse cx="138" cy="124" rx="9" ry="5.5" fill="#ee7f78" opacity=".35"/>
  <path d="M98 113Q100 121 105 119" stroke="#d1936d" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <path class="mouthS" d="M82 131Q100 147 118 131" stroke="#8c2f3b" stroke-width="3.5" fill="none" stroke-linecap="round"/>
  <g class="mouthO"><path d="M84 129Q100 152 116 129Z" fill="#8c2f3b"/><path d="M92 141Q100 136 108 141Q100 148 92 141Z" fill="#e8737f"/></g>`;
  return s;
}
const mum={els:[],iv:null,
  make(){const s=mummySVG();s.dataset.mood='happy';this.els.push(s);return s},
  mood(m){this.els.forEach(e=>e.dataset.mood=m)},
  talk(on){clearInterval(this.iv);this.els.forEach(e=>e.classList.remove('open'));if(on){let o=false;this.iv=setInterval(()=>{o=Math.random()>.35;this.els.forEach(e=>e.classList.toggle('open',o))},130)}}};

/* ---------- Audio ---------- */
const A={voice:true,rate:1,cur:null};
function stopAudio(){if(A.cur){A.cur.onended=null;A.cur.pause();A.cur=null}mum.talk(false)}
function playLine(key,onend){
  stopAudio();const b=AUDIO[key];
  if(!A.voice||!b){if(onend)onend();return}
  const a=new Audio('data:audio/mpeg;base64,'+b);a.playbackRate=A.rate;A.cur=a;mum.talk(true);
  a.onended=()=>{mum.talk(false);A.cur=null;if(onend)onend()};
  const p=a.play();if(p&&p.catch)p.catch(()=>{mum.talk(false)});
}
const cheer=ok=>{mum.mood(ok?'cheer':'oops');playLine(ok?'g.'+(1+Math.floor(Math.random()*3)):'g.'+(4+Math.floor(Math.random()*2)))};

/* ---------- Graph helper ---------- */
function mkGraph(parent,o){
  const {x=70,y=30,w=360,h=260,xmax,ymax,xs,ys,xl,yl}=o;
  const g=S('g',{transform:`translate(${x} ${y})`});
  const X=v=>v/xmax*w, Y=v=>h-v/ymax*h;
  g.append(S('rect',{x:0,y:0,width:w,height:h,fill:'var(--paper)',opacity:.85}));
  for(let v=0;v<=xmax+1e-9;v+=xs){g.append(S('line',{x1:X(v),x2:X(v),y1:0,y2:h,stroke:'var(--line)','stroke-width':1}));g.append(S('text',{x:X(v),y:h+20,'text-anchor':'middle','font-size':14,fill:'var(--muted)'},String(+v.toFixed(2))))}
  for(let v=0;v<=ymax+1e-9;v+=ys){g.append(S('line',{x1:0,x2:w,y1:Y(v),y2:Y(v),stroke:'var(--line)','stroke-width':1}));g.append(S('text',{x:-8,y:Y(v)+5,'text-anchor':'end','font-size':14,fill:'var(--muted)'},String(+v.toFixed(2))))}
  g.append(S('line',{x1:0,x2:w,y1:h,y2:h,stroke:'var(--ink)','stroke-width':2.5}));g.append(S('line',{x1:0,x2:0,y1:0,y2:h,stroke:'var(--ink)','stroke-width':2.5}));
  g.append(S('text',{x:w/2,y:h+44,'text-anchor':'middle','font-size':16,'font-weight':700,fill:'var(--ink)'},xl));
  g.append(S('text',{x:-52,y:h/2,'text-anchor':'middle','font-size':16,'font-weight':700,fill:'var(--ink)',transform:`rotate(-90 -52 ${h/2})`},yl));
  parent.append(g);
  const D=pts=>pts.map((p,i)=>(i?'L':'M')+X(p[0]).toFixed(1)+' '+Y(p[1]).toFixed(1)).join('');
  return {g,X,Y,D,w,h};
}

/* ---------- Questions ---------- */
function ask(q,host,done){
  host.innerHTML='';let tries=0;
  host.append(H('h3',null,q.q));
  const fb=H('div');
  const finish=ok=>{done(ok)};
  if(q.t==='num'){
    const inp=H('input',{type:'text',inputmode:'decimal',placeholder:'Your answer'});
    const go=H('button',{class:'btn small',onclick:()=>{
      const v=parseFloat(String(inp.value).replace(',','.'));if(isNaN(v)){inp.focus();return}
      const tol=q.tol!=null?q.tol:Math.abs(q.a)*0.01+1e-9;const ok=Math.abs(v-q.a)<=tol;
      fb.className='fb '+(ok?'good':'bad');fb.textContent=(ok?'Correct! ':'Not quite. ')+q.why;cheer(ok);go.disabled=true;inp.disabled=true;finish(ok)}},'Check');
    inp.onkeydown=e=>{if(e.key==='Enter')go.click()};
    host.append(H('div',{class:'row'},H('div',{class:'field',style:'flex:1'},inp),q.u?H('span',{class:'mono'},q.u):null,go),fb);
  }else{
    const box=H('div',{class:'opts'});
    q.o.forEach((t,i)=>{const b=H('button',{class:'opt',onclick:()=>{
      if(b.classList.contains('right')||b.classList.contains('wrong'))return;tries++;
      if(i===q.a){b.classList.add('right');fb.className='fb good';fb.textContent='Correct! '+q.why;cheer(true);[...box.children].forEach(x=>x.disabled=true);finish(tries===1)}
      else{b.classList.add('wrong');fb.className='fb bad';fb.textContent='Not quite, have another go.';cheer(false);
        if(tries>=2){box.children[q.a].classList.add('right');fb.textContent='The answer is: '+q.o[q.a]+'. '+q.why;[...box.children].forEach(x=>x.disabled=true);finish(false)}}}},t);box.append(b)});
    host.append(box,fb);
  }
}

/* ---------- Match (tap a chip, then tap a slot) ---------- */
function matchGame(host,o){
  let sel=null,left=o.items.length;
  const chips=H('div',{class:'chips'}),slots=H('div',{class:'slots'}),fb=H('div');
  const slotEls={};
  o.buckets.forEach(b=>{const s=H('button',{class:'slot',onclick:()=>{
    if(!sel)return;const it=sel.it;
    if(it.to===b.id){sel.el.classList.add('used');sel.el.classList.remove('sel');s.classList.add('fill');s.append(H('b',null,it.label));fb.className='fb good';fb.textContent='Yes. '+(it.ok||'');cheer(true);sel=null;if(--left===0){fb.textContent='All matched!';if(o.onDone)o.onDone()}}
    else{s.classList.remove('shake');void s.offsetWidth;s.classList.add('shake');fb.className='fb bad';fb.textContent='Not that one. '+(it.hint||'Think again.');cheer(false)}}},H('span',null,b.label));slotEls[b.id]=s;slots.append(s)});
  o.items.forEach(it=>{const c=H('button',{class:'chip',onclick:()=>{if(sel)sel.el.classList.remove('sel');sel={it,el:c};c.classList.add('sel')}},it.label);chips.append(c)});
  host.append(H('p',{class:'hint'},o.help||'Tap an item, then tap where it belongs.'),chips,slots,fb);
}

/* ---------- Scene runner ---------- */
const SCENES=[];
const ACTS=CFG.acts;
const app=$('#app');
let cur=null;
function killTimers(list){list.forEach(t=>{if(t.raf)cancelAnimationFrame(t.raf.v);if(t.iv)clearInterval(t.iv);if(t.to)clearTimeout(t.to)});list.length=0}
function mkTimers(list){return{
  raf(fn){const t={raf:{v:0}};let last=performance.now();const loop=now=>{const dt=Math.min(.05,(now-last)/1000);last=now;if(fn(dt,now/1000)===false)return;t.raf.v=requestAnimationFrame(loop)};t.raf.v=requestAnimationFrame(loop);list.push(t);return t},
  every(ms,fn){const t={iv:setInterval(fn,ms)};list.push(t);return t},
  after(ms,fn){const t={to:setTimeout(fn,ms)};list.push(t);return t}}}
function leave(){if(cur){killTimers(cur.stepT);killTimers(cur.bgT)}cur=null;stopAudio();mum.els=[];}

function header(){
  const hd=H('div',{class:'top'});
  const brand=H('button',{class:'brand',onclick:()=>showHome()});const lg=mum.make();lg.style.width='34px';lg.style.height='34px';brand.append(lg,CFG.title);
  const vb=H('button',{class:'tool','aria-pressed':String(A.voice),onclick:()=>{A.voice=!A.voice;vb.setAttribute('aria-pressed',String(A.voice));vb.textContent=A.voice?'Voice on':'Voice off';if(!A.voice)stopAudio()}},A.voice?'Voice on':'Voice off');
  const rates=[0.85,1,1.25];const sb=H('button',{class:'tool',onclick:()=>{A.rate=rates[(rates.indexOf(A.rate)+1)%3];sb.textContent='Speed '+A.rate+'x';if(A.cur)A.cur.playbackRate=A.rate}},'Speed '+A.rate+'x');
  hd.append(brand,H('span',{class:'spacer'}),vb,sb);return hd;
}
function frame(){leave();app.innerHTML='';window.scrollTo(0,0);app.append(header())}

function sceneDone(id){return prog.done[id]!=null}
function showHome(){
  frame();
  const total=SCENES.length,done=SCENES.filter(s=>sceneDone(s.id)).length;
  const hm=mum.make();
  const bar=H('div',{class:'progress'},H('i',{style:`width:${done/total*100}%`}));
  const first=SCENES.find(s=>!sceneDone(s.id))||SCENES[0];
  const hero=H('div',{class:'hero'},hm,H('div',null,H('h1',null,CFG.title),
    H('p',null,CFG.intro),
    H('div',{class:'row'},H('button',{class:'btn',onclick:()=>openScene(first.id)},done?'Continue: '+first.title:'Start the first scene'),H('span',{class:'hint'},done+' of '+total+' scenes done')),bar));
  app.append(hero);
  hero.querySelector('.btn').addEventListener('click',()=>{});
  const acts=H('div',{class:'acts'});
  ACTS.forEach(a=>{
    const list=SCENES.filter(s=>s.act===a.id);
    const box=H('div',{class:'act'+(a.big?' big':''),style:'--ac:'+a.color},H('h2',null,H('span',{class:'tag'},a.tag),a.name));
    const wrap=H('div',{class:'scenes',style:a.big?null:'display:flex;flex-direction:column;gap:10px'});
    list.forEach(s=>wrap.append(H('button',{class:'sc'+(sceneDone(s.id)?' done':''),onclick:()=>openScene(s.id)},H('span',{class:'n'},s.id),H('span',null,H('b',null,s.title),H('small',null,s.idea)),H('span',{class:'ck'},sceneDone(s.id)?'✓':''))));
    box.append(wrap);acts.append(box)});
  app.append(acts);
  app.append(H('div',{class:'extras'},
    H('button',{class:'extra',onclick:()=>showBoss()},H('div',null,H('h3',null,'Final round'),H('p',null,(ACTS.length*(CFG.perAct||5))+' mixed questions from every topic, with a score for each.'))),
    H('button',{class:'extra',onclick:()=>showCheat()},H('div',null,H('h3',null,'Cheat sheet'),H('p',null,CFG.cheatBlurb||'Every key fact and word on one page.')))));
  setTimeout(()=>{mum.mood('happy')},0);
  hm.addEventListener('click',()=>playLine('g.0'));
}

function openScene(id){
  const sc=SCENES.find(s=>s.id===id);frame();
  const timers={stepT:[],bgT:[]};
  const stage=H('div',{class:'stage'}),panel=H('div',{class:'panel'}),cap=H('div',{class:'bubble'});
  const mc=mum.make();
  const dots=H('div',{class:'dots'});sc.steps.forEach(()=>dots.append(H('i',{class:'dot'})));
  const nextB=H('button',{class:'btn'},'Next'),repB=H('button',{class:'btn ghost'},'Replay voice'),backB=H('button',{class:'btn ghost'},'Back');
  const nav=H('div',{class:'nav'},backB,repB,nextB);
  app.append(H('div',{class:'sc-head'},H('button',{class:'btn ghost small',onclick:()=>showHome()},'All scenes'),H('h2',null,sc.id+'  '+sc.title),dots));
  app.append(H('div',{class:'sc-grid'},stage,H('div',{class:'side'},H('div',{class:'mcard'},mc,cap),panel,nav)));
  cur={sc,step:0,stepT:timers.stepT,bgT:timers.bgT};
  const stepTm=mkTimers(timers.stepT),bgTm=mkTimers(timers.bgT);
  const svg=()=>{const s=S('svg',{class:'main',viewBox:'0 0 800 450',role:'img'});stage.append(s);return s};
  const ctx={stage,panel,svg,bg:bgTm,raf:stepTm.raf,every:stepTm.every,after:stepTm.after,sc,
    mood:m=>mum.mood(m),say:(k,fn)=>playLine(k,fn)};
  const Sx=sc.setup(ctx);
  const total=sc.steps.length;
  function go(i){
    if(i>=total){return quiz()}
    killTimers(timers.stepT);panel.innerHTML='';cur.step=i;cur.quiz=false;
    [...dots.children].forEach((d,k)=>d.className='dot'+(k<i?' on':'')+(k===i?' cur':''));
    const st=sc.steps[i];cap.textContent=SCRIPT[sc.id][i];mum.mood(st.k==='predict'?'think':'happy');
    playLine(sc.id+'.'+i);
    nextB.textContent=i===total-1?'Quick quiz':(st.k==='try'?'Skip':'Next');nextB.disabled=false;backB.disabled=i===0;repB.disabled=false;
    ctx.done=()=>{nextB.textContent=i===total-1?'Quick quiz':'Next';mum.mood('cheer');const f=H('div',{class:'fb good'},'Nicely done.');panel.append(f)};
    if(st.k==='predict'){
      panel.append(H('h3',null,st.q));const box=H('div',{class:'opts'}),fb=H('div');let tries=0;
      st.opts.forEach((t,j)=>{const b=H('button',{class:'opt',onclick:()=>{
        if(b.classList.contains('right')||b.classList.contains('wrong'))return;tries++;
        if(j===st.ans){b.classList.add('right');fb.className='fb good';fb.textContent=st.why;cheer(true);[...box.children].forEach(x=>x.disabled=true);if(st.reveal)st.reveal(Sx,ctx)}
        else{b.classList.add('wrong');fb.className='fb bad';fb.textContent='Not quite. Have another go.';cheer(false);
          if(tries>=2){box.children[st.ans].classList.add('right');fb.textContent='It is: '+st.opts[st.ans]+'. '+st.why;[...box.children].forEach(x=>x.disabled=true);if(st.reveal)st.reveal(Sx,ctx)}}}},t);box.append(b)});
      panel.append(box,fb);
    }else if(st.k==='sum'){
      panel.append(H('div',{class:'takeaway'},st.take));
    }
    if(st.k==='try')st.build(Sx,ctx);
    else if(st.run)st.run(Sx,ctx);
  }
  function quiz(){
    killTimers(timers.stepT);cur.quiz=true;[...dots.children].forEach(d=>d.className='dot on');
    nav.style.display='none';cap.textContent='Three quick questions. You can do it, Krishna.';mum.mood('think');
    let n=0,score=0;
    const qs=sc.quiz;
    const next=()=>{
      if(n>=qs.length){prog.done[sc.id]=Math.max(prog.done[sc.id]||0,score);saveProg();panel.innerHTML='';
        panel.append(H('div',{class:'score'},score+' out of '+qs.length),H('p',null,score===qs.length?'Perfect. That scene is done.':'Scene done. Replay it any time to improve your score.'));
        const idx=SCENES.indexOf(sc),nx=SCENES[idx+1];
        panel.append(H('div',{class:'nav'},H('button',{class:'btn ghost',onclick:()=>openScene(sc.id)},'Replay scene'),nx?H('button',{class:'btn',onclick:()=>openScene(nx.id)},'Next: '+nx.title):H('button',{class:'btn',onclick:()=>showBoss()},'Final round')));
        cap.textContent=score===qs.length?'Scene complete. Well done, Krishna!':'Good effort! Every try makes it stick better.';mum.mood('cheer');playLine('g.6');return}
      const host=H('div',{class:'opts'});panel.innerHTML='';panel.append(H('p',{class:'hint'},'Question '+(n+1)+' of '+qs.length),host);
      ask(qs[n],host,ok=>{if(ok)score++;n++;const b=H('button',{class:'btn small',onclick:next},n>=qs.length?'See score':'Next question');host.append(b)});
    };next();
  }
  nextB.onclick=()=>go(cur.step+1);
  backB.onclick=()=>go(cur.step-1);
  repB.onclick=()=>playLine(sc.id+'.'+cur.step);
  go(0);
}
