Template.pairings_swap_controlbar.helpers({
  is_holding: function() {
    return !_.isEmpty(Session.get('holding'));
  },
  held_icon: function() {
    var holding = Session.get('holding');
    if (!_.isEmpty(holding)) {
      if (holding.type === 'team') {
        return 'icon-group';
      } else if (holding.type === 'judge') {
        return 'icon-legal';
      } else if (holding.type === 'room') {
        return 'icon-map-marker';
      }
    }
  },
  held_name: function() {
    var holding = Session.get('holding');
    if (!_.isEmpty(holding)) {
      if (holding.type === 'team') {
        var team = Teams.findOne({_id: holding._id});
        return '[' + team.school + '] ' + team.name;
      } else if (holding.type === 'judge') {
        var judge = Judges.findOne({_id: holding._id});
        return '[' + judge.school + '] ' + judge.name;
      } else if (holding.type === 'room') {
        return Rooms.findOne({_id: holding._id}).name;
      }
    }
  }
});

Template.pairings_swap_controlbar.events({
  'click #drop-ctrl, tap #drop-ctrl': function(e, tmpl) {
    e.preventDefault();

    Session.set('holding', {});
  },
  'click #done-ctrl, tap #done-ctrl': function(e, tmpl) {
    e.preventDefault();

    Session.set('holding', {});
    Session.set('swapping', false);
  }
});
