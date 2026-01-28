// gameLogic.js - Handles game state and core game logic

const game = {
    state: {
        players: 2,
        scenario: null,
        experience: null,
        currentRound: 1,
        currentPhase: 0,
        maxRounds: 12,
        phases: ['planning', 'system', 'activation', 'engagement', 'end']
    },

    setup: {
        players: false,
        scenario: false,
        experience: false
    },

    selectPlayers(num) {
        this.state.players = num;
        this.setup.players = true;
        
        // Update UI
        document.querySelectorAll('.setup-question button').forEach(btn => {
            if (btn.textContent.includes(num + ' Players')) {
                btn.classList.add('selected');
            } else if (btn.textContent.includes('Players')) {
                btn.classList.remove('selected');
            }
        });
        
        this.checkSetupComplete();
    },

    selectScenario(scenario) {
        this.state.scenario = scenario;
        this.setup.scenario = true;
        
        // Update UI
        document.querySelectorAll('.setup-question button').forEach(btn => {
            if (btn.id.startsWith('scenario')) {
                btn.classList.remove('selected');
            }
        });
        event.target.classList.add('selected');
        
        this.checkSetupComplete();
    },

    selectExperience(level) {
        this.state.experience = level;
        this.setup.experience = true;
        
        // Update UI
        document.querySelectorAll('.setup-question button').forEach(btn => {
            if (btn.id.startsWith('exp')) {
                btn.classList.remove('selected');
            }
        });
        event.target.classList.add('selected');
        
        this.checkSetupComplete();
    },

    checkSetupComplete() {
        if (this.setup.players && this.setup.scenario && this.setup.experience) {
            document.getElementById('startBtn').disabled = false;
        }
    },

    startGame() {
        document.getElementById('setupScreen').style.display = 'none';
        document.getElementById('gameScreen').style.display = 'block';
        ui.updateGameDisplay();
    },

    resetGame() {
        if (confirm('Are you sure you want to reset the game?')) {
            this.state.currentRound = 1;
            this.state.currentPhase = 0;
            document.getElementById('gameScreen').style.display = 'none';
            document.getElementById('setupScreen').style.display = 'block';
            this.setup = { players: false, scenario: false, experience: false };
            document.querySelectorAll('.selected').forEach(btn => btn.classList.remove('selected'));
            document.getElementById('startBtn').disabled = true;
        }
    },

    nextPhase() {
        if (this.state.currentPhase === 4) {
            this.state.currentPhase = 0;
            this.state.currentRound++;
            if (this.state.currentRound > this.state.maxRounds) {
                alert('Game Over! Check victory conditions and count mission points to determine the winner.');
                return;
            }
        } else {
            this.state.currentPhase++;
        }
        ui.updateGameDisplay();
    },

    previousPhase() {
        if (this.state.currentPhase === 0) {
            if (this.state.currentRound > 1) {
                this.state.currentPhase = 4;
                this.state.currentRound--;
            }
        } else {
            this.state.currentPhase--;
        }
        ui.updateGameDisplay();
    },

    getPhaseName(phase) {
        const names = ['Planning Phase', 'System Phase', 'Activation Phase', 'Engagement Phase', 'End Phase'];
        return names[phase];
    },

    getPhaseDescription(phase) {
        const descriptions = [
            'Secretly set maneuver dials for all ships, then roll to determine first player for this round.',
            'Ships with System Phase abilities activate in initiative order (lowest to highest).',
            'Ships activate in initiative order (lowest to highest): reveal dial, execute maneuver, perform action.',
            'Ships engage in initiative order (highest to lowest). Each ship may attack once.',
            'Remove circular tokens, recover charges, check victory conditions, and score objectives.'
        ];
        return descriptions[phase];
    },

    rollDice(type, count) {
        const results = [];
        const symbols = type === 'attack' 
            ? ['Hit', 'Crit', 'Focus', 'Blank']
            : ['Evade', 'Focus', 'Blank'];
        
        for (let i = 0; i < count; i++) {
            results.push(symbols[Math.floor(Math.random() * symbols.length)]);
        }
        
        return results;
    }
};
