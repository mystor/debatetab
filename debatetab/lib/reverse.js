module('reverse', function() {
  return {
    room: function(uid) {
      // Trim spaces
      uid = uid.trim();

      var room = Rooms.findOne({name: uid});
      return room;
    },
    team: function(uid) {
      // Trim spaces
      uid = uid.trim();

      var school_end = _.indexOf(uid, ']');
      var school = uid.slice(1, school_end);
      var name = uid.slice(school_end+1).trim();

      var team = Teams.findOne({school: school, name: name});
      return team;
    },
    judge: function(uid) {
      uid = uid.trim();

      var school_end = _.indexOf(uid, ']');
      var school = uid.slice(1, school_end);
      var name = uid.slice(school_end+1).trim();

      var judge = Judges.findOne({school: school, name: name});
      return judge;
    },
    speaker: function(team, uid) {
      uid = uid.trim();

      var index = _.reduce(team.speakers, function(memo, speaker, i) {
        if (speaker.name === uid) return i;
        return memo;
      }, -1);

      return index;
    }
  };
});

// TODO: Remove DebateTab.reverse
DebateTab.reverse = {
  room: function(uid) {
    // Trim spaces
    uid = uid.trim();

    var room = Rooms.findOne({name: uid});
    return room;
  },
  team: function(uid) {
    // Trim spaces
    uid = uid.trim();

    var school_end = _.indexOf(uid, ']');
    var school = uid.slice(1, school_end);
    var name = uid.slice(school_end+1).trim();

    var team = Teams.findOne({school: school, name: name});
    return team;
  },
  judge: function(uid) {
    uid = uid.trim();

    var school_end = _.indexOf(uid, ']');
    var school = uid.slice(1, school_end);
    var name = uid.slice(school_end+1).trim();

    var judge = Judges.findOne({school: school, name: name});
    return judge;
  }
};
