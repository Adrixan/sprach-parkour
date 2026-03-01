import Phaser from 'phaser';

interface GameOverSceneData {
  score: number;
  failedQuestions: Array<{
    id: string;
    sentence: string;
    correctAnswer: string;
    feedback: string;
  }>;
}

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameOverScene' });
  }

  create(data: GameOverSceneData): void {
    // Game Over title
    this.add.text(400, 50, 'Game Over', {
      fontFamily: 'Atkinson Hyperlegible',
      fontSize: '56px',
      color: '#FF0000',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Score
    this.add.text(400, 130, `Punkte: ${data.score}`, {
      fontFamily: 'Atkinson Hyperlegible',
      fontSize: '32px',
      color: '#000000'
    }).setOrigin(0.5);

    // Review section
    this.add.text(400, 180, 'Lerne aus deinen Fehlern:', {
      fontFamily: 'Atkinson Hyperlegible',
      fontSize: '20px',
      color: '#333333'
    }).setOrigin(0.5);

    // Display failed questions
    let yOffset = 220;
    if (data.failedQuestions.length === 0) {
      this.add.text(400, 250, 'Keine Fehler! Gut gemacht!', {
        fontFamily: 'Atkinson Hyperlegible',
        fontSize: '20px',
        color: '#00AA00'
      }).setOrigin(0.5);
      yOffset = 300;
    } else {
      data.failedQuestions.forEach((question, index) => {
        const sentenceText = question.sentence;
        const correctText = question.correctAnswer;
        
        // Sentence
        this.add.text(50, yOffset, `${index + 1}. ${sentenceText}`, {
          fontFamily: 'Atkinson Hyperlegible',
          fontSize: '16px',
          color: '#000000',
          wordWrap: { width: 700 }
        });

        yOffset += 25;

        // Correct answer
        this.add.text(50, yOffset, `   ✓ ${correctText}`, {
          fontFamily: 'Atkinson Hyperlegible',
          fontSize: '16px',
          color: '#00AA00',
          fontStyle: 'bold'
        });

        yOffset += 25;

        // Feedback
        this.add.text(50, yOffset, `   💡 ${question.feedback}`, {
          fontFamily: 'Atkinson Hyperlegible',
          fontSize: '14px',
          color: '#666666',
          wordWrap: { width: 700 }
        });

        yOffset += 40;
      });
    }

    // Restart button
    const restartButton = this.add.rectangle(400, 550, 200, 50, 0x4CAF50)
      .setInteractive({ useHandCursor: true });

    const restartText = this.add.text(400, 550, 'Neustart', {
      fontFamily: 'Atkinson Hyperlegible',
      fontSize: '24px',
      color: '#FFFFFF',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    restartButton.on('pointerover', () => {
      restartButton.setFillStyle(0x45a049);
    });

    restartButton.on('pointerout', () => {
      restartButton.setFillStyle(0x4CAF50);
    });

    restartButton.on('pointerdown', () => {
      this.scene.start('MenuScene');
    });
  }
}
