module(function() {
  var validate = module('validate');

  Meteor.methods({
    sendEBallots: function(t_id, round) {
      // Get the tournament
      var tournament = validate.tournament(t_id);
      validate.admin(tournament, this.userId);
      validate.round(tournament, round);

      // Get the pairings
      var pairings = Pairings.find({
        tournament: t_id,
        round: round
      }).fetch();

      _.each(pairings, function(pairing) {
        var chair = Judges.findOne({_id: pairing.chair});

        if (chair.email) {
          // Check to see if results have already been submitted
          var resultCount = Results.find({
            tournament: t_id,
            round: round,
            pairing: pairing._id
          }).count();

          if (resultCount < 1) {
            // Results have not already been submitted
            var ballot_key = Random.id();
            Pairings.update({_id: pairing._id}, {$set: {ballot_key: ballot_key}});

            // Fetch related information
            var room = Rooms.findOne({_id: pairing.room});
            var teams = Teams.find({_id: {$in: pairing.teams}}).fetch();
            var judges = Judges.find({_id: {$in: pairing.judges}}).fetch();

            // Generate text for email
            var text = 'Hey '+chair.name+',\n';
            text += 'You have been selected as the chair in the following round: \n';
            text += 'Tournament: '+tournament.name+'\n';
            text += 'Round: '+round+'\n';
            text += 'Room: '+room.name+'\n';
            text += 'Teams: \n';
            _.each(teams, function(team) {
              text += '  ['+team.school+'] '+team.name+'\n';
            });
            text += 'Judges: \n';
            _.each(judges, function(judge) {
              text += '  ['+judge.school+'] '+judge.name+'\n';
            });
            text += '\nAs this tournament is hosted on DebateTab.net, you can submit your results for your round through the DebateTab e-ballot system.\n';
            text += 'To access the e-ballot, please visit the following mobile-optimized URL: \n';
            text += 'http://debatetab.net/t/'+tournament.slug+'/ballot/'+ballot_key+'\n';
            text += '\nIf you have trouble with the e-ballot system, please contact a tournament administrator, and submit results manually.';

            // Send the email
            var email = {
              to: chair.email,
              from: 'eballots@debatetab.net',
              subject: '[DebateTab] Round '+round+' e-ballot',
              text: text
            };

            Email.send(email);
          }
        }
      });
    }
  });
});
