import BaseState from '../base/base_state';
import utils from '../utils';

export default class extends BaseState {
  name = 'menu';
  DEBUG = true;

  init () {
    super.init();
    this.debug('init');
  }

  preload () {
    this.debug('preload');
    this.load.image('bg', 'assets/bg-home.png');
  }

  create () {
    this.debug('base_state create');
    this.add.tileSprite(0, 0, 240, 320, 'bg');

    var start = this.add.text(this.game.world.centerX, this.game.world.centerY + 26, this.locale('start').toUpperCase(), { font: '20px', 'fontWeight': '800', fill: '#fff' });
    start.setShadow(2, 2, 'rgba(0, 0, 0, 0.3)');
    start.anchor.set(0.5);

    this.bindEvent();
  }

  _generateKeyConfig () {
    return {
      lsk: {
          name:'score',
          style:{
            fontSize: '16px',
            fontColor: '#ffffff',
            shadow:[2, 2, 'rgba(0, 0, 0, 0.3)', 0]
          },
          callback: () => {
            window.game.state.start('score');
          }
        },
        csk: {
          callback: () => {
            window.game.state.start('game');
          }
        },
        rsk: {
          name:'options',
          style:{
            fontSize: '16px',
            fontColor: '#ffffff',
            shadow:[2, 2, 'rgba(0, 0, 0, 0.3)', 0]
          },
          
          callback: () => {
            window.game.state.start('options');
          }
        }
      };
  }
  // Override 
  registSoftkey () {
    this.debug('registSoftkey');
    this.navigator.config(this._generateKeyConfig());
  }

  // Override
  registTouch () {
    this.toucher.config(this._generateKeyConfig());
  }

  // Override 
  registMouse () {
    this.navigator.config(this._generateKeyConfig());
  }
}
