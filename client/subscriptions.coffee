###
# Subscribe to the publish calls on the server
###
Deps.autorun ->
  if Session.get 't_slug' # If the tournament is set, subscribe to it
    Meteor.subscribe 'tournament', t_slug: Session.get 't_slug'

  # Page-based subscriptions
  page = Meteor.Router.page()
  switch page
    when 'tournament_list'
      Meteor.subscribe 'all-tournaments'
    when 'tournament'
      if DebateTab.tournament()
        Meteor.subscribe 'updates-page',
          t_id: DebateTab.tournament '_id'
          page_num: Session.get 'page_num'
          page_size: 5
    when 'team_list'
      if DebateTab.tournament()
        Meteor.subscribe 'teams-page', 
          t_id: DebateTab.tournament '_id'
          query: Session.get 'search_query'
          page_num: Session.get 'page_num'
          page_size: 20
        Meteor.subscribe 'teams-count',
          t_id: DebateTab.tournament '_id'
          query: Session.get 'search_query'
