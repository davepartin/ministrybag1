// uiController.js - Handles all UI updates and user interactions

const ui = {
    // Cache DOM elements
    elements: {},

    // Initialize UI
    init() {
        this.cacheElements();
    },

    // Cache frequently accessed DOM elements
    cacheElements() {
        this.elements = {
            welcomeScreen: document.getElementById('welcome-screen'),
            gameScreen: document.getElementById('game-screen'),
            rulesScreen: document.getElementById('rules-screen'),
            roundNumber: document.getElementById('round-number'),
            phaseTitle: document.getElementById('current-phase-title'),
            stepNumber: document.getElementById('step-number'),
            stepTitle: document.getElementById('step-title'),
            stepContent: document.getElementById('step-content'),
            stepTips: document.getElementById('step-tips'),
            progressDots: document.getElementById('progress-dots'),
            btnPrev: document.getElementById('btn-prev'),
            btnNext: document.getElementById('btn-next'),
            modalOverlay: document.getElementById('modal-overlay'),
            modalBody: document.getElementById('modal-body'),
            diceModal: document.getElementById('dice-modal'),
            attackResults: document.getElementById('attack-results'),
            defenseResults: document.getElementById('defense-results'),
            attackCount: document.getElementById('attack-count'),
            defenseCount: document.getElementById('defense-count'),
            rulesNav: document.getElementById('rules-nav'),
            rulesContent: document.getElementById('rules-content'),
            rulesSearch: document.getElementById('rules-search')
        };
    },

    // Switch screens
    showScreen(screenName) {
        // Hide all screens
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });

        // Show requested screen
        const screenId = screenName + '-screen';
        const screen = document.getElementById(screenId);
        if (screen) {
            screen.classList.add('active');
        }
    },

    // Update the entire game display
    updateGameDisplay() {
        this.updateRoundNumber();
        this.updatePhaseTracker();
        this.updateStepContent();
        this.updateProgressDots();
        this.updateNavigationButtons();
    },

    // Update round number display
    updateRoundNumber() {
        if (this.elements.roundNumber) {
            this.elements.roundNumber.textContent = game.state.currentRound;
        }
    },

    // Update phase tracker
    updatePhaseTracker() {
        const phaseName = game.getPhaseName();
        if (this.elements.phaseTitle) {
            this.elements.phaseTitle.textContent = phaseName;
        }

        // Update phase items
        document.querySelectorAll('.phase-item').forEach((item, index) => {
            item.classList.remove('active', 'completed');
            if (index < game.state.currentPhase) {
                item.classList.add('completed');
            } else if (index === game.state.currentPhase) {
                item.classList.add('active');
            }
        });

        // Update connectors
        document.querySelectorAll('.phase-connector').forEach((connector, index) => {
            connector.classList.remove('active');
            if (index < game.state.currentPhase) {
                connector.classList.add('active');
            }
        });
    },

    // Update step content
    updateStepContent() {
        const step = game.getCurrentStep();
        if (!step) return;

        // Update step number
        if (this.elements.stepNumber) {
            this.elements.stepNumber.textContent = `Step ${game.state.currentStep + 1}`;
        }

        // Update step title
        if (this.elements.stepTitle) {
            this.elements.stepTitle.textContent = step.title;
        }

        // Update step content
        if (this.elements.stepContent) {
            this.elements.stepContent.innerHTML = step.content;
        }

        // Update tips
        if (this.elements.stepTips) {
            if (step.tip) {
                this.elements.stepTips.innerHTML = `
                    <h4>💡 Beginner Tip</h4>
                    <p>${step.tip}</p>
                `;
                this.elements.stepTips.style.display = 'block';
            } else {
                this.elements.stepTips.style.display = 'none';
            }
        }
    },

    // Update progress dots
    updateProgressDots() {
        if (!this.elements.progressDots) return;

        const totalSteps = game.getTotalSteps();
        const currentStep = game.state.currentStep;

        let dotsHTML = '';
        for (let i = 0; i < totalSteps; i++) {
            let className = 'progress-dot';
            if (i < currentStep) {
                className += ' completed';
            } else if (i === currentStep) {
                className += ' active';
            }
            dotsHTML += `<div class="${className}" onclick="app.goToStep(${i})"></div>`;
        }

        this.elements.progressDots.innerHTML = dotsHTML;
    },

    // Update navigation buttons
    updateNavigationButtons() {
        // Check if we're at the very beginning
        const isFirst = game.state.currentRound === 1 &&
                       game.state.currentPhase === 0 &&
                       game.state.currentStep === 0;

        // Check if we're at the very end
        const isLast = game.state.currentRound === game.state.maxRounds &&
                      game.state.currentPhase === 4 &&
                      game.state.currentStep === game.getTotalSteps() - 1;

        if (this.elements.btnPrev) {
            this.elements.btnPrev.disabled = isFirst;
            this.elements.btnPrev.style.opacity = isFirst ? '0.5' : '1';
        }

        if (this.elements.btnNext) {
            if (isLast) {
                this.elements.btnNext.innerHTML = '<span class="nav-text">Finish</span>';
            } else {
                this.elements.btnNext.innerHTML = '<span class="nav-text">Next</span><span class="nav-icon">▶</span>';
            }
        }
    },

    // Show dice roller modal
    showDiceRoller() {
        if (this.elements.diceModal) {
            this.elements.diceModal.classList.add('active');
            this.updateDiceCounts();
        }
    },

    // Close dice roller modal
    closeDiceRoller() {
        if (this.elements.diceModal) {
            this.elements.diceModal.classList.remove('active');
        }
    },

    // Update dice count displays
    updateDiceCounts() {
        if (this.elements.attackCount) {
            this.elements.attackCount.textContent = game.dice.attack;
        }
        if (this.elements.defenseCount) {
            this.elements.defenseCount.textContent = game.dice.defense;
        }
    },

    // Display attack dice results
    displayAttackResults(results) {
        if (this.elements.attackResults) {
            this.elements.attackResults.innerHTML = results.map(result =>
                `<div class="die attack">${result.symbol}</div>`
            ).join('');

            // Summarize results
            const counts = game.countResults(results);
            const summary = [];
            if (counts.hit) summary.push(`${counts.hit} Hit`);
            if (counts.crit) summary.push(`${counts.crit} Crit`);
            if (counts.focus) summary.push(`${counts.focus} Focus`);
            if (counts.blank) summary.push(`${counts.blank} Blank`);

            this.elements.attackResults.innerHTML += `
                <div class="dice-summary" style="width: 100%; margin-top: 10px; text-align: center; color: #ffd700;">
                    ${summary.join(' • ')}
                </div>
            `;
        }
    },

    // Display defense dice results
    displayDefenseResults(results) {
        if (this.elements.defenseResults) {
            this.elements.defenseResults.innerHTML = results.map(result =>
                `<div class="die defense">${result.symbol}</div>`
            ).join('');

            // Summarize results
            const counts = game.countResults(results);
            const summary = [];
            if (counts.evade) summary.push(`${counts.evade} Evade`);
            if (counts.focus) summary.push(`${counts.focus} Focus`);
            if (counts.blank) summary.push(`${counts.blank} Blank`);

            this.elements.defenseResults.innerHTML += `
                <div class="dice-summary" style="width: 100%; margin-top: 10px; text-align: center; color: #ffd700;">
                    ${summary.join(' • ')}
                </div>
            `;
        }
    },

    // Show generic modal
    showModal(content) {
        if (this.elements.modalBody) {
            this.elements.modalBody.innerHTML = content;
        }
        if (this.elements.modalOverlay) {
            this.elements.modalOverlay.classList.add('active');
        }
    },

    // Close modal
    closeModal() {
        if (this.elements.modalOverlay) {
            this.elements.modalOverlay.classList.remove('active');
        }
    },

    // Show maneuver guide
    showManeuverGuide() {
        const content = `
            <h2>Maneuver Colors Explained</h2>
            <p>Maneuvers on your dial are color-coded to show their difficulty:</p>

            <div class="maneuver-grid">
                <div class="maneuver-card blue">
                    <div class="maneuver-color-indicator">😊</div>
                    <h3>Blue Maneuvers</h3>
                    <p><strong>Easy maneuvers that help your ship!</strong></p>
                    <p>After executing a blue maneuver, you <strong>remove 1 stress token</strong> from your ship.</p>
                    <p>Great for recovering when stressed.</p>
                </div>

                <div class="maneuver-card white">
                    <div class="maneuver-color-indicator">😐</div>
                    <h3>White Maneuvers</h3>
                    <p><strong>Standard maneuvers with no effect.</strong></p>
                    <p>No stress gained or lost. These are your bread-and-butter moves.</p>
                    <p>Safe and reliable choices.</p>
                </div>

                <div class="maneuver-card red">
                    <div class="maneuver-color-indicator">😰</div>
                    <h3>Red Maneuvers</h3>
                    <p><strong>Difficult maneuvers that stress your pilot!</strong></p>
                    <p>After executing a red maneuver, you <strong>gain 1 stress token</strong>.</p>
                    <p>Powerful but use carefully!</p>
                </div>
            </div>

            <div class="info-box warning">
                <h4>⚠️ Important: Stressed Ships</h4>
                <p>While your ship has a stress token:</p>
                <ul>
                    <li>You <strong>cannot</strong> execute red maneuvers</li>
                    <li>You <strong>cannot</strong> perform actions</li>
                </ul>
                <p>Remove stress with blue maneuvers or at the End Phase (if you have no red tokens)!</p>
            </div>

            <div class="info-box tip">
                <h4>💡 Beginner Strategy</h4>
                <p>New players should stick mostly to white and blue maneuvers. Only use red maneuvers when you really need that sharp turn or special move!</p>
            </div>
        `;
        this.showModal(content);
    },

    // Show token guide
    showTokenGuide() {
        const content = `
            <h2>Token Guide</h2>
            <p>Tokens represent temporary states and abilities for your ships:</p>

            <h3>Action Tokens (Green)</h3>
            <div class="token-grid">
                <div class="token-card focus">
                    <div class="token-symbol">●</div>
                    <div class="token-info">
                        <h4>Focus Token</h4>
                        <p>Spend to change all 👁️ (focus) results on your dice to hits (attack) or evades (defense).</p>
                    </div>
                </div>

                <div class="token-card evade">
                    <div class="token-symbol">◆</div>
                    <div class="token-info">
                        <h4>Evade Token</h4>
                        <p>Spend while defending to add 1 evade result to your roll.</p>
                    </div>
                </div>

                <div class="token-card lock">
                    <div class="token-symbol">⊕</div>
                    <div class="token-info">
                        <h4>Lock Token</h4>
                        <p>Placed on an enemy ship. Spend to reroll any number of your attack dice against that ship.</p>
                    </div>
                </div>

                <div class="token-card calculate">
                    <div class="token-symbol">∞</div>
                    <div class="token-info">
                        <h4>Calculate Token</h4>
                        <p>Spend to change 1 focus result to a hit or evade. Droids use these!</p>
                    </div>
                </div>
            </div>

            <h3>Negative Tokens (Red)</h3>
            <div class="token-grid">
                <div class="token-card stress">
                    <div class="token-symbol">⚡</div>
                    <div class="token-info">
                        <h4>Stress Token</h4>
                        <p>Cannot perform actions or red maneuvers while stressed. Remove by doing a blue maneuver.</p>
                    </div>
                </div>

                <div class="token-card strain">
                    <div class="token-symbol">⬥</div>
                    <div class="token-info">
                        <h4>Strain Token</h4>
                        <p>After defending or performing an action, if strained, roll 1 fewer defense die. Then remove the token.</p>
                    </div>
                </div>
            </div>

            <div class="info-box gold">
                <h4>🔑 Key Rules</h4>
                <ul>
                    <li><strong>Green tokens</strong> (Focus, Evade, Calculate) are removed at the End Phase</li>
                    <li><strong>Lock tokens</strong> stay until spent or the locked ship is destroyed</li>
                    <li><strong>Red tokens</strong> must be removed through specific actions</li>
                </ul>
            </div>
        `;
        this.showModal(content);
    },

    // Show range guide
    showRangeGuide() {
        const content = `
            <h2>Range & Combat Guide</h2>

            <h3>Range Ruler</h3>
            <p>Use the range ruler to measure distance between ships:</p>

            <div class="range-visual">
                <div class="range-segment range-1">Range 1</div>
                <div class="range-segment range-2">Range 2</div>
                <div class="range-segment range-3">Range 3</div>
            </div>

            <h3>Range Combat Bonuses</h3>
            <div class="range-bonuses">
                <div class="range-bonus-card range-1">
                    <h4>Range 1</h4>
                    <p><strong>Attacker bonus!</strong></p>
                    <p>Roll <span class="text-red">+1 attack die</span></p>
                    <p>Get in close for maximum damage!</p>
                </div>

                <div class="range-bonus-card range-2">
                    <h4>Range 2</h4>
                    <p><strong>No bonus</strong></p>
                    <p>Standard combat range</p>
                    <p>No extra dice for either side</p>
                </div>

                <div class="range-bonus-card range-3">
                    <h4>Range 3</h4>
                    <p><strong>Defender bonus!</strong></p>
                    <p>Roll <span class="text-green">+1 defense die</span></p>
                    <p>Harder to hit at long range</p>
                </div>
            </div>

            <h3>Combat Steps (Quick Reference)</h3>
            <ol style="margin-left: 20px; line-height: 2;">
                <li><strong>Declare Target</strong> - Choose enemy in arc and range</li>
                <li><strong>Roll Attack Dice</strong> - Number shown on ship card</li>
                <li><strong>Defender Rolls</strong> - Defense dice shown on card</li>
                <li><strong>Modify Dice</strong> - Spend tokens (attacker then defender)</li>
                <li><strong>Compare Results</strong> - Hits cancel evades</li>
                <li><strong>Deal Damage</strong> - Remaining hits damage defender</li>
            </ol>

            <div class="info-box tip">
                <h4>💡 Combat Tips</h4>
                <ul>
                    <li>Focus tokens are incredibly valuable - they can change multiple dice!</li>
                    <li>Target Locks let you reroll dice - great for high-value attacks</li>
                    <li>Hits remove shields first, then deal damage cards</li>
                    <li>Critical hits deal face-up damage cards with special effects!</li>
                </ul>
            </div>
        `;
        this.showModal(content);
    },

    // Initialize and populate rules navigation
    initRulesNav() {
        if (!this.elements.rulesNav) return;

        let navHTML = '';

        gameData.rulesCategories.forEach(category => {
            navHTML += `<div class="rules-nav-section">${category.name}</div>`;
            category.items.forEach(item => {
                navHTML += `
                    <button class="rules-nav-item" data-rule="${item.id}" onclick="app.showRulesSection('${item.id}')">
                        ${item.icon} ${item.title}
                    </button>
                `;
            });
        });

        this.elements.rulesNav.innerHTML = navHTML;
    },

    // Show specific rules section
    showRulesSection(sectionId) {
        const section = gameData.rules[sectionId];
        if (!section || !this.elements.rulesContent) return;

        // Update navigation active state
        document.querySelectorAll('.rules-nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.rule === sectionId) {
                item.classList.add('active');
            }
        });

        // Display content
        this.elements.rulesContent.innerHTML = `
            <div class="rules-section">
                <h2>${section.icon} ${section.title}</h2>
                ${section.content}
            </div>
        `;
    },

    // Search rules
    searchRules(query) {
        if (!query.trim()) {
            // Show first section when search is cleared
            const firstCategory = gameData.rulesCategories[0];
            if (firstCategory && firstCategory.items[0]) {
                this.showRulesSection(firstCategory.items[0].id);
            }
            return;
        }

        const lowerQuery = query.toLowerCase();
        const results = [];

        // Search through all rules
        Object.entries(gameData.rules).forEach(([id, rule]) => {
            const titleMatch = rule.title.toLowerCase().includes(lowerQuery);
            const contentMatch = rule.content.toLowerCase().includes(lowerQuery);

            if (titleMatch || contentMatch) {
                results.push({
                    id,
                    title: rule.title,
                    icon: rule.icon,
                    relevance: titleMatch ? 2 : 1
                });
            }
        });

        // Sort by relevance
        results.sort((a, b) => b.relevance - a.relevance);

        // Display results
        if (results.length > 0) {
            let resultsHTML = `<div class="rules-section"><h2>Search Results for "${query}"</h2>`;
            results.forEach(result => {
                resultsHTML += `
                    <button class="rules-nav-item" onclick="app.showRulesSection('${result.id}')" style="margin: 5px 0; display: block;">
                        ${result.icon} ${result.title}
                    </button>
                `;
            });
            resultsHTML += '</div>';
            this.elements.rulesContent.innerHTML = resultsHTML;
        } else {
            this.elements.rulesContent.innerHTML = `
                <div class="rules-section">
                    <h2>No Results</h2>
                    <p>No rules found matching "${query}". Try a different search term.</p>
                </div>
            `;
        }
    }
};
