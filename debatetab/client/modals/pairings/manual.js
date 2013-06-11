Modal.PairingsManual = {
  title: 'Manual Pairing Control',
  template: 'pairings_manual_modal'
};

Template.pairings_manual_modal.helpers({
  uploadsSupported: function() {
    return FileReader !== undefined;
  }
});
