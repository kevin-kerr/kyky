// Math Problem Generator for 3rd Grade Multiplication and Division
// Generates single-digit problems with answers 0-81

class MathLogic {
    constructor() {
        this.operations = ['×', '÷'];
    }

    // Generate a random math problem
    generateProblem() {
        const operation = Phaser.Math.Between(0, 1) === 0 ? '×' : '÷';

        if (operation === '×') {
            return this.generateMultiplication();
        } else {
            return this.generateDivision();
        }
    }

    // Generate multiplication problem (0-9 × 0-9)
    generateMultiplication() {
        const num1 = Phaser.Math.Between(0, 9);
        const num2 = Phaser.Math.Between(0, 9);
        const answer = num1 * num2;

        return {
            question: `${num1} × ${num2}`,
            answer: answer,
            num1: num1,
            num2: num2,
            operation: '×'
        };
    }

    // Generate division problem (ensure whole number answers)
    generateDivision() {
        // First generate the quotient (0-9)
        const quotient = Phaser.Math.Between(0, 9);
        // Then generate the divisor (1-9, can't divide by 0)
        const divisor = Phaser.Math.Between(1, 9);
        // Calculate the dividend
        const dividend = quotient * divisor;

        return {
            question: `${dividend} ÷ ${divisor}`,
            answer: quotient,
            num1: dividend,
            num2: divisor,
            operation: '÷'
        };
    }

    // Check if answer is correct
    checkAnswer(problem, userAnswer) {
        return parseInt(userAnswer) === problem.answer;
    }

    // Calculate coin reward based on time remaining
    // Formula: 10 seconds - time taken = coins earned
    calculateReward(timeTaken) {
        const timeLimit = 10;
        const timeRemaining = timeLimit - timeTaken;
        return Math.max(0, Math.floor(timeRemaining));
    }
}

export default MathLogic;
