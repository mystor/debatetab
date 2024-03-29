module(function() {
  var validate = module('validate');

  var submitBallot = function(ballot, tournament, pairing) {
    var team_size = tournament.team_size;

    var teamResults = _.map(pairing.teams, function(team, team_index) {
      var teamScore = 0;
      var speakerScores = [];

      // Loop through each of the speakers
      for (var speaker_index=0; speaker_index<team_size; speaker_index++) {
        // Get the speaker score
        var score = ballot[team+'-'+speaker_index];

        // Ensure that the score is valid
        if (!_.isNumber(score) || _.isNaN(score)) {
          throw new Meteor.Error(500, 'Non-numeric score for team: '+team+' speaker: '+speaker_index);
        } else if (score < tournament.min_score || score > tournament.max_score){
          throw new Meteor.Error(500, 'Score for team: '+team+' speaker: '+speaker_index+' is out of range');
        } else if (score % tournament.score_inc !== 0) {
          throw new Meteor.Error(500, 'Score for team: '+team+' speaker: '+speaker_index+' is not a multiple of '+tournament.score_inc);
        }

        // Save this score
        teamScore += score;
        speakerScores.push(score);
      }

      // Return the relevant information from the map
      return {
        team: team,
        score: teamScore,
        scores: speakerScores
      };
    });

    // Sort the teams
    teamResults.sort(function(a, b) {
      if (a.score === b.score) {
        throw new Meteor.Error(500, 'Team: '+a.team+' and Team: '+b.team+' have the same score: '+a.score);
      }
      return a.score - b.score;
    });

    // Give the teams points
    _.each(teamResults, function(teamResult, index) {
      _.extend(teamResult, {
        points: index,
        tournament: tournament._id,
        round: pairing.round,
        pairing: pairing._id
      });

      delete teamResult.score;

      // Check that this is a valid result to insert into the DB
      check(teamResult, Results.schema);

      // Remove any old results
      Results.remove({
        tournament: tournament._id,
        round: pairing.round,
        pairing: pairing._id,
        team: teamResult.team
      });

      // Add the new one to the database
      Results.insert(teamResult);
    });
    
    // Get the RFD
    var rfd = ballot.rfd;
    if (_.isString(rfd)) {
      Pairings.update({ _id: pairing._id }, { $set: { rfd: rfd } });
    }
  };

  Meteor.methods({
    submitBallot: function(ballot, t_id, ballot_key) {
      // Perform permission etc validation
      var tournament = validate.tournament(t_id);
      var pairing = validate.ballot(tournament, ballot_key);

      submitBallot(ballot, tournament, pairing);
    },
    updateBallot: function(ballot, t_id, pairing_id) {
      console.log(ballot);
      var tournament = validate.tournament(t_id);
      validate.admin(tournament, this.userId);
      var pairing = validate.pairing(tournament, pairing_id);

      submitBallot(ballot, tournament, pairing);
    }
  });
});
