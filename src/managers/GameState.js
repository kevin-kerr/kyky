// Singleton State Manager for Math Pet Adventure
// Handles coins, points, pet status, inventory, and localStorage persistence

class GameState {
    constructor() {
        if (GameState.instance) {
            return GameState.instance;
        }

        this.data = {
            coins: 0,
            points: 0,
            pet: {
                name: "Dog",
                hunger: 100,
                lastFed: Date.now()
            },
            inventory: [],
            unlockedPets: ["Dog"]
        };

        this.load();
        GameState.instance = this;
    }

    // Save to localStorage
    save() {
        try {
            localStorage.setItem('mathPetAdventure', JSON.stringify(this.data));
            console.log('Game saved successfully');
        } catch (error) {
            console.error('Error saving game:', error);
        }
    }

    // Load from localStorage
    load() {
        try {
            const saved = localStorage.getItem('mathPetAdventure');
            if (saved) {
                this.data = JSON.parse(saved);
                console.log('Game loaded successfully');
            } else {
                console.log('No saved game found, starting fresh');
            }
        } catch (error) {
            console.error('Error loading game:', error);
        }
    }

    // Coin operations
    addCoins(amount) {
        this.data.coins += amount;
        this.save();
    }

    spendCoins(amount) {
        if (this.data.coins >= amount) {
            this.data.coins -= amount;
            this.save();
            return true;
        }
        return false;
    }

    getCoins() {
        return this.data.coins;
    }

    // Points operations
    addPoints(amount) {
        this.data.points += amount;
        this.save();
    }

    spendPoints(amount) {
        if (this.data.points >= amount) {
            this.data.points -= amount;
            this.save();
            return true;
        }
        return false;
    }

    getPoints() {
        return this.data.points;
    }

    // Pet operations
    feedPet(amount) {
        this.data.pet.hunger = Math.min(100, this.data.pet.hunger + amount);
        this.data.pet.lastFed = Date.now();
        this.save();
    }

    getHunger() {
        return this.data.pet.hunger;
    }

    updateHunger() {
        // Hunger decreases over time
        const now = Date.now();
        const timePassed = now - this.data.pet.lastFed;
        const minutesPassed = timePassed / (1000 * 60);

        // Decrease hunger by 1 point per minute
        const hungerLoss = Math.floor(minutesPassed);
        if (hungerLoss > 0) {
            this.data.pet.hunger = Math.max(0, this.data.pet.hunger - hungerLoss);
            this.data.pet.lastFed = now;
            this.save();
        }

        return this.data.pet.hunger;
    }

    // Inventory operations
    addItem(itemId) {
        this.data.inventory.push(itemId);
        this.save();
    }

    hasItem(itemId) {
        return this.data.inventory.includes(itemId);
    }

    getInventory() {
        return this.data.inventory;
    }

    // Pet unlocking
    unlockPet(petName) {
        if (!this.data.unlockedPets.includes(petName)) {
            this.data.unlockedPets.push(petName);
            this.save();
        }
    }

    isPetUnlocked(petName) {
        return this.data.unlockedPets.includes(petName);
    }

    // Reset game (for testing)
    reset() {
        this.data = {
            coins: 0,
            points: 0,
            pet: {
                name: "Dog",
                hunger: 100,
                lastFed: Date.now()
            },
            inventory: [],
            unlockedPets: ["Dog"]
        };
        this.save();
    }
}

// Export singleton instance
export default new GameState();
