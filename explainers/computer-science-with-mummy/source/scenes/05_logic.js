/* ===== 3.1 NOT, AND, OR ===== */
SCENES.push({id:'3.1',act:'logic',title:'NOT, AND and OR',idea:'The three basic gates and their truth tables',
 setup(ctx){return gateStage(ctx)},
 steps:[
  {k:'watch',run(X,ctx){X.draw('NOT');X.tt.setAttribute('opacity',1);X.set(0,0);X.expl.textContent='NOT flips the input: 0 becomes 1, and 1 becomes 0.';ctx.after(900,()=>X.cycle(ctx,2600))}},
  {k:'watch',run(X,ctx){X.draw('AND');X.tt.setAttribute('opacity',1);X.expl.textContent='AND: the output is 1 only if A AND B are both 1.';ctx.after(500,()=>X.cycle(ctx,1500,()=>{ctx.after(1500,()=>{X.draw('OR');X.expl.textContent='OR: the output is 1 if A OR B (or both) is 1.';X.cycle(ctx,1500)})}))}},
  {k:'predict',q:'An AND gate has input A = 1 and input B = 0. What is the output?',opts:['0','1','Both 0 and 1','It depends on the wire'],ans:0,why:'AND needs both inputs to be 1. B is 0, so the output is 0.',run(X){X.draw('AND');X.tt.setAttribute('opacity',1);X.set(0,0);X.expl.textContent='AND:  A = 1,  B = 0 ?'},reveal(X){X.set(1,0)}},
  {k:'try',build(X,ctx){const h=ctx.panel;X.tt.setAttribute('opacity',0);X.expl.textContent='Work out the output for every row.';const solved=new Set();let gate='NOT',cells=[];
   const holder=H('div'),fb=H('div',{class:'fb info'},'Tap an output box to change it between ? , 0 and 1, then press Check.'),pg=H('p',{class:'hint'},'Gates solved: 0 of 3');
   const build=()=>{X.draw(gate);X.tt.setAttribute('opacity',0);holder.innerHTML='';const one=gate==='NOT';const rows=one?[[0],[1]]:[[0,0],[0,1],[1,0],[1,1]];cells=rows.map(()=>null);
     const tb=H('table',{class:'pivot',style:'font-family:var(--f-mono)'},H('tr',null,...(one?['A','Q']:['A','B','Q']).map(x=>H('th',null,x))));
     rows.forEach((r,i)=>{const b=H('button',{class:'chip',onclick:()=>{cells[i]=cells[i]===null?0:cells[i]===0?1:null;b.textContent=cells[i]===null?'?':String(cells[i])}},'?');tb.append(H('tr',null,...r.map(v=>H('td',null,String(v))),H('td',null,b)))});holder.append(tb)};
   const chk=H('button',{class:'btn small',onclick:()=>{const one=gate==='NOT';const rows=one?[[0],[1]]:[[0,0],[0,1],[1,0],[1,1]];const ok=rows.every((r,i)=>cells[i]===(one?GT.NOT(r[0]):GT[gate](r[0],r[1])));
     if(ok){fb.className='fb good';fb.textContent=gate+' table correct!';cheer(true);solved.add(gate);pg.textContent='Gates solved: '+solved.size+' of 3';if(solved.size>=3){X.draw('AND');X.tt.setAttribute('opacity',1);ctx.done()}}else{fb.className='fb bad';fb.textContent='Not quite. Check each row against the rule for '+gate+'.';cheer(false)}}},'Check');
   pickRow(h,['NOT','AND','OR'].map(g=>({id:g,label:g})),id=>{gate=id;build();fb.className='fb info';fb.textContent='Fill in the '+id+' table.'},'NOT');build();h.append(holder,chk,fb,pg)}},
  {k:'sum',take:'NOT flips the input. AND gives 1 only if both inputs are 1. OR gives 1 if at least one input is 1.',run(X){X.draw('AND');X.tt.setAttribute('opacity',1);X.set(1,1);X.expl.textContent='NOT   AND   OR'}}],
 quiz:[Q('t','A NOT gate has input 1. What is its output?',['0','1','Either','No output'],0,'NOT flips the input.'),Q('t','Which gate outputs 1 only when both inputs are 1?',['AND','OR','NOT','XOR'],0,'AND needs both inputs to be 1.'),
  Q('t','An OR gate has A = 1 and B = 0. What is the output?',['1','0','Both','None'],0,'OR gives 1 if at least one input is 1.'),Q('t','How many rows does a truth table for a two-input gate have?',['4','2','3','8'],0,'Two inputs have 2 × 2 = 4 combinations.')]});

