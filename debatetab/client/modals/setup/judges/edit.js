Modal.JudgesEdit = {
  title: 'Edit Judge',
  template: 'judge_edit_modal'
};

Template.judge_edit_modal.helpers({
  team: function() {
    return Judges.findOne({
      tournament: DebateTab.tournament('_id'),
      _id: Session.get('editing')
    });
  }
});

Template.judge_edit_modal.events({
  'submit #edit-form': function(e, tmpl) {
    e.preventDefault();

    var form = e.currentTarget;

    var parser = module('room_edit_form');
    var doc = parser.parse(form);

    Judges.update({ _id: Session.get('editing') }, {
      $set: doc
    });

    Modal.hide();
  }
});
