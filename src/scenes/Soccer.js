// Soccer Scene - Mini-Game
// Physics-based goalie game where player blocks shots

import GameState from '../managers/GameState.js';

export default class Soccer extends Phaser.Scene {
    constructor() {
        super({ key: 'Soccer', physics: { arcade: { gravity: { y: 0 } } } });
    }

    create() {
        console.log('Soccer scene started');

        // Background (soccer field)
        this.cameras.main.setBackgroundColor('#2ecc71');

        // Check if player has enough coins
        const entryCost = 10;
        if (GameState.getCoins() < entryCost) {
            this.showInsufficientFunds(entryCost);
            return;
        }

        // Charge entry fee
        GameState.spendCoins(entryCost);

        // Game state
        this.score = 0;
        this.gameTime = 30; // 30 seconds
        this.gameActive = true;

        // Title
        this.add.text(512, 60, 'Soccer Goalie', {
            fontSize: '36px',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Instructions
        this.add.text(512, 100, 'Block the shots! Use arrow keys or click', {
            fontSize: '18px',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Score display
        this.scoreText = this.add.text(100, 140, 'Blocks: 0', {
            fontSize: '24px',
            color: '#ffffff',
            fontStyle: 'bold'
        });

        // Timer display
        this.timerText = this.add.text(924, 140, `Time: ${this.gameTime}s`, {
            fontSize: '24px',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(1, 0);

        // Create goal area
        this.createGoal();

        // Create player (goalie)
        this.player = this.physics.add.sprite(512, 600, null);
        this.player.setCircle(25);
        this.player.body.setCollideWorldBounds(true);

        // Draw player
        const playerGraphics = this.add.graphics();
        playerGraphics.fillStyle(0x3498db, 1);
        playerGraphics.fillCircle(0, 0, 25);
        playerGraphics.lineStyle(3, 0x000000, 1);
        playerGraphics.strokeCircle(0, 0, 25);
        playerGraphics.generateTexture('player', 50, 50);
        playerGraphics.destroy();
        this.player.setTexture('player');

        // Create robot shooter
        this.robot = this.add.graphics();
        this.robot.fillStyle(0x95a5a6, 1);
        this.robot.fillRect(487, 200, 50, 60);
        this.robot.fillCircle(512, 190, 20);

        // Balls group
        this.balls = this.physics.add.group();

        // Collision detection
        this.physics.add.overlap(this.player, this.balls, this.blockBall, null, this);

        // Controls
        this.cursors = this.input.keyboard.createCursorKeys();

        // Click to move
        this.input.on('pointerdown', (pointer) => {
            if (this.gameActive && pointer.y > 400) {
                this.physics.moveTo(this.player, pointer.x, pointer.y, 400);
            }
        });

        // Spawn balls periodically
        this.ballSpawnTimer = this.time.addEvent({
            delay: 1500,
            callback: this.spawnBall,
            callbackScope: this,
            loop: true
        });

        // Game timer
        this.gameTimer = this.time.addEvent({
            delay: 1000,
            callback: this.updateTimer,
            callbackScope: this,
            repeat: this.gameTime - 1
        });

        // Back button (only after game ends)
        this.backButton = null;
    }

    update() {
        if (!this.gameActive) return;

        // Keyboard controls
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-300);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(300);
        } else {
            this.player.setVelocityX(0);
        }

        if (this.cursors.up.isDown) {
            this.player.setVelocityY(-300);
        } else if (this.cursors.down.isDown) {
            this.player.setVelocityY(300);
        } else {
            this.player.setVelocityY(0);
        }

        // Check if balls went past the goal line
        this.balls.children.entries.forEach(ball => {
            if (ball.y > 700) {
                ball.destroy();
            }
        });
    }

    createGoal() {
        // Goal posts
        const goalGraphics = this.add.graphics();
        goalGraphics.lineStyle(6, 0xffffff, 1);
        goalGraphics.strokeRect(200, 650, 624, 100);

        // Goal line
        goalGraphics.lineStyle(4, 0xffffff, 1);
        goalGraphics.lineBetween(200, 650, 824, 650);

        this.add.text(512, 700, 'GOAL', {
            fontSize: '48px',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5).setAlpha(0.3);
    }

    spawnBall() {
        if (!this.gameActive) return;

        // Random x position
        const x = Phaser.Math.Between(250, 774);

        // Create ball
        const ball = this.physics.add.sprite(x, 270, null);
        ball.setCircle(15);
        ball.body.setBounce(0.8);
        ball.body.setCollideWorldBounds(false);

        // Draw ball
        const ballGraphics = this.add.graphics();
        ballGraphics.fillStyle(0xffffff, 1);
        ballGraphics.fillCircle(0, 0, 15);
        ballGraphics.lineStyle(2, 0x000000, 1);
        ballGraphics.strokeCircle(0, 0, 15);
        ballGraphics.fillStyle(0x000000, 1);
        for (let i = 0; i < 5; i++) {
            const angle = (i / 5) * Math.PI * 2;
            ballGraphics.fillCircle(Math.cos(angle) * 8, Math.sin(angle) * 8, 3);
        }
        ballGraphics.generateTexture('ball', 30, 30);
        ballGraphics.destroy();

        ball.setTexture('ball');

        // Shoot toward goal
        const angle = Phaser.Math.Between(-30, 30);
        const speed = Phaser.Math.Between(200, 350);
        this.physics.velocityFromAngle(90 + angle, speed, ball.body.velocity);

        this.balls.add(ball);
    }

    blockBall(player, ball) {
        // Ball was blocked!
        this.score++;
        this.scoreText.setText(`Blocks: ${this.score}`);

        // Visual feedback
        const flash = this.add.circle(ball.x, ball.y, 40, 0xffff00, 0.6);
        this.tweens.add({
            targets: flash,
            scale: 2,
            alpha: 0,
            duration: 300,
            ease: 'Power2',
            onComplete: () => flash.destroy()
        });

        ball.destroy();
    }

    updateTimer() {
        this.gameTime--;
        this.timerText.setText(`Time: ${this.gameTime}s`);

        if (this.gameTime === 0) {
            this.endGame();
        }
    }

    endGame() {
        this.gameActive = false;
        this.ballSpawnTimer.remove();

        // Calculate points earned
        const points = this.score * 2;
        GameState.addPoints(points);

        // Show results
        const resultsBg = this.add.rectangle(512, 384, 600, 400, 0x2c3e50, 0.95);

        this.add.text(512, 250, 'Game Over!', {
            fontSize: '48px',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.add.text(512, 320, `Blocks: ${this.score}`, {
            fontSize: '32px',
            color: '#2ecc71'
        }).setOrigin(0.5);

        this.add.text(512, 370, `Points Earned: ${points}`, {
            fontSize: '32px',
            color: '#f39c12'
        }).setOrigin(0.5);

        this.add.text(512, 420, '(Save points to buy new pets!)', {
            fontSize: '18px',
            color: '#95a5a6'
        }).setOrigin(0.5);

        // Back button
        this.createButton(512, 500, 'Back to Town', () => {
            this.scene.start('Town');
        });
    }

    showInsufficientFunds(cost) {
        this.add.text(512, 300, 'Not Enough Coins!', {
            fontSize: '48px',
            color: '#e74c3c',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.add.text(512, 380, `Entry costs ${cost} coins`, {
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0.5);

        this.add.text(512, 420, 'Play Math Game to earn coins!', {
            fontSize: '20px',
            color: '#f39c12'
        }).setOrigin(0.5);

        this.createButton(512, 500, 'Back to Town', () => {
            this.scene.start('Town');
        });
    }

    createButton(x, y, text, callback) {
        const button = this.add.graphics();
        button.fillStyle(0x3498db, 1);
        button.fillRoundedRect(x - 100, y - 30, 200, 60, 10);
        button.lineStyle(3, 0x2c3e50, 1);
        button.strokeRoundedRect(x - 100, y - 30, 200, 60, 10);

        const buttonText = this.add.text(x, y, text, {
            fontSize: '24px',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        const zone = this.add.zone(x, y, 200, 60).setInteractive();

        zone.on('pointerover', () => {
            button.clear();
            button.fillStyle(0x2980b9, 1);
            button.fillRoundedRect(x - 100, y - 30, 200, 60, 10);
            button.lineStyle(3, 0xffff00, 1);
            button.strokeRoundedRect(x - 100, y - 30, 200, 60, 10);
        });

        zone.on('pointerout', () => {
            button.clear();
            button.fillStyle(0x3498db, 1);
            button.fillRoundedRect(x - 100, y - 30, 200, 60, 10);
            button.lineStyle(3, 0x2c3e50, 1);
            button.strokeRoundedRect(x - 100, y - 30, 200, 60, 10);
        });

        zone.on('pointerdown', callback);

        return { button, text: buttonText, zone };
    }
}
