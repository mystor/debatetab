/*Meteor.Router.add('/download/:_token', function(_token) {
  var pairingscsv = module('pairingscsv');
  var resultscsv = module('resultscsv');

  // Get the download request from the token
  var request = DLRequests.findOne({ _id: _token });

  if (!request) {
    return [404, 'This file token does not exist'];
  }
  var now = new Date();
  var time_delta = now.getTime() - request.when.getTime();

  if (time_delta > 1000 * 60 * 30) {
    DLRequest.remove({ _id: _token });
    return [404, 'This request has expired'];
  }

  var ret;
  switch (request.type) {
    case 'pairings':
      ret = pairingscsv(request.tournament, request.round);
      break;
    case 'results':
      ret = resultscsv(request.tournament, request.round);
      break;
    default:
      ret = [500, 'Request type is not recognised'];
  }

  // Remove the request object
  DLRequests.remove({ _id: _token });

  return ret;
});
*/
