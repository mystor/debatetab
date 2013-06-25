Template.results_default_controlbar.helpers({
  all_published: function() {
    var published = DebateTab.tournament('published');
    if (published) {
      return published['scores-'+DebateTab.round()];
    }
  },
  ranks_published: function() {
    var published = DebateTab.tournament('published');
    if (published) {
      return published['ranks-'+DebateTab.round()];
    }
  }
});

Template.results_default_controlbar.events({
  'click #publish-ctrl': function(e, tmpl) {
    e.preventDefault();

    Modal.show(Modal.ResultsPublish);
  },
  'click #manual-ctrl': function(e, tmpl) {
    e.preventDefault();

    Modal.show(Modal.ResultsManual);
  }
});
