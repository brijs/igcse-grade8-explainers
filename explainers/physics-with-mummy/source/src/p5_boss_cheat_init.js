function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function showBoss(){
  frame();
  const mc=mum.make();const cap=H('div',{class:'bubble'},'Final round: twenty questions, five from each topic. Ready, Krishna?');
  const panel=H('div',{class:'panel'});
  app.append(H('div',{class:'sc-head'},H('button',{class:'btn ghost small',onclick:()=>showHome()},'Home'),H('h2',null,'Final round')));
  app.append(H('div',{class:'boss'},H('div',{class:'mcard'},mc,cap),panel));
  mum.mood('think');playLine('g.7');
  const qs=[];ACTS.forEach(a=>{const pool=[];SCENES.filter(s=>s.act===a.id).forEach(s=>s.quiz.forEach(q=>pool.push({q,topic:a.topic,scene:s.id,title:s.title})));shuffle(pool).slice(0,5).forEach(x=>qs.push(x))});
  const order=shuffle(qs);const tally={};ACTS.forEach(a=>tally[a.topic]={ok:0,n:0,miss:new Set()});
  let n=0;
  const next=()=>{
    if(n>=order.length){
      const tot=Object.values(tally).reduce((s,t)=>s+t.ok,0);
      panel.innerHTML='';panel.append(H('div',{class:'score'},tot+' out of '+order.length));
      ACTS.forEach(a=>{const t=tally[a.topic];panel.append(H('div',{class:'row'},H('b',null,a.topic+': '+t.ok+' of '+t.n),...[...t.miss].map(id=>H('button',{class:'btn ghost small',onclick:()=>openScene(id)},'Revisit '+id))))});
      cap.textContent=tot>=16?'Brilliant work, Krishna!':'Good effort! Revisit the scenes below and try again.';mum.mood('cheer');playLine(tot>=16?'g.9':'g.10');
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
  const m=t=>H('span',{class:'mono'},t);
  const box=(cls,title,items)=>H('div',{class:'act '+cls},H('h2',null,title),H('ul',null,items.map(i=>H('li',{html:i}))));
  app.append(H('div',{class:'cheat'},
   box('qty','Physical quantities',['Quantity = number + unit.','<span class="mono">length</span> m, cm, km &nbsp; <span class="mono">mass</span> kg, g &nbsp; <span class="mono">time</span> s &nbsp; <span class="mono">temperature</span> °C','<span class="mono">volume</span> cm³, m³, litres (1 litre = 1000 cm³)','Read a measuring cylinder at the bottom of the meniscus, eye level.','Repeat readings and take the mean.']),
   box('motion','Motion graphs',['<span class="mono">speed = distance ÷ time</span> (m/s, km/h)','Distance-time: slope = speed. Flat line = stationary. Steeper = faster.','Speed-time: flat line = constant speed. Slope = acceleration. Area = distance.','Always read the axes, scale and units first.']),
   box('dens','Density',['<span class="mono">density = mass ÷ volume</span> (g/cm³ or kg/m³)','<span class="mono">mass = density × volume</span> &nbsp; <span class="mono">volume = mass ÷ density</span>','Water: 1 g/cm³. Denser than water sinks; less dense floats.','Irregular solid: volume by displacement in water.','Gases are least dense; solids usually most dense.']),
   box('heat','Thermal energy transfer',['Conduction: particles vibrate and pass energy along. Mainly solids. Metals best.','Convection: warm fluid expands, is less dense, rises; cool fluid sinks. Liquids and gases.','Radiation: infrared waves. No particles needed, works in a vacuum.','Dull black = best absorber and emitter. Shiny / white = best reflector.','Vacuum flask: vacuum stops conduction and convection; silver reflects radiation; plastic stopper is a poor conductor.','Insulators (wool, trapped air, plastic) are poor conductors.'])));
}
showHome();
