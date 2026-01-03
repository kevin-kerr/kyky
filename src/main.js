// Main entry point for Math Pet Adventure
// Configures Phaser game and registers all scenes

import Boot from './scenes/Boot.js';
import UI from './scenes/UI.js';
import Town from './scenes/Town.js';
import Home from './scenes/Home.js';
import Shop from './scenes/Shop.js';
import MathGame from './scenes/MathGame.js';
import Soccer from './scenes/Soccer.js';

// Phaser game configuration
const config = {
    type: Phaser.AUTO,
    width: 1024,
    height: 768,
    parent: 'game-container',
    backgroundColor: '#87ceeb',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [Boot, UI, Town, Home, Shop, MathGame, Soccer]
};

// Create game instance
const game = new Phaser.Game(config);

// Global reference for debugging
window.game = game;
