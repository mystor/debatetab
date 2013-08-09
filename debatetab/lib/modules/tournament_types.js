module('tournament_types', function() {
  return [
    {
      name: 'British Parliamentary',
      team_size: 2,
      room_size: 4,
      max_score: 90,
      min_score: 60,
      score_inc: 1,
      positions: [
        { name: 'Opening Government', slug: 'G1', prop: true },
        { name: 'Opening Opposition', slug: 'O1', prop: false },
        { name: 'Closing Government', slug: 'G2', prop: true },
        { name: 'Closing Opposition', slug: 'O2', prop: false }
      ]
    },
    {
      name: 'Canadian Parliamentary',
      team_size: 2,
      room_size: 2,
      max_score: 35,
      min_score: 45,
      score_inc: 0.5,
      positions: [
        { name: 'Government', slug: 'Gov', prop: true },
        { name: 'Opposition', slug: 'Opp', prop: false }
      ]
    },
    {
      name: 'Australs',
      team_size: 3,
      room_size: 2,
      max_score: 100,
      min_score: 0,
      score_inc: 1,
      positions: [
        { name: 'Government', slug: 'Gov', prop: true },
        { name: 'Opposition', slug: 'Opp', prop: false }
      ]
    }
  ];
});
