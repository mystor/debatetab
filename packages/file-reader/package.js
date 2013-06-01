Package.describe({
  summary: "Manages file reading"
});

Package.on_use(function (api, where) {
  api.use(['templating', 'underscore', 'session'], 'client');

  api.add_files(['file-reader.js', 'file-prompt.html', 'file-prompt.js'], 'client');
});
