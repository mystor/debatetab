PairingsController = TournamentController.extend({
  waitOn: function() {
    // Begin incantation for super();
    var waitOn = TournamentController.prototype.waitOn.call(this);

    // Now add a new subscription
    console.log('waiton?');
    window.herro2 =Meteor.subscribe('round-pairings', this.params.slug, this.params.round);
    waitOn.push(window.herro2);
    console.log(waitOn);
    window.herro = waitOn;
    return waitOn;
  },
  data: function() {
    return Pairings.find({
      tournament: DebateTab.tournament('_id')
    });
  }
});
