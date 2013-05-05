Handlebars.registerHelper 'times', (context, block) ->
  ret = ''
  _(context).times (n) ->
    ret = ret + block index0: n, index1: n+1, first: n is 0
  ret

Handlebars.registerHelper 'navActiveClass', (nav) ->
  if Session.equals('navActive', nav) then 'active' else ''
