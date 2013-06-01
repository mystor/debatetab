var MtrFileReader = function() {
  // Set the default values
  Session.setDefault('display_file_prompt', false);
  Session.setDefault('reading_file', false);
  this.callback = null;
};

_.extend(MtrFileReader.prototype, {
  display_file_prompt: function(callback) {
    // Check that the file APIs are avaliable
    if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
      // The file apis are not supported
      alert('Unfortunately, your web browser does not support the HTML 5 file APIs \n' +
        'If you would like to use the upload feature of DebateTab, please use a more modern browser');

      return;
    }

    // Display the file prompt
    Session.set('display_file_prompt', true);
    Session.set('reading_file', false);
    this.callback = callback;
  },
  submit_file_prompt: function(e, tmpl) {
    e.preventDefault();

    var form = e.currentTarget;
    var fileInput = tmpl.find('input[type=file]');

    if (fileInput.files.length < 1)
      return; // A file has to be selected

    var file = fileInput.files[0];
    
    // Reader
    var reader = new FileReader;
    var self = this;

    var data = {
      name: file.name,
      type: file.type,
      size: file.size,
      data: null
    };

    // Pass the data to the callback function
    reader.onload = function() {
      data.data = reader.result;
      self.callback(null, data);

      // Reset the form
      form.reset();
      Session.set('display_file_prompt', false);
      Session.set('reading_file', false):
    };

    reader.onerror = function() {
      self.callback(reader.error);
    };

    // There will only be a single file
    reader.readAsText(file);
    Session.set('reading_file', true);
  }
});

Meteor.FileReader = new MtrFileReader;
