module('toUID', function() {
  return {
    room: function(_id) {
      var room = Rooms.findOne({ _id: _id });

      return room.name;
    },
    team: function(_id) {
      var team = Teams.findOne({ _id: _id });

      return '[' + team.school + '] ' + team.name;
    },
    judge: function(_id) {
      var judge = Judges.findOne({ _id: _id });

      return '[' + judge.school + '] ' + judge.name;
    },
    speaker: function(team_id, i) {
      var team = Teams.findOne({ _id: team_id });
      var speaker = team.speakers[i];

      return speaker.name;
    }
  };
});
