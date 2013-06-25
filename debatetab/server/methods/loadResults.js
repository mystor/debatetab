module(function() {
  var validate = module('validate');
  var array = module('array');

  Meteor.methods({
    loadResults: function(results, t_id, round) {
      var tournament = validate.tournament(t_id);
      validate.admin(tournament, this.userId);
      validate.round(tournament, round);

      // Confirm format conformation
      var resultsFormat = [{
        pairing: String, 
        scores: [Number],
        team: String
      }];
      if (!Match.test(results, resultsFormat)) {
        throw new Meteor.Error(500, 'Results are formatted incorrectly');
      }

      // Confirm that the results array is not sparse
      if (array.isSparse(results)) {
        throw new Meteor.Error(500, 'Results array cannot be sparse');
      }

      var usedTeams = {};
      var pairings = {};

      _.each(results, function(result, i) {
        // Check the number of scores
        if (result.scores.length !== tournament.team_size || array.isSparse(result.scores)) {
          throw new Meteor.Error(500, 'Result '+i+' has the wrong number of scores');
        }

        // Check that scores are valid
        _.each(result.scores, function(score) {
          // Confirm that the score is a number
          if (_.isNaN(score)) {
            throw new Meteor.Error(500, 'Score is NaN');
          }
          if (score < tournament.min_score || score > tournament.max_score) {
            throw new Meteor.Error(500, 'Score: '+score+' is outside of the score range');
          } else if (score % tournament.score_inc !== 0) {
            throw new Meteor.Error(500, 'Score: '+score+' is not a multiple of '+tournament.score_inc);
          }
        });

        // Confirm that each team is only used once
        if (result.team in usedTeams) {
          throw new Meteor.Error(500, 'Team is being used more than once');
        }
        usedTeams[result.team] = true;

        // Confirm that each team exists
        if (Teams.find({ tournament: t_id, _id: result.team }).count() < 1) {
          throw new Meteor.Error(404, 'Team with _id: '+result.team+' does not exist');
        }

        // Confirm that each pairing exists
        var pairing = Pairings.findOne({ tournament: t_id, _id: result.pairing, round: round });
        if (pairing) {
          // Confirm that the team is in the pairing
          if (_.indexOf(pairing.teams, result.team) === -1) {
            throw new Meteor.Error(500, 'Team with _id: '+result.team+' is not in pairing with _id: '+result.pairing);
          }
        } else {
          throw new Meteor.Error(404, 'No pairing exists with _id: '+result.pairing);
        }

        // Add the result to the correct pairing
        if (!_.isArray(pairings[result.pairing])) {
          pairings[result.pairing] = [];
        }
        pairings[result.pairing].push(result);

        // Set tournament & round
        result.tournament = t_id;
        result.round = round;
      });

      // Rank each of the pairings
      _.each(pairings, function(pairing_results, pairing) {
        if (pairing_results.length !== tournament.room_size) {
          throw new Meteor.Error(500, 'Pairing with _id: '+pairing+' has the wrong number of teams');
        }
        
        pairing_results.sort(function(a, b) {
          var aScore = _.reduce(a.scores, function(memo, val) {return memo+val;}, 0);
          var bScore = _.reduce(b.scores, function(memo, val) {return memo+val;}, 0);
          if (aScore === bScore) {
            throw new Meteor.Error(500, 'Two teams in pairing with _id: '+pairing+' have the same speaker score');
          }
          return aScore - bScore;
        });

        // Assign points
        _.each(pairing_results, function(result, index) {
          result.points = index;
        });
      });

      // Everything seems good, lets execute!
      Results.remove({
        tournament: t_id,
        round: round
      });

      _.each(results, function(result) {
        Results.insert(result);
      });
    }
  });
});
