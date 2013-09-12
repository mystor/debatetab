Package.describe({
  summary: 'Package with CSV manipulation functions'
});

Package.on_use(function(api) {
  api.add_files('jquery.csv.js', ['client', 'server']);

  api.export('Csv', ['client', 'server']);
});
