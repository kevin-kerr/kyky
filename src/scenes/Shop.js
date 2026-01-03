// Shop Scene - Reusable store for Grocery, Treats, and Furniture
// Displays items for purchase with coin costs

import GameState from '../managers/GameState.js';

export default class Shop extends Phaser.Scene {
    constructor() {
        super({ key: 'Shop' });
    }

    init(data) {
        this.shopType = data.shopType || 'grocery';
    }

    create() {
        console.log(`Shop scene started: ${this.shopType}`);

        // Background
        this.cameras.main.setBackgroundColor('#f5f5dc');

        // Shop data
        const shopData = this.getShopData();

        // Title
        this.add.text(512, 80, shopData.title, {
            fontSize: '48px',
            color: '#2c3e50',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.add.text(512, 130, shopData.description, {
            fontSize: '20px',
            color: '#7f8c8d'
        }).setOrigin(0.5);

        // Display items in a grid
        const startX = 200;
        const startY = 220;
        const spacing = 250;

        shopData.items.forEach((item, index) => {
            const col = index % 3;
            const row = Math.floor(index / 3);
            const x = startX + col * spacing;
            const y = startY + row * 150;

            this.createShopItem(x, y, item);
        });

        // Back button
        this.createButton(100, 700, 'Back to Town', () => {
            this.scene.start('Town');
        });
    }

    getShopData() {
        const shops = {
            grocery: {
                title: 'Grocery Store',
                description: 'Buy food to keep your pet healthy',
                items: [
                    { name: 'Apple', cost: 5, hunger: 10, color: 0xff0000, id: 'apple' },
                    { name: 'Bread', cost: 8, hunger: 15, color: 0xdeb887, id: 'bread' },
                    { name: 'Milk', cost: 10, hunger: 20, color: 0xffffff, id: 'milk' },
                    { name: 'Steak', cost: 15, hunger: 30, color: 0x8B0000, id: 'steak' }
                ]
            },
            treats: {
                title: 'Treat Shop',
                description: 'Special treats for your pet',
                items: [
                    { name: 'Cookie', cost: 12, hunger: 15, color: 0xd2691e, id: 'cookie' },
                    { name: 'Cake', cost: 20, hunger: 25, color: 0xffb6c1, id: 'cake' },
                    { name: 'Ice Cream', cost: 18, hunger: 20, color: 0xffc0cb, id: 'icecream' }
                ]
            },
            furniture: {
                title: 'Furniture Store',
                description: 'Decorate your home',
                items: [
                    { name: 'Couch', cost: 50, color: 0x8b4513, id: 'couch' },
                    { name: 'Table', cost: 30, color: 0xa0522d, id: 'table' },
                    { name: 'Lamp', cost: 25, color: 0xffff00, id: 'lamp' },
                    { name: 'Rug', cost: 40, color: 0xdc143c, id: 'rug' }
                ]
            }
        };

        return shops[this.shopType] || shops.grocery;
    }

    createShopItem(x, y, item) {
        // Item visual (colored square)
        const itemGraphic = this.add.graphics();
        itemGraphic.fillStyle(item.color, 1);
        itemGraphic.fillRect(x - 40, y - 40, 80, 80);
        itemGraphic.lineStyle(3, 0x000000, 1);
        itemGraphic.strokeRect(x - 40, y - 40, 80, 80);

        // Item name
        this.add.text(x, y + 60, item.name, {
            fontSize: '18px',
            color: '#2c3e50',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Cost
        const costText = this.add.text(x, y + 85, `${item.cost} coins`, {
            fontSize: '16px',
            color: '#f39c12'
        }).setOrigin(0.5);

        // Buy button
        const button = this.add.graphics();
        button.fillStyle(0x27ae60, 1);
        button.fillRoundedRect(x - 35, y + 100, 70, 30, 5);

        const buttonText = this.add.text(x, y + 115, 'Buy', {
            fontSize: '16px',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        const zone = this.add.zone(x, y + 115, 70, 30).setInteractive();

        zone.on('pointerover', () => {
            button.clear();
            button.fillStyle(0x229954, 1);
            button.fillRoundedRect(x - 35, y + 100, 70, 30, 5);
        });

        zone.on('pointerout', () => {
            button.clear();
            button.fillStyle(0x27ae60, 1);
            button.fillRoundedRect(x - 35, y + 100, 70, 30, 5);
        });

        zone.on('pointerdown', () => {
            this.buyItem(item);
        });
    }

    buyItem(item) {
        if (GameState.spendCoins(item.cost)) {
            // Successfully purchased
            if (item.hunger) {
                // Food item - feed pet immediately
                GameState.feedPet(item.hunger);
                this.showMessage(`Bought ${item.name}! Fed pet +${item.hunger}`, 0x2ecc71);
            } else {
                // Furniture - add to inventory
                GameState.addItem(item.id);
                this.showMessage(`Bought ${item.name}!`, 0x2ecc71);
            }
        } else {
            // Not enough coins
            this.showMessage('Not enough coins!', 0xe74c3c);
        }
    }

    showMessage(text, color) {
        const message = this.add.text(512, 180, text, {
            fontSize: '24px',
            color: '#ffffff',
            backgroundColor: Phaser.Display.Color.IntegerToRGB(color).rgba,
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5);

        this.tweens.add({
            targets: message,
            alpha: 0,
            y: 140,
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
        button.fillRoundedRect(x - 80, y - 30, 160, 60, 10);
        button.lineStyle(3, 0x2c3e50, 1);
        button.strokeRoundedRect(x - 80, y - 30, 160, 60, 10);

        const buttonText = this.add.text(x, y, text, {
            fontSize: '20px',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        const zone = this.add.zone(x, y, 160, 60).setInteractive();

        zone.on('pointerover', () => {
            button.clear();
            button.fillStyle(0x2980b9, 1);
            button.fillRoundedRect(x - 80, y - 30, 160, 60, 10);
            button.lineStyle(3, 0xffff00, 1);
            button.strokeRoundedRect(x - 80, y - 30, 160, 60, 10);
        });

        zone.on('pointerout', () => {
            button.clear();
            button.fillStyle(0x3498db, 1);
            button.fillRoundedRect(x - 80, y - 30, 160, 60, 10);
            button.lineStyle(3, 0x2c3e50, 1);
            button.strokeRoundedRect(x - 80, y - 30, 160, 60, 10);
        });

        zone.on('pointerdown', callback);

        return { button, text: buttonText, zone };
    }
}
