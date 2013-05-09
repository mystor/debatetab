Template.team_list.teams = ->
  Teams.find {}, limit: 20

Template.team_list.adding = ->
  Session.get 'adding'

Template.team_list.editing = ->
  Session.get 'editing'

Template.team_controls.events 
  'click #add_team': (e) ->
    Session.set 'adding', true

Template.team_display.events
  'click .edit_team_button': (e, tmpl) ->
    e.preventDefault()
    button = $ e.currentTarget
    _id = button.data 'teamid'

    Session.set 'editing', _id
