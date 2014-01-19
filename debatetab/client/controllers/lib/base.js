/*
 * Base class for all Debatetab RouteControllers
 * Augments them with hook handling functionality
 */
DTController = RouteController.extend({
  before: [
    /* 
     * NProgress Loading Bar
     * Displays when any page is loading on the site
     * Should be at the bottom of the hooks list
     */
    /*function() {
      if (this.ready()) {
        console.log('done');
        NProgress.done();
      } else {
        console.log('start');
        NProgress.start();
        this.stop();
      }
    }*/
  ],
  after: [],
  yieldTemplates: {}
});

/*
 * Adds hooks in hooks to the controller's prototype.
 * Doesn't override the previous hooks present in the controller
 *
 * By default, adds new hooks upstream, pass true to downstream to
 * add the hooks downstream of the old hooks.
 *
 * Returns the object for chaining purposes
 */
DTController.addHooks = function(hooks, downstream) {
  if (!hooks) { hooks = {}; } // Default value for hooks

  // Before Hooks
  var before = hooks.before || [];
  if (!_.isArray(before)) 
    before = [before];

  if (downstream)
    this.prototype.before = this.prototype.before.concat(before);
  else
    this.prototype.before = before.concat(this.prototype.before);

  // After Hooks
  var after = hooks.after || [];
  if (!_.isArray(after)) 
    after = [after];

  if (downstream)
    this.prototype.after = this.prototype.after.concat(after);
  else
    this.prototype.after = after.concat(this.prototype.after);

  // RenderTemplates
  var yieldTemplates = hooks.yieldTemplates || {};
  this.prototype.yieldTemplates = _.defaults(yieldTemplates, this.prototype.yieldTemplates);

  // Returns the object for chaining purposes
  return this;
}

/*
 * Controller used for all tournament pages
 * Can expect to have a slug parameter
 */
TournamentController = DTController.extend({
}).addHooks({
  before: function() { // Subscribe to all of the tournament fun-stuff
    this.subscribe('tournament', this.params.slug).wait();
    this.subscribe('all-teams', this.params.slug).wait();
    this.subscribe('all-judges', this.params.slug).wait();
    this.subscribe('all-rooms', this.params.slug).wait();
  },
  yieldTemplates: {
    'tournamentNavbar': {to: 'navbar'}
  }
});

/*
 * Controller used for all non-tournament pages
 */
MainController = DTController.extend({}).addHooks({
  yieldTemplates: {
    'mainNavbar': {to: 'navbar'}
  }
});
