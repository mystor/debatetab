Meteor.methods({
  'createTournament': function(doc) {
    check(doc, {
      name: String,
      slug: String,
      location: String,
      betakey: String,
      type: String
    });
    // Ensure that the user is logged in
    if (!this.userId) { throw new Meteor.Error(500, 'You must be logged in to create a tournament'); }

    // Trim values of doc
    doc.name = doc.name.trim();
    doc.slug = doc.slug.trim().toLowerCase();
    doc.location = doc.location.trim();
    doc.betakey = doc.betakey.trim();

    // Ensure that the tournament has a name
    if (!doc.name) { throw new Meteor.Error(500, 'Tournament must have a name'); }

    // Ensure that the tournament has a slug
    if (!doc.slug) { throw new Meteor.Error(500, 'Tournament must have a slug'); }

    // Ensure that the tournament's slug has no spaces
    if (!/[a-z0-9]+/.test(doc.slug)) { throw new Meteor.Error(500, 'Tournament slug must contain only letters and numbers'); }

    // Ensure that the tournament has a valid beta key
    // TODO: Actually hook this up to the database
    if (doc.betakey !== 'betakey') { throw new Meteor.Error(500, 'That beta key is not valid'); }

    // Ensure that the name has not been used before
    if (Tournaments.find({ name: doc.name }).count() > 0) { throw new Meteor.Error(500, 'That tournament name is already in use'); }

    // Ensure that the slug has not been used before
    if (Tournaments.find({ slug: doc.slug }).count() > 0) { throw new Meteor.Error(500, 'That slug is already in use'); }

    // Determine the type of tournament
    var tournament_types = module('tournament_types');

    var theType;
    for (var i in tournament_types) {
      var type = tournament_types[i];
      if (type.name === doc.type) {
        theType = type;
        break;
      }
    }

    if (!theType) { throw new Meteor.Error(500, 'That tournament type does not exist'); }

    // Create the tournament
    var tournament = {
      name: doc.name,
      slug: doc.slug,
      location: doc.location || '',
      admins: [this.userId],
      published: {},
      positions: theType.positions,
      room_size: theType.room_size,
      team_size: theType.team_size,
      min_score: theType.min_score,
      max_score: theType.max_score,
      score_incr: theType.score_incr,
      round: 1
    };

    var id = Tournaments.insert(tournament);
  return id;
  }
});