const MARKS={A1:'Name',B1:'Maths',C1:'Science',D1:'English',E1:'Total',A2:'Anna',B2:'80',C2:'72',D2:'65',A3:'Ben',B3:'45',C3:'58',D3:'70',A4:'Chitra',B4:'90',C4:'85',D4:'78',A5:'Dev',B5:'60',C5:'40',D5:'55',A6:'Esha',B6:'72',C6:'66',D6:'81',A8:'Average',A9:'Highest',A10:'Entries',A11:'Lowest'};
const hdrRow=r=>/^[A-F]1$/.test(r);
/* ===== 2.1 Formulas and functions ===== */
SCENES.push({id:'2.1',act:'sheet',title:'Formulas and functions',idea:'=, cell references and SUM, AVERAGE, MIN, MAX, COUNT',
 setup(ctx){
  const sh=Sheet({cols:['A','B','C','D','E'],rows:11,data:MARKS,widths:{A:110},hdr:hdrRow});sh.lock=true;const cap=H('div',{class:'fb info'},'');stageHTML(ctx,H('div',{style:'display:flex;flex-direction:column;gap:10px'},sh.el,cap));
  return {sh,cap,say:t=>{cap.textContent=t}}},
 steps:[
  {k:'watch',run(X,ctx){X.sh.data=Object.assign({},MARKS);X.sh.unmark();X.say('A formula starts with = and uses cell references.');ctx.after(1200,()=>typeInto(ctx,X.sh,'E2','=B2+C2+D2',110,()=>{X.say('E2 = 80 + 72 + 65 = 217');ctx.after(2500,()=>{X.sh.set('B2','100');X.say('Change B2 to 100 and the total updates by itself: 237');ctx.after(3200,()=>{X.sh.set('B2','80');X.say('Back to 80: 217. Formulas stay up to date.')})})}))}},
  {k:'watch',run(X,ctx){X.sh.data=Object.assign({},MARKS);X.sh.unmark();X.say('Functions are shortcuts: a name, then a range in brackets.');
   ctx.after(900,()=>{X.sh.mark('B2:B6','rgba(47,100,216,.2)');typeInto(ctx,X.sh,'B8','=AVERAGE(B2:B6)',80,()=>X.say('AVERAGE adds the range and divides by how many: 69.4'))});
   ctx.after(6200,()=>{X.sh.unmark();X.sh.mark('C2:C6','rgba(47,170,74,.22)');typeInto(ctx,X.sh,'C9','=MAX(C2:C6)',80,()=>X.say('MAX finds the biggest number: 85'))});
   ctx.after(11500,()=>{X.sh.unmark();X.sh.mark('D2:D6','rgba(138,99,210,.22)');typeInto(ctx,X.sh,'D10','=COUNT(D2:D6)',80,()=>X.say('COUNT counts the numbers: 5.  SUM adds, MIN finds the smallest.'))})}},
  {k:'predict',q:'What does =SUM(B2:B6) do?',opts:['Adds all the numbers from B2 to B6','Counts how many cells there are','Finds the biggest number','Adds only B2 and B6'],ans:0,why:'B2:B6 is a range: every cell from B2 down to B6. SUM adds them all.',run(X){X.sh.data=Object.assign({},MARKS);X.sh.unmark();X.say('=SUM(B2:B6) ?')}},
  {k:'try',build(X,ctx){X.sh.data=Object.assign({},MARKS);X.sh.unmark();X.say('Use the formula bar above the sheet.');
   sheetTasks(ctx,X.sh,[{t:'In E3, find Ben\'s total using SUM.',cell:'E3',exp:173,hint:'Try =SUM(B3:D3).'},{t:'In C8, find the average Science mark.',cell:'C8',exp:64.2,hint:'Try =AVERAGE(C2:C6).'},{t:'In D9, find the highest English mark.',cell:'D9',exp:81,hint:'Try =MAX(D2:D6).'},{t:'In C11, find the lowest Science mark.',cell:'C11',exp:40,hint:'Try =MIN(C2:C6).'}],ctx.done)}},
  {k:'sum',take:'Formulas start with =. Use cell references. SUM, AVERAGE, MIN, MAX and COUNT work on a range like B2:B6.',run(X){X.sh.data=Object.assign({},MARKS);X.sh.unmark();X.sh.lock=true;X.say('SUM  AVERAGE  MIN  MAX  COUNT')}}],
 quiz:[Q('t','A spreadsheet formula always starts with…',['=','#','$','@'],0,'Typing = tells the spreadsheet to calculate.'),N('Cell A1 contains 4 and A2 contains 6. What does =A1+A2 show?',10,'','4 + 6 = 10.',0.01),
  Q('t','Which function finds the largest number in B2:B9?',['MAX','MIN','SUM','COUNT'],0,'MAX returns the biggest value.'),Q('t','What does the range B2:B6 mean?',['Every cell from B2 down to B6','Only B2 and B6','Column B and row 6','The cells B2 and B6 added'],0,'The colon means "from … to …".')]});

