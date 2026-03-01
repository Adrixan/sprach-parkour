import Phaser from 'phaser';
import { GrammarQuestion } from '../data/GrammarData';

export default class QuestionUI extends Phaser.Container {
  private background!: Phaser.GameObjects.Rectangle;
  private questionText!: Phaser.GameObjects.Text;
  private feedbackText!: Phaser.GameObjects.Text;
  private buttons: Phaser.GameObjects.Container[] = [];
  private onAnswer: (isCorrect: boolean) => void;
  private currentQuestion!: GrammarQuestion;
  private correctAnswerText!: Phaser.GameObjects.Text;
  private isAnswered: boolean = false;

  constructor(scene: Phaser.Scene, onAnswer: (isCorrect: boolean) => void) {
    super(scene, 400, 300);
    scene.add.existing(this);

    this.onAnswer = onAnswer;
    this.createUI();
  }

  private createUI(): void {
    // Semi-transparent background overlay
    this.background = this.scene.add.rectangle(0, 0, 800, 600, 0x000000, 0.7);
    this.add(this.background);

    // Question panel
    const panel = this.scene.add.rectangle(0, -50, 500, 280, 0xFFFFFF);
    panel.setStrokeStyle(4, 0x333333);
    this.add(panel);

    // Question text placeholder
    this.questionText = this.scene.add.text(0, -140, '', {
      fontFamily: 'Atkinson Hyperlegible',
      fontSize: '24px',
      color: '#000000',
      wordWrap: { width: 450 },
      align: 'center'
    }).setOrigin(0.5);
    this.add(this.questionText);

    // Feedback text (for wrong answers)
    this.feedbackText = this.scene.add.text(0, 50, '', {
      fontFamily: 'Atkinson Hyperlegible',
      fontSize: '18px',
      color: '#666666',
      wordWrap: { width: 450 },
      align: 'center'
    }).setOrigin(0.5);
    this.add(this.feedbackText);

    // Correct answer display
    this.correctAnswerText = this.scene.add.text(0, 90, '', {
      fontFamily: 'Atkinson Hyperlegible',
      fontSize: '22px',
      color: '#00AA00',
      fontStyle: 'bold',
      wordWrap: { width: 450 },
      align: 'center'
    }).setOrigin(0.5);
    this.add(this.correctAnswerText);

    // Create option buttons
    this.createButtons();
  }

  private createButtons(): void {
    const buttonY = 100;
    const buttonWidth = 150;
    const buttonHeight = 50;
    const spacing = 170;

    for (let i = 0; i < 3; i++) {
      const x = (i - 1) * spacing;
      
      const buttonBg = this.scene.add.rectangle(x, buttonY, buttonWidth, buttonHeight, 0x2196F3)
        .setInteractive({ useHandCursor: true });
      
      const buttonText = this.scene.add.text(x, buttonY, '', {
        fontFamily: 'Atkinson Hyperlegible',
        fontSize: '18px',
        color: '#FFFFFF',
        fontStyle: 'bold'
      }).setOrigin(0.5);

      const buttonContainer = this.scene.add.container(0, 0, [buttonBg, buttonText]);
      this.add(buttonContainer);

      // Hover effect
      buttonBg.on('pointerover', () => {
        if (!this.isAnswered) {
          buttonBg.setFillStyle(0x1976D2);
        }
      });

      buttonBg.on('pointerout', () => {
        if (!this.isAnswered) {
          buttonBg.setFillStyle(0x2196F3);
        }
      });

      // Store index for keyboard handling
      (buttonBg as any).buttonIndex = i;
      (buttonText as any).buttonIndex = i;

      this.buttons.push(buttonContainer);
    }
  }

  public show(question: GrammarQuestion): void {
    this.currentQuestion = question;
    this.isAnswered = false;
    this.setVisible(true);

    // Update question text
    this.questionText.setText(question.sentence);

    // Update button labels
    this.buttons.forEach((container, index) => {
      const buttonBg = container.list[0] as Phaser.GameObjects.Rectangle;
      const buttonText = container.list[1] as Phaser.GameObjects.Text;

      buttonText.setText(question.options[index]);
      buttonBg.setFillStyle(0x2196F3);

      // Click handler
      buttonBg.off('pointerdown');
      buttonBg.on('pointerdown', () => {
        this.handleAnswer(index);
      });
    });

    // Clear feedback
    this.feedbackText.setText('');
    this.correctAnswerText.setText('');

    // Setup keyboard input (1, 2, 3 keys)
    this.setupKeyboardInput();
  }

  private setupKeyboardInput(): void {
    const keys = [this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE),
                  this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO),
                  this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.THREE)];

    keys.forEach((key, index) => {
      key.off('down');
      key.on('down', () => {
        if (!this.isAnswered) {
          this.handleAnswer(index);
        }
      });
    });
  }

  private handleAnswer(selectedIndex: number): void {
    if (this.isAnswered) return;
    this.isAnswered = true;

    const selectedAnswer = this.currentQuestion.options[selectedIndex];
    const isCorrect = selectedAnswer === this.currentQuestion.correctAnswer;

    // Highlight selected button
    const selectedButton = this.buttons[selectedIndex];
    const selectedBg = selectedButton.list[0] as Phaser.GameObjects.Rectangle;

    if (isCorrect) {
      selectedBg.setFillStyle(0x00AA00); // Green
      this.scene.cameras.main.flash(200, 0, 255, 0);
      
      // Hide UI after short delay
      this.scene.time.delayedCall(800, () => {
        this.setVisible(false);
        this.onAnswer(true);
      });
    } else {
      selectedBg.setFillStyle(0xFF0000); // Red

      // Show correct answer
      this.currentQuestion.options.forEach((option, index) => {
        if (option === this.currentQuestion.correctAnswer) {
          const correctButton = this.buttons[index];
          const correctBg = correctButton.list[0] as Phaser.GameObjects.Rectangle;
          correctBg.setFillStyle(0x00AA00);
        }
      });

      // Show feedback
      this.feedbackText.setText(this.currentQuestion.feedback);
      this.correctAnswerText.setText(`Richtig: ${this.currentQuestion.correctAnswer}`);

      // Resume after delay
      this.scene.time.delayedCall(2500, () => {
        this.setVisible(false);
        this.onAnswer(false);
      });
    }
  }
}
