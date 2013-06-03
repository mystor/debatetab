_.extend(DebateTab, {
  Strategies: {
    Team: [],
    Judge: [],
    Room: []
  },

  /*
   * Registering Strategies
   */
  registerTeamStrategy: function(config) {
    DebateTab.Strategies.Team.push(config);
  },
  registerJudgeStrategy: function(config) {
    DebateTab.Strategies.Judge.push(config);
  },
  registerRoomStrategy: function(config) {
    DebateTab.Strategies.Room.push(config);
  },

  /*
   * Helper functions for creating Strategies
   */
  team_get_score: function(team) {
    var score = 0;

    var results = Results.find({
      tournament: team.tournament,
      team: team._id
    }).fetch();

    _.each(results, function(result) {
      _.each(result.scores, function(a_score) {
        score += a_score;
      });
    });

    return score;
  },
  team_get_points: function(team) {
    var points = 0;

    var results = Results.find({
      tournament: team.tournament,
      team: team._id
    }).fetch();

    _.each(results, function(result) {
      points += result.points;
    });

    return points;
  }
});
