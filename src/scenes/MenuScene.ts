import Phaser from 'phaser';

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  create(): void {
    // Title
    this.add.text(400, 150, 'Der Sprach-Parkour', {
      fontFamily: 'Atkinson Hyperlegible',
      fontSize: '48px',
      color: '#000000',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(400, 220, 'Lerne Deutsch mit Bewegung!', {
      fontFamily: 'Atkinson Hyperlegible',
      fontSize: '24px',
      color: '#333333'
    }).setOrigin(0.5);

    // Primary school button
    this.createMenuButton(400, 350, 'Start: Primarstufe', 'Primar');

    // Secondary school button
    this.createMenuButton(400, 430, 'Start: Sekundarstufe 1', 'Sekundar');

    // Instructions
    this.add.text(400, 520, 'Drücke 1 oder 2 für Antworten | Pfeiltasten zum Steuern', {
      fontFamily: 'Atkinson Hyperlegible',
      fontSize: '14px',
      color: '#555555'
    }).setOrigin(0.5);
  }

  private createMenuButton(x: number, y: number, text: string, difficulty: string): void {
    const buttonWidth = 300;
    const buttonHeight = 50;

    // Button background
    const buttonBg = this.add.rectangle(x, y, buttonWidth, buttonHeight, 0x4CAF50)
      .setInteractive({ useHandCursor: true });

    // Button text
    const buttonText = this.add.text(x, y, text, {
      fontFamily: 'Atkinson Hyperlegible',
      fontSize: '20px',
      color: '#FFFFFF',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Hover effects
    buttonBg.on('pointerover', () => {
      buttonBg.setFillStyle(0x45a049);
    });

    buttonBg.on('pointerout', () => {
      buttonBg.setFillStyle(0x4CAF50);
    });

    // Click handler
    buttonBg.on('pointerdown', () => {
      this.startGame(difficulty);
    });
  }

  private startGame(difficulty: string): void {
    this.scene.start('GameScene', { difficulty });
  }
}
