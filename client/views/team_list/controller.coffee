# Helpers
Template.team_list.helpers
  teams: ->
    Teams.find {tournament: DebateTab.tournament '_id'}, limit: 20, sort: ['school', 'name']
  adding: ->
    Session.get 'adding'
  editing: ->
    Session.get 'editing'

# Events
Template.team_controls.events 
  'click #add_team': (e) ->
    Session.set 'adding', true

Template.team_display.events
  'click .edit_team_button': (e, tmpl) ->
    e.preventDefault()
    button = $ e.currentTarget
    _id = button.data 'teamid'

    Session.set 'editing', _id

  'click .delete_team_button': (e, tmpl) ->
    e.preventDefault()
    button = $ e.currentTarget

    _id = button.data 'teamid'

    team = Teams.findOne _id: _id

    if confirm "Delete team '#{team.name}'?"
      Teams.remove _id: _id
