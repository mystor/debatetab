Tournaments = new Meteor.Collection('tournaments');
Tournaments.schema = {
  _id: String,
  name: String,
  slug: String,
  admins: [String], 
  publishing: [String],
  round: Number
};

Updates = new Meteor.Collection('updates');
Updates.schema = {
  _id: String,
  when: Date,
  text: String
};

Teams = new Meteor.Collection('teams');
Teams.schema = {
  _id: String,
  school: String,
  name: String,
  speakers: [{
    name: String,
    flags: [String]
  }]
};

Rooms = new Meteor.Collection('rooms');
Rooms.schema = {
  _id: String,
  name: String,
  find_url: Match.Optional(String),
  rank: Number
};

Judges = new Meteor.Collection('judges');
Judges.schema = {
  _id: String,
  school: String,
  name: String,
  email: String,
  rank: Number
};

Pairings = new Meteor.Collection('pairings');
Pairings.schema = {
  _id: String,
  round: Number,
  room: String,
  teams: [String],
  judges: [String],
  chair: String,
  ballot_key: String
};

Results = new Meteor.Collection('results');
Results.schema = {
  round: Number,
  pairing: String,
  team: String,
  points: Number,
  scores: [Number]
};
