Accounts.config({
  sendVerificationEmail: true,
  forbidClientAccountCreation: false
});

Accounts.validateNewUser(function(user) {
  if (!user.username || user.username.length < 3) {
    throw new Meteor.Error(403, 'Username must be at least 3 characters long');
  }
  if (!user.emails[0] || user.emails[0].address.indexOf('@') === -1) {
    throw new Meteor.Error(403, 'Email must be validly formatted');
  }
  return true;
});
