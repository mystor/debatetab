OverviewController = TournamentController.extend({
  data: function() {
    return Tournaments.findOne({
      slug: Router.current().params.slug
    });
  }
});
