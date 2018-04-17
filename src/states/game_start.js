import BaseState from '../base/base_state';
import utils from '../utils';
export default class extends BaseState {
  softkey= null;
  locale= null;
  skGroup= null;
  currentPosY = 0;
  highScore = 0;
  gameState = {
    INGAME: 'INGAME',
    STANDBY: 'STANDBY',
    YOULOSE: 'YOULOSE',
    YOUWIN: 'YOUWIN',
    OPTIONS: 'OPTIONS',
    BACKSPACE: 'BACKSPACE',
    ENDCALL: 'ENDCALL',
    SCORE: 'SCORE'
  };

  preload () {
    this.load.image('logo', 'assets/birdy-logo.png');
    this.load.image('bg-dialog', 'assets/dialog.png');
    this.load.image('obstacle-up', 'assets/obstacle-up.png');
    this.load.image('obstacle-down', 'assets/obstacle-down.png');
    this.load.image('background', 'assets/game-scenario.png');
    this.load.image('gameOverTitle', 'assets/game-over.png');
    this.load.image('gameOverScore', 'assets/ctn-game-over-board.png');
    this.load.image('bg-game-over', 'assets/bg-game-over.png');
    this.load.image('bg-options', 'assets/bg-options.png');
    this.load.image('bg-exit', 'assets/bg-exit.png');
    this.load.image('pause-board', 'assets/board.png');
    this.load.image('score-table', 'assets/score-table.png');
    this.load.image('focus', 'assets/focus-1.png');
    this.load.image('on', 'assets/selector-on.png');
    this.load.image('off', 'assets/selector-off.png');
    this.load.spritesheet('bird', 'assets/birdy.png', 76.42, 38);
    this.load.audio('jump', 'assets/jump.wav');
  }

  create () {
    this.locale = window.locale.getLocale();
    this.switchState(this.gameState.INGAME);
    this.background = this.add.tileSprite(0, 0, 447, 320, 'background');
    this.currentScore = 0;
    this.highScore = localStorage.getItem('birdy-score');
    this.pipes = this.add.group();
    this.currentState = this.gameState.STANDBY;
    this.isPaused = false;
    this.isStarted = false;

    // Initializing jump fx
    this.jumpSound = this.game.add.audio('jump');
    this.btBlock = false;

    // score text
    this.scoreText = this.game.add.text(this.game.world.centerX, 38, 0, {
      font: '30px Bebas Neue',
      fill: '#ffffff',
      stroke: '#000',
      strokeThickness: '2'
    });
    this.scoreText.anchor.set(0.5);

    // Game init config
    this.physics.startSystem(Phaser.Physics.ARCADE);
    this.bird = this.add.sprite(50, 150, 'bird');
    this.physics.arcade.enable(this.bird);

    this.bird.body.width = 10;
    this.physics.setBoundsToWorld();

    this.bird.scale.setTo(0.6, 0.6);
    this.bird.body.gravity.y = 500;
    this.bird.body.setCircle(20, 20);
    this.bird.animations.add('jump', [0, 1, 3, 4, 0], 10);
    this.bird.animations.add('hit', [6], 10);
    this.createObstacle();

    this.pipes.setAll('body.velocity.x', -120);
    this.input.keyboard.addKey(Phaser.Keyboard.FIVE).onDown.add(this.jump, this);
    this.helpText = this.add.text(this.game.world.centerX, 200, this.locale('helpText'), {
      font: '20px Bebas Neue',
      fill: '#FFF',
      strokeThickness: 2,
      stroke: '#FFFFF'
    });
    this.helpText.anchor.set(0.5);
    this.paused = true;

    // bind input event
    this.bindEvent();
  }

  update () {
    if (this.bird.y > 320) {
      this.stopPipes();
      this.gameOver();
    }
    // avoids the bird pass through the margin top
    if (this.bird.y <= 20) {
      this.bird.body.velocity.y = 40;
    }

    if (this.bird.y < this.currentPosY) {
      this.bird.animations.play('fall');
    }

    // check if the bird hits the pipes
    this.physics.arcade.overlap(this.bird, this.pipes, this.hitPipe, null, this);

    if (this.bird.alive) {
      this.background.tilePosition.x -= 0.4;

      if (48 === this.pipes.children[0].position.x) {
        this.currentScore++;
        this.scoreText.text = this.currentScore;
      }
    }
    if (this.bird.body.velocity.y > 240) {
      this.bird.body.velocity.y = 300;
    }

    if (this.bird.angle < 20) {
      this.bird.angle += 1;
    }
  }

