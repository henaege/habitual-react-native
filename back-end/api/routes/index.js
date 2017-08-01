var express = require('express');
var router = express.Router();
var mysql = require('mysql')
const bunyan = require('bunyan');
const nodemailer = require('nodemailer');
var bcrypt = require('bcrypt-nodejs');
var randToken = require('rand-token');
var config = require('../config/config');
var sendEmail = require('../emailSending');

var connection = mysql.createConnection({
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database
})

connection.connect()

function checkUpdatedDate(){
  var dateUpdatedQuery = 'SELECT email, dateUpdated, name FROM addedHabits WHERE DATE_ADD(dateUpdated, INTERVAL 7 DAY) < CURRENT_TIMESTAMP AND notification = 1;'
  var thePromise = new Promise((resolve, reject)=>{
    connection.query(dateUpdatedQuery, (error, results)=>{
    if(error) throw error;
    if(results.length < 1){
      reject('noUpdates')
    }else{
      resolve(results);
    }
  })})
  return thePromise;
};

/* Check updated time and send notifiction every week */
setInterval(()=>{
  checkUpdatedDate()
    .then((results)=>{
      results.map((userInfo)=>{
        sendEmail(userInfo);
      })
    })
    .catch((error)=>{
      console.log(error);
    })
}, 604800000)

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/register', (req, res)=>{
  const firstName = req.body.firstName
  const lastName = req.body.lastName
  const email = req.body.email
  const password = bcrypt.hashSync(req.body.password)

  console.log(firstName)

  connection.query(`SELECT email FROM users`, (error, results)=>{
    console.log(results)
    if (error) throw error
    var emailsArray = []
    for (i = 0; i < results.length; i++){
      emailsArray.push(results[i].email)
    }
    if(emailsArray.includes(email)){
      res.json({msg: "userExists"})
    } else {
      // var insertIntoUsers = `INSERT INTO users (email, firstName, lastName, password) VALUES (?,?,?,?);`
      connection.query(`INSERT INTO users (email, firstName, lastName, password) VALUES (?,?,?,?);`, [email, firstName, lastName, password], (error2, results2)=>{
        console.log("user inserted")
        console.log(results2)
        if(error2){
          res.json({msg: error2})
        } else {
          res.json({
            msg: "userInserted",
            email: email,
            name: firstName
          })
        }
      })
    }
  })
})

router.get('/categorylist', (req, res)=>{

  var categoryQuery = `SELECT categoryName FROM categories;`
  connection.query(categoryQuery, (error, results)=>{
    if (error) {
      res.json({
        msg: "error"
      })
    } else {
      res.json({
        categories: results
      })
    }
  })
})

