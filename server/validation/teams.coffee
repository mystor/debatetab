Teams.allow
  insert: (userId, doc) ->
    # XXX: Add userId checking
    true
  update: (userId, doc, fieldNames, modifier) ->
    # XXX: Add userId checking
    true
  remove: (userId, doc) ->
    # XXX: Add userId checking
    true

  fetch: ['tournament']

# Only allow user to use the $set modifier
Teams.deny
  update: (userId, doc, fieldNames, modifier) ->
    for key of modifier
      unless key is '$set'
        return true
    false
  fetch: []

# Prevent modifying the tournament
Teams.deny
  update: (userId, doc, fieldNames, modifier) ->
    'tournament' in fieldNames
  fetch: []

# Limit possible field names
allowedFields = [
  '_id'
  'name'
  'school'
  'speakers'
  'tournament'
]
allowedSpeakerFields = [
  'name'
  'flags'
]

Teams.deny
  insert: (userId, doc) ->
    for key of doc
      unless key in allowedFields
        console.log "#{userId} submitted bad key: #{key}"
        return true
    false
  update: (userId, doc, fieldNames, modifier) ->
    for key in fieldNames
      if /^speakers\./.test key
        matches = /^speakers\.\d+\.(\S+)$/.exec key
        if matches is null
          return true

        field = matches[1]

        unless field in allowedSpeakerFields
          return true
      else
        unless key in allowedFields
          return true
    false
  fetch: []

