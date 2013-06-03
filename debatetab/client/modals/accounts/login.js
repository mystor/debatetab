Modal.Login = {
  title: 'Login',
  template: 'login_modal'
};

Template.login_modal.helpers(Modal.helpers);
Template.login_modal.events({
  'tap #forgot-password, click #forgot-password': function (e, tmpl) {
    e.preventDefault();

    Modal.show(Modal.Forgot);
  },
  'submit #login-form': function(e, tmpl) {
    e.preventDefault();

    var email = tmpl.find('#email').value;
    var password = tmpl.find('#password').value;

    Meteor.loginWithPassword(email, password, function(err) {
      if (err) {
        Modal.show(Modal.Login);
        Modal.throw_err({
          short: 'Unable to Login',
          long: err.reason || 'There was a problem logging in'
        });
      } else {
        // Login was successful
        Modal.hide();
      }
    });

    // Display progress bar
    Modal.show({
      title: 'Logging In...',
      template: 'progress_modal'
    });
  },
  'tap #create-account, click #create-account': function (e, tmpl) {
    Modal.show(Modal.Register);
  }
});

