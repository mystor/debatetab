load_tournament = (t_slug) ->
  Session.set 't_slug', t_slug

Meteor.Router.add
  '/': 
    as: 'home'
    to: 'home'

  '/t':
    as: 'tournament_list'
    to: 'tournament_list'
  
  '/t/:t_slug': 
    as: 'tournament'
    to: (t_slug) ->
      load_tournament t_slug
      'tournament'

  '/t/:t_slug/teams':
    as: 'team_list'
    to: (t_slug) ->
      load_tournament t_slug
      'team_list'

# layout Helper
Template.body.helpers
  layoutName: () ->
    switch Meteor.Router.page()
      when 'home', 'tournament_list'
        'baseLayout'
      when 'tournament', 'team_list'
        'tournamentLayout'

