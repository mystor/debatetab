Template.t_pairings.helpers({
  /*
   * Getter Functions for Teams/Rooms/Judges
   */
  team_name: function(_id) {
    return Teams.findOne({_id: _id}).name;
  },
  team_school: function(_id) {
    return Teams.findOne({_id: _id}).school;
  },
  room_name: function(_id) {
    return Rooms.findOne({_id: _id}).name;
  },
  room_find_url: function(_id) {
    return Rooms.findOne({_id: _id}).find_url;
  },
  judge_name: function(_id) {
    return Judges.findOne({_id: _id}).name;
  },
  judge_school: function(_id) {
    return Judges.findOne({_id: _id}).school;
  },
  // The list or pairings which we are using
  pairings: function() {
    return Pairings.find({
      tournament: DebateTab.tournament('_id'),
      round: DebateTab.round()
    });
  },
  // Make chairs bold
  chair_class: function(judge, chair) {
    if (judge === chair) {
      return 'judge-chair';
    }
  },

  /*
   * MOBILE DISPLAY ONLY TEAMS/JUDGES
   * BASED ON SESSION VARAIBLE
   */
  team_class: function() {
    return Session.equals('pairings_show', 'teams') ? '' : 'hidden-sm';
  },
  judge_class: function() {
    return Session.equals('pairings_show', 'judges') ? '' : 'hidden-sm';
  },
  team_active: function() {
    return Session.equals('pairings_show', 'teams') ? 'active': '';
  },
  judge_active: function() {
    return Session.equals('pairings_show', 'judges') ? 'active': '';
  }
});

Template.t_pairings.events({
  'click #pairings-select-teams, tap #pairings-select-teams': function(e, tmpl) {
    e.preventDefault();

    Session.set('pairings_show', 'teams');
  },
  'click #pairings-select-judges, tap #pairings-select-judges': function(e, tmpl) {
    e.preventDefault();
    Session.set('pairings_show', 'judges');
  }
})
