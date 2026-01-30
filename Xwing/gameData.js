// gameData.js - Contains all game rules, content, and reference data

const gameData = {
    // Step-by-step walkthrough content for each phase
    phaseSteps: {
        planning: [
            {
                title: 'Set Your Maneuver Dials',
                content: `
                    <p>Each player secretly selects a maneuver for every ship they control.</p>
                    <p><strong>How to do it:</strong></p>
                    <ul>
                        <li>Find the <strong>maneuver dial</strong> for each of your ships</li>
                        <li>Turn the dial to select your desired maneuver</li>
                        <li>Place the dial <strong>facedown</strong> next to that ship</li>
                        <li>You can look at your own dials, but don't let your opponent see!</li>
                    </ul>
                    <div class="info-box gold">
                        <h4>Understanding the Dial</h4>
                        <p>The dial shows all maneuvers your ship can perform. Each maneuver has:</p>
                        <ul>
                            <li><strong>Speed</strong> (1-5) - How far the ship moves</li>
                            <li><strong>Direction</strong> - Straight, bank, turn, or special</li>
                            <li><strong>Color</strong> - Blue, white, or red (see below)</li>
                        </ul>
                    </div>
                `,
                tip: 'Try to predict where your opponent will move. Setting up good firing positions while staying out of enemy arcs is key to winning!'
            },
            {
                title: 'Understanding Maneuver Colors',
                content: `
                    <p>Maneuvers are color-coded to show their difficulty:</p>
                    <div class="maneuver-grid">
                        <div class="maneuver-card blue">
                            <div class="maneuver-color-indicator">😊</div>
                            <h3>Blue</h3>
                            <p><strong>Easy!</strong></p>
                            <p>Remove 1 stress token after executing</p>
                        </div>
                        <div class="maneuver-card white">
                            <div class="maneuver-color-indicator">😐</div>
                            <h3>White</h3>
                            <p><strong>Normal</strong></p>
                            <p>No effect on stress</p>
                        </div>
                        <div class="maneuver-card red">
                            <div class="maneuver-color-indicator">😰</div>
                            <h3>Red</h3>
                            <p><strong>Difficult!</strong></p>
                            <p>Gain 1 stress token after executing</p>
                        </div>
                    </div>
                `,
                tip: 'If your ship is stressed, you cannot select red maneuvers! Plan ahead to avoid getting stuck.'
            },
            {
                title: 'Determine First Player',
                content: `
                    <p>Both players roll to see who goes first this round.</p>
                    <p><strong>How to roll:</strong></p>
                    <ul>
                        <li>Each player rolls <strong>3 attack dice</strong> (red dice)</li>
                        <li>Compare results in this order:</li>
                    </ul>
                    <ol style="margin-left: 25px; margin-top: 10px;">
                        <li>Most <strong>💥 Hit</strong> results wins</li>
                        <li>If tied, most <strong>👁️ Focus</strong> results wins</li>
                        <li>If still tied, most <strong>○ Blank</strong> results wins</li>
                        <li>If still tied, reroll!</li>
                    </ol>
                    <div class="info-box tip">
                        <h4>Why First Player Matters</h4>
                        <p>The first player's ships act first whenever initiative values are tied. This can be crucial during combat!</p>
                    </div>
                `,
                tip: 'Use the dice roller in the sidebar to roll for first player!'
            }
        ],

        system: [
            {
                title: 'System Phase Overview',
                content: `
                    <p>The System Phase is for special abilities that happen <strong>before</strong> ships move.</p>
                    <div class="info-box gold">
                        <h4>Activation Order</h4>
                        <p>Ships activate in <strong>initiative order: lowest to highest</strong></p>
                        <p>Example: A ship with initiative 2 acts before a ship with initiative 4</p>
                    </div>
                    <p><strong>Common System Phase abilities:</strong></p>
                    <ul>
                        <li>💣 Dropping or launching bombs/mines</li>
                        <li>👻 Decloaking (for ships with cloak)</li>
                        <li>⚡ Special pilot abilities that say "During System Phase"</li>
                    </ul>
                `,
                tip: 'If neither player has System Phase abilities, you can skip straight to Activation Phase!'
            },
            {
                title: 'Using System Phase Abilities',
                content: `
                    <p>If you have ships with System Phase abilities:</p>
                    <ol style="margin-left: 25px;">
                        <li>Start with the <strong>lowest initiative</strong> ship</li>
                        <li>Resolve any System Phase abilities for that ship</li>
                        <li>Move to the next lowest initiative ship</li>
                        <li>Continue until all ships have had a chance to act</li>
                    </ol>
                    <div class="info-box warning">
                        <h4>No System Abilities?</h4>
                        <p>If your ships don't have any abilities that trigger during System Phase, simply proceed to the Activation Phase.</p>
                    </div>
                `
            }
        ],

        activation: [
            {
                title: 'Activation Phase Overview',
                content: `
                    <p>This is where ships <strong>move</strong> and <strong>take actions</strong>!</p>
                    <div class="info-box gold">
                        <h4>Activation Order</h4>
                        <p>Ships activate in <strong>initiative order: lowest to highest</strong></p>
                        <p>This means lower initiative ships move first, which can be a disadvantage - higher initiative pilots see where enemies are before choosing their action!</p>
                    </div>
                    <p><strong>Each ship follows these steps:</strong></p>
                    <ol style="margin-left: 25px;">
                        <li>Reveal maneuver dial</li>
                        <li>Execute maneuver</li>
                        <li>Perform action (if not stressed)</li>
                    </ol>
                `,
                tip: 'Complete all steps for one ship before moving to the next ship!'
            },
            {
                title: 'Step 1: Reveal Dial',
                content: `
                    <p>When it's your ship's turn to activate:</p>
                    <ul>
                        <li>Flip the maneuver dial <strong>faceup</strong></li>
                        <li>Place it next to the ship card so everyone can see</li>
                        <li>This shows which maneuver the ship will execute</li>
                    </ul>
                    <div class="info-box tip">
                        <h4>Reading the Dial</h4>
                        <p>The revealed maneuver shows:</p>
                        <ul>
                            <li><strong>Speed</strong> - The number (1-5)</li>
                            <li><strong>Bearing</strong> - The arrow shape (straight, bank, turn, etc.)</li>
                            <li><strong>Difficulty</strong> - The color (blue, white, or red)</li>
                        </ul>
                    </div>
                `,
                tip: 'Once revealed, you must execute that maneuver - no take-backs!'
            },
            {
                title: 'Step 2: Execute Maneuver',
                content: `
                    <p><strong>How to move your ship:</strong></p>
                    <ol style="margin-left: 25px;">
                        <li>Find the <strong>matching template</strong> (same speed and shape)</li>
                        <li>Place template between the ship's <strong>front guides</strong></li>
                        <li>Slide template until it's flush against the base</li>
                        <li>Pick up your ship</li>
                        <li>Place ship at the other end of the template</li>
                        <li>Slide the ship's <strong>rear guides</strong> into the template</li>
                        <li>Remove the template</li>
                    </ol>
                    <div class="info-box gold">
                        <h4>After Moving - Check Difficulty!</h4>
                        <ul>
                            <li><span class="text-blue"><strong>Blue maneuver:</strong></span> Remove 1 stress token</li>
                            <li><strong>White maneuver:</strong> No effect</li>
                            <li><span class="text-red"><strong>Red maneuver:</strong></span> Gain 1 stress token</li>
                        </ul>
                    </div>
                `,
                tip: 'Take your time placing templates precisely - even small differences can affect combat!'
            },
            {
                title: 'Step 3: Perform Action',
                content: `
                    <p>After moving, your ship may perform <strong>one action</strong> from its action bar.</p>
                    <div class="info-box warning">
                        <h4>⚠️ Stressed Ships Skip This Step!</h4>
                        <p>If your ship has any stress tokens, it <strong>cannot</strong> perform actions.</p>
                    </div>
                    <h3 style="margin-top: 20px;">Common Actions:</h3>
                    <div class="token-grid" style="margin-top: 15px;">
                        <div class="token-card focus">
                            <div class="token-symbol">●</div>
                            <div class="token-info">
                                <h4>Focus</h4>
                                <p>Gain a focus token. Spend it to change all focus results to hits or evades.</p>
                            </div>
                        </div>
                        <div class="token-card evade">
                            <div class="token-symbol">◆</div>
                            <div class="token-info">
                                <h4>Evade</h4>
                                <p>Gain an evade token. Spend to add 1 evade result when defending.</p>
                            </div>
                        </div>
                        <div class="token-card lock">
                            <div class="token-symbol">⊕</div>
                            <div class="token-info">
                                <h4>Lock</h4>
                                <p>Lock an enemy at range 0-3. Spend to reroll attack dice against them.</p>
                            </div>
                        </div>
                    </div>
                `,
                tip: 'Focus is the most versatile action for beginners - it helps both attack AND defense!'
            },
            {
                title: 'What If Ships Overlap?',
                content: `
                    <p>Sometimes your maneuver causes your ship to land on another ship. When this happens:</p>
                    <ol style="margin-left: 25px;">
                        <li><strong>Slide backward</strong> along the template until not overlapping</li>
                        <li><strong>Place ship</strong> touching the last ship you backed over</li>
                        <li><strong>Still check difficulty</strong> (gain/remove stress as normal)</li>
                    </ol>
                    <div class="info-box warning">
                        <h4>Overlapping a Friendly Ship:</h4>
                        <ul>
                            <li>Roll 1 attack die - on hit/crit, suffer 1 damage</li>
                            <li>Skip your action step</li>
                        </ul>
                    </div>
                    <div class="info-box tip">
                        <h4>Overlapping an Enemy Ship:</h4>
                        <ul>
                            <li>You may perform a Focus or Calculate action (as red - gain stress)</li>
                            <li>Skip your normal action step</li>
                        </ul>
                    </div>
                `,
                tip: 'Intentionally blocking enemy ships is a powerful tactic! It denies them their action.'
            }
        ],

        engagement: [
            {
                title: 'Engagement Phase Overview',
                content: `
                    <p>This is where ships <strong>attack</strong> each other!</p>
                    <div class="info-box gold">
                        <h4>Engagement Order - REVERSED!</h4>
                        <p>Ships engage in <strong>initiative order: highest to lowest</strong></p>
                        <p>This is the OPPOSITE of Activation Phase!</p>
                        <p><strong>Higher initiative = shoot first = can destroy enemies before they fire!</strong></p>
                    </div>
                    <p>Each ship that engages may perform <strong>one attack</strong> against an enemy in range and arc.</p>
                `,
                tip: 'Higher initiative pilots are valuable because they can eliminate threats before taking fire!'
            },
            {
                title: 'Declare Your Target',
                content: `
                    <p>Before attacking, you must have a valid target:</p>
                    <div class="info-box gold">
                        <h4>Two Requirements:</h4>
                        <ol style="margin-left: 20px;">
                            <li><strong>In Arc</strong> - Target must be in your firing arc (usually front arc)</li>
                            <li><strong>In Range</strong> - Target must be at range 1-3</li>
                        </ol>
                    </div>
                    <p><strong>How to measure range:</strong></p>
                    <ul>
                        <li>Place the range ruler from your ship to the target</li>
                        <li>Measure from the closest points of both bases</li>
                        <li>The range band touched determines the range</li>
                    </ul>
                    <div class="range-visual" style="margin-top: 15px;">
                        <div class="range-segment range-1">Range 1<br>+1 attack die!</div>
                        <div class="range-segment range-2">Range 2<br>Standard</div>
                        <div class="range-segment range-3">Range 3<br>+1 defense die</div>
                    </div>
                `,
                tip: 'Getting to Range 1 is worth the risk - that extra attack die is powerful!'
            },
            {
                title: 'Roll Attack Dice',
                content: `
                    <p>The attacker rolls red dice equal to their ship's <strong>attack value</strong>.</p>
                    <div class="info-box gold">
                        <h4>Attack Value</h4>
                        <p>Find the red number on your ship card - that's how many dice you roll!</p>
                        <p><strong>Range 1 Bonus:</strong> Roll +1 additional attack die</p>
                    </div>
                    <h3 style="margin-top: 20px;">Attack Dice Results:</h3>
                    <div class="legend-grid" style="margin-top: 15px;">
                        <div class="legend-item">
                            <span class="die attack">💥</span>
                            <span><strong>Hit</strong><br>1 damage</span>
                        </div>
                        <div class="legend-item">
                            <span class="die attack">☠️</span>
                            <span><strong>Crit</strong><br>1 critical damage</span>
                        </div>
                        <div class="legend-item">
                            <span class="die attack">👁️</span>
                            <span><strong>Focus</strong><br>Needs token to count</span>
                        </div>
                        <div class="legend-item">
                            <span class="die attack">○</span>
                            <span><strong>Blank</strong><br>No effect</span>
                        </div>
                    </div>
                `,
                tip: 'Use the dice roller in the sidebar! Tap "Roll Dice" for quick access.'
            },
            {
                title: 'Roll Defense Dice',
                content: `
                    <p>The defender rolls green dice equal to their ship's <strong>agility value</strong>.</p>
                    <div class="info-box gold">
                        <h4>Agility Value</h4>
                        <p>Find the green number on your ship card - that's how many dice you roll!</p>
                        <p><strong>Range 3 Bonus:</strong> Roll +1 additional defense die</p>
                        <p><strong>Obstructed:</strong> Roll +1 additional defense die</p>
                    </div>
                    <h3 style="margin-top: 20px;">Defense Dice Results:</h3>
                    <div class="legend-grid" style="margin-top: 15px;">
                        <div class="legend-item">
                            <span class="die defense">🛡️</span>
                            <span><strong>Evade</strong><br>Cancels 1 hit</span>
                        </div>
                        <div class="legend-item">
                            <span class="die defense">👁️</span>
                            <span><strong>Focus</strong><br>Needs token to count</span>
                        </div>
                        <div class="legend-item">
                            <span class="die defense">○</span>
                            <span><strong>Blank</strong><br>No effect</span>
                        </div>
                    </div>
                `,
                tip: 'Agile ships with high defense values are harder to hit but often have weaker attacks.'
            },
            {
                title: 'Modify Dice',
                content: `
                    <p>After rolling, both players can spend tokens to modify their dice.</p>
                    <div class="info-box gold">
                        <h4>Modification Order:</h4>
                        <ol style="margin-left: 20px;">
                            <li>Defender modifies attacker's dice first</li>
                            <li>Attacker modifies their own dice</li>
                            <li>Attacker modifies defender's dice</li>
                            <li>Defender modifies their own dice</li>
                        </ol>
                    </div>
                    <h3 style="margin-top: 20px;">Common Modifications:</h3>
                    <ul>
                        <li><strong>Focus Token:</strong> Change ALL focus results to hits (attack) or evades (defense)</li>
                        <li><strong>Evade Token:</strong> Add 1 evade result to your defense roll</li>
                        <li><strong>Lock Token:</strong> Reroll any number of attack dice against locked ship</li>
                    </ul>
                `,
                tip: 'Focus tokens are powerful because they can change MULTIPLE dice at once!'
            },
            {
                title: 'Compare Results & Deal Damage',
                content: `
                    <p><strong>Neutralize Results:</strong></p>
                    <ul>
                        <li>Each 🛡️ Evade result cancels one 💥 Hit result</li>
                        <li>Cancel ALL Hits first, then Evades can cancel ☠️ Crits</li>
                    </ul>
                    <div class="info-box warning">
                        <h4>Dealing Damage</h4>
                        <p>For each uncanceled hit/crit result:</p>
                        <ol style="margin-left: 20px;">
                            <li><strong>Shields first:</strong> Flip shield tokens to inactive (red) side</li>
                            <li><strong>Then hull:</strong> Draw damage cards from the damage deck</li>
                        </ol>
                        <p><strong>💥 Hit:</strong> Damage card facedown (just counts as damage)</p>
                        <p><strong>☠️ Crit:</strong> Damage card faceup (has negative effect!)</p>
                    </div>
                    <div class="info-box gold">
                        <h4>Ship Destruction</h4>
                        <p>A ship is <strong>destroyed</strong> when its damage cards equal or exceed its hull value!</p>
                    </div>
                `,
                tip: 'Shields absorb both hits AND crits - they\'re very valuable!'
            }
        ],

        end: [
            {
                title: 'End Phase Overview',
                content: `
                    <p>The End Phase wraps up the round with cleanup and scoring.</p>
                    <div class="info-box gold">
                        <h4>End Phase Steps:</h4>
                        <ol style="margin-left: 20px;">
                            <li>Remove circular tokens</li>
                            <li>Recover charges</li>
                            <li>Check victory conditions</li>
                            <li>Score scenario objectives (Round 2+)</li>
                        </ol>
                    </div>
                `,
                tip: 'Don\'t forget to check victory conditions - the game might be over!'
            },
            {
                title: 'Remove Circular Tokens',
                content: `
                    <p>Remove all <strong>circular</strong> tokens from all ships:</p>
                    <div class="info-box success">
                        <h4>Remove These (Circular Tokens):</h4>
                        <ul>
                            <li>Focus tokens</li>
                            <li>Evade tokens</li>
                            <li>Calculate tokens</li>
                            <li>Disarm tokens</li>
                        </ul>
                    </div>
                    <div class="info-box warning">
                        <h4>DO NOT Remove These (Square Tokens):</h4>
                        <ul>
                            <li><strong>Stress tokens</strong> - removed by blue maneuvers</li>
                            <li><strong>Lock tokens</strong> - stay until spent</li>
                            <li><strong>Ion tokens</strong> - removed after ion maneuver</li>
                            <li><strong>Strain tokens</strong> - removed by other effects</li>
                        </ul>
                    </div>
                `,
                tip: 'Easy rule: Round tokens go away each round. Square tokens stay!'
            },
            {
                title: 'Recover Charges',
                content: `
                    <p>Some upgrade cards have <strong>charges</strong> that can be spent and recovered.</p>
                    <div class="info-box gold">
                        <h4>How to Recover:</h4>
                        <ul>
                            <li>Look for the <strong>↻ symbol</strong> next to a card's charge limit</li>
                            <li>If present, recover <strong>1 charge</strong> during End Phase</li>
                            <li>Cannot exceed the card's maximum charges</li>
                        </ul>
                    </div>
                    <p><strong>Force charges</strong> (purple) also recover this way if the card shows ↻.</p>
                `,
                tip: 'Not all charges recover! Check for the recovery symbol on each card.'
            },
            {
                title: 'Check Victory Conditions',
                content: `
                    <p>The game can end in three ways:</p>
                    <div class="info-box gold">
                        <h4>1. All Enemy Ships Destroyed</h4>
                        <p>If only one player has ships remaining, that player wins <strong>immediately</strong>!</p>
                    </div>
                    <div class="info-box gold">
                        <h4>2. 20+ Mission Points</h4>
                        <p>If a player has <strong>20 or more mission points</strong> AND has more points than their opponent, that player wins!</p>
                    </div>
                    <div class="info-box gold">
                        <h4>3. End of Round 12</h4>
                        <p>After completing Round 12, the player with the most mission points wins!</p>
                    </div>
                `,
                tip: 'You earn mission points from destroying ships AND completing scenario objectives!'
            },
            {
                title: 'Score Objectives (Round 2+)',
                content: `
                    <p>Starting from <strong>Round 2</strong>, score points for scenario objectives.</p>
                    <div class="info-box gold">
                        <h4>Ways to Earn Mission Points:</h4>
                        <ul>
                            <li><strong>Destroying ships:</strong> Earn points equal to the ship's squad point value</li>
                            <li><strong>Scenario objectives:</strong> Control satellites, tow caches, scramble transmissions, etc.</li>
                            <li><strong>Half points:</strong> Some scenarios give points for damaging ships to half health</li>
                        </ul>
                    </div>
                    <p>Track your mission points throughout the game!</p>
                `,
                tip: 'Don\'t focus only on destruction - scenario objectives can win games!'
            },
            {
                title: 'Start Next Round',
                content: `
                    <p>If no one has won, begin the next round!</p>
                    <ol style="margin-left: 25px;">
                        <li>Increment the round counter</li>
                        <li>Return to the <strong>Planning Phase</strong></li>
                        <li>Set new maneuver dials for all ships</li>
                        <li>Roll for first player again</li>
                    </ol>
                    <div class="info-box tip">
                        <h4>Remember!</h4>
                        <p>Stress tokens carry over between rounds. Plan your blue maneuvers carefully to remove stress!</p>
                    </div>
                `
            }
        ]
    },

    // Rules reference categories and content
    rulesCategories: [
        {
            name: 'Game Basics',
            items: [
                { id: 'overview', icon: '📖', title: 'Game Overview' },
                { id: 'components', icon: '🎮', title: 'Game Components' },
                { id: 'round-structure', icon: '🔄', title: 'Round Structure' },
                { id: 'initiative', icon: '⚡', title: 'Initiative' }
            ]
        },
        {
            name: 'Movement',
            items: [
                { id: 'maneuvers', icon: '✈️', title: 'Maneuvers' },
                { id: 'templates', icon: '📐', title: 'Templates' },
                { id: 'difficulty', icon: '🎨', title: 'Difficulty Colors' },
                { id: 'advanced-moves', icon: '🌀', title: 'Advanced Maneuvers' }
            ]
        },
        {
            name: 'Actions',
            items: [
                { id: 'actions-overview', icon: '⚡', title: 'Actions Overview' },
                { id: 'focus', icon: '🎯', title: 'Focus' },
                { id: 'evade', icon: '🛡️', title: 'Evade' },
                { id: 'lock', icon: '🔒', title: 'Target Lock' },
                { id: 'barrel-roll', icon: '↔️', title: 'Barrel Roll' },
                { id: 'boost', icon: '⏩', title: 'Boost' }
            ]
        },
        {
            name: 'Combat',
            items: [
                { id: 'attack-sequence', icon: '⚔️', title: 'Attack Sequence' },
                { id: 'range', icon: '📏', title: 'Range & Bonuses' },
                { id: 'dice', icon: '🎲', title: 'Dice Results' },
                { id: 'damage', icon: '💔', title: 'Damage & Destruction' }
            ]
        },
        {
            name: 'Tokens',
            items: [
                { id: 'green-tokens', icon: '🟢', title: 'Green Tokens' },
                { id: 'red-tokens', icon: '🔴', title: 'Red Tokens' },
                { id: 'stress', icon: '😰', title: 'Stress' }
            ]
        },
        {
            name: 'Special Rules',
            items: [
                { id: 'obstacles', icon: '🪨', title: 'Obstacles' },
                { id: 'overlapping', icon: '💥', title: 'Overlapping' },
                { id: 'arcs', icon: '📐', title: 'Firing Arcs' }
            ]
        }
    ],

    rules: {
        'overview': {
            icon: '📖',
            title: 'Game Overview',
            content: `
                <p>X-Wing is a tactical miniatures game where you command starfighters in fast-paced space combat.</p>

                <h3>The Goal</h3>
                <p>Destroy enemy ships while completing scenario objectives to earn <strong>mission points</strong>. The first player to reach 20+ points with more than their opponent wins - or the player with the most points after 12 rounds.</p>

                <h3>Each Round</h3>
                <p>Every round follows the same five phases:</p>
                <ol style="margin-left: 25px;">
                    <li><strong>Planning Phase</strong> - Secretly set maneuver dials</li>
                    <li><strong>System Phase</strong> - Special abilities (bombs, decloak, etc.)</li>
                    <li><strong>Activation Phase</strong> - Move ships and take actions</li>
                    <li><strong>Engagement Phase</strong> - Ships attack each other</li>
                    <li><strong>End Phase</strong> - Cleanup, recover charges, check victory</li>
                </ol>

                <h3>Key Concepts</h3>
                <ul>
                    <li><strong>Initiative</strong> determines action order - lower moves first, higher shoots first</li>
                    <li><strong>Actions</strong> give your ships tokens that modify dice</li>
                    <li><strong>Range</strong> affects combat - close is better for attacking, far is better for defending</li>
                </ul>
            `
        },

        'components': {
            icon: '🎮',
            title: 'Game Components',
            content: `
                <h3>Ship Components</h3>
                <ul>
                    <li><strong>Ship Base</strong> - The plastic stand your ship sits on</li>
                    <li><strong>Ship Card</strong> - Shows pilot ability, stats, and action bar</li>
                    <li><strong>Maneuver Dial</strong> - Used to secretly select maneuvers</li>
                    <li><strong>ID Tokens</strong> - Match ships to their cards</li>
                </ul>

                <h3>Ship Statistics</h3>
                <p>Every ship card shows these key values:</p>
                <ul>
                    <li><span class="text-red"><strong>Attack</strong></span> - Red number, how many attack dice you roll</li>
                    <li><span class="text-green"><strong>Agility</strong></span> - Green number, how many defense dice you roll</li>
                    <li><span class="text-gold"><strong>Hull</strong></span> - Yellow number, how much damage before destruction</li>
                    <li><span class="text-blue"><strong>Shields</strong></span> - Blue number, damage absorbed before hull</li>
                </ul>

                <h3>Templates</h3>
                <p>Plastic templates show exactly how far and in what direction ships move:</p>
                <ul>
                    <li><strong>Straight templates</strong> - Speed 1-5</li>
                    <li><strong>Bank templates</strong> - Gentle curves</li>
                    <li><strong>Turn templates</strong> - Sharp 90° turns</li>
                </ul>

                <h3>Dice</h3>
                <ul>
                    <li><strong>Attack Dice (Red)</strong> - Hit, Crit, Focus, Blank</li>
                    <li><strong>Defense Dice (Green)</strong> - Evade, Focus, Blank</li>
                </ul>
            `
        },

        'round-structure': {
            icon: '🔄',
            title: 'Round Structure',
            content: `
                <h3>1. Planning Phase</h3>
                <ul>
                    <li>All players secretly set maneuver dials for each ship</li>
                    <li>Roll 3 attack dice to determine first player for the round</li>
                    <li>Dials are placed facedown - once set, they're locked in!</li>
                </ul>

                <h3>2. System Phase</h3>
                <ul>
                    <li>Ships with System Phase abilities act (lowest to highest initiative)</li>
                    <li>Common abilities: dropping bombs, decloaking</li>
                    <li>Skip if no ships have System Phase abilities</li>
                </ul>

                <h3>3. Activation Phase</h3>
                <ul>
                    <li>Ships activate lowest to highest initiative</li>
                    <li>Each ship: Reveal dial → Execute maneuver → Perform action</li>
                    <li>Stressed ships skip the action step</li>
                </ul>

                <h3>4. Engagement Phase</h3>
                <ul>
                    <li>Ships engage highest to lowest initiative (reversed!)</li>
                    <li>Each ship may perform one attack</li>
                    <li>Ships destroyed at the same initiative can still shoot back</li>
                </ul>

                <h3>5. End Phase</h3>
                <ul>
                    <li>Remove all circular tokens (Focus, Evade, Calculate, Disarm)</li>
                    <li>Recover charges on cards with the ↻ symbol</li>
                    <li>Check victory conditions</li>
                    <li>Score scenario objectives (starting Round 2)</li>
                </ul>
            `
        },

        'initiative': {
            icon: '⚡',
            title: 'Initiative',
            content: `
                <h3>What is Initiative?</h3>
                <p>Initiative is a number (0-6) that determines when your ship acts. Each pilot has an initiative value shown on their card.</p>

                <h3>When Does It Matter?</h3>
                <div class="info-box gold">
                    <h4>System & Activation Phases</h4>
                    <p><strong>Lowest initiative acts FIRST</strong></p>
                    <p>Ships with low initiative must commit to their movement before seeing where high initiative ships go.</p>
                </div>

                <div class="info-box tip">
                    <h4>Engagement Phase</h4>
                    <p><strong>Highest initiative acts FIRST</strong></p>
                    <p>High initiative pilots can destroy enemies before they get to shoot!</p>
                </div>

                <h3>Tied Initiative</h3>
                <p>When two ships have the same initiative:</p>
                <ul>
                    <li>The <strong>first player's</strong> ships act first</li>
                    <li>First player is determined each round by rolling dice</li>
                </ul>

                <h3>Strategic Implications</h3>
                <ul>
                    <li><strong>High initiative:</strong> See where enemies move, shoot first</li>
                    <li><strong>Low initiative:</strong> Move first, can block enemy ships</li>
                    <li><strong>Mixed squads:</strong> Use low initiative to block, high to kill</li>
                </ul>
            `
        },

        'maneuvers': {
            icon: '✈️',
            title: 'Maneuvers',
            content: `
                <h3>Maneuver Components</h3>
                <p>Every maneuver has three parts:</p>
                <ul>
                    <li><strong>Speed</strong> - Number 0-5, how far the ship moves</li>
                    <li><strong>Bearing</strong> - Direction (straight, bank, turn, etc.)</li>
                    <li><strong>Difficulty</strong> - Color indicating stress effect</li>
                </ul>

                <h3>Bearing Types</h3>
                <ul>
                    <li><strong>Straight</strong> - Move directly forward</li>
                    <li><strong>Bank</strong> - Gentle curve (45°)</li>
                    <li><strong>Turn</strong> - Sharp curve (90°)</li>
                    <li><strong>Koiogran Turn</strong> - Straight forward, then 180° flip</li>
                    <li><strong>Segnor's Loop</strong> - Bank with 180° flip</li>
                    <li><strong>Tallon Roll</strong> - Turn with extra 90° rotation</li>
                    <li><strong>Stationary</strong> - Don't move at all</li>
                    <li><strong>Reverse</strong> - Move backward</li>
                </ul>

                <h3>Executing a Maneuver</h3>
                <ol style="margin-left: 25px;">
                    <li>Take the matching template</li>
                    <li>Place between ship's front guides</li>
                    <li>Pick up ship, place at other end of template</li>
                    <li>Slide ship's rear guides into template</li>
                    <li>Remove template</li>
                    <li>Apply difficulty effect (stress)</li>
                </ol>
            `
        },

        'templates': {
            icon: '📐',
            title: 'Templates',
            content: `
                <h3>Using Templates</h3>
                <p>Templates are precision tools that ensure consistent movement.</p>

                <h3>Standard Templates</h3>
                <ul>
                    <li><strong>Straight 1-5</strong> - Five different lengths</li>
                    <li><strong>Bank 1-3</strong> - Gentle 45° curves</li>
                    <li><strong>Turn 1-3</strong> - Sharp 90° curves</li>
                </ul>

                <h3>Template Placement</h3>
                <div class="info-box gold">
                    <h4>For Forward Maneuvers:</h4>
                    <ol style="margin-left: 20px;">
                        <li>Place template at FRONT guides</li>
                        <li>Move ship to other end</li>
                        <li>Ship's REAR guides slide into template</li>
                    </ol>
                </div>

                <div class="info-box tip">
                    <h4>For Reverse Maneuvers:</h4>
                    <ol style="margin-left: 20px;">
                        <li>Place template at REAR guides</li>
                        <li>Move ship to other end</li>
                        <li>Ship's FRONT guides slide into template</li>
                    </ol>
                </div>

                <h3>Tips</h3>
                <ul>
                    <li>Keep templates flat on the table</li>
                    <li>Push template flush against ship base</li>
                    <li>Don't bump other ships when placing templates</li>
                </ul>
            `
        },

        'difficulty': {
            icon: '🎨',
            title: 'Difficulty Colors',
            content: `
                <h3>Blue Maneuvers (Easy)</h3>
                <div class="info-box" style="border-color: #4da6ff; background: rgba(77, 166, 255, 0.1);">
                    <p>After executing a blue maneuver, <strong>remove 1 stress token</strong> from your ship.</p>
                    <p>Use these to recover from stress!</p>
                </div>

                <h3>White Maneuvers (Standard)</h3>
                <div class="info-box" style="border-color: #ccc; background: rgba(255, 255, 255, 0.1);">
                    <p>No effect on stress. Most maneuvers are white.</p>
                    <p>Your bread-and-butter movements.</p>
                </div>

                <h3>Red Maneuvers (Difficult)</h3>
                <div class="info-box" style="border-color: #ff4444; background: rgba(255, 68, 68, 0.1);">
                    <p>After executing a red maneuver, <strong>gain 1 stress token</strong>.</p>
                    <p>Powerful moves like K-turns are often red!</p>
                </div>

                <h3>Important Rules</h3>
                <ul>
                    <li>Stressed ships <strong>cannot</strong> execute red maneuvers</li>
                    <li>If you must execute a red maneuver while stressed, you execute a white [2 straight] instead</li>
                    <li>Difficulty is checked AFTER the maneuver is complete</li>
                </ul>
            `
        },

        'advanced-moves': {
            icon: '🌀',
            title: 'Advanced Maneuvers',
            content: `
                <h3>Koiogran Turn (K-Turn)</h3>
                <p>Move straight forward, then rotate 180°.</p>
                <ul>
                    <li>Use straight template</li>
                    <li>Ship's FRONT guides go into template end (not rear)</li>
                    <li>Ship ends facing opposite direction</li>
                </ul>

                <h3>Segnor's Loop</h3>
                <p>Bank maneuver with 180° rotation.</p>
                <ul>
                    <li>Use bank template</li>
                    <li>Ship ends facing opposite direction</li>
                    <li>Like a K-turn but with a curve</li>
                </ul>

                <h3>Tallon Roll</h3>
                <p>Turn or bank with extra 90° rotation.</p>
                <ul>
                    <li>Execute turn/bank as normal</li>
                    <li>Then rotate ship 90° in same direction</li>
                    <li>Align to left, center, or right of template end</li>
                </ul>

                <h3>Stationary (0-Speed)</h3>
                <p>Ship doesn't move but still activates.</p>
                <ul>
                    <li>No template used</li>
                    <li>Ship stays in place</li>
                    <li>Still check difficulty color!</li>
                </ul>

                <h3>Reverse Maneuvers</h3>
                <p>Ship moves backward.</p>
                <ul>
                    <li>Template at REAR guides</li>
                    <li>Ship's FRONT guides to template end</li>
                </ul>
            `
        },

        'actions-overview': {
            icon: '⚡',
            title: 'Actions Overview',
            content: `
                <h3>What Are Actions?</h3>
                <p>Actions are special abilities ships can perform after moving during the Activation Phase.</p>

                <h3>Action Rules</h3>
                <ul>
                    <li>Ships perform <strong>one action</strong> per activation</li>
                    <li>Actions are shown on the ship's <strong>action bar</strong></li>
                    <li><strong>Stressed ships cannot perform actions!</strong></li>
                </ul>

                <h3>Action Colors</h3>
                <div class="info-box" style="border-color: #fff;">
                    <h4>White Actions</h4>
                    <p>Normal actions with no additional effect.</p>
                </div>
                <div class="info-box" style="border-color: #ff4444; background: rgba(255, 68, 68, 0.1);">
                    <h4>Red Actions</h4>
                    <p>After performing, <strong>gain 1 stress token</strong>.</p>
                </div>
                <div class="info-box" style="border-color: #9933ff; background: rgba(153, 51, 255, 0.1);">
                    <h4>Purple Actions</h4>
                    <p>Require spending a <strong>Force charge</strong> to perform.</p>
                </div>

                <h3>Linked Actions</h3>
                <p>Some action bars show linked actions (arrow between two icons). After performing the first action, you may immediately perform the linked action as a red action.</p>
            `
        },

        'focus': {
            icon: '🎯',
            title: 'Focus',
            content: `
                <h3>Focus Action</h3>
                <p>Gain 1 focus token and place it near your ship.</p>

                <h3>Using Focus Tokens</h3>
                <p>During an attack or defense:</p>
                <ul>
                    <li>Spend the focus token</li>
                    <li>Change <strong>ALL</strong> focus results (👁️) to:</li>
                    <li><strong>Hits</strong> (when attacking), or</li>
                    <li><strong>Evades</strong> (when defending)</li>
                </ul>

                <div class="info-box gold">
                    <h4>Why Focus is Great</h4>
                    <ul>
                        <li>Works on BOTH attack AND defense</li>
                        <li>Changes ALL focus results, not just one</li>
                        <li>Most versatile action for beginners</li>
                    </ul>
                </div>

                <h3>Timing</h3>
                <ul>
                    <li>Can only spend during dice modification step</li>
                    <li>Removed at End Phase if not spent</li>
                </ul>
            `
        },

        'evade': {
            icon: '🛡️',
            title: 'Evade',
            content: `
                <h3>Evade Action</h3>
                <p>Gain 1 evade token and place it near your ship.</p>

                <h3>Using Evade Tokens</h3>
                <p>When defending:</p>
                <ul>
                    <li>Spend the evade token</li>
                    <li>Add 1 evade result (🛡️) to your roll</li>
                    <li>This is in addition to any evades you rolled!</li>
                </ul>

                <div class="info-box tip">
                    <h4>Evade vs Focus</h4>
                    <ul>
                        <li><strong>Evade:</strong> Guaranteed +1 evade result when defending</li>
                        <li><strong>Focus:</strong> Can change multiple dice, works on attack too</li>
                    </ul>
                    <p>Evade is better when you expect to defend multiple times or rolled no focus results.</p>
                </div>

                <h3>Timing</h3>
                <ul>
                    <li>Can only spend during dice modification step while defending</li>
                    <li>Removed at End Phase if not spent</li>
                </ul>
            `
        },

        'lock': {
            icon: '🔒',
            title: 'Target Lock',
            content: `
                <h3>Lock Action</h3>
                <p>Choose an enemy ship at range 0-3 and assign a lock token to it.</p>

                <h3>Using Lock Tokens</h3>
                <p>When attacking a locked ship:</p>
                <ul>
                    <li>Spend the lock token</li>
                    <li><strong>Reroll any number</strong> of your attack dice</li>
                    <li>Great for turning blanks into hits!</li>
                </ul>

                <div class="info-box gold">
                    <h4>Lock Token Properties</h4>
                    <ul>
                        <li>Stays on target until spent or target destroyed</li>
                        <li>NOT removed at End Phase</li>
                        <li>You can only have one lock on each enemy</li>
                        <li>Multiple ships can lock the same enemy</li>
                    </ul>
                </div>

                <h3>Strategic Uses</h3>
                <ul>
                    <li>Set up locks before combat range</li>
                    <li>Great with high-attack weapons</li>
                    <li>Some abilities require having a lock</li>
                </ul>
            `
        },

        'barrel-roll': {
            icon: '↔️',
            title: 'Barrel Roll',
            content: `
                <h3>Barrel Roll Action</h3>
                <p>Reposition your ship sideways using the [1 straight] template.</p>

                <h3>How to Barrel Roll</h3>
                <ol style="margin-left: 25px;">
                    <li>Take the [1 straight] template</li>
                    <li>Place it touching your ship's LEFT or RIGHT side</li>
                    <li>The template can be forward, centered, or backward</li>
                    <li>Pick up ship and place on other side of template</li>
                    <li>Ship must not overlap anything</li>
                </ol>

                <div class="info-box tip">
                    <h4>Common Uses</h4>
                    <ul>
                        <li>Dodge out of enemy firing arcs</li>
                        <li>Line up a shot you would have missed</li>
                        <li>Avoid landing on obstacles</li>
                    </ul>
                </div>

                <h3>Restrictions</h3>
                <ul>
                    <li>Cannot overlap ships, obstacles, or leave play area</li>
                    <li>Some ships have restricted barrel roll options</li>
                </ul>
            `
        },

        'boost': {
            icon: '⏩',
            title: 'Boost',
            content: `
                <h3>Boost Action</h3>
                <p>Move your ship forward using a speed 1 template.</p>

                <h3>How to Boost</h3>
                <ol style="margin-left: 25px;">
                    <li>Choose: [1 straight], [1 left bank], or [1 right bank]</li>
                    <li>Place template at ship's front guides</li>
                    <li>Move ship to other end of template</li>
                    <li>Ship must not overlap anything</li>
                </ol>

                <div class="info-box tip">
                    <h4>Common Uses</h4>
                    <ul>
                        <li>Close distance to get into Range 1</li>
                        <li>Escape from enemy arcs</li>
                        <li>Fine-tune position after movement</li>
                    </ul>
                </div>

                <h3>Restrictions</h3>
                <ul>
                    <li>Cannot overlap ships or obstacles</li>
                    <li>Cannot leave the play area</li>
                    <li>No stress effect (unless red action)</li>
                </ul>
            `
        },

        'attack-sequence': {
            icon: '⚔️',
            title: 'Attack Sequence',
            content: `
                <h3>Complete Attack Steps</h3>
                <ol style="margin-left: 25px;">
                    <li><strong>Declare Target</strong>
                        <ul>
                            <li>Choose enemy in your firing arc</li>
                            <li>Must be at range 1-3</li>
                            <li>Measure range to confirm</li>
                        </ul>
                    </li>
                    <li><strong>Roll Attack Dice</strong>
                        <ul>
                            <li>Roll dice equal to your attack value</li>
                            <li>Range 1: +1 attack die</li>
                        </ul>
                    </li>
                    <li><strong>Roll Defense Dice</strong>
                        <ul>
                            <li>Defender rolls dice equal to agility</li>
                            <li>Range 3: +1 defense die</li>
                            <li>Obstructed: +1 defense die</li>
                        </ul>
                    </li>
                    <li><strong>Modify Dice</strong>
                        <ul>
                            <li>Defender modifies attacker's dice</li>
                            <li>Attacker modifies their own dice</li>
                            <li>Attacker modifies defender's dice</li>
                            <li>Defender modifies their own dice</li>
                        </ul>
                    </li>
                    <li><strong>Neutralize Results</strong>
                        <ul>
                            <li>Each evade cancels one hit</li>
                            <li>Cancel ALL hits before crits</li>
                        </ul>
                    </li>
                    <li><strong>Deal Damage</strong>
                        <ul>
                            <li>Shields absorb damage first</li>
                            <li>Hits = facedown damage cards</li>
                            <li>Crits = faceup damage cards</li>
                        </ul>
                    </li>
                </ol>
            `
        },

        'range': {
            icon: '📏',
            title: 'Range & Bonuses',
            content: `
                <h3>Measuring Range</h3>
                <p>Use the range ruler to measure from the closest points of both ship bases.</p>

                <h3>Range Bonuses</h3>
                <div class="range-bonuses">
                    <div class="range-bonus-card range-1">
                        <h4>Range 1</h4>
                        <p>Attacker: <strong>+1 attack die</strong></p>
                        <p>Close combat is deadly!</p>
                    </div>
                    <div class="range-bonus-card range-2">
                        <h4>Range 2</h4>
                        <p>No bonuses</p>
                        <p>Standard combat range</p>
                    </div>
                    <div class="range-bonus-card range-3">
                        <h4>Range 3</h4>
                        <p>Defender: <strong>+1 defense die</strong></p>
                        <p>Harder to hit at distance</p>
                    </div>
                </div>

                <h3>Range 0 (Touching)</h3>
                <div class="info-box warning">
                    <h4>Special Range 0 Rules</h4>
                    <ul>
                        <li>Cannot add bonus dice</li>
                        <li>Attacker cannot modify their dice</li>
                        <li>Defender dice cannot be modified by attacker</li>
                    </ul>
                </div>

                <h3>Obstruction</h3>
                <p>If the attack line passes through an obstacle, the defender gets +1 defense die (obstructed).</p>
            `
        },

        'dice': {
            icon: '🎲',
            title: 'Dice Results',
            content: `
                <h3>Attack Dice (Red)</h3>
                <ul>
                    <li><strong>💥 Hit (3/8)</strong> - 1 damage</li>
                    <li><strong>☠️ Critical Hit (1/8)</strong> - 1 critical damage</li>
                    <li><strong>👁️ Focus (2/8)</strong> - No effect unless modified</li>
                    <li><strong>○ Blank (2/8)</strong> - No effect</li>
                </ul>

                <h3>Defense Dice (Green)</h3>
                <ul>
                    <li><strong>🛡️ Evade (3/8)</strong> - Cancels 1 hit</li>
                    <li><strong>👁️ Focus (2/8)</strong> - No effect unless modified</li>
                    <li><strong>○ Blank (3/8)</strong> - No effect</li>
                </ul>

                <h3>Dice Modification</h3>
                <ul>
                    <li><strong>Focus token</strong> - Change all focus results</li>
                    <li><strong>Lock token</strong> - Reroll any attack dice</li>
                    <li><strong>Evade token</strong> - Add 1 evade result</li>
                    <li><strong>Force</strong> - Change 1 focus to hit/evade</li>
                </ul>
            `
        },

        'damage': {
            icon: '💔',
            title: 'Damage & Destruction',
            content: `
                <h3>Suffering Damage</h3>
                <p>For each uncanceled hit or crit result:</p>
                <ol style="margin-left: 25px;">
                    <li><strong>Shields First</strong> - Flip active shield to inactive</li>
                    <li><strong>Then Hull</strong> - Draw damage card(s)</li>
                </ol>

                <h3>Damage Cards</h3>
                <ul>
                    <li><strong>Hit (💥)</strong> = Facedown damage card</li>
                    <li><strong>Crit (☠️)</strong> = Faceup damage card (resolve text!)</li>
                </ul>

                <h3>Ship Destruction</h3>
                <div class="info-box warning">
                    <p>A ship is <strong>destroyed</strong> when total damage cards (faceup + facedown) equals or exceeds hull value.</p>
                </div>

                <h3>Simultaneous Fire</h3>
                <p>If a ship is destroyed during Engagement Phase, it's removed AFTER all ships at the same initiative have engaged. Destroyed ships can shoot back!</p>

                <h3>Repairing Damage</h3>
                <ul>
                    <li><strong>Repair faceup card</strong> = Flip it facedown</li>
                    <li><strong>Repair facedown card</strong> = Discard it</li>
                </ul>
            `
        },

        'green-tokens': {
            icon: '🟢',
            title: 'Green Tokens',
            content: `
                <h3>Green Tokens (Positive Effects)</h3>
                <p>These tokens help your ship and are removed at End Phase.</p>

                <h3>Focus Token</h3>
                <ul>
                    <li>Gained from Focus action</li>
                    <li>Spend to change ALL focus results to hits/evades</li>
                    <li>Removed at End Phase</li>
                </ul>

                <h3>Evade Token</h3>
                <ul>
                    <li>Gained from Evade action</li>
                    <li>Spend to ADD 1 evade result when defending</li>
                    <li>Removed at End Phase</li>
                </ul>

                <h3>Calculate Token</h3>
                <ul>
                    <li>Gained from Calculate action (droids)</li>
                    <li>Spend to change 1 focus result to hit/evade</li>
                    <li>Removed at End Phase</li>
                </ul>

                <h3>Reinforce Token</h3>
                <ul>
                    <li>Gained from Reinforce action (large ships)</li>
                    <li>Adds evade result when defending from chosen arc</li>
                    <li>Removed at End Phase</li>
                </ul>
            `
        },

        'red-tokens': {
            icon: '🔴',
            title: 'Red Tokens',
            content: `
                <h3>Red Tokens (Negative Effects)</h3>
                <p>These tokens hinder your ship and must be removed through specific means.</p>

                <h3>Stress Token</h3>
                <ul>
                    <li>Cannot perform actions</li>
                    <li>Cannot execute red maneuvers</li>
                    <li>Remove by executing blue maneuver</li>
                </ul>

                <h3>Ion Token</h3>
                <ul>
                    <li>Ionized ships execute ion maneuver ([1 straight])</li>
                    <li>Can only perform Focus action</li>
                    <li>Removed after ion maneuver</li>
                    <li>Small = 1+ ion, Medium = 2+, Large = 3+</li>
                </ul>

                <h3>Strain Token</h3>
                <ul>
                    <li>Roll 1 fewer defense die</li>
                    <li>Removed after defending or completing action</li>
                </ul>

                <h3>Disarm Token</h3>
                <ul>
                    <li>Cannot perform attacks</li>
                    <li>Removed at End Phase (circular)</li>
                </ul>
            `
        },

        'stress': {
            icon: '😰',
            title: 'Stress',
            content: `
                <h3>What is Stress?</h3>
                <p>Stress represents your pilot being overwhelmed or pushed to their limits.</p>

                <h3>How to Gain Stress</h3>
                <ul>
                    <li>Execute a red maneuver</li>
                    <li>Perform a red action</li>
                    <li>Some card effects and obstacles</li>
                </ul>

                <h3>Effects of Stress</h3>
                <div class="info-box warning">
                    <h4>Stressed Ships CANNOT:</h4>
                    <ul>
                        <li>Execute red maneuvers</li>
                        <li>Perform actions of any kind</li>
                    </ul>
                </div>

                <h3>Removing Stress</h3>
                <ul>
                    <li><strong>Execute a blue maneuver</strong> - Most common</li>
                    <li>Some abilities and upgrades</li>
                </ul>

                <h3>Forced Maneuver</h3>
                <p>If you reveal a red maneuver while stressed, you must execute a [2 straight] white maneuver instead.</p>
            `
        },

        'obstacles': {
            icon: '🪨',
            title: 'Obstacles',
            content: `
                <h3>Asteroid</h3>
                <ul>
                    <li><strong>Overlapping:</strong> Suffer 1 damage, skip action</li>
                    <li><strong>Moving through:</strong> Roll attack die - on hit/crit, suffer 1 damage</li>
                    <li><strong>At range 0:</strong> Cannot attack</li>
                    <li><strong>Obstruction:</strong> Defender gets +1 defense die</li>
                </ul>

                <h3>Debris Cloud</h3>
                <ul>
                    <li><strong>Overlapping:</strong> Gain 1 stress, skip action</li>
                    <li><strong>Moving through:</strong> Roll attack die - on crit, suffer 1 damage</li>
                    <li><strong>At range 0:</strong> Cannot attack</li>
                    <li><strong>Obstruction:</strong> Defender gets +1 defense die</li>
                </ul>

                <h3>Gas Cloud</h3>
                <ul>
                    <li><strong>Overlapping:</strong> Gain 1 strain, break locks</li>
                    <li><strong>Moving through:</strong> Roll attack die - on focus, gain ion token</li>
                    <li><strong>At range 0:</strong> Cannot attack OR be locked</li>
                    <li><strong>Obstruction:</strong> Defender gets +1 defense die</li>
                </ul>
            `
        },

        'overlapping': {
            icon: '💥',
            title: 'Overlapping',
            content: `
                <h3>Overlapping Ships</h3>
                <p>When your maneuver would cause you to overlap another ship:</p>
                <ol style="margin-left: 25px;">
                    <li>Slide back along template until not overlapping</li>
                    <li>Place ship touching the last overlapped ship</li>
                    <li>Check maneuver difficulty normally</li>
                    <li>Apply overlap effects</li>
                </ol>

                <h3>Overlapping Friendly Ship</h3>
                <ul>
                    <li>Roll 1 attack die</li>
                    <li>On hit/crit: suffer 1 damage</li>
                    <li>Skip Perform Action step</li>
                </ul>

                <h3>Overlapping Enemy Ship</h3>
                <ul>
                    <li>May perform Focus or Calculate as red action</li>
                    <li>Skip normal Perform Action step</li>
                </ul>

                <h3>Overlapping Obstacles</h3>
                <p>Ships do NOT slide back when overlapping obstacles - they suffer the obstacle's effect instead.</p>
            `
        },

        'arcs': {
            icon: '📐',
            title: 'Firing Arcs',
            content: `
                <h3>What Are Arcs?</h3>
                <p>Arcs are the zones around your ship where you can target enemies. Most ships have a front arc.</p>

                <h3>Standard Arcs</h3>
                <ul>
                    <li><strong>Front Arc</strong> - 90° cone from front of ship (most common)</li>
                    <li><strong>Rear Arc</strong> - 90° cone from back of ship</li>
                    <li><strong>Full Front Arc</strong> - 180° from front (entire front half)</li>
                    <li><strong>Bullseye Arc</strong> - Narrow strip directly ahead</li>
                    <li><strong>Turret Arc</strong> - 90° arc that can rotate</li>
                </ul>

                <h3>Checking Arc</h3>
                <p>A ship is "in arc" if any part of its base is inside your firing arc. Use the arc lines printed on your ship base.</p>

                <h3>Full Arc (360°)</h3>
                <p>Some weapons can fire in any direction. These still require range measurement but ignore arc restrictions.</p>
            `
        }
    }
};
