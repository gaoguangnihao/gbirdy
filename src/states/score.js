import Phaser from 'phaser';

export default class extends Phaser.State {
  preload () {
    this.load.image('bg', 'assets/generic-bg.png');
    this.load.image('score-table', 'assets/board.png');
  }

  create () {
    this.locale = window.locale.getLocale();
    this.softkey = this.this.game.plugins.add(Phaser.Plugin.Softkey);
    this.add.tileSprite(0, 0, 240, 320, 'bg');
    this.add.sprite(this.game.world.centerX, 160, 'score-table').anchor.set(0.5);
    this.renderText();
    this.bind();
  }

  bind () {
    this.softkey.listener({
      softLeft: function () {
        this.game.state.start('menu');
      },
      backspace: function () {
        this.game.state.start('menu');
      }
    });
  }

  renderText () {
    var texto = this.add.text(this.game.world.centerX, 170, this.loadScore(),
      { font: '70px Bebas Neue', fill: '#fff' });
    texto.anchor.set(0.5);
    texto.setShadow(3, 3, 'rgba(0, 0, 0, 0.30)', 5);
    this.add.text(10, 298, this.locale('home'), { font: '16px Bebas Neue', fill: '#fff' });

    // title score
    var scoreText = this.add.text(this.game.world.centerX, 120, this.locale('score').toUpperCase(), {font: '26px', 'fontWeight': '800', fill: '#fff'});
    scoreText.anchor.set(0.5);
    scoreText.setShadow(3, 3, 'rgba(0, 0, 0, 0.30)', 5);
  }

  loadScore () {
    var score = localStorage.getItem('birdy-score');
    if (null !== score) {
      return score;
    }
    return 0;
  }
}
