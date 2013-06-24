Template.accountNav.events({
  'click #nav-login': function(e, tmpl) {
    e.preventDefault();

    Modal.show(Modal.Login);
  },
  'click #nav-logoff': function(e, tmpl) {
    e.preventDefault();

    Meteor.logout();
  }
});
