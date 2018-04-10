import Phaser from 'phaser'

export default class extends Phaser.State {

  preload() {
 // 	this.locale = locale.getLocale();
    this.load.image('bg', 'assets/bg-home.png');
  }

  create() {
  	console.log('menu create');
  	this.add.tileSprite(0, 0, 240, 320, 'bg');

  	this.renderText();
  	this.bind();
  }

  renderText() {
  	var start = this.add.text(game.world.centerX, game.world.centerY + 26, /*game.locale*/('start').toUpperCase(), { font: '20px', 'fontWeight':'800', fill: '#fff' });
  	start.setShadow(2, 2, 'rgba(0, 0, 0, 0.3)');
  	start.anchor.set(0.5);
  }

  bind() {
  	this.softkey = this.game.plugins.add(Phaser.Plugin.Softkey);
    var skGroup = this.softkey.config({
      fontSize: "16px",
      fontColor: "#ffffff",
      lsk: /*this.locale*/('score'),
      rsk: /*this.locale*/('options'),
    });

    skGroup.children.forEach( function (item) {
      item.setShadow(2,2,'rgba(0, 0, 0, 0.3)',0)
    });

    this.softkey.listener({
      softLeft: function () {
        game.state.start('score');
      },
      enter: function () {
        game.state.start('game');
      },
      softRight: function () {
        game.state.start('options');
      }
    });
  }

}
