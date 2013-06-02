// Get the current layout to render
Template.body.layoutName = function() {
  if (Meteor.Router.page().substr(0, 2) === 't_') {
    return 'tournamentLayout';
  } else {
    return 'basicLayout';
  }
};
