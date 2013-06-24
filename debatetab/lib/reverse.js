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
