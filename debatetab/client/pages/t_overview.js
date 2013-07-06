Template.t_overview.helpers({
  tournament: function() {
    return DebateTab.tournament();
  },
  location: function() {
    return DebateTab.tournament('location');
  },
  encodedLocation: function() {
    return encodeURIComponent(DebateTab.tournament('location'));
  },
  name: function() {
    return DebateTab.tournament('name');
  }
});

