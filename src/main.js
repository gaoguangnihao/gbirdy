import 'pixi';
import 'p2';
import Phaser from 'phaser';
import menu from './states/menu';
import score from './states/score';
import options from './states/options';
import about from './states/about';
import game from './states/game';
import config from './config';
import utils from './utils'
import './plugin/softkey';
import './plugin/l10n';
import '../style/style.css';

class Game extends Phaser.Game {
  constructor () {
    const docElement = document.documentElement;
    // Set scale rate for mobile
    if (window.cordova && 
      ('android' === window.cordova.platformId || 
      'ios' === window.cordova.platformId)) {
      config.scaleConfig.hScale =  docElement.clientWidth/config.gameConfig.gameWidth;
      config.scaleConfig.vScale = docElement.clientHeight/config.gameConfig.gameHeight;
    } else if (window.cordova && 
      'browser' === window.cordova.platformId) {
      config.scaleConfig.vScale = docElement.clientHeight/config.gameConfig.gameHeight;
      config.scaleConfig.hScale = config.scaleConfig.vScale;
    }

    utils.debug('config.width:' + config.gameConfig.gameWidth 
       + ' config.height:' + config.gameConfig.gameHeight
       + ' doc.clientWidth:' + docElement.clientWidth
       + ' doc.clientHeight' + docElement.clientHeight
       + ' vScale:' +  config.scaleConfig.vScale
       + ' hScale:' + config.scaleConfig.hScale);

    let co = {
        type: Phaser.CANVAS,
        parent: 'content',
        width: config.gameConfig.gameWidth,
        height: config.gameConfig.gameHeight,
    };
    super(co);
    this.state.add('menu', menu, false);
    this.state.add('game', game, false);
    this.state.add('about', about, false);
    this.state.add('options', options, false);
    this.state.add('score', score, false);
  }
}
window.game = new Game();
window.game.config = config;

if (window.cordova) {
  utils.debug('cordova:' + JSON.stringify(window.cordova));
  var app = {
    initialize: function () {
      document.addEventListener(
        'deviceready',
        this.onDeviceReady.bind(this),
        false
      )
    },

    // deviceready Event Handler
    //
    onDeviceReady: function () {
      utils.debug('onDeviceReady');
      this.receivedEvent('deviceready')

      // When the device is ready, start Phaser Boot state.
      window.game.state.start('menu')
    },

    receivedEvent: function (id) {
      console.log('Received Event: ' + id)
    }
  }

  app.initialize()
} else {
  window.game.state.start('menu')
}
