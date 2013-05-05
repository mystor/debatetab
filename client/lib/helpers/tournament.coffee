Handlebars.registerHelper 'pagePerms', (page) ->
  # User has permisison to access page if they are one of the admins or the page is public
  # Meteor.userId in Session.get('tournament').admins or Session.get('tournament').public[page]
  true

# General helper to get the current tournament
# Don't use outside of a tournament context where 
# the session var tournament should be set
Handlebars.registerHelper 'tournament', ->
  Session.get 'tournament'
