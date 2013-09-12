Template.t_judges.helpers({
  judges: function() {
    var regex = module('regex');

    var $regex = {
      $regex: regex.clean(Session.get('search')),
      $options: 'i'
    };

    return Judges.find({
      tournament: DebateTab.tournament('_id'),
      $or: [
        {school: $regex},
        {name: $regex}
      ]
    });
  },
  judgesLoaded: function() {
    return Subs.isReady('judges');
  }
});

Template.t_judges.events({
  'click #add-ctrl': function(e, tmpl) {
    e.preventDefault();

    Modal.show(Modal.JudgesAdd);
  },
  'click .judge-edit-btn': function(e, tmpl) {
    e.preventDefault();

    var judgeId = $(e.currentTarget).data('id');
    Session.set('editing', judgeId);

    Modal.show(Modal.JudgesEdit);
  }
});
