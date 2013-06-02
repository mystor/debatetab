Deps.autorun(function() {
  // Handle hiding and showing the modal
  if (!_.isEmpty(Session.get('modal'))) {
    $('#modal').modal('show');
  } else {
    $('#modal').modal('hide');
  }
});

Template.modal.events({
  'tap #close-modal, click #close-modal': function(e, tmpl) {
    e.preventDefault();

    Session.set('modal', {});
  }
});

Template.modal.helpers({
  lockOpen: function() {
    var modal = Session.get('modal') || {};

    return modal.lockOpen;
  },
  title: function() {
    var modal = Session.get('modal') || {};

    return modal.title;
  },
  content: function() {
    var modal = Session.get('modal') || {};
    var tmpl = Template[modal.template];

    if (_.isFunction(tmpl))
      return new Handlebars.SafeString(tmpl());
  }
});
