Deps.autorun(function() {
  // Handle hiding and showing the modal
  if (!_.isEmpty(Session.get('modal'))) {
    $('#modal').modal('show');
    Session.set('modal-display', Session.get('modal'));
  } else {
    $('#modal').modal('hide');
  }
});

Template.modal.events({
  'click #close-modal': function(e, tmpl) {
    e.preventDefault();

    Session.set('modal', {});
  }
});

Template.modal.helpers({
  lockOpen: function() {
    var modal = Session.get('modal-display') || {};

    return modal.lockOpen;
  },
  title: function() {
    var modal = Session.get('modal-display') || {};

    return modal.title;
  },
  content: function() {
    var modal = Session.get('modal-display') || {};
    var tmpl = Template[modal.template];

    if (_.isFunction(tmpl))
      return new Handlebars.SafeString(tmpl());
  }
});