/* ===== 2.2 Relative and absolute references ===== */
const TAXD={A1:'Tax rate',B1:'0.2',A3:'Item',B3:'Price',C3:'Tax',A4:'Pen',B4:'10',A5:'Book',B5:'40',A6:'Bag',B6:'250',A7:'Ruler',B7:'20'};
SCENES.push({id:'2.2',act:'sheet',title:'Relative and absolute references',idea:'$ locks a reference when you copy a formula',
 setup(ctx){
  const sh=Sheet({cols:['A','B','C'],rows:7,data:TAXD,widths:{A:100,C:130},hdr:r=>/^[A-C]3$/.test(r)});sh.lock=true;const cap=H('div',{class:'fb info'},'');stageHTML(ctx,H('div',{style:'display:flex;flex-direction:column;gap:10px'},sh.el,cap));
  return {sh,cap,say:t=>{cap.textContent=t},reset(){sh.data=Object.assign({},TAXD);sh.showF=false;sh.unmark();sh.render()}}},
 steps:[
  {k:'watch',run(X,ctx){X.reset();X.say('Tax = price × tax rate. The rate is in B1.');ctx.after(1200,()=>typeInto(ctx,X.sh,'C4','=B4*B1',100,()=>{X.say('C4 = 10 × 0.2 = 2. Now copy it down...');ctx.after(1800,()=>{fillDown(X.sh,'C4',7);X.sh.showF=true;X.sh.render();X.say('Relative: B1 became B2, B3, B4. They are empty, so the answers are 0. Wrong!')})}))}},
  {k:'watch',run(X,ctx){X.reset();X.say('Lock the rate with dollar signs: $B$1');ctx.after(1200,()=>typeInto(ctx,X.sh,'C4','=B4*$B$1',100,()=>{X.say('C4 = 2. Copy it down...');ctx.after(1800,()=>{fillDown(X.sh,'C4',7);X.sh.showF=true;X.sh.render();X.say('Absolute: $B$1 never moves, so every row uses the same rate. Correct!')})}))}},
  {k:'predict',q:'You copy the formula =B2*E1 down one row. What does the new formula say?',opts:['=B3*E2','=B2*E1','=B3*E1','=B2*E2'],ans:0,why:'Relative references move with the copy: B2 becomes B3 and E1 becomes E2.',run(X){X.reset();X.say('=B2*E1 copied down one row = ?')}},
  {k:'try',build(X,ctx){X.reset();const h=ctx.panel;let kind='rel',won=false;
   const fb=H('div',{class:'fb info'},'Type the formula, then fill it down, for each kind. See how they differ.'),pg=H('p',{class:'hint'},'');
   pickRow(h,[{id:'rel',label:'Relative: =B4*B1'},{id:'abs',label:'Absolute: =B4*$B$1'}],id=>{kind=id;X.reset()},'rel');
   const go=H('button',{class:'btn small',onclick:()=>{X.reset();X.sh.set('C4',kind==='rel'?'=B4*B1':'=B4*$B$1');fillDown(X.sh,'C4',7);X.sh.showF=false;X.sh.render();const ok=[5,6,7].every(r=>X.sh.val('C'+r)===[,,,,0,8,50,4][r]||false)&&kind==='abs';
     fb.className='fb '+(kind==='abs'?'good':'bad');fb.textContent=kind==='abs'?'Correct: 2, 8, 50, 4. $B$1 stayed fixed.':'Wrong: the rate reference slid down to empty cells, so the tax is 0.';if(kind==='abs'&&!won){won=true;ctx.done()}}},'Type in C4 and fill down');
   const sf=H('button',{class:'btn small ghost',onclick:()=>{X.sh.showF=!X.sh.showF;X.sh.render();sf.textContent=X.sh.showF?'Show values':'Show formulas'}},'Show formulas');
   h.append(go,sf,fb,pg)}},
  {k:'sum',take:'A relative reference changes when you copy a formula. An absolute reference, with dollar signs like $B$1, stays fixed.',run(X){X.reset();X.say('B1 moves.   $B$1 stays.')}}],
 quiz:[Q('t','Which reference stays fixed when a formula is copied?',['$B$1','B1','B$','1B'],0,'The dollar signs lock the column and the row.'),Q('t','You copy =B2*E1 down one row. What is the new formula?',['=B3*E2','=B2*E1','=B3*E1','=B2*E2'],0,'Both relative references move down by one row.'),
  Q('t','What is the best way to always use a tax rate stored in cell B1?',['Write $B$1 in the formula','Write B1 in the formula','Type 0.2 each time','Delete B1'],0,'$B$1 keeps pointing at B1 wherever the formula is copied.')]});

