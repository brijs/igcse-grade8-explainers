/* ===== 1.4 Network security threats ===== */
const PHCL=[{k:'from',x:50,y:92,w:300,h:30,t:'The sender address looks fake'},{k:'urgent',x:50,y:136,w:420,h:30,t:'Urgent, scary language'},{k:'greet',x:50,y:180,w:200,h:30,t:'"Dear Customer" is a generic greeting'},{k:'link',x:50,y:240,w:380,h:30,t:'The link goes to a strange website'},{k:'pass',x:50,y:290,w:420,h:30,t:'It asks for your password'}];
SCENES.push({id:'1.4',act:'sec',title:'Threats to a network',idea:'Malware, phishing, hacking and denial of service',
 setup(ctx){
  const s=ctx.svg();const X={s,on:null};const net=S('g'),mail=S('g');s.append(net,mail);X.net=net;X.mail=mail;
  net.append(S('path',{d:'M60 100Q60 60 105 62Q120 30 170 42Q215 30 240 65Q300 60 300 102Q300 140 250 140H110Q60 140 60 100Z',fill:'#e6eefb','stroke-width':3,stroke:'var(--ink)'}),T(180,106,'the internet',{'font-size':20,'font-family':'Fredoka,sans-serif'}));
  net.append(R(400,150,130,70,{rx:12,fill:'var(--metal)','stroke-width':2.5}),T(465,192,'router',{'font-size':18}),L(300,115,420,150,{'stroke-width':3}));
  X.pcs=[[470,330],[620,300],[620,160]].map((p,i)=>{const g=G(p[0],p[1]);g.append(R(-45,-30,90,56,{rx:6,fill:'#cfe0ff','stroke-width':2.5}),R(-60,26,120,12,{rx:5,fill:'var(--metal)','stroke-width':2}),T(0,-2,'PC '+(i+1),{'font-size':15}));net.append(L(465,220,p[0],p[1]-30,{'stroke-width':2.5,stroke:'var(--muted)'}),g);return g});
  X.bad=S('g');net.append(X.bad);
  X.lab=T(400,420,'',{'font-size':20,fill:'var(--accent)','font-family':'Fredoka,sans-serif'});net.append(X.lab);
  /* email */
  mail.append(R(30,40,560,320,{rx:16,fill:'var(--paper)','stroke-width':3}),R(30,40,560,34,{rx:16,fill:'var(--accent)'}),T(310,64,'Inbox',{'font-size':17,fill:'var(--accent-ink)'}));
  const tx=(x,y,t,o={})=>mail.append(T(x,y,t,Object.assign({'text-anchor':'start','font-size':16},o)));
  tx(60,114,'From: security@bank-0f-india.com',{'font-family':'JetBrains Mono, monospace','font-size':14});tx(60,158,'URGENT!!! Your account will be CLOSED today',{'font-weight':800});tx(60,202,'Dear Customer,');tx(60,226,'We found a problem with your account. Act now or lose your money.',{'font-size':14});tx(60,262,'http://secure-login.bank-verify.net/login',{'fill':'var(--cold)','font-family':'JetBrains Mono, monospace','font-size':14});tx(60,312,'Reply with your password to confirm your identity.',{'font-size':14});
  X.hit=S('g');mail.append(X.hit);PHCL.forEach(c=>{const r=R(c.x-8,c.y-4,c.w+16,c.h,{rx:8,fill:'rgba(229,72,77,.12)',stroke:'var(--bad)','stroke-width':3,opacity:0,class:'hit'});r.dataset.k=c.k;r.onclick=()=>{if(X.on)X.on(c.k,r)};X.hit.append(r)});
  X.clue=T(310,395,'',{'font-size':18,fill:'var(--accent)','font-family':'Fredoka,sans-serif'});mail.append(X.clue);
  X.view=m=>{net.setAttribute('opacity',m==='n'?1:0);mail.setAttribute('opacity',m==='m'?1:0);if(m==='n'){mail.style.display='none';net.style.display=''}else{mail.style.display='';net.style.display='none'}};
  X.attack=(kind)=>{X.bad.innerHTML='';const col='var(--bad)';
    if(kind==='virus'){const b=G(180,200);b.append(C(0,0,16,{fill:col}),L(-24,-8,-16,-4),L(24,-8,16,-4),L(-24,8,-16,4),L(24,8,16,4));X.bad.append(b);tween(ctx,3,p=>{const q=ease(p);b.setAttribute('transform',`translate(${180+(470-180)*q} ${200+(330-200)*q})`)},()=>{X.pcs[0].firstChild.setAttribute('fill','#f6b4b8');X.lab.textContent='Malware: a virus infects a computer'})}
    if(kind==='hack'){const h=G(180,230);h.append(C(0,-20,18,{fill:'#333'}),S('path',{d:'M-26 40Q-26 0 0 0Q26 0 26 40Z',fill:'#333','stroke-width':2,stroke:'var(--ink)'}));X.bad.append(h,Pth('M205 215L400 190',{stroke:col,'stroke-width':4,'stroke-dasharray':'8 6'}));X.lab.textContent='Hacking: someone gets in without permission'}
    if(kind==='dos'){for(let i=0;i<7;i++){const a=flowLine(ctx,X.bad,[[140+i*20,150],[440,185]],{col:col,n:2,speed:.5+i*.05,r:4});}X.lab.textContent='Denial of service: a flood of requests overloads the network'}};
  X.view('n');return X},
 steps:[
  {k:'watch',run(X,ctx){X.view('n');X.pcs.forEach(p=>p.firstChild.setAttribute('fill','#cfe0ff'));X.bad.innerHTML='';X.lab.textContent='';ctx.after(700,()=>X.attack('virus'));ctx.after(5500,()=>{X.bad.innerHTML='';X.attack('hack')});ctx.after(10500,()=>{X.bad.innerHTML='';X.attack('dos')})}},
  {k:'watch',run(X,ctx){X.view('m');X.clue.textContent='';[...X.hit.children].forEach(r=>r.setAttribute('opacity',0));[...X.hit.children].forEach((r,i)=>ctx.after(1500+i*2200,()=>{r.setAttribute('opacity',1);X.clue.textContent=PHCL[i].t}))}},
  {k:'predict',q:'An email from an unknown sender says: "Your account will close! Click now!" What is it most likely to be?',opts:['A phishing attempt','A helpful reminder','A school notice','A software update'],ans:0,why:'Urgent threats and unknown senders are classic signs of phishing.',run(X){X.view('m');X.clue.textContent='';[...X.hit.children].forEach(r=>r.setAttribute('opacity',0))}},
  {k:'try',build(X,ctx){X.view('m');[...X.hit.children].forEach(r=>r.setAttribute('opacity',0));X.clue.textContent='';const found=new Set();
   const fb=H('div',{class:'fb info'},'Click the suspicious parts of the email. Find at least four.'),pg=H('p',{class:'hint'},'Clues found: 0 of 5');
   X.on=(k,r)=>{if(found.has(k))return;found.add(k);r.setAttribute('opacity',1);const c=PHCL.find(x=>x.k===k);fb.className='fb good';fb.textContent=c.t+'.';cheer(true);pg.textContent='Clues found: '+found.size+' of 5';if(found.size>=4)ctx.done()};
   X.mail.addEventListener('click',e=>{if(!e.target.classList.contains('hit')&&X.on&&found.size<5){fb.className='fb info';fb.textContent='Not a clue. Look for fake addresses, urgency and requests for passwords.'}});
   ctx.panel.append(fb,pg)}},
  {k:'sum',take:'Threats: malware, phishing, hacking, denial of service and social engineering. Spot phishing: odd sender, urgency, generic greeting, strange links, requests for passwords.',run(X){X.on=null;X.view('n');X.bad.innerHTML='';X.lab.textContent=''}}],
 quiz:[Q('t','What is phishing?',['A fake message that tricks you into giving away information','A virus that deletes files','A flood of traffic to a website','A strong password'],0,'Phishing uses fake emails and websites to steal data.'),
  Q('t','Which of these is malware?',['A computer virus','A firewall','A password manager','An update'],0,'Viruses, worms, spyware and ransomware are malware.'),
  Q('t','What happens in a denial of service attack?',['A network is flooded so real users cannot use it','Files are encrypted','A password is guessed','A virus is installed'],0,'The server is overloaded with requests.'),
  Q('t','Which is a warning sign of a phishing email?',['Urgent threats and a strange link','A greeting using your real name','A known sender address','A correct school logo'],0,'Urgency and odd links are warning signs.')]});

