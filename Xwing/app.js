// app.js - Main application controller

const app = {
    // Track current screen
    currentScreen: 'welcome',
    rulesFromWelcome: false,

    // Initialize application
    init() {
        console.log('X-Wing Beginner\'s Guide initialized!');

        // Initialize UI
        ui.init();

        // Set up keyboard shortcuts
        this.setupKeyboardShortcuts();

        // Initialize rules navigation
        ui.initRulesNav();

        console.log('Ready to guide you through X-Wing!');
    },

    // Setup keyboard shortcuts
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Escape closes modals
            if (e.key === 'Escape') {
                this.closeModal();
                this.closeDiceRoller();
            }

            // Arrow keys for navigation (only in game screen)
            if (this.currentScreen === 'game') {
                if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    this.nextStep();
                } else if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    this.previousStep();
                }
            }
        });
    },

    // =====================================
    // Screen Navigation
    // =====================================

    // Start the guide
    startGuide() {
        this.currentScreen = 'game';
        ui.showScreen('game');
        game.reset();
        ui.updateGameDisplay();
    },

    // Go back to welcome screen
    goToWelcome() {
        this.currentScreen = 'welcome';
        ui.showScreen('welcome');
        game.reset();
    },

    // Show rules from welcome screen
    showRulesFromWelcome() {
        this.rulesFromWelcome = true;
        this.showRules();
    },

    // Show rules reference
    showRules() {
        this.currentScreen = 'rules';
        ui.showScreen('rules');

        // Show first section
        const firstCategory = gameData.rulesCategories[0];
        if (firstCategory && firstCategory.items[0]) {
            this.showRulesSection(firstCategory.items[0].id);
        }
    },

    // Close rules and return to previous screen
    closeRules() {
        if (this.rulesFromWelcome) {
            this.currentScreen = 'welcome';
            ui.showScreen('welcome');
            this.rulesFromWelcome = false;
        } else {
            this.currentScreen = 'game';
            ui.showScreen('game');
        }
    },

    // Show specific rules section
    showRulesSection(sectionId) {
        ui.showRulesSection(sectionId);
    },

    // Search rules
    searchRules(query) {
        ui.searchRules(query);
    },

    // =====================================
    // Step Navigation
    // =====================================

    // Go to next step
    nextStep() {
        game.nextStep();
        ui.updateGameDisplay();
    },

    // Go to previous step
    previousStep() {
        game.previousStep();
        ui.updateGameDisplay();
    },

    // Jump to specific step
    goToStep(stepIndex) {
        game.goToStep(stepIndex);
        ui.updateGameDisplay();
    },

    // Jump to specific phase
    goToPhase(phaseIndex) {
        game.goToPhase(phaseIndex);
        ui.updateGameDisplay();
    },

    // =====================================
    // Dice Roller
    // =====================================

    // Show dice roller
    showDiceRoller() {
        ui.showDiceRoller();
    },

    // Close dice roller
    closeDiceRoller() {
        ui.closeDiceRoller();
    },

    // Adjust dice count
    adjustDice(type, delta) {
        game.adjustDice(type, delta);
        ui.updateDiceCounts();
    },

    // Roll attack dice
    rollAttack() {
        const count = game.dice.attack;
        const results = game.rollAttackDice(count);
        ui.displayAttackResults(results);
    },

    // Roll defense dice
    rollDefense() {
        const count = game.dice.defense;
        const results = game.rollDefenseDice(count);
        ui.displayDefenseResults(results);
    },

    // =====================================
    // Quick Tools
    // =====================================

    // Show maneuver guide modal
    showManeuverGuide() {
        ui.showManeuverGuide();
    },

    // Show token guide modal
    showTokenGuide() {
        ui.showTokenGuide();
    },

    // Show range guide modal
    showRangeGuide() {
        ui.showRangeGuide();
    },

    // =====================================
    // Modal Management
    // =====================================

    // Close modal
    closeModal() {
        ui.closeModal();
    }
};

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});

// Export for debugging
window.xwingApp = {
    app: app,
    game: game,
    ui: ui,
    data: gameData,
    version: '2.0.0'
};

console.log('X-Wing Beginner\'s Guide v2.0.0 loaded!');
