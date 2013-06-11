_.extend(DebateTab, {
  Strategies: {
    Team: [],
    Judge: [],
    Room: []
  },

  /*
   * Executing Strategues
   */
  executeStrategies: function(round, teamStrategy, judgeStrategy, roomStrategy) {
    // These will throw and the function will abort if 
    // we can't execute this strategy
    teamStrategy.validate();
    judgeStrategy.validate();
    roomStrategy.validate();

    var tournament = DebateTab.tournament();
    var t_id = tournament._id;

    /*
     * Get the parameters
     */
    var teams = Teams.find({
      tournament: t_id
    }, {
      sort: teamStrategy.sort
    }).fetch();

    var judges = Judges.find({
      tournament: t_id
    }, {
      sort: judgeStrategy.sort
    }).fetch();

    var rooms = Rooms.find({
      tournament: t_id
    }, {
      sort: roomStrategy.sort
    }).fetch();

    /*
     * Execute the strategies
     */
    var pairings = teamStrategy.algorithm(teams);
    _.each(pairings, function(pairing) {
      pairing.judges = [];
    });
    pairings = judgeStrategy.algorithm(pairings, judges);
    pairings = roomStrategy.algorithm(pairings, rooms);

    return pairings;
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
  },
  /*
   * Pairing Helper Functions - 
   * Useful for validating whether a strategy can be run
   */
  judgeCount: function() {
    // TODO: Switch to use a served `count` variable instead
    // OR decide to always have the judge collection avaliable on client
    return Judges.find({
      tournament: DebateTab.tournament('_id')
    }).count();
  },
  teamCount: function() {
    // TODO: Switch to use a served `count` collection instead
    // OR always have the team collection avaliable on the client
    return Teams.find({
      tournament: DebateTab.tournament('_id')
    }).count();
  },
  roomCount: function() {
    // TODO: Switch to use a served `count` collection instead
    // OR always have the room collection avaliable on the client
    return Rooms.find({
      tournament: DebateTab.tournament('_id')
    }).count();
  },
  predictPairingCount: function() {
    return DebateTab.teamCount() / DebateTab.tournament('room_size');
  }
});
