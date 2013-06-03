var load_tournament = function(t_slug) {
  Session.set('t_slug', t_slug);
};

var load_round = function(t_slug, round) {
  load_tournament(t_slug);

  if (round) {
    Session.set('round', round);
  } else {
    // Get the current round
    round = DebateTab.current_round();
    Session.set('round', round);
  }
};

// Define the routes
Meteor.Router.add({
  '/': { // Home, display the list of tournaments
    as: 'tournament_list',
    to: 'tournament_list'
  },
  '/t/:_slug': { // Display updates for tournament
    as: 'updates',
    to: 't_updates',
    and: load_tournament
  },
  '/t/:_slug/pairings/:_round?': {
    to: function(_slug, _round) {
      Meteor.defer(function() {
        Meteor.Router.to('team_pairings', _slug, _round);
      });
      return '';
    }
  },
  '/t/:_slug/pairings/team/:_round?': {
    as: 'team_pairings',
    to: 't_pairings_team',
    and: load_round
  },
  '/t/:_slug/pairings/judge/:_round?': {
    as: 'judge_pairings',
    to: 't_pairings_judge',
    and: load_round
  },
  '/t/:_slug/results': {
    to: function(_slug) {
      Meteor.defer(function () {
        Meteor.Router.to('results', _slug, 'team');
      });
      return '';
    }
  },
  '/t/:_slug/results/:_round': {
    as: 'results',
    to: function(_slug, _round) {
      var tmpl = '';
      if (_round === 'team') {
        load_tournament(_slug);

        tmpl = 't_team_results';
      } else if (_round === 'speaker') {
        load_tournament(_slug);

        tmpl = 't_speaker_results';
      } else {
        load_round(_slug, _round);

        tmpl = 't_results';
      }

      return tmpl;
    }
  },
  '/t/:_slug/pairing/:_id': { // Display individual pairing
    as: 'pairing',
    to: 't_pairing',
    and: function(_slug, _id) {
      load_tournament(_slug);
      Session.set('pairing', _id);
    }
  },
  '/t/:_slug/ballot/:_guid': {
    as: 'ballot',
    to: 't_ballot',
    and: function(_slug, _guid) {
      load_tournament(_slug);
      Session.set('ballot_key', _guid);
    }
  },
  '/t/:_slug/team_tab': {
    as: 'team_tab',
    to: 't_team_tab',
    and: load_tournament
  },
  '/t/:_slug/speaker_tab': {
    as: 'speaker_tab',
    to: 't_speaker_tab',
    and: load_tournament
  }
});

Meteor.Router.beforeRouting = function() {
  Session.set('search', '');
  Modal.hide();
  Session.set('t_slug', '');
  Session.set('round', 0);
};

