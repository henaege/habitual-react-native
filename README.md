# Habitual
---
## <a href="https://www.youtube.com/watch?v=pKn2ISS370U">View the demo on YouTube!</a>

## What It Is
Habitual is a social habit tracking app that encourages good habits for a healthy, balanced life. The app consists of an Alexa skill coupled with a React Native mobile app. These two interfaces share a back-end API and databse, so when you add, delete, or check in to a habit the data is syched across all your devices instantly. In addition, Habitual keeps track of the habits you have checked into and ranks you according to how often you check in compared to other users. Users can register and log in to the mobile app with the email they use for their Amazon account to keep data synched. Habitual will also send you an email reminder if it has been a while since you last checked in to a habit.

## Team members
* <a href="https://github.com/VinozzZ">Yingrong Zhao</a>
* <a href="https://github.com/henaege">Drew Tolliver</a>

## Languages and Technologies used
* Node.js
* Express
* MySQL
* JavaScript
* React Native
* Amazon Alexa SDK

## Dependencies and Plugins
* Native Base
* Expo
* Axios
* mysql node
* React
* Redux
* React-Redux
* Redux Thunk
* React Native Router Flux
* Amazon Lambda
* Amazon Dynamo DB

## Team Strategy
It all began with Yingrong's idea to create an Alexa skill. She and Drew planned to work together based on the work they did on previous projects. Initially, the idea was to create a skill that would be used for practicing technical interviews. The idea then changed to a to-do app skill that would offer rewards for completing tasks. Since the to-do list idea had been done so much already we shifted gears again to the idea of tracking good habits and incentivizing it by keeping track of habit check-ins and assigning a rank compared to other users who have joined the same habit.
<br /><br />
To start, Yingrong tackled the Alexa skill while Drew started building the API that would connect Alexa and the React Native app to our mySQL database. Once we had a working API and Alexa could communicate with it, Drew started building the React Native app while Yingrong continued teaching Alexa what we wanted her to do. With Alexa finally behaving and the mobile app running, we spent a good amount of time working out all the bugs we found through testing. There are probably still some hiding in the crevices but if there are they don't seem to affect functionality.

## App Walkthrough

### Alexa
To start the habitual skill, say "Alexa, start Habitual." Alexa then greets you by name and gives a brief sample instruction, using "Show me the category list" as an example. Other commands that are available are as follows:

* "Tell me the category list."
   * Alexa will list the categories the habits are grouped by
   * Say "Tell me {Category Name}"
   * Alexa will list the habits in the selected category

* "I want to start a habit."
   * Alexa will list the habits that are available to join
   * Say "I want to join {Habit Name}" to join a habit
   * Alexa will let you know you have joined the habit and ask if you want notifications
   
* "Check in with {Habit Name}"
   * Alexa will let you know whether your check-in was successful. If so, she will update you on your rank in that habit.
   
* "Tell me my {Habit Name} rank"
   * Alexa will give your rank in the selected habit and ask if you want to join another habit
   
* "I want to leave/quit/cancel {Habit Name}"
   * Alexa will let you know you have left the habit and ask if you want to join another habit
   
* "Quit"
   * "Goodbye"

<br><br>

