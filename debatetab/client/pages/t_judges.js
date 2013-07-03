Template.t_judges.helpers({
  judges: function() {
    return Judges.find({
      tournament: DebateTab.tournament('_id')
    });
  },
  judgesLoaded: function() {
    return Subs.isReady('judges');
  }
});
