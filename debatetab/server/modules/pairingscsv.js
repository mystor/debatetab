module('pairingscsv', function() {
  var toUID = module('toUID');
  var validate = module('validate');

  return function(t_id, round) {
    var tournament = validate.tournament(t_id);

    var pairings = Pairings.find({
      tournament: t_id,
      round: round
    }).fetch();

    var arrays = [];
    arrays.push(['Room', 'Teams', 'Judges']);

    _.each(pairings, function(pairing) {
      var rowCount = Math.max(pairing.teams.length, pairing.judges.length);

      for (var i=0; i<rowCount; i++) {
        var row = i===0 ? [toUID.room(pairing.room)] : [''];

        if (i < pairing.teams.length) {
          row.push(toUID.team(pairing.teams[i]));
        } else {
          row.push('');
        }

        if (i < pairing.judges.length) {
          row.push(toUID.judge(pairing.judges[i]));
        } else {
          row.push('');
        }

        arrays.push(row);
      }
      arrays.push(['','','']);
    });

    return [200, {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="pairings.csv"'
    }, Csv.fromArrays(arrays, {experimental: true})];
  };
});
