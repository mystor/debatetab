var toRoomUID = function(_id) {
  var room = Rooms.findOne({ _id: _id });

  return room.name;
};
var toTeamUID = function(_id) {
  var team = Teams.findOne({ _id: _id });

  return '[' + team.school + '] ' + team.name;
};
var toJudgeUID = function(_id) {
  var judge = Judges.findOne({ _id: _id });

  return '[' + judge.school + '] ' + judge.name;
};
var pairingsRequest = function(t_id, round) {
  var tournament = Tournaments.findOne(t_id);

  var pairings = Pairings.find({
    tournament: t_id,
    round: round
  }).fetch();

  var arrays = [];
  // Write out the header
  arrays.push(['Room', 'Teams', 'Judges']);

  _.each(pairings, function(pairing) {
    var rowCount = Math.max(pairing.teams.length, pairing.judges.length);

    for (var i=0; i<rowCount; i++) {
      var row = i===0 ? [toRoomUID(pairing.room)] : [''];

      if (i < pairing.teams.length) {
        row.push(toTeamUID(pairing.teams[i]));
      } else {
        row.push('');
      }

      if (i < pairing.judges.length) {
        row.push(toJudgeUID(pairing.judges[i]));
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

Meteor.Router.add('/download/:_token', function(_token) {
  // Get the request from the token
  var request = DLRequests.findOne({_id: _token});

  if (!request) {
    return [404, 'This file token does not exist'];
  }
  var now = new Date();
  var time_delta = now.getTime() - request.when.getTime();

  if (time_delta > 1000 * 60 * 30) {
    // If it has been more than 30 minutes, reject it
    DLRequest.remove({_id: _token});
    return [404, 'This request has expired'];
  }

  var ret = '';
  switch (request.type) {
    case 'pairings':
      ret = pairingsRequest(request.tournament, request.round);
      break;
    default:
      ret = [500, 'Request type is not recognised'];
  }

  // Remove the request object
  DLRequests.remove({_id: _token});

  return ret;
});

Meteor.methods({
  requestPairingCSV: function(t_id, round) {
    console.log(t_id);
    console.log(round);
    // Validate parameters
    var tournament = Tournaments.findOne({_id: t_id});
    if (!tournament) {
      throw new Meteor.Error('No such tournament');
    }

    var isAdmin = this.userId && _.indexOf(tournament.admins, this.userId);

    if (tournament.published['pairings-'+round] || isAdmin) {
      var id = DLRequests.insert({
        type: 'pairings',
        tournament: t_id,
        round: round,
        when: new Date()
      });
      console.log(id);
      return id;
    } else {
      throw new Meteor.Error('No Permission');
    }
  }
});
