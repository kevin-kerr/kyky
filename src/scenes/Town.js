// Town Scene - Navigation Hub
// Top-down view with clickable buildings

export default class Town extends Phaser.Scene {
    constructor() {
        super({ key: 'Town' });
    }

    create() {
        console.log('Town scene started');

        // Background
        this.cameras.main.setBackgroundColor('#87ceeb');

        // Title
        this.add.text(512, 100, 'Math Pet Town', {
            fontSize: '48px',
            color: '#2c3e50',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.add.text(512, 150, 'Click a building to visit', {
            fontSize: '24px',
            color: '#34495e'
        }).setOrigin(0.5);

        // Create buildings with procedural graphics
        this.createBuilding(200, 300, 150, 120, 0x8B4513, 'Home', 'Home');
        this.createBuilding(400, 300, 150, 120, 0x2ecc71, 'Grocery\nStore', 'Shop', { shopType: 'grocery' });
        this.createBuilding(600, 300, 150, 120, 0xf39c12, 'Treat\nShop', 'Shop', { shopType: 'treats' });
        this.createBuilding(300, 500, 150, 120, 0x3498db, 'Furniture\nStore', 'Shop', { shopType: 'furniture' });
        this.createBuilding(500, 500, 150, 120, 0xe74c3c, 'Math\nGame', 'MathGame');
        this.createBuilding(700, 500, 150, 120, 0x9b59b6, 'Soccer\nField', 'Soccer');
    }

    createBuilding(x, y, width, height, color, label, targetScene, data = {}) {
        // Building body
        const building = this.add.graphics();
        building.fillStyle(color, 1);
        building.fillRect(x - width / 2, y - height / 2, width, height);

        // Building outline
        building.lineStyle(4, 0x000000, 1);
        building.strokeRect(x - width / 2, y - height / 2, width, height);

        // Door
        building.fillStyle(0x654321, 1);
        building.fillRect(x - 20, y + height / 2 - 40, 40, 40);

        // Windows
        building.fillStyle(0xffffcc, 1);
        building.fillRect(x - 40, y - 20, 25, 25);
        building.fillRect(x + 15, y - 20, 25, 25);

        // Label
        const text = this.add.text(x, y + height / 2 + 30, label, {
            fontSize: '20px',
            color: '#2c3e50',
            fontStyle: 'bold',
            align: 'center'
        }).setOrigin(0.5);

        // Make interactive zone
        const zone = this.add.zone(x, y, width, height).setInteractive();

        // Hover effect
        zone.on('pointerover', () => {
            building.clear();
            building.fillStyle(color, 0.8);
            building.fillRect(x - width / 2, y - height / 2, width, height);
            building.lineStyle(6, 0xffff00, 1);
            building.strokeRect(x - width / 2, y - height / 2, width, height);

            // Redraw door and windows
            building.fillStyle(0x654321, 1);
            building.fillRect(x - 20, y + height / 2 - 40, 40, 40);
            building.fillStyle(0xffffcc, 1);
            building.fillRect(x - 40, y - 20, 25, 25);
            building.fillRect(x + 15, y - 20, 25, 25);
        });

        zone.on('pointerout', () => {
            building.clear();
            building.fillStyle(color, 1);
            building.fillRect(x - width / 2, y - height / 2, width, height);
            building.lineStyle(4, 0x000000, 1);
            building.strokeRect(x - width / 2, y - height / 2, width, height);

            // Redraw door and windows
            building.fillStyle(0x654321, 1);
            building.fillRect(x - 20, y + height / 2 - 40, 40, 40);
            building.fillStyle(0xffffcc, 1);
            building.fillRect(x - 40, y - 20, 25, 25);
            building.fillRect(x + 15, y - 20, 25, 25);
        });

        // Click to navigate
        zone.on('pointerdown', () => {
            console.log(`Navigating to ${targetScene}`);
            this.scene.start(targetScene, data);
        });
    }
}
