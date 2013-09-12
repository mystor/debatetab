Handlebars.registerHelper('controlbar', function(options) {
  return Template.controlbar_wrapper({
    buttons: new Handlebars.SafeString(options.fn(this))
  });
});

Template.controlbar_wrapper.rendered = function() {
  var controlbar = module('controlbar');
  controlbar.initAffix();
};
