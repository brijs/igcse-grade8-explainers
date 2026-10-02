function showBoss(){
  frame();const per=CFG.perAct||5,total=ACTS.length*per;
  const mc=mum.make();const cap=H('div',{class:'bubble'},'Final round: '+total+' questions, '+per+' from each topic. Ready, Krishna?');
  const panel=H('div',{class:'panel'});
  app.append(H('div',{class:'sc-head'},H('button',{class:'btn ghost small',onclick:()=>showHome()},'Home'),H('h2',null,'Final round')));
  app.append(H('div',{class:'boss'},H('div',{class:'mcard'},mc,cap),panel));
  mum.mood('think');playLine('g.7');
  const qs=[];ACTS.forEach(a=>{const pool=[];SCENES.filter(s=>s.act===a.id).forEach(s=>s.quiz.forEach(q=>pool.push({q,topic:a.topic,scene:s.id,title:s.title})));shuffle(pool).slice(0,per).forEach(x=>qs.push(x))});
  const order=shuffle(qs);const tally={};ACTS.forEach(a=>tally[a.topic]={ok:0,n:0,miss:new Set()});
  let n=0;
  const next=()=>{
    if(n>=order.length){
      const tot=Object.values(tally).reduce((s,t)=>s+t.ok,0);
      panel.innerHTML='';panel.append(H('div',{class:'score'},tot+' out of '+order.length));
      ACTS.forEach(a=>{const t=tally[a.topic];panel.append(H('div',{class:'row'},H('b',null,a.topic+': '+t.ok+' of '+t.n),...[...t.miss].map(id=>H('button',{class:'btn ghost small',onclick:()=>openScene(id)},'Revisit '+id))))});
      const good=tot>=Math.ceil(order.length*0.8);
      cap.textContent=good?'Brilliant work, Krishna!':'Good effort! Revisit the scenes below and try again.';mum.mood('cheer');playLine(good?'g.9':'g.10');
      panel.append(H('div',{class:'nav'},H('button',{class:'btn ghost',onclick:()=>showBoss()},'Try again'),H('button',{class:'btn',onclick:()=>showCheat()},'Cheat sheet')));
      prog.boss=Math.max(prog.boss||0,tot);saveProg();return}
    const it=order[n];const host=H('div',{class:'opts'});panel.innerHTML='';
    panel.append(H('p',{class:'hint'},'Question '+(n+1)+' of '+order.length+'  ·  '+it.topic),host);
    ask(it.q,host,ok=>{const t=tally[it.topic];t.n++;if(ok)t.ok++;else t.miss.add(it.scene);n++;host.append(H('button',{class:'btn small',onclick:next},n>=order.length?'See score':'Next question'))});
  };next();
}
function showCheat(){
  frame();
  app.append(H('div',{class:'sc-head'},H('button',{class:'btn ghost small',onclick:()=>showHome()},'Home'),H('h2',null,'Cheat sheet')));
  const box=(c)=>H('div',{class:'act',style:'--ac:'+c.color},H('h2',null,c.title),H('ul',null,c.items.map(i=>H('li',{html:i}))));
  app.append(H('div',{class:'cheat'},CFG.cheat.map(box)));
}
showHome();
