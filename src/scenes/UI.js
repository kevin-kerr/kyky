// UI Scene - Persistent HUD
// Displays coins, points, and hunger bar across all scenes

import GameState from '../managers/GameState.js';

export default class UI extends Phaser.Scene {
    constructor() {
        super({ key: 'UI' });
    }

    create() {
        console.log('UI scene started');

        // Create HUD background
        const hudHeight = 60;
        const hudBg = this.add.graphics();
        hudBg.fillStyle(0x34495e, 0.9);
        hudBg.fillRect(0, 0, this.cameras.main.width, hudHeight);

        // Coins display
        this.coinIcon = this.add.circle(30, 30, 15, 0xffd700);
        this.coinText = this.add.text(55, 30, '0', {
            fontSize: '24px',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0, 0.5);

        // Points display
        this.pointIcon = this.add.circle(200, 30, 15, 0x9b59b6);
        this.pointText = this.add.text(225, 30, '0', {
            fontSize: '24px',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0, 0.5);

        // Hunger bar
        const barX = 400;
        const barY = 20;
        const barWidth = 200;
        const barHeight = 20;

        // Hunger bar background (empty)
        this.hungerBarBg = this.add.graphics();
        this.hungerBarBg.fillStyle(0xff0000, 0.3);
        this.hungerBarBg.fillRect(barX, barY, barWidth, barHeight);

        // Hunger bar fill
        this.hungerBarFill = this.add.graphics();

        // Hunger bar label
        this.hungerLabel = this.add.text(barX - 10, barY + 10, 'Hunger:', {
            fontSize: '18px',
            color: '#ffffff'
        }).setOrigin(1, 0.5);

        // Update every second
        this.time.addEvent({
            delay: 1000,
            callback: this.updateUI,
            callbackScope: this,
            loop: true
        });

        // Initial update
        this.updateUI();

        // Set depth to stay on top
        this.children.list.forEach(child => {
            if (child.setScrollFactor) {
                child.setScrollFactor(0);
            }
            if (child.setDepth) {
                child.setDepth(1000);
            }
        });
    }

    updateUI() {
        // Update coin count
        this.coinText.setText(GameState.getCoins());

        // Update points
        this.pointText.setText(GameState.getPoints());

        // Update hunger bar
        const hunger = GameState.updateHunger();
        const barWidth = 200;
        const fillWidth = (hunger / 100) * barWidth;

        this.hungerBarFill.clear();

        // Color changes based on hunger level
        let barColor = 0x2ecc71; // Green
        if (hunger < 30) {
            barColor = 0xff0000; // Red
        } else if (hunger < 60) {
            barColor = 0xf39c12; // Orange
        }

        this.hungerBarFill.fillStyle(barColor, 1);
        this.hungerBarFill.fillRect(400, 20, fillWidth, 20);

        // Change background if pet is starving
        if (hunger === 0) {
            this.cameras.main.setBackgroundColor('#8B0000');
        } else {
            this.cameras.main.setBackgroundColor('#00000000');
        }
    }
}
