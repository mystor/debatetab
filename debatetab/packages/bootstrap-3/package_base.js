Package.describe({
  summary: 'Bootstrap 3 Less Package'
});

Package.on_use(function(api) {
  // files will be defined by bash script
  api.add_files(files, 'client');
});
