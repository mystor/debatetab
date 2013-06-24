// Mark dependency on scores changing
var scoreDeps = new Deps.Dependency();

// TODO: Make get the correct pairing
var getPairing = function() {
  return Pairings.findOne();
};

Template.t_ballot.helpers({
  teams: function() {
    // Returns the list of teams from the pairing
    var pairing = getPairing();
    if (pairing) {
      return _.map(pairing.teams, function(team_id) {
        return Teams.findOne({_id: team_id});
      });
    }
  },
  posSlug: function(posNum) {
    // Returns the slug for the position posNum
    return DebateTab.tournament('positions')[posNum].slug;
  },
  posClass: function(posNum) {
    // Returns the class for the position posNum
    var isProp = DebateTab.tournament('positions')[posNum].prop;
    return isProp ? 'label-info' : 'label-danger';
  },
  ballotLoaded: function() {
    return Subs.isReady('ballot');
  }
});

Deps.autorun(function() {
  if (Meteor.Router.page() === 't_ballot') {
    // Depend on the score dependency
    // This means this will be recomputed when scores change
    scoreDeps.depend();

    // Get the pairings
    var pairing = getPairing();
    if (!pairing) {return;}


    // Get the scores for each team
    var teamScores = _.map(pairing.teams, function(team) {
      var teamScore = 0;
      for (var i=0; i<2; i++) { // TODO: Change to team_size
        var val = $('input[name='+team+'-'+i+']').val();
        if (val) {
          // Try to make it a number
          try {
            var score = parseFloat(val);
            teamScore += score;
          } catch (e) {
            // Ignore
          }
        }
      }

      return {
        score: teamScore,
        id: team
      };
    });

    // Sort lowest score to highest score
    teamScores.sort(function(a, b) {
      return a.score - b.score;
    });

    // Assign positions
    var roomSize = DebateTab.tournament('room_size');
    _.each(teamScores, function(score, index) {
      var place = roomSize - index;
      switch (place % 10) {
        case 1:
          score.place = place+'st';
          break;
        case 2:
          score.place = place+'nd';
          break;
        case 3:
          score.place = place+'rd';
          break;
        default:
          score.place = place+'th';
          break;
      }
    });

    // Enable submit button
    $('#ballot-submit').removeAttr('disabled');

    // Mark ties as ties
    for (var i=0; i<(teamScores.length - 1); i++) {
      if (teamScores[i].score === teamScores[i+1].score) {
        teamScores[i].place = 'TIE';
        teamScores[i+1].place = 'TIE';
        $('#ballot-submit').attr('disabled', 'disabled');
      }
    }

    // Set the labels
    _.each(teamScores, function(score) {
      $('#'+score.id+'-score').html(score.score);
      $('#'+score.id+'-place').html(score.place);

      // Color labels red if it is a tie
      if (score.place === 'TIE') {
        $('#'+score.id+'-place').addClass('label-danger');
        $('#'+score.id+'-place').removeClass('label-success');
      } else {
        $('#'+score.id+'-place').addClass('label-success');
        $('#'+score.id+'-place').removeClass('label-danger');
      }
    });
  }
});

Template.t_ballot.events({
  'submit #ballot-form': function(e, tmpl) {
    e.preventDefault();
    var form = e.currentTarget;

    console.log($(form).serializeArray());
  },
  'change .score-box': function(e, tmpl) {
    scoreDeps.changed();
  }
});

Template.t_ballot.rendered = function() {
  $('.noUiSlider').each(function(index) {
    var slider = $(this);
    var id = slider.data('id');
    slider.noUiSlider({
      range: [35, 45],
      start: 38.5,
      handles: 1,
      step: 0.5,
      connect: 'lower',
      serialization: {
        to: [$('input[name='+id+']')],
        resolution: 0.5
      },
      slide: function() {
        scoreDeps.changed();
      }
    });

    scoreDeps.changed();
  });
};
