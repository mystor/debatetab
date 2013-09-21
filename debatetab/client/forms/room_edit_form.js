module('room_edit_form', function() {
  return {
    parse: function(form) {
      var arrs = $(form).serializeArray();
      var doc = {};

      _.each(arrs, function(pair) {
        doc[pair.name] = pair.value;
      });

      return doc;
    }
  };
});
