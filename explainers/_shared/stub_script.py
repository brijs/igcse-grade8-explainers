"""Dev helper: writes a placeholder script.py (one dummy line per step) so scenes can be smoke-tested before narration exists."""
import re, sys, glob, os
slug = sys.argv[1]; d = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', slug, 'source')
S = {}
for f in sorted(glob.glob(d + '/scenes/*.js')):
    for part in open(f).read().split("SCENES.push({id:'")[1:]:
        sid = part.split("'")[0]; S[sid] = ['placeholder line %d' % i for i in range(len(re.findall(r"\{k:'", part)))]
S['g'] = ['g%d' % i for i in range(11)]
open(d + '/script.py', 'w').write('SCRIPT=' + repr(S) + '\n')
print({k: len(v) for k, v in S.items()})
