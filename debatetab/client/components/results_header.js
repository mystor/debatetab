Template.results_header.helpers({
  view: function() {
    if (Meteor.Router.page() === 't_team_results') {
      return 'team';
    } else if (Meteor.Router.page() === 't_speaker_results') {
      return 'speaker';
    } else {
      return DebateTab.round();
    }
  },
  round_count: function() {
    return DebateTab.tournament('round');
  }
});

Template.results_header.events({
  'change #view-select': function(e, tmpl) {
    e.preventDefault();

    var new_view = tmpl.find('#view-select').value;
    var new_round = parseInt(new_view, 10);

    if (_.isNaN(new_round)) {
      if (new_view === 'team') {
        Meteor.Router.to('team_results',
          Session.get('t_slug'));
      } else { // if (new_view === 'speaker') {
        Meteor.Router.to('speaker_results',
          Session.get('t_slug'));
      }
    } else {
      Meteor.Router.to('results', 
        Session.get('t_slug'), 
        new_round);
    }
  },
  'keyup #search-box': function(e, tmpl) {
    var new_query = tmpl.find('#search-box').value;

    Session.set('search', new_query);
  }
});
