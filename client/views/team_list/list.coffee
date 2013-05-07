Template.team_list.teams = ->
  Teams.find {}, limit: 20

Template.team_list.adding_team = ->
  Session.get 'adding_team'

Template.team_controls.events 
  'click #add_team': (e) ->
    Session.set 'adding_team', true

