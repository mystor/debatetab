module(function() {
  var validate = module('validate');

  Meteor.methods({
    requestResultCSV: function(t_id, round) {
      var tournament = validate.tournament(t_id);
      validate.admin(tournament, this.userId);

      var id = DLRequests.insert({
        type: 'results',
        tournament: t_id,
        round: round,
        when: new Date()
      });

      return id;
    }
  });
});
