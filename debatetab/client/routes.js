Router.map(function() {
  // Sitewide Routes
  this.route('home', {path: '/'});

  this.route('create');
  this.route('overview', {path: '/t/:slug'});

  // Pairings
  this.route('pairings', {path: '/t/:slug/pairings/:round'});
  this.route('autopair', {path: '/t/:slug/pairings/:round/autopair'});

  // Results
  this.route('teamTab', {path: '/t/:slug/results/team'});
  this.route('speakerTab', {path: '/t/:slug/results/speaker'});
  this.route('results', {path: '/t/:slug/results/:round'});

  // Setup
  this.route('teams', {path: '/t/:slug/setup/teams'});
  this.route('judges', {path: '/t/:slug/setup/judges'});
  this.route('rooms', {path: '/t/:slug/setup/rooms'});
  this.route('scratches', {path: '/t/:slug/setup/scratches'});

  // Ballots
  this.route('ballot', {path: '/t/:slug/ballot/:key'});
});

Router.configure({
  layoutTemplate: 'layout',
  notFoundTemplate: 'notFound',
  loadingTemplate: 'loading',

  before: function() {
    // Hide the current modal
    Modal.hide();

    // Clear current search
    Session.set('search', '');
  }
});




