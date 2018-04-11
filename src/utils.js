

const DEBUG = true;
const TRACE = true;

const utils = {
	centerGameObjects: function(objects) {
		objects.forEach((object) => {
			object.anchor.setTo(0.5);
		});
	},

	debug: function(...args) {
		if (DEBUG) {
		  console.log(
	//	  	'[' + this.name + ']' +
	//	    '[' + Service.currentTime() + '] ' +
		      Array.prototype.join.call(args));
		  if (this.TRACE) {
		    console.trace();
		  }
		}
	}
};

export default utils;