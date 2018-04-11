import 'pixi';
import 'p2';
import Phaser from 'phaser';
import menu from './states/menu';
import score from './states/score';
import options from './states/options';
import about from './states/about';
import game_start from './states/game';
import config from './config';
import utils from './utils'
import './plugin/softkey';
import './plugin/l10n';
import '../style/style.css';

class Game extends Phaser.Game {
  constructor () {
    utils.debug('game start', '123');
    const docElement = document.documentElement;
    const width = docElement.clientWidth > config.gameConfig.gameWidth ? config.gameConfig.gameWidth : docElement.clientWidth;
    const height = docElement.clientHeight > config.gameConfig.gameHeight ? config.gameConfig.gameHeight : docElement.clientHeight;

    super(width, height, Phaser.CANVAS);

    this.state.add('menu', menu);
    this.state.add('game', game_start);
    this.state.add('about', about);
    this.state.add('options', options);
    this.state.add('score', score);
    this.state.start('menu');

    // with Cordova with need to wait that the device is ready so we will call the Boot state in another file
 //   if (!window.cordova) {
 //     this.state.start('menu')
 //   }
  }
}

window.game = new Game();
window.game.customConfig = config.customConfig;

// if (window.cordova) {
//   var app = {
//     initialize: function () {
//       document.addEventListener(
//         'deviceready',
//         this.onDeviceReady.bind(this),
//         false
//       )
//     },

//     // deviceready Event Handler
//     //
//     onDeviceReady: function () {
//       this.receivedEvent('deviceready')

//       // When the device is ready, start Phaser Boot state.
//       window.game.state.start('menu')
//     },

//     receivedEvent: function (id) {
//       console.log('Received Event: ' + id)
//     }
//   }

//   app.initialize()
// }
