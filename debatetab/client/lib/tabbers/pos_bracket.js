/*
 * Pos-Bracket Tabber
 *
 * Allocates teams into brackets by point totals
 * Promotes from top of bracket
 * Chooses pairings to maximise role diversity within brackets
 * Best judges chair rooms
 * Better rooms = better judges
 * Can generate even sized panels
 * Ignores school
 *
 * author: Michael Layzell
 * version: 0.0.1
 *
 * Designed for DebateTab
 */

/********************
 * HELPER FUNCTIONS *
 ********************/

/*
 * Comparitors
 */
var compare_teams_by_score = function(a, b) {
  var a_score = 0;
  var b_score = 0;

  if (a.aggregate_score) {
    a_score = a.aggregate_score;
  } else {
    a.aggregate_score = a_score = DebateTab.team_get_score(a);
  }

  if (b.aggregate_score) {
    b_score = b.aggregate_score;
  } else {
    b.aggregate_score = b_score = DebateTab.team_get_score(b);
  }

  return a_score - b_score;
};

var compare_teams_by_position_frequency = function(pos) {
  return function(a, b) {
    var a_query = {
      tournament: t_id
    };
    a_query['teams.'+pos] = a._id;

    var b_query = {
      tournament: t_id
    };
    b_query['teams.'+pos] = b._id;

    var a_count = Pairings.find(a_query).count();
    var b_count = Pairings.find(b_query).count();

    return a_count - b_count;
  };
};

/*
 * Action Functions
 */
var generate_brackets = function(teams) {
  var brackets = [];

  _.each(teams, function(team) {
    var points = DebateTab.team_get_points(team);

    // Add the team to the correct bracket
    brackets[points] = brackets[points] || [];
    brackets[points] = team;
  });

  return brackets;
};

var promote_extra = function(from, to, room_size) {
  var extra_teams = from.length % room_size;

  if (extra_teams > 0) {
    to = to || [];
    // Sort by score - we want to promote the `best` in bracket
    from.sort(compare_teams_by_score);

    while (extra_teams > 0) {
      to.push(from.pop());
      extra_teams--;
    }
  }

  return to;
};

var position_groups = function(teams, room_size) {
  var pos_grps = [];

  for (var pos=0; pos<room_size; pos++) {
    // Create a group for each position
    // These are sorted by position frequency
    var pos_grp = _.shuffle(teams);
    pos_grp.sort(compare_teams_by_position_frequency(pos));

    pos_grps.push(pos_grp);
  }
  return pos_grps;
};

var pairings_from_pos_grps = function(pos_grps, room_size) {
  var pairings = [];
  var used_teams = [];

  var room_count = pos_grps[0].length / room_size;

  for (var room=0; room<room_count; room++) {
    // Fill each room 
    var pairing = {
      teams: []
    };

    for (var pos=0; pos<room_size; pos++) {
      // Find the first avaliable team in `pos_grp`
      // Set that as the team in this position
      var team;
      var pos_grp = pos_grps[pos];

      var i=0;
      while (!team) {
        if (_.indexOf(used_teams, pos_grp[i]) === -1) {
          team = pos_grp[i];
          used_teams.push(pos_grp[i]);
        }
        i++;
      }

      teams[pos] = team;
    }

    pairings.push(pairing);
  }

  return pairings;
};

/*
 * Register the Team Strategy
 */
DebateTab.registerTeamStrategy({
  name: 'Pos-Bracket',
  description: 'Allocates teams into brackets by point totals\n'+
               'Promotes from top of bracket\n'+
               'Chooses brackets to maximise position diversity\n'+
               'Ignores school\n'+
               'Ignores scratches',

  algorithm: function(tournament, round, teams) {
    var room_size = tournament.room_size;
    var t_id = tournament._id;

    var pairings = [];

    var brackets = generate_brackets(teams);
    
    // Iterate over each bracket
    for (var i=0; i<brackets.length; i++) {
      if (!brackets[i]) {
        // The bracket is empty/undefined
        continue;
      }

      // Promote any extra teams
      brackets[i] = _.shuffle(brackets[i]);
      brackets[i+1] = promote_extra(bracket, brackets[i+1], room_size);

      // Generate position groups
      var position_groups = position_groups(bracket, room_size);

      // Get the pairings
      bracket_pairings = pairings_from_pos_grps(position_groups, room_size);

      // Add the pairings to the overall pairings object
      pairings = pairings.concat(bracket_pairings);
    }

    return pairings;
  }
});
