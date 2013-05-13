@DebateTab = {}

if Meteor.isClient
  DebateTab.tournament = (field) ->
    tournament = Tournaments.findOne slug: Session.get 't_slug'
    unless field and _.isString 'field'
      tournament
    else
      if tournament
        tournament[field]
      else
        undefined
