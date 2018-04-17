import Phaser from 'phaser';
import utils from '../utils';
import Softkey from '../plugin/softkey';
import Toucher from '../plugin/touch';
import Mouse from '../plugin/mouse';

export default class baseState extends Phaser.State {
  DEBUG = false;
  name = 'baseState';

  navigator = null;

  constructor () {
    super();
    this.locale = window.locale.getLocale();
  }

  init () {
    this.game.scale.pageAlignHorizontally = true;
    this.game.scale.pageAlignVertically = true;
    this.game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
    this.game.scale.setUserScale(this.game.config.scaleConfig.hScale,
    this.game.config.scaleConfig.vScale);
  }

  bindEvent () {
    if (utils.isKeyPad()) {
      this.debug('softkey');
      this.navigator = window.game.plugins.add(Softkey);
      this.registSoftkey();
    } else if (utils.isMouse()){
      this.navigator = window.game.plugins.add(Mouse);
      this.registMouse();
    } else {
      this.navigator = window.game.plugins.add(Toucher);
      this.registTouch();
    }
  }

  debug (...args) {
    if (this.DEBUG) {
      utils.debug(this.name + ' ' + Array.prototype.join.call(args));
    }
  }

  // Be override 
  registTouch () {}
  registSoftkey () {}
  registMouse () {}
}