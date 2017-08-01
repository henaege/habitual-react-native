var request = require('request-promise');

module.exports = {
	GetUserEmail: (accessToken) => {
		return new Promise((resolve, reject)=>{
			request({
				url: `https://api.amazon.com/user/profile?access_token=${accessToken}`,
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}

			})
			.then((response)=>{
				// return customer profile
				resolve(JSON.parse(response));
			})
			.catch((error)=>{
				// API Error
				reject('Amazon API Error:', error);
			});
		});
	}
};

