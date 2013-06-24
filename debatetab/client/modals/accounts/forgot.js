Modal.Forgot = {
  title: 'Forgot Password',
  template: 'forgot_modal'
};
Modal.ForgotSuccess = {
  title: 'Forgot Password',
  template: 'forgot_success_modal'
};

Template.forgot_modal.helpers(Modal.helpers);
Template.forgot_modal.events({
  'submit #forgot-form': function(e, tmpl) {
    e.preventDefault();

    var email = tmpl.find('input[name=email]').value;

    if (!email || email.indexOf('@') === -1) {
      Modal.throw_err({
        short: 'Error',
        long: 'Email format is invalid'
      });
      return;
    }
    
    Accounts.forgotPassword({email: email}, function(err) {
      if (err) {
        Modal.throw_err({
          short: 'Error',
          long: err.reason || 'Could not recover password'
        });
      } else {
        Modal.show(Modal.ForgotSuccess);
      }
    });

  }
});

Template.forgot_success_modal.events({
  'click #close-success-modal': function(e, tmpl) {
    e.preventDefault();

    Modal.hide();
  }
});
