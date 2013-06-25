Template.t_overview.helpers({
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

