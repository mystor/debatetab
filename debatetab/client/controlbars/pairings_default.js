Template.pairings_default_controlbar.events({
  'click #swap-ctrl, tap #swap-ctrl': function(e, tmpl) {
    e.preventDefault();

    Session.set('swapping', true);
  },
  'click #publish-ctrl, tap #publish-ctrl': function(e, tmpl) {
    e.preventDefault();

    console.log('ha');
    console.log(Modal.PairingsPublish);
    Modal.show(Modal.PairingsPublish);
  }
});
