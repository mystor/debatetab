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

Meteor.Regex = {
  clean: function(query) {
    return query.replace(clean_query_regex, '\\$&');
  }
}
