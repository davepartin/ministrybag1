// gameLogic.js - Handles game state and step progression

const game = {
    state: {
        currentRound: 1,
        currentPhase: 0,
        currentStep: 0,
        maxRounds: 12,
        phases: ['planning', 'system', 'activation', 'engagement', 'end'],
        phaseNames: ['Planning Phase', 'System Phase', 'Activation Phase', 'Engagement Phase', 'End Phase']
    },

    // Dice counts for the roller
    dice: {
        attack: 3,
        defense: 2
    },

    // Attack dice probabilities (8-sided die)
    // Hit: 3/8, Crit: 1/8, Focus: 2/8, Blank: 2/8
    attackDice: [
        { face: 'hit', symbol: '💥', weight: 3 },
        { face: 'crit', symbol: '☠️', weight: 1 },
        { face: 'focus', symbol: '👁️', weight: 2 },
        { face: 'blank', symbol: '○', weight: 2 }
    ],

    // Defense dice probabilities (8-sided die)
    // Evade: 3/8, Focus: 2/8, Blank: 3/8
    defenseDice: [
        { face: 'evade', symbol: '🛡️', weight: 3 },
        { face: 'focus', symbol: '👁️', weight: 2 },
        { face: 'blank', symbol: '○', weight: 3 }
    ],

    // Get total steps for current phase
    getTotalSteps() {
        const phaseName = this.state.phases[this.state.currentPhase];
        return gameData.phaseSteps[phaseName]?.length || 0;
    },

    // Get current step data
    getCurrentStep() {
        const phaseName = this.state.phases[this.state.currentPhase];
        const steps = gameData.phaseSteps[phaseName];
        if (steps && steps[this.state.currentStep]) {
            return steps[this.state.currentStep];
        }
        return null;
    },

    // Get current phase name
    getPhaseName() {
        return this.state.phaseNames[this.state.currentPhase];
    },

    // Navigate to next step
    nextStep() {
        const totalSteps = this.getTotalSteps();

        if (this.state.currentStep < totalSteps - 1) {
            // Move to next step in current phase
            this.state.currentStep++;
        } else {
            // Move to next phase
            if (this.state.currentPhase < 4) {
                this.state.currentPhase++;
                this.state.currentStep = 0;
            } else {
                // End of round, move to next round
                if (this.state.currentRound < this.state.maxRounds) {
                    this.state.currentRound++;
                    this.state.currentPhase = 0;
                    this.state.currentStep = 0;
                } else {
                    // Game over
                    return false;
                }
            }
        }
        return true;
    },

    // Navigate to previous step
    previousStep() {
        if (this.state.currentStep > 0) {
            // Move to previous step in current phase
            this.state.currentStep--;
        } else {
            // Move to previous phase
            if (this.state.currentPhase > 0) {
                this.state.currentPhase--;
                const totalSteps = this.getTotalSteps();
                this.state.currentStep = totalSteps - 1;
            } else if (this.state.currentRound > 1) {
                // Go to previous round's End Phase
                this.state.currentRound--;
                this.state.currentPhase = 4;
                const totalSteps = this.getTotalSteps();
                this.state.currentStep = totalSteps - 1;
            }
        }
        return true;
    },

    // Jump to specific phase
    goToPhase(phaseIndex) {
        if (phaseIndex >= 0 && phaseIndex <= 4) {
            this.state.currentPhase = phaseIndex;
            this.state.currentStep = 0;
            return true;
        }
        return false;
    },

    // Jump to specific step
    goToStep(stepIndex) {
        const totalSteps = this.getTotalSteps();
        if (stepIndex >= 0 && stepIndex < totalSteps) {
            this.state.currentStep = stepIndex;
            return true;
        }
        return false;
    },

    // Roll attack dice
    rollAttackDice(count) {
        return this.rollDice(this.attackDice, count);
    },

    // Roll defense dice
    rollDefenseDice(count) {
        return this.rollDice(this.defenseDice, count);
    },

    // Generic dice rolling with weighted probabilities
    rollDice(diceConfig, count) {
        const results = [];

        // Build weighted array
        const weightedFaces = [];
        diceConfig.forEach(die => {
            for (let i = 0; i < die.weight; i++) {
                weightedFaces.push(die);
            }
        });

        // Roll dice
        for (let i = 0; i < count; i++) {
            const roll = weightedFaces[Math.floor(Math.random() * weightedFaces.length)];
            results.push({
                face: roll.face,
                symbol: roll.symbol
            });
        }

        return results;
    },

    // Count results by type
    countResults(results) {
        const counts = {};
        results.forEach(result => {
            counts[result.face] = (counts[result.face] || 0) + 1;
        });
        return counts;
    },

    // Adjust dice count
    adjustDice(type, delta) {
        const newCount = this.dice[type] + delta;
        if (newCount >= 1 && newCount <= 6) {
            this.dice[type] = newCount;
            return this.dice[type];
        }
        return this.dice[type];
    },

    // Reset game state
    reset() {
        this.state.currentRound = 1;
        this.state.currentPhase = 0;
        this.state.currentStep = 0;
        this.dice.attack = 3;
        this.dice.defense = 2;
    }
};
