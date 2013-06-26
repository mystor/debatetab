Handlebars.registerHelper('tournament', function(key) {
  return DebateTab.tournament(key);
});

Handlebars.registerHelper('t_slug', function() {
  return Session.get('t_slug');
});

Handlebars.registerHelper('round', function() {
  return DebateTab.round();
});

Handlebars.registerHelper('isAdmin', function() {
  return DebateTab.isAdmin();
});
