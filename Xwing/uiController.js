// uiController.js - Handles all UI updates and user interactions

const ui = {
    updateGameDisplay() {
        const phaseName = game.getPhaseName(game.state.currentPhase);
        document.getElementById('currentPhaseName').textContent = phaseName;
        document.getElementById('gameStatus').textContent = `Round ${game.state.currentRound} of ${game.state.maxRounds}`;
        
        // Update phase tracker
        document.querySelectorAll('.phase-card').forEach((card, index) => {
            if (index === game.state.currentPhase) {
                card.classList.add('active');
            } else {
                card.classList.remove('active');
            }
        });

        // Update main content
        this.updateMainContent();
        this.updatePhaseDescription();
        this.updateQuickTips();
    },

    updateMainContent() {
        const contentArea = document.getElementById('mainContentArea');
        const phaseKey = game.state.phases[game.state.currentPhase];
        const phaseData = gameData.phaseContent[phaseKey];
        
        contentArea.innerHTML = '';

        if (phaseData && phaseData.actions) {
            phaseData.actions.forEach(action => {
                const actionButton = document.createElement('div');
                actionButton.className = 'action-button';
                actionButton.onclick = () => {
                    if (action.id === 'diceRoller') {
                        this.showDiceRoller();
                    } else {
                        this.showDetail(action.id);
                    }
                };
                
                actionButton.innerHTML = `
                    <div class="icon">${action.icon}</div>
                    <div class="title">${action.title}</div>
                    <div class="description">${action.description}</div>
                `;
                
                contentArea.appendChild(actionButton);
            });
        }
    },

    updatePhaseDescription() {
        const description = game.getPhaseDescription(game.state.currentPhase);
        document.getElementById('phaseDescription').textContent = description;
    },

    updateQuickTips() {
        const phaseKey = game.state.phases[game.state.currentPhase];
        const phaseData = gameData.phaseContent[phaseKey];
        const tipContainer = document.getElementById('quickTips');
        
        if (phaseData && phaseData.tips) {
            tipContainer.innerHTML = phaseData.tips
                .map(tip => `<div class="quick-ref-item">${tip}</div>`)
                .join('');
        }
    },

    showDetail(contentType) {
        const detailPanel = document.getElementById('detailPanel');
        const detailTitle = document.getElementById('detailTitle');
        const detailContent = document.getElementById('detailContent');
        const overlay = document.getElementById('overlay');

        const content = gameData.detailContent[contentType];
        
        if (content) {
            detailTitle.textContent = content.title;
            detailContent.innerHTML = content.content;
            
            // Special handling for scenario scoring
            if (contentType === 'scenarioScoring') {
                const scenarioContent = document.getElementById('scenarioScoringContent');
                if (scenarioContent && game.state.scenario) {
                    const scenario = gameData.scenarios[game.state.scenario];
                    scenarioContent.innerHTML = `
                        <div class="info-box">
                            <h4>${scenario.name}</h4>
                            <p>${scenario.description}</p>
                        </div>
                        <div class="subsection">
                            <h4>Objectives:</h4>
                            <ul class="bullet-list">
                                ${scenario.objectives.map(obj => `<li>${obj}</li>`).join('')}
                            </ul>
                        </div>
                        <div class="info-box tip">
                            <strong>Special Rule:</strong> ${scenario.special}
                        </div>
                    `;
                }
            }
        }

        detailPanel.classList.add('show');
        overlay.classList.add('show');
    },

    closeDetail() {
        document.getElementById('detailPanel').classList.remove('show');
        document.getElementById('overlay').classList.remove('show');
    },

    showDiceRoller() {
        const content = `
            <div class="dice-roller">
                <h4 style="color: #ffd700; margin-bottom: 15px;">Dice Roller</h4>
                
                <div class="subsection">
                    <h4 style="color: #ff4444;">Attack Dice (Red)</h4>
                    <div class="dice-controls">
                        <button onclick="ui.rollAndDisplay('attack', 1)">Roll 1</button>
                        <button onclick="ui.rollAndDisplay('attack', 2)">Roll 2</button>
                        <button onclick="ui.rollAndDisplay('attack', 3)">Roll 3</button>
                        <button onclick="ui.rollAndDisplay('attack', 4)">Roll 4</button>
                        <button onclick="ui.rollAndDisplay('attack', 5)">Roll 5</button>
                    </div>
                    <div id="attackResults" class="dice-results"></div>
                </div>

                <div class="subsection" style="margin-top: 20px;">
                    <h4 style="color: #44ff44;">Defense Dice (Green)</h4>
                    <div class="dice-controls">
                        <button onclick="ui.rollAndDisplay('defense', 1)">Roll 1</button>
                        <button onclick="ui.rollAndDisplay('defense', 2)">Roll 2</button>
                        <button onclick="ui.rollAndDisplay('defense', 3)">Roll 3</button>
                        <button onclick="ui.rollAndDisplay('defense', 4)">Roll 4</button>
                        <button onclick="ui.rollAndDisplay('defense', 5)">Roll 5</button>
                    </div>
                    <div id="defenseResults" class="dice-results"></div>
                </div>

                <div class="info-box" style="margin-top: 20px;">
                    <h4>Dice Results Legend</h4>
                    <p><strong>Attack Dice:</strong> Hit (⚫) | Crit (⚡) | Focus (🎯) | Blank</p>
                    <p><strong>Defense Dice:</strong> Evade (🛡️) | Focus (🎯) | Blank</p>
                </div>
            </div>
        `;

        this.showDetailWithCustomContent('Dice Roller', content);
    },

    rollAndDisplay(type, count) {
        const results = game.rollDice(type, count);
        const resultsDiv = document.getElementById(type + 'Results');
        
        resultsDiv.innerHTML = results.map(result => {
            const symbol = this.getDiceSymbol(result);
            return `<div class="die ${type}">${symbol}</div>`;
        }).join('');
    },

    getDiceSymbol(result) {
        const symbols = {
            'Hit': '⚫',
            'Crit': '⚡',
            'Focus': '🎯',
            'Evade': '🛡️',
            'Blank': '□'
        };
        return symbols[result] || result;
    },

    showScenarioInfo() {
        if (!game.state.scenario) {
            alert('No scenario selected!');
            return;
        }

        const scenario = gameData.scenarios[game.state.scenario];
        const content = `
            <div class="info-box">
                <h4>${scenario.name}</h4>
                <p>${scenario.description}</p>
            </div>
            <div class="subsection">
                <h4>Objectives:</h4>
                <ul class="bullet-list">
                    ${scenario.objectives.map(obj => `<li>${obj}</li>`).join('')}
                </ul>
            </div>
            <div class="info-box tip">
                <strong>Special Rule:</strong> ${scenario.special}
            </div>
            <div class="subsection">
                <h4>Earning Mission Points</h4>
                <ul class="bullet-list">
                    <li><strong>Opponent's Deficit:</strong> Earned at game start if opponent's squad costs less than 20 points</li>
                    <li><strong>Destroying Ships:</strong> Earn points equal to destroyed ship's squad point value</li>
                    <li><strong>Scenario Objectives:</strong> See objectives above</li>
                </ul>
            </div>
            <div class="info-box warning">
                <h4>Victory Conditions</h4>
                <p>Game ends when:</p>
                <ul class="bullet-list">
                    <li>Only one player has ships remaining (immediate win)</li>
                    <li>A player has 20+ mission points AND more than opponent</li>
                    <li>After Round 12 (player with most points wins)</li>
                </ul>
            </div>
        `;

        this.showDetailWithCustomContent('Scenario Information', content);
    },

    showQuickRef() {
        const content = gameData.quickReference.content;
        this.showDetailWithCustomContent(gameData.quickReference.title, content);
    },

    showDetailWithCustomContent(title, content) {
        const detailPanel = document.getElementById('detailPanel');
        const detailTitle = document.getElementById('detailTitle');
        const detailContent = document.getElementById('detailContent');
        const overlay = document.getElementById('overlay');

        detailTitle.textContent = title;
        detailContent.innerHTML = content;

        detailPanel.classList.add('show');
        overlay.classList.add('show');
    }
};
