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

### Mobile App
When the mobile app opens users are treated to a full-page background photo with bright yet soothing colors, a simple logo, log in form (for those who already have accounts), and a Register button in the top right corner (for those who don't). Users with accounts will enter their email address and password, then tap the login button.
<br />
<p align='center'>
    <img src="./react-native/Habitual Login.png"/></img>
</p>
<br />
The Register button takes a new user to a registration form where they can enter their email address (they'll need to use the same email address that they use for their Amazon account so the mobile app and Alexa can share the same data), name and a  password. Their data is sent to a MySQL database via the API. User input is sanitized to avoid insertion attacks and Passwords are encrypted and stored in our database securely using bcrypt.
<br />
<p align='center'>
    <img src="./react-native/Habitual Register.png"/></img>
</p>
<br />
### Habits List Screen
After logging in the user is brought to their Habits List screen. This is where the magic happens. The habits the user has joined are listed on the screen by pulling their data from the database. The button on the left allows the user to check in to their habits as they do them and rise in rank.
<br />
<p align='center'>
    <img src="./react-native/Habitual Habits List.png"/></img>
</p>
<br />
Swiping left on any habit reveals a delete button. Tapping the delete button will show a confirmation alert aksing the user if the want to leave the habit. Tapping Delete will leave the habit. Tapping Cancel will cancel the action.
<br />
Our backend uses Express to query the database for the requested information and the data is either rendered to the mobile app or spoken by Alexa, depending on which interface is in use. If the user has not joined any habits, a banner will display instead of a habits list.
<br />
<p align='center'>
    <img src="./react-native/Habitual No Habits.png"/></img>
</p>
<br />

### Adding Habits
In the top right corner of the Habits List screen is an Add button. Tapping Add will bring the user to the Add Habits screen.
<br />
<p align='center'>
    <img src="./react-native/Habitual Add Habits.png"/></img>
</p>
<br />
The habit categories are listed across the top in tabs. Tapping each tab will reveal the list of habits for that category. Tapping the add button to the left of a habit will add the habit to your list.

## Challenges

### Challenge 1 - Learning the Amazon Alexa SDK
mysportsfeeds.com does not use API keys to access the data. Instead, an account username and password are used, with both being encoded into base-64 ASCII format via btoa.
In addition, the JSON file was being sent over as a string, so we finally figured out we needed to use JSON.parse() to be able to acces the object elements. It took an hour or so to get the code organized correctly so we could pull the exact data we needed.
<br />
```JavaScript
var onboardingStateHandlers = Alexa.CreateStateHandler(constants.states.ONBOARDING, {
	'NewSession': function(){
		// Check for User Data in Session Attributes
		var userName = this.attributes['userName'];
		var email = this.attributes['email'];
		if(userName){
			habitsAPI.Login(email)
				.then((response)=>{
					// console.log(response);
					this.attributes['token'] = response.token;
					habitsAPI.GetMyHabitsList(response.token)
						.then((response)=>{
							// console.log(response);
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
							console.log(error);
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
  <br />
### Challenge 2 - Building the API

We ended up needing to create two versions of the Login and Registration routes: one each for Alexa and the mobile app. The reason for this is that with Alexa, the user is already logged in to their Amazon account, so the password is already authenticated by Amazon. In this case we only needed their email address.
<br />
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
<br />
For mobile login, we did need to collect the user's password because it wasn't authenticated by Amazon. All input through the mobile app is scrubbed before it goes to the database, and passwords are ecrypted with bcrypt for security.
<br />
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
 <br />
Perhaps as a result of the database schema itself, and definitley due to the asynchronous nature of JavaScript we also had a few routes that required nesting promises several deep due to the async nature of the http requests we made. Each successive request required the data from the previous one, so we had to let JavaScript know that it needed that data before proceeding with certain requests.
<br />
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

### Challenge 3 - Designing the front end
Of course everyone had their own ideas about how to layout the site, whether to use bootstrap, what pages were needed, etc. We finally came to a concensus that allowed us to simplify the site as much as possible while still providing a rich, powerful user experience.

```CSS
.game-on-fade{
   animation: fadein 6s;
}

@keyframes fadein {
  from {opacity: 0;}
  to {opacity: 1;}
}

#experience{
    font-family: Verdana, sans-serif;
    text-align: center;
    text-shadow: 1px 1px black;
    font-size: 25px;
    font-weight: 600;
    color: #fac51c ;
}

p, h5 {
  font-size: 18px;
}

.message {
  color: #AF1B3F;
}

.log-in{
    font-size: 20px;
    color: #fac51c ;    
    border: none;
    border-radius: 50%;
    background-color: transparent;
    float: right;
    margin-bottom: 5px;
    text-shadow: .5px .5px black;
}
```

### Challenge 4 - Chart setup
Getting highcharts to show the data we wanted in the way we wanted it shown proved to be a fairly serious challenge. First, we had to determine what data we wanted from the database, then it needed to be sent to Highcharts for display.

```javaScript
  var array = [];
  var playerName = req.body.search;
  var selectQuery = "SELECT id FROM per_game ORDER BY three_points ASC;";
  connection.query(selectQuery, (error, results)=>{
    if(error) throw error;
    for (let i = 0; i < results.length; i++){
      array.push(results[i].id);
    }
    console.log(array);
    for (let j = 0; j < array.length; j++){
      var rank = j + 1;
      var insertQuery = `UPDATE per_game SET THREErank = ${rank} WHERE id = ${parseInt(array[j])};`;
      connection.query(insertQuery, (error, results)=>{
      if (error) throw error;

    });
    }
});
```

We quickly ran into a problem of scale for the data. For example, a player might average 0.5 steals per game, yet score 25 points per game. The resulting data display was not ideal, so what we ended up doing was ranking each player based on their stats. The higher the stat, the higher their rank was, so a player in the 99th percentile in points scored is better than a player in the 37th percentile. We also created theoretical "best" and "average" players so that single players could be compared against either the best in the league or the league average. 

```JavaScript
connection.query(rankQuery, (error, results)=> {
            var PPGrank = Math.round((results[0].PPGrank/517)*10000)/100;
            var ASSrank = Math.round((results[0].ASSrank/517)*10000)/100;
            var STLrank = Math.round((results[0].STLrank/517)*10000)/100;
            var REBrank = Math.round((results[0].REBrank/517)*10000)/100;
            var MINrank = Math.round((results[0].MINrank/517)*10000)/100;
            var THREErank = Math.round((results[0].THREErank/517)*10000)/100;
            var total_points = results[0].total_points;
            var assists = results[0].assists;
            var steals = results[0].steals;
            var rebounds = results[0].rebounds;
            var minutes = Math.round(results[0].minutes * 100) / 100;
            var three_points = results[0].three_points;

            var compPPGrank = Math.round((results[1].PPGrank/517)*10000)/100;
            var compASSrank = Math.round((results[1].ASSrank/517)*10000)/100;
            var compSTLrank = Math.round((results[1].STLrank/517)*10000)/100;
            var compREBrank = Math.round((results[1].REBrank/517)*10000)/100;
            var compMINrank = Math.round((results[1].MINrank/517)*10000)/100;
            var compTHREErank = Math.round((results[1].THREErank/517)*10000)/100;
            var comptotal_points = results[1].total_points;
            var compassists = results[1].assists;
            var compsteals = results[1].steals;
            var comprebounds = results[1].rebounds;
            var compminutes = Math.round(results[1].minutes * 100) / 100;
            var compthree_points = results[1].three_points;

```

Finally, we knew we wanted a dark theme for our chart (mainly because it looks cooler than the default light theme). Unfortunately, the Highcharts docs aren't super clear as to how to chnage the theme. We finally figured out how to include a configuration file to set the theme. We added a little styling of our own, and Bob was our uncle.

```JavaScript
Highcharts.theme = {
   colors: ['#2b908f', '#90ee7e', '#f45b5b', '#7798BF', '#aaeeee', '#ff0066', '#eeaaee',
      '#55BF3B', '#DF5353', '#7798BF', '#aaeeee'],
   chart: {
      backgroundColor: {
         linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 },
         stops: [
            [0, '#2a2a2b'],
            [1, '#3e3e40']
         ]
      },
      style: {
         fontFamily: '\'Unica One\', sans-serif'
      },
      plotBorderColor: '#606063'
   },
   title: {
      style: {
         color: '#E0E0E3',
         textTransform: 'uppercase',
         fontSize: '20px'
      }
   },
   subtitle: {
      style: {
         color: '#E0E0E3',
         textTransform: 'uppercase'
      }
   },
```

### Challenge 5 - Add favorite button

In order to provide quick acces to users' favorite players, we wanted them to be able to save these players as part of their account. However, what to do when a user first signs up and doesn't have any favorites saved? The solution we came up with was to create a list of some of the best and most popular players that are randomly selected to populate the chart when no favorites are available.

<p align='center'>
    <img src="./public/images/fave1.png" /></img>
</p>

The problem was that every time the user page reloaded, a new random player was also loaded. What we wanted was for a player that was just selected as a favorite to remain the "current player" on the page. In addition, the modal window we use to display the favorites list would pop up everytime the page loaded, causing the user to have to close the modal to see the page. Further, we needed to add the player to the user's favorites list so that the list was persistent for each individual user. In other words, when you log in to your account, your favorites list is YOUR favorites list, and not a list of all players that have been chosen as favorites.

To tackle the first problem, we added a GET request that redirected the user to the same page, but with the player's id as the URL. This way, the player that was just added as a favorite remains as the current player on the page rather then loading a new random player.

```JavaScript
router.get('/fav_load/:val', (req, res)=>{
    var fullName = req.params.val;
    console.log(fullName);
    var nameArray = fullName.split(' ');
    var idQuery = `SELECT id FROM player_info WHERE (first_name = '${nameArray[0]}' AND last_name = '${nameArray[1]}');`; 
    connection.query(idQuery, (error, results)=>{
      if(error) throw error;
      console.log(results);
      var idToLoad = results[0].id;
      req.session.currentPlayer = idToLoad;
      res.redirect('/user?msg=loadFav');
    });
  });
```

The second problem was solved simply by setting the modal up so that it only showed when either a user logs in for the first time and/or doesn't have any favorites selected, or the Favorites button in the upper-right corner of the page is clicked.

Solving the third problem required an additional table in the database which holds lists of player ids linked to user logins. Then we had to match the logged-in user info from the session, get all the player ids linked to that user, and then use the INNER JOIN SQL query parameter to reference the player info table, which holds the player names linked to their ids.

```JavaScript
var userFaves = [];
              var faveQuery = `SELECT CONCAT(player_info.first_name, ' ',
                          player_info.last_name)
                          AS player_full_name
                         FROM player_info
                         INNER JOIN fav_player ON player_info.id = fav_player.player_id WHERE user_email = '${req.session.email}';`;
              connection.query(faveQuery, (error, results)=> {
                for (let i = 0; i < results.length; i++) { 
                  userFaves.push(results[i].player_full_name);
              }
```

<br>

### Challenge 6 - Input Validation

One issue that haunted us from the beginning was user input. What if the user searched for the name of a non-current player, or input gibberish? Early on we decided to implement jQuery's Autocomplete function to help out with this. To do so, we populate a list of all players from the database on the fly and compare the list to the user's input. This displays a list of possible matches to what the user has typed in. Some players have apostrophes or hyphens in their names (looking at you, DeAndre' Bembry), so we used a regular expression to filter the input for Autocomplete

```JavaScript
$("#search-input").focus(function(){
        $("#search-input").attr("value", "");
        $("#search-input").autocomplete({
    	    minLength: 2,
            autoFocus: true,
            source: function( request, response ) {
            var matcher = new RegExp( "^" + $.ui.autocomplete.escapeRegex( request.term ), "i" );
            response( $.grep( nameSource, function( item ){
              return matcher.test( item );
            }) );
            }
        });
    });
```

Later on, we implemented further filters that would check if a name the user typed in is indeed a player, while also taking into account the comparison option the user selected. SO if the user is comparing two players, we check both inputs, and if they are comparing a player to the league average (for example), we don't need to check the other input (which is hidden anyway). If the input is not a valid player name, a message is shown prompting the user to input a valid name.
<p align='center'>
    <img src="./public/images/search2.png" /></img>
</p>

## Bonus!!

The current player's latest tweet is shown just under the stats table in the chart section. In addition, a Twitter follow button beneath the player's photo allows the user to follow that player on Twitter!
<p align='center'>
    <img src="./public/images/bonus.png" /></img>
</p>

# Game On
