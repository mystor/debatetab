var load_tournament = function(t_slug) {
  Session.set('t_slug', t_slug);
};

var load_round = function(t_slug, _round) {
  load_tournament(t_slug);

  var round = parseInt(_round, 10);

  if ((!_.isNaN(round)) && round > 0)  {
    Session.set('round', round);
  } else {
    // Redirect to tournament overview
    Meteor.defer(function() {
      Meteor.Router.to('overview', t_slug);
    });
  }
};

// Define the routes
Meteor.Router.add({
  /*
   * Homepage - tournament list + marketing
   */
  '/': {
    as: 'tournament_list',
    to: 'tournament_list'
  },

  /*
   * Tournament Creation page
   */
  '/create': {
    as: 'create_tournament',
    to: function() {
      if (!Meteor.userId) {
        // Redirect the user to the front page
        // They shouldn't be here if they aren't logged in
        Meteor.defer(function() {
          Meteor.Router.to('tournament_list');
        });
      }
      return 'create_tournament';
    }
  },

  /*
   * Display tournament info & basic tournament commands
   */
  '/t/:_slug': {
    as: 'overview',
    to: 't_overview',
    and: load_tournament
  },
  /*
   * PAIRINGS RELATED ROUTES
   */
  '/t/:_slug/pairings': {
    to: function(_slug) {
      Meteor.defer(function() {
        Meteor.Router.to('pairings', _slug, DebateTab.round());
      });
      return '';
    }
  },
  '/t/:_slug/pairings/:_round': {
    as: 'pairings',
    to: 't_pairings',
    and: function(_slug, _round) {
      load_round(_slug, _round);
      Session.set('pairings_show', 'teams');
      Session.set('swapping', false);
      Session.set('holding', {});
    }
  },
  '/t/:_slug/pairings/:_round/autopair': {
    as: 'autopair',
    to: 't_autopair',
    and: function(_slug, _round) {
      load_round(_slug, _round);
      Session.setDefault('TeamStrategy', 0);
      Session.setDefault('JudgeStrategy', 0);
      Session.setDefault('RoomStrategy', 0);
    }
  },
  /*
   * RESULT RELATED ROUTES
   */
  '/t/:_slug/results': { // Redirect to team results tab
    to: function(_slug) {
      Meteor.defer(function () {
        Meteor.Router.to('results', _slug, 'team');
      });
      return '';
    }
  },
  '/t/:_slug/results/team': { // TEAM TAB
    as: 'team_results',
    to: 't_team_results',
    and: load_tournament
  },
  '/t/:_slug/results/speaker': { // SPEAKER TAB
    as: 'speaker_results',
    to: 't_speaker_results',
    and: load_tournament
  },
  '/t/:_slug/results/:_round': {
    as: 'results',
    to: 't_results',
    and: load_round
  },
  /*
   * BALLOT EDITING & SUBMISSION
   */
  '/t/:_slug/ballot/:_guid': { 
    as: 'ballot',
    to: 't_ballot',
    and: function(_slug, _guid) {
      load_tournament(_slug);
      Session.set('ballot_key', _guid);
    }
  },
  /*
   * TOURNAMENT SETUP
   */
  '/t/:_slug/setup/teams': {
    as: 'team_list',
    to: 't_teams',
    and: load_tournament
  },
  '/t/:_slug/setup/judges': {
    as: 'judge_list',
    to: 't_judges',
    and: load_tournament
  },
  '/t/:_slug/setup/rooms': {
    as: 'room_list',
    to: 't_rooms',
    and: load_tournament
  }
});

Meteor.Router.beforeRouting = function() {
  Modal.hide();
  Session.setDefault('search', '');
  Session.set('t_slug', '');
  Session.set('round', 0);
};

