module('validate', function() {
  return {
    /*
     * Loads the tournament, throws an error if it doesn't exist.
     *
     * Fields: If you pass an objects, passes that object as fields param.
     * If you pass no object, passes default fields parameter
     * If you pass the boolean true, you don't pass a fields parameter
     */
    tournament: function(slug, fields) {
      var tournament;
      if (fields && typeof fields === 'object') {
        tournament = Tournaments.findOne({slug: slug}, {fields: fields});
      } else if (fields === true) {
        tournament = Tournaments.findOne({slug: slug});
      } else {
        tournament = Tournaments.findOne({slug: slug}, {fields: {
          _id: 1,
          published: 1,
          admins: 1,
          round: 1
        }});
      }
      if (tournament) {
        return tournament;
      } else {
        throw new Meteor.Error(404, 'Tournament with slug: '+slug+' does not exist');
      }
    },
    /*
     * Checks if the user is an admin of the tournament passed in
     * Throws an error if the user is not an admin
     */
    admin: function(tournament, userId) {
      var admins = tournament.admins;
      if (_.indexOf(admins, userId) === -1) {
        throw new Meteor.Error(500, 'User with id: '+userId+' is not an admin');
      }
    },
    /*
     * Checks if the round is possible in this tournament
     * If the round is invalid, throws an error
     */
    round: function(tournament, round) {
      if (!(_.isNumber(round) && round % 1 === 0)) {
        throw new Meteor.Error(404, 'Round: '+round+' is not an integer');
      } else if (tournament.round < round) {
        throw new Meteor.Error(404, 'Round: '+round+' does not exist');
      } else if (tournament.round < 1) {
        throw new Meteor.Error(404, 'Round: '+round+' is not positive');
      }
    },
    /*
     * Checks if the ballot is avaliable
     * Returns the pairing for the ballot
     * If it is not, throws an error
     */
    ballot: function(tournament, ballot_key) {
      var pairing = Pairings.findOne({
        tournament: tournament._id,
        ballot_key: ballot_key
      });
      if (!pairing) {
        throw new Meteor.Error(404, 'Ballot with key: '+ballot_key+' does not exist');
      }
      var result_count = Results.find({
        pairing: pairing._id
      }).count();
      if (result_count > 0) {
        throw new Meteor.Error(500, 'Ballot with key: '+ballot_key+' has already been submitted');
      }

      return pairing;
    },
    /*
     * Checks if the pairing exists
     * Returns the pairing.
     * If it doesn't exist, throws an error.
     */
    pairing: function(tournament, pairing_id) {
      var pairing = Pairings.findOne({
        tournament: tournament._id,
        _id: pairing_id
      });
      if (!pairing) {
        throw new Meteor.Error(404, 'Pairing with id: '+pairing_id+' does not exist');
      }

      return pairing;
    }
  };
});
