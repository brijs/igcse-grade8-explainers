/* Biology shared pieces */
const LEAFG='#4caf50',LEAFD='#2e7d32';
function leafAt(parent,x,y,w,h,fill,o={}){const g=S('g',{transform:`translate(${x} ${y})${o.rot?` rotate(${o.rot})`:''}`});g.append(S('path',{d:leafPath(w,h),fill,stroke:'var(--ink)','stroke-width':2.5,'stroke-linejoin':'round'}));g.append(L(0,0,w*.9,0,{'stroke-width':2,stroke:o.vein||'rgba(0,0,0,.25)'}));parent.append(g);return g}
const mixc=(a,b,t)=>{const p=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));const A=p(a),B=p(b);return '#'+A.map((v,i)=>Math.round(v+(B[i]-v)*t).toString(16).padStart(2,'0')).join('')};
