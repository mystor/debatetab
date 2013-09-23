module(function() {
  var validate = module('validate');

  /* 
   * Wrapper function
   * Returns true, unless an error was thrown
   * If error thrown, return false
   */
  var unlessErr = function(fn) {
    var self = this;
    return function() {
      try {
        fn.apply(self, arguments);
        return true;
      } catch (e) {
        console.log('Denied', e);
        return false;
      }
    };
  };

  /*
   * Generic allow.
   * Only allows changes using $set
   * Requires you to be admin of tournament
   * Doesn't allow for tournament or _id to be changed
   */
  var genericAllow = function(collection) {
    collection.allow({
      insert: unlessErr(function(userId, doc) {
        /*
         * Insert is allowed if document adheres to schema,
         * And user is admin
         */
        check(doc, collection.schema);
        var tournament = validate.tournament(doc.tournament);
        validate.admin(tournament, userId);
      }),
      update: unlessErr(function(userId, doc, fields, modifier) {
        /*
         * Update is allowed if method is $set
         * new document adheres to schema
         * Cannot update tournament or _id
         */
        var tournament = validate.tournament(doc.tournament);
        validate.admin(tournament, userId);

        _.each(fields, function(field) {
          if (field === 'tournament' || field === '_id') {
            throw new Meteor.Error(500, 'Cannot update tournament or id');
          }
        });

        _.each(modifier, function(value, key) {
          if (key !== '$set') {
            throw new Meteor.Error(500, 'Can only use $set to update');
          }
          check(_.extend(_.clone(doc), value), collection.schema);
        });
      }),
      remove: unlessErr(function(userId, doc) {
        /*
         * Remove is allowed if admin of tournament
         */
        // TODO: Prevent removing once tournament has started
        var tournament = validate.tournament(doc.tournament);
        validate.admin(tournament, userId);
      })
    });
  }

  // TODO: Moderate team sizes
  genericAllow(Teams);
  genericAllow(Judges);
  genericAllow(Rooms);

  // TODO: Have pairings specific rules
  Pairings.allow({
    update: unlessErr(function(userId, doc, fields, modifier) {
      var tournament = validate.tournament(doc.tournament);
      validate.admin(tournament, userId);

      _.each(modifier, function(value, key) {
        if (key === '$set') {
          _.each(value, function(value, key) {
            if (/^teams\.[0-9]+$/.test(key)) {
              if (!Teams.findOne({_id:value, tournament: doc.tournament})) {
                throw new Meteor.Error(500, 'Team must exist');
              }
            } else if (/^judges\.[0-9]+$/.test(key) || /^chair$/.test(key)) {
              if (!Judges.findOne({_id:value, tournament: doc.tournament})) {
                throw new Meteor.Error(500, 'Judge must exist');
              }
            } else if (/^room$/.test(key)) {
              if (!Rooms.findOne({_id:value, tournament: doc.tournament})) {
                throw new Meteor.Error(500, 'Room must exist');
              }
            } else {
              throw new Meteor.Error(500, 'Not an allowed update');
            }
          });
        } else if (key === '$push') {
          _.each(value, function(value, key) {
            if (key === 'judges') {
              if (!Judges.findOne({_id:value, tournament:doc.tournament})) {
                throw new Meteor.Error(500, 'Judge must exist');
              }
            } else {
              throw new Meteor.Error(500, 'Can only push judges');
            }
          });
        } else if (key === '$pull') {
          _.each(value, function(value, key) {
            if (key !== 'judges') {
              throw new Meteor.Error(500, 'Can only pull judges');
            }
          });
        } else {
          throw new Meteor.Error(500, 'Can only update using $set, $push or $pull');
        }
      });
    })
  });
  
});
