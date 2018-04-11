import Phaser from 'phaser'

export default class extends Phaser.State {
  softkey= null;
  locale= null;

  preload() {
    this.load.image('bg', 'assets/generic-bg.png');
    this.load.image('about-board', 'assets/board.png');
    this.load.image('kaios', 'assets/kaios-logo.png');
  }

  create() {
  	console.log('menu create');
    this.locale = locale.getLocale();
    this.add.sprite(0, 0, 'bg');
    this.add.sprite(17, 87, 'about-board');
    this.add.sprite(67, 195, 'kaios');

    this.renderText();
    this.bind();
  }

  bind() {
    this.softkey = this.game.plugins.add(Phaser.Plugin.Softkey);
    this.softkey.config({
      fontSize: "16px",
      fontColor: "#ffffff",
      lsk: this.locale('home')
    });
    this.softkey.listener({
      softLeft: function () {
        game.state.start('menu');
      },
      backspace: function() {
        game.state.start('options');
      }
    });
  }

  renderText() {
    var about = game.add.text(game.world.centerX, 120,
    this.locale('about').toUpperCase(), { font:'26px','fontWeight':'800', fill: '#fff', align: "center" }).setShadow(2,2,'rgba(0,0,0,0.3)',3);
    about.anchor.setTo(0.5);

    var text = game.add.text(game.world.centerX, 165,
      this.locale('aboutText'),
      { font: '16px Bebas Neue', fill: '#fff', align: "center" }).setShadow(2,2,'rgba(0,0,0,0.3)',3);

    text.anchor.setTo(0.5,0.5);
    text.wordWrap = true;
    text.wordWrapWidth = 120;
  }
}