/* ===== 2.3 IF and COUNTIF ===== */
const IFD={A1:'Student',B1:'Mark',C1:'Pass?',D1:'Merit?',A2:'Anna',B2:'72',A3:'Ben',B3:'45',A4:'Chitra',B4:'88',A5:'Dev',B5:'50',A6:'Esha',B6:'39',A7:'Farhan',B7:'64',A9:'Passes',A10:'Merits'};
SCENES.push({id:'2.3',act:'sheet',title:'IF and COUNTIF',idea:'Make the spreadsheet decide',
 setup(ctx){
  const sh=Sheet({cols:['A','B','C','D'],rows:10,data:IFD,widths:{A:100},hdr:r=>/^[A-D]1$/.test(r)});sh.lock=true;const cap=H('div',{class:'fb info'},'');stageHTML(ctx,H('div',{style:'display:flex;flex-direction:column;gap:10px'},sh.el,cap));
  return {sh,cap,say:t=>{cap.textContent=t},reset(){sh.data=Object.assign({},IFD);sh.showF=false;sh.unmark();sh.render()}}},
 steps:[
  {k:'watch',run(X,ctx){X.reset();X.say('=IF(test, value if true, value if false)');ctx.after(1200,()=>typeInto(ctx,X.sh,'D2','=IF(B2>=70,"Merit","No")',70,()=>{X.say('72 is at least 70, so D2 shows Merit');ctx.after(1800,()=>{fillDown(X.sh,'D2',7);X.say('Fill down and every row is decided automatically.')})}))}},
  {k:'watch',run(X,ctx){X.reset();X.sh.setMany({D2:'=IF(B2>=70,"Merit","No")',D3:'=IF(B3>=70,"Merit","No")',D4:'=IF(B4>=70,"Merit","No")',D5:'=IF(B5>=70,"Merit","No")',D6:'=IF(B6>=70,"Merit","No")',D7:'=IF(B7>=70,"Merit","No")'});X.say('To count, use COUNTIF(range, criteria).');ctx.after(1500,()=>{X.sh.mark('D2:D7','rgba(47,170,74,.22)');typeInto(ctx,X.sh,'B10','=COUNTIF(D2:D7,"Merit")',70,()=>X.say('There are 2 Merits: Anna and Chitra'))})}},
  {k:'predict',q:'B2 contains 49. What does =IF(B2>=50,"Pass","Fail") show?',opts:['Fail','Pass','49','An error'],ans:0,why:'49 is not at least 50, so the test is false and the formula returns the third part: Fail.',run(X){X.reset();X.say('B2 = 49')}},
  {k:'try',build(X,ctx){X.reset();const h=ctx.panel;let step=1;
   const fb=H('div',{class:'fb info'},'Step 1: type an IF formula in C2: "Pass" if the mark is 50 or more, otherwise "Fail".');const fill=H('button',{class:'btn small',disabled:true},'Fill down C2 to C7');const pg=H('p',{class:'hint'},'');
   X.sh.isEd=ref=>(step===1&&ref==='C2')||(step===2&&ref==='B9');X.sh.lock=false;X.sh.select('C2');X.sh.mark('C2:C2','rgba(240,176,48,.35)');X.sh.render();
   X.sh.onCommit=(ref,raw)=>{if(step===1&&ref==='C2'){const v=X.sh.val('C2');if(String(raw)[0]==='='&&v==='Pass'){fb.className='fb good';fb.textContent='Anna (72) shows Pass. Now fill it down.';fill.disabled=false;cheer(true)}else{fb.className='fb bad';fb.textContent='Not yet. Try =IF(B2>=50,"Pass","Fail").';cheer(false)}}
     if(step===2&&ref==='B9'){const v=X.sh.val('B9');if(String(raw)[0]==='='&&v===4){fb.className='fb good';fb.textContent='Correct! 4 students passed.';cheer(true);X.sh.isEd=()=>false;ctx.done()}else{fb.className='fb bad';fb.textContent='Not quite. Try =COUNTIF(C2:C7,"Pass").';cheer(false)}}};
   fill.onclick=()=>{fillDown(X.sh,'C2',7);const ok=['Pass','Fail','Pass','Pass','Fail','Pass'].every((x,k)=>X.sh.val('C'+(2+k))===x);if(ok){step=2;fill.disabled=true;X.sh.unmark();X.sh.mark('B9:B9','rgba(240,176,48,.35)');X.sh.select('B9');fb.className='fb good';fb.textContent='Step 2: in B9, count how many students got Pass using COUNTIF.'}else{fb.className='fb bad';fb.textContent='Some results are wrong. Check your IF formula in C2.'}};
   h.append(fb,fill,pg)}},
  {k:'sum',take:'IF makes a decision: IF(test, true result, false result). COUNTIF counts the cells that meet a condition.',run(X){X.reset();X.say('IF decides.  COUNTIF counts.')}}],
 quiz:[Q('t','In =IF(A1>10,"Yes","No"), what shows if A1 is 5?',['No','Yes','5','10'],0,'5 is not greater than 10, so the result is the third part.'),N('The marks are 35, 62, 48 and 90. How many cells does =COUNTIF(range,">=50") count?',2,'','Only 62 and 90 are at least 50.',0.01),
  Q('t','Which formula shows "Yes" if A1 is greater than 10?',['=IF(A1>10,"Yes","No")','=IF(A1<10,"Yes","No")','=COUNTIF(A1,"Yes")','=SUM(A1>10)'],0,'The test goes first, then the true result, then the false result.'),Q('t','What does COUNTIF do?',['Counts the cells that meet a condition','Adds numbers','Finds the largest','Makes a chart'],0,'COUNTIF counts only matching cells.')]});
