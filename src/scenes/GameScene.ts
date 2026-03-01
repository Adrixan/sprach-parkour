import Phaser from 'phaser';
import { GrammarQuestion, getRandomQuestion } from '../data/GrammarData';
import QuestionUI from '../ui/QuestionUI';

interface GameSceneData {
  difficulty: 'Primar' | 'Sekundar';
}

export default class GameScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private platforms!: Phaser.Physics.Arcade.Group;
  private obstacles!: Phaser.Arcade.Group;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private score: number = 0;
  private lives: number = 3;
  private scoreText!: Phaser.GameObjects.Text;
  private livesText!: Phaser.GameObjects.Text;
  private difficulty!: 'Primar' | 'Sekundar';
  private isBulletTime: boolean = false;
  private currentQuestion!: GrammarQuestion;
  private failedQuestions: GrammarQuestion[] = [];
  private questionUI!: QuestionUI;
  private background!: Phaser.GameObjects.TileSprite;
  private isPaused: boolean = false;

  constructor() {
    super({ key: 'GameScene' });
  }

  init(data: GameSceneData): void {
    this.difficulty = data.difficulty;
    this.score = 0;
    this.lives = 3;
    this.failedQuestions = [];
  }

  create(): void {
    // Background (scrolling)
    this.background = this.add.tileSprite(400, 300, 800, 600, 'sky');

    // Platforms
    this.platforms = this.physics.add.group({
      key: 'platform',
      repeat: 5,
      setXY: { x: 0, y: 550, stepX: 160 }
    });

    this.platforms.children.iterate((child) => {
      const platform = child as Phaser.Physics.Arcade.Image;
      platform.setScale(2).refreshBody();
    });

    // Ground platform
    const ground = this.platforms.create(400, 568, 'platform').setScale(2).refreshBody();
    ground.body?.setAllowGravity(false);
    ground.setVisible(true);

    // Player
    this.player = this.physics.add.sprite(150, 450, 'dude');
    this.player.setBounce(0.1);
    this.player.setCollideWorldBounds(true);

    // Player animations
    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'turn',
      frames: [{ key: 'dude', frame: 4 }],
      frameRate: 20
    });

    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1
    });

    // Collisions
    this.physics.add.collider(this.player, this.platforms);

    // Obstacles group
    this.obstacles = this.physics.add.group();

    // Obstacle collision
    this.physics.add.collider(this.player, this.obstacles, this.handleObstacleCollision, undefined, this);

    // UI Text
    this.scoreText = this.add.text(16, 16, 'Punkte: 0', {
      fontFamily: 'Atkinson Hyperlegible',
      fontSize: '24px',
      color: '#000000'
    });

    this.livesText = this.add.text(16, 48, 'Herzen: ❤️❤️❤️', {
      fontFamily: 'Atkinson Hyperlegible',
      fontSize: '24px',
      color: '#FF0000'
    });

    // Keyboard input
    this.cursors = this.input.keyboard.createCursorKeys();

    // Question UI (hidden initially)
    this.questionUI = new QuestionUI(this, this.onAnswerSelected.bind(this));
    this.questionUI.setVisible(false);

    // Spawn obstacles periodically
    this.time.addEvent({
      delay: 2000,
      callback: this.spawnObstacle,
      callbackScope: this,
      loop: true
    });
  }

  update(): void {
    if (this.isPaused) return;

    // Player movement
    if (this.cursors.left?.isDown) {
      this.player.setVelocityX(-160);
      this.player.anims.play('left', true);
    } else if (this.cursors.right?.isDown) {
      this.player.setVelocityX(160);
      this.player.anims.play('right', true);
    } else {
      this.player.setVelocityX(0);
      this.player.anims.play('turn');
    }

    // Jumping
    if (this.cursors.up?.isDown && this.player.body?.touching.down) {
      this.player.setVelocityY(-500);
    }

    // Scroll background
    if (!this.isBulletTime) {
      this.background.tilePositionX += 2;
    }

    // Check for bullet-time trigger
    if (!this.isBulletTime) {
      this.checkBulletTimeTrigger();
    }
  }

  private spawnObstacle(): void {
    if (this.isPaused) return;

    const obstacle = this.obstacles.create(850, 500, 'star');
    obstacle.setVelocityX(-200);
    obstacle.setCollideWorldBounds(false);
    obstacle.setScale(1.5);
  }

  private checkBulletTimeTrigger(): void {
    this.obstacles.children.iterate((obstacle) => {
      const obs = obstacle as Phaser.Physics.Arcade.Sprite;
      const distance = Phaser.Math.Distance.Between(
        this.player.x, this.player.y,
        obs.x, obs.y
      );

      if (distance < 250 && obs.x > this.player.x) {
        this.triggerBulletTime(obs);
      }
    });
  }

  private triggerBulletTime(obstacle: Phaser.Physics.Arcade.Sprite): void {
    this.isBulletTime = true;
    this.isPaused = true;

    // Pause obstacle
    obstacle.setVelocityX(0);

    // Get random question for current difficulty
    this.currentQuestion = getRandomQuestion(this.difficulty);

    // Show question UI
    this.questionUI.show(this.currentQuestion);
  }

  private onAnswerSelected(isCorrect: boolean): void {
    // Resume game
    this.isPaused = false;
    this.isBulletTime = false;

    // Find and remove the stopped obstacle
    this.obstacles.children.iterate((obstacle) => {
      const obs = obstacle as Phaser.Physics.Arcade.Sprite;
      if (obs.body?.velocity.x === 0) {
        obs.destroy();
      }
    });

    if (isCorrect) {
      // Correct answer
      this.score += 100;
      this.scoreText.setText(`Punkte: ${this.score}`);

      // Visual feedback - green flash
      this.cameras.main.flash(200, 0, 255, 0);

      // Player jumps over obstacle
      if (this.player.body?.touching.down) {
        this.player.setVelocityY(-600);
      }
    } else {
      // Wrong answer
      this.lives -= 1;
      this.failedQuestions.push(this.currentQuestion);
      this.updateLivesText();

      // Visual feedback - red flash
      this.cameras.main.flash(200, 255, 0, 0);

      // Player stumbles (flash red)
      this.player.setTint(0xff0000);
      this.time.delayedCall(500, () => {
        this.player.clearTint();
      });

      if (this.lives <= 0) {
        this.gameOver();
      }
    }
  }

  private updateLivesText(): void {
    const hearts = '❤️'.repeat(this.lives);
    this.livesText.setText(`Herzen: ${hearts}`);
  }

  private handleObstacleCollision(): void {
    if (!this.isBulletTime) {
      this.lives -= 1;
      this.updateLivesText();

      // Remove the obstacle that hit the player
      this.obstacles.clear(true, true);

      if (this.lives <= 0) {
        this.gameOver();
      }
    }
  }

  private gameOver(): void {
    this.isPaused = true;
    this.physics.pause();
    this.scene.start('GameOverScene', {
      score: this.score,
      failedQuestions: this.failedQuestions
    });
  }
}
