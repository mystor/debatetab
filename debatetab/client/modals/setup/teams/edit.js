Modal.TeamsEdit = {
  title: 'Edit Team',
  template: 'teams_edit_modal'
};

Template.teams_edit_modal.helpers({
  team: function() {
    console.log(Session.get('editing'));
    console.log(Teams.findOne({
      tournament: DebateTab.tournament('_id'),
      _id: Session.get('editing')
    }));
    return Teams.findOne({
      tournament: DebateTab.tournament('_id'),
      _id: Session.get('editing')
    });
  }
});

Template.teams_edit_modal.events({
  'submit #edit-form': function(e, tmpl) {
    e.preventDefault();

    var form = e.currentTarget;

    var parser = module('team_edit_form');
    var doc = parser.parse(form);

    Teams.update({ _id: Session.get('editing') }, {
      $set: doc
    });

    Modal.hide();
  }
});
