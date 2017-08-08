var request = require('request-promise');

module.exports = {
	Register:(email, name)=>{
		console.log(name);
		return new Promise((resolve, reject)=>{
			request({
					url:'http://test.iamdrewt.net/alexaRegister',
					method: 'POST',
					body:{
						'email': email,
						'name': name
					},
					json: true
			})
			.then((response)=>{
				// console.log(response);
				resolve(response);
			})
			.catch((error)=>{
			// console.log(error);
				reject('Habits API Register Error:', error);
			});
		});
	},
	Login:(email) =>{
		// console.log(email);
		return new Promise((resolve, reject)=>{
			request({
				url:'http://test.iamdrewt.net/alexaLogin',
				method: 'POST',
				body:{
					'email': email,
				},
				json: true
			})
			.then((response)=>{
				resolve(response);
			})
			.catch((error)=>{
				// console.log(error);
				reject('Habits API Login Error:', error);
			});
		})
	},
	GetHabitsCategory: () => {
		return new Promise((resolve, reject)=>{
			request({
				url: `http://test.iamdrewt.net/categorylist`,
				method: 'GET',
				headers:{
					'Content-Type':'application/json'
				},

			})
			.then((response)=>{
				// return customer profile
				resolve(JSON.parse(response));
			})
			.catch((error)=>{
				// API Error
				reject('Habits API Error:', error);
			});
		});
	},
	GetHabitsList:(categoryName)=>{
		return new Promise((resolve, reject)=>{
			request({
				url:'http://test.iamdrewt.net/habitslist',
				method: 'POST',
				body:{
					'categoryName': categoryName
				},
				json: true
			})
			.then((response)=>{
				resolve(response.habitsList);
			})
			.catch((error)=>{
				reject('Habits API List Error:', error);
			});
		});
	},
	CheckinMyHabit:(token, habitName)=>{
		return new Promise((resolve, reject)=>{
			request({
				url:'http://test.iamdrewt.net/checkinMyHabit',
				method:'POST',
				body:{
					'token': token,
					'habitName': habitName
				},
				json: true
			})
			.then((response)=>{
				console.log(response);
				if(response.error){
					reject(response.error)
				}else{
					resolve(response);
				}
			})
			.catch((error)=>{
				console.log(error);
				reject('Habits API MyList Error:', error)
			})
		})
	},
	JoinAHabit: (token, habitName)=>{
		return new Promise((resolve, reject)=>{
			request({
				url: 'http://test.iamdrewt.net/joinAHabit',
				method: 'POST',
				body: {
					'token': token,
					'habitName': habitName,
				},
				json: true
			})
			.then((response)=>{
				console.log(response);
				if(response.msg === 'existedUserHabit'){
					reject('existedUserHabit');
				}
				else{
					resolve(response);
				}
			})
			.catch((error)=>{
				console.log(error);
				reject('Habits API JoinAHabit Error:', error)
			})
		})
	},
	GetMyHabitsList: (token)=>{
		return new Promise((resolve, reject)=>{
			request({
				url: 'http://test.iamdrewt.net/getMyHabitList',
				method:'POST',
				body:{
					'token':token
				},
				json: true
			})
			.then((response)=>{
				if (response.msg === 'habitsList'){
					var habitsList = [];
					response.results.map((habitName)=>{
						habitsList.push(habitName.name)
					})
					resolve(habitsList);

				}else{
					console.log('getMyHabitList error');
					reject(response.msg)
				}
			})
			.catch((error)=>{
				console.log('get my habitlist catch error');
				reject('Habits API MyList Error:', error);
			})
		})
	},
	GetMyRank:(token, habitName)=>{
		return new Promise((resolve, reject)=>{
			request({
				url:'http://test.iamdrewt.net/getMyRank',
				method:'POST',
				body:{
					'token': token,
					'habitName': habitName
				},
				json: true
			})
			.then((response)=>{
				if(response == "NoRank"){
					reject();
				}
				else{
					resolve(response);
				}
			})
			.catch((error)=>{
				console.log(error);
				reject('Habits API MyList Error:', error);
			})
		});
	},
	LeaveHabit:(token, habitName)=>{
		return new Promise((resolve, reject)=>{
			request({
				url:'http://test.iamdrewt.net/leaveHabit',
				method:'POST',
				body:{
					'token': token,
					'habitName': habitName
				},
				json: true
			})
			.then((response)=>{
				console.log(response);
				if(response.msg === 'leftGroup'){
					var habitsList = [];
					response.habitListResponse.map((habit)=>{
						habitsList.push(habit.name);
					});
					resolve(habitsList);
				}
				else{
					var error = response;
					reject(response);
				}
			})
			.catch((error)=>{
				console.log(error);
				reject('Habits API MyList Error:' + error);
			})

		});
	},
	CheckUpdatedTime:(token)=>{
		return new Promise((resolve, reject)=>{
			request({
				url:'http://test.iamdrewt.net/checkUpdatedTime',
				method:'POST',
				body:{
					'token':token
				},
				json: true
			})
			.then((response)=>{
				console.log(response);
				resolve(response);
			})
			.catch((error)=>{
				console.log(error);
				reject('Habits API MyList Error:', error);
			})
		})
	},
	ManageNotification:(token, notification)=>{
		return new Promise((resolve, reject)=>{
			request({
				url: 'http://test.iamdrewt.net/manageNotification',
				method: 'POST',
				body:{
					'token':token,
					'notification': notification
				},
				json: true
			})
			.then((response)=>{
				console.log(response);
				resolve(response);
			})
			.catch((error)=>{
				console.log(error);
				reject('Habits API MyList Error:', error);
			})
		})
	}
};