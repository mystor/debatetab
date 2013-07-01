module('searchPairings', function() {
  var regex = module('regex');

  return function(query) {
    var $regex = {
      $regex: regex.clean(query),
      $options: 'i'
    };
    var t_id = DebateTab.tournament('_id');

    // Find teams
    var teams = _.map(Teams.find({
      tournament: t_id,
      $or: [
        {name: $regex},
        {school: $regex},
        {
          speakers: {
            $elemMatch: {
              name: $regex
            }
          }
        }
      ]
    }).fetch(), function(team) {return team._id;});

    // Find rooms
    var rooms = _.map(Rooms.find({
      tournament: t_id,
      name: $regex
    }).fetch(), function(room) {return room._id;});

    // Find judges
    var judges = _.map(Judges.find({
      tournament: t_id,
      $or: [
        {name: $regex},
        {school: $regex}
      ]
    }).fetch(), function(judge) {return judge._id;});

    // Find pairings
    var pairings = Pairings.find({
      tournament: t_id,
      round: DebateTab.round(),
      $or: [
        // Contains at least one team from teams
        {$where: function() {
          return !_.isEmpty(_.intersection(this.teams, teams));
        }},
        // Contains at least one judge from judges
        {$where: function() {
          return !_.isEmpty(_.intersection(this.judges, judges));
        }},
        // Is in one of the rooms from rooms
        {room: {$in: rooms}}
      ]
    });

    return pairings;
  };
});
