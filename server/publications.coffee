Meteor.publish 'all-tournaments', () ->
  Tournaments.find()

Meteor.publish 'tournament', ({t_slug}) ->
  Tournaments.find slug: t_slug

Meteor.publish 'teams', ({t_id}) ->
  Teams.find tournament: t_id

