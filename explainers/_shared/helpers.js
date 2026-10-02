/* ---------- svg helpers for scenes ---------- */
const T=(x,y,s,o={})=>S('text',Object.assign({x,y,'font-size':20,fill:'var(--ink)','text-anchor':'middle','font-family':'Nunito,sans-serif','font-weight':700},o),s);
const R=(x,y,w,h,o={})=>S('rect',Object.assign({x,y,width:w,height:h,rx:8,fill:'var(--paper)',stroke:'var(--ink)','stroke-width':2.5},o));
const L=(x1,y1,x2,y2,o={})=>S('line',Object.assign({x1,y1,x2,y2,stroke:'var(--ink)','stroke-width':2.5,'stroke-linecap':'round'},o));
const C=(cx,cy,r,o={})=>S('circle',Object.assign({cx,cy,r,fill:'var(--paper)',stroke:'var(--ink)','stroke-width':2.5},o));
const Pth=(d,o={})=>S('path',Object.assign({d,fill:'none',stroke:'var(--ink)','stroke-width':3,'stroke-linecap':'round','stroke-linejoin':'round'},o));
const G=(x,y,...k)=>S('g',{transform:`translate(${x} ${y})`},...k);
const setA=(e,o)=>{for(const k in o)e.setAttribute(k,o[k]);return e};
const tween=(ctx,dur,fn,done)=>{let t=0;ctx.raf(dt=>{t+=dt;const p=clamp(t/dur,0,1);fn(p);if(p>=1){if(done)done();return false}})};
const ease=p=>p<.5?2*p*p:1-Math.pow(-2*p+2,2)/2;
const fmt=(v,d=1)=>String(+v.toFixed(d));
const Q=(t,q,o,a,why)=>({t:'mcq',q,o,a,why});
const N=(q,a,u,why,tol)=>({t:'num',q,a,u,why,tol});
function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
const show=(e,on)=>{e.setAttribute('opacity',on?1:0);return e};
/* An atom drawn as nucleus plus electron shells. shells=[2,8,1] etc.
   o: cx,cy sets centre via args; o.p/o.n draw a proton/neutron cluster, else a single nucleus disc (o.label inside).
   Returns a group g; g.shells=[{g,cx,cy}] so spinAtom can rotate each shell. */
function atomSVG(cx,cy,shells,o={}){const g=S('g');const tot=(o.p||0)+(o.n||0);
  const nucR=o.p!=null?Math.max(12,(o.s||1)*(4.6*Math.sqrt(tot)+8)):(o.nuc||16);
  if(o.p!=null){g.append(C(cx,cy,nucR,{fill:'var(--paper)',stroke:'var(--line)','stroke-width':2}));
    const types=[];let pp=o.p,nn=o.n;for(let i=0;i<tot;i++){if(pp>0&&(nn===0||i%2===0||pp>nn)){types.push(1);pp--}else{types.push(0);nn--}}
    types.forEach((t,i)=>{const r=4.6*(o.s||1)*Math.sqrt(i+.5),a=i*2.39996;g.append(C(cx+r*Math.cos(a),cy+r*Math.sin(a),(o.pr||3.7*(o.s||1)),{fill:t?'var(--hot)':'var(--metal)',stroke:'var(--ink)','stroke-width':1}))})}
  else{g.append(C(cx,cy,nucR,{fill:o.nucFill||'var(--hot)',stroke:'var(--ink)','stroke-width':2}));if(o.label)g.append(T(cx,cy+6,o.label,{'font-size':o.lf||15,fill:'#fff'}))}
  const r0=Math.max(o.r0||34,nucR+(o.gap||18)),dr=o.dr||26;g.shells=[];
  shells.forEach((n,i)=>{const r=r0+i*dr;const sg=S('g');g.append(C(cx,cy,r,{fill:'none',stroke:'var(--line)','stroke-width':2,'stroke-dasharray':'4 4'}));
    for(let k=0;k<n;k++){const a=-Math.PI/2+k*2*Math.PI/n+(i%2?Math.PI/n:0);sg.append(C(cx+r*Math.cos(a),cy+r*Math.sin(a),o.er||6,{fill:o.eFill||'var(--cold)',stroke:'var(--ink)','stroke-width':1.5}))}
    g.append(sg);g.shells.push({g:sg,cx,cy})});
  return g}
