Template.t_teams.helpers({
  teams: function() {
    return Teams.find({
      tournament: DebateTab.tournament('_id')
    });
  },
  teamsLoaded: function() {
    return Subs.isReady('teams');
  }
});
