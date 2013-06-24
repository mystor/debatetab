Meteor.methods({
  loadPairings: function(pairings, t_id, round) {
    // Get the tournament
    var tournament = Tournaments.findOne({_id: t_id});
    if (!tournament) {
      throw new Meteor.Error(404, 'The tournament does not exist');
    }

    // Check if user has write permissions
    if (_.indexOf(tournament.admins, this.userId) === -1) {
      throw new Meteor.Error(500, "You do not have permission to load pairings");
    }

    // Check that thr round exists
    if (!(_.isNumber(round) && round % 1 === 0)) {
      throw new Meteor.Error(404, 'Round must be an integer');
    }
    if (tournament.round < round) {
      throw new Meteor.Error(404, 'Round '+round+' does not exist.');
    }

    // Check that the pairings are formatted correctly
    var pairingsFormat = [{
      chair: String,
      judges: [String],
      room: String,
      teams: [String]
    }];

    if (!Match.test(pairings, pairingsFormat)) {
      throw new Meteor.Error(500, 'Pairings are formatted incorrectly');
    }

    var usedJudges = [];
    var usedRooms = [];
    var usedTeams = [];

    _.each(pairings, function(pairing, i) {
      // CHECK FOR PAIRING FORMATTING PROBLEMS
      if (pairing.teams.length !== tournament.room_size) {
        throw new Meteor.Error(500, 'Pairing '+i+' has the wrong number of teams');
      }
      if (_.indexOf(pairing.judges, pairing.chair) === -1) {
        throw new Meteor.Error(500, 'Pairing '+i+' has a chair which is not a judge');
      }
      if (pairing.judges.length < 1) {
        throw new Meteor.Error(500, 'Pairing '+i+' has no judges');
      }

      // ROOM CHECKING
      if (Rooms.find({_id: pairing.room, tournament: t_id}).count() !== 1) {
        throw new Meteor.Error(500, 'Room for pairing '+i+' does not exist');
      }
      if (_.indexOf(usedRooms, pairing.room) !== -1) {
        throw new Meteor.Error(500, 'Room for pairing '+i+' has already been used');
      }
      usedRooms.push(pairing.room);

      // JUDGE CHECKING
      _.each(pairing.judges, function(judge, j) {
        if (Judges.find({_id: judge, tournament: t_id}).count() !== 1) {
          throw new Meteor.Error(500, 'Judge '+j+' for pairing '+i+' does not exist');
        }
        if (_.indexOf(usedJudges, judge) !== -1) {
          throw new Meteor.Error(500, 'Judge '+j+' for pairing '+i+' has already been used');
        }
        usedJudges.push(judge);
      });

      // TEAM CHECKING
      _.each(pairing.teams, function(team, j) {
        if (Teams.find({_id: team, tournament: t_id}).count() !== 1) {
          throw new Meteor.Error(500, 'Team '+j+' for pairing '+i+' does not exist');
        }

        if (_.indexOf(usedTeams, team) !== -1) {
          throw new Meteor.Error(500, 'Team '+j+' for pairing '+i+' has already been used');
        }
        usedTeams.push(team);
      });
    });

    /*
     * Validation complete - now execute changes!
     */
    Pairings.remove({
      tournament: t_id,
      round: round
    });

    _.each(_.shuffle(pairings), function(pairing) {
      var doc = _.extend({
        round: round,
        tournament: t_id
      }, pairing);

      Pairings.insert(doc);
    });
  }
});
