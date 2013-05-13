Template.updates_list.updates = ->
  Updates.find
      tournament: DebateTab.tournament '_id'
    ,
      limit: 5
      sort: [['created', 'desc']]

Template.updates_list.events
  'submit #update_add_form': (e, tmpl) ->
    e.preventDefault()

    form = $ e.currentTarget

    textfield = form.find 'input[name=update]'
    update = textfield.val()

    if update and _.isString update
      Updates.insert
        tournament: DebateTab.tournament '_id'
        text: update
        created: new Date()
      form[0].reset()
