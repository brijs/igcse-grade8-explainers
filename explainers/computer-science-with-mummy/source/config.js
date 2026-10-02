const CFG={key:'cs-mummy',title:'Computer Science with Mummy',perAct:4,
 intro:'Twenty one short interactive scenes on digital citizenship and security, spreadsheets, logic gates, and design thinking with CAD. Guess first, watch it happen, then try it yourself.',
 cheatBlurb:'Key terms, formulas, truth tables and design steps on one page.',
 acts:[
  {id:'sec',tag:'Act 1',name:'Digital citizenship and security',topic:'Citizenship',color:'#e5484d',big:true},
  {id:'sheet',tag:'Act 2',name:'Spreadsheets',topic:'Spreadsheets',color:'#2faa4a',big:true},
  {id:'logic',tag:'Act 3',name:'Logic gates and circuits',topic:'Logic',color:'#8a63d2',big:true},
  {id:'cad',tag:'Act 4',name:'Design thinking and CAD',topic:'Design',color:'#e0911c',big:true}],
 cheat:[
  {color:'#e5484d',title:'Digital citizenship and security',items:[
   'Digital footprint: <b>active</b> (what you post) and <b>passive</b> (data collected about you, like cookies and location).',
   'Think before you post: is it true, kind and necessary? Credit other people\'s work; do not plagiarise; respect copyright.',
   'Keep private: home address, phone number, passwords, full date of birth.',
   'Threats: malware (virus, worm, spyware, ransomware), phishing, hacking, denial of service, social engineering.',
   'Defences: firewall, antivirus, updates, strong passwords, two-factor login, encryption, backups.']},
  {color:'#2faa4a',title:'Spreadsheets',items:[
   'Formulas start with <span class="mono">=</span>. <span class="mono">=SUM(B2:B6)</span>, <span class="mono">AVERAGE</span>, <span class="mono">MIN</span>, <span class="mono">MAX</span>, <span class="mono">COUNT</span>.',
   '<span class="mono">=IF(B2>=50,"Pass","Fail")</span>   <span class="mono">=COUNTIF(C2:C9,"Pass")</span>',
   'Relative reference <span class="mono">B2</span> changes when copied. Absolute <span class="mono">$E$1</span> stays fixed.',
   '<span class="mono">=VLOOKUP(lookup, table, column, FALSE)</span> finds a value in the first column of a table.',
   'Conditional formatting changes how cells look. Data validation stops wrong data being entered.',
   'Pivot tables summarise data. Charts: column/bar compare, line shows change over time, pie shows parts of a whole.']},
  {color:'#8a63d2',title:'Logic gates',items:[
   '<span class="mono">NOT</span>: flips the input. <span class="mono">AND</span>: 1 only if both inputs are 1. <span class="mono">OR</span>: 1 if at least one input is 1.',
   '<span class="mono">NAND</span> = NOT AND. <span class="mono">NOR</span> = NOT OR. <span class="mono">XOR</span>: 1 only if the inputs are different.',
   'Truth table: list every input combination and the output (2 inputs = 4 rows, 3 inputs = 8 rows).',
   'Half adder: <span class="mono">Sum = A XOR B</span>, <span class="mono">Carry = A AND B</span>. In binary, 1 + 1 = 10.']},
  {color:'#e0911c',title:'Design thinking and CAD',items:[
   'Design thinking: <b>Empathise → Define → Ideate → Prototype → Test</b>, then improve and repeat.',
   'A good problem statement names the user, their need and why it matters.',
   'Prototypes are quick, cheap models used to find problems early.',
   'CAD (such as Tinkercad): workplane, basic shapes, <b>solid</b> and <b>hole</b>, move, rotate, resize, align and <b>group</b>.',
   'To cut a hole: add a shape, set it to Hole, place it, then Group with the solid.']}]};
