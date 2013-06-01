Package.describe({
  summary: 'Interaction with CSV files'
});

Package.on_use(function(api) {
  api.use(['underscore', 'file-reader', 'router']);

  api.add_files(['csv-integration.js', 'csv-reader.js'], ['client', 'server']);
  api.add_files('csv-creator.js', 'server');
});
