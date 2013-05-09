load_tournament = (t_slug) ->
  Session.set 't_slug', t_slug
  Session.set 'top_page', 'tournaments'

Meteor.Router.add
  '/': 
    as: 'home'
    to: ->
      Session.set 'top_page', ''
      'home'

  '/t':
    as: 'tournament_list'
    to: ->
      Session.set 'top_page', 'tournaments'
      'tournament_list'
  
  '/t/:t_slug': 
    as: 'tournament'
    to: (t_slug) ->
      load_tournament t_slug
      Session.set 'side_page', 'overview'
      'tournament'

  '/t/:t_slug/teams':
    as: 'team_list'
    to: (t_slug) ->
      load_tournament t_slug
      Session.set 'side_page', 'team_list'
      'team_list'

Meteor.Router.beforeRouting = ->
  # Run before any routing function
  Session.set 'search_query', ''
  Session.set 'page_num', 0
  Session.set 'editing', ''
  Session.set 'adding', false
  Session.set 'navigating', false

# layout Helper
Template.body.helpers
  layoutName: ->
    tournament_pages = [
      'tournament'
      'team_list'
    ]

    if Meteor.Router.page() in tournament_pages
      'tournamentLayout'
    else
      'baseLayout'

