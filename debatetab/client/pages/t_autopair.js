var getStrategy = function(type) {
  return DebateTab.Strategies[type][Session.get(type+'Strategy')];
};

Template.t_autopair.helpers({
  strategies: function(type) {
    return DebateTab.Strategies[type];
  },
  strategy: function(type) {
    return getStrategy(type);
  },
  validate_strategy: function(type) {
    var validation = getStrategy(type).validate;

    if (validation) {
      try {
        validation();
      } catch (e) {
        return e;
      }
    }
  },
  team_strategy_id: function() {
    return Session.get('TeamStrategy');
  },
  judge_strategy_id: function() {
    return Session.get('JudgeStrategy');
  },
  room_strategy_id: function() {
    return Session.get('RoomStrategy');
  }
});

Template.t_autopair.events({
  'change #team_strategy_select': function(e, tmpl) {
    var strategy = parseInt(e.currentTarget.value, 10);

    Session.set('TeamStrategy', strategy);
  },
  'change #judge_strategy_select': function(e, tmpl) {
    var strategy = parseInt(e.currentTarget.value, 10);

    Session.set('JudgeStrategy', strategy);
  },
  'change #room_strategy_select': function(e, tmpl) {
    var strategy = parseInt(e.currentTarget.value, 10);

    Session.set('RoomStrategy', strategy);
  }
});
