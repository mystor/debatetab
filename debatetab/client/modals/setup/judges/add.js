Modal.JudgesAdd = {
  title: 'Add Judge',
  template: 'judge_add_modal'
};

Template.judge_add_modal.events({
  'submit #add-form': function(e, tmpl) {
    e.preventDefault();

    // Get the fields
    var form = e.currentTarget;

    var parser = module('room_edit_form');
    var doc = parser.parse(form);

    doc.tournament = DebateTab.tournament('_id');

    Judges.insert(doc);
    form.reset();
  },
  'click #done-btn': function(e, tmpl) {
    e.preventDefault();

    Modal.hide();
  }
});
