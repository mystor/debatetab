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


Template.t_result_edit.events({
  'submit #ballot-form': function(e, tmpl) {
    e.preventDefault();
    var form = e.currentTarget;
    var arr = $(form).serializeArray();

    // Load the form data into a map
    var map = {};
    _.each(arr, function(pair) {
      if (pair.name !== 'rfd') {
        pair.value = parseFloat(pair.value);
      }
      map[pair.name] = pair.value;
    });

    Meteor.call('updateBallot', map, 
                DebateTab.tournament('_id'), 
                Session.get('editing'), function(err, result) {
      if (err) {
        Modal.throw_err({ short: 'Ballot Error', long: err.reason });
      } else {
        // TODO: Show ballot submission success dialog
        Meteor.Router.to('overview', DebateTab.tournament('slug'));
      }
    });
  }
});
