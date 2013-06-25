Modal.ResultsPublish = {
  title: 'Publish Settings',
  template: 'results_publish_modal'
};

Template.results_publish_modal.helpers({
  scores_published: function() {
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

Template.results_publish_modal.events({
  'click button[name=publish-ranks]': function(e, tmpl) {
    e.preventDefault();

    var published = DebateTab.tournament('published');
    if (published) {
      // Determine what the new state of pairing publishing should be
      var new_state = !published['ranks-'+DebateTab.round()];

      // Either publish or unpublish
      if (new_state) {
        Meteor.call('publish', 
          DebateTab.tournament('_id'), 
          'ranks-'+DebateTab.round());
      } else {
        Meteor.call('unpublish', 
          DebateTab.tournament('_id'), 
          'ranks-'+DebateTab.round());
      }
    }
  },
  'click button[name=publish-scores]': function(e, tmpl) {
    e.preventDefault();

    var published = DebateTab.tournament('published');
    if (published) {
      // Determine what the new state of pairing publishing should be
      var new_state = !published['scores-'+DebateTab.round()];

      // Either publish or unpublish
      if (new_state) {
        Meteor.call('publish', 
          DebateTab.tournament('_id'), 
          'scores-'+DebateTab.round());
      } else {
        Meteor.call('unpublish', 
          DebateTab.tournament('_id'), 
          'scores-'+DebateTab.round());
      }
    }
  }
});
