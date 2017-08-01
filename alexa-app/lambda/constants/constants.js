var constants = Object.freeze({

  // App-ID. TODO: Set Your App ID
  appId : '',

  //  DynamoDB Table Name
  dynamoDBTableName : 'Habits',

  // Skill States
  states : {
    ONBOARDING : '',
    STARTNEWHABIT : '_STARTNEWHABIT',
    CHECKINHABIT:'_CHECKINHABIT'
  }

});

module.exports = constants;