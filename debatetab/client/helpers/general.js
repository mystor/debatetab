Handlebars.registerHelper('equal', function(a, b) {
  return a === b;
});

Handlebars.registerHelper('ieach', function(context, options) {
  var ret = '';

  var i = 0;

  var each = function(obj) {
    ret = ret + options.fn({
      obj: obj,
      $index0: i,
      $index1: i+1
    });

    i++;
  };

  if (context && context.forEach) {
    context.forEach(each);
  } else if (_.isArray(context)) {
    _.each(context, each);
  }

  return ret;
});

Handlebars.registerHelper('sum', function(arr) {
  return _.reduce(arr, function(memo, num) {
    return memo + num;
  }, 0);
});
