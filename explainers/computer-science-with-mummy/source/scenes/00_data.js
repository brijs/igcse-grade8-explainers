/* ---------- Mini spreadsheet engine (formulas, ranges, a few functions) ---------- */
const SHC={c2n:c=>c.split('').reduce((a,ch)=>a*26+ch.charCodeAt(0)-64,0),n2c:n=>{let s='';while(n>0){const m=(n-1)%26;s=String.fromCharCode(65+m)+s;n=Math.floor((n-1)/26)}return s}};
const refOf=r=>{const m=/^\$?([A-Z]{1,2})\$?(\d+)$/.exec(r);return m?{c:SHC.c2n(m[1]),r:+m[2]}:null};
const rangeRefs=s=>{const [a,b]=s.replace(/\$/g,'').split(':');const A=refOf(a),B=b?refOf(b):A;const out=[];for(let r=Math.min(A.r,B.r);r<=Math.max(A.r,B.r);r++){const row=[];for(let c=Math.min(A.c,B.c);c<=Math.max(A.c,B.c);c++)row.push(SHC.n2c(c)+r);out.push(row)}return out};
function shiftFormula(f,dr,dc){return f.split('"').map((seg,i)=>i%2?seg:seg.replace(/(\$?)([A-Z]{1,2})(\$?)(\d+)/g,(m,d1,c,d2,r)=>d1+(d1?c:SHC.n2c(SHC.c2n(c)+dc))+d2+(d2?r:(+r+dr)))).join('"')}
const fmtNum=v=>Number.isInteger(v)?String(v):String(+v.toFixed(6));
function calcFormula(src,get){
  const err=e=>({err:e});const isErr=v=>v&&typeof v==='object'&&v.err;
  const toks=[];let i=0;const s=src;
  while(i<s.length){const ch=s[i];
    if(/\s/.test(ch)){i++;continue}
    if(ch==='"'){let j=i+1,t='';while(j<s.length){if(s[j]==='"'){if(s[j+1]==='"'){t+='"';j+=2;continue}break}t+=s[j++]}toks.push({t:'str',v:t});i=j+1;continue}
    let m;const rest=s.slice(i);
    if(m=/^\$?[A-Z]{1,2}\$?\d+(:\$?[A-Z]{1,2}\$?\d+)?/.exec(rest)){toks.push({t:'ref',v:m[0]});i+=m[0].length;continue}
    if(m=/^[A-Z][A-Z0-9.]*(?=\()/.exec(rest)){toks.push({t:'fn',v:m[0]});i+=m[0].length;continue}
    if(m=/^(TRUE|FALSE)/.exec(rest)){toks.push({t:'bool',v:m[0]==='TRUE'});i+=m[0].length;continue}
    if(m=/^\d+(\.\d+)?/.exec(rest)){toks.push({t:'num',v:parseFloat(m[0])});i+=m[0].length;continue}
    if(m=/^(<=|>=|<>|[-+*\/^&=<>(),])/.exec(rest)){toks.push({t:'op',v:m[0]});i+=m[0].length;continue}
    return err('#NAME?')}
  let p=0;const peek=()=>toks[p],eat=()=>toks[p++];const isOp=v=>peek()&&peek().t==='op'&&peek().v===v;
  const num=v=>typeof v==='number'?v:typeof v==='boolean'?+v:v===''?0:(typeof v==='string'&&v.trim()!==''&&!isNaN(+v))?+v:NaN;
  const flat=a=>a.range?a.range.flat():[a];
  const nums=args=>args.flatMap(a=>flat(a)).filter(v=>typeof v==='number'||(!isErr(v)&&false));
  const crit=c=>{let op='=',v=c;if(typeof c==='string'){const m=/^(<=|>=|<>|<|>|=)?(.*)$/.exec(c);op=m[1]||'=';v=m[2];if(v!==''&&!isNaN(+v))v=+v}return x=>{let a=x,b=v;if(typeof a==='string'&&typeof b==='string'){a=a.toLowerCase();b=b.toLowerCase()}if(typeof a!==typeof b&&!(typeof a==='number'&&typeof b==='number'))return op==='<>';return op==='='?a===b:op==='<>'?a!==b:op==='<'?a<b:op==='>'?a>b:op==='<='?a<=b:a>=b}};
  const F={SUM:a=>nums(a).reduce((x,y)=>x+y,0),AVERAGE:a=>{const n=nums(a);return n.length?n.reduce((x,y)=>x+y,0)/n.length:err('#DIV/0!')},MIN:a=>{const n=nums(a);return n.length?Math.min(...n):0},MAX:a=>{const n=nums(a);return n.length?Math.max(...n):0},COUNT:a=>nums(a).length,
   COUNTA:a=>a.flatMap(flat).filter(v=>v!=='').length,ROUND:a=>{const k=Math.pow(10,num(a[1]||0));return Math.round(num(a[0])*k)/k},IF:a=>a[0]?a[1]:(a.length>2?a[2]:false),AND:a=>a.flatMap(flat).every(Boolean),OR:a=>a.flatMap(flat).some(Boolean),NOT:a=>!a[0],
   COUNTIF:a=>flat(a[0]).filter(crit(a[1])).length,SUMIF:a=>{const r=flat(a[0]),sr=a[2]?flat(a[2]):r,f=crit(a[1]);return r.reduce((t,v,i)=>t+(f(v)&&typeof sr[i]==='number'?sr[i]:0),0)},
   VLOOKUP:a=>{const t=a[1].range;if(!t)return err('#VALUE!');const col=num(a[2]);if(col<1||col>t[0].length)return err('#REF!');const exact=a.length>=4&&!a[3];const v=a[0];const eq=(x,y)=>typeof x==='string'&&typeof y==='string'?x.toLowerCase()===y.toLowerCase():x===y;
     if(exact){for(const row of t)if(eq(row[0],v))return row[col-1];return err('#N/A')}
     let best=null;for(const row of t){if(typeof row[0]==='number'&&typeof v==='number'){if(row[0]<=v)best=row}else if(eq(row[0],v))return row[col-1]}return best?best[col-1]:err('#N/A')}};
  const cmp=(a,b,op)=>{if(typeof a==='string'&&typeof b==='string'){a=a.toLowerCase();b=b.toLowerCase()}return op==='='?a===b:op==='<>'?a!==b:op==='<'?a<b:op==='>'?a>b:op==='<='?a<=b:a>=b};
  function prim(){const t=eat();if(!t)return err('#VALUE!');
    if(t.t==='num'||t.t==='str'||t.t==='bool')return t.v;
    if(t.t==='ref'){if(t.v.includes(':')){const rr=rangeRefs(t.v);return {range:rr.map(row=>row.map(get))}}return get(t.v.replace(/\$/g,''))}
    if(t.t==='fn'){if(!isOp('(')) return err('#NAME?');eat();const args=[];if(!isOp(')')){for(;;){args.push(expr());if(isOp(',')){eat();continue}break}}if(!isOp(')'))return err('#VALUE!');eat();
      for(const a of args)if(isErr(a))return a;const f=F[t.v];return f?f(args):err('#NAME?')}
    if(t.t==='op'&&t.v==='('){const v=expr();if(!isOp(')'))return err('#VALUE!');eat();return v}
    return err('#VALUE!')}
  function unary(){if(isOp('-')){eat();const v=unary();return isErr(v)?v:-num(v)}if(isOp('+')){eat();return unary()}return prim()}
  function pw(){let a=unary();while(isOp('^')){eat();const b=unary();if(isErr(a))return a;if(isErr(b))return b;a=Math.pow(num(a),num(b))}return a}
  function mul(){let a=pw();while(isOp('*')||isOp('/')){const o=eat().v;const b=pw();if(isErr(a))return a;if(isErr(b))return b;const x=num(a),y=num(b);if(isNaN(x)||isNaN(y))return err('#VALUE!');if(o==='/'&&y===0)return err('#DIV/0!');a=o==='*'?x*y:x/y}return a}
  function add(){let a=mul();while(isOp('+')||isOp('-')){const o=eat().v;const b=mul();if(isErr(a))return a;if(isErr(b))return b;const x=num(a),y=num(b);if(isNaN(x)||isNaN(y))return err('#VALUE!');a=o==='+'?x+y:x-y}return a}
  function cat(){let a=add();while(isOp('&')){eat();const b=add();if(isErr(a))return a;if(isErr(b))return b;a=String(typeof a==='number'?fmtNum(a):a)+String(typeof b==='number'?fmtNum(b):b)}return a}
  function expr(){let a=cat();while(peek()&&peek().t==='op'&&['=','<>','<','>','<=','>='].includes(peek().v)){const o=eat().v;const b=cat();if(isErr(a))return a;if(isErr(b))return b;a=cmp(a,b,o)}return a}
  const v=expr();if(p<toks.length)return err('#VALUE!');return v}
/* A small editable spreadsheet. o:{cols:['A','B'],rows:n,data:{A1:'x'},widths:{A:120},editable:ref=>bool,header:rows to style as header} */
function Sheet(o){
  const me={data:Object.assign({},o.data||{}),cols:o.cols,rows:o.rows,sel:null,hl:{},lock:false,onCommit:null,validate:null,fmt:null,cells:{}};
  const val=(ref,stack=[])=>{const raw=me.data[ref];if(raw===undefined||raw==='')return '';const s=String(raw);if(s[0]!=='=')return (s.trim()!==''&&!isNaN(+s))?+s:s;if(stack.includes(ref))return {err:'#REF!'};return calcFormula(s.slice(1),r=>{const v=val(r,stack.concat(ref));return v});};
  me.val=ref=>val(ref);
  const show=v=>v&&typeof v==='object'&&v.err?v.err:typeof v==='boolean'?(v?'TRUE':'FALSE'):typeof v==='number'?fmtNum(v):String(v);
  const el=H('div',{class:'sheet'}),fxr=H('span',{class:'ref'},''),fxi=H('input',{type:'text','aria-label':'formula bar',readonly:'readonly'}),msg=H('div',{class:'msg'});
  const tw=H('div',{class:'wrapt'}),tb=H('table');tw.append(tb);el.append(H('div',{class:'fx'},fxr,H('b',{style:'color:var(--muted)'},'fx'),fxi),tw,msg);me.el=el;me.fxi=fxi;me.msg=(t,k)=>{msg.className='msg '+(k||'');msg.textContent=t||''};
  me.isEd=ref=>o.editable?o.editable(ref):false;
  me.render=()=>{tb.innerHTML='';const hr=H('tr',null,H('th',{class:'rn'},''));me.cols.forEach(c=>hr.append(H('th',{style:o.widths&&o.widths[c]?`min-width:${o.widths[c]}px`:'min-width:74px'},c)));tb.append(hr);
    for(let r=1;r<=me.rows;r++){const tr=H('tr',null,H('th',{class:'rn'},String(r)));me.cols.forEach(c=>{const ref=c+r,v=val(ref);const td=H('td',{'data-ref':ref,class:(typeof v==='number'?'n ':'')+(v&&v.err&&!me.showF?'err ':'')+(me.isEd(ref)?'ed ':'')+(me.sel===ref?'sel ':'')+(o.hdr&&o.hdr(ref)?'hdr ':''),tabindex:'-1'},(me.showF&&String(me.data[ref]||'')[0]==='=')?me.data[ref]:show(v));
      if(me.hl[ref])td.style.background=me.hl[ref];const f=me.fmt&&me.fmt(ref,v);if(f)Object.assign(td.style,f);td.onclick=()=>me.select(ref);me.cells[ref]=td;tr.append(td)});tb.append(tr)}
    if(me.sel)me.select(me.sel,true)};
  me.select=(ref,keep)=>{me.sel=ref;[...tb.querySelectorAll('td.sel')].forEach(t=>t.classList.remove('sel'));const td=me.cells[ref];if(td)td.classList.add('sel');fxr.textContent=ref;const ed=me.isEd(ref)&&!me.lock;fxi.value=me.data[ref]===undefined?'':me.data[ref];if(ed){fxi.removeAttribute('readonly');if(!keep)fxi.focus()}else fxi.setAttribute('readonly','readonly')};
  fxi.onkeydown=e=>{if(e.key==='Enter'&&me.sel&&me.isEd(me.sel)&&!me.lock){const ref=me.sel,raw=fxi.value;const bad=me.validate&&me.validate(ref,raw);if(bad){me.msg(bad,'bad');return}me.msg('');me.set(ref,raw);if(me.onCommit)me.onCommit(ref,raw);const rr=refOf(ref);const nx=SHC.n2c(rr.c)+(rr.r+1);if(me.cells[nx]&&me.isEd(nx))me.select(nx)}};
  me.set=(ref,raw)=>{if(raw===''||raw==null)delete me.data[ref];else me.data[ref]=raw;me.render()};
  me.setMany=obj=>{Object.assign(me.data,obj);me.render()};
  me.mark=(range,color)=>{rangeRefs(range).flat().forEach(r=>me.hl[r]=color);me.render()};me.unmark=()=>{me.hl={};me.render()};
  me.render();return me}
const stageHTML=(ctx,child)=>{ctx.stage.classList.add('html');ctx.stage.style.backgroundImage='none';ctx.stage.append(child);return child};

/* demo helpers */
function typeInto(ctx,sh,ref,text,ms,done){sh.select(ref,true);sh.fxi.removeAttribute('readonly');sh.fxi.value='';let i=0;const t=ctx.every(ms||70,()=>{i++;sh.fxi.value=text.slice(0,i);if(i>=text.length){clearInterval(t.iv);ctx.after(400,()=>{sh.set(ref,text);sh.select(ref,true);sh.fxi.setAttribute('readonly','readonly');if(done)done()})}})}
function fillDown(sh,from,toRow){const f=refOf(from);const raw=sh.data[from];for(let r=f.r+1;r<=toRow;r++)sh.data[SHC.n2c(f.c)+r]=shiftFormula(raw,r-f.r,0);sh.render()}
/* Run a list of formula tasks on a sheet. tasks:[{t,cell,exp,hint}] */
function sheetTasks(ctx,sh,tasks,onDone){let i=0;const box=H('div',{class:'fb info'}),pg=H('p',{class:'hint'},'');ctx.panel.append(H('p',{class:'hint'},'Click the highlighted cell, type a formula in the formula bar, and press Enter.'),box,pg);
  const show=()=>{const t=tasks[i];sh.unmark();sh.mark(t.cell+':'+t.cell,'rgba(240,176,48,.35)');sh.select(t.cell);box.className='fb info';box.textContent='Task '+(i+1)+' of '+tasks.length+': '+t.t;pg.textContent=''};
  sh.isEd=ref=>i<tasks.length&&ref===tasks[i].cell;sh.lock=false;sh.render();
  sh.onCommit=(ref,raw)=>{const t=tasks[i];if(ref!==t.cell)return;const v=sh.val(ref);const okForm=String(raw).trim()[0]==='=';const ok=okForm&&(typeof t.exp==='number'?(typeof v==='number'&&Math.abs(v-t.exp)<1e-6):v===t.exp);
    if(ok){box.className='fb good';box.textContent='Correct! '+t.cell+' shows '+(typeof v==='number'?fmtNum(v):v)+'.';cheer(true);i++;if(i>=tasks.length){sh.unmark();sh.isEd=()=>false;sh.render();pg.textContent='All tasks done!';onDone();return}ctx.after(1200,show)}
    else{box.className='fb bad';box.textContent=(okForm?'That gives '+(v&&v.err?v.err:(typeof v==='number'?fmtNum(v):'"'+v+'"'))+', not the right answer. ':'Start with =. ')+(t.hint||'');cheer(false)}};
  show()}

/* ---------- SVG charts for the spreadsheet scenes ---------- */
const CHPAL=['#2f64d8','#e5484d','#2faa4a','#e0911c','#8a63d2','#1aa39a'];
function chartSVG(type,d,o={}){const W=600,Hh=380,svg=S('svg',{viewBox:`0 0 ${W} ${Hh}`,role:'img','aria-label':o.title||'chart',style:'width:100%;height:auto;display:block'});const L0=78,B0=Hh-70,T0=o.title?56:24,R0=W-30;const pw=R0-L0,ph=B0-T0;
  if(o.title)svg.append(T(W/2,34,o.title,{'font-size':22,'font-family':'Fredoka,sans-serif'}));
  if(type==='pie'){const tot=d.values.reduce((a,b)=>a+b,0);let a0=-Math.PI/2;const cx=210,cy=210,r=130;d.values.forEach((v,i)=>{const a1=a0+v/tot*2*Math.PI;const lg=a1-a0>Math.PI?1:0;svg.append(S('path',{d:`M${cx} ${cy}L${cx+r*Math.cos(a0)} ${cy+r*Math.sin(a0)}A${r} ${r} 0 ${lg} 1 ${cx+r*Math.cos(a1)} ${cy+r*Math.sin(a1)}Z`,fill:CHPAL[i%6],stroke:'var(--paper)','stroke-width':3}));const am=(a0+a1)/2;svg.append(T(cx+r*.62*Math.cos(am),cy+r*.62*Math.sin(am)+6,Math.round(v/tot*100)+'%',{'font-size':18,fill:'#fff','font-family':'Fredoka,sans-serif'}));a0=a1});
    d.labels.forEach((l,i)=>svg.append(R(380,130+i*40,22,22,{rx:5,fill:CHPAL[i%6],'stroke-width':1.5}),T(412,148+i*40,l,{'text-anchor':'start','font-size':18})));return svg}
  const xs=d.xs||d.labels;const ymax=o.ymax||(()=>{const m=Math.max(...(d.ys||d.values));const st=m>100?50:m>50?10:m>20?5:2;return Math.ceil(m/st)*st})();const Y=v=>B0-v/ymax*ph;
  for(let k=0;k<=5;k++){const v=ymax*k/5;svg.append(L(L0,Y(v),R0,Y(v),{stroke:'var(--line)','stroke-width':1.5}),T(L0-10,Y(v)+5,String(+v.toFixed(1)),{'text-anchor':'end','font-size':14,fill:'var(--muted)'}))}
  svg.append(L(L0,T0,L0,B0,{'stroke-width':2.5}),L(L0,B0,R0,B0,{'stroke-width':2.5}));
  if(type==='bar'){const n=d.values.length,bw=pw/n*.55;d.values.forEach((v,i)=>{const x=L0+pw/n*(i+.5);svg.append(R(x-bw/2,Y(v),bw,B0-Y(v),{rx:4,fill:CHPAL[0],'stroke-width':2}),T(x,B0+22,d.labels[i],{'font-size':16}),T(x,Y(v)-8,String(v),{'font-size':14,fill:'var(--muted)'}))})}
  if(type==='line'){const n=d.values.length;const pts=d.values.map((v,i)=>[L0+pw/(n-1||1)*i*0.92+pw*.04,Y(v)]);svg.append(Pth(pts.map((p,i)=>(i?'L':'M')+p[0]+' '+p[1]).join(''),{stroke:CHPAL[0],'stroke-width':4}));pts.forEach((p,i)=>svg.append(C(p[0],p[1],6,{fill:CHPAL[0],'stroke-width':2}),T(p[0],B0+22,d.labels[i],{'font-size':16})))}
  if(type==='scatter'){const xm=Math.max(...d.xs)+1;d.xs.forEach((x,i)=>{svg.append(C(L0+x/xm*pw,Y(d.ys[i]),7,{fill:CHPAL[1],'stroke-width':2}))});for(let k=0;k<=xm;k++)svg.append(T(L0+k/xm*pw,B0+22,String(k),{'font-size':14,fill:'var(--muted)'}));if(o.trend)svg.append(Pth(`M${L0+0.6/xm*pw} ${Y(33)}L${L0+5.4/xm*pw} ${Y(85)}`,{stroke:'var(--muted)','stroke-width':3,'stroke-dasharray':'8 6'}))}
  if(o.xl)svg.append(T(L0+pw/2,Hh-14,o.xl,{'font-size':17,'font-family':'Fredoka,sans-serif',fill:'var(--accent)'}));
  if(o.yl)svg.append(T(22,T0+ph/2,o.yl,{'font-size':17,'font-family':'Fredoka,sans-serif',fill:'var(--accent)',transform:`rotate(-90 22 ${T0+ph/2})`}));
  return svg}

/* ---------- Logic gates: drawing and evaluation ---------- */
const GT={NOT:(a)=>+!a,AND:(a,b)=>a&b,OR:(a,b)=>a|b,NAND:(a,b)=>+!(a&b),NOR:(a,b)=>+!(a|b),XOR:(a,b)=>a^b};
function gateBody(type,x,y){const g=S('g');const st={fill:'var(--paper)',stroke:'var(--ink)','stroke-width':3,'stroke-linejoin':'round'};let outx=x+90;
  if(type==='AND'||type==='NAND')g.append(S('path',Object.assign({d:`M${x} ${y}H${x+45}A45 35 0 0 1 ${x+45} ${y+70}H${x}Z`},st)));
  if(type==='OR'||type==='NOR'||type==='XOR')g.append(S('path',Object.assign({d:`M${x} ${y}Q${x+55} ${y} ${x+90} ${y+35}Q${x+55} ${y+70} ${x} ${y+70}Q${x+22} ${y+35} ${x} ${y}Z`},st)));
  if(type==='XOR')g.append(S('path',{d:`M${x-12} ${y}Q${x+10} ${y+35} ${x-12} ${y+70}`,fill:'none',stroke:'var(--ink)','stroke-width':3,'stroke-linecap':'round'}));
  if(type==='NOT'){g.append(S('path',Object.assign({d:`M${x} ${y}L${x+70} ${y+35}L${x} ${y+70}Z`},st)));outx=x+70}
  if(type==='NAND'||type==='NOR'||type==='NOT'){g.append(C(outx+7,y+35,7,{fill:'var(--paper)','stroke-width':3}));outx+=14}
  g.append(T(x+(type==='NOT'?22:34),y+41,type,{'font-size':type.length>3?13:15,'font-family':'Fredoka,sans-serif',fill:'var(--muted)'}));
  const ix=x+(type==='XOR'?-6:0);return {g,ins:type==='NOT'?[[x,y+35]]:[[ix,y+17.5],[ix,y+52.5]],out:[outx,y+35]}}
const wireEl=d=>S('path',{d,fill:'none','stroke-width':5,'stroke-linecap':'round','stroke-linejoin':'round',stroke:'var(--muted)'});
const setWire=(w,v)=>{w.setAttribute('stroke',v?'var(--good)':'var(--muted)');w.setAttribute('stroke-width',v?6:5)};
function switchEl(x,y,label,onclick){const g=S('g',{class:'hit',role:'button','aria-label':'input '+label});const c=C(x,y,22,{fill:'var(--paper)','stroke-width':3.5});const t=T(x,y+8,'0',{'font-size':24,'font-family':'Fredoka,sans-serif'});g.append(c,t,T(x,y-32,label,{'font-size':20,fill:'var(--accent)','font-family':'Fredoka,sans-serif'}));g.onclick=onclick;g.set=v=>{c.setAttribute('fill',v?'var(--good-soft)':'var(--paper)');c.setAttribute('stroke',v?'var(--good)':'var(--ink)');t.textContent=String(v)};return g}
function lampEl(x,y,label){const g=S('g');const glow=C(x,y,40,{fill:'#ffe066',opacity:0,stroke:'none'}),c=C(x,y,24,{fill:'var(--paper)','stroke-width':3.5}),t=T(x,y+8,'0',{'font-size':24,'font-family':'Fredoka,sans-serif'});g.append(glow,c,t);if(label)g.append(T(x,y-48,label,{'font-size':20,fill:'var(--accent)','font-family':'Fredoka,sans-serif'}));g.set=v=>{glow.setAttribute('opacity',v?.8:0);c.setAttribute('fill',v?'#ffe066':'var(--paper)');t.textContent=String(v)};return g}
/* The one-gate stage used by scenes 3.1 and 3.2: switches, gate, lamp and a live truth table. */
function gateStage(ctx){
  const s=ctx.svg();const X={s,type:'AND',a:0,b:0,lock:false};const gx=210,gy=190;
  X.body=S('g');s.append(X.body);X.wires=S('g');s.append(X.wires);X.sw={a:switchEl(60,150,'A',()=>{X.a=X.a?0:1;X.upd()}),b:switchEl(60,280,'B',()=>{X.b=X.b?0:1;X.upd()})};s.append(X.sw.a,X.sw.b);X.lamp=lampEl(470,225,'Q');s.append(X.lamp);
  X.title=T(260,60,'',{'font-size':30,'font-family':'Fredoka,sans-serif',fill:'var(--accent)'});X.expl=T(260,420,'',{'font-size':18,fill:'var(--muted)'});s.append(X.title,X.expl);X.tt=S('g');s.append(X.tt);
  X.draw=type=>{X.type=type;X.body.innerHTML='';X.wires.innerHTML='';X.tt.innerHTML='';const gb=gateBody(type,gx,gy);X.body.append(gb.g);X.gb=gb;
    X.w=[];const one=type==='NOT';X.w.push(wireEl(`M82 150H140V${gb.ins[0][1]}H${gb.ins[0][0]}`));if(!one)X.w.push(wireEl(`M82 280H140V${gb.ins[1][1]}H${gb.ins[1][0]}`));X.w.push(wireEl(`M${gb.out[0]} ${gb.out[1]}H${gb.out[0]+30}V225H446`));X.w.forEach(w=>X.wires.append(w));
    X.sw.b.style.display=one?'none':'';X.title.textContent=type+' gate';
    /* table */const rows=one?[[0],[1]]:[[0,0],[0,1],[1,0],[1,1]];const tx=560,ty=100;X.rowEls=[];X.tt.append(T(tx+70,ty-6,'truth table',{'font-size':14,fill:'var(--muted)'}));const hd=one?['A','Q']:['A','B','Q'];hd.forEach((h,i)=>X.tt.append(T(tx+i*50+20,ty+20,h,{'font-size':18,'font-family':'Fredoka,sans-serif',fill:'var(--accent)'})));
    rows.forEach((r,i)=>{const y=ty+40+i*38;const rect=R(tx-4,y-4,(hd.length)*50,34,{rx:8,fill:'none',stroke:'var(--accent)','stroke-width':3,opacity:0});X.tt.append(rect);const q=one?GT.NOT(r[0]):GT[type](r[0],r[1]);[...r,q].forEach((v,k)=>X.tt.append(T(tx+k*50+20,y+20,String(v),{'font-size':20,fill:k===r.length?'var(--hot)':'var(--ink)','font-family':'JetBrains Mono, monospace'})));X.rowEls.push({rect,r})});X.upd()};
  X.upd=()=>{const one=X.type==='NOT';const q=one?GT.NOT(X.a):GT[X.type](X.a,X.b);X.sw.a.set(X.a);X.sw.b.set(X.b);X.lamp.set(q);setWire(X.w[0],X.a);if(!one)setWire(X.w[1],X.b);setWire(X.w[X.w.length-1],q);X.rowEls.forEach(o=>o.rect.setAttribute('opacity',(one?o.r[0]===X.a:(o.r[0]===X.a&&o.r[1]===X.b))?1:0))};
  X.set=(a,b)=>{X.a=a;X.b=b;X.upd()};
  X.cycle=(ctxx,ms,done)=>{const one=X.type==='NOT';const seq=one?[[0,0],[1,0]]:[[0,0],[0,1],[1,0],[1,1]];let i=0;X.set(seq[0][0],seq[0][1]);const t=ctxx.every(ms,()=>{i++;if(i>=seq.length){clearInterval(t.iv);if(done)done();return}X.set(seq[i][0],seq[i][1])})};
  X.draw('AND');return X}
