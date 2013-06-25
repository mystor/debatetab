module('resultscsv', function() {
  var toUID = module('toUID');
  var validate = module('validate');

  return function(t_id, round) {
    var tournament = validate.tournament(t_id);

    var pairings = Pairings.find({
      tournament: t_id,
      round: round
    }).fetch();

    var arrays = [];
    arrays.push(['Room', 'Teams', 'Speaker', 'Score']);

    _.each(pairings, function(pairing) {
      var teamCount = pairing.teams.length;

      var row = [toUID.room(pairing.room)];

      for (var i=0; i<teamCount; i++) {
        var speakerCount = tournament.team_size;

        // Get the result
        var result = Results.findOne({
          tournament: t_id,
          round: round,
          team: pairing.teams[i]
        });

        // Display the name of the team
        row.push(toUID.team(pairing.teams[i]));

        // Loop through the speakers
        for (var j=0; j<speakerCount; j++) {
          // Write out the speaker's name
          row.push(toUID.speaker(pairing.teams[i], j));
          if (result) {
            row.push(result.scores[j]);
          } else {
            row.push('');
          }

          arrays.push(row);
          row = ['',''];
        }

        row = [''];
      }
      
      arrays.push(['','','','']);
    });

    return [200, {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="results.csv"'
    }, Csv.fromArrays(arrays, {experimental: true})];
  };
});
