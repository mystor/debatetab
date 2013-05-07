@Tournaments = new Meteor.Collection 'tournaments'
@Teams = new Meteor.Collection 'teams'

Teams.validation = 
  team_fields: [
    '_id'
    'tournament'
    'school'
    'name'
    'speakers'
  ]

  speaker_fields: [
    'name'
    'flags'
  ]

  validate_school: (school) ->
    unless school and _.isString school
      ['School must be filled in']
    else 
      []

  validate_team_name: (name) ->
    unless name and _.isString name
      ['Team Name must be filled in']
    else
      []

  validate_speaker_name: (name) ->
    unless name and _.isString name
      ['Speaker Name must be filled in']
    else
      []

  validate_tournament: (tournament) ->
    unless tournament and Tournaments.findOne(_id: tournament)
      ['Tournament is invalid']
    else
      []

  validate_flags: (flags) ->
    unless _.isArray flags
      return ['Flags must be an array']

    for flag in flags
      unless flag and _.isString flag
        return ['Invalid or empty flag']
    []

  validate_speaker: (speaker) ->
    # Check object type
    unless speaker and _.isObject speaker
      return ['Speaker must be an object']

    # Check Keys
    for key of speaker
      unless key in Teams.validation.speaker_fields
        return ['Invalid key in speaker']

    # Validate fields
    err = Teams.validation.validate_name speaker.name

    _.union err, Teams.validation.validate_flags speaker.flags

  validate: (team) ->
    # Check object type
    unless team and _.isObject team
      return ['Team must be an object']

    # Check Keys
    for key of team
      unless key in Teams.validation.team_fields
        return ['Invalid key in team']

    # Validate fields
    err = Teams.validation.validate_name team.name

    err = _.union err, Teams.validation.validate_school team.school

    for speaker in team.speakers
      err = _.union err, Teams.validation.validate_speaker speaker

    _.union err, Teams.validation.validate_tournament team.tournament
