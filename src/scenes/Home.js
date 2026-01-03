// Home Scene - Pet Interaction
// Interior view where user can view and feed their pet

import GameState from '../managers/GameState.js';

export default class Home extends Phaser.Scene {
    constructor() {
        super({ key: 'Home' });
    }

    create() {
        console.log('Home scene started');

        // Background
        this.cameras.main.setBackgroundColor('#e8d5b7');

        // Title
        this.add.text(512, 80, 'Your Home', {
            fontSize: '48px',
            color: '#2c3e50',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Floor
        const floor = this.add.graphics();
        floor.fillStyle(0x8B4513, 1);
        floor.fillRect(0, 600, 1024, 168);

        // Pet (Dog - green circle for now)
        const petX = 512;
        const petY = 400;

        this.pet = this.add.graphics();
        this.pet.fillStyle(0x2ecc71, 1);
        this.pet.fillCircle(petX, petY, 50);

        // Pet eyes
        this.pet.fillStyle(0x000000, 1);
        this.pet.fillCircle(petX - 20, petY - 10, 8);
        this.pet.fillCircle(petX + 20, petY - 10, 8);

        // Pet mouth
        this.pet.lineStyle(4, 0x000000, 1);
        this.pet.beginPath();
        this.pet.arc(petX, petY + 10, 20, 0, Math.PI, false);
        this.pet.strokePath();

        // Pet name
        this.add.text(petX, petY + 80, GameState.data.pet.name, {
            fontSize: '32px',
            color: '#2c3e50',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Hunger status
        const hunger = GameState.getHunger();
        this.hungerText = this.add.text(petX, petY + 120, `Hunger: ${hunger}%`, {
            fontSize: '24px',
            color: hunger < 30 ? '#e74c3c' : '#27ae60'
        }).setOrigin(0.5);

        // Feed button
        this.createButton(512, 550, 'Feed Pet (Use Food from Inventory)', () => {
            this.feedPet();
        });

        // Back button
        this.createButton(100, 700, 'Back to Town', () => {
            this.scene.start('Town');
        });

        // Update hunger display every second
        this.time.addEvent({
            delay: 1000,
            callback: this.updateHungerDisplay,
            callbackScope: this,
            loop: true
        });
    }

    feedPet() {
        // For now, just restore hunger directly
        // In full version, this would consume food items from inventory
        const currentHunger = GameState.getHunger();

        if (currentHunger >= 100) {
            this.showMessage('Your pet is not hungry!', 0xf39c12);
        } else {
            // Feed 20 points
            GameState.feedPet(20);
            this.showMessage('Fed your pet! +20 hunger', 0x2ecc71);
            this.updateHungerDisplay();
        }
    }

    updateHungerDisplay() {
        const hunger = GameState.updateHunger();
        this.hungerText.setText(`Hunger: ${hunger}%`);
        this.hungerText.setColor(hunger < 30 ? '#e74c3c' : '#27ae60');
    }

    showMessage(text, color) {
        const message = this.add.text(512, 300, text, {
            fontSize: '28px',
            color: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5);

        this.tweens.add({
            targets: message,
            alpha: 0,
            y: 250,
            duration: 2000,
            ease: 'Power2',
            onComplete: () => {
                message.destroy();
            }
        });
    }

    createButton(x, y, text, callback) {
        const button = this.add.graphics();
        button.fillStyle(0x3498db, 1);
        button.fillRoundedRect(x - 150, y - 30, 300, 60, 10);
        button.lineStyle(3, 0x2c3e50, 1);
        button.strokeRoundedRect(x - 150, y - 30, 300, 60, 10);

        const buttonText = this.add.text(x, y, text, {
            fontSize: '20px',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        const zone = this.add.zone(x, y, 300, 60).setInteractive();

        zone.on('pointerover', () => {
            button.clear();
            button.fillStyle(0x2980b9, 1);
            button.fillRoundedRect(x - 150, y - 30, 300, 60, 10);
            button.lineStyle(3, 0xffff00, 1);
            button.strokeRoundedRect(x - 150, y - 30, 300, 60, 10);
        });

        zone.on('pointerout', () => {
            button.clear();
            button.fillStyle(0x3498db, 1);
            button.fillRoundedRect(x - 150, y - 30, 300, 60, 10);
            button.lineStyle(3, 0x2c3e50, 1);
            button.strokeRoundedRect(x - 150, y - 30, 300, 60, 10);
        });

        zone.on('pointerdown', callback);

        return { button, text: buttonText, zone };
    }
}
