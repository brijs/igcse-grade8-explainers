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
  { subject: 'Biology', color: '#2f9e44', terms: [] },
  { subject: 'History', color: '#c2410c', terms: [] },
  { subject: 'Computer Science', color: '#4263eb', terms: [] }
];
