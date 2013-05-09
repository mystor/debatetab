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

