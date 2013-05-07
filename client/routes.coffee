load_tournament = (t_slug) ->
  Session.set 't_slug', t_slug
  Session.set 'top_page', 'tournaments'

reset_list = ->
  Session.set 'search_query', ''
  Session.set 'page_num', 0

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
      reset_list()
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
      reset_list()
      Session.set 'side_page', 'team_list'
      'team_list'

# layout Helper
Template.body.helpers
  layoutName: () ->
    switch Meteor.Router.page()
      when 'home', 'tournament_list'
        'baseLayout'
      when 'tournament', 'team_list'
        'tournamentLayout'