/* ===== 3.2 NAND, NOR and XOR ===== */
SCENES.push({id:'3.2',act:'logic',title:'NAND, NOR and XOR',idea:'NOT-AND, NOT-OR and exclusive OR',
 setup(ctx){return gateStage(ctx)},
 steps:[
  {k:'watch',run(X,ctx){X.draw('NAND');X.tt.setAttribute('opacity',1);X.expl.textContent='NAND = NOT AND: the opposite of AND.';ctx.after(500,()=>X.cycle(ctx,1500,()=>{ctx.after(1500,()=>{X.draw('NOR');X.expl.textContent='NOR = NOT OR: the opposite of OR.';X.cycle(ctx,1500)})}))}},
  {k:'watch',run(X,ctx){X.draw('XOR');X.tt.setAttribute('opacity',1);X.expl.textContent='XOR: the output is 1 only if the inputs are DIFFERENT.';ctx.after(500,()=>X.cycle(ctx,2000))}},
  {k:'predict',q:'An XOR gate has A = 1 and B = 1. What is the output?',opts:['0','1','Both','Neither'],ans:0,why:'XOR outputs 1 only when the inputs are different. Both are 1, so the output is 0.',run(X){X.draw('XOR');X.tt.setAttribute('opacity',1);X.set(0,0);X.expl.textContent='XOR:  A = 1,  B = 1 ?'},reveal(X){X.set(1,1)}},
  {k:'try',build(X,ctx){const h=ctx.panel;X.draw('AND');X.tt.setAttribute('opacity',0);X.expl.textContent='Which gate has this truth table?';
   const tabs=[{g:'NAND',o:[1,1,1,0]},{g:'NOR',o:[1,0,0,0]},{g:'XOR',o:[0,1,1,0]},{g:'OR',o:[0,1,1,1]}];const opts=['AND','OR','NAND','NOR','XOR'];let i=0;const host=H('div');h.append(host);
   const nxt=()=>{if(i>=tabs.length){host.innerHTML='';host.append(H('div',{class:'fb good'},'All four identified!'));ctx.done();return}const t=tabs[i],box=H('div');host.innerHTML='';
     const tb=H('table',{class:'pivot',style:'font-family:var(--f-mono)'},H('tr',null,H('th',null,'A'),H('th',null,'B'),H('th',null,'Q')),...[[0,0],[0,1],[1,0],[1,1]].map((r,k)=>H('tr',null,H('td',null,String(r[0])),H('td',null,String(r[1])),H('td',null,String(t.o[k])))));
     host.append(H('p',{class:'hint'},'Table '+(i+1)+' of '+tabs.length),tb,box);ask({q:'Which gate is it?',o:opts,a:opts.indexOf(t.g),why:t.g+' gives exactly this pattern.'},box,()=>{box.append(H('button',{class:'btn small',onclick:()=>{i++;nxt()}},i>=tabs.length-1?'Finish':'Next table'))})};nxt()}},
  {k:'sum',take:'NAND is NOT AND. NOR is NOT OR. XOR gives 1 only when the inputs are different.',run(X){X.draw('XOR');X.tt.setAttribute('opacity',1);X.set(1,0);X.expl.textContent='NAND   NOR   XOR'}}],
 quiz:[Q('t','A NAND gate has both inputs 1. What is the output?',['0','1','Either','Unknown'],0,'AND would give 1, so NAND gives 0.'),Q('t','Which gate outputs 1 only when its inputs are different?',['XOR','AND','NOR','OR'],0,'XOR means exclusive OR.'),
  Q('t','A NOR gate has both inputs 0. What is the output?',['1','0','Either','Unknown'],0,'OR would give 0, so NOR gives 1.'),Q('t','NAND is the same as…',['AND followed by NOT','OR followed by NOT','NOT followed by AND','XOR followed by NOT'],0,'NAND = NOT (A AND B).')]});

