DebateTab.registerRoomStrategy({
  name: 'No Priority',
  description: '* Highest ranked rooms are assigned first\n'+
               '* No teams/judges are given priority',

  sort: [['rank', 'asc']],

  validate: function() {
    if (DebateTab.roomCount() < DebateTab.predictPairingCount()) {
      throw 'There are too few rooms to assign a room to every pairing.  You need a minimum of ' + DebateTab.predictPairingCount() + ' rooms.';
    }
  },

  algorithm: function(pairings, rooms) {
    var shuffled_pairings = _.shuffle(pairings);

    _.each(shuffled_pairings, function(pairing) {
      pairing.room = rooms.pop()._id;
    });

    return pairings;
  }
});
