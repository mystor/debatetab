Package.describe({
  summary: 'Helpers for Regular Expressions'
});

Package.on_use(function(api) {
  api.use('underscore', ['client', 'server']);

  api.add_files('regex-helpers.js', ['client', 'server']);
});
