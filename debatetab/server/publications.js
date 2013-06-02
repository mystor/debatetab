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

Meteor.publish('all-updates', function(t_id) {
  return Updates.find({
    tournament: t_id
  });
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
    name: 1
  };

  if (isAdmin(t_id, this.userId)) {
    fields.rank = 1;
    fields.email = 1;
  }

  return Judges.find({ tournament: t_id }, { fields: fields });
});
