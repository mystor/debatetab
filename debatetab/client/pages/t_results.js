module(function() {
  var ordinal = module('ordinal');

  Template.t_results.helpers({
    pairings: function() {
      return module('searchPairings')(Session.get('search'));
    },
    resultsLoaded: function() {
      return Subs.isReady('results') && Subs.isReady('pairings');
    },
    result: function(team_id) {
      return Results.findOne({
        tournament: DebateTab.tournament('_id'),
        round: DebateTab.round(),
        team: team_id
      });
    },
    // Getters for getting properties of teams to display them
    team_school: function(team_id) {
      return Teams.findOne({
        tournament: DebateTab.tournament('_id'),
        _id: team_id
      }).school;
    },
    team_name: function(team_id) {
      return Teams.findOne({
        tournament: DebateTab.tournament('_id'),
        _id: team_id
      }).name;
    },
    team_speakers: function(team_id) {
      return Teams.findOne({
        tournament: DebateTab.tournament('_id'),
        _id: team_id
      }).speakers;
    },
    room_name: function(room_id) {
      return Rooms.findOne({
        tournament: DebateTab.tournament('_id'),
        _id: room_id
      }).name;
    },
    speaker_score: function(scores, index) {
      return scores[index];
    },

    // Conversion
    to_rank: function(points) {
      return ordinal(DebateTab.tournament('room_size') - points);
    },

    // Booleans as to whether to show scores/points
    show_points: function() {
      return DebateTab.isAdmin() || 
        DebateTab.tournament('published')['ranks-'+DebateTab.round()];
    },
    show_scores: function() {
      return DebateTab.isAdmin() || 
        DebateTab.tournament('published')['scores-'+DebateTab.round()];
    }
  });

  // Require the controlbar module
  var controlbar = module('controlbar');

  Template.t_results.rendered = function() {
    controlbar.initAffix();
  };
});
