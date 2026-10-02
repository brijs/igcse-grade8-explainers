/* ===== 2.4 Conditional formatting and data validation ===== */
const SCD={A1:'Student',B1:'Score',C1:'New score',D1:'Grade',A2:'Anna',B2:'82',A3:'Ben',B3:'35',A4:'Chitra',B4:'91',A5:'Dev',B5:'48',A6:'Esha',B6:'67',A7:'Farhan',B7:'29',A8:'Gita',B8:'74',A9:'Hari',B9:'55'};
const CFCOL={green:'#b7e4c0',red:'#f6b4b8',amber:'#fbe0a3'};
SCENES.push({id:'2.4',act:'sheet',title:'Formatting and validation',idea:'Conditional formatting and data validation',
 setup(ctx){
  const sh=Sheet({cols:['A','B','C','D'],rows:9,data:SCD,widths:{A:100,C:110},hdr:r=>/^[A-D]1$/.test(r)});sh.lock=true;const cap=H('div',{class:'fb info'},'');stageHTML(ctx,H('div',{style:'display:flex;flex-direction:column;gap:10px'},sh.el,cap));
  const X={sh,cap,rules:[],say:t=>{cap.textContent=t}};
  sh.fmt=(ref,v)=>{if(/^B([2-9])$/.test(ref)&&typeof v==='number'){for(const r of X.rules){const hit=r.op==='<'?v<r.v:r.op==='>'?v>r.v:v===r.v;if(hit)return {background:CFCOL[r.col],fontWeight:'800'}}}return null};
  X.reset=()=>{sh.data=Object.assign({},SCD);X.rules=[];sh.lock=true;sh.isEd=()=>false;sh.validate=null;sh.msg('');sh.unmark()};return X},
 steps:[
  {k:'watch',run(X,ctx){X.reset();X.say('Conditional formatting changes how a cell looks, depending on its value.');ctx.after(1200,()=>{X.rules=[{op:'<',v:40,col:'red'}];X.sh.render();X.say('Rule: scores below 40 turn red');ctx.after(2800,()=>{X.rules.push({op:'>',v:80,col:'green'});X.sh.render();X.say('New rule: scores above 80 turn green');ctx.after(3000,()=>{X.sh.set('B4','35');X.say('Change Chitra to 35: the colour rule is not a one-off, it changes with the data!')})})})}},
  {k:'watch',run(X,ctx){X.reset();X.sh.isEd=r=>r==='C2';X.say('Data validation stops wrong data being typed in. C2 only accepts whole numbers from 0 to 100.');
   X.sh.validate=(ref,raw)=>{const n=+raw;return (raw===''||isNaN(n)||!Number.isInteger(n)||n<0||n>100)?'Error: enter a whole number from 0 to 100':null};
   ctx.after(1800,()=>typeInto(ctx,X.sh,'C2','105',200,()=>{X.sh.set('C2','');X.sh.msg(X.sh.validate('C2','105'),'bad');X.sh.fxi.removeAttribute('readonly');X.sh.fxi.value='105';ctx.after(3200,()=>{X.sh.msg('');typeInto(ctx,X.sh,'C2','85',200,()=>{X.sh.msg('85 is accepted','good')})})}))}},
  {k:'predict',q:'What is data validation used for?',opts:['To stop invalid data being entered','To change cell colours','To add up numbers','To draw charts'],ans:0,why:'Validation rules check what is typed. They reject values outside the allowed range or list.',run(X){X.reset();X.say('')}},
  {k:'try',build(X,ctx){X.reset();const h=ctx.panel;let part=1,op='<',val=50,col='red',tried=false;
   const fb=H('div',{class:'fb info'},'Part 1: make every score below 50 turn red.');
   const sel=H('select',{id:'op'},H('option',{value:'<'},'is less than'),H('option',{value:'>'},'is greater than'));const num=H('input',{type:'number',value:60,id:'nv'});
   const chips=pickRow(h,[],()=>{},null);chips.remove();const cr=H('div',{class:'chips'});['red','green','amber'].forEach(c=>{const b=H('button',{class:'chip'+(c===col?' sel':''),onclick:()=>{col=c;[...cr.children].forEach(x=>x.classList.remove('sel'));b.classList.add('sel')}},c);cr.append(b)});
   const apply=H('button',{class:'btn small',onclick:()=>{op=sel.value;val=+num.value;X.rules=[{op,v:val,col}];X.sh.render();
     if(op==='<'&&val===50&&col==='red'){fb.className='fb good';fb.textContent='Part 1 done: Ben, Dev and Farhan are red. Now part 2.';cheer(true);startPart2()}else{fb.className='fb bad';fb.textContent='Applied, but you need: less than 50, in red.';cheer(false)}}},'Apply rule');
   const p1=H('div',{class:'opts'},H('div',{class:'field'},H('label',{for:'op'},'Highlight scores that'),sel),H('div',{class:'field'},H('label',{for:'nv'},'the number'),num),cr,apply);
   const p2=H('div',{style:'display:none'});const startPart2=()=>{part=2;p1.style.display='none';p2.style.display='';X.sh.isEd=r=>r==='C2';X.sh.lock=false;X.sh.render();X.sh.select('C2');X.sh.mark('C2:C2','rgba(240,176,48,.35)');
     X.sh.validate=(ref,raw)=>{const n=+raw;return (raw===''||isNaN(n)||!Number.isInteger(n)||n<0||n>100)?'Error: enter a whole number from 0 to 100':null};
     X.sh.onCommit=(ref,raw)=>{if(tried){fb.className='fb good';fb.textContent='Valid score accepted. Validation works!';cheer(true);X.sh.isEd=()=>false;ctx.done()}};
     const orig=X.sh.validate;X.sh.validate=(r,raw)=>{const m=orig(r,raw);if(m)tried=true;return m};
     p2.append(H('p',{class:'hint'},'Part 2: C2 only accepts whole numbers from 0 to 100. Click C2, type 150 and press Enter. Then type a valid score such as 90.'))};
   h.append(fb,p1,p2)}},
  {k:'sum',take:'Conditional formatting changes the look of cells that meet a rule. Data validation limits what can be typed, such as a range or a list.',run(X){X.reset();X.rules=[{op:'<',v:40,col:'red'},{op:'>',v:80,col:'green'}];X.sh.render();X.say('Formatting = how it looks.  Validation = what is allowed.')}}],
 quiz:[Q('t','What does conditional formatting do?',['Changes how a cell looks when it meets a rule','Stops wrong data being typed','Adds two numbers','Draws a graph'],0,'For example, turning low marks red.'),Q('t','Which is an example of data validation?',['Allowing only whole numbers from 0 to 100','Making text bold','Sorting A to Z','Adding a chart title'],0,'It restricts what can be entered.'),
  Q('t','You want a cell to accept only A, B or C. What do you use?',['A list validation rule','Conditional formatting','A pivot table','A chart'],0,'A list rule allows only the listed values.')]});

