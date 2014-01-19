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

Handlebars.registerHelper('times', function(iterations, options) {
  var ret = '';

  for (var i=0; i<iterations; i++) {
    ret = ret + options.fn({
      $index0: i,
      $index1: i+1
    });
  }

  return ret;
});

Handlebars.registerHelper('sum', function(arr) {
  var math = module('math');
  if (_.isArray(arr)) {
    return math.sum(arr);
  } else {
    return math.sum(_.initial(arguments));
  }
});

Handlebars.registerHelper('ordinal', function(num) {
  var ordinal = module('ordinal');
  return ordinal(num);
});

Handlebars.registerHelper('fixedNum', function(num, precision) {
  return num.toFixed(precision);
});

Handlebars.registerHelper('or', function() {
  for (var i=0; i<(arguments.length - 1); i++) {
    if (arguments[i]) {
      return arguments[i];
    }
  }
});

Handlebars.registerHelper('log', function(x) {
  console.log(x);
  return '';
});

Handlebars.registerHelper('navClass', function() {
  var args = _.initial(arguments);
  return (_.indexOf(args, Router.current().route.name) !== -1) ? 'active' : '';
})
