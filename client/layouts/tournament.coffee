Template.tournamentLayout.sidebar_item = (options) ->
  url = options.fn this

  name = options.hash.name or ''
  slug = options.hash.slug or ''

  Template.sidebar_item
    name: name
    slug: slug
    url: url

