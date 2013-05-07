###
# Subscribe to the publish calls on the server
###
Deps.autorun ->
  if Session.get 't_slug' # If the tournament is set, subscribe to it
    Meteor.subscribe 'tournament', t_slug: Session.get 't_slug', ->
      Session.set 'tournament', Tournaments.findOne slug: Session.get 't_slug'

  # Page-based subscriptions
  page = Meteor.Router.page()
  switch page
    when 'tournament_list'
      Meteor.subscribe 'all-tournaments'
    when 'team_list'
      if Session.get('tournament')
        Meteor.subscribe 'teams', 
          t_id: Session.get('tournament')._id
          query: Session.get 'search_query'
          page_num: Session.get 'page_num'