/* Slowly spin each shell of an atomSVG group (call once from setup using ctx.bg.raf). */
function spinAtom(ctx,get,speed){let a=0;ctx.bg.raf(dt=>{a+=dt*(speed||14);const g=get();if(!g||!g.shells)return;g.shells.forEach((s,i)=>s.g.setAttribute('transform',`rotate(${(i%2?-1:1)*a*(1+i*.15)} ${s.cx} ${s.cy})`))})}
/* Tap the items in the correct order. o={items:[...strings in correct order], help, onDone} */
function orderGame(host,o){
  const want=o.items,got=[];const chips=H('div',{class:'chips'}),slots=H('div',{class:'slots'}),fb=H('div');
  const slotEls=want.map((_,i)=>{const s=H('div',{class:'slot'},H('span',{class:'mono'},String(i+1)+'.'),H('span',{class:'lbl'},''));slots.append(s);return s});
  shuffle(want.map((t,i)=>({t,i}))).forEach(it=>{const c=H('button',{class:'chip',onclick:()=>{
    const k=got.length;
    if(it.i===k){got.push(it);c.classList.add('used');slotEls[k].classList.add('fill');slotEls[k].querySelector('.lbl').textContent=it.t;fb.className='fb good';fb.textContent=(o.why&&o.why[k])||'Yes!';cheer(true);if(got.length===want.length){fb.textContent='In the right order!';if(o.onDone)o.onDone()}}
    else{slotEls[k].classList.remove('shake');void slotEls[k].offsetWidth;slotEls[k].classList.add('shake');fb.className='fb bad';fb.textContent='Not that one yet. Think about what comes next.';cheer(false)}}},it.t);chips.append(c)});
  host.append(H('p',{class:'hint'},o.help||'Tap the steps in the right order.'),chips,slots,fb)}
/* A labelled slider row. Returns {el,input,val}. */
function sliderRow(label,min,max,val,step,onInput,unit){
  const id='sl'+Math.random().toString(36).slice(2,7);const inp=H('input',{type:'range',min,max,step:step||1,value:val,id});const out=H('span',{class:'mono'},val+(unit||''));
  inp.oninput=()=>{out.textContent=inp.value+(unit||'');onInput(+inp.value)};
  return {el:H('div',{class:'field'},H('div',{class:'row',style:'justify-content:space-between'},H('label',{for:id},label),out),inp),input:inp,out}}
/* A row of toggle chips (single select). o=[{id,label}] */
function pickRow(host,opts,onPick,start){const row=H('div',{class:'chips'});const bs=opts.map(o=>{const b=H('button',{class:'chip'+(o.id===start?' sel':''),onclick:()=>{bs.forEach(x=>x.classList.remove('sel'));b.classList.add('sel');onPick(o.id)}},o.label);row.append(b);return b});host.append(row);return row}
/* + / - stepper. Returns {el,get,set}. onChange(v) fires on every change. */
function stepper(label,min,max,val,onChange){let v=val;const out=H('span',{class:'mono',style:'min-width:2ch;text-align:center'},String(v));
  const set=x=>{v=clamp(x,min,max);out.textContent=String(v);onChange(v)};
  const m=H('button',{class:'btn small ghost','aria-label':'less '+label,onclick:()=>set(v-1)},'−'),p=H('button',{class:'btn small ghost','aria-label':'more '+label,onclick:()=>set(v+1)},'+');
  return {el:H('div',{class:'row',style:'justify-content:space-between'},H('b',null,label),H('div',{class:'row'},m,out,p)),get:()=>v,set}}
