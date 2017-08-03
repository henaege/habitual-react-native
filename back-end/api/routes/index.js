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
  var dateUpdatedQuery = 'SELECT dateUpdated, name, email FROM addedHabits INNER JOIN users ON userToken = token WHERE DATE_ADD(dateUpdated, INTERVAL 7 DAY) < CURRENT_TIMESTAMP AND notification = 1;'
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

router.post('/mobileRegister', (req, res)=>{
  const userName = req.body.userName
  const email = req.body.email.toLowerCase()
  const password = bcrypt.hashSync(req.body.password)

  connection.query(`SELECT email FROM users`, (error, results)=>{
    console.log(results)
    if (error) throw error
    var emailsArray = []
    for (i = 0; i < results.length; i++){
      emailsArray.push(results[i].email.toLowerCase())
    }
    if(emailsArray.includes(email)){
      var userIndex = emailsArray.indexOf(email);
      if(results[userIndex].password){
        res.json({msg: "userExists"})
      }else{
        var updatePasswordQuery = 'UPDATE users SET password = ? WHERE email = ?;';
        connection.query(updatePasswordQuery, [password, email], (error1, results1)=>{
          if(error1) res.json({msg:error1})
          res.json({
            msg:"userPasswordUpdatedForMobile",
            email: email,
            name: userName
          })
        })
      }
    } else {
      var newToken = randToken.uid(40);
      connection.query(`INSERT INTO users (email, name, password, token) VALUES (?,?,?,?);`, [email, userName, password, newToken], (error2, results2)=>{
        console.log("user inserted")
        if(error2){
          res.json({msg: error2})
        } else {
          res.json({
            msg: "userInserted",
            email: email,
            name: userName,
            token: newToken
          })
        }
      })
    }
  })
});

router.post('/alexaRegister', (req, res)=>{
  const name = req.body.name;
  const email = req.body.email;
  console.log(email);
  connection.query(`SELECT email FROM users`, (error, results)=>{
    // console.log(results)
    if (error) throw error
    var emailsArray = []
    for (i = 0; i < results.length; i++){
      emailsArray.push(results[i].email)
    }
    if(emailsArray.includes(email)){
      res.json({msg: "userExists"})
    } else {
      var newToken = randToken.uid(40);
      // var insertIntoUsers = `INSERT INTO users (email, name) VALUES (?,?,?,?);`
      connection.query(`INSERT INTO users (email, name, token) VALUES (?,?,?);`, [email, name, newToken], (error2, results2)=>{
        console.log("user inserted")
        if(error2){
          res.json({msg: error2})
        } else {
          res.json({
            msg: "userInserted",
            token: newToken
          })
        }
      })
    }
  })
});

router.post('/mobileLogin', (req, res)=>{
  var email = req.body.email;
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
      const updateToken = 'UPDATE users SET token=?';
      var token = randToken.uid(40);
      connection.query(updateToken, [token], (err, results)=>{
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
  var token = req.body.token
  var habitCount = 0
  var email;
  var checkPromise = new Promise((resolve, reject)=>{
    var checkQuery = 'SELECT t1.email, t2.name FROM (SELECT email FROM users WHERE token = ?) t1 JOIN addedHabits t2 on t1.email = t2.email AND t2.name = ?;';
    connection.query(checkQuery, [token, habitName], (error1, results1)=>{
      if(error1) throw error1;
      console.log(results1);
      if(results1.length > 0){
        email = results1[0].email;
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
  var token = req.body.token;
  console.log(req.body)
  if(token.length <= 1){
    res.json({msg: 'InvalidEmail'});
  }else{
    var getListQuery = 'SELECT t2.name FROM (SELECT email FROM users WHERE token = ?) t1 JOIN addedHabits t2 on t1.email = t2.email;';
    connection.query(getListQuery, [token], (error, results)=>{
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
  var token = req.body.token;
  var activeNotification = req.body.notification;
  var emailPromise = new Promise((resolve, reject)=>{
    var emailQuery = 'SELECT email FROM users WHERE token = ?;';
    connection.query(emailQuery, [token], (error, results)=>{
      if(error) throw error;
      if(results.length > 0){
        resolve(results[0].email)
      }else{
        reject('emailNotExists');
      }
      
    })
  });
  emailPromise.then((email)=>{
    var manageNotificationQuery = 'UPDATE addedHabits SET notification = ? WHERE email = ?;';
    connection.query(manageNotificationQuery, [activeNotification, email], (error, results)=>{
      if(error) {res.json({msg: 'notificationFailed'})}
      else{
        if(activeNotification === 1){
          res.json({msg: 'notificationOn'});
        }else{
          res.json({msg: 'notificationOff'});
        }
      };
    });
  })
  .catch((error)=>{
    res.json(error);
  })
})

router.post('/checkinMyHabit', (req, res)=> {
  var token = req.body.token
  var habitName = req.body.habitName
  var checkFrequency = 'SELECT t1.email, t2.updatedFrequency FROM (SELECT email FROM users WHERE token = ?) t1 JOIN addedHabits t2 ON t1.email = t2.email AND t2.name = ?;';
  var email;
  var aPromise = new Promise((resolve, reject)=>{
    connection.query(checkFrequency, [token, habitName],(err, resp)=>{
      console.log(resp);
      if (err){
        throw err
      } else {
        if(resp.length > 0){
          if (resp[0].updatedFrequency == 0){
            reject("outOfFrequency")
          } else {
            email = resp[0].email;
            resolve(resp[0].email);
          }
        }
        else{
          reject("habitNotExists")
        }
      }
    })
  })
  aPromise.then((email)=>{
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
});

router.post('/getMyRank', (req, res)=>{
  var token = req.body.token
  var habitName = req.body.habitName

  var rankQuery = `SELECT t2.count, t2.rank FROM (SELECT email FROM users WHERE token = ?) t1 JOIN addedHabits t2 on t1.email = t2.email AND t2.name = ?;`

  connection.query(rankQuery, [token, habitName], (error, results)=>{
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
  var token = req.body.token
  var habitName = req.body.habitName
  var email;
  var aPromise = new Promise((resolve, reject)=>{
    connection.query(`SELECT t1.email, t2.name FROM (SELECT email FROM users WHERE token = ?) t1 JOIN addedHabits t2 on t1.email = t2.email`, [token],(error1, resp)=>{
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
          email = resp[0].email;
          resolve()
        }
      }
    })
  })

  aPromise.then(()=>{
    var leaveHabitQuery = `DELETE FROM addedHabits WHERE email = ? AND name = ?;`
    var thePromise = new Promise((resolve, reject)=>{
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