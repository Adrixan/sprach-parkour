import Phaser from 'phaser';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload(): void {
    // Load assets downloaded by the setup script
    this.load.image('sky', 'assets/sky.png');
    this.load.image('platform', 'assets/platform.png');
    this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
    this.load.image('star', 'assets/star.png');
  }

  create(): void {
    // Generate fallback textures in case assets fail to load
    this.generateFallbackTextures();
    
    // Transition to MenuScene
    this.scene.start('MenuScene');
  }

  private generateFallbackTextures(): void {
    // Fallback sky background
    if (!this.textures.exists('sky')) {
      const sky = this.add.graphics();
      sky.fillStyle(0x87CEEB, 1);
      sky.fillRect(0, 0, 800, 600);
      sky.generateTexture('sky', 800, 600);
    }

    // Fallback platform
    if (!this.textures.exists('platform')) {
      const platform = this.add.graphics();
      platform.fillStyle(0x654321, 1);
      platform.fillRect(0, 0, 400, 32);
      platform.generateTexture('platform', 400, 32);
    }

    // Fallback player sprite
    if (!this.textures.exists('dude')) {
      const dude = this.add.graphics();
      dude.fillStyle(0xFF6600, 1);
      dude.fillRect(0, 0, 32, 48);
      dude.generateTexture('dude', 32, 48);
    }

    // Fallback star (for obstacle)
    if (!this.textures.exists('star')) {
      const star = this.add.graphics();
      star.fillStyle(0xFF0000, 1);
      star.fillRect(0, 0, 32, 32);
      star.generateTexture('star', 32, 32);
    }
  }
}
