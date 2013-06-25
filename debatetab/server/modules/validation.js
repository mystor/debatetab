module('validate', function() {
  return {
    /*
     * Loads the tournament, throws an error if it doesn't exist.
     */
    tournament: function(t_id) {
      var tournament = Tournaments.findOne({_id: t_id});
      if (tournament) {
        return tournament;
      } else {
        throw new Meteor.Error(404, 'Tournament with id: '+t_id+' does not exist');
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
    }
  };
});
