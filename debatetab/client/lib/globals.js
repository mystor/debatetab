Modal = {
  show: function(modal) {
    Session.set('modal', modal);
  },
  hide: function() {
    Session.set('modal', {});
  },
  get: function() {
    return Session.get('modal');
  },
  /*
   * Error Management
   */
  new_err_dep: new Deps.Dependency(),

  throw_err: function(err) {
    Session.set('modal_error', err);
    Modal.new_err_dep.changed();
  },
  consume_err: function() {
    var err = null;
    // Only depend on the event of adding error
    // We don't want the computation to re-run when
    // the error is cleared again
    Modal.new_err_dep.depend();
    Deps.nonreactive(function() {
      err = Session.get('modal_error');
    });
    Session.set('modal_error', '');

    return err;
  },
  /*
   * These helpers are for use in modal templates
   * They contain useful functions for modals
   */
  helpers: {
    consume_err: function() {
      return Modal.consume_err();
    }
  }
};
DebateTab = {
  /**
   * Get a value from the current tournament
   * Will return the current tournament if no value is passed
   */
  tournament: function(key) {
    var tournament = Tournaments.findOne({
      slug: Session.get('t_slug')
    });

    if (tournament) {
      if (key) {
        return tournament[key];
      } else {
        return tournament;
      }
    }
  },
  round: function() {
    if (Session.get('round')) {
      return parseInt(Session.get('round'), 10);
    } else {
      return DebateTab.tournament('round');
    }
  }
};
