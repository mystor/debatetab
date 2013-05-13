Handlebars.registerHelper 'content_panel_name', (icon, name) ->
  new Handlebars.SafeString(Template.content_panel_name
    icon: icon
    name: name
  )

Template.content_panel_name.events
  'click .nav-back': (e, tmpl) ->
    console.log 'here'
    e.preventDefault()

    Session.set 'navigating', true

Template.page_public_status.events
  'click #page_public_status_btn': (e, tmpl) ->
    # Load the current state
    page_name = Meteor.Router.page()
    current_state = DebateTab.tournament('public')[page_name]

    # Create the modifier
    modifier = 
      $set: {}
    modifier.$set["public.#{page_name}"] = not current_state

    # Modify the tournament
    Tournaments.update
        _id: DebateTab.tournament '_id'
      ,
        modifier