/* ===== 2.5 VLOOKUP ===== */
const VLD={A1:'Order code',B1:'Item',C1:'Price',A2:'P03',A3:'P01',A4:'P05',E1:'Code',F1:'Item',G1:'Price',E2:'P01',F2:'Pen',G2:'1.5',E3:'P02',F3:'Book',G3:'4',E4:'P03',F4:'Bag',G4:'12.5',E5:'P04',F5:'Ruler',G5:'0.8',E6:'P05',F6:'Bottle',G6:'6'};
SCENES.push({id:'2.5',act:'sheet',title:'VLOOKUP',idea:'Look up a value in a table',
 setup(ctx){
  const sh=Sheet({cols:['A','B','C','D','E','F','G'],rows:6,data:VLD,widths:{A:100,D:20},hdr:r=>/^[A-G]1$/.test(r)});sh.lock=true;const cap=H('div',{class:'fb info'},'');stageHTML(ctx,H('div',{style:'display:flex;flex-direction:column;gap:10px'},sh.el,cap));
  return {sh,cap,say:t=>{cap.textContent=t},reset(){sh.data=Object.assign({},VLD);sh.unmark();sh.lock=true;sh.isEd=()=>false;sh.showF=false;sh.render()}}},
 steps:[
  {k:'watch',run(X,ctx){X.reset();X.say('=VLOOKUP(what to find, table, column number, FALSE)');ctx.after(900,()=>X.sh.mark('A2:A2','rgba(229,72,77,.3)'));ctx.after(2600,()=>X.sh.mark('E2:G6','rgba(47,100,216,.14)'));ctx.after(4300,()=>{X.sh.mark('F2:F6','rgba(47,170,74,.28)');X.say('Column 2 of the table (E:G) is Item. FALSE means an exact match.')});
   ctx.after(6500,()=>{X.sh.unmark();typeInto(ctx,X.sh,'B2','=VLOOKUP(A2,$E$2:$G$6,2,FALSE)',60,()=>X.say('It searches the first column for P03, then returns the Item: Bag'))})}},
  {k:'watch',run(X,ctx){X.reset();X.sh.setMany({B2:'=VLOOKUP(A2,$E$2:$G$6,2,FALSE)'});X.sh.mark('E2:E6','rgba(47,100,216,.14)');X.say('VLOOKUP checks the first column from the top: P01? P02? P03! Found.');[2,3,4].forEach((r,i)=>ctx.after(800+i*1000,()=>{X.sh.unmark();X.sh.mark('E2:E6','rgba(47,100,216,.1)');X.sh.mark('E'+r+':G'+r,'rgba(240,176,48,.35)')}));ctx.after(5000,()=>{X.sh.unmark();fillDown(X.sh,'B2',4);X.say('Fill down and every code gets its item.')})}},
  {k:'predict',q:'In =VLOOKUP(A2,E2:G6,3,FALSE), what does the 3 mean?',opts:['Return the value from the 3rd column of the table','Look up the value 3','Search 3 rows only','Return the 3rd row'],ans:0,why:'The third argument is the column number inside the table. Column 3 is Price.',run(X){X.reset();X.sh.mark('E2:G6','rgba(47,100,216,.14)');X.say('3rd column of E:G = Price')}},
  {k:'try',build(X,ctx){X.reset();X.sh.mark('E2:G6','rgba(47,100,216,.1)');X.say('Look up details for each order code.');
   sheetTasks(ctx,X.sh,[{t:'In C2, find the price for the code in A2 (P03).',cell:'C2',exp:12.5,hint:'Try =VLOOKUP(A2,$E$2:$G$6,3,FALSE).'},{t:'In B3, find the item for the code in A3 (P01).',cell:'B3',exp:'Pen',hint:'The item is column 2: =VLOOKUP(A3,$E$2:$G$6,2,FALSE).'},{t:'In C4, find the price for the code in A4 (P05).',cell:'C4',exp:6,hint:'Price is column 3.'}],ctx.done)}},
  {k:'sum',take:'VLOOKUP finds a value in the first column of a table and returns a value from a column you choose. Use FALSE for an exact match.',run(X){X.reset();X.sh.mark('E2:G6','rgba(47,100,216,.1)');X.say('VLOOKUP(find, table, column, FALSE)')}}],
 quiz:[Q('t','In =VLOOKUP(A2,E2:G6,3,FALSE), what does FALSE mean?',['Find an exact match','The formula is wrong','Do not return anything','Search from the bottom'],0,'FALSE asks for an exact match.'),Q('t','VLOOKUP searches for the lookup value in…',['The first column of the table','The last column','Every column','The first row'],0,'The lookup value is matched in the first column of the table.'),
  Q('t','What happens if the lookup value is not in the table (exact match)?',['It shows #N/A','It shows 0','It shows a blank','It guesses'],0,'#N/A means not available.')]});

