module('math', function() {
  var math = {
    sum: function(arr) {
      return _.reduce(arr, function(memo, num) {
        return memo + num;
      }, 0);
    },
    average: function(arr) {
      console.log('Depricated use of module("math").average()');
      return math.mean(arr);
    },
    mean: function(arr) {
      if (arr.length === 0) { return 0; }
      return math.sum(arr) / arr.length;
    },
    hilodrop: function(arr, count) {
      count = count || 1;

      if (arr.length > ((count * 2) + 1)) {
        return math.mean(arr.slice(count, -count));
      } else {
        // Fall back if there are not enough elements for a hilodrop
        if (count > 1) {
          return math.hilodrop(arr, count-1);
        } else {
          return math.mean(arr);
        }
      }
    },
    stdev: function(arr) {
      if (arr.length === 0) { return 0; }
      var avg = math.mean(arr);
      var sum_squares = _.reduce(arr, function(memo, num) {
        return memo + Math.pow(num - avg, 2);
      }, 0);
      return Math.sqrt(sum_squares / arr.length);
    }
  };

  return math;
});
