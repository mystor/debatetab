Handlebars.registerHelper 'times', (context, block) ->
  ret = ''
  _(context).times (n) ->
    ret = ret + block index0: n, index1: n+1, first: n is 0
  ret

Handlebars.registerHelper 'equals', (a, b) ->
  a is b

Handlebars.registerHelper 'item_prop', (pointer, args...) ->
  unless pointer?
    return ''

  args.pop() # Remove the options object

  for arg in args
    pointer = pointer[arg]
    
    unless pointer?
      return ''

  pointer

Handlebars.registerHelper 'encodeURIComponent', (str) ->
  encodeURIComponent str

Handlebars.registerHelper 'fromNow', (date) ->
  moment(date).fromNow()

Handlebars.registerHelper 'calendar', (date) ->
  moment(date).calendar()

Handlebars.registerHelper 'top_nav_class', (page) ->
  if Session.equals 'top_page', page then 'active' else ''
