CSV.read = function(text, schema) {
  // Parse the text using the modified jqueryCSV
  var arrays = CSV.csv.toArrays(text);

  // Ignore the first row
  arrays.shift();

  // Populate the list
  var list = [];
  _.each(arrays, function(array) {
    var obj = {};
    
    // Copy the object into the obj object using the schema for keys
    _.each(array, function(element, index) {
      if (schema[index]) {
        obj[schema[index]] = element;
      }
    });

    list.push(obj);
  });

  return list;
};
