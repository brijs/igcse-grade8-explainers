/* Registry of explainers. To add one: put it in explainers/<slug>/index.html and add an entry below.
   Group by subject -> term -> topics. `status`: 'ready' | 'soon'. */
window.EXPLAINERS = [
  {
    subject: 'Physics', color: '#0f8b8d',
    terms: [
      { term: 'Term 2 (exam revision)', items: [
        { title: 'Physics with Mummy', path: 'explainers/physics-with-mummy/',
          blurb: 'Animated, narrated and interactive: physical quantities, motion graphs, density and thermal energy transfer (conduction, convection, radiation, the vacuum flask).',
          topics: ['Physical quantities', 'Motion graphs', 'Density', 'Thermal energy transfer'], status: 'ready' }
      ] }
    ]
  },
  {
    subject: 'Chemistry', color: '#7c5cd6',
    terms: [
      { term: 'Term 2 (exam revision)', items: [
        { title: 'Chemistry with Mummy', path: 'explainers/chemistry-with-mummy/',
          blurb: 'Seventeen narrated, interactive scenes: the atom and the periodic table, ionic and covalent bonding, structures and properties, and displacement reactions.',
          topics: ['Atoms and the periodic table', 'Bonding and structure', 'Displacement reactions'], status: 'ready',
        { title: 'Metal Reactivity Lab', path: 'explainers/metal-reactivity-lab/',
          blurb: 'An interactive lab: test metals against water, acid and salt solutions to build the reactivity series and predict displacement reactions.',
          topics: ['Reactivity series', 'Displacement reactions'], status: 'ready' }
      ] }
    ]
  },
  {
    subject: 'Biology', color: '#2f9e44',
    terms: [
      { term: 'Term 2 (exam revision)', items: [
        { title: 'Biology with Mummy', path: 'explainers/biology-with-mummy/',
          blurb: 'Seventeen narrated, interactive scenes: photosynthesis, leaf structure, minerals, the carbon cycle, transport in plants, then DNA, chromosomes, gametes and fertilisation.',
          topics: ['Photosynthesis', 'Transport in plants', 'Variation and inheritance'], status: 'ready' }
      ] }
    ]
  },
  {
    subject: 'Computer Science', color: '#4263eb',
    terms: [
      { term: 'Term 2 (exam revision)', items: [
        { title: 'Computer Science with Mummy', path: 'explainers/computer-science-with-mummy/',
          blurb: 'Twenty one narrated, interactive scenes: digital citizenship and security, spreadsheets (with a working formula bar), logic gates and circuits, design thinking and CAD.',
          topics: ['Digital citizenship', 'Network security', 'Spreadsheets', 'Logic gates', 'Design thinking and CAD'], status: 'ready' }
      ] }
    ]
  },
  { subject: 'History', color: '#c2410c', terms: [] }
];
