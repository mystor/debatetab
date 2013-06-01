Meteor.publish 'all-tournaments', () ->
  Tournaments.find()

Meteor.publish 'tournaments-page', ({query, page_num, page_size}) ->
  re_query =
    $regex: Meteor.Regex.clean query
    $options: 'i'

  Tournaments.find
      name: re_query
    ,
      skip: page_num * page_size
      limit: page_size
      sort: [
        ['date', 'desc']
        'name'
      ]

Meteor.publish 'tournament', ({t_slug}) ->
  Tournaments.find slug: t_slug