### Mobile App
When the mobile app opens users are treated to a full-page background photo with bright yet soothing colors, a simple logo, log in form (for those who already have accounts), and a Register button in the top right corner (for those who don't). Users with accounts will enter their email address and password, then tap the login button.
<br><br>
<p align='center'>
    <img src="./react-native/Habitual Login.png"/></img>
</p>
<br><br>
The Register button takes a new user to a registration form where they can enter their email address (they'll need to use the same email address that they use for their Amazon account so the mobile app and Alexa can share the same data), name and a  password. Their data is sent to a MySQL database via the API. User input is sanitized to avoid insertion attacks and Passwords are encrypted and stored in our database securely using bcrypt.
<br><br>
<p align='center'>
    <img src="./react-native/Habitual Register.png"/></img>
</p>
<br><br>

### Habits List Screen
After logging in the user is brought to their Habits List screen. This is where the magic happens. The habits the user has joined are listed on the screen by pulling their data from the database. The button on the left allows the user to check in to their habits as they do them and rise in rank.
<br><br>
<p align='center'>
    <img src="./react-native/Habitual Habits List.png"/></img>
</p>
<br><br>
Swiping left on any habit reveals a delete button. Tapping the delete button will show a confirmation alert aksing the user if the want to leave the habit. Tapping Delete will leave the habit. Tapping Cancel will cancel the action.
<br />
Our backend uses Express to query the database for the requested information and the data is either rendered to the mobile app or spoken by Alexa, depending on which interface is in use. If the user has not joined any habits, a banner will display instead of a habits list.
<br><br>
<p align='center'>
    <img src="./react-native/Habitual No Habits.png"/></img>
</p>
<br><br>

### Adding Habits
In the top right corner of the Habits List screen is an Add button. Tapping Add will bring the user to the Add Habits screen.
<br><br>
<p align='center'>
    <img src="./react-native/Habitual Add Habits.png"/></img>
</p>
<br><br>
The habit categories are listed across the top in tabs. Tapping each tab will reveal the list of habits for that category. Tapping the add button to the left of a habit will add the habit to your list.

## Challenges

### Challenge 1 - Learning the Amazon Alexa SDK
Before we started coding, we had to do a lot of research on which module to use for the Alexa local development. After building some testing apps with several different modules, we decided to go with the official module that is published by Amazon developer team. We started by reading through their documentation and getting familiar with the basic syntax. Then, we were able to find a tutorial that guides us through a bigger practical example so we finally was at a place to be ready to develop our own app.
<br><br>
```JavaScript
var onboardingStateHandlers = Alexa.CreateStateHandler(constants.states.ONBOARDING, {
  'NewSession': function(){
    // Check for User Data in Session Attributes
      var userName = this.attributes['userName'];
	var email = this.attributes['email'];
	  if(userName){
	    habitsAPI.Login(email)
	      .then((response)=>{
		this.attributes['token'] = response.token;
		  habitsAPI.GetMyHabitsList(response.token)
		    .then((response)=>{
		      var habitsList = response;
			this.attributes['habits'] = habitsList;
			  if(habitsList.length > 0){
			  
			    // Change State to check in habit
			    this.handler.state = constants.states.CHECKINHABIT;
			    this.emitWithState('LaunchRequest');
			  }else{

			    // Change State to Start new Habit
			    this.handler.state = constants.states.STARTNEWHABIT;
			    this.emitWithState('LaunchRequest');
			  }
		     })
		     .catch((error)=>{
			// Change State to Start new Habit
			this.handler.state = constants.states.STARTNEWHABIT;
			this.emitWithState('LaunchRequest');
		})
	     })
	     .catch((error)=>{
	       this.emit(':tell', "Sorry, there's a problem to log you in in our system. Please try again.");
	     })
}
  ```
  <br><br>
### Challenge 2 - Building the API

We ended up needing to create two versions of the Login and Registration routes: one each for Alexa and the mobile app. The reason for this is that with Alexa, the user is already logged in to their Amazon account, so the password is already authenticated by Amazon. In this case we only needed their email address.
<br /><br>
```JavaScript
router.post('/alexaLogin', (req, res)=>{
  var email = req.body.email;
  const checkEmail = new Promise((resolve, reject)=>{
    var checkLoginQuery = "SELECT * FROM users WHERE email = ?";
    connection.query(checkLoginQuery, [email], (error, results)=>{
      if (error) throw error;
      if(results.length === 0){
        reject({msg:'emailNotExists'});
      }else{
        resolve();
      }
    })
  });
  checkEmail.then(()=>{
    const updateToken = 'UPDATE users SET token=? WHERE email = ?';
    var token = randToken.uid(40);
    connection.query(updateToken, [token, email], (err, results)=>{
      res.json({
        msg: 'loginSuccess',
        token:token
      })
    })
  }).catch((error)=>{
    console.log(error);
    res.json(error);
  })
});
```
<br /><br>
For mobile login, we did need to collect the user's password because it wasn't authenticated by Amazon. All input through the mobile app is scrubbed before it goes to the database, and passwords are ecrypted with bcrypt for security.
<br /><br>
```JavaScript
router.post('/mobileLogin', (req, res)=>{
  var email = req.body.email.toLowerCase();
  var password = req.body.password;
  var checkHash;
  const checkEmail = new Promise((resolve, reject)=>{
    var checkLoginQuery = "SELECT * FROM users WHERE email = ?";
    connection.query(checkLoginQuery, [email], (error, results)=>{
      if (error) throw error;
      if(results.length === 0){
        reject({msg:'emailNotExists'});
      }else{
        checkHash = bcrypt.compareSync(password, results[0].password);
        resolve();
      }
    })
  });
  checkEmail.then(()=>{
    if(checkHash){
      const updateToken = 'UPDATE users SET token=? WHERE email = ?';
      var token = randToken.uid(40);
      connection.query(updateToken, [token, email], (err, results)=>{
        if(err) throw err;
        res.json({
          msg: 'loginSuccess',
          token:token
        })
      })
    }else{
      res.json({msg:'wrongPassword'});
    }
  }).catch((error)=>{
    console.log(error);
    res.json(error);
  })
});
 ```
 <br /><br>
Perhaps as a result of the database schema itself, and definitley due to the asynchronous nature of JavaScript we also had a few routes that required nesting promises several deep due to the async nature of the http requests we made. Each successive request required the data from the previous one, so we had to let JavaScript know that it needed that data before proceeding with certain requests.
<br /><br>
```JavaScript
emailPromise.then(()=>{
    var checkPromise = new Promise((resolve, reject)=>{
    var checkQuery = 'SELECT t1.email, t2.name FROM (SELECT email FROM users WHERE token = ?) t1 JOIN addedHabits t2 on t1.email = t2.email AND t2.name = ?;';
    connection.query(checkQuery, [token, habitName], (error1, results1)=>{
      if(error1) throw error1;
      console.log(results1);
      if(results1.length > 0){
        reject("existedUserHabit");
      }else{
        resolve()
      }
    })
    });
      var joinHabitQuery = `INSERT INTO addedHabits (email, name, dateCreated, count, dateUpdated, rank) VALUES (?, ?, CURRENT_TIMESTAMP, ?, CURRENT_TIMESTAMP, ?);`

  checkPromise.then(()=>{
      var thePromise = new Promise((resolve, reject)=>{
      connection.query(`SELECT name, COUNT(*) as count FROM addedHabits WHERE name = '${habitName}';`, (error2, results2)=>{
        console.log(results2)
        if(error2){
          throw error2
        } else {
          habitCount = results2[0].count + 1
          resolve()
        }
      })
    })
    thePromise.then(()=>{
      console.log(email);
      connection.query(joinHabitQuery, [email, habitName,  0,  habitCount], (error3, results3)=>{
        if (error3){
          throw error3
        } else {
          res.json({
            rank: habitCount
          })
        }
      })
    })
    .catch((error)=>{
      res.json({msg: error});
    })
  })
  .catch((error)=>{
    res.json({msg:error});
  })
  })
  .catch((error)=>{
     res.json({msg: error});
  })
})
```
<br /><br>
### Challenge 3 - React Native
The other piece of our project was of course the React Native mobile app. Like the Alexa skill, React Native was something we would need to research and learn on our own. We learned the React web framework in class and used Redux as well to manage state in an e-commerce app we built. React Native is very similar to React, but the difference are large enough that it felt like learning something completely new. For one thing, in React Native there is no DOM, so things like style have to be done with JavaScript instead of CSS.
<br>
```JavaScript
<Tab tabStyle={{flex: 1, backgroundColor: '#D8DBE2'}} textStyle={{color: '#000'}} activeTextStyle={{color: '#48A9A6', fontWeight: 'bold'}} activeTabStyle={{backgroundColor: '#EAE0CC'}} heading={category} key={category}>
```
<br>


# Habitual
