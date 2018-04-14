
const config = {
	gameConfig: Object.freeze({
	  gameWidth: 240,
	  gameHeight: 320,
	  localStorageName: 'gbird',
	  webfonts: ['Bangers']
	}),

	customConfig: Object.freeze({
	    debug: false,
	    fontStyle: Object.freeze({
	        "font": "Bebas Neue",
	        "fontSize": "20px",
	        "fill": "#FFFFFF"
	    })
	}),

	scaleConfig: {
		hScale: 1,
		vScale: 1
	}
}

export default config;
