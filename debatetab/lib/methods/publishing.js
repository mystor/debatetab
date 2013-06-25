module(function() {
  if (Meteor.isServer) {
    var validate = module('validate');
  }

  Meteor.methods({
    publish: function(t_id, tag) {
      if (Meteor.isServer) {
        // Verify permissions - server only
        var tournament = validate.tournament(t_id);
        validate.admin(tournament, this.userId);
      }

      if (/\./.test(tag)) {
        throw new Meteor.Error(500, 'Tag cannot contain periods');
      }

      var $set = {};
      $set['published.'+tag] = true;

      // Ensure that speaks -> points
      if (/scores-/.test(tag)) {
        $set['published.'+tag.replace('scores', 'ranks')] = true;
      }

      Tournaments.update({ _id: t_id }, { $set: $set });
    },
    unpublish: function(t_id, tag) {
      if (Meteor.isServer) {
        // Verify permissions - server only
        var tournament = validate.tournament(t_id);
        validate.admin(tournament, this.userId);
      }

      if (/\./.test(tag)) {
        throw new Meteor.Error(500, 'Tag cannot contain periods');
      }

      var $set = {};
      $set['published.'+tag] = false;

      // Ensure that speaks -> points
      if (/ranks-/.test(tag)) {
        $set['published.'+tag.replace('ranks', 'scores')] = false;
      }

      // Perform updates
      Tournaments.update({ _id: t_id }, { $set: $set });
    }
  });
});