/* ===== 1.5 Security measures ===== */
SCENES.push({id:'1.5',act:'sec',title:'Protecting a network',idea:'Firewall, antivirus, updates, encryption and backups',
 setup(ctx){
  const s=ctx.svg();const X={s,g:{}};
  s.append(S('path',{d:'M30 120Q30 80 70 82Q85 50 130 62Q172 50 195 85Q250 80 250 122Q250 160 205 160H80Q30 160 30 120Z',fill:'#e6eefb','stroke-width':3,stroke:'var(--ink)'}),T(140,126,'internet',{'font-size':18,'font-family':'Fredoka,sans-serif'}));
  s.append(R(330,80,400,230,{rx:20,fill:'var(--paper)','stroke-width':3,'stroke-dasharray':'8 6'}),T(530,104,'school network',{'font-size':16,fill:'var(--muted)'}));
  [[420,200],[560,200],[660,200]].forEach(p=>{const g=G(p[0],p[1]);g.append(R(-40,-26,80,50,{rx:6,fill:'#cfe0ff','stroke-width':2.5}),R(-52,24,104,10,{rx:4,fill:'var(--metal)','stroke-width':2}));s.append(g)});
  const mk=(k,fn)=>{const g=S('g',{opacity:0});fn(g);s.append(g);X.g[k]=g};
  mk('fw',g=>{for(let r=0;r<6;r++)for(let c=0;c<2;c++)g.append(R(268+((r%2)?9:0)+c*18,100+r*34,26,26,{rx:3,fill:'#e57a5a','stroke-width':2}));g.append(T(292,66,'checks traffic',{'font-size':13,fill:'var(--muted)'}),T(292,86,'firewall',{'font-size':18,fill:'var(--bad)','font-family':'Fredoka,sans-serif'}))});
  mk('av',g=>{g.append(S('path',{d:'M420 150L460 162V196Q460 220 420 232Q380 220 380 196V162Z',fill:'#58b868','stroke-width':3,stroke:'var(--ink)'}),T(420,198,'AV',{'font-size':22,fill:'#fff','font-family':'Fredoka,sans-serif'}),T(420,262,'antivirus',{'font-size':16,'font-family':'Fredoka,sans-serif'}))});
  mk('up',g=>{g.append(C(560,152,24,{fill:'#f0b030','stroke-width':3}),S('polygon',{points:'560,136 574,156 564,156 564,168 556,168 556,156 546,156',fill:'#fff'}),T(560,262,'updates',{'font-size':16,'font-family':'Fredoka,sans-serif'}))});
  mk('en',g=>{g.append(R(40,330,150,44,{rx:10,fill:'var(--paper)','stroke-width':2.5}),T(115,359,'HELLO',{'font-size':22,'font-family':'JetBrains Mono, monospace'}),Pth('M200 352H300',{stroke:'var(--accent)','stroke-width':4}),S('polygon',{points:'300,342 316,352 300,362',fill:'var(--accent)'}),R(320,330,150,44,{rx:10,fill:'var(--paper)','stroke-width':2.5}),T(395,359,'Xk9#Q',{'font-size':22,'font-family':'JetBrains Mono, monospace'}),T(250,336,'encrypt',{'font-size':14,fill:'var(--accent)'}),T(255,402,'encryption scrambles data so thieves cannot read it',{'font-size':14,fill:'var(--muted)'}))});
  mk('bk',g=>{g.append(S('path',{d:'M570 380Q570 350 600 350Q612 330 640 336Q670 330 680 360Q710 360 710 385Q710 405 685 405H595Q570 405 570 380Z',fill:'#dfeaff','stroke-width':3,stroke:'var(--ink)'}),T(640,388,'backup',{'font-size':17,'font-family':'Fredoka,sans-serif'}),Pth('M640 320V344',{stroke:'var(--accent)','stroke-width':4}))});
  X.show=ks=>Object.keys(X.g).forEach(k=>X.g[k].setAttribute('opacity',ks.includes(k)?1:0));return X},
 steps:[
  {k:'watch',run(X,ctx){X.show([]);['fw','av','up'].forEach((k,i)=>ctx.after(800+i*3500,()=>X.g[k].setAttribute('opacity',1)))}},
  {k:'watch',run(X,ctx){X.show(['fw','av','up']);['en','bk'].forEach((k,i)=>ctx.after(800+i*4000,()=>X.g[k].setAttribute('opacity',1)))}},
  {k:'predict',q:'Which security measure checks the traffic between your network and the internet?',opts:['A firewall','Antivirus','A backup','A strong password'],ans:0,why:'A firewall sits between the network and the internet and blocks suspicious traffic.',run(X){X.show(['fw','av','up','en','bk'])}},
  {k:'try',build(X,ctx){X.show(['fw','av','up','en','bk']);
   matchGame(ctx.panel,{help:'Which measure deals with the threat?',items:[
    {label:'A virus on a USB stick',to:'av',hint:'Software that finds and removes malware.'},{label:'A hacker tries to get into the network',to:'fw',hint:'Blocks unwanted traffic.'},{label:'Someone intercepts your messages',to:'en',hint:'Makes the data unreadable.'},
    {label:'Ransomware locks your files',to:'bk',hint:'Keep a copy elsewhere.'},{label:'Old software has a known weakness',to:'up',hint:'Patches fix weaknesses.'}],
    buckets:[{id:'fw',label:'Firewall'},{id:'av',label:'Antivirus'},{id:'en',label:'Encryption'},{id:'bk',label:'Backups'},{id:'up',label:'Software updates'}],onDone:ctx.done})}},
  {k:'sum',take:'Firewall blocks suspicious traffic. Antivirus finds malware. Updates fix weaknesses. Encryption scrambles data. Backups let you recover.',run(X){X.show(['fw','av','up','en','bk'])}}],
 quiz:[Q('t','What does a firewall do?',['Blocks suspicious network traffic','Scrambles data','Backs up files','Removes pop-ups'],0,'It filters traffic between the network and the internet.'),
  Q('t','What does encryption do?',['Makes data unreadable to anyone without the key','Deletes viruses','Speeds up the internet','Makes a copy of files'],0,'Only people with the key can read encrypted data.'),
  Q('t','Why should you install software updates?',['They fix security weaknesses','They delete your files','They slow down viruses only','They make passwords longer'],0,'Updates patch known weaknesses that attackers use.'),
  Q('t','Why keep backups?',['To recover data if it is lost or locked','To stop hackers','To remove viruses','To encrypt passwords'],0,'A backup copy lets you restore files.')]});

