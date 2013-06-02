Accounts.config({
  sendVerificationEmail: true,
  forbidClientAccountCreation: false
});

Accounts.validateNewUser(function(user) {
  if (!user.username || user.username.length < 3) {
    throw new Meteor.Error(403, 'Username must be at least 3 characters long');
  }
  if (!user.email || user.email.indexOf('@') === -1) {
    throw new Meteor.Error(403, 'Email must be validly formatted');
  }
  if (!user.password || user.password.length < 6) {
    throw new Meteor.Error(403, 'Password must be at least 6 characters long');
  }
  return true;
});