  createObstacle (x, y) {
    var pipe = this.add.sprite(400, -128, 'obstacle-up');
    this.pipeDown = this.add.sprite(pipe.x, 198, 'obstacle-down');
    pipe.checkWorldBounds = true;
    this.pipeDown.checkWorldBounds = true;
    this.physics.arcade.enable([pipe, this.pipeDown]);

    this.pipes.addMultiple([pipe, this.pipeDown]);

    pipe.events.onOutOfBounds.add(this.obstacleOut, this);
  }

  obstacleOut (pipeUp) {
    if (pipeUp.body.position.x < 0) {
      pipeUp.position.x = this.game.width;
      var indexY = this.game.rnd.integerInRange(1, 6);
      pipeUp.position.y = -(indexY * 32);
      this.pipeDown.x = pipeUp.position.x;
      this.pipeDown.y = (9.9 - indexY) * 32;
    }
  }

  jump () {
    // show lsk 'restart'
    this.showLeftSoftKey(this.skGroup);

    if (this.gameState.STANDBY === this.currentState) {
      this.currentState = this.gameState.INGAME;
      this.helpText.destroy();
      this.game.paused = false;
      this.isPaused = false;
      this.isStarted = true;
    }

    if (false === this.bird.alive) { return; }

    // if (Render.Options.loadData('sound')) {
    this.jumpSound.play();
    // }

    this.bird.animations.play('jump');
    this.bird.body.velocity.y = -240;
    var animation = this.game.add.tween(this.bird);

    animation.to({angle: -20}, 100);
    animation.start();

    // stores current position after jumping
    this.currentPosY = this.bird.y;
  }

  stopPipes () {
    this.pipes.setAll('body.velocity.x', 0);
  }

  hitPipe () {
    if (false === this.bird.alive) { return; }
    this.bird.scale.setTo(1);
    this.bird.animations.play('hit');
    // check if vibration is enabled
    // if (Render.Options.loadData('vibration')) {
    navigator.vibrate(300);
    // }

    this.bird.alive = false;

    this.stopPipes();
    this.saveScore();
  }

  switchState (nextState) {
    this.currentState = nextState;
  }

  restartGame () {
    this.game.state.start('game');
  }

  render () {
    // this.game.debug.body(this.rede);
    // this.game.debug.spriteInfo(this.rede, 32, 32);
  }

  saveScore () {
    if (this.currentScore > this.highScore) {
      this.highScore = this.currentScore;
      localStorage.setItem('birdy-score', this.highScore);
    }
  }

  gameOver () {
    if (this.currentState !== this.gameState.YOULOSE) {
      this.game.add.sprite(0, 0, 'bg-game-over');
      this.game.add.sprite(25, 35, 'gameOverTitle');

      this.game.add.sprite(2, 141, 'gameOverScore');

      this.game.add.text(10, 291, this.locale('home'), {font: '16px Bebas Neue', fill: '#fff'});
      this.game.add.text(175, 291, this.locale('playAgain'), {font: '16px Bebas Neue', fill: '#fff'});

      var textScore = this.game.add.text(this.game.world.centerX, 206, this.currentScore, {
        font: '40px Bebas Neue',
        fill: '#fff',
        align: 'center'
      }).setShadow(2, 2, 'rgba(0,0,0,0.3)', 3);
      textScore.anchor.set(0.5, 0);

      var yourScore = this.game.add.text(this.game.world.centerX, 190,
        this.locale('yourScore').toUpperCase(), {font: '20px', 'fontWeight': '800', fill: '#fff'}).setShadow(2, 2, 'rgba(0,0,0,0.3)', 3);
      yourScore.anchor.setTo(0.5);
      this.bird.kill();

      this.switchState(this.gameState.YOULOSE);

      this.saveScore();
    }
  }