/* Reveal helper: show/hide a list of svg elements with optional stagger. */
function stagger(ctx,els,ms,start){els.forEach((e,i)=>{e.setAttribute('opacity',0);ctx.after((start||0)+i*ms,()=>e.setAttribute('opacity',1))})}
/* Animated flow along a polyline: dashed guide, arrowhead and dots moving along it. Returns a group (toggle opacity). */
function flowLine(ctx,parent,pts,o={}){const g=S('g');const col=o.col||'var(--accent)',n=o.n||4,sp=o.speed||.25;/* o.speed may be a function for live control */
  const d=pts.map((p,i)=>(i?'L':'M')+p[0]+' '+p[1]).join('');g.append(Pth(d,{stroke:col,'stroke-width':o.w||3,'stroke-dasharray':'2 9',opacity:.55}));
  const segs=[];let tot=0;for(let i=1;i<pts.length;i++){const l=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);segs.push(l);tot+=l}
  const at=u=>{let r=u*tot;for(let i=0;i<segs.length;i++){if(r<=segs[i]){const t=r/segs[i];return [pts[i][0]+(pts[i+1][0]-pts[i][0])*t,pts[i][1]+(pts[i+1][1]-pts[i][1])*t]}r-=segs[i]}return pts[pts.length-1]};
  const L1=pts[pts.length-1],L0=pts[pts.length-2],a=Math.atan2(L1[1]-L0[1],L1[0]-L0[0])*180/Math.PI;
  g.append(S('polygon',{points:'0,-9 20,0 0,9',fill:col,transform:`translate(${L1[0]} ${L1[1]}) rotate(${a}) translate(-20 0)`}));
  const dots=[];for(let i=0;i<n;i++){const c=C(0,0,o.r||6,{fill:col,'stroke-width':1.5});g.append(c);dots.push(c)}
  let u=0;ctx.bg.raf(dt=>{u=(u+dt*(typeof sp==='function'?sp():sp))%1;dots.forEach((c,i)=>{const p=at((u+i/n)%1);c.setAttribute('cx',p[0]);c.setAttribute('cy',p[1])})});
  if(o.label)g.append(T(o.lx!=null?o.lx:pts[0][0],o.ly!=null?o.ly:pts[0][1]-14,o.label,{'font-size':o.fs||17,fill:col,'font-family':'Fredoka,sans-serif',stroke:'var(--paper)','stroke-width':5,'paint-order':'stroke','stroke-linejoin':'round'}));
  parent.append(g);return g}
/* A row of equation boxes centred at x=400. toks=[{t,k:'r'|'p'|'op'}]. Returns array of groups. */
function eqRow(parent,y,toks,o={}){const sz=o.sz||24,wd=t=>t.t.length*sz*.6+30,gap=10;const tot=toks.reduce((a,t)=>a+(t.k==='op'?36:wd(t)),0)+gap*(toks.length-1);let x=(o.cx||400)-tot/2;const els=[];
  toks.forEach(t=>{const w=t.k==='op'?36:wd(t);const g=S('g');if(t.k!=='op')g.append(R(x,y,w,sz*2.4,{rx:14,fill:t.k==='r'?'var(--cold-soft)':'var(--good-soft)',stroke:t.k==='r'?'var(--cold)':'var(--good)','stroke-width':3}));g.append(T(x+w/2,y+sz*1.5,t.t,{'font-size':t.k==='op'?36:sz,'font-family':'Fredoka,sans-serif'}));parent.append(g);els.push(g);x+=w+gap});return els}
/* Leaf outline path pointing right, width w, height h. */
const leafPath=(w,h)=>`M0 0C${w*.2} ${-h*.6} ${w*.7} ${-h*.6} ${w} 0C${w*.7} ${h*.6} ${w*.2} ${h*.6} 0 0Z`;

/* simple test tube / beaker drawing: returns {g,liquid}. */
function beaker(x,y,w,h,col,o={}){const g=S('g');const liq=R(x+3,y+h*(o.fill||.4),w-6,h*(1-(o.fill||.4))-3,{fill:col,stroke:'none',rx:4,opacity:o.op||.85});
  g.append(liq,Pth(`M${x} ${y}V${y+h}Q${x} ${y+h+6} ${x+8} ${y+h+6}H${x+w-8}Q${x+w} ${y+h+6} ${x+w} ${y+h}V${y}`,{'stroke-width':3}));return {g,liq}}
