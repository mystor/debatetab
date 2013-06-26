module(function() {
  var math = module('math');
  var ordinal = module('ordinal');

  Template.t_team_results.helpers({
    teamInfos: function() {
      var roundCount = DebateTab.tournament('round');
      var roomSize = DebateTab.tournament('room_size');

      var teams = Teams.find({ tournament: DebateTab.tournament('_id') }).fetch();
      var teamInfos = _.map(teams, function(team) {
        var t_results = Results.find({
          tournament: DebateTab.tournament('_id'),
          team: team._id
        }).fetch();

        var points = [];
        var scores = [];

        // Get the points & scores from the results
        _.each(t_results, function(result) {
          points[result.round-1] = result.points;

          if (result.scores) {
            scores[result.round-1] = math.sum(result.scores);
          }
        });

        var dispPoints = points.slice(0);
        var dispScores = scores.slice(0);

        // Fill unknown values with '?'
        for (var i=0; i<roundCount; i++) {
          if (typeof dispPoints[i] === 'undefined')
            dispPoints[i] = '';
          else
            dispPoints[i] = ordinal(roomSize - dispPoints[i]);

          if (typeof dispScores[i] === 'undefined')
            dispScores[i] = '';
          else
            dispScores[i] = ''+dispScores[i]; // Cast to string
        }

        var netPoints = math.sum(points);
        var meanScore = math.mean(scores);
        var stdev = math.stdev(scores);

        return {
          school: team.school,
          name: team.name,
          dispPoints: dispPoints,
          dispScores: dispScores,
          points: points,
          scores: scores,
          netPoints: netPoints,
          meanScore: meanScore,
          stdev: stdev
        };
      });

      // Sort the team infos
      teamInfos.sort(function(a, b) {
        if (a.netPoints !== b.netPoints) {
          return a.netPoints - b.netPoints;
        } else if (Math.abs(a.meanScore - b.meanScore) > 0.00001) {
          return a.meanScore - b.meanScore; 
        } else if (Math.abs(a.stdev - b.stdev) > 0.00001) {
          return -(a.stdev - b.stdev); // We want this sorted with low being better
        } else {
          // Our other methods have failed us...
          var minScoreSize = Math.min(a.scores.length, b.scores.length);
          var maxDrops = Math.floor((minScoreSize - 1) / 2);
          for (var i=0; i<maxDrops; i++) {
            var aHilodrop = math.hilodrop(a.scores, i);
            var bHilodrop = math.hilodrop(b.scores, i);
            
            if (Math.abs(aHilodrop - bHilodrop) > 0.00001) {
              return aHilodrop - bHilodrop;
            }
          }
          
          // Everything is the bloody same!!!
          return 0;
        }
      }).reverse();

      return teamInfos;
    },
    roundCount: function() {
      return DebateTab.tournament('round');
    }
    
  });
});