/* ===== 3.3 Logic circuits ===== */
SCENES.push({id:'3.3',act:'logic',title:'Logic circuits',idea:'Combine gates: Q = (A AND B) OR (NOT C)',
 setup(ctx){
  const s=ctx.svg();const X={s,a:0,b:0,c:0,seen:new Set(),on:null};
  const andG=gateBody('AND',210,125),notG=gateBody('NOT',210,300),orG=gateBody('OR',440,205);
  X.wire={a:wireEl('M82 110H135V142.5H210'),b:wireEl('M82 190H135V177.5H210'),c:wireEl('M82 335H210'),and:wireEl('M300 160H370V222.5H440'),not:wireEl('M296 335H370V257.5H440'),q:wireEl('M530 240H616')};
  X.gs={and:andG.g,not:notG.g,or:orG.g};X.sw={a:switchEl(60,110,'A',()=>X.tog('a')),b:switchEl(60,190,'B',()=>X.tog('b')),c:switchEl(60,335,'C',()=>X.tog('c'))};X.lamp=lampEl(640,240,'Q');
  X.parts=[X.sw.a,X.sw.b,X.sw.c,X.wire.a,X.wire.b,X.wire.c,andG.g,notG.g,X.wire.and,X.wire.not,orG.g,X.wire.q,X.lamp];X.parts.forEach(p=>s.append(p));
  X.expr=T(400,50,'Q = (A AND B) OR (NOT C)',{'font-size':26,'font-family':'Fredoka,sans-serif',fill:'var(--accent)'});X.note=T(400,425,'',{'font-size':18,fill:'var(--muted)'});s.append(X.expr,X.note);
  X.val=()=>{const and=X.a&X.b,nt=+!X.c,q=and|nt;return {and,nt,q}};
  X.upd=()=>{const v=X.val();['a','b','c'].forEach(k=>{X.sw[k].set(X[k]);setWire(X.wire[k],X[k])});setWire(X.wire.and,v.and);setWire(X.wire.not,v.nt);setWire(X.wire.q,v.q);X.lamp.set(v.q);if(X.on)X.on(v)};
  X.tog=k=>{X[k]=X[k]?0:1;X.upd()};X.set=(a,b,c)=>{X.a=a;X.b=b;X.c=c;X.upd()};X.set(0,0,0);return X},
 steps:[
  {k:'watch',run(X,ctx){X.on=null;X.set(0,0,0);X.expr.setAttribute('opacity',0);X.parts.forEach(p=>p.setAttribute('opacity',0));const order=[[X.sw.a,X.sw.b,X.sw.c,X.wire.a,X.wire.b,X.wire.c],[X.gs.and],[X.gs.not],[X.wire.and,X.wire.not,X.gs.or],[X.wire.q,X.lamp]];order.forEach((grp,i)=>ctx.after(600+i*2400,()=>grp.forEach(p=>p.setAttribute('opacity',1))));ctx.after(12800,()=>X.expr.setAttribute('opacity',1));X.note.textContent=''}},
  {k:'watch',run(X,ctx){X.on=null;X.parts.forEach(p=>p.setAttribute('opacity',1));X.expr.setAttribute('opacity',1);X.set(1,1,1);X.note.textContent='A=1, B=1, C=1:  AND = 1,  NOT C = 0,  OR gives Q = 1';ctx.after(4200,()=>{X.set(0,0,1);X.note.textContent='A=0, B=0, C=1:  AND = 0,  NOT C = 0,  OR gives Q = 0'});ctx.after(8500,()=>{X.set(0,0,0);X.note.textContent='A=0, B=0, C=0:  AND = 0,  NOT C = 1,  OR gives Q = 1'})}},
  {k:'predict',q:'A = 0, B = 1, C = 0. What is Q for Q = (A AND B) OR (NOT C)?',opts:['1','0','Cannot tell','Both'],ans:0,why:'A AND B = 0, but NOT C = 1. OR gives 1 if either side is 1, so Q = 1.',run(X){X.on=null;X.parts.forEach(p=>p.setAttribute('opacity',1));X.expr.setAttribute('opacity',1);X.set(0,1,0);X.note.textContent=''}},
  {k:'try',build(X,ctx){const h=ctx.panel;X.parts.forEach(p=>p.setAttribute('opacity',1));X.expr.setAttribute('opacity',1);X.note.textContent='';X.set(0,0,0);const found=new Set();let done=false;
   const fb=H('div',{class:'fb info'},'Switch A, B and C on and off. Find every input combination that makes Q = 1.'),pg=H('p',{class:'hint'},'Found 0 of 5'),list=H('div',{class:'chips'});
   const mk=k=>{const b=H('button',{class:'chip','aria-pressed':'false',onclick:()=>X.tog(k)},k.toUpperCase()+' = 0');return b};const bs={a:mk('a'),b:mk('b'),c:mk('c')};
   X.on=v=>{['a','b','c'].forEach(k=>{bs[k].textContent=k.toUpperCase()+' = '+X[k];bs[k].classList.toggle('sel',!!X[k])});const key=''+X.a+X.b+X.c;if(v.q&&!found.has(key)){found.add(key);list.append(H('span',{class:'chip sel'},'A'+X.a+' B'+X.b+' C'+X.c));fb.className='fb good';fb.textContent='Q = 1 for A='+X.a+', B='+X.b+', C='+X.c+'. New one!';pg.textContent='Found '+found.size+' of 5';cheer(true);if(found.size>=5&&!done){done=true;fb.textContent='All 5 found! Q = 1 whenever C = 0, or when A and B are both 1.';ctx.done()}}else if(!v.q){fb.className='fb info';fb.textContent='Q = 0 for this combination.'}};
   h.append(H('div',{class:'chips'},bs.a,bs.b,bs.c),fb,pg,list);X.on({q:0})}},
  {k:'sum',take:'A logic circuit joins gates. Follow the inputs through each gate in turn. A truth table for three inputs has eight rows.',run(X){X.on=null;X.parts.forEach(p=>p.setAttribute('opacity',1));X.expr.setAttribute('opacity',1);X.set(1,1,0);X.note.textContent=''}}],
 quiz:[Q('t','For Q = (A AND B) OR (NOT C), what is Q when A = 1, B = 1, C = 1?',['1','0','Cannot tell','2'],0,'A AND B = 1, so OR gives 1.'),Q('t','For the same circuit, what is Q when A = 0, B = 0, C = 1?',['0','1','Cannot tell','Both'],0,'A AND B = 0 and NOT C = 0, so Q = 0.'),
  Q('t','How many rows are in a truth table with three inputs?',['8','6','4','3'],0,'2 × 2 × 2 = 8 combinations.'),Q('t','What does a logic circuit do?',['Joins gates to make a decision','Stores files','Draws charts','Encrypts text'],0,'Gates combine to turn inputs into an output.')]});

