Package.describe({
  summary: 'Adds sub-page state to Meteor.Router pages using hashes'
});

Package.on_use(function(api) {
  api.use(['deps', 'router', 'underscore'], 'client');

  api.add_files('hashstate.js', 'client');
});
