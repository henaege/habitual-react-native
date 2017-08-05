var Alexa = require('alexa-sdk');

var constants = require('../constants/constants');
var habitsAPI = require('../helpers/habitsAPI');
var convertArrToStr = require('../helpers/convertArrToStr');

var checkInHabit = Alexa.CreateStateHandler(constants.states.CHECKINHABIT, {
	'LaunchRequest': function(){
		//Check user data in session attributes
		var habits = this.attributes['habits'];
		var userName = this.attributes['userName'];
		console.log(habits);
		if(habits){
			//Welcome user back 
			this.emit(':ask', `Welcome back ${userName}! You can ask me about your habits by saying: what's my rank in, then the name of your habit, or check in your habit.`, "What would you like to do?");
		}else{
			//Change State to onboarding
			this.handler.state = constants.states.STARTNEWHABIT;
			this.emitWithState('LaunchRequest');
		}
	},
	'GetMyHabitsListIntent': function(){
		// var accessToken = this.event.session.accessToken;
		var token = this.attributes['token'];
		console.log(token);
		if(token){
			habitsAPI.GetMyHabitsList(token)
				.then((response)=>{
					console.log(response);
					var myHabitsList = [];
					response.results.map((habit)=>{
						myHabitsList.push(habit.name)
					})
					myHabitsList = convertArrToStr(myHabitsList);
					this.emit(':ask', `Here's your habits list ${myHabitsList}`, `Here's your habits list ${myHabitsList}`);
				})
				.catch((error)=>{
					this.emit(':tell', "Sorry, there was a problem accessing your habit lists.");
				})
		}else{
			this.emit(':tellWithLinkAccountCard', 'Please link your account to use this skill.');
		}
	},
	'CheckInHabitIntent': function(){
		var token = this.attributes['token'];
		var habitSlot = this.event.request.intent.slots.HabitName.value;
		if(token){
			console.log(habitSlot);
			habitsAPI.CheckinMyHabit(token, habitSlot)
				.then((response)=>{
					var myRank = response.rank;
					this.emit(':ask', `You have successfully checked in with your ${habitSlot} today. Your currently rank in this group is ${myRank}.`)
				})
				.catch((error)=>{
					if(error == 'outOfFrequency'){
						this.emit(':tell', 'Sorry, you can only check in twice a day for each habit. Come back tomorrow!');	
					}else{
						this.emit(':tell', 'Sorry, there was a problem checking in for your habit.');
					}
				})
		}else{
			this.emit(':tell', 'Sorry, there was a problem identify you in our system.');
		}
	},
	'GetMyRankingIntent': function(){
		var token = this.attributes['token'];
		var habitSlot = this.event.request.intent.slots.HabitName.value;
		if(token){
			habitsAPI.GetMyRank(token, habitSlot)
				.then((response)=>{
					var myRank = response.rank;
					this.emit(':ask', `Your rank in ${habitSlot} is ${myRank}.`)
				})
				.catch((error)=>{
					this.emit(':tell', 'Sorry, there was a problem checking in for your ranking.')
				})
		}
		else{
			this.emit(':tell', 'Sorry, there was a problem identify you in our system.');
		}
	},
	'GetHabitsCategoryIntent':function(){
		var token = this.attributes['token'];
		if(token){
			this.handler.state = constants.states.STARTNEWHABIT;
			this.emitWithState('LaunchRequest');
		}else{
			this.emit(':tell', 'Sorry, there was a problem identify you in our system.');
		}
	},
	'LeaveHabitIntent': function(){
		var token = this.attributes['token'];
		var habitSlot = this.event.request.intent.slots.HabitName.value;
		if(habitSlot){
			habitsAPI.LeaveHabit(token, habitSlot)
				.then((response)=>{
					var myHabitsList = [];
					response.map((habit)=>{
						myHabitsList.push(habit.name)
					})
					if(myHabitsList.length === 0){
						this.attributes['habits'] = '';
					}
					myHabitsList = convertArrToStr(myHabitsList); 
					this.emit(':tell', `You have successfully left the ${habitSlot}. Do you want to start a new habit? Start by saying: start a new habit.`)

				})
		}else{
			this.emit(':ask', "Sorry, I didn't get the habit name you just said. Please say again.", "Sorry, I didn't get the habit name you just said. Please say again.");
		}
	},
	'ManageNotificationIntent': function(){
		var habitName = this.attributes['habits'];
		var token = this.attributes['token'];
		var notification = this.event.request.intent.slots.notification.value.toLowerCase();
		console.log(notification);
		if(habitName.length > 0){
			if(notification == 'on' || notification == 'start'){
				notification = 1;
			}else{
				notification = 2;
			}
			habitsAPI.ManageNotification(token, habitName, notification)
				.then((response)=>{
					console.log(response);
					this.emit(":tell", "We will send you an email notification if you haven't checked in with your habits for a week. Keep up with your habit to start a healthy life!");
				})
				.catch((error)=>{
					this.emit(':tell', 'Sorry, there was a problem accessing our data.');
				})
		}else{
			this.emit(':ask', "Sorry, you need to join a habit before turn on notification.To start a habit, say: start a habit.", "What would you like to do?");
		}
	},
	'AMAZON.StopIntent': function () {
    	// State Automatically Saved with :tell
   		this.emit(':tell', 'Goodbye!');
  	},

  	'AMAZON.CancelIntent': function () {
    	// State Automatically Saved with :tell
    	this.emit(':tell', 'Goodbye!');
  	},
	'SessionEndedRequest': function () {
	// Force State to Save when the user times out
	this.emit(':saveState', true);
	},

	'AMAZON.HelpIntent': function () {
	this.emit(':ask', "To start a habit, say: start a habit. To list your habits, say: what's in my habit list");
	},

	'Unhandled': function () {
	this.emitWithState('AMAZON.HelpIntent');
	}
})

module.exports = checkInHabit;