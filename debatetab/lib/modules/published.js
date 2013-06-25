module('published', function() {
  return {
    show: function(tag, userId, tournament) {
      // Default UserId & Tournament
      if (!userId && Meteor.isClient) {
        userId = Meteor.userId();
      }
      if (!tournament && DebateTab.tournament) {
        tournament = DebateTab.tournament();
      }

      // Check if user is an admin
      if (_.indexOf(tournament.admins, userId) !== -1) {
        return true;
      }

      // Return whether it is published
      return tournament.published[tag];
    }
  };
});