router.post('/joinAHabit', (req, res)=>{
  var habitName = req.body.habitName
  var email = req.body.email
  var habitCount = 0
  var checkPromise = new Promise((resolve, reject)=>{
    var checkQuery = 'SELECT * FROM addedHabits WHERE name = ? AND email = ?;';
    connection.query(checkQuery, [habitName, email], (error1, results1)=>{
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
    thePromise.then(()=>{connection.query(joinHabitQuery, [email, habitName,  0,  habitCount], (error3, results3)=>{
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
     res.json({msg: error});
  })
})

router.post('/habitslist', (req, res)=> {
  var categoryName = req.body.categoryName;
  console.log(categoryName);
  var categoryIdQuery = `SELECT id FROM categories WHERE categoryName = '${categoryName}';`
  connection.query(categoryIdQuery, (error, results)=>{
    console.log(results)
    if (error) {
      throw error
    } else {
      var groupQuery = `SELECT habitName FROM habitsInfo WHERE categoryId = ${results[0].id};`
      connection.query(groupQuery, (error2, results2)=>{
        console.log(results2)
        if (error){
          throw error
        } else {
          res.json({
            habitsList: results2
          })
        }
      })
    }
  })
});

router.post('/getMyHabitList', (req,res)=>{
  var email = req.body.email;
  if(email.length <= 1){
    res.json({msg: 'InvalidEmail'});
  }else{
    var getListQuery = 'SELECT name FROM addedHabits WHERE email = ?;';
    connection.query(getListQuery, (error, results)=>{
    if(error) throw error;
    if(results.length < 1){
      res.json({msg: 'NoHabitJoined'})
    }else{
      res.json(results);
    }
  });
  }
});

router.post('/manageNotification', (req, res)=>{
  var email = req.body.email;
  var activeNotification = req.body.notification;
  if(activeNotification){
    var notificationStatus = 1;
  }else{
    var notificationStatus = 2;
  }
  var manageNotificationQuery = 'UPDATE addedHabits SET notification = ? WHERE email = ?;';
  connection.query(manageNotificationQuery, [notificationStatus ,email], (error, results)=>{
    if(error) {res.json({msg: 'notificationFailed'})};
    res.json({msg: 'notificationOn'});
  });
})

router.post('/checkinMyHabit', (req, res)=> {
  var email = req.body.email
  var habitName = req.body.habitName
  var checkFrequency = 'SELECT updatedFrequency FROM addedHabits WHERE email = ? AND name = ?;'

  var aPromise = new Promise((resolve, reject)=>{
    connection.query(checkFrequency, [email, habitName],(err, resp)=>{
      console.log(resp);
      if (err){
        throw err
      } else {
        if (resp[0].updatedFrequency == 0){
          reject("outOfFrequency")
        } else {
          resolve()
        }
      }
    })
  })
  aPromise.then(()=>{
    var checkinQuery = `UPDATE addedHabits SET count = count + 1, updatedFrequency = updatedFrequency - 1, dateUpdated = CURRENT_TIMESTAMP WHERE email = '${email}' AND name = '${habitName}';`
  var thePromise = new Promise((resolve, reject)=> {
    connection.query(checkinQuery, (error, results)=>{
    if (error){
      res.json({
        msg: error
      })
    } else {
      resolve(results)
    }
  })
})
thePromise.then(()=>{
  var rankQuery = `SELECT count, email FROM addedHabits WHERE name = '${habitName}' ORDER BY count;`

    connection.query(rankQuery, (error2, results2)=> {
      if (error2) {
        res.json({
          msg: error2
        })
      } else {
        var rank = 0
        for (let i = 0; i < results2.length; i++){
          if (results2[i].email == email){
            rank = i + 1
          
          }
        }
        if (rank == 0) {
          res.json({
            msg: "rankNotFound"
          })
        } else {
          connection.query(`UPDATE addedHabits SET rank = '${rank}' WHERE email = '${email}' AND name = '${habitName}';`, (error3, results3)=>{
            if (error3){
              throw error3
            } else {
              res.json({
            rank: rank
          })
            }
          })
        }
        
      }
    })

})
.catch((error)=>{
  res.json({
    error: error
  })
})
  })
  .catch((error)=>{
    res.json({error: error})
  })
  


  

})

router.post('/getMyRank', (req, res)=>{
  var email = req.body.email
  var habitName = req.body.habitName

  var rankQuery = `SELECT rank, count FROM addedHabits WHERE email = ? AND name = ?;`

  connection.query(rankQuery, [email, habitName], (error, results)=>{
    if (error){
      throw error;
    } else {
      if(results.length > 0){
        res.json({
        count: results[0].count,
        rank: results[0].rank
        })
      }
      else{
        res.json("NoRank");
      }
    }
  } )

});


router.post('/leaveHabit', (req, res)=>{
  var email = req.body.email
  var habitName = req.body.habitName
  var thePromise;
  var aPromise = new Promise((resolve, reject)=>{
    connection.query(`SELECT name FROM addedHabits WHERE email = ?;`, [email],(error1, resp)=>{
      console.log(resp)
      if(error1){
        throw error1
      } else{
        function findHabit(habit) {
          return habit.name == habitName
        }
        console.log(resp.find(findHabit))
        if(resp.find(findHabit) == undefined){
          reject("noHabit")
        } else {
          resolve()
        }
      }
    })
  })

  aPromise.then(()=>{
    var leaveHabitQuery = `DELETE FROM addedHabits WHERE email = ? AND name = ?;`
    thePromise = new Promise((resolve, reject)=>{
      connection.query(leaveHabitQuery, [email, habitName], (error, response)=>{
        if (error) {
          throw error
        } else {
          resolve()
          console.log('removed habit')
        }
      })
    });
    thePromise.then(()=>{
    var remainingQuery = `SELECT name FROM addedHabits WHERE email = ?;`
    connection.query(remainingQuery,[email],(error2, response2)=>{
      console.log(response2)
      if (error2){
        res.json({
          msg: 'error'
        })
      } else{
        res.json({
          msg: "leftGroup",
          habitListResponse: response2[0]
        })
      }
    })
  })
  .catch((error)=>{
    res.json(error);
  })
  })
  .catch((error)=>{
    res.json(error);
  })
  
  
})

module.exports = router;