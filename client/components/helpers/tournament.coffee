Handlebars.registerHelper 'pagePerms', (page) ->
  page ||= Meteor.Router.page()
  # User has permisison to access page if they are one of the admins or the page is public
  # Meteor.userId in Session.get('tournament').admins or Session.get('tournament').public[page]
  true

Handlebars.registerHelper 'page_public', (options) ->
  page = Meteor.Router.page()
  tournament = Session.get 'tournament'
  tournament.public[page]

Handlebars.registerHelper 'tournament_admin', (options) ->
  tournament = Session.get 'tournament'
  unless tournament
    return false

  Meteor.userId() in tournament.admins

# General helper to get the current tournament
# Don't use outside of a tournament context where 
# the session var tournament should be set
Handlebars.registerHelper 'tournament', ->
  Session.get 'tournament'

Handlebars.registerHelper 'side_nav_class', (page) ->
  if Session.equals 'side_page', page then 'active' else ''

Handlebars.registerHelper 'navigating', ->
  Session.get 'navigating'
