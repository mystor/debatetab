var getStrategies = function() {
  var teamStrategyId = Session.get('TeamStrategy');
  var judgeStrategyId = Session.get('JudgeStrategy');
  var roomStrategyId = Session.get('RoomStrategy');

  return {
    team: DebateTab.Strategies.Team[teamStrategyId],
    judge: DebateTab.Strategies.Judge[judgeStrategyId],
    room: DebateTab.Strategies.Room[roomStrategyId]
  };
};

var validates = function() {
  var strategies = getStrategies();

  try {
    strategies.team.validate();
    strategies.judge.validate();
    strategies.room.validate();
  } catch (e) {
    return false;
  }

  return true;
};

Template.autopair_controlbar.helpers({
  validates: function() {
    return validates();
  }
});

Template.autopair_controlbar.events({
  'click #autopair-ctrl': function(e, tmpl) {
    e.preventDefault();

    if (!validates()) {
      return;
    }
    
    strategies = getStrategies();

    Meteor.defer(function() {
      pairings = DebateTab.executeStrategies(
        DebateTab.round(), 
        strategies.team,
        strategies.judge,
        strategies.room);

      Meteor.call('loadPairings', pairings, 
        DebateTab.tournament('_id'), 
        DebateTab.round(), function(err, result) {
          if (err) {
            Modal.throw_err({
              short: 'Validation Error',
              long: err.reason
            });
          } else {
            Meteor.Router.to('pairings', 
              DebateTab.tournament('slug'), 
              DebateTab.round()
            );
          }
        }
      );
    });

    Modal.show({
      title: 'Autopairing...',
      template: 'progress_modal'
    });
  }
});