/* ===== 1.6 Passwords and two-step login ===== */
const COMMON=['password','123456','qwerty','letmein','iloveyou','admin','welcome','krishna','football','abc123'];
function pwCheck(p){const low=p.toLowerCase();return {len:p.length>=12,up:/[A-Z]/.test(p),lo:/[a-z]/.test(p),dg:/\d/.test(p),sy:/[^A-Za-z0-9]/.test(p),cm:p.length>0&&!COMMON.some(c=>low.includes(c))}}
function pwTime(p){if(!p)return '';let cs=0;if(/[a-z]/.test(p))cs+=26;if(/[A-Z]/.test(p))cs+=26;if(/\d/.test(p))cs+=10;if(/[^A-Za-z0-9]/.test(p))cs+=32;let bits=p.length*Math.log2(Math.max(cs,2));if(COMMON.some(c=>p.toLowerCase().includes(c)))bits=Math.min(bits,18);const sec=Math.pow(2,bits)/1e10;
  if(sec<1)return 'instantly';if(sec<60)return Math.round(sec)+' seconds';if(sec<3600)return Math.round(sec/60)+' minutes';if(sec<86400)return Math.round(sec/3600)+' hours';if(sec<31536000)return Math.round(sec/86400)+' days';if(sec<3.15e9)return Math.round(sec/31536000)+' years';return 'centuries'}
