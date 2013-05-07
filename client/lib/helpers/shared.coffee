Handlebars.registerHelper 'times', (context, block) ->
  ret = ''
  _(context).times (n) ->
    ret = ret + block index0: n, index1: n+1, first: n is 0
  ret

Handlebars.registerHelper 'top_nav_class', (page) ->
  if Session.equals 'top_page', page then 'active' else ''
