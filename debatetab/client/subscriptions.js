Subs = new ReactiveDict({});
Subs.deps = new Deps.Dependency();
Subs.isReady = function(sub) {
  Subs.deps.depend();
  return Subs[sub] && Subs[sub].ready();
};

Deps.autorun(function() {
  var page = Meteor.Router.page();

  var t_slug = Session.get('t_slug');
  if (t_slug) {
    // Subscribe to the tournament
    Subs.tournament = Meteor.subscribe('tournament', t_slug);

    if (Subs.tournament.ready()) {
      var t_id = DebateTab.tournament('_id');
      if (t_id) {
        // Subscribe to teams, judges, and rooms
        Subs.teams = Meteor.subscribe('all-teams', t_id);
        Subs.judges = Meteor.subscribe('all-judges', t_id);
        Subs.rooms = Meteor.subscribe('all-rooms', t_id);

        switch (page) {
          case 't_pairings':
            Subs.pairings = Meteor.subscribe('round-pairings', t_id, DebateTab.round());
            if (DebateTab.round() > DebateTab.tournament('round')) {
              // The current round is too large, lets go to the correct round
              Meteor.Router.to('pairings', t_slug, DebateTab.tournament('round'));
            }
            break;
          case 't_ballot':
            console.log('hi');
            Subs.ballot = Meteor.subscribe('ballot', t_id, Session.get('ballot_key'));
            break;
        }
      } else {
        // Tournament doesn't exist! Redirect
        Meteor.Router.to('tournament_list');
      }
    }
  }

  Subs.deps.changed(); // Trigger sub changes - DON'T USE Subs.isReady IN THIS FUNCTION
});
