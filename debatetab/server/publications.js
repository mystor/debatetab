var publish = function(name, fn) {
  Meteor.publish(name, function() {
    try {
      return fn.apply(this, arguments);
    } catch (e) {
      return [];
    }
  });
}
/*
 * Helper functions for getting admin permissions
 * TODO: Move to using the validate module instead
 */
var admins = function(t_id) {
  return Tournaments.findOne({_id: t_id},{fields:{admins: 1}}).admins;
};
var isAdmin = function(t_id, userId) {
  return _.indexOf(admins(t_id), userId) !== -1;
};

module(function() {
  var published = module('published');
  var validate = module('validate');

  /*
   * Publications
   */
  Meteor.publish('all-tournaments', function() {
    var Future = Npm.require('fibers/future');
    var future = new Future;

    Meteor.setTimeout(function() {
      var cursor = Tournaments.find({}, {
        fields: {
          name: 1,
             slug: 1
        }
      });
      console.log('hello?');
      future.return(cursor);
    }, 2000);
    
    return future.wait();

    return Tournaments.find({}, {
      fields: {
        name: 1,
           slug: 1
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

    // TODO: Add this back in
    // if (isAdmin(t_id, this.userId)) {
    //   fields.rank = 1;
    //   fields.email = 1;
    // }

    return Judges.find({ tournament: t_id }, { fields: fields });
  });

  publish('round-pairings', function(slug, round) {
    var tournament = validate.tournament(slug);
    validate.round(tournament, round);

    if (published.show('pairings-'+round, this.userId, tournament)) {
      var fields = {
        _id: 1,
        teams: 1,
        judges: 1,
        room: 1,
        chair: 1,
        round: 1,
        tournament: 1
      };

      if (published.show('scores-'+round, this.userId, tournament)) {
        fields.rfd = 1;
      }

      return Pairings.find({ tournament: tournament._id, round: round }, { fields: fields });
    }
    return [];
  });

  Meteor.publish('pairing', function(t_id, _id) {
    var tournament = validate.tournament(t_id);

    var fields = {
      _id: 1,
      teams: 1,
      judges: 1,
      room: 1,
      chair: 1,
      round: 1,
      tournament: 1
    };

    pairing = Pairings.find({ tournament: t_id, _id: _id }, { fields: fields });

    var round = pairing.fetch()[0].round;
    if (published.show('pairings-'+round, this.userId, tournament)) {

      if (published.show('scores-'+round, this.userId, tournament)) {
        fields.rfd = 1;
        return Pairings.find({ tournament: t_id, _id: _id }, { fields: fields });
      } else {
        return pairing;
      }
    }

    return [];
  });

  Meteor.publish('ballot', function(t_id, ballot_key) {
    var pairings = Pairings.find({
      ballot_key: ballot_key,
      tournament: t_id
    });

    var pairing = pairings.fetch()[0];
    if (pairing) {
      var result_count = Results.find({
        tournament: t_id,
        pairing: pairing._id
      }).count();

      if (result_count === 0) {
        return pairings;
      }
    }
    return [];
  });

  Meteor.publish('pairing-result', function(t_id, pairing) {
    var tournament = validate.tournament(t_id);

    var round = Pairings.findOne({ tournament: t_id, _id: pairing }, { fields: { round: 1 }}).round;
    if (published.show('ranks-'+round, this.userId, tournament)) {
      var fields = {
        _id: 1,
        tournament: 1,
        round: 1,
        pairing: 1,
        team: 1,
        points: 1
      };

      if (published.show('scores-'+round, this.userId, tournament)) {
        fields.scores = 1;
      }
      return Results.find({ tournament: t_id, pairing: pairing }, { fields: fields });
    }
  });

  Meteor.publish('round-results', function(t_id, round) {
    var tournament = validate.tournament(t_id);
    validate.round(tournament, round);

    if (published.show('ranks-'+round, this.userId, tournament)) {
      var fields = {
        _id: 1,
        tournament: 1,
        round: 1,
        pairing: 1,
        team: 1,
        points: 1
      };

      if (published.show('scores-'+round, this.userId, tournament)) {
        fields.scores = 1;
      }
      return Results.find({ tournament: t_id, round: round }, { fields: fields });
    } else {
      return [];
    }
  });
});
