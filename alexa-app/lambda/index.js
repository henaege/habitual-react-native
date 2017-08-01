var Alexa = require('alexa-sdk');

var constants = require('./constants/constants');

var onboardingStateHandler = require('./handlers/onboardingStateHandler');
var startNewHabitStateHandler = require('./handlers/startNewHabitStateHandler');
var checkInHabitStateHandler = require('./handlers/checkInHabitStateHandler');

exports.handler = function(event, context, callback){
  var alexa = Alexa.handler(event, context);
  alexa.appId = constants.appId;
  alexa.dynamoDBTableName = constants.dynamoDBTableName;
  alexa.registerHandlers(
    onboardingStateHandler,
    startNewHabitStateHandler,
    checkInHabitStateHandler
  );

  alexa.execute();
};