Modal.ViewRFD = {
  title: 'Reason for Decision',
  template: 'view_rfd_modal'
};

Template.view_rfd_modal.helpers({
  rfd: function() {
    var pairing = Pairings.findOne({
      _id: Session.get('viewing')
    });

    if (pairing) { return pairing.rfd }
  }
});
