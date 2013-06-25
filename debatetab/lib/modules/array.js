module('array', function() {
  return {
    isSparse: function(arr) {
      for (var i=0; i<arr.length; i++) {
        if (typeof arr[i] === 'undefined') {
          return true;
        }
      }
      return false;
    }
  };
});
