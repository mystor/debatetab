_.extend(DebateTab, {
  tournament: function(key) {
    /*
     * Get the current tournament
     */
    var tournament = Tournaments.findOne({
      slug: Router.current().params.slug //Session.get('t_slug')
    });

    if (tournament) {
      if (key) {
        return tournament[key];
      } else {
        return tournament;
      }
    }
  },
  round: function() {
    /*
     * Get the current round
     */
    if (Session.get('round')) {
      return Session.get('round');
    } else {
      // Default to getting the current round from the tournament
      return DebateTab.tournament('round');
    }
  },
  isAdmin: function() {
    var admins = DebateTab.tournament('admins');

    return (Meteor.userId() && 
            admins && 
            _.indexOf(admins, Meteor.userId()) !== -1);
  }
});
