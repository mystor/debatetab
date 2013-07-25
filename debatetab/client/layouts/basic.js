Template.basicLayout.helpers({
  create_tournamentClass: function () {
    return Meteor.Router.page() === 'create_tournament' ? 'active' : '';
  }
});