Template.accountNav.events({
  'tap #nav-login, click #nav-login': function(e, tmpl) {
    e.preventDefault();

    Modal.show(Modal.Login);
  },
  'tap #nav-logoff, click #nav-logoff': function(e, tmpl) {
    e.preventDefault();

    Meteor.logout();
  }
});
