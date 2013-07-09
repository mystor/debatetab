Modal.TeamsAdd = {
  title: 'Add Team',
  template: 'team_add_modal'
};

Template.team_add_modal.events({
  'submit #add-form': function(e, tmpl) {
    e.preventDefault();

    // Get the fields
    var form = e.currentTarget;

    var parser = module('team_edit_form');
    var doc = parser.parse(form);

    doc.tournament = DebateTab.tournament('_id');

    Teams.insert(doc);
    form.reset();
  },
  'click #done-btn': function(e, tmpl) {
    e.preventDefault();

    Modal.hide();
  }
});
