Meteor.publish 'all-updates', ({t_id}) ->
  Updates.find tournament: t_id

Meteor.publish 'updates-page', ({t_id, page_num, page_size}) ->
  Updates.find
      tournament: t_id
    ,
      skip: page_num * page_size
      limit: page_size
      sort: [['created', 'desc']]
