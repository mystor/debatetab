Template.team_edit_form.helpers({
  speakerName: function(speakers, index) {
    if (speakers)
      return speakers[index].name;
  },
  speakerFlags: function(speakers, index) {
    if (speakers)
      return speakers[index].flags.join(', ');
  }
});

module('team_edit_form', function() {
  return {
    parse: function(form) {
      var arrs = $(form).serializeArray();
      var doc = { speakers: [] };

      _.each(arrs, function(pair) {
        var sid = parseInt(pair.name.slice(pair.name.indexOf('-') + 1), 10);

        if (/^speaker/.test(pair.name)) {
          doc.speakers[sid] = doc.speakers[sid] || {};
          doc.speakers[sid].name = pair.value;
        } else if (/^flags/.test(pair.name)) {
          doc.speakers[sid] = doc.speakers[sid] || {};
          doc.speakers[sid].flags = _.compact(
            _.map(pair.value.split(','), function(flag) {
              return flag.trim();
            })
          );
        } else {
          doc[pair.name] = pair.value;
        }
      });

      return doc;
    }
  };
});
