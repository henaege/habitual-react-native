var Alexa = require('alexa-sdk');

var constants = require('../constants/constants');
var habitsAPI = require('../helpers/habitsAPI');
var convertArrToStr = require('../helpers/convertArrToStr');

var startNewHabitStateHandlers = Alexa.CreateStateHandler(constants.states.STARTNEWHABIT, {
	'LaunchRequest': function(){
		//Check user data in session attributes
		var userName = this.attributes['userName'];
		var habitName = this.attributes['habits'];
		var email = this.attributes['email'];
		habitsAPI.Login(email)
			.then((response)=>{
				this.attributes['token'] = response.token;
				console.log('login');
				if(habitName){
					this.emit(':ask', `Welcome back ${userName}! You can ask me about various available habits by saying: tell me category list.`, "What would you like to do?");
				}
				else if(userName){
					//Welcome user back 
					this.emit(':ask', `Welcome back ${userName}! You can ask me about various available habits by saying: start a new habit.`, "What would you like to do?");
				}
			})
			.catch((error)=>{
				//Change State to onboarding
				console.log('on boarding');
				// console.log(error);
				this.handler.state = constants.states.ONBOARDING;
				this.emitWithState('NewSession');
			})
	},
	'GetHabitsCategoryIntent': function(){
		var email = this.attributes['email'];
		if(email){
			habitsAPI.GetHabitsCategory()
				.then((response)=>{
					var categoryList = [];
					response.categories.map((category)=>{
						categoryList.push(category.categoryName);
					});
					categoryList = convertArrToStr(categoryList);
					this.emit(':ask', `Here's the list, ${categoryList}. Which category would you like to choose? Start by saying: open or tell me, then the category name.`, "Which category would you like to choose?");
				})
				.catch((error)=>{
					console.log(error);
						this.emit(':tell', 'Sorry, there was a problem accessing our data detail.');
				})
		}else{
			//Change State to onboarding
			this.handler.state = constants.states.ONBOARDING;
			this.emitWithState('NewSession');
		}
	},
	'GetHabitsListIntent': function(){
		var categorySlot = this.event.request.intent.slots.HabitsCategory.value;
		console.log(categorySlot);
		habitsAPI.GetHabitsList(categorySlot)
			.then((response)=>{
				var habitsList = [];
				response.map((habit)=>{
					console.log(habit);
					habitsList.push(habit.name);
				});
				habitsList = convertArrToStr(habitsList);
				this.emit(':ask', `Here is available habits for you to join. ${habitsList}. To join a habit group, start by saying: join and then the group name.`, "To join a habit group, start by saying: join and then the group name.");
			})
			.catch((error)=>{
				console.log(error);
				this.emit(':tell', 'Sorry, there was a problem accessing our habits list.')
			})
	},
	'GetMyHabitsListIntent': function(){
		// var accessToken = this.event.session.accessToken;
		var token = this.attributes['token'];
		if(token){
			habitsAPI.GetMyHabitsList(token)
				.then((response)=>{
					this.attributes['habits'] = response
					var myHabitsList = response.slice('');
					myHabitsList = convertArrToStr(myHabitsList);
					this.emit(':ask', `Here's your habits list ${myHabitsList}`, `Here's your habits list ${myHabitsList}`);
				})
				.catch((error)=>{
					console.log(error);
					this.emit(':tell', "Sorry, there was a problem accessing your habit lists.");
				})
		}else{
			this.emit(':tellWithLinkAccountCard', 'Please link your account to use this skill.');
		}
	},
	'JoinAHabitIntent': function(){
		var token = this.attributes['token'];
		var habitName = this.event.request.intent.slots.HabitName.value;
		habitsAPI.JoinAHabit(token, habitName)
			.then((response)=>{
				this.attributes['habits'].push(habitName);
				this.handler.state = constants.states.CHECKINHABIT;
				this.emit(':ask', `You have successfully joined the ${habitName} group. Come back to check in with me after you finish you habit each time. If you want me to remind you through email about your habit, say: notification on. Or simply say: stop, to leave.`, 'If you want me to remind you through email about your habit, say: start notification. Or simply say: stop, to leave.');
			})
			.catch((error)=>{
				if(error === 'existedUserHabit'){
					this.emit(':tell', "Sorry, you can't join the same habit twice");
				}else{
					this.emit(':tell', 'Sorry, there was a problem accessing our data.');
				}
			})
	},
	'CheckInHabitIntent': function(){
		var habits = this.attributes['habits'];
		if(habits){
			console.log('check in in start new');
			this.handler.state = constants.states.CHECKINHABIT;
			this.emitWithState('LaunchRequest');
		}else{
			this.emit('ask', "To start a habit, say: start a habit. To check in your habits, say: check in habit", "What would you like to do?");
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
	this.emit(':ask', "To start a habit, say: start a habit. To chekc in your habits, say: check in habit", "What would you like to do?");
	},

	'Unhandled': function () {
	this.emitWithState('AMAZON.HelpIntent');
	}
})
module.exports = startNewHabitStateHandlers;