/* ===== 3.4 The half adder ===== */
SCENES.push({id:'3.4',act:'logic',title:'Adding with gates: the half adder',idea:'XOR gives the sum, AND gives the carry',
 setup(ctx){
  const s=ctx.svg();const X={s,a:0,b:0,seen:new Set(),on:null};
  const xg=gateBody('XOR',230,110),ag=gateBody('AND',230,270);
  X.w={a1:wireEl('M82 150H150V127.5H224'),a2:wireEl('M150 150V287.5H230'),b1:wireEl('M82 250H190V162.5H224'),b2:wireEl('M190 250V322.5H230'),s:wireEl('M320 145H496'),c:wireEl('M320 305H496')};
  X.sw={a:switchEl(60,150,'A',()=>X.tog('a')),b:switchEl(60,250,'B',()=>X.tog('b'))};X.ls=lampEl(520,145,'Sum');X.lc=lampEl(520,305,'Carry');
  [xg.g,ag.g,...Object.values(X.w),X.sw.a,X.sw.b,X.ls,X.lc].forEach(p=>s.append(p));X.xg=xg.g;X.ag=ag.g;
  s.append(T(400,52,'Half adder: adds two bits',{'font-size':24,'font-family':'Fredoka,sans-serif',fill:'var(--accent)'}),T(290,100,'XOR → Sum',{'font-size':14,fill:'var(--muted)'}),T(290,262,'AND → Carry',{'font-size':14,fill:'var(--muted)'}));
  X.res=T(690,235,'',{'font-size':34,'font-family':'JetBrains Mono, monospace',fill:'var(--ink)'});X.res2=T(690,270,'binary',{'font-size':14,fill:'var(--muted)'});X.note=T(400,425,'',{'font-size':18,fill:'var(--accent)','font-family':'Fredoka,sans-serif'});s.append(X.res,X.res2,X.note);
  X.upd=()=>{const sum=X.a^X.b,carry=X.a&X.b;X.sw.a.set(X.a);X.sw.b.set(X.b);setWire(X.w.a1,X.a);setWire(X.w.a2,X.a);setWire(X.w.b1,X.b);setWire(X.w.b2,X.b);setWire(X.w.s,sum);setWire(X.w.c,carry);X.ls.set(sum);X.lc.set(carry);X.res.textContent=X.a+' + '+X.b+' = '+carry+sum;if(X.on)X.on(sum,carry)};
  X.tog=k=>{X[k]=X[k]?0:1;X.upd()};X.set=(a,b)=>{X.a=a;X.b=b;X.upd()};X.set(0,0);return X},
 steps:[
  {k:'watch',run(X,ctx){X.on=null;X.set(0,0);X.note.textContent='Adding in binary: 0 + 0 = 00';[[0,1,'0 + 1 = 01'],[1,0,'1 + 0 = 01'],[1,1,'1 + 1 = 10: a carry!']].forEach((c,i)=>ctx.after(2800+i*2800,()=>{X.set(c[0],c[1]);X.note.textContent='Adding in binary: '+c[2]}))}},
  {k:'watch',run(X,ctx){X.on=null;X.set(1,1);X.note.textContent='The XOR gate makes the Sum bit';X.xg.setAttribute('opacity',1);ctx.after(1500,()=>{X.ag.setAttribute('opacity',.35)});ctx.after(5000,()=>{X.xg.setAttribute('opacity',.35);X.ag.setAttribute('opacity',1);X.note.textContent='The AND gate makes the Carry bit'});ctx.after(9000,()=>{X.xg.setAttribute('opacity',1);X.note.textContent='Computers chain adders together to add big numbers'})}},
  {k:'predict',q:'What is 1 + 1 in binary?',opts:['10','2','11','1'],ans:0,why:'In binary there is no digit 2. One plus one is 0 carry 1, which is written 10.',run(X){X.on=null;X.xg.setAttribute('opacity',1);X.ag.setAttribute('opacity',1);X.set(0,0);X.note.textContent=''},reveal(X){X.set(1,1)}},
  {k:'try',build(X,ctx){const h=ctx.panel;X.xg.setAttribute('opacity',1);X.ag.setAttribute('opacity',1);X.note.textContent='';X.set(0,0);const seen=new Set(['00']);let asked=false;
   const fb=H('div',{class:'fb info'},'Set A and B to all four combinations.'),pg=H('p',{class:'hint'},'Combinations seen: 1 of 4'),qbox=H('div');
   const mk=k=>H('button',{class:'chip','aria-pressed':'false',onclick:()=>X.tog(k)},k.toUpperCase()+' = 0');const bs={a:mk('a'),b:mk('b')};
   X.on=(sum,carry)=>{['a','b'].forEach(k=>{bs[k].textContent=k.toUpperCase()+' = '+X[k];bs[k].classList.toggle('sel',!!X[k])});seen.add(''+X.a+X.b);pg.textContent='Combinations seen: '+seen.size+' of 4';fb.className='fb good';fb.textContent=X.a+' + '+X.b+' = '+carry+sum+'  (carry '+carry+', sum '+sum+')';
     if(seen.size>=4&&!asked){asked=true;qbox.append(H('p',{class:'hint'},'One more question:'));const b2=H('div');qbox.append(b2);ask({q:'Which gate produces the Carry?',o:['XOR','AND','OR','NOT'],a:1,why:'The carry is 1 only when both bits are 1: that is AND.'},b2,()=>ctx.done())}};
   h.append(H('div',{class:'chips'},bs.a,bs.b),fb,pg,qbox)}},
  {k:'sum',take:'A half adder adds two bits. Sum = A XOR B. Carry = A AND B. In binary, one plus one is ten.',run(X){X.on=null;X.xg.setAttribute('opacity',1);X.ag.setAttribute('opacity',1);X.set(1,1);X.note.textContent=''}}],
 quiz:[Q('t','What is 1 + 1 in binary?',['10','2','11','1'],0,'1 + 1 = 0 carry 1, which is written 10.'),Q('t','Which gate makes the Sum in a half adder?',['XOR','AND','OR','NOT'],0,'Sum = A XOR B.'),
  Q('t','Which gate makes the Carry in a half adder?',['AND','XOR','OR','NOT'],0,'Carry = A AND B.'),Q('t','A = 1 and B = 0 are added. What are Sum and Carry?',['Sum 1, Carry 0','Sum 0, Carry 1','Sum 1, Carry 1','Sum 0, Carry 0'],0,'XOR gives 1 and AND gives 0.')]});
