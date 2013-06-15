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
      var new_state = !published['pairings-'+DebateTab.round()];
      var update = {
        $set: {
        }
      };
      update.$set['published.pairings-'+DebateTab.round()] = new_state;

      Tournaments.update({_id: DebateTab.tournament('_id')}, update);
    }
  },
  'click button[name=send-eballots]': function(e, tmpl) {
    e.preventDefault();

    Meteor.call('sendEBallots', DebateTab.tournament('_id'), DebateTab.round());

    console.log('Sent EBallots!');
  }
});
