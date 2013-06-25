Template.tournament_list.helpers({
  tournaments: function() {
    return Tournaments.find();
  }
});
