module.exports = function convertArrayToReadableString(array) {
	if(array.length <= 1){
		return array[0];
	}else{
		var readableString = ``;
		for (var i = 0; i < array.length; i++) {
		  if (i === (array.length - 1)) {
		    readableString += `and ${array[i]}.`;
		  } else {
		    readableString += `${array[i]}, `;
		  }
		}
		return readableString;
	}
};