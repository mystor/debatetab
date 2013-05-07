specials = [
  '-'
  '['
  ']'
  '/'
  '{'
  '}'
  '('
  ')'
  '*'
  '+'
  '?'
  '.'
  '\\'
  '^'
  '$'
  '|'
]

clean_query_regex = RegExp '[' + specials.join('\\') + ']', 'g'

clean_query = (query) ->
  query.replace clean_query_regex, '\\$&'


Meteor.publish 'all-tournaments', () ->
  Tournaments.find()

Meteor.publish 'tournament', ({t_slug}) ->
  Tournaments.find slug: t_slug

Meteor.publish 'teams', ({t_id, query, page_num}) ->
  re_query = 
    $regex: clean_query query
    $options: 'i'

  page_size = 10
  
  Teams.find
      tournament: t_id
      $or: [
          name: re_query
        ,
          school: re_query
        ,
          speakers:
            $elemMatch:
              name: re_query
      ]
    ,
      skip: page_num * page_size
      limit: page_size

