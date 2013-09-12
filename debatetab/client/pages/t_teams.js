Template.t_teams.helpers({
  teams: function() {
    var regex = module('regex');

    var $regex = {
      $regex: regex.clean(Session.get('search')),
      $options: 'i'
    };
    return Teams.find({
      tournament: DebateTab.tournament('_id'),
      $or: [
        {name: $regex},
        {school: $regex},
        {
          speakers: {
            $elemMatch: {
              name: $regex
            }
          }
        }
      ]
    });
  },
  teamsLoaded: function() {
    return Subs.isReady('teams');
  }
});

Template.t_teams.events({
  'click .team-edit-btn': function(e, tmpl) {
    e.preventDefault();

    // Get the team's ID
    var teamId = $(e.currentTarget).data('id');
    Session.set('editing', teamId);

    // Show the modal
    Modal.show(Modal.TeamsEdit);
  }
});
