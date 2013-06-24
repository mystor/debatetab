DebateTab.registerJudgeStrategy({
  name: 'Best Chairs',
  description: '* Places the best judges as chairs\n'+
               '* Better judges are placed in better rooms\n'+
               '* Makes no effort to prevent scratch conflicts\n'+
               '* Makes no effort to have odd-sized panels',

  sort: [['rank', 'asc']],

  validate: function() {
    if (DebateTab.judgeCount() < DebateTab.predictPairingCount()) {
      throw 'There are too few judges to assign a judge to every pairing.  You need a minimum of ' + DebateTab.predictPairingCount() + ' judges.';
    }
  },

  algorithm: function(pairings, judges) {
    var pairings_i = pairings.length - 1;

    while (judges.length > 0) {
      var judge = judges.pop();
      var pairing = pairings[pairings_i];

      pairing.judges.push(judge._id);

      // Try to add as the chair
      if (!pairing.chair) {
        pairing.chair = judge._id;
      }

      // Move to the next pairing
      pairings_i--;
      if (pairings_i < 0) {
        pairings_i = pairings.length - 1;
      }
    }

    return pairings;
  }
});
