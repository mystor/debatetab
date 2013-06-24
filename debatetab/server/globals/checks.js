_.extend(DTS, {
  tournament: function(id) {
    var tournament = Tournaments.findOne({_id: id});
    if (!tournament) {
      throw new Meteor.Error(404, 'Tournament does not exist');
    }
    return tournament;
  },
  isAdmin: function(tournament, userId) {
    return _.indexOf(tournament.admins, userId) !== -1;
  },
  /*
   * Checks that the user is an admin of the tournament
   * Throws if it is not
   */
  checkAdmin: function(tournament, userId) {
    if (!DTS.isAdmin) {
      throw new Meteor.Error(500, 'You are not an admin for this tournament');
    }
  },
  /*
   * Checks that the round is valid for the tournament
   * Throws if it is not
   */
  checkRound: function(tournament, round) {
    if (!(_.isNumber(round) && round % 1 === 0)) {
      throw new Meteor.Error(404, 'Round must be an integer');
    } else if (tournament.round < round) {
      throw new Meteor.Error(404, 'Round '+round+' does not exist');
    }
  }
});
