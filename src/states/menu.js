import Phaser from 'phaser';
import utils from '../utils';

export default class extends Phaser.State {
  init () {
    this.game.scale.pageAlignHorizontally = true;
    this.game.scale.pageAlignVertically = true;
    this.game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
    this.game.scale.setUserScale(this.game.config.scaleConfig.hScale,
      this.game.config.scaleConfig.vScale);
  }

  preload () {
    this.locale = window.locale.getLocale();
    this.load.image('bg', 'assets/bg-home.png');
  }

  create () {
    console.log('menu create');
    this.add.tileSprite(0, 0, 240, 320, 'bg');

    this.renderText();
    this.bind();
  }

  renderText () {
    var start = this.add.text(this.game.world.centerX, this.game.world.centerY + 26, this.locale('start').toUpperCase(), { font: '20px', 'fontWeight': '800', fill: '#fff' });
    start.setShadow(2, 2, 'rgba(0, 0, 0, 0.3)');
    start.anchor.set(0.5);
  }

  onTouchStartHandler (evt) {
    utils.debug('touch start evt:' + JSON.stringify(evt.target));
    this.game.state.start('game');
  }

  bind () {
    this.softkey = this.game.plugins.add(Phaser.Plugin.Softkey);
    var skGroup = this.softkey.config({
      fontSize: '16px',
      fontColor: '#ffffff',
      lsk: this.locale('score'),
      rsk: this.locale('options')
    });

    skGroup.children.forEach(function (item) {
      item.setShadow(2, 2, 'rgba(0, 0, 0, 0.3)', 0);
    });

    this.input.touch.onTouchStart = this.onTouchStartHandler;

    this.softkey.listener({
      softLeft: function () {
        window.game.state.start('score');
      },
      enter: function () {
        window.game.state.start('game');
      },
      softRight: function () {
        window.game.state.start('options');
      }
    });
  }
}
