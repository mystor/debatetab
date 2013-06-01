Template.modal_dialog.helpers({
  show_modal: function() {
    return Session.get('list_display_modal');
  },
  modal_header: function() {
    // List Modal Header is a template object
    return Session.get('list_modal_header')();
  },
  modal_body: function() {
    return Session.get('list_modal_body')();
  },
  modal_footer: function() {
    return Session.get('list_modal_footer')();
  }
});
