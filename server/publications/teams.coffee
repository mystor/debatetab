Meteor.publish 'all-teams', ({t_id}) ->
  Teams.find tournament: t_id

Meteor.publish 'teams-page', ({t_id, query, page_num, page_size}) ->
  re_query = 
    $regex: Meteor.Regex.clean query
    $options: 'i'

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
      sort: [
        'school'
        'name'
      ]

Meteor.publish 'teams-count', ({t_id, query}) ->
  self = this
  uuid = Meteor.uuid()
  count = 0
  init = true

  re_query =
    $regex: Meteor.Regex.clean query
    $options: 'i'

  query = Teams.find
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

  handle = query.observeChanges
    added: (doc, idx) ->
      count++
      console.log count
      unless init
        self.changed 'counts', uuid, count: count
    removed: (doc, idx) ->
      count--
      self.changed 'counts', uuid, count: count

  init = false

  self.added 'counts', uuid, tournament: t_id, collection: 'teams', count: count
  console.log self

  self.ready()
  console.log self

  self.onStop = ->
    handle.stop()


