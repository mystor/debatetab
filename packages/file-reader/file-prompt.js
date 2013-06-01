Template.file_prompt.helpers({
  display_prompt: function() {
    return Session.get('display_file_prompt');
  },
  reading_file: function() {
    return Session.get('reading_file');
  }
});

Template.file_prompt.events({
  'submit #file_upload_form': function(e, tmpl) {
    Meteor.FileReader.submit_file_prompt(e, tmpl);
  },
  'click .close, click .cancel_btn': function(e, tmpl) {
    Session.set('display_file_prompt', false);
  }
});
