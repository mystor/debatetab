var scoreDeps = new Deps.Dependency();

/*
 * Helpers for displaying parts of the display
 * This is relatively minimalistic, as jQuery is used to keep most
 * of the UI up to date, due to the frequency of changes, and problems with 
 * re-rendering everything
 */

Template.ballot_form.helpers({
  posSlug: function(posNum) {
    return DebateTab.tournament('positions')[posNum].slug;
  },
  posClass: function(posNum) {
    var isProp = DebateTab.tournament('positions')[posNum].slug;
    return isProp ? 'label-info' : 'label-danger';
  }
});

Template.ballot_form.events({
  'change .score-box': function(e, tmpl) {
    /* Ensure that a change to the number field will cause updates */
    scoreDeps.changed();
  }
});

/*
 * This function will automatically run whenever things change.  It always returns an empty
 * string.  Thus the page shouldn't actually re-render, however, it is useful for ensuring
 * that the function only computes when this template is visible.
 */

Template.ballot_form_autorun.autorun = function(pairing) {
  
  var ordinal = module('ordinal');

  scoreDeps.depend();
  if (!pairing) {return;}

  var team_size = DebateTab.tournament('team_size');

  // Get the scores for each team
  var teamScores = _.map(pairing.teams, function(team) {
    var teamScore = 0;

    for (var i=0; i<team_size; i++) {
      var val = $('input[name='+team._id+'-'+i+']').val();
      if (val) {
        try {
          var score = parseFloat(val);
          teamScore += score;
        } catch (e) {}
      }
    }

    return {
      score: teamScore,
      id: team._id
    }
  });

  // Sort the scores
  teamScores.sort(function(a, b) {
    return a.score - b.score;
  });

  // Give each score a rank
  var roomSize = DebateTab.tournament('room_size');
  _.each(teamScores, function(score, index) {
    var place = roomSize - index;

    score.place = ordinal(place);
  });

  $('#ballot-submit').removeAttr('disabled');

  // Correctly mark ties
  for (var i=0; i<(teamScores.length -1); i++) {
    if (teamScores[i].score === teamScores[i+1].score) {
      teamScores[i].place = 'TIE';
      teamScores[i + 1].place = 'TIE';
      $('#ballot-submit').attr('disabled', 'disabled');
    }
  }

  // Place the information back into the DOM
  _.each(teamScores, function(score) {
    $('#'+score.id+'-score').html(score.score);
    $('#'+score.id+'-place').html(score.place);

    if (score.place === 'TIE') {
      $('#'+score.id+'-place').addClass('label-danger');
      $('#'+score.id+'-place').removeClass('label-success');
    } else {
      $('#'+score.id+'-place').addClass('label-success');
      $('#'+score.id+'-place').removeClass('label-danger');
    }
  });

  return '';
};

/*
 * This is called once, when the form is first rendered.
 * It is placed on a sub-template such that it isn't called when the
 * {{#isolate}}d ballot_form_autorun is re-rendered
 */
Template.ballot_form_rendered.rendered = function() {
  var tournament = DebateTab.tournament();
  var default_start_score = Math.round((tournament.max_score + tournament.min_score) / (2 * tournament.score_inc)) * tournament.score_inc;

  // Set up each of the sliders
  $('.noUiSlider').each(function(index) {
    var slider = $(this);
    var id = slider.data('id');

    // Check if it already has a value
    var start_score = parseFloat($('input[name='+id+']').val()) || default_start_score;

    slider.noUiSlider({
      range: [tournament.min_score, tournament.max_score],
      start: start_score,
      handles: 1,
      step: tournament.score_inc,
      connect: 'lower',
      serialization: { // Write out the value to the number inputs
        to: [$('input[name='+id+']')],
        resolution: tournament.score_inc
      },
      slide: function() {
        scoreDeps.changed();
      }
    });

    scoreDeps.changed();
  });
}
