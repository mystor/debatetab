Modal.PairingsPublish = {
  title: 'Publish Settings',
  template: 'pairings_publish_modal'
};

Template.pairings_publish_modal.helpers({
  published: function() {
    var published = DebateTab.tournament('published');
    if (published) {
      return published['pairings-'+DebateTab.round()];
    }
  }
});

Template.pairings_publish_modal.events({
  'click button[name=publish-pairings]': function(e, tmpl) {
    e.preventDefault();

    var published = DebateTab.tournament('published');
    if (published) {
      // Determine what the new state of pairing publishing should be
      var new_state = !published['pairings-'+DebateTab.round()];

      // Either publish or unpublish
      if (new_state) {
        Meteor.call('publish', 
          DebateTab.tournament('_id'), 
          'pairings-'+DebateTab.round());
      } else {
        Meteor.call('unpublish', 
          DebateTab.tournament('_id'), 
          'pairings-'+DebateTab.round());
      }
    }
  },
  'click button[name=send-eballots]': function(e, tmpl) {
    e.preventDefault();

    Meteor.call('sendEBallots', DebateTab.tournament('_id'), DebateTab.round());

    console.log('Sent EBallots!');
  }
});
