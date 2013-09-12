Template.t_rooms.helpers({
  rooms: function() {
    var regex = module('regex');
    
    var $regex = {
      $regex: regex.clean(Session.get('search')),
      $options: 'i'
    };

    return Rooms.find({
      tournament: DebateTab.tournament('_id'),
      name: $regex
    });
  },
  roomsLoaded: function() {
    return Subs.isReady('rooms');
  }
});

Template.t_rooms.events({
  'click #add-ctrl': function(e, tmpl) {
    e.preventDefault();

    Modal.show(Modal.RoomsAdd);
  },
  'click .room-edit-btn': function(e, tmpl) {
    e.preventDefault();

    var roomId = $(e.currentTarget).data('id');
    Session.set('editing', roomId);

    Modal.show(Modal.RoomsEdit);
  }
});

Template.t_rooms.rendered = function() {
  $('.find-url-hover').each(function(item) {
    $(this).tooltip({
      placement: 'right',
      trigger: 'hover'
    });
  });
};
