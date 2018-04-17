import Phaser from 'phaser';
import utils from '../utils';

export default class toucher extends Phaser.Plugin {
  constructor (game, parent) {
    super(game, parent);
    utils.debug('touch_handler constructor');
  }

  init () {
    utils.debug('touch_handler init');
    this.skGroup = window.game.add.group();
    this.lsk = window.game.add.text(10, window.game.height - 12, '', { font: '16px Arial', fill: '#ffffff' });
    this.csk = window.game.add.text(window.game.world.centerX, window.game.height - 12, '', { font: '16px Arial', fill: '#ffffff' });
    this.rsk = window.game.add.text(190, window.game.height - 12, '', { font: '16px Arial', fill: '#ffffff' });
    this._adjustMargin();
  }

  _adjustMargin (arg) {
    this.lsk.x = 10 + this.lsk.width / 2;
    this.lsk.anchor.setTo(0.5);

    this.csk.anchor.setTo(0.5);

    this.rsk.anchor.setTo(0.5);
    this.rsk.x = window.game.width - 10 - this.rsk.width / 2;
  }

  _onTouchStart (evt, arg) {
    utils.debug('touch start evt:' + JSON.stringify(evt.target));
    arg.csk && arg.csk.callback();
  }



  _listener (arg) {
    let self = this;
    window.game.input.touch.onTouchStart = function(evt) {
      self._onTouchStart(evt, arg);
    };
  }
  // public 
  config (arg) {
    if (!arg) {
      return;
    }
    if (arg.lsk) {
      this.lsk.text = arg.lsk.name || '';
      this.lsk.font = window.game.config.customConfig.fontStyle.font;
      if (this.lsk.style) {
        this.lsk.fill = arg.lsk.style.fontColor || '#FFFFFF';
        this.lsk.fontSize = arg.lsk.style.fontSize || window.game.config.customConfig.fontStyle.fontSize;
        this.lsk.setShadow.apply(this.lsk, arg.lsk.style.shadow);
      }
      this.skGroup.add(this.lsk);
    }
    if (arg.csk) {
      this.csk.text = arg.csk.name || '';
      this.csk.font = window.game.config.customConfig.fontStyle.font;
      if (arg.csk.style) {
        this.csk.fill = arg.csk.style.fontColor || '#FFFFFF';
        this.csk.fontSize = arg.csk.style.fontSize || window.game.config.customConfig.fontStyle.fontSize;
        this.csk.setShadow.apply(this.csk, arg.csk.style.shadow);
      }
      this.skGroup.add(this.csk);
    }

    if (arg.rsk) {
      this.rsk.text = arg.rsk.name || '';
      this.rsk.font = window.game.config.customConfig.fontStyle.font;
      if (arg.rsk.style) {
        this.rsk.fill = arg.rsk.style.fontColor || '#FFFFFF';
        this.rsk.fontSize = arg.rsk.style.fontSize || window.game.config.customConfig.fontStyle.fontSize;
        this.rsk.setShadow.apply(this.rsk, arg.rsk.style.shadow);
      }
      this.skGroup.add(this.rsk);
    }
    this._adjustMargin();
    this._listener(arg);
    return this.skGroup;
  }
}