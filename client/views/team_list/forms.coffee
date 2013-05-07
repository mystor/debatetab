parse_team_form = (form) ->
  # Parses the form for the team, returning a document
  array = form.serializeArray()

  doc =
    speakers: []

  for element in array
    if /^speakername_/.test element.name
      # Treat speaker names differently
      speaker_num = parseInt element.name.substr 12

      doc.speakers[speaker_num] ||= {}
      doc.speakers[speaker_num].name = element.value
    else if /^speakerflags_/.test element.name
      # Treat speaker flags differently
      speaker_num = parseInt element.name.substr 13
      
      flags = _.map element.value.split(','), (val) ->
        $.trim val # Trim white spaces from each element

      doc.speakers[speaker_num] ||= {}
      doc.speakers[speaker_num].flags = _.without flags, '' # Omit empty flags

    else
      # Just add the key/value pair to doc
      doc[element.name] = element.value

    doc

###
# Adding a team
###

Template.team_add_form.events
  'click #close_team_add_form': (e) ->
    Session.set 'adding_team', false

  'submit #team_add_form': (e, tmpl) ->
    e.preventDefault()

    form = $ tmpl.find '#team_add_form'

    # Get the form data
    doc = parse_team_form form
    doc.tournament = Session.get('tournament')._id
    
    # Validate the form data
    validation_errors = Teams.validation.validate doc

    for error in validation_errors
      Meteor.Errors.warning error

    if validation_errors
      return

    Teams.insert doc

    form[0].reset()
    $(tmpl.find 'input[type=text]').focus()

Template.team_add_form.rendered = ->
  # Focus the text area on opening form
  $(this.find 'input[type=text]').focus()

