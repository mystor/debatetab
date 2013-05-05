Template.team_list.teams = ->
  Teams.find()

# Copy over to phone template
Template.team_list_phone.teams = Template.team_list.teams
