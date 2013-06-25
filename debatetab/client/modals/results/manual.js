Modal.ResultsManual = {
  title: 'Manual Results Control',
  template: 'results_manual_modal'
};

module(function() {
  Template.results_manual_modal.helpers({
    uploadsSupported: function() {
      return FileReader !== undefined;
    }
  });

  Template.results_manual_modal.events({
    'click a[name=csv-download]': function(e, tmpl) {
      e.preventDefault();

      Meteor.call('requestResultCSV', 
        DebateTab.tournament('_id'), 
        DebateTab.round(), 
        function(err, result) {
          if (err) {
            Modal.throw_err(err);
          } else {
            location.href = Meteor.absoluteUrl('download/'+result);
          }
      });
    },
    'click button[name=csv-upload]': function(e, tmpl) {
      e.preventDefault();

      // Read the file in
      var fileInput = tmpl.find('input[name=csv-file]');
      var file = fileInput.files[0];
      if (!file) {
        return;
      }
      var reader = new FileReader();

      reader.onerror = function() {
        Modal.throw_err({
          short: 'File Read Error',
          long: reader.error
        });
      };
      reader.onload = function() {
        try {
          var csv = Csv.toArrays(reader.result);

          try {
            var results = parseResults(csv);

            Meteor.call('loadResults', results,
              DebateTab.tournament('_id'),
              DebateTab.round(), function(err, result) {
                if (err) {
                  Modal.throw_err({
                    short: 'Validation Error',
                    long: err.reason
                  });
                } else {
                  Modal.hide();
                }
            });
          } catch (e) {
            console.log(e);
            Modal.throw_err({
              short: 'Bad Format',
              long: e
            });
          }
        } catch (e) {
          Modal.throw_err({
            short: 'Malformed CSV',
            long: 'Check CSV formatting & line endings'
          });
        }
      };
      reader.readAsText(file);
    }
  });

  var reverse = module('reverse');

  var parseResults = function(csv) {
    // Helper Values
    var ROOM = 0;
    var TEAM = 1;
    var SPEAKER = 2;
    var SCORE = 3;

    // Remove the header
    csv.shift();

    // Ensure no repeats
    var used_rooms = {};
    var used_teams = {};

    var results = [];
    var result = {
      scores: []
    };

    var current_pairing = {
      teams: []
    }; 

    _.each(csv, function(row, index) {
      var rowNum = index + 2;

      // handle room changing
      if ($.trim(row[ROOM])) {
        // We are entering a new pairing
        var room = reverse.room(row[ROOM]);
        if (room) {
          if (!(room._id in used_rooms)) {
            used_rooms[room._id] = true;

            // Try to load the pairing
            current_pairing = Pairings.findOne({
              tournament: DebateTab.tournament('_id'),
              room: room._id,
              round: DebateTab.round()
            });

            if (!current_pairing) {
              throw 'Room in row '+rowNum+' is not in a pairing';
            }
          } else {
            throw 'Room in row '+rowNum+' is already in use';
          }
        } else {
          throw 'Room in row '+rowNum+' does not exist';
        }
      }

      // Handle team changing
      if ($.trim(row[TEAM])) {
        var team = reverse.team(row[TEAM]);
        if (team) {
          if (!(team._id in used_teams)) {
            used_teams[team._id] = true;

            if (_.indexOf(current_pairing.teams, team._id) !== -1) {
              result = {
                pairing: current_pairing._id,
                team: team,
                scores: []
              };
              results.push(result);
            } else {
              throw 'Team in row '+rowNum+' is not in pairing';
            }
          } else {
            throw 'Team in row '+rowNum+' is already in use';
          }
        } else {
          throw 'Team in row '+rowNum+' does not exist';
        }
      }

      
      // Handle score reading
      if ($.trim(row[SPEAKER])) {
        var speaker = reverse.speaker(result.team, row[SPEAKER]);
        if (speaker !== -1) {
          // Check if this speaker has already been used
          if (typeof result.scores[speaker] === 'undefined') {
            if ($.trim(row[SCORE])) {
              try {
                var score = parseFloat($.trim(row[SCORE]));
                result.scores[speaker] = score;
              } catch (e) {
                throw 'Score in row '+rowNum+' is not a number';
              }
            }
          } else {
            throw 'Speaker in row '+rowNum+' is already in use';
          }
        } else {
          throw 'Speaker in row '+rowNum+' does not exist';
        }
      }
    });

    var pairings = {};
    _.each(results, function(result) {
      // Split teams into groups based on pairings
      if (_.isArray(pairings[result.pairing])) {
        pairings[result.pairing].push(result);
      } else {
        pairings[result.pairing] = [result];
      }

      // Convert `team` into a property
      result.team = result.team._id;
    });

    // Sort these pairings' teams
    _.each(pairings, function(pairing_results, key) {
      // Check the number of teams in the pairing
      if (pairing_results.length !== DebateTab.tournament('room_size')) {
        throw 'A room has the wrong number of teams ('+pairing_results.length+')';
      }

      // Check the number of speakers in each result
      var has_scores = pairing_results[0].scores.length ? true : false;
      _.each(pairing_results, function(result) {
        if (has_scores) {
          if (result.scores.length !== DebateTab.tournament('team_size')) {
            throw 'A team has the wrong number of scores ('+result.scores.length+')';
          }
        } else {
          if (result.scores.length !== 0) {
            throw 'A team has the wrong number of scores ('+result.scores.length+')';
          }
        }
      });

      if (!has_scores) {
        // Remove these results from the results array
        _.each(pairing_results, function(result) {
          var index = _.indexOf(results, result);
          results.splice(index, 1);
        });
      }
    });

    console.log(results);
    return results;
  };
});
