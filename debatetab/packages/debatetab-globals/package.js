Package.describe({
  summary: 'Globals for DebateTab'
});

Package.on_use(function(api) {
  api.use('underscore', ['client', 'server']);
  api.use('deps', 'client');
  api.use('session', 'client');

  // DebateTab related files
  api.add_files([
    'debatetab/definition.js'
  ], ['client', 'server']);

  api.add_files([
    'debatetab/tournament.js',
    'debatetab/pairing.js'
  ], 'client');

  api.export('DebateTab', ['client', 'server']);
  api.export('DTS', 'server');

  // Modal related files
  api.add_files(['modal.js'], 'client');

  api.export('Modal', 'client');
});
