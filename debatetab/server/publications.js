/*
 * Helper functions for getting admin permissions
 */
var admins = function(t_id) {
  return Tournaments.findOne({_id: t_id},{fields:{admins: 1}}).admins;
};
var isAdmin = function(t_id, userId) {
  return _.indexOf(admins(t_id), userId) !== -1;
};

/*
 * Publications
 */
Meteor.publish('all-tournaments', function() {
  return Tournaments.find({}, {
    fields: {
      name: 1
    }
  });
});

Meteor.publish('tournament', function(_slug) {
  return Tournaments.find({
    slug: _slug
  });
});

Meteor.publish('full-tournament', function(_slug) {
  var tournament_cursor = Tournaments.find({
    slug: _slug
  });

  var tournament = tournament_cursor.fetch()[0];
  if (tournament) {
    return [
      tournament_cursor,
      Teams.find({tournament: tournament._id}),
      Judges.find({tournament: tournament._id}),
      Rooms.find({tournament: tournament._id})
    ];
  }
});

Meteor.publish('recent-updates', function(t_id) {
  return Updates.find({
    tournament: t_id
  }, {
    sort: [['when', 'desc']],
    limit: 5
  });
});

Meteor.publish('all-teams', function(t_id) {
  return Teams.find({
    tournament: t_id
  });
});

Meteor.publish('all-rooms', function(t_id) {
  return Rooms.find({
    tournament: t_id
  });
});

Meteor.publish('all-judges', function(t_id) {
  var fields = {
    _id: 1,
    school: 1,
    name: 1,
    tournament: 1
  };

  if (isAdmin(t_id, this.userId)) {
    fields.rank = 1;
    fields.email = 1;
  }

  return Judges.find({ tournament: t_id }, { fields: fields });
});

Meteor.publish('all-pairings', function(t_id, round) {
  var fields = {
    _id: 1,
    teams: 1,
    judges: 1,
    room: 1,
    chair: 1,
    round: 1,
    tournament: 1
  };

  var pairings = Pairings.find({ tournament: t_id, round: round }, { fields: fields });

  return pairings;
});
