module(function() {
  var validate = module('validate');

  Meteor.methods({
    nextRound: function(t_id) {
      //TODO: Make this actually check first
      var tournament = validate.tournament(t_id);
      validate.admin(tournament, this.userId);

      Tournaments.update({ _id: t_id }, {
        $inc: {
          round: 1
        }
      });
    }
  });
});
