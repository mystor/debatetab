module(function() {

  Template.t_pairings.helpers({
    /*
     * Getter Functions for Teams/Rooms/Judges
     */
    team_name: function(_id) {
      return Teams.findOne({_id: _id}).name;
    },
    team_school: function(_id) {
      return Teams.findOne({_id: _id}).school;
    },
    room_name: function(_id) {
      return Rooms.findOne({_id: _id}).name;
    },
    room_find_url: function(_id) {
      return Rooms.findOne({_id: _id}).find_url;
    },
    judge_name: function(_id) {
      return Judges.findOne({_id: _id}).name;
    },
    judge_school: function(_id) {
      return Judges.findOne({_id: _id}).school;
    },

    position_slug: function(position) {
      return DebateTab.tournament('positions')[position].slug;
    },
    position_class: function(position) {
      return DebateTab.tournament('positions')[position].prop ? 'label-info' : 'label-danger';
    },
    /*
     * LIST OF PAIRINGS
     */
    pairings: function() {
      var $regex = {
        $regex: Meteor.Regex.clean(Session.get('search')),
        $options: 'i'
      };
      // Find any teams which match the search query
      var teams = _.map(Teams.find({
        tournament: DebateTab.tournament('_id'),
        $or: [
          {name: $regex},
          {school: $regex},
          {
            speakers: {
              $elemMatch: {
                name: $regex
              }
            }
          }
        ]
      }).fetch(), function(team) {return team._id;});

      var rooms = _.map(Rooms.find({
        tournament: DebateTab.tournament('_id'),
        name: $regex
      }).fetch(), function(room) {return room._id;});

      var judges = _.map(Judges.find({
        tournament: DebateTab.tournament('_id'),
        $or: [
          {name: $regex},
          {school: $regex}
        ]
      }).fetch(), function(judge) {return judge._id;});

      var pairings = Pairings.find({
        tournament: DebateTab.tournament('_id'),
        round: DebateTab.round(),
        $or: [
          {
            $where: function() {
              return !_.isEmpty(_.intersection(this.teams, teams));
            }
          },
          {
            $where: function() {
              return !_.isEmpty(_.intersection(this.judges, judges));
            }
          },
          {
            room: {
              $in: rooms
            }
          }
        ]
      });
      // console.log(pairings.fetch());
      return pairings;
    },

    swapping: function() {
      return Session.get('swapping');
    },
    holding_judge: function() {
      var holding = Session.get('holding');
      return (Session.get('swapping') && 
              !_.isEmpty(holding) && 
              holding.type === 'judge' &&
              !holding.chair);
    },

    // MAKE CHAIRS BOLD
    chair_class: function(judge, chair) {
      if (judge === chair) {
        return 'judge-chair';
      }
    },
    /*
     * MOBILE DISPLAY ONLY TEAMS/JUDGES
     * BASED ON SESSION VARAIBLE
     */
    team_active: function() {
      return Session.equals('pairings_show', 'teams') ? 'active' : '';
    },
    judge_active: function() {
      return Session.equals('pairings_show', 'judges') ? 'active': '';
    }
  });

  Template.t_pairings.events({
    /*
     * SWAPPING - DETECT CLICKS ON PAIRING ELEMENTS
     */
    'click .room': function(e, tmpl) {
      e.preventDefault();

      if (!Session.get('swapping')) {
        return;
      }

      var element = e.currentTarget;
      var _id = element.dataset.id;
      var pairing_id = element.dataset.pairingid;

      var holding = Session.get('holding');
      if (_.isEmpty(holding)) {
        Session.set('holding', {
          _id: _id,
          pairing: pairing_id,
          type: 'room'
        });
      } else if (holding.type === 'room') {
        var a_pairing = Pairings.findOne({_id: pairing_id});
        var b_pairing = Pairings.findOne({_id: holding.pairing});
        
        Pairings.update({_id: a_pairing._id}, {$set: {room: holding._id}});
        Pairings.update({_id: b_pairing._id}, {$set: {room: _id}});

        Session.set('holding', {});
      }
    },
    'click .team': function(e, tmpl) {
      e.preventDefault();

      if (!Session.get('swapping')) {
        return;
      }

      var element = e.currentTarget;
      var _id = element.dataset.id;
      var pairing_id = element.dataset.pairingid;

      var holding = Session.get('holding');
      if (_.isEmpty(holding)) {
        Session.set('holding', {
          _id: _id,
          pairing: pairing_id,
          type: 'team'
        });
      } else if (holding.type === 'team') {
        var a_pairing = Pairings.findOne({_id: pairing_id});
        var b_pairing = Pairings.findOne({_id: holding.pairing});
        
        var a_index = _.indexOf(a_pairing.teams, _id);
        var b_index = _.indexOf(b_pairing.teams, holding._id);

        var a_update = {
          $set: {}
        };
        a_update.$set['teams.'+a_index] = holding._id;

        var b_update = {
          $set: {}
        };
        b_update.$set['teams.'+b_index] = _id;

        Pairings.update({_id: a_pairing._id}, a_update);
        Pairings.update({_id: b_pairing._id}, b_update);

        Session.set('holding', {});
      }
    },
    'click .judge': function(e, tmpl) {
      e.preventDefault();

      if (!Session.get('swapping')) {
        return;
      }

      var element = e.currentTarget;
      var _id = element.dataset.id;
      var pairing_id = element.dataset.pairingid;

      var classes = element.className.split(' ');
      var chair = _.indexOf(classes, 'judge-chair') !== -1;

      var holding = Session.get('holding');
      if (_.isEmpty(holding)) {
        Session.set('holding', {
          _id: _id,
          pairing: pairing_id,
          type: 'judge',
          chair: chair
        });
      } else if (holding.type === 'judge') {
        var a_pairing = Pairings.findOne({_id: pairing_id});
        var b_pairing = Pairings.findOne({_id: holding.pairing});

        var a_index = _.indexOf(a_pairing.judges, _id);
        var b_index = _.indexOf(b_pairing.judges, holding._id);

        var a_update = {
          $set: {}
        };
        a_update.$set['judges.'+a_index] = holding._id;
        if (chair) {
          a_update.$set.chair = holding._id;
        }

        var b_update = {
          $set: {}
        };
        b_update.$set['judges.'+b_index] = _id;
        if (holding.chair) {
          b_update.$set.chair = _id;
        }

        Pairings.update({_id: a_pairing._id}, a_update);
        Pairings.update({_id: b_pairing._id}, b_update);

        Session.set('holding', {});
      }
    },
    'click .empty-judge': function(e, tmpl) {
      e.preventDefault();

      var element = e.currentTarget;
      var pairing_id = element.dataset.pairingid;

      var holding = Session.get('holding');
      var a_pairing = Pairings.findOne({_id: pairing_id});
      var b_pairing = Pairings.findOne({_id: holding.pairing});

      var b_index = _.indexOf(b_pairing.judges, holding._id);

      var a_update = {
        $push: { judges: holding._id }
      };
      var b_update = {
        $pull: { judges: holding._id }
      };

      Pairings.update({_id: b_pairing._id}, b_update);
      Pairings.update({_id: a_pairing._id}, a_update);
      
      Session.set('holding', {});
    },
    // MOBILE ONLY: switch between showing teams and judges
    'click #pairings-select-teams': function(e, tmpl) {
      e.preventDefault();

      Session.set('pairings_show', 'teams');
    },
    'click #pairings-select-judges': function(e, tmpl) {
      e.preventDefault();
      Session.set('pairings_show', 'judges');
    }
  });

  // Require the controlbar module
  var controlbar = module('controlbar');

  Template.t_pairings.rendered = function() {
    controlbar.initAffix();
  };

  Deps.autorun(function() {
    if (Meteor.Router.page() === 't_pairings') {
      if (Session.equals('pairings_show', 'teams')) {
        $('#pairings-table').removeClass('show-judges');
        $('#pairings-table').addClass('show-teams');
      } else {
        $('#pairings-table').removeClass('show-teams');
        $('#pairings-table').addClass('show-judges');
      }
    }
  });
});
