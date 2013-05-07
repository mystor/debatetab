Template.meteorErrors.helpers({
  errors: function() {
    return Meteor.Errors._collection.find();
  }
});

Template.meteorError.rendered = function() {
  var error = this.data;

  Meteor.defer(function() {
    Meteor.Errors._collection.update(error._id, {$set: {seen: true}});
  });
};

Template.meteorError.events({
  'click .close': function(e, template) {
    var element_id = template.find('.close').id;
    var id = element_id.substr(6);

    Meteor.Errors._collection.remove({_id: id});
  }
});
