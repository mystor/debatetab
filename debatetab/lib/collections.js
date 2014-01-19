Tournaments = new Meteor.Collection('tournaments', {
  transform: function(doc) {
    doc.encodedLocation = function() {
      return encodeURIComponent(doc.location);
    };

    return doc;
  }
});
Tournaments.schema = {
  _id: Match.Optional(String),
  name: String,
  slug: String,
  admins: [String], 
  published: Object,
  round: Number,

  // Scoring
  max_score: Number,
  min_score: Number,
  score_inc: Number,

  // Pairing
  team_size: Number,
  room_size: Number,
  positions: [{
    name: String,
    slug: String,
    prop: Boolean
  }]
};

Updates = new Meteor.Collection('updates');
Updates.schema = {
  _id: Match.Optional(String),
  tournament: String,
  when: Date,
  text: String
};

Teams = new Meteor.Collection('teams');
Teams.schema = {
  _id: Match.Optional(String),
  tournament: String,
  school: String,
  name: String,
  speakers: [{
    name: String,
    flags: [String]
  }]
};

Rooms = new Meteor.Collection('rooms');
Rooms.schema = {
  _id: Match.Optional(String),
  tournament: String,
  name: String,
  find_url: Match.Optional(String),
  rank: Number
};

Judges = new Meteor.Collection('judges');
Judges.schema = {
  _id: Match.Optional(String),
  tournament: String,
  school: String,
  name: String,
  email: Match.Optional(String),
  rank: Number
};

Pairings = new Meteor.Collection('pairings');
Pairings.schema = {
  _id: Match.Optional(String),
  tournament: String,
  round: Number,
  room: String,
  teams: [String],
  judges: [String],
  chair: String,
  ballot_key: Match.Optional(String),
  rfd: Match.Optional(String)
};

Results = new Meteor.Collection('results');
Results.schema = {
  _id: Match.Optional(String),
  tournament: String,
  round: Number,
  pairing: String,
  team: String,
  points: Number,
  scores: [Number]
};

// Downloading/downloads
if (Meteor.isServer) {
  DLRequests = new Meteor.Collection('dlrequests');
}
