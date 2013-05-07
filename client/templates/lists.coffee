Template.search_box.events
  'submit #search_form': (e, tmpl) ->
    e.preventDefault()
    textbox = $ tmpl.find 'input[type=text]'

    Session.set 'search_query', textbox.val()

Template.search_box.rendered = ->
  textbox = $ this.find 'input[type=text]'

  textbox.val Session.get 'search_query'
