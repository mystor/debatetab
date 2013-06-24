Modal.Register = {
  title: 'Create Account',
  template: 'register_modal'
};

Template.register_modal.helpers(Modal.helpers);
Template.register_modal.events({
  'submit #register-form': function(e, tmpl) {
    e.preventDefault();
    
    var username = tmpl.find('input[name=username]').value;
    var email = tmpl.find('input[name=email]').value;
    var password = tmpl.find('input[name=password]').value;

    if (username.length < 3) {
      Modal.throw_err({
        short: 'Invalid Username',
        long: 'Username must be at least 3 characters long'
      });
    }
    if (!email || email.indexOf('@') === -1) {
      Modal.throw_err({
        short: 'Invalid Email',
        long: 'Email is invalidly formatted'
      });
    }
    if (!password || password.length < 6) {
      Modal.throw_err({
        short: 'Invalid Password',
        long: 'Password must be at least 6 characters long'
      });
    }

    Accounts.createUser({
      username: username, 
      email: email, 
      password: password
    }, function(err) {
      if (err) {
        Modal.throw_err({
          short: 'Error',
          long: err.reason || 'Could not create account'
        });
      } else {
        Modal.hide();
      }
    });
  }
});
