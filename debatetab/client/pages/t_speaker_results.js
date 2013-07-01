module(function() {
  var math = module('math');
  var ordinal = module('ordinal');

  var speakerInfosDeps = new Deps.Dependency();
  var speakerInfos = [];

  var pageShowingDeps = new Deps.Dependency();
  var pageShowing = false;

  Template.t_speaker_results.helpers({
    speakerInfos: function() {
      speakerInfosDeps.depend();
      return speakerInfos;
    },
    roundCount: function() {
      return DebateTab.tournament('round');
    }
  });

  Template.t_speaker_results.rendered = function() {
    if (pageShowing === false) {
      pageShowing = true;
      pageShowingDeps.changed();
    }
  };

  Deps.autorun(function() {
    console.log('foo');
    if (Meteor.Router.page() === 't_speaker_results') {
      // Ensure that the page is already showing
      pageShowingDeps.depend();
      if (!pageShowing) { return; }

      var roundCount = DebateTab.tournament('round');
      var roomSize = DebateTab.tournament('room_size');
      var teamSize = DebateTab.tournament('team_size');

      var teams = Teams.find({ tournament: DebateTab.tournament('_id') }).fetch();

      // Clear the speakerInfos object
      speakerInfos = [];
      _.each(teams, function(team) {
        var t_results = Results.find({
          tournament: DebateTab.tournament('_id'),
          team: team._id
        }).fetch();

        _.each(team.speakers, function(speaker, index) {
          var scores = [];

          // Get the scores from the results
          _.each(t_results, function(result) {
            if (result.scores)
              scores[result.round-1] = result.scores[index];
          });

          // Generate displayable scores
          var dispScores = scores.slice(0);
          for (var i=0; i<roundCount; i++) {
            if (typeof dispScores[i] === 'undefined')
              dispScores[i] = '';
            else
              dispScores[i] = ''+dispScores[i]; // Cast to string
          }

          var meanScore = math.mean(scores);
          var stdev = math.stdev(scores);

          speakerInfos.push({
            school: team.school,
            team: team.name,
            name: speaker.name,
            flags: speaker.flags,
            dispScores: dispScores,
            scores: scores,
            meanScore: meanScore,
            stdev: stdev
          });
        });
      });

      // Sort the speaker infos
      speakerInfos.sort(function(a, b) {
        if (Math.abs(a.meanScore - b.meanScore) > 0.00001) {
          return a.meanScore - b.meanScore;
        } else if (Math.abs(a.stdev - b.stdev) > 0.00001) {
          return -(a.stdev - b.stdev); // We want this sorted with low being better
        } else {
          // Other methods have failed - used hilodrops
          var minScoreSize = Math.min(a.scores.length, b.scores.length);
          var maxDrops = Math.floor((minScoreSize - 1) / 2);
          for (var i=0; i<maxDrops; i++) {
            var aHilodrop = math.hilodrop(a.scores, i);
            var bHilodrop = math.hilodrop(b.scores, i);

            if (Math.abs(aHilodrop - bHilodrop) > 0.00001) {
              return aHilodrop - bHilodrop;
            }
          }

          // Everything is the bloody same
          return 0;
        }
      }).reverse();

      // Give each speaker info a rank
      _.each(speakerInfos, function(speakerInfo, index) {
        speakerInfo.rank = index + 1;
      });

      speakerInfosDeps.changed();
    } else if (pageShowing === true) {
      pageShowing = false;
      pageShowingDeps.changed();
    }
  });
});
