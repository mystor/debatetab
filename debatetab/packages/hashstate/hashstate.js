var Hashstate = function() {
  this._hash = '';
  this._hashTokens = [];
  this._hashDeps = new Deps.Dependency();

  var that = this;

  // Hooks into Meteor.Router
  Meteor.Router.filters({
    hashstateFilter: function(page) {
      // Clear the hash if routing
      if (that._hash === location.hash) {
        location.hash = ''; // Clear the hash wnen navigating to a new page
      }
      that._hash = location.hash;
      that._parseHash();

      // TODO: Fix hack!
      // This resets location.hash, as Meteor.Router likes to clear
      // The hash after the filter has been run
      Meteor.defer(function() {
        location.hash = that._hash;
      });

      return page;
    }
  });
  Meteor.Router.filter('hashstateFilter');

  window.addEventListener('hashchange', function() {
    // The hash has changed, update the hash
    that._hash = location.hash;
    that._parseHash();
  });
};

_.extend(Hashstate.prototype, {
  hash: function() {
    this._hashDeps.depend();
    return this._hash;
  },
  setHash: function(hash) {
    this._hash = location.hash = hash;
    this._parseHash();
  },
  check: function(tag) {
    this._hashDeps.depend();
    return _.indexOf(this._hashTokens, tag) !== -1;
  },
  add: function(tag) {
    if (_.indexOf(this._hashTokens, tag) === -1) {
      this._hashTokens.push(tag);
    }

    this._updateUrl();
  },
  remove: function(tag) {
    var index = _.indexOf(this._hashTokens, tag);

    if (index !== -1) {
      this._hashTokens.splice(index, 1);

      this._updateUrl();
    }
  },
  _updateUrl: function() {
    this._hash = location.hash = '#'+this._hashTokens.join('.');

    this._hashDeps.changed();
  },
  _parseHash: function() {
    var no_hash = this._hash.substr(1);

    if (no_hash.length > 0) {
      this._hashTokens = _.uniq(_.without(no_hash.split('.'), ''));
    } else {
      this._hashTokens = [];
    }

    this._hashDeps.changed();
  }
});


window.Hashstate = new Hashstate();
