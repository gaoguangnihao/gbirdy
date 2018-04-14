import Phaser from 'phaser';

export default class extends Phaser.State {
  listenerUp = null;
  listenerDown = null;
  focus = null;
  focus2 = null;
  soundOn = null;
  soundOff= null;
  vibrationOn= null;
  vibrationOff= null;
  softkey= null;
  locale= null;

  preload () {
    this.game.load.image('bg', 'assets/generic-bg.png');
    this.game.load.image('options-board', 'assets/board.png');
    this.game.load.image('on', 'assets/selector-on.png');
    this.game.load.image('off', 'assets/selector-off.png');
    this.game.load.image('focus', 'assets/focus-1.png');
  }

  create () {
    console.log('options create');
    this.locale = window.locale.getLocale();
    this.add.sprite(0, 0, 'bg');
    this.add.sprite(17, 82, 'options-board');
    this.index = 0;
    this.focus = this.game.add.sprite(17, 157, 'focus');
    this.focus.visible = true;
    this.focus2 = this.game.add.sprite(17, 196, 'focus');
    this.focus2.visible = false;

    this.soundOn = this.game.add.sprite(168, 169, 'on');
    this.soundOn.visible = false;
    this.soundOff = this.game.add.sprite(168, 169, 'off');
    this.soundOff.visible = false;

    this.vibrationOn = this.game.add.sprite(168, 206, 'on');
    this.vibrationOn.visible = false;
    this.vibrationOff = this.game.add.sprite(168, 206, 'off');
    this.vibrationOff.visible = false;

    this.renderText();
    this.bind();
    this.loadSound();
    this.loadVibration();
  }

  renderText () {
    var start = this.add.text(this.game.world.centerX, this.game.world.centerY + 26, this.locale('start').toUpperCase(), { font: '20px', 'fontWeight': '800', fill: '#fff' });
    start.setShadow(2, 2, 'rgba(0, 0, 0, 0.3)');
    start.anchor.set(0.5);
  }

  bind () {
    var self = this;
    this.softkey = this.this.game.plugins.add(Phaser.Plugin.Softkey);
    this.softkey.config({
      fontSize: '16px',
      fontColor: '#ffffff',
      lsk: this.locale('home'),
      rsk: this.locale('about')
    });
    this.softkey.listener({
      softLeft: function () {
        this.game.state.start('menu');
      },
      enter: function () {
        self.select();
      },
      softRight: function () {
        this.game.state.start('about');
      },
      backspace: function () {
        this.game.state.start('menu');
      }
    });

    this.listenerUp = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
    this.listenerUp.onDown.add(this.up, this);
    this.listenerDown = this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
    this.listenerDown.onDown.add(this.down, this);
  }

  select () {
    switch (this.index) {
      case 0:
        this.saveData('sound', (!this.soundOn.visible));
        this.loadSound();
        break;
      case 1:
        this.saveData('vibration', (!this.vibrationOn.visible));
        this.loadVibration();
        break;
    }
  }

  up () {
    if (1 === this.index) {
      --this.index;
      this.focus.visible = true;
      this.focus2.visible = false;
    }
  }

  down () {
    if (this.index < 1) {
      ++this.index;
      this.focus.visible = false;
      this.focus2.visible = true;
    }
  }

  saveData (key, value) {
    localStorage.setItem(key, value);
  }

  loadData (key) {
    var value = JSON.parse(localStorage.getItem(key));

    if (null === value || undefined === value) {
      this.saveData(key, true);
      return true;
    }
    return value;
  }

  loadSound () {
    var sound = this.loadData('sound');
    this.soundOn.visible = (true === sound);
    this.soundOff.visible = (false === sound);
  }

  loadVibration () {
    var vibration = this.loadData('vibration');
    this.vibrationOn.visible = (true === vibration);
    this.vibrationOff.visible = (false === vibration);
  }
}
