Modal.RoomsAdd = {
  title: 'Add Room',
  template: 'room_add_modal'
};

Template.room_add_modal.events({
  'submit #add-form': function(e, tmpl) {
    e.preventDefault();

    // Get the fields
    var form = e.currentTarget;

    var parser = module('room_edit_form');
    var doc = parser.parse(form);

    doc.tournament = DebateTab.tournament('_id');

    Rooms.insert(doc);
    form.reset();
  },
  'click #done-btn': function(e, tmpl) {
    e.preventDefault();

    Modal.hide();
  }
});
