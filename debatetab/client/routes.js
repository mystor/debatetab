var load_tournament = function(t_slug) {
  Session.set('t_slug', t_slug);
};

var load_round = function(t_slug, _round) {
  load_tournament(t_slug);

  var round = parseInt(_round, 10);

  if ((!_.isNaN(round)) && round > 0)  {
    Session.set('round', round);
  } else {
    alert('wtf?');
    alert(round);
    // Redirect to tournament overview
    Meteor.defer(function() {
      Meteor.Router.to('overview', t_slug);
    });
  }
};

// Define the routes
Meteor.Router.add({
  '/': { // TODO: Home, display the list of tournaments
    as: 'tournament_list',
    to: 'tournament_list'
  },
  '/t/:_slug': { // TODO: Display updates for tournament
    as: 'overview',
    to: 't_overview',
    and: load_tournament
  },
  // TODO: Add redirecting to current round for when no round is defined
  '/t/:_slug/pairings/:_round': { // TODO: Display pairings for round
    as: 'pairings',
    to: 't_pairings',
    and: function(_slug, _round) {
      load_round(_slug, _round);
      Session.set('pairings_show', 'teams');
    }
  },
  '/t/:_slug/results': { // Redirect to team results tab
    to: function(_slug) {
      Meteor.defer(function () {
        Meteor.Router.to('results', _slug, 'team');
      });
      return '';
    }
  },
  '/t/:_slug/results/team': { // TODO: Display team tab
    as: 'team_results',
    to: 't_team_results',
    and: load_tournament
  },
  '/t/:_slug/results/speaker': { // TODO: Display speaker tab
    as: 'speaker_results',
    to: 't_speaker_results',
    and: load_tournament
  },
  '/t/:_slug/results/:_round': { // TODO: Display results
    as: 'results',
    to: 't_results',
    and: load_round
  },
  '/t/:_slug/pairing/:_id': { // TODO: Display individual pairing
    as: 'pairing',
    to: 't_pairing',
    and: function(_slug, _id) {
      load_tournament(_slug);
      Session.set('pairing', _id);
    }
  },
  '/t/:_slug/ballot/:_guid': { // TODO: Allow for modifying of ballot
    as: 'ballot',
    to: 't_ballot',
    and: function(_slug, _guid) {
      load_tournament(_slug);
      Session.set('ballot_key', _guid);
    }
  }
});

Meteor.Router.beforeRouting = function() {
  Modal.hide();
  Session.set('search', '');
  Session.set('t_slug', '');
  Session.set('round', 0);
};
