// Boot Scene - First scene to load
// Initializes game systems and launches main scenes

import GameState from '../managers/GameState.js';

export default class Boot extends Phaser.Scene {
    constructor() {
        super({ key: 'Boot' });
    }

    preload() {
        // No assets to load yet (using procedural graphics)
        // Display loading text
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;

        this.add.text(centerX, centerY, 'Math Pet Adventure', {
            fontSize: '48px',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.add.text(centerX, centerY + 60, 'Loading...', {
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0.5);
    }

    create() {
        console.log('Boot scene started');

        // Initialize game state
        GameState.updateHunger();

        // Launch persistent UI scene
        this.scene.launch('UI');

        // Start with Town scene
        this.scene.start('Town');
    }
}
