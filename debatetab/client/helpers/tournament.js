Handlebars.registerHelper('tournament', function(key) {
  return DebateTab.tournament(key);
});

Handlebars.registerHelper('t_slug', function() {
  return Session.get('t_slug');
});

Handlebars.registerHelper('round', function() {
  return DebateTab.round();
});

Handlebars.registerHelper('times', function(count, options) {
  var out = '';

  for (var i=0; i<count; i++) {
    out += options.fn({
      index0: i,
      index1: i+1
    });
  }

  return out;
});