SCENES.push({id:'1.6',act:'sec',title:'Strong passwords and two-step login',idea:'Long, mixed passwords plus a second proof',
 setup(ctx){
  const s=ctx.svg();const X={s};const pw=S('g'),tf=S('g');s.append(pw,tf);X.pw=pw;X.tf=tf;
  [['password123','instantly',20],['Krishna2012','minutes',90],['Tr!ck-Banana-Moon-47','centuries (illustrative)',380]].forEach((r,i)=>{const y=100+i*86;pw.append(T(40,y+22,r[0],{'text-anchor':'start','font-size':20,'font-family':'JetBrains Mono, monospace'}),R(40,y+34,r[2]+20,22,{rx:11,fill:i===0?'var(--bad)':i===1?'#e0911c':'var(--good)',stroke:'none'}),T(60+r[2],y+50,r[1],{'text-anchor':'start','font-size':14,fill:'var(--ink)'}))});
  pw.append(T(400,60,'how long to guess?',{'font-size':20,'font-family':'Fredoka,sans-serif',fill:'var(--accent)'}),T(400,400,'(rough estimates for a fast computer)',{'font-size':14,fill:'var(--muted)'}));
  const bx=(x,y,w,h,t,sub,col)=>{tf.append(R(x,y,w,h,{rx:14,fill:'var(--paper)',stroke:col||'var(--ink)','stroke-width':3}),T(x+w/2,y+h/2-4,t,{'font-size':18,'font-family':'Fredoka,sans-serif'}),sub?T(x+w/2,y+h/2+20,sub,{'font-size':13,fill:'var(--muted)'}):null)};
  bx(30,150,180,90,'1. Password','something you KNOW');bx(310,150,180,90,'2. Code on phone','something you HAVE','#e0911c');bx(590,150,180,90,'Logged in!','',  'var(--good)');
  tf.append(Pth('M212 195H306',{stroke:'var(--accent)','stroke-width':4}),S('polygon',{points:'306,185 322,195 306,205',fill:'var(--accent)'}),Pth('M492 195H586',{stroke:'var(--accent)','stroke-width':4}),S('polygon',{points:'586,185 602,195 586,205',fill:'var(--accent)'}));
  tf.append(R(370,270,60,100,{rx:10,fill:'#333','stroke-width':3}),T(400,330,'482 913',{'font-size':14,fill:'#9fe3a8','font-family':'JetBrains Mono, monospace'}),T(400,400,'a thief who learns your password still cannot log in',{'font-size':16,fill:'var(--muted)'}));
  X.meter=S('g',{opacity:0});X.meter.append(R(60,60,680,40,{rx:20,fill:'var(--paper)','stroke-width':2.5}));X.mb=R(62,62,0,36,{rx:18,fill:'var(--bad)',stroke:'none'});X.meter.append(X.mb);X.mt=T(400,128,'',{'font-size':18,fill:'var(--ink)','font-family':'Fredoka,sans-serif'});X.meter.append(X.mt);
  X.crit=S('g');X.meter.append(X.crit);s.append(X.meter);
  X.view=m=>{pw.style.display=m==='p'?'':'none';tf.style.display=m==='t'?'':'none';X.meter.setAttribute('opacity',m==='b'?1:0)};X.view('p');return X},
 steps:[
  {k:'watch',run(X,ctx){X.view('p');[...X.pw.children].forEach(c=>c.setAttribute('opacity',0));[...X.pw.children].forEach((c,i)=>ctx.after(400+i*600,()=>c.setAttribute('opacity',1)))}},
  {k:'watch',run(X,ctx){X.view('t');[...X.tf.children].forEach(c=>c.setAttribute('opacity',0));[...X.tf.children].forEach((c,i)=>ctx.after(500+i*500,()=>c.setAttribute('opacity',1)))}},
  {k:'predict',q:'Which is the strongest password?',opts:['password123','Krishna2012','Tr!ck-Banana-Moon-47','qwerty'],ans:2,why:'It is long, mixes capitals, lower case, numbers and symbols, and is not a common word.',run(X){X.view('p');[...X.pw.children].forEach(c=>c.setAttribute('opacity',1))}},
  {k:'try',build(X,ctx){X.view('b');const h=ctx.panel;let done=false;
   const inp=H('input',{type:'text',id:'pw',autocomplete:'off',spellcheck:'false',placeholder:'Type a made-up password'});const list=H('div',{class:'opts'});
   const items=[['len','At least 12 characters'],['up','A capital letter'],['lo','A lower case letter'],['dg','A number'],['sy','A symbol such as ! or -'],['cm','Not a common word or your name']];const rows={};items.forEach(i=>{const r=H('div',{class:'fb info'},'○  '+i[1]);rows[i[0]]=r;list.append(r)});
   const upd=()=>{const c=pwCheck(inp.value);let n=0;items.forEach(i=>{const ok=c[i[0]]&&inp.value.length>0;if(ok)n++;rows[i[0]].className='fb '+(ok?'good':'info');rows[i[0]].textContent=(ok?'✓  ':'○  ')+i[1]});
     const t=pwTime(inp.value);X.mb.setAttribute('width',676*n/6);X.mb.setAttribute('fill',n<3?'var(--bad)':n<6?'#e0911c':'var(--good)');X.mt.textContent=inp.value?('Time to guess: '+t+' (illustrative)'):'';
     if(n===6&&!done){done=true;ctx.done()}};
   inp.oninput=upd;h.append(H('p',{class:'hint'},'Make up a new password. Do not type a real one: nothing is saved or sent anywhere.'),H('div',{class:'field'},H('label',{for:'pw'},'Password'),inp),list,H('p',{class:'hint'},'Tip: a passphrase of three or four random words with a number and a symbol is strong and easy to remember.'));upd()}},
  {k:'sum',take:'Use long passwords with capitals, lower case, numbers and symbols. Never reuse them. Two-step login adds something you have, like a phone code.',run(X){X.view('t');[...X.tf.children].forEach(c=>c.setAttribute('opacity',1))}}],
 quiz:[Q('t','Which makes a password stronger?',['More length and a mix of characters','Using your birthday','Using the word password','Using your name'],0,'Longer passwords with mixed characters are harder to guess.'),
  Q('t','What is two-step login?',['A password plus a second proof such as a phone code','Logging in twice','Two passwords the same','A firewall setting'],0,'A second proof means a stolen password is not enough.'),
  Q('t','Should you use the same password for every site?',['No: one leak would expose them all','Yes: it is easier to remember','Yes: it is safer','Only for school sites'],0,'Use a different password for each account.'),
  Q('t','Why is a password like "qwerty" weak?',['It is very common and easy to guess','It is too long','It has symbols','It is encrypted'],0,'Attackers try common passwords first.')]});
