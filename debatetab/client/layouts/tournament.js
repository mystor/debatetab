Template.tournamentLayout.helpers({
  tournamentLoaded: function() {
    return Subs.isReady('tournament');
  },
  overviewClass: function() {
    return Meteor.Router.page() === 't_overview' ? 'active' : '';
  },
  pairingsClass: function() {
    if (Meteor.Router.page() === 't_pairings' ||
        Meteor.Router.page() === 't_autopair') {
      return 'active';
    }
  },
  resultsClass: function() {
    if (Meteor.Router.page() === 't_team_results' ||
        Meteor.Router.page() === 't_speaker_results' ||
        Meteor.Router.page() === 't_results') {
      return 'active';
    }
  },
  setupClass: function() {
    if (Meteor.Router.page() === 't_teams' ||
        Meteor.Router.page() === 't_judges' ||
        Meteor.Router.page() === 't_rooms') {
      return 'active';
    }
  }
});
