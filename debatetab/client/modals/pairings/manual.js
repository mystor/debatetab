Modal.PairingsManual = {
  title: 'Manual Pairing Control',
  template: 'pairings_manual_modal'
};

Template.pairings_manual_modal.helpers({
  uploadsSupported: function() {
    return FileReader !== undefined;
  }
});

Template.pairings_manual_modal.events({
  'click a[name=csv-download]': function(e, tmpl) {
    e.preventDefault();

    Meteor.call('requestPairingCSV', 
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
          var pairings = parsePairings(csv);

          Meteor.call('loadPairings', pairings,
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

var parsePairings = function(csv) {
  // Helper Values
  var ROOM = 0;
  var TEAM = 1;
  var JUDGE = 2;

  // Remove the header
  csv.shift();

  // Ensure no repeats
  var used_teams = [];
  var used_judges = [];
  var used_rooms = [];

  // Record pairings etc
  var pairings = [];
  var pairing = { // Set teams and judges - this avoids errors
    teams: [],
    judges: []
  };

  _.each(csv, function(row, index) {
    var rowNum = index + 2;
    // Reading a room in the left column!
    // Start a new pairing
    if ($.trim(row[ROOM])) {
      var room = DebateTab.reverse.room(row[ROOM]);
      if (room) {
        // Check if room is in used_rooms
        if (_.indexOf(used_rooms, room._id) === -1) {
          // Create new pairing
          pairing = {
            teams: [],
            judges: [],
            room: room._id
          };
          // Add pairing to arrays
          pairings.push(pairing);
          used_rooms.push(room._id);
        } else {
          throw 'Room in row '+rowNum+' is already in use';
        }
      } else {
        throw 'Room in row '+rowNum+' does not exist';
      }
    }

    // Read in a team
    if ($.trim(row[TEAM])) {
      var team = DebateTab.reverse.team(row[TEAM]);
      if (team) {
        // Check if team is in use
        if (_.indexOf(used_teams, team._id) === -1) {
          pairing.teams.push(team._id);
          used_teams.push(team._id);
        } else {
          throw 'Team in row '+rowNum+' is already in use';
        }
      } else {
        throw 'Team in row '+rowNum+' does not exist';
      }
    }
    
    // Read in a judge
    if ($.trim(row[JUDGE])) {
      var judge = DebateTab.reverse.judge(row[JUDGE]);
      if (judge) {
        // Check if judge is in use
        if (_.indexOf(used_judges, judge._id) === -1) {
          pairing.judges.push(judge._id);
          if (!pairing.chair) {
            pairing.chair = judge._id;
          }
          used_judges.push(judge._id);
        } else {
          throw 'Judge in row '+rowNum+' is already in use';
        }
      } else {
        throw 'Judge in row '+rowNum+' does not exist';
      }
    }
  });

  // Check to ensure that pairings are all good
  _.each(pairings, function(pairing, index) {
    // Check number of teams in each room
    if (pairing.teams.length !== DebateTab.tournament('room_size')) {
      throw 'Pairing #'+(index + 1)+' has the wrong number of teams';
    }
    if (pairing.judges.length === 0) {
      throw 'Pairing #'+(index + 1)+' has no judges';
    }
  });

  return pairings;
};
