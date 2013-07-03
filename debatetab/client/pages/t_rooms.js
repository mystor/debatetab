Template.t_rooms.helpers({
  rooms: function() {
    return Rooms.find({
      tournament: DebateTab.tournament('_id')
    });
  },
  roomsLoaded: function() {
    return Subs.isReady('rooms');
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
