/* Cranky Mummy: Tamil phrases, moods, effects and sounds. Opt-in per explainer, off by default, reacts to wrong answers only (add source/cranky.json).
   Expects globals from core.js: mum, A, AUDIO, playLine, cur, H, store/prog. Phrases arrive in CRANKY = {phrases,byScene}; clips in AUDIO['ta.<id>']. */
const Cranky=(()=>{
  const C={on:false,streak:0};
  try{if(localStorage.getItem('mummy-cranky')==='on')C.on=true}catch(e){}
  const P=id=>CRANKY.phrases.find(p=>p.id===id);
  const pool=w=>CRANKY.phrases.filter(p=>p.when===w);
  const pick=a=>a[Math.floor(Math.random()*a.length)];
  const layer=()=>{let l=document.getElementById('crankyfx');if(!l){l=H('div',{id:'crankyfx'});document.body.append(l)}return l};
  const target=()=>[...mum.els].reverse().find(e=>e.isConnected&&e.getBoundingClientRect().width>60)||mum.els.find(e=>e.isConnected);
  const rectOf=()=>{const t=target();return t?t.getBoundingClientRect():{left:innerWidth/2-50,top:innerHeight/2,width:100,height:100}};
  /* ---- sound effects (WebAudio, no assets) ---- */
  let ac=null;const ctx=()=>{try{ac=ac||new (window.AudioContext||window.webkitAudioContext)();if(ac.state==='suspended')ac.resume();return ac}catch(e){return null}};
  function tone(f0,f1,dur,type,vol,trem){const c=ctx();if(!c||!A.voice)return;const o=c.createOscillator(),g=c.createGain(),t=c.currentTime;o.type=type||'sine';o.frequency.setValueAtTime(f0,t);o.frequency.exponentialRampToValueAtTime(f1,t+dur);g.gain.setValueAtTime(vol||.15,t);g.gain.exponentialRampToValueAtTime(.001,t+dur);
    if(trem){const l=c.createOscillator(),lg=c.createGain();l.frequency.value=trem;lg.gain.value=(vol||.15)*.6;l.connect(lg);lg.connect(g.gain);l.start(t);l.stop(t+dur)}
    o.connect(g);g.connect(c.destination);o.start(t);o.stop(t+dur)}
  function noise(dur,vol,hp){const c=ctx();if(!c||!A.voice)return;const n=c.sampleRate*dur,b=c.createBuffer(1,n,c.sampleRate),d=b.getChannelData(0);for(let i=0;i<n;i++)d[i]=(Math.random()*2-1)*(1-i/n);const s=c.createBufferSource(),f=c.createBiquadFilter(),g=c.createGain();s.buffer=b;f.type='highpass';f.frequency.value=hp||2000;g.gain.value=vol||.2;s.connect(f);f.connect(g);g.connect(c.destination);s.start()}
  const SFX={
    slap:()=>{noise(.08,.35,500);tone(180,60,.15,'square',.2)},
    vein:()=>{tone(300,700,.18,'sawtooth',.08)},
    finger:()=>{noise(.05,.18,3500);setTimeout(()=>noise(.05,.18,3500),160)},   /* tsk tsk */
    chappal:()=>{tone(900,150,.25,'triangle',.15);setTimeout(()=>{noise(.1,.4,300);tone(140,50,.2,'square',.25)},450);setTimeout(()=>tone(200,500,.3,'sine',.15),700)}, /* whoosh, whack, boing */
    cooker:()=>{tone(1700,2300,1.3,'sine',.12,22)},
    sigh:()=>{noise(.7,.12,900)},
    sparkle:()=>{[880,1175,1568].forEach((f,i)=>setTimeout(()=>tone(f,f*1.01,.18,'sine',.1),i*90))}};
  /* ---- visual effects ---- */
  function el(txt,cls,x,y,style,life){const e=H('div',{class:'cx '+(cls||''),style:`left:${x}px;top:${y}px;${style||''}`},txt);layer().append(e);setTimeout(()=>e.remove(),life||1400);return e}
  function headAnim(c){const t=target();if(!t)return;t.classList.remove('cx-'+c);void t.getBoundingClientRect();t.classList.add('cx-'+c);setTimeout(()=>t&&t.classList.remove('cx-'+c),c==='cooker'?1400:1000)}
  const FX={
    slap:r=>{headAnim('slap');headAnim('shakehead');el('🤦‍♀️','',r.left+r.width*.35,r.top-8,'animation:cxrise 1.2s forwards')},
    vein:r=>{el('💢','',r.left+r.width*.62,r.top+r.height*.05,'font-size:2.4rem;animation:cxveinpop 1.2s forwards',1300)},
    finger:r=>{headAnim('finger');el('☝️','',r.left+r.width*.8,r.top+r.height*.5,'animation:cxfinger .9s')},
    chappal:r=>{el('🩴','',r.left+r.width*.5,r.top+r.height*.5,`--dx:${-Math.min(r.left+r.width*.5,500)}px;animation:cxchappal 1.1s .45s ease-in forwards;opacity:1`,1700)},
    cooker:r=>{headAnim('cooker');for(let i=0;i<7;i++){const s=i%2?1:-1;el('💨','',r.left+r.width*(s>0?.9:.05),r.top+r.height*.2,`--dx:${s*(20+i*8)}px;animation:cxpuff 1s ${i*.12}s forwards;opacity:0`,1500)}},
    sigh:r=>{headAnim('shakehead');el('💨','',r.left+r.width*.4,r.top+r.height*.7,'--dx:-30px;animation:cxpuff 1.2s forwards')},
    sparkle:r=>{for(let i=0;i<6;i++)el('✨','',r.left+r.width*.5,r.top+r.height*.3,`--dx:${(i-2.5)*22}px;--dy:${-20-Math.random()*50}px;animation:cxsparkle .9s ${i*.05}s forwards`,1300)}};
  function bubble(p){
    const r=rectOf(),old=document.querySelector('.cx-bubble');if(old)old.remove();
    const b=H('div',{class:'cx-bubble'},H('b',null,p.ta),H('u',null,p.rom),H('i',null,p.en));layer().append(b);
    const w=Math.min(300,innerWidth*.86);let x=r.left+r.width/2-w/2;x=Math.max(8,Math.min(innerWidth-w-8,x));
    let y=r.top-b.offsetHeight-10;if(y<8)y=r.top+r.height+8;b.style.left=x+'px';b.style.top=y+'px';
    setTimeout(()=>b.remove(),4200);return b}
  /* ---- behaviour ---- */
  function say(p,after){
    const r=rectOf();bubble(p);
    (p.fx||[]).forEach((f,i)=>setTimeout(()=>{if(FX[f])FX[f](rectOf());if(SFX[f])SFX[f]()},i*350));
    playLine('ta.'+p.id,after);
  }
  C.react=ok=>{
    if(!C.on)return false;
    const t=target();if(t)t.dataset.heat=ok?0:Math.min(2,C.streak+1);
    if(ok){C.streak=0;return false} /* correct answers get the normal English cheer */
    C.streak++;mum.mood('oops');
    const sid=cur&&cur.sc&&cur.sc.id,sp=sid&&CRANKY.byScene&&CRANKY.byScene[sid];
    let p;
    if(C.streak>=3)p=P('ketkave');
    else if(C.streak===2)p=P('enna_da');
    else p=(sp&&Math.random()<.5)?P(sp):pick(pool('wrong1'));
    say(p);return true};
  C.toggle=()=>{C.on=!C.on;try{localStorage.setItem('mummy-cranky',C.on?'on':'off')}catch(e){}return C.on};
  return C})();
