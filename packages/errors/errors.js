Meteor.Errors = {
  _collection: new Meteor.Collection(null),

  display: function(name, message, level) {
    var level_class;
    switch (level) {
      case 'error':
        level_class = 'alert-danger';
        break;
      case 'warning':
        level_class = '';
        break;
      case 'info':
        level_class = 'alert-info';
        break;
      case 'success':
        level_class = 'alert-success';
        break;
      default:
        level_class = '';
    }

    if (_.isObject(name)) {
      message = name.message || '';
      name = name.name || '';
    } else {
      name = name || '';
      message = message || '';
    }

    Meteor.Errors._collection.insert({
      message: message,
      name: name,
      level_class: level_class,
      seen: false
    });
  },

  error: function(name, message) {
    Meteor.Errors.display(name, message, 'error');
  },

  warning: function(name, message) {
    Meteor.Errors.display(name, message, 'warning');
  },

  info: function(name, message) {
    Meteor.Errors.display(name, message, 'info');
  },

  success: function(name, message) {
    Meteor.Errors.display(name, message, 'success');
  },

  clear: function() {
    Meteor.Errors._collection.remove({seen: true});
  }
};

