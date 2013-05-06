Template.team_list.teams = ->
  Teams.find()

Template.team_list.adding_team = ->
  Session.get 'adding_team'

Template.team_controls.events 
  'click #add_team': (e) ->
    Session.set 'adding_team', true

Template.team_add_form.events
  'click #close_team_add_form': (e) ->
    Session.set 'adding_team', false

  'submit #team_add_form': (e, tmpl) ->
    e.preventDefault()

    form_element = $ tmpl.find '#team_add_form'
    array = form_element.serializeArray()
    console.log array

    form[0].reset()

      

