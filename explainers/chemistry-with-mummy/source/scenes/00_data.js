/* ---- shared chemistry data and drawing helpers ---- */
const EL=[['H','hydrogen',1],['He','helium',4],['Li','lithium',7],['Be','beryllium',9],['B','boron',11],['C','carbon',12],['N','nitrogen',14],['O','oxygen',16],['F','fluorine',19],['Ne','neon',20],['Na','sodium',23],['Mg','magnesium',24],['Al','aluminium',27],['Si','silicon',28],['P','phosphorus',31],['S','sulfur',32],['Cl','chlorine',35],['Ar','argon',40],['K','potassium',39],['Ca','calcium',40]].map((e,i)=>({z:i+1,sym:e[0],name:e[1],a:e[2]}));
const elBy=s=>EL.find(e=>e.sym===s);
const shellsFor=e=>{const cap=[2,8,8,18],out=[];let r=e;for(const c of cap){if(r<=0)break;out.push(Math.min(c,r));r-=c}return out};
const cfgStr=z=>shellsFor(z).join(',');
const sub=n=>String(n).replace(/\d/g,d=>'₀₁₂₃₄₅₆₇₈₉'[d]);
const sup=n=>String(n).replace(/[0-9+\-]/g,d=>({'0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹','+':'⁺','-':'⁻'}[d]));
