Template.teams_default_controlbar.events({
  'click #manual-ctrl': function(e, tmpl) {
    e.preventDefault();

    // Modal.show(Modal.TeamsManual);
  },
  'click #add-ctrl': function(e, tmpl) {
    e.preventDefault();

    Modal.show(Modal.TeamsAdd);
  }
});