  _generateKeyConfig () {
    var self = this;
    return {
      lsk: {
        name:'restart',
        style:{
          fontSize: '16px',
          fontColor: '#ffffff',
          shadow:[3, 3, 'rgba(0, 0, 0, 0.3)', 5]
        },
        callback: () => {
          if (self.currentState === self.gameState.YOULOSE ||
            self.currentState === self.gameState.YOUWIN) {
            this.game.state.start('menu');
          }
          if (self.currentState === self.gameState.INGAME) {
            this.game.paused = false;
            this.game.state.start('game');
          } else if (self.currentState === self.gameState.SCORE) {
            this.game.paused = false;
            this.game.state.start('menu');
          }
          if (self.currentState === self.gameState.BACKSPACE ||
            self.currentState === self.gameState.ENDCALL) {
            if (self.gameState.STANDBY === self.previousState) {
              self.switchState(self.gameState.STANDBY);
              self.skGroup.visible = true;
              // Render.Confirm.hide();
            } else {
              if (self.isPaused) {
                self.switchState(self.gameState.OPTIONS);
              } else {
                this.game.paused = false;
                self.switchState(self.gameState.INGAME);
              }
              self.canMove = true;
              self.skGroup.visible = true;
              // Render.Confirm.hide();
            }
          } else if (self.currentState === self.gameState.OPTIONS) {
            this.game.paused = false;
            this.game.state.start('menu');
          }
        }
      },
      csk: {
        callback: () => {
          if (self.currentState === self.gameState.INGAME ||
            self.currentState === self.gameState.STANDBY) {
            self.jump();
          } else if (self.currentState === self.gameState.OPTIONS) {
            // Render.Options.selectOpValue();
          } else if (self.currentState === self.gameState.YOUWIN) {
            self.switchState(self.gameState.INGAME);
            self.canMove = true;
            // Render.YouWin.hide(self);
          }

          if (self.currentState === self.gameState.STANDBY) {
            self.currentState = self.gameState.INGAME;
          }
        }
      },
      rsk: {
        name:'options',
        style:{
          fontSize: '16px',
          fontColor: '#ffffff',
          shadow:[3, 3, 'rgba(0, 0, 0, 0.3)', 5]
        },
        callback: () => {
          if (self.btBlock) {
            return;
          }
          if (self.currentState === self.gameState.INGAME ||
            self.currentState === self.gameState.STANDBY) {
            self.canMove = false;
            self.isPaused = true;
            this.game.paused = true;
            // Render.Options.show(self);
            self.skGroup.visible = false;
          } else if (self.currentState === self.gameState.OPTIONS) {
            if (!self.isStarted) {
              this.game.paused = true;
              // Render.Options.hide(self);
              self.skGroup.visible = true;
              self.switchState(self.gameState.STANDBY);
              return;
            }
            self.canMove = true;
            self.isPaused = false;
            this.game.paused = false;
            // Render.Options.hide(self);
            self.skGroup.visible = true;
            self.switchState(self.gameState.INGAME);
          } else if (self.currentState === self.gameState.YOULOSE) {
            self.btBlock = true;
            self.switchState(self.gameState.STANDBY);
            this.game.state.start(this.game.state.current);
            setTimeout(function () {
              self.btBlock = false;
            }, 200);
          } else if (self.currentState === self.gameState.YOUWIN) {
            self.switchState(self.gameState.INGAME);
            this.game.state.start(this.game.state.current);
            // Render.YouWin.hide(self);
          }
          if (self.currentState === self.gameState.BACKSPACE) {
            this.game.paused = false;
            window.close();
          }
          if (self.currentState === self.gameState.ENDCALL) {
            window.close();
          }
        }
      },

      backspace: {
        callback: () => {
          if (self.currentState === self.gameState.ENDCALL ||
            self.currentState === self.gameState.BACKSPACE) {
            return;
          }
          self.previousState = self.currentState;

          self.switchState(self.gameState.BACKSPACE);
          self.skGroup.visible = false;
          this.game.paused = true;
          // Render.Confirm.show(self.locale('confirmText'), self);
        }
      },

      endcall: {
        callback: () => {
          if (self.currentState === self.gameState.ENDCALL ||
            self.currentState === self.gameState.BACKSPACE) {
            return;
          }
          self.previousState = self.currentState;

          self.skGroup.visible = false;
          self.switchState(self.gameState.ENDCALL);
          this.game.paused = true;
          // Render.Confirm.show(self.locale('confirmText'), self);
        }
      }
    };
  }

  // Override 
  registSoftkey () {
    this.debug('registSoftkey');
    this.skGroup = this.navigator.config(this._generateKeyConfig());
  }

  // Override
  registTouch () {
    this.skGroup = this.toucher.config(this._generateKeyConfig());
  }

  // Override 
  registMouse () {
    this.skGroup = this.navigator.config(this._generateKeyConfig());
  }

  hideLeftSoftKey (skGroup) {
    skGroup.children[0].visible = false;
  }

  showLeftSoftKey (skGroup) {
    skGroup.children[0].visible = true;
  }
};

document.addEventListener('visibilitychange', function (e) {
  if (document.hidden) {
    // if ('INGAME' === game_start.currentState) {
    //   game_start.isPaused = true;
    //   this.game.paused = true;
    //   game_start.canMove = false;
    //   // Render.Options.show(game_start);
    //   game_start.switchState(game_start.gameState.OPTIONS);
    // }
  }
});
