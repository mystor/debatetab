module(function() {
  var validate = module('validate');

  Meteor.methods({
    requestPairingCSV: function(t_id, round) {
      var tournament = validate.tournament(t_id);
      validate.admin(tournament, this.userId);

      var id = DLRequests.insert({
        type: 'pairings',
        tournament: t_id,
        round: round,
        when: new Date()
      });

      return id;
    }
  });
});
