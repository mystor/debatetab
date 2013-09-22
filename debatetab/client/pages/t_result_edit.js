Template.t_result_edit.helpers({
  pairing: function() {
    var pairing = Pairings.findOne({
      _id: Session.get('editing')
    });

    if (pairing) {
      pairing.teams = _.map(pairing.teams, function(team_id) {
        var team = Teams.findOne({ _id: team_id });
        var result = Results.findOne({ team: team_id, pairing: Session.get('editing') });

        if (result) {
          _.each(team.speakers, function(speaker, index) {
            speaker.score = result.scores[index];
          });
        }

        return team;
      });

      return pairing;
    }
  },
  loaded: function() {
    return Subs.isReady('result') && Subs.isReady('pairing');
  }
});
