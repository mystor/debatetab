module(function() {
  var tournamentTypes = module('tournament_types');

  Template.create_tournament.helpers({
    tournamentTypes: function () {
      return tournamentTypes;
    },
    currentTournament: function() {
      for (var i in tournamentTypes) {
        var type = tournamentTypes[i];

        if (type.name === Session.get('tournamentType')) {
          return type;
        }
      }
    },
    thisTournament: function(name) {
      return Session.equals('tournamentType', name);
    }
  });

  Template.create_tournament.events({
    "change select[name=type]": function (e, tmpl) {
      e.preventDefault();

      // Switch the currently selected tournament type
      Session.set('tournamentType', tmpl.find('select[name=type]').value);
    },
    "submit #create_form": function(e, tmpl) {
      e.preventDefault();

      // Parse the form out
      var form = e.currentTarget;
      var arrays = $(form).serializeArray();
      var doc = {};

      _.each(arrays, function(pair) {
        doc[pair.name] = pair.value;
      });

      // Call the method on the server
      console.log(doc);
      Meteor.call('createTournament', doc, function(err, res) {
        if (err) {
          Modal.throw_err({
            short: '',
            long: err.reason
          });
        } else {
          // Redirect to the tournament's overview
          // TODO: Determine why this isn't working
          Meteor.Router.to('overview', res);
        }
      });
    }
  });

  Template.create_tournament.rendered = function () {
    // Select british parliamentary by default
    Session.setDefault('tournamentType', 'British Parliamentary');
  };
});