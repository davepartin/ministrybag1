// gameData.js - Contains all game rules, content, and reference data

const gameData = {
    scenarios: {
        satellite: {
            name: 'Assault at the Satellite Array',
            description: 'Take control of 5 satellites placed on the board',
            objectives: [
                'Place 1 satellite in center of play area',
                'Place 4 more satellites at range 3 of center',
                'Starting Round 2: Earn 1 point per satellite you control',
                'Control = more ships at range 0-1 (medium/large count as 2 ships)'
            ],
            special: 'Satellites are scenario features that cannot be moved or destroyed'
        },
        chance: {
            name: 'Chance Engagement',
            description: 'Contest the central satellite',
            objectives: [
                'Place 1 satellite in center of play area',
                'Starting Round 2: 1 point if you contest (ships at range 0-2)',
                '+1 bonus point if only you are contesting',
                'Half points when ships reduced to half health'
            ],
            special: 'Earn points for both damaging and destroying ships'
        },
        salvage: {
            name: 'Salvage Mission',
            description: 'Retrieve 5 supply caches using Tow action',
            objectives: [
                'Place 5 supply caches on the board',
                'Perform Tow action at range 0-1 to pick up cache',
                'Starting Round 2: 1 point per cache on your ships',
                'Towing ships cannot Barrel Roll, Boost, Rotate, SLAM, or Cloak'
            ],
            special: 'Supply caches are jettisoned if ship takes crit damage or is destroyed'
        },
        scramble: {
            name: 'Scramble the Transmissions',
            description: 'Scramble 3 satellites with Scramble action',
            objectives: [
                'Place 3 satellites on the board',
                'Perform Scramble action at range 0-1 to place your marker',
                'Starting Round 2: 1 point per satellite you control',
                'Your marker shows control - only one marker per satellite'
            ],
            special: 'Scrambling a satellite removes opponent marker'
        }
    },

    phaseContent: {
        planning: {
            actions: [
                { id: 'planningSteps', icon: '📝', title: 'Set Maneuver Dials', description: 'Choose secret maneuvers for all ships' },
                { id: 'determineFirstPlayer', icon: '🎲', title: 'Determine First Player', description: 'Roll 3 attack dice' },
                { id: 'maneuverColors', icon: '🎨', title: 'Maneuver Difficulty', description: 'Blue, White, Red explained' },
                { id: 'stressRules', icon: '⚠️', title: 'Stress Rules', description: 'What stressed ships cannot do' }
            ],
            tips: [
                '<strong>Tip:</strong> Predict where your opponent will move!',
                '<strong>Remember:</strong> Stressed ships cannot do red maneuvers',
                '<strong>Blue:</strong> Remove stress | <strong>Red:</strong> Gain stress'
            ]
        },
        system: {
            actions: [
                { id: 'systemPhaseOrder', icon: '📊', title: 'Activation Order', description: 'Lowest initiative to highest' },
                { id: 'dropDevices', icon: '💣', title: 'Drop/Launch Devices', description: 'Bombs, mines, and devices' },
                { id: 'specialAbilities', icon: '⚡', title: 'System Abilities', description: 'Special ship abilities' },
                { id: 'skipSystem', icon: '⏭️', title: 'Skip This Phase', description: 'No system abilities? Continue' }
            ],
            tips: [
                '<strong>Lowest initiative first</strong>',
                'If no ships have System abilities, skip this phase',
                'Common: Dropping bombs, decloaking'
            ]
        },
        activation: {
            actions: [
                { id: 'activationSteps', icon: '🚀', title: 'Ship Activation Steps', description: 'Reveal, move, action' },
                { id: 'executeManeuver', icon: '✈️', title: 'Execute Maneuver', description: 'How to move ships' },
                { id: 'performActions', icon: '⚡', title: 'Perform Actions', description: 'Focus, Lock, Boost, etc.' },
                { id: 'overlapping', icon: '💥', title: 'Overlapping Ships', description: 'What happens when ships collide' },
                { id: 'advancedManeuvers', icon: '🎯', title: 'Advanced Maneuvers', description: 'K-turns, Tallon Rolls, etc.' }
            ],
            tips: [
                '<strong>Lowest initiative activates first</strong>',
                'Ships move before taking actions',
                'Stressed ships skip the action step'
            ]
        },
        engagement: {
            actions: [
                { id: 'engagementOrder', icon: '📊', title: 'Engagement Order', description: 'Highest initiative to lowest' },
                { id: 'attackSteps', icon: '⚔️', title: 'Perform Attack', description: 'Complete attack sequence' },
                { id: 'diceRoller', icon: '🎲', title: 'Roll Dice', description: 'Attack and defense dice' },
                { id: 'rangeRules', icon: '📏', title: 'Range & Arc Rules', description: 'Targeting requirements' },
                { id: 'damageRules', icon: '💔', title: 'Dealing Damage', description: 'Shields and hull damage' }
            ],
            tips: [
                '<strong>Highest initiative shoots first!</strong>',
                '<strong>Range 1:</strong> +1 attack die',
                '<strong>Range 3:</strong> +1 defense die'
            ]
        },
        end: {
            actions: [
                { id: 'endPhaseCleanup', icon: '🧹', title: 'Remove Tokens', description: 'Clean up circular tokens' },
                { id: 'chargeRecovery', icon: '🔋', title: 'Recover Charges', description: 'Cards with recovery arrows' },
                { id: 'victoryCheck', icon: '🏆', title: 'Check Victory', description: 'Has anyone won?' },
                { id: 'scenarioScoring', icon: '📊', title: 'Score Objectives', description: 'Earn mission points' }
            ],
            tips: [
                'Remove: Focus, Evade, Calculate, Disarm tokens',
                'Recover charges on cards with ↻ symbol',
                'Check if anyone has won'
            ]
        }
    },

    detailContent: {
        planningSteps: {
            title: 'Planning Phase Steps',
            content: `
                <ul class="step-list">
                    <li>
                        <strong>Set Maneuver Dials</strong>
                        Each player secretly chooses a maneuver for each of their ships using the maneuver dial. The dial shows all available maneuvers for that ship type.
                    </li>
                    <li>
                        <strong>Assign Dials Facedown</strong>
                        Place the dial facedown next to the corresponding ship. You can look at or change your dials during this phase, but once you proceed to System Phase, they're locked in!
                    </li>
                    <li>
                        <strong>Determine First Player</strong>
                        Both players roll 3 attack dice. The player with the most Hit results becomes first player. If tied, most Focus results wins. Still tied? Most blanks. Still tied? Reroll.
                    </li>
                </ul>
                <div class="info-box warning">
                    <strong>⚠️ Critical:</strong> Stressed ships CANNOT set or execute red maneuvers!
                </div>
            `
        },

        determineFirstPlayer: {
            title: 'Determine First Player',
            content: `
                <div class="subsection">
                    <h4>Rolling for First Player</h4>
                    <p>At the start of each round, players roll to determine who goes first that round.</p>
                    <ul class="step-list">
                        <li>
                            <strong>Both players roll 3 attack dice</strong>
                            Use the red attack dice from your core set.
                        </li>
                        <li>
                            <strong>Compare Hit results</strong>
                            Player with most Hits wins. If tied, continue to next step.
                        </li>
                        <li>
                            <strong>Compare Focus results</strong>
                            Player with most Focus results wins. If tied, continue.
                        </li>
                        <li>
                            <strong>Compare Blank results</strong>
                            Player with most blanks wins. If still tied, reroll all dice.
                        </li>
                    </ul>
                </div>
                <div class="info-box tip">
                    <strong>Why It Matters:</strong> The first player's ships act first during tied initiative values in System and Activation phases, and in all timing conflicts.
                </div>
            `
        },

        maneuverColors: {
            title: 'Maneuver Difficulty',
            content: `
                <div class="subsection">
                    <h4>Maneuver Difficulty Colors</h4>
                    <p>Each maneuver has a difficulty color that affects your ship:</p>
                </div>
                <div class="info-box" style="background: rgba(77, 166, 255, 0.2); border-color: #4da6ff;">
                    <h4 style="color: #4da6ff;">🔵 BLUE - Easy Maneuvers</h4>
                    <p><strong>Effect:</strong> After executing, <span class="highlight">REMOVE 1 stress token</span> from your ship.</p>
                    <p style="margin-top: 10px;"><strong>Example:</strong> Your ship has 1 stress. You execute a blue maneuver. Remove the stress token. Your ship is no longer stressed!</p>
                </div>
                <div class="info-box" style="background: rgba(255, 255, 255, 0.1); border-color: #ccc;">
                    <h4 style="color: #ccc;">⚪ WHITE - Standard Maneuvers</h4>
                    <p><strong>Effect:</strong> No effect on stress.</p>
                    <p style="margin-top: 10px;">Most maneuvers are white. They don't help or hurt your stress situation.</p>
                </div>
                <div class="info-box" style="background: rgba(255, 68, 68, 0.2); border-color: #ff4444;">
                    <h4 style="color: #ff4444;">🔴 RED - Difficult Maneuvers</h4>
                    <p><strong>Effect:</strong> After executing, <span class="highlight">GAIN 1 stress token</span>.</p>
                    <p style="margin-top: 10px;"><strong>Example:</strong> K-turns, tight turns, and advanced maneuvers are often red. They're powerful but stressful!</p>
                </div>
                <div class="info-box warning">
                    <strong>⚠️ Stressed Ships:</strong> Cannot execute red maneuvers OR perform actions!
                </div>
            `
        },

        stressRules: {
            title: 'Stress Rules',
            content: `
                <div class="subsection">
                    <h4>What is Stress?</h4>
                    <p>A ship is <strong>STRESSED</strong> while it has one or more stress tokens. Stress represents the pilot being overwhelmed, making mistakes, or pushing their ship too hard.</p>
                </div>
                <div class="info-box warning">
                    <h4>Stressed Ships CANNOT:</h4>
                    <ul class="bullet-list">
                        <li><strong>Execute red maneuvers</strong> - Cannot set or execute any red maneuver</li>
                        <li><strong>Perform actions</strong> - Must skip the Perform Action step entirely</li>
                    </ul>
                </div>
                <div class="subsection">
                    <h4>How to Remove Stress</h4>
                    <ul class="bullet-list">
                        <li><strong>Execute a blue maneuver</strong> - Removes 1 stress token</li>
                        <li><strong>Special abilities</strong> - Some cards let you remove stress</li>
                    </ul>
                </div>
                <div class="info-box tip">
                    <strong>Strategic Note:</strong> Plan ahead! If your ship is stressed, you'll need to use blue or white maneuvers next turn. Avoid getting into situations where stress limits your options.
                </div>
            `
        },

        systemPhaseOrder: {
            title: 'System Phase Activation Order',
            content: `
                <div class="subsection">
                    <p>Ships with System Phase abilities activate in <strong>initiative order (lowest to highest)</strong></p>
                </div>
                <div class="info-box">
                    <h4>Common System Phase Actions:</h4>
                    <ul class="bullet-list">
                        <li><strong>Dropping or launching devices</strong> (bombs, mines)</li>
                        <li><strong>Decloaking</strong> - Ships with cloak tokens</li>
                        <li><strong>Deploying or docking</strong> - Large ships with docked fighters</li>
                        <li><strong>Special abilities</strong> that say "During System Phase"</li>
                    </ul>
                </div>
                <div class="info-box tip">
                    <strong>💡 Tip:</strong> If no ships have System Phase abilities, you can skip this phase entirely and proceed directly to Activation Phase.
                </div>
            `
        },

        dropDevices: {
            title: 'Dropping & Launching Devices',
            content: `
                <div class="subsection">
                    <h4>What are Devices?</h4>
                    <p>Devices are bombs and mines that ships can deploy during the System Phase. They're represented by physical markers placed on the board.</p>
                </div>
                <div class="subsection">
                    <h4>Dropping a Device</h4>
                    <ul class="step-list">
                        <li><strong>Take the template</strong> indicated on your upgrade card (usually [1 straight])</li>
                        <li><strong>Place template at ship's REAR guides</strong></li>
                        <li><strong>Place device at other end</strong> of template, then remove template</li>
                    </ul>
                </div>
                <div class="subsection">
                    <h4>Launching a Device</h4>
                    <ul class="step-list">
                        <li><strong>Take the template</strong> indicated on your upgrade card</li>
                        <li><strong>Place template at ship's FRONT guides</strong></li>
                        <li><strong>Place device at other end</strong> of template, then remove template</li>
                    </ul>
                </div>
                <div class="info-box">
                    <h4>Types of Devices:</h4>
                    <p><strong>Bombs:</strong> Detonate at end of Activation Phase, affecting nearby ships</p>
                    <p><strong>Mines:</strong> Detonate when a ship moves through or overlaps them</p>
                </div>
            `
        },

        specialAbilities: {
            title: 'System Phase Abilities',
            content: `
                <div class="subsection">
                    <h4>Using System Phase Abilities</h4>
                    <p>Some ships and upgrades have abilities that specifically say they can be used "During the System Phase."</p>
                </div>
                <div class="info-box">
                    <h4>Examples Include:</h4>
                    <ul class="bullet-list">
                        <li><strong>Decloaking</strong> - Ships with cloak tokens can decloak</li>
                        <li><strong>Jam actions</strong> - Some ships can jam during System Phase</li>
                        <li><strong>Coordinate actions</strong> - Certain abilities grant this</li>
                        <li><strong>Special pilot abilities</strong> - Check your pilot cards</li>
                    </ul>
                </div>
                <div class="info-box tip">
                    <strong>Remember:</strong> System Phase abilities activate in initiative order, starting with the lowest initiative ship.
                </div>
            `
        },

        skipSystem: {
            title: 'Skip System Phase',
            content: `
                <div class="subsection">
                    <h4>When to Skip</h4>
                    <p>If <strong>no ships on the board</strong> have abilities that trigger during the System Phase, you can skip this phase entirely and proceed directly to Activation Phase.</p>
                </div>
                <div class="info-box tip">
                    <p>This is common in games where players aren't using:</p>
                    <ul class="bullet-list">
                        <li>Bombs or mines</li>
                        <li>Cloaking devices</li>
                        <li>Special System Phase pilot abilities</li>
                    </ul>
                </div>
                <div class="subsection">
                    <h4>Quick Check</h4>
                    <p>Ask: "Does anyone have a System Phase ability to resolve?" If everyone says no, move to Activation Phase.</p>
                </div>
            `
        },

        activationSteps: {
            title: 'Ship Activation Steps',
            content: `
                <div class="subsection">
                    <p>Ships activate in <strong>initiative order (lowest to highest)</strong>. When a ship activates, follow these steps:</p>
                </div>
                <ul class="step-list">
                    <li>
                        <strong>Reveal Dial</strong>
                        Flip the ship's assigned dial faceup and place it next to the ship card so everyone can see the chosen maneuver.
                    </li>
                    <li>
                        <strong>Execute Maneuver</strong>
                        Use the matching template to move the ship. Place template at front guides, move ship to other end, check difficulty.
                    </li>
                    <li>
                        <strong>Check Difficulty</strong>
                        Blue: Remove 1 stress | White: No effect | Red: Gain 1 stress
                    </li>
                    <li>
                        <strong>Perform Action</strong>
                        If not stressed, ship may perform ONE action from its action bar. Stressed ships skip this step.
                    </li>
                </ul>
                <div class="info-box warning">
                    <strong>⚠️ Important:</strong> Complete ALL steps for one ship before moving to the next ship!
                </div>
            `
        },

        executeManeuver: {
            title: 'Executing a Maneuver',
            content: `
                <div class="subsection">
                    <h4>How to Move Your Ship</h4>
                </div>
                <ul class="step-list">
                    <li>
                        <strong>Take Matching Template</strong>
                        Find the template that matches the speed and bearing (shape) of your revealed maneuver.
                    </li>
                    <li>
                        <strong>Place Template</strong>
                        Slide the template between the ship's front guides so it's flush against the base.
                    </li>
                    <li>
                        <strong>Move Ship</strong>
                        Pick up the ship and place it at the opposite end of the template. Slide the ship's rear guides into the template.
                    </li>
                    <li>
                        <strong>Return Template</strong>
                        Remove the template from the play area.
                    </li>
                </ul>
                <div class="info-box">
                    <h4>After Moving:</h4>
                    <p>Check the difficulty color of the maneuver:</p>
                    <ul class="bullet-list">
                        <li><span class="badge blue">BLUE</span> Remove 1 stress token</li>
                        <li><span class="badge">WHITE</span> No effect</li>
                        <li><span class="badge red">RED</span> Gain 1 stress token</li>
                    </ul>
                </div>
            `
        },

        performActions: {
            title: 'Performing Actions',
            content: `
                <div class="subsection">
                    <h4>Action Rules</h4>
                    <p>After executing a maneuver (if not stressed), a ship may perform ONE action from its action bar.</p>
                </div>
                <div class="info-box warning">
                    <strong>⚠️ Stressed ships cannot perform actions!</strong> They must skip this step.
                </div>
                <div class="subsection">
                    <h4>Common Actions:</h4>
                </div>
                <div class="info-box">
                    <h4>🎯 Focus</h4>
                    <p>Gain a focus token. When attacking or defending, spend it to change all your focus results to hits or evades.</p>
                </div>
                <div class="info-box">
                    <h4>🛡️ Evade</h4>
                    <p>Gain an evade token. When defending, spend it to change 1 blank or focus result to an evade.</p>
                </div>
                <div class="info-box">
                    <h4>🎯 Target Lock</h4>
                    <p>Choose an enemy ship at range 0-3. Assign a lock token to it. When attacking that ship, spend the lock to reroll any number of attack dice.</p>
                </div>
                <div class="info-box">
                    <h4>↔️ Barrel Roll</h4>
                    <p>Reposition your ship sideways using the [1 straight] template. Ship can move left or right, and slightly forward, backward, or straight across.</p>
                </div>
                <div class="info-box">
                    <h4>⚡ Boost</h4>
                    <p>Move your ship forward using a [1 straight], [1 left bank], or [1 right bank] template. Great for closing distance or getting into position.</p>
                </div>
                <div class="info-box">
                    <h4>🔢 Calculate</h4>
                    <p>Gain a calculate token. When attacking or defending, spend it to change 1 focus result to a hit or evade.</p>
                </div>
                <div class="info-box tip">
                    <strong>Red Actions:</strong> Some actions are red (shown in red on the action bar). After performing a red action, gain 1 stress token.
                </div>
            `
        },

        overlapping: {
            title: 'Overlapping Ships',
            content: `
                <div class="subsection">
                    <h4>What Happens When Ships Collide</h4>
                    <p>Sometimes a ship's maneuver would cause it to overlap (be on top of) another ship. When this happens:</p>
                </div>
                <ul class="step-list">
                    <li>
                        <strong>Back Up</strong>
                        Move the ship backward along the template until it's no longer overlapping any other ship's base. Keep the middle line of the template aligned with the hashmarks on the ship.
                    </li>
                    <li>
                        <strong>Place Ship</strong>
                        Once no longer overlapping, place the ship so it's touching the last ship it backed over. This is called a "partial execution."
                    </li>
                    <li>
                        <strong>Check Difficulty</strong>
                        Still check the maneuver difficulty (gain/remove stress) as normal.
                    </li>
                    <li>
                        <strong>Resolve Overlap Effect</strong>
                        See below based on whether you overlapped friend or foe.
                    </li>
                </ul>
                <div class="info-box warning">
                    <h4>If You Overlapped a Friendly Ship:</h4>
                    <ul class="bullet-list">
                        <li>Roll 1 attack die</li>
                        <li>On a Hit or Crit result, suffer 1 damage</li>
                        <li>Skip your Perform Action step</li>
                    </ul>
                </div>
                <div class="info-box">
                    <h4>If You Overlapped an Enemy Ship:</h4>
                    <ul class="bullet-list">
                        <li>If not stressed, you MAY perform a Focus or Calculate action (treat as red - gain stress)</li>
                        <li>Skip your Perform Action step (you already acted or chose not to)</li>
                    </ul>
                </div>
                <div class="info-box tip">
                    <strong>Strategy:</strong> Blocking enemy ships is a powerful tactic! By moving into their path, you can deny them their action for the turn.
                </div>
            `
        },

        advancedManeuvers: {
            title: 'Advanced Maneuvers',
            content: `
                <div class="subsection">
                    <h4>Special Maneuvers Beyond Basic Movement</h4>
                </div>
                <div class="info-box" style="border-left: 4px solid #4da6ff;">
                    <h4 style="color: #4da6ff;">Koiogran Turn (K-Turn)</h4>
                    <p><strong>What it does:</strong> Move straight forward and rotate 180°</p>
                    <p><strong>How to execute:</strong> Execute like a straight maneuver, but slide the ship's FRONT guides into the template end instead of rear guides. Ship ends facing opposite direction.</p>
                    <p><strong>Note:</strong> If ship can't fully execute, it doesn't rotate.</p>
                </div>
                <div class="info-box" style="border-left: 4px solid #44ff44;">
                    <h4 style="color: #44ff44;">Tallon Roll</h4>
                    <p><strong>What it does:</strong> Tight curve with additional 90° rotation in same direction</p>
                    <p><strong>How to execute:</strong> Execute like a turn or bank, then rotate the ship an additional 90° in the same direction. Align hashmark to left, middle, or right of template end.</p>
                    <p><strong>Note:</strong> If ship can't fully execute, it doesn't rotate.</p>
                </div>
                <div class="info-box" style="border-left: 4px solid #ff44ff;">
                    <h4 style="color: #ff44ff;">Segnor's Loop</h4>
                    <p><strong>What it does:</strong> Shallow curve then turn around (180°)</p>
                    <p><strong>How to execute:</strong> Uses the same template as bank maneuvers. Ship ends facing opposite direction after completing the curve.</p>
                    <p><strong>Note:</strong> If ship can't fully execute, it doesn't turn around.</p>
                </div>
                <div class="info-box" style="border-left: 4px solid #ffd700;">
                    <h4 style="color: #ffd700;">Stationary Maneuver</h4>
                    <p><strong>What it does:</strong> Ship doesn't move</p>
                    <p><strong>How to execute:</strong> No template used. Ship stays in place but still counts as having executed a maneuver. Check difficulty normally.</p>
                </div>
                <div class="info-box" style="border-left: 4px solid #ff4444;">
                    <h4 style="color: #ff4444;">Reverse Maneuvers</h4>
                    <p><strong>What it does:</strong> Move ship backward</p>
                    <p><strong>How to execute:</strong> Place template at ship's REAR guides instead of front. Then slide ship's FRONT guides into the template end.</p>
                    <p><strong>Includes:</strong> Reverse straight and reverse bank maneuvers.</p>
                </div>
            `
        },

        engagementOrder: {
            title: 'Engagement Order',
            content: `
                <div class="subsection">
                    <h4>Who Shoots First?</h4>
                    <p>During the Engagement Phase, ships engage in <strong>initiative order (highest to lowest)</strong>.</p>
                    <p>This is the OPPOSITE of Activation Phase!</p>
                </div>
                <div class="info-box">
                    <h4>Why It Matters</h4>
                    <p>Higher initiative pilots get to shoot first. This is huge! They can destroy enemy ships before those ships get a chance to fire back.</p>
                </div>
                <div class="subsection">
                    <h4>Engagement Order Example</h4>
                    <p>If you have ships with initiative 2, 4, and 5, they engage in this order:</p>
                    <ol style="margin-left: 20px; margin-top: 10px;">
                        <li>Initiative 5 ship engages (attacks)</li>
                        <li>Initiative 4 ship engages (attacks)</li>
                        <li>Initiative 2 ship engages (attacks)</li>
                    </ol>
                </div>
                <div class="info-box tip">
                    <strong>Tied Initiative:</strong> If both players have ships with the same initiative, the first player's ships engage first.
                </div>
                <div class="info-box warning">
                    <h4>Simultaneous Fire Rule</h4>
                    <p>If a ship is destroyed during the Engagement Phase, it's removed AFTER all ships with the same initiative have engaged. This means a destroyed ship might still get to shoot!</p>
                </div>
            `
        },

        attackSteps: {
            title: 'Performing an Attack',
            content: `
                <div class="subsection">
                    <h4>Complete Attack Sequence</h4>
                </div>
                <ul class="step-list">
                    <li>
                        <strong>1. DECLARE TARGET</strong>
                        Choose an enemy ship in your firing arc at range 0-3. Measure range to the closest point of the target that's in your arc.
                    </li>
                    <li>
                        <strong>2. ROLL ATTACK DICE</strong>
                        Roll red dice equal to your ship's attack value. <strong>Range 1 bonus:</strong> +1 die. Defender modifies dice first, then attacker.
                    </li>
                    <li>
                        <strong>3. ROLL DEFENSE DICE</strong>
                        Defender rolls green dice equal to their agility. <strong>Range 3 bonus:</strong> +1 die. <strong>Obstructed:</strong> +1 die. Attacker modifies first, then defender.
                    </li>
                    <li>
                        <strong>4. NEUTRALIZE RESULTS</strong>
                        Each Evade cancels 1 Hit (cancel all Hits first), then Evades cancel Crits. Attack HITS if any Hit or Crit results remain.
                    </li>
                    <li>
                        <strong>5. DEAL DAMAGE</strong>
                        Defender loses shields first, then takes damage cards. Hit = facedown card. Crit = faceup card (resolve effect). Ship destroyed when damage cards equal or exceed hull value.
                    </li>
                </ul>
                <div class="info-box">
                    <h4>Attack Dice Results:</h4>
                    <p><strong>⚫ Hit:</strong> 1 damage | <strong>⚡ Crit:</strong> 1 critical damage | <strong>🎯 Focus:</strong> Can be spent | <strong>Blank:</strong> No effect</p>
                </div>
                <div class="info-box">
                    <h4>Defense Dice Results:</h4>
                    <p><strong>🛡️ Evade:</strong> Cancel 1 hit | <strong>🎯 Focus:</strong> Can be spent | <strong>Blank:</strong> No effect</p>
                </div>
            `
        },

        rangeRules: {
            title: 'Range & Arc Rules',
            content: `
                <div class="subsection">
                    <h4>Targeting Requirements</h4>
                    <p>To attack an enemy ship, TWO conditions must be met:</p>
                    <ol style="margin-left: 20px; margin-top: 10px;">
                        <li>Target must be in your firing arc (usually front 90° arc)</li>
                        <li>Target must be at range 0-3</li>
                    </ol>
                </div>
                <div class="info-box">
                    <h4>Measuring Range</h4>
                    <p>Place the range ruler so one end touches the closest point of your ship's base (in the firing arc), aiming toward the closest point of the target's base. The range is determined by which band the target falls in.</p>
                </div>
                <div class="subsection">
                    <h4>Range Bonuses</h4>
                    <ul class="bullet-list">
                        <li><strong>Range 0:</strong> Ships are touching. Special rules apply (see below).</li>
                        <li><strong>Range 1:</strong> Attacker rolls +1 attack die</li>
                        <li><strong>Range 2:</strong> No bonuses</li>
                        <li><strong>Range 3:</strong> Defender rolls +1 defense die</li>
                    </ul>
                </div>
                <div class="info-box warning">
                    <h4>Special Range 0 Rules</h4>
                    <p><strong>When attacking at range 0 with primary weapon:</strong></p>
                    <ul class="bullet-list">
                        <li>Cannot add bonus dice</li>
                        <li>Attacker cannot modify their dice (defender can still modify)</li>
                    </ul>
                    <p><strong>When defending at range 0:</strong></p>
                    <ul class="bullet-list">
                        <li>Enemy cannot reduce, cancel, or modify your defense dice</li>
                    </ul>
                </div>
                <div class="info-box tip">
                    <strong>Obstruction:</strong> If your attack line passes through an obstacle (asteroid, debris, gas cloud), the defender gets +1 defense die.
                </div>
            `
        },

        damageRules: {
            title: 'Dealing Damage',
            content: `
                <div class="subsection">
                    <h4>How Ships Take Damage</h4>
                </div>
                <ul class="step-list">
                    <li>
                        <strong>Lose Shields First</strong>
                        For each damage, flip 1 shield token to its inactive (red) side. Shields absorb both regular and critical damage.
                    </li>
                    <li>
                        <strong>Take Damage Cards</strong>
                        Once shields are gone, draw damage cards from the damage deck for each remaining damage.
                    </li>
                    <li>
                        <strong>Regular Damage (Hit ⚫)</strong>
                        Deal damage card FACEDOWN. It counts toward ship destruction but has no other effect.
                    </li>
                    <li>
                        <strong>Critical Damage (Crit ⚡)</strong>
                        Deal damage card FACEUP and resolve its text immediately. Crits have ongoing negative effects!
                    </li>
                </ul>
                <div class="info-box warning">
                    <h4>Ship Destruction</h4>
                    <p>A ship is <strong>DESTROYED</strong> when the total number of damage cards (faceup + facedown) equals or exceeds its hull value.</p>
                    <p><strong>Example:</strong> Ship with 3 hull has 3 damage cards = destroyed</p>
                </div>
                <div class="subsection">
                    <h4>Damage Order</h4>
                    <p>All regular damage (Hits) is suffered before critical damage (Crits).</p>
                    <p><strong>Example:</strong> You suffer 2 Hits and 1 Crit. First deal 2 facedown cards, then 1 faceup card.</p>
                </div>
                <div class="info-box">
                    <h4>Repairing Damage</h4>
                    <p>Some abilities let you repair damage cards:</p>
                    <ul class="bullet-list">
                        <li><strong>Repair faceup card:</strong> Flip it facedown</li>
                        <li><strong>Repair facedown card:</strong> Discard it completely</li>
                    </ul>
                </div>
            `
        },

        endPhaseCleanup: {
            title: 'End Phase Cleanup',
            content: `
                <div class="subsection">
                    <h4>Remove All Circular Tokens</h4>
                    <p>At the end of each round, remove these tokens from ALL ships:</p>
                </div>
                <div class="info-box">
                    <h4>Green Tokens (Positive, Circular)</h4>
                    <ul class="bullet-list">
                        <li>Focus tokens</li>
                        <li>Evade tokens</li>
                        <li>Calculate tokens</li>
                        <li>Cloak tokens (if any)</li>
                    </ul>
                </div>
                <div class="info-box">
                    <h4>Orange Tokens (Negative, Circular)</h4>
                    <ul class="bullet-list">
                        <li>Disarm tokens</li>
                    </ul>
                </div>
                <div class="info-box warning">
                    <h4>DO NOT Remove These:</h4>
                    <ul class="bullet-list">
                        <li><strong>Stress tokens</strong> (red, square - removed by blue maneuvers)</li>
                        <li><strong>Ion tokens</strong> (red, square - removed after ion maneuver)</li>
                        <li><strong>Strain tokens</strong> (red, square - removed by blue maneuvers or special abilities)</li>
                        <li><strong>Lock tokens</strong> (assigned to other ships)</li>
                    </ul>
                </div>
                <div class="info-box tip">
                    <strong>Easy Memory Aid:</strong> If it's circular (round token), it gets removed at End Phase. If it's square, it stays until specifically removed.
                </div>
            `
        },

        chargeRecovery: {
            title: 'Charge Recovery',
            content: `
                <div class="subsection">
                    <h4>Recovering Charges</h4>
                    <p>Many upgrade cards use charges to limit how often they can be used. During the End Phase, some charges recover.</p>
                </div>
                <div class="info-box">
                    <h4>Which Charges Recover?</h4>
                    <p>Look for the <strong>recovery arrow (↻)</strong> symbol next to the charge limit on the card.</p>
                    <p>If a card has this symbol, it recovers 1 charge during the End Phase.</p>
                </div>
                <ul class="step-list">
                    <li>
                        <strong>Find Cards with ↻ Symbol</strong>
                        Check all your ship and upgrade cards for the recovery arrow.
                    </li>
                    <li>
                        <strong>Flip 1 Charge to Active</strong>
                        Take 1 inactive (spent) charge and flip it to its active (charged) side.
                    </li>
                    <li>
                        <strong>Maximum = Charge Limit</strong>
                        You cannot exceed the charge limit shown on the card.
                    </li>
                </ul>
                <div class="subsection">
                    <h4>Force Charges</h4>
                    <p>Force charges (purple) work the same way. If a pilot has Force capacity and a recovery arrow, they recover 1 Force charge at End Phase.</p>
                </div>
                <div class="info-box tip">
                    <strong>Example:</strong> Proton Torpedoes have 2 charges with ↻. You spent 1 charge this round. At End Phase, recover it - you're back to 2 charges.
                </div>
            `
        },

        victoryCheck: {
            title: 'Victory Conditions',
            content: `
                <div class="subsection">
                    <h4>When Does the Game End?</h4>
                    <p>Check these conditions at the end of the End Phase:</p>
                </div>
                <ul class="step-list">
                    <li>
                        <strong>All Enemy Ships Destroyed</strong>
                        If only one player has ships remaining in the play area, that player wins immediately.
                    </li>
                    <li>
                        <strong>20+ Mission Points</strong>
                        If a player has 20 or more mission points AND has more mission points than their opponent, the game ends and that player wins.
                    </li>
                    <li>
                        <strong>Round 12 Complete</strong>
                        After the 12th round ends, the game ends. The player with the most mission points wins.
                    </li>
                </ul>
                <div class="info-box">
                    <h4>How to Earn Mission Points</h4>
                    <ul class="bullet-list">
                        <li><strong>Opponent's deficit:</strong> Earned at game start if opponent's squad costs less than 20 points</li>
                        <li><strong>Destroying ships:</strong> Earn points equal to destroyed ship's squad point value</li>
                        <li><strong>Scenario objectives:</strong> Varies by scenario - controlling satellites, towing caches, etc.</li>
                    </ul>
                </div>
                <div class="info-box tip">
                    <strong>Strategy:</strong> You don't have to destroy all enemy ships to win! Focusing on scenario objectives while staying alive can be just as effective.
                </div>
            `
        },

        scenarioScoring: {
            title: 'Scenario Scoring',
            content: `
                <div class="subsection">
                    <h4>Earning Mission Points from Objectives</h4>
                    <p>Each scenario has specific ways to earn mission points. Scoring usually happens during the End Phase, starting from Round 2.</p>
                </div>
                <div id="scenarioScoringContent">
                    <!-- This will be populated dynamically based on selected scenario -->
                </div>
                <div class="info-box tip">
                    <strong>Remember:</strong> You earn mission points from BOTH destroying enemy ships AND completing scenario objectives!
                </div>
            `
        }
    },

    quickReference: {
        title: 'Quick Reference Guide',
        content: `
            <div class="subsection">
                <h4>Initiative Order</h4>
                <ul class="bullet-list">
                    <li><strong>Planning:</strong> Set dials, roll for first player</li>
                    <li><strong>System:</strong> Lowest → Highest</li>
                    <li><strong>Activation:</strong> Lowest → Highest</li>
                    <li><strong>Engagement:</strong> Highest → Lowest</li>
                </ul>
            </div>

            <div class="subsection">
                <h4>Combat Bonuses</h4>
                <ul class="bullet-list">
                    <li><strong>Range 1 Attack:</strong> +1 attack die</li>
                    <li><strong>Range 3 Defense:</strong> +1 defense die</li>
                    <li><strong>Obstructed:</strong> +1 defense die</li>
                    <li><strong>At range 0 of obstacle:</strong> Cannot attack</li>
                </ul>
            </div>

            <div class="subsection">
                <h4>Token Effects</h4>
                <ul class="bullet-list">
                    <li><strong>Focus:</strong> Change all focus to hits/evades</li>
                    <li><strong>Evade:</strong> Change 1 blank/focus to evade</li>
                    <li><strong>Calculate:</strong> Change 1 focus to hit/evade</li>
                    <li><strong>Lock:</strong> Reroll any attack dice vs locked ship</li>
                    <li><strong>Stress:</strong> Cannot do actions or red maneuvers</li>
                </ul>
            </div>

            <div class="subsection">
                <h4>Obstacles</h4>
                <ul class="bullet-list">
                    <li><strong>Asteroid:</strong> 1 dmg + roll die (hit/crit = +1 dmg)</li>
                    <li><strong>Debris:</strong> 1 stress + roll die (dmg on hit/crit)</li>
                    <li><strong>Gas Cloud:</strong> Break locks, 1 strain, roll for ion</li>
                    <li>Cannot attack while at range 0 of asteroid/debris/gas</li>
                </ul>
            </div>

            <div class="subsection">
                <h4>Special Tokens</h4>
                <ul class="bullet-list">
                    <li><strong>Ion:</strong> 1+ for small, 2+ medium, 3+ large = ionized</li>
                    <li><strong>Ionized ship:</strong> Executes ion maneuver, only Focus action</li>
                    <li><strong>Disarm:</strong> Cannot perform attacks</li>
                    <li><strong>Strain:</strong> -1 defense die when defending</li>
                </ul>
            </div>

            <div class="subsection">
                <h4>Force Charges</h4>
                <ul class="bullet-list">
                    <li>Spend to change focus to hit (attack) or evade (defense)</li>
                    <li>Can spend multiple per roll</li>
                    <li>Recover during End Phase (if card has ↻)</li>
                    <li>Force capacity shown in purple on card</li>
                </ul>
            </div>

            <div class="subsection">
                <h4>Common Mistakes</h4>
                <ul class="bullet-list">
                    <li><strong>Stressed ships cannot:</strong> Execute red maneuvers OR perform actions</li>
                    <li><strong>Range bonuses:</strong> Only apply to primary weapon attacks (unless special weapon shows range bonus icon)</li>
                    <li><strong>Overlapping obstacles:</strong> Ship does NOT back up - just suffers obstacle effect</li>
                    <li><strong>Each ship attacks only once per round</strong> (unless special ability grants bonus attack)</li>
                    <li><strong>Circular tokens removed at End Phase:</strong> Focus, Evade, Calculate, Disarm</li>
                </ul>
            </div>
        `
    }
};