/* ===== 2.6 Pivot tables ===== */
const PV=[['North','Pen',20],['North','Book',15],['South','Pen',30],['South','Bag',10],['East','Book',25],['East','Pen',12],['North','Bag',8],['South','Book',18],['East','Bag',14],['South','Pen',22]];
function pivotCalc(f,agg){const g={};PV.forEach(r=>(g[r[f]]=g[r[f]]||[]).push(r[2]));const fn=a=>agg==='sum'?a.reduce((x,y)=>x+y,0):agg==='count'?a.length:a.reduce((x,y)=>x+y,0)/a.length;const rows=Object.keys(g).sort().map(k=>[k,fn(g[k])]);rows.push(['Grand total',fn(PV.map(r=>r[2]))]);return rows}
SCENES.push({id:'2.6',act:'sheet',title:'Pivot tables',idea:'Summarise lots of data quickly',
 setup(ctx){
  const wrap=H('div',{style:'display:flex;gap:16px;flex-wrap:wrap;align-items:flex-start'});const raw=H('table',{class:'pivot',style:'font-size:.9rem'},H('tr',null,['Region','Product','Units'].map(h=>H('th',null,h))),...PV.map(r=>H('tr',null,r.map((c,i)=>H('td',{style:i===2?'text-align:right':''},String(c))))));
  const pv=H('div',{style:'min-width:200px'}),cap=H('div',{class:'fb info',style:'width:100%'},'');wrap.append(H('div',null,H('b',null,'Raw data'),raw),H('div',null,H('b',null,'Pivot table'),pv));stageHTML(ctx,H('div',{style:'display:flex;flex-direction:column;gap:12px'},wrap,cap));
  const X={pv,cap,say:t=>{cap.textContent=t},draw(f,agg,anim,ctxx){pv.innerHTML='';const rows=pivotCalc(f,agg);const lab=['Region','Product'][f]+' ↓';const t=H('table',{class:'pivot'},H('tr',null,H('th',null,lab),H('th',null,{sum:'Sum of Units',count:'Count of sales',avg:'Average Units'}[agg])));pv.append(t);rows.forEach((r,i)=>{const tr=H('tr',{style:i===rows.length-1?'font-weight:800':''},H('td',null,r[0]),H('td',{style:'text-align:right'},fmtNum(r[1])));if(anim&&ctxx){tr.style.opacity=0;ctxx.after(500+i*500,()=>tr.style.opacity=1)}t.append(tr)})}};
  return X},
 steps:[
  {k:'watch',run(X,ctx){X.say('Ten rows of sales. A pivot table groups and totals them for you.');X.pv.innerHTML='';ctx.after(1500,()=>{X.draw(0,'sum',true,ctx);X.say('Rows = Region, Values = Sum of Units. Instant totals.')})}},
  {k:'watch',run(X,ctx){X.draw(0,'sum');X.say('Same data. Change Rows to Product...');ctx.after(2500,()=>{X.draw(1,'sum',true,ctx);X.say('Totals for each product.')});ctx.after(6500,()=>{X.draw(1,'count',true,ctx);X.say('Change the calculation to Count: how many sales each product had.')})}},
  {k:'predict',q:'What is a pivot table used for?',opts:['Summarising large amounts of data','Making text bold','Checking spelling','Drawing pictures'],ans:0,why:'A pivot table groups rows and calculates totals, counts or averages without writing formulas.',run(X){X.pv.innerHTML='';X.say('')}},
  {k:'try',build(X,ctx){X.pv.innerHTML='';const h=ctx.panel;let f=0,agg='sum';const done=new Set();
   const goals=[{t:'Show the total units for each region.',f:0,a:'sum'},{t:'Show how many sales each product had.',f:1,a:'count'},{t:'Show the average units for each region.',f:0,a:'avg'}];let gi=0;
   const goal=H('div',{class:'fb info'},'Task 1 of 3: '+goals[0].t),fb=H('div');
   h.append(H('b',null,'Rows'));pickRow(h,[{id:0,label:'Region'},{id:1,label:'Product'}],id=>{f=id;X.draw(f,agg)},0);h.append(H('b',null,'Values'));pickRow(h,[{id:'sum',label:'Sum of Units'},{id:'count',label:'Count of sales'},{id:'avg',label:'Average Units'}],id=>{agg=id;X.draw(f,agg)},'sum');X.draw(0,'sum');
   const chk=H('button',{class:'btn small',onclick:()=>{const g=goals[gi];if(f===g.f&&agg===g.a){fb.className='fb good';fb.textContent='Yes! That is the pivot table for the task.';cheer(true);gi++;if(gi>=goals.length){goal.textContent='All three tasks done!';chk.disabled=true;ctx.done()}else goal.textContent='Task '+(gi+1)+' of 3: '+goals[gi].t}else{fb.className='fb bad';fb.textContent='Not quite: check which field goes in Rows and which calculation you chose.';cheer(false)}}},'Check my pivot table');
   h.append(goal,chk,fb)}},
  {k:'sum',take:'A pivot table summarises data. Choose a field for the rows, and a calculation such as sum, count or average.',run(X){X.draw(0,'sum');X.say('Rows + Values = a summary')}}],
 quiz:[Q('t','What does a pivot table do?',['Summarises data by grouping it','Spell checks text','Creates a password','Changes cell colours'],0,'It groups data and calculates summaries.'),Q('t','You want the total sales for each region. What do you put in Rows?',['Region','Units','Grand total','Product'],0,'Group by the field you want a total for.'),
  Q('t','Which calculation tells you how many sales happened?',['Count','Sum','Average','Max'],0,'Count counts the rows.')]});

