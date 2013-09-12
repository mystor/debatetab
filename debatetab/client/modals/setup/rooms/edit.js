Modal.RoomsEdit = {
  title: 'Edit Room',
  template: 'room_edit_modal'
};

Template.room_edit_modal.helpers({
  team: function() {
    return Rooms.findOne({
      tournament: DebateTab.tournament('_id'),
      _id: Session.get('editing')
    });
  }
});

Template.teams_edit_modal.events({
  'submit #edit-form': function(e, tmpl) {
    e.preventDefault();

    var form = e.currentTarget;

    var parser = module('room_edit_form');
    var doc = parser.parse(form);

    Rooms.update({ _id: Session.get('editing') }, {
      $set: doc
    });

    Modal.hide();
  }
});
