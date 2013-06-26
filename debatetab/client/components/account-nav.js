Template.accountNav.events({
  'click #nav-login': function(e, tmpl) {
    e.preventDefault();

    Modal.show(Modal.Login);
  },
  'click .account-nav-logoff': function(e, tmpl) {
    e.preventDefault();

    Meteor.logout();
  }
});