/* ===== 2.7 Charts ===== */
const CHD={bar:{labels:['Pens','Books','Bags'],values:[30,45,25]},line:{labels:['Mon','Tue','Wed','Thu','Fri'],values:[28,30,27,31,33]},scatter:{xs:[1,2,3,4,5],ys:[40,50,58,66,80]}};
SCENES.push({id:'2.7',act:'sheet',title:'Choosing the right chart',idea:'Bar, line, pie and scatter; a good chart has labels',
 setup(ctx){
  const box=H('div',{class:'chartbox'});const cap=H('div',{class:'fb info'},'');stageHTML(ctx,H('div',{style:'display:flex;flex-direction:column;gap:10px'},box,cap));
  const X={box,cap,say:t=>{cap.textContent=t},draw(type,data,o){box.innerHTML='';box.append(chartSVG(type,data,o||{}))}};X.draw('bar',CHD.bar,{});return X},
 steps:[
  {k:'watch',run(X,ctx){X.say('Pens, books and bags sold: a bar chart compares categories.');X.draw('bar',CHD.bar,{});ctx.after(4200,()=>{X.draw('pie',CHD.bar,{});X.say('A pie chart shows parts of a whole: share of total sales.')});ctx.after(8200,()=>{X.draw('line',CHD.line,{});X.say('A line chart shows change over time: temperature each day.')});ctx.after(12200,()=>{X.draw('scatter',CHD.scatter,{});X.say('A scatter graph shows whether two things are related.')})}},
  {k:'watch',run(X,ctx){X.draw('bar',CHD.bar,{});X.say('A chart with no title or labels is hard to read.');ctx.after(2500,()=>{X.draw('bar',CHD.bar,{title:'Items sold in the school shop'});X.say('Add a clear title.')});ctx.after(5500,()=>{X.draw('bar',CHD.bar,{title:'Items sold in the school shop',xl:'Item',yl:'Number sold (units)'});X.say('Label both axes, with units. Use a sensible scale.')})}},
  {k:'predict',q:'Which chart is best for showing how the temperature changes through the week?',opts:['A line chart','A pie chart','A scatter graph of names','A table of colours'],ans:0,why:'Line charts show how a value changes over time.',run(X){X.draw('line',CHD.line,{title:'Temperature (°C) each day',xl:'Day',yl:'Temperature (°C)'});X.say('')}},
  {k:'try',build(X,ctx){X.draw('bar',CHD.bar,{title:'Items sold in the school shop',xl:'Item',yl:'Number sold (units)'});X.say('');
   matchGame(ctx.panel,{help:'Which chart suits each job?',items:[
    {label:'Compare the number of pens, books and bags sold',to:'bar',hint:'Comparing separate categories.'},{label:'Show how the temperature changes each day',to:'line',hint:'Change over time.'},
    {label:'Show what share of the class chose each sport',to:'pie',hint:'Parts of a whole.'},{label:'Show whether more study time means higher marks',to:'sc',hint:'Two related measurements.'}],
    buckets:[{id:'bar',label:'Column / bar chart'},{id:'line',label:'Line chart'},{id:'pie',label:'Pie chart'},{id:'sc',label:'Scatter graph'}],onDone:ctx.done})}},
  {k:'sum',take:'Bar charts compare categories. Line charts show change over time. Pie charts show parts of a whole. Scatter graphs show relationships. Add a title and label the axes.',run(X){X.draw('line',CHD.line,{title:'Temperature (°C) each day',xl:'Day',yl:'Temperature (°C)'});X.say('')}}],
 quiz:[Q('t','Which chart shows parts of a whole?',['Pie chart','Line chart','Scatter graph','Bar chart of time'],0,'Each slice is a share of the total.'),Q('t','Which chart shows change over time?',['Line chart','Pie chart','Bar chart of colours','None of them'],0,'Line charts connect values in time order.'),
  Q('t','Which makes a chart easier to understand?',['A title and labelled axes','More colours','No units','A tiny size'],0,'Titles and labels explain what the chart shows.')]});
