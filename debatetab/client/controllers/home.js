HomeController = MainController.extend({
  data: function() {
    return Tournaments.find();
  }
}).addHooks({
  before: function() { // boom
    this.subscribe('all-tournaments').wait();
  }
});
