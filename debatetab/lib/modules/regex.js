module('regex', function() {
  var specials = [
    '-',
    '[',
    ']',
    '/',
    '{',
    '}',
    '(',
    ')',
    '*',
    '+',
    '?',
    '.',
    '\\',
    '^',
    '$',
    '|'
  ];

  var clean_query_regex = RegExp('[' + specials.join('\\') + ']', 'g');
  
  return {
    clean: function(query) {
      return query.replace(clean_query_regex, '\\$&');
    }
  };
});
