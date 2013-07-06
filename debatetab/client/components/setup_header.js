Template.setup_header.helpers({
  view: function() {
    if (Meteor.Router.page() === 't_teams') {
      return 'teams';
    } else if (Meteor.Router.page() === 't_judges') {
      return 'judges';
    } else if (Meteor.Router.page() === 't_rooms') {
      return 'rooms';
    } else {
      throw 'SETUP HEADER DISPLAYING ON INVALID PAGE';
    }
  },
  query: function() {
    return Session.get('search');
  },
  targetName: function() {
    if (Meteor.Router.page() === 't_teams') {
      return 'Teams';
    } else if (Meteor.Router.page() === 't_judges') {
      return 'Judges';
    } else if (Meteor.Router.page() === 't_rooms') {
      return 'Rooms';
    } else {
      throw 'SETUP HEADER DISPLAYING ON INVALID PAGE';
    }
  }
});

Template.setup_header.events({
  'change #view-select': function(e, tmpl) {
    e.preventDefault();

    var new_view = tmpl.find('#view-select').value;

    switch (new_view) {
      case 'teams':
        Meteor.Router.to('team_list', Session.get('t_slug'));
        break;
      case 'judges':
        Meteor.Router.to('judge_list', Session.get('t_slug'));
        break;
      case 'rooms':
        Meteor.Router.to('room_list', Session.get('t_slug'));
        break;
      default:
        throw 'Switching to invalid page';
    }
  },
  'keyup #search-box': function(e, tmpl) {
    var new_query = tmpl.find('#search-box').value;

    Session.set('search', new_query);
  }
});
