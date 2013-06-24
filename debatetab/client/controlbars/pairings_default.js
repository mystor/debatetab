Template.pairings_default_controlbar.helpers({
  published: function() {
    var published = DebateTab.tournament('published');
    if (published) {
      return published['pairings-'+DebateTab.round()];
    }
  }
});

Template.pairings_default_controlbar.events({
  'click #swap-ctrl': function(e, tmpl) {
    e.preventDefault();

    Session.set('swapping', true);
  },
  'click #publish-ctrl': function(e, tmpl) {
    e.preventDefault();

    Modal.show(Modal.PairingsPublish);
  },
  'click #manual-ctrl': function(e, tmpl) {
    e.preventDefault();

    Modal.show(Modal.PairingsManual);
  }
});
