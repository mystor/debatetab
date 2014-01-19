CreateController = MainController.extend({
  before: function() {
    if (!Meteor.user()) {
      Router.go('home');
      this.stop();
    }
  }
});
