Template.pairings_header.helpers({
  round: function() {
    return DebateTab.round();
  },
  round_count: function() {
    return DebateTab.tournament('round');
  }
});

Template.pairings_header.events({
  'change #round-select': function(e, tmpl) {
    e.preventDefault();

    var new_round = parseInt(tmpl.find('#round-select').value, 10);

    if (_.isNaN(new_round)) {
      return;
    }

    Meteor.Router.to('pairings', 
      Session.get('t_slug'), 
      new_round);
  },
  'keyup #search-box': function(e, tmpl) {
    var new_query = tmpl.find('#search-box').value;
    console.log(new_query);

    Session.set('search', new_query);
  }
});
