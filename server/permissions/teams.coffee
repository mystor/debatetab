Teams.allow
  insert: (userId, doc) ->
    # XXX: Add UserID checking
    Teams.validation.validate doc

