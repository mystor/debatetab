var getPairing = function() {
  return Pairings.findOne({
    ballot_key: Session.get('ballot_key')
  });
};

Template.t_ballot.helpers({
  pairing: function() {
    var pairing = getPairing();
    if (pairing) {
      pairing.teams = _.map(pairing.teams, function(team_id) {
        return Teams.findOne({_id: team_id});
      });
      return pairing;
    }
  },
  teams: function() {
    // Returns the list of teams from the pairing
    var pairing = getPairing();
    if (pairing) {
      return _.map(pairing.teams, function(team_id) {
        return Teams.findOne({_id: team_id});
      });
    }
  },
  ballotLoaded: function() {
    return Subs.isReady('ballot');
  }
});

Template.t_ballot.events({
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

    Meteor.call('submitBallot', map, 
                DebateTab.tournament('_id'), 
                Session.get('ballot_key'), function(err, result) {
      if (err) {
        Modal.throw_err({ short: 'Ballot Error', long: err.reason });
      } else {
        // TODO: Show ballot submission success dialog
        Meteor.Router.to('overview', DebateTab.tournament('slug'));
      }
    });
  }
});

