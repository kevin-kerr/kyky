// MathGame Scene - Flashcard System
// Timed math problems with on-screen number pad and coin rewards

import GameState from '../managers/GameState.js';
import MathLogic from '../utils/MathLogic.js';

export default class MathGame extends Phaser.Scene {
    constructor() {
        super({ key: 'MathGame' });
        this.mathLogic = new MathLogic();
    }

    create() {
        console.log('MathGame scene started');

        // Background
        this.cameras.main.setBackgroundColor('#ecf0f1');

        // Initialize game state
        this.currentProblem = null;
        this.userAnswer = '';
        this.startTime = 0;
        this.timeLimit = 10;
        this.problemCount = 0;
        this.correctCount = 0;

        // Title
        this.add.text(512, 80, 'Math Flashcards', {
            fontSize: '48px',
            color: '#2c3e50',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Instructions
        this.add.text(512, 130, 'Answer quickly to earn more coins!', {
            fontSize: '20px',
            color: '#7f8c8d'
        }).setOrigin(0.5);

        // Timer display
        this.timerText = this.add.text(512, 180, 'Time: 10.0s', {
            fontSize: '28px',
            color: '#e74c3c',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Question display
        this.questionText = this.add.text(512, 280, '', {
            fontSize: '72px',
            color: '#2c3e50',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Answer display
        this.answerText = this.add.text(512, 380, '', {
            fontSize: '48px',
            color: '#3498db',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Score display
        this.scoreText = this.add.text(512, 450, 'Problems: 0 | Correct: 0', {
            fontSize: '20px',
            color: '#27ae60'
        }).setOrigin(0.5);

        // Create number pad
        this.createNumberPad();

        // Back button
        this.createButton(100, 700, 'Exit', () => {
            this.scene.start('Town');
        });

        // Start first problem
        this.nextProblem();

        // Enable keyboard input as backup
        this.input.keyboard.on('keydown', (event) => {
            if (event.key >= '0' && event.key <= '9') {
                this.addDigit(event.key);
            } else if (event.key === 'Backspace') {
                this.deleteDigit();
            } else if (event.key === 'Enter') {
                this.submitAnswer();
            }
        });
    }

    update(time, delta) {
        if (this.currentProblem && this.startTime > 0) {
            const elapsed = (Date.now() - this.startTime) / 1000;
            const remaining = Math.max(0, this.timeLimit - elapsed);

            this.timerText.setText(`Time: ${remaining.toFixed(1)}s`);

            // Change color based on time remaining
            if (remaining < 3) {
                this.timerText.setColor('#e74c3c');
            } else if (remaining < 6) {
                this.timerText.setColor('#f39c12');
            } else {
                this.timerText.setColor('#27ae60');
            }

            // Time's up
            if (remaining === 0) {
                this.submitAnswer(true);
            }
        }
    }

    nextProblem() {
        this.currentProblem = this.mathLogic.generateProblem();
        this.userAnswer = '';
        this.startTime = Date.now();

        this.questionText.setText(this.currentProblem.question + ' = ?');
        this.answerText.setText('');
        this.timerText.setText(`Time: ${this.timeLimit.toFixed(1)}s`);
    }

    addDigit(digit) {
        if (this.userAnswer.length < 3) {
            this.userAnswer += digit;
            this.answerText.setText(this.userAnswer);
        }
    }

    deleteDigit() {
        this.userAnswer = this.userAnswer.slice(0, -1);
        this.answerText.setText(this.userAnswer);
    }

    submitAnswer(timeOut = false) {
        if (!this.currentProblem) return;

        const timeTaken = (Date.now() - this.startTime) / 1000;
        const isCorrect = this.mathLogic.checkAnswer(this.currentProblem, this.userAnswer || '0');

        this.problemCount++;

        if (isCorrect) {
            this.correctCount++;
            const coins = this.mathLogic.calculateReward(timeTaken);

            // Green flash
            this.flashScreen(0x2ecc71);

            // Award coins
            GameState.addCoins(coins);

            // Show feedback
            this.showFeedback(`Correct! +${coins} coins`, 0x2ecc71);
        } else {
            // Red flash
            this.flashScreen(0xe74c3c);

            // Show feedback
            const correctAnswer = this.currentProblem.answer;
            this.showFeedback(`Wrong! Answer: ${correctAnswer}`, 0xe74c3c);
        }

        // Update score
        this.scoreText.setText(`Problems: ${this.problemCount} | Correct: ${this.correctCount}`);

        // Next problem after a short delay
        this.time.delayedCall(1500, () => {
            this.nextProblem();
        });

        // Reset answer
        this.startTime = 0;
    }

    flashScreen(color) {
        const flash = this.add.rectangle(512, 384, 1024, 768, color, 0.3);
        this.tweens.add({
            targets: flash,
            alpha: 0,
            duration: 500,
            ease: 'Power2',
            onComplete: () => {
                flash.destroy();
            }
        });
    }

    showFeedback(text, color) {
        const feedback = this.add.text(512, 500, text, {
            fontSize: '32px',
            color: '#ffffff',
            backgroundColor: Phaser.Display.Color.IntegerToRGB(color).rgba,
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5);

        this.tweens.add({
            targets: feedback,
            alpha: 0,
            y: 460,
            duration: 1500,
            ease: 'Power2',
            onComplete: () => {
                feedback.destroy();
            }
        });
    }

    createNumberPad() {
        const startX = 300;
        const startY = 540;
        const buttonSize = 60;
        const spacing = 70;

        // Numbers 1-9
        for (let i = 1; i <= 9; i++) {
            const col = (i - 1) % 3;
            const row = Math.floor((i - 1) / 3);
            const x = startX + col * spacing;
            const y = startY + row * spacing;

            this.createNumButton(x, y, buttonSize, i.toString());
        }

        // Bottom row: Clear, 0, Submit
        this.createNumButton(startX, startY + 3 * spacing, buttonSize, 'C', true);
        this.createNumButton(startX + spacing, startY + 3 * spacing, buttonSize, '0');
        this.createNumButton(startX + 2 * spacing, startY + 3 * spacing, buttonSize, '✓', true);
    }

    createNumButton(x, y, size, label, special = false) {
        const button = this.add.graphics();
        const color = special ? 0xf39c12 : 0x3498db;

        button.fillStyle(color, 1);
        button.fillRoundedRect(x - size / 2, y - size / 2, size, size, 8);
        button.lineStyle(3, 0x2c3e50, 1);
        button.strokeRoundedRect(x - size / 2, y - size / 2, size, size, 8);

        const text = this.add.text(x, y, label, {
            fontSize: '28px',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        const zone = this.add.zone(x, y, size, size).setInteractive();

        zone.on('pointerover', () => {
            button.clear();
            button.fillStyle(special ? 0xe67e22 : 0x2980b9, 1);
            button.fillRoundedRect(x - size / 2, y - size / 2, size, size, 8);
            button.lineStyle(3, 0xffff00, 1);
            button.strokeRoundedRect(x - size / 2, y - size / 2, size, size, 8);
        });

        zone.on('pointerout', () => {
            button.clear();
            button.fillStyle(color, 1);
            button.fillRoundedRect(x - size / 2, y - size / 2, size, size, 8);
            button.lineStyle(3, 0x2c3e50, 1);
            button.strokeRoundedRect(x - size / 2, y - size / 2, size, size, 8);
        });

        zone.on('pointerdown', () => {
            if (label === 'C') {
                this.userAnswer = '';
                this.answerText.setText('');
            } else if (label === '✓') {
                this.submitAnswer();
            } else {
                this.addDigit(label);
            }
        });
    }

    createButton(x, y, text, callback) {
        const button = this.add.graphics();
        button.fillStyle(0xe74c3c, 1);
        button.fillRoundedRect(x - 60, y - 30, 120, 60, 10);
        button.lineStyle(3, 0x2c3e50, 1);
        button.strokeRoundedRect(x - 60, y - 30, 120, 60, 10);

        const buttonText = this.add.text(x, y, text, {
            fontSize: '20px',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        const zone = this.add.zone(x, y, 120, 60).setInteractive();

        zone.on('pointerover', () => {
            button.clear();
            button.fillStyle(0xc0392b, 1);
            button.fillRoundedRect(x - 60, y - 30, 120, 60, 10);
            button.lineStyle(3, 0xffff00, 1);
            button.strokeRoundedRect(x - 60, y - 30, 120, 60, 10);
        });

        zone.on('pointerout', () => {
            button.clear();
            button.fillStyle(0xe74c3c, 1);
            button.fillRoundedRect(x - 60, y - 30, 120, 60, 10);
            button.lineStyle(3, 0x2c3e50, 1);
            button.strokeRoundedRect(x - 60, y - 30, 120, 60, 10);
        });

        zone.on('pointerdown', callback);
    }
}
