'use strict';
console.log("MM2 Game Helper Loaded");

const { useState } = React;
const { createElement: e } = React;

// SVG Icon Components
const Users = ({ size = 24, className = "" }) => 
    e('svg', { xmlns: "http://www.w3.org/2000/svg", width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className },
        e('path', { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" }),
        e('circle', { cx: "9", cy: "7", r: "4" }),
        e('path', { d: "M22 21v-2a4 4 0 0 0-3-3.87" }),
        e('path', { d: "M16 3.13a4 4 0 0 1 0 7.75" })
    );

const Sword = ({ size = 24, className = "" }) =>
    e('svg', { xmlns: "http://www.w3.org/2000/svg", width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className },
        e('polyline', { points: "14.5 17.5 3 6 3 3 6 3 17.5 14.5" }),
        e('line', { x1: "13", y1: "19", x2: "19", y2: "13" }),
        e('line', { x1: "16", y1: "16", x2: "20", y2: "20" }),
        e('line', { x1: "19", y1: "21", x2: "21", y2: "19" })
    );

const Skull = ({ size = 24, className = "" }) =>
    e('svg', { xmlns: "http://www.w3.org/2000/svg", width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className },
        e('circle', { cx: "9", cy: "12", r: "1" }),
        e('circle', { cx: "15", cy: "12", r: "1" }),
        e('path', { d: "M8 20v2h8v-2" }),
        e('path', { d: "m12.5 17-.5-1-.5 1h1z" }),
        e('path', { d: "M16 20a2 2 0 0 0 1.56-3.25 8 8 0 1 0-11.12 0A2 2 0 0 0 8 20" })
    );

const TrendingUp = ({ size = 24, className = "" }) =>
    e('svg', { xmlns: "http://www.w3.org/2000/svg", width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className },
        e('polyline', { points: "23 6 13.5 15.5 8.5 10.5 1 18" }),
        e('polyline', { points: "17 6 23 6 23 12" })
    );

const Moon = ({ size = 24, className = "" }) =>
    e('svg', { xmlns: "http://www.w3.org/2000/svg", width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className },
        e('path', { d: "M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" })
    );

const ArrowRight = ({ size = 24, className = "" }) =>
    e('svg', { xmlns: "http://www.w3.org/2000/svg", width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className },
        e('line', { x1: "5", y1: "12", x2: "19", y2: "12" }),
        e('polyline', { points: "12 5 19 12 12 19" })
    );

const ChevronDown = ({ size = 24, className = "" }) =>
    e('svg', { xmlns: "http://www.w3.org/2000/svg", width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className },
        e('polyline', { points: "6 9 12 15 18 9" })
    );

const ChevronUp = ({ size = 24, className = "" }) =>
    e('svg', { xmlns: "http://www.w3.org/2000/svg", width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className },
        e('polyline', { points: "18 15 12 9 6 15" })
    );

const Home = ({ size = 24, className = "" }) =>
    e('svg', { xmlns: "http://www.w3.org/2000/svg", width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className },
        e('path', { d: "m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" }),
        e('polyline', { points: "9 22 9 12 15 12 15 22" })
    );

// Main App Component
function MD2GameHelper() {
    const [playerCount, setPlayerCount] = useState(null);
    const [gameStarted, setGameStarted] = useState(false);
    const [currentPhase, setCurrentPhase] = useState('hero');
    const [expandedSection, setExpandedSection] = useState(null);
    const [roundNumber, setRoundNumber] = useState(1);
    const [showClassReference, setShowClassReference] = useState(false);
    const [selectedClass, setSelectedClass] = useState(null);

    const phases = [
        { id: 'hero', name: 'Hero Phase', icon: Sword },
        { id: 'enemy', name: 'Enemy Phase', icon: Skull },
        { id: 'levelup', name: 'Level Up Phase', icon: TrendingUp },
        { id: 'darkness', name: 'Darkness Phase', icon: Moon }
    ];

    const heroClasses = [
        {
            id: 'wizard',
            name: 'Wizard',
            color: 'bg-blue-600',
            description: 'Powerful spell casters who twist magic to smite enemies with fire or frost.',
            setup: [
                'Take the Spell Amulet and place it near your dashboard',
                'Place the Ready marker in center, pointing at any quadrant',
                'Each skill upgrades one quadrant of your amulet'
            ],
            gameplay: [
                'Can only cast the spell the Ready marker points to',
                'After casting, rotate Ready marker 90° clockwise',
                'Can force rotation by spending 1 mana per 90° turn',
                'Attack spells require a weapon with magic attack (like a wand)'
            ],
            tips: [
                'Plan your spell rotation strategy',
                'Save mana to force rotations when needed',
                'Upgrade all 4 quadrants for maximum flexibility'
            ]
        },
        {
            id: 'paladin',
            name: 'Paladin',
            color: 'bg-yellow-600',
            description: 'Holy warriors who boost allies with auras and blessings.',
            setup: [
                'Take Paladin dashboard and 3 Aura tokens',
                'Place Aura tokens on the 3 Aura slots',
                'Place starting skill under blue or green column',
                'Choose level 1 skill and place under blue or green column'
            ],
            gameplay: [
                'Spend 1 mana to give yourself or ally an Aura token (no action required)',
                'Heroes with Aura tokens get all benefits of that aura\'s skills',
                'Only 1 aura per hero at a time',
                'Can remove aura from any hero for free anytime',
                'Spend mana to bless a skill (flip to blessed side until next round)'
            ],
            tips: [
                'Red aura unlocks with certain skill cards',
                'Coordinate with teammates on aura placement',
                'Blessed skills are powerful but temporary'
            ]
        },
        {
            id: 'berserker',
            name: 'Berserker',
            color: 'bg-red-600',
            description: 'Fighters who grow stronger as they take damage.',
            setup: [
                'Take Berserker dashboard and Stance token',
                'Place Stance token on your starting stance',
                'Place level 1 skill card below its matching stance'
            ],
            gameplay: [
                'When you take damage, move lost health tokens to Berserk Pool',
                'Berserk Pool max starts at 7 tokens (can increase with skills)',
                'Spend tokens from pool to trigger stance abilities',
                'Change stance: spend 1 token from pool',
                'Blood Rage stance: increases attack power',
                'Reckless stance: increases mobility',
                'Provoke stance: draws enemies and increases defense'
            ],
            tips: [
                'Taking damage makes you stronger',
                'Manage your Berserk Pool strategically',
                'Switch stances based on situation'
            ]
        },
        {
            id: 'rogue',
            name: 'Rogue',
            color: 'bg-purple-600',
            description: 'Cunning combatants with a bag of tricks and tools.',
            setup: [
                'Take Thieving Tools Bag',
                'Add 10 starting Rogue tokens to the bag',
                'Keep other tokens aside (added by skills later)'
            ],
            gameplay: [
                'At start of round: draw 3 tokens from bag, place faceup',
                'Each action you take: flip 1 token to "used" side',
                'If token matches your action type: gain its benefit',
                'If token doesn\'t match: no benefit (still flip it)',
                'After flipping, token goes to discard pile',
                'When bag empties: return all discarded tokens to bag',
                'Poison tokens: placed on monsters, trigger each activation',
                'Shadow token: count as in Shadow Mode for that action'
            ],
            tips: [
                'Unpredictable but powerful',
                'Plan actions around your drawn tokens',
                'Skills add new token types to your bag'
            ]
        },
        {
            id: 'shaman',
            name: 'Shaman',
            color: 'bg-green-600',
            description: 'Nature-attuned heroes who channel elemental magic.',
            setup: [
                'Take Elements dashboard and 4 Element trackers',
                'Place each tracker on starting (bottom) slot',
                'Place level 1 skill next to dashboard'
            ],
            gameplay: [
                'When you roll mana (⚡): gain 1 mana OR increase any Element tracker by 1',
                'Skills require spending elements (move tracker down)',
                'At end of your turn: trigger effects for elements at MAX slot',
                'Flame Spirit: ally token you can summon with certain skills',
                'Ice Spirit: ally token you can summon with certain skills',
                'Spirits activate once free per turn, can spend actions for more',
                'Spirits perform Combat or Movement actions',
                'When Spirit killed: return token to you (can resummon)'
            ],
            tips: [
                'Balance building elements vs using them',
                'MAX slot effects are powerful - plan for them',
                'Spirits count as heroes for targeting purposes'
            ]
        },
        {
            id: 'ranger',
            name: 'Ranger',
            color: 'bg-orange-600',
            description: 'Expert marksmen who carefully aim each shot.',
            setup: [
                'Take 12 Ranger Arrow cards',
                'Shuffle and place facedown as Arrows deck',
                'Place level 1 skill below the deck'
            ],
            gameplay: [
                'Each Combat action: reveal Arrow cards one at a time',
                'Stop revealing when you choose OR when 4+ target symbols (🎯) are revealed',
                'Count total 🎯 symbols in all revealed cards:',
                '  • Less than 4 🎯: Quick shot - apply middle (grey) effects',
                '  • Exactly 4 🎯: BULLSEYE! - apply top (beige) effects',
                '  • More than 4 🎯: Took too long - apply bottom (red) effects',
                'After resolving, discard all revealed cards',
                'When deck empties: shuffle discards to form new deck'
            ],
            tips: [
                'Push your luck for Bullseyes',
                'Quick shots are safer but less powerful',
                'Watch the 🎯 count carefully'
            ]
        }
    ];

    const showClass = (classId) => {
        setSelectedClass(classId);
        setShowClassReference(true);
    };

    const closeClassReference = () => {
        setShowClassReference(false);
        setSelectedClass(null);
    };

    const startGame = (count) => {
        setPlayerCount(count);
        setGameStarted(true);
        setCurrentPhase('hero');
        setRoundNumber(1);
    };

    const nextPhase = () => {
        const currentIndex = phases.findIndex(p => p.id === currentPhase);
        if (currentIndex < phases.length - 1) {
            setCurrentPhase(phases[currentIndex + 1].id);
        } else {
            setCurrentPhase('hero');
            setRoundNumber(roundNumber + 1);
        }
    };

    const toggleSection = (section) => {
        setExpandedSection(expandedSection === section ? null : section);
    };

    const resetGame = () => {
        setPlayerCount(null);
        setGameStarted(false);
        setCurrentPhase('hero');
        setRoundNumber(1);
        setExpandedSection(null);
    };

    // Collapsible Section Component
    const CollapsibleSection = ({ title, children, sectionId }) => 
        e('div', { className: 'collapsible' },
            e('button', { 
                onClick: () => toggleSection(sectionId),
                className: 'btn-collapse'
            },
                e('span', { className: 'font-semibold text-purple-200' }, title),
                expandedSection === sectionId 
                    ? e(ChevronUp, { size: 20, className: 'text-purple-400' })
                    : e(ChevronDown, { size: 20, className: 'text-purple-400' })
            ),
            expandedSection === sectionId && e('div', { className: 'collapsible-content' }, children)
        );

    // Phase Content Renderers
    const renderHeroPhase = () =>
        e('div', { className: 'space-y-4' },
            e('div', { className: 'card-content' },
                e('h3', { className: 'text-xl font-semibold text-purple-200 mb-3' }, 'Heroes Take Actions'),
                e('p', { className: 'text-gray-300 mb-3' }, 'Players decide the order. Each hero gets 3 actions:'),
                e('ul', { className: 'space-y-2 text-gray-300' },
                    e('li', { className: 'flex items-start' },
                        e('span', { className: 'text-purple-400 mr-2' }, '•'),
                        e('span', null, 
                            e('strong', null, 'Movement:'), ' Gain 2 movement points (move zones, open doors, interact)'
                        )
                    ),
                    e('li', { className: 'flex items-start' },
                        e('span', { className: 'text-purple-400 mr-2' }, '•'),
                        e('span', null,
                            e('strong', null, 'Combat:'), ' Attack an enemy with your weapon'
                        )
                    ),
                    e('li', { className: 'flex items-start' },
                        e('span', { className: 'text-purple-400 mr-2' }, '•'),
                        e('span', null,
                            e('strong', null, 'Trade & Equip:'), ' All heroes in zone can trade/equip items'
                        )
                    ),
                    e('li', { className: 'flex items-start' },
                        e('span', { className: 'text-purple-400 mr-2' }, '•'),
                        e('span', null,
                            e('strong', null, 'Special Action:'), ' Use skill/item abilities marked [Action]'
                        )
                    )
                )
            ),
            e(CollapsibleSection, { title: 'Opening a Door', sectionId: 'door' },
                e('div', { className: 'space-y-3' },
                    e('p', null, e('strong', null, 'When a hero spends 1 MP to open a door to a new chamber:')),
                    e('ol', { className: 'list-decimal list-inside space-y-2 ml-2' },
                        e('li', null, e('strong', null, 'Draw a Door Card'), ' and resolve any event'),
                        e('li', null, 
                            e('strong', null, 'Spawn Monsters:'), 
                            ` Draw from the Mob deck matching the Dungeon Level. Place 1 leader + ${playerCount} minion${playerCount > 1 ? 's' : ''}. If that mob type is already in play, activate that mob immediately instead!`
                        ),
                        e('li', null, e('strong', null, 'Draw Monster Item:'), ' Draw 1 card from Monster Item deck (matching Dungeon Level) and place under the Mob card'),
                        e('li', null, e('strong', null, 'Draw Treasure:'), ' Check the Mob card for treasure tokens, draw that many and place on the card'),
                        e('li', null, e('strong', null, 'Place Treasure:'), ' For each treasure spawn icon in the chamber, draw 1 token from bag and place in that zone')
                    )
                )
            ),
            e(CollapsibleSection, { title: 'Combat Quick Reference', sectionId: 'combat' },
                e('div', { className: 'space-y-3' },
                    e('p', null, e('strong', null, 'Attack Steps:')),
                    e('ol', { className: 'list-decimal list-inside space-y-2 ml-2' },
                        e('li', null, 'Gather attacker\'s weapon dice + shadow die (if in shadow zone)'),
                        e('li', null, 'Add defender\'s defense dice + monster dice (1 per minion if mob)'),
                        e('li', null, 'Roll all dice together'),
                        e('li', null, 'Reroll and add bonus dice as desired'),
                        e('li', null, 'Resolve: Gain mana (⚡), trigger monster abilities (💀), take retaliation damage (☠️), deal wounds (⚔️ minus 🛡️), trigger shadow ability (👁️)')
                    ),
                    e('div', { className: 'info-box mt-3' },
                        e('p', { className: 'text-yellow-300' },
                            e('strong', null, 'Remember:'), ' Minions protect the leader! Kill all minions before the leader can take wounds.'
                        )
                    )
                )
            ),
            e(CollapsibleSection, { title: 'Shadow Mode', sectionId: 'shadow' },
                e('p', { className: 'mb-2' }, 'Heroes in dark zones (Shadow Zones) are in Shadow Mode.'),
                e('ul', { className: 'space-y-1' },
                    e('li', { className: 'flex items-start' },
                        e('span', { className: 'text-purple-400 mr-2' }, '✓'),
                        e('span', null, 'Add the purple shadow die when attacking')
                    ),
                    e('li', { className: 'flex items-start' },
                        e('span', { className: 'text-purple-400 mr-2' }, '✓'),
                        e('span', null, 'Can trigger your shadow ability when shadow die shows 👁️')
                    ),
                    e('li', { className: 'flex items-start' },
                        e('span', { className: 'text-purple-400 mr-2' }, '✓'),
                        e('span', null, 'Some skills only work in Shadow Mode')
                    )
                )
            ),
            e(CollapsibleSection, { title: 'Interacting with Zones', sectionId: 'interact' },
                e('p', { className: 'mb-2' }, 'Spend 1 MP to interact with everything in your zone:'),
                e('ul', { className: 'space-y-2' },
                    e('li', null, e('strong', null, 'Treasure tokens:'), ' Pick up, draw matching cards, may equip immediately'),
                    e('li', null, e('strong', null, 'Normal Chest (📦):'), ' Draw 2 tokens, choose 1, keep that card, return both tokens'),
                    e('li', null, e('strong', null, 'Special Chest (✨):'), ' Draw 3 tokens, choose 2, keep those cards, return all 3 tokens'),
                    e('li', null, e('strong', null, 'Fountain:'), ' Special action available: Heal 4 health'),
                    e('li', null, e('strong', null, 'Forge:'), ' Discard any 3 items, draw 1 item card one rarity higher than lowest discarded')
                ),
                e('p', { className: 'mt-2 text-yellow-300' }, 'After using a chest, place a Disabled token on it.')
            ),
            e(CollapsibleSection, { title: 'Special Zones & Traps', sectionId: 'traps' },
                e('ul', { className: 'space-y-2' },
                    e('li', null, e('strong', null, 'Spike Trap (⚠️):'), ' When entering, roll 1 orange die, take 1 wound per ⚔️ rolled'),
                    e('li', null, e('strong', null, 'Bear Trap (🪤):'), ' When entering, roll 1 orange die, lose 1 action if ⚔️ rolled'),
                    e('li', null, e('strong', null, 'Pillar:'), ' Blocks line of sight for ranged/magic attacks'),
                    e('li', null, e('strong', null, 'Abyss:'), ' Cannot enter these zones')
                )
            )
        );

    const renderEnemyPhase = () =>
        e('div', { className: 'space-y-4' },
            e('div', { className: 'card-red' },
                e('h3', { className: 'text-xl font-semibold text-red-200 mb-3' }, 'Monsters Activate'),
                e('p', { className: 'text-gray-300 mb-3' }, 'Players choose the order. Each mob and roaming monster activates separately.')
            ),
            e(CollapsibleSection, { title: 'Mob Activation', sectionId: 'mobactivate' },
                e('div', { className: 'space-y-3' },
                    e('p', null, e('strong', null, 'Each mob performs 2 actions:')),
                    e('ul', { className: 'space-y-2' },
                        e('li', { className: 'flex items-start' },
                            e('span', { className: 'text-red-400 mr-2' }, '1.'),
                            e('span', null, 'If can attack a hero (within weapon range & line of sight): ATTACK')
                        ),
                        e('li', { className: 'flex items-start' },
                            e('span', { className: 'text-red-400 mr-2' }, '2.'),
                            e('span', null, 'Otherwise: MOVE 1 zone toward hero with most XP')
                        )
                    ),
                    e('div', { className: 'info-box mt-4' },
                        e('p', { className: 'font-semibold mb-2' }, 'Mob Attack Steps:'),
                        e('ol', { className: 'list-decimal list-inside space-y-1 text-sm ml-2' },
                            e('li', null, 'Gather weapon dice + 1 monster die per minion'),
                            e('li', null, 'Add hero\'s defense dice'),
                            e('li', null, 'Roll all dice'),
                            e('li', null, 'Trigger monster ability if enough 💀 rolled'),
                            e('li', null, 'Hero takes wounds: ⚔️ minus 🛡️, plus ☠️ (unblockable)')
                        )
                    ),
                    e('div', { className: 'tip-box' },
                        e('p', { className: 'text-yellow-200' },
                            e('strong', null, 'Target Priority:'), ' Attack hero with highest level. If tied, hero with most unspent XP. If still tied, players choose.'
                        )
                    )
                )
            ),
            e(CollapsibleSection, { title: 'Roaming Monster Activation', sectionId: 'roamingactivate' },
                e('div', { className: 'space-y-2' },
                    e('p', null, 'Roaming monsters follow special instructions on their cards:'),
                    e('ol', { className: 'list-decimal list-inside space-y-2 ml-2' },
                        e('li', null, 'Check first condition - if met, do first effect and end activation'),
                        e('li', null, 'Check second condition - if met, do second effect and end activation'),
                        e('li', null, 'If neither met, activate like a normal mob (2 actions)')
                    ),
                    e('p', { className: 'mt-3 text-gray-400', style: { fontStyle: 'italic' } }, 'Roaming monsters use the dice shown on their card, not monster item cards.')
                )
            ),
            e(CollapsibleSection, { title: 'Hero Knocked Out', sectionId: 'knockout' },
                e('div', { className: 'space-y-2' },
                    e('p', { className: 'text-red-300' }, e('strong', null, 'When a hero reaches 0 health:')),
                    e('ul', { className: 'space-y-1' },
                        e('li', null, 'Tip miniature on its side'),
                        e('li', null, 'Cannot perform actions or be targeted'),
                        e('li', null, 'At start of next round, spend 1 Lifebringer token to revive them'),
                        e('li', null, 'They return with full health and mana')
                    ),
                    e('div', { className: 'warning-box' },
                        e('p', { className: 'text-red-200' },
                            e('strong', null, '⚠️ You have 2 Lifebringer tokens total. If you need to spend one and have none left, YOU LOSE.')
                        )
                    )
                )
            ),
            e(CollapsibleSection, { title: 'Fire & Frost Tokens', sectionId: 'tokens' },
                e('ul', { className: 'space-y-2' },
                    e('li', null, e('strong', null, '🔥 Fire:'), ' When miniature activates, roll 1 orange die per Fire token. Takes 1 wound per ⚔️. Then remove Fire tokens.'),
                    e('li', null, e('strong', null, '❄️ Frost:'), ' When hero/mob would perform an action, remove 1 Frost token instead. (Bosses & roaming monsters immune to Frost)')
                )
            )
        );

    const renderLevelUpPhase = () =>
        e('div', { className: 'space-y-4' },
            e('div', { className: 'card-green' },
                e('h3', { className: 'text-xl font-semibold text-green-200 mb-3' }, 'Heroes May Level Up'),
                e('p', { className: 'text-gray-300' }, 'Each hero can spend accumulated XP to increase their level.')
            ),
            e('div', { className: 'bg-gray-700 rounded-lg p-4' },
                e('h4', { className: 'font-semibold text-green-300 mb-3' }, 'XP Requirements:'),
                e('ul', { className: 'space-y-1 text-gray-300' },
                    e('li', null, 'Level 1 → 2: ', e('strong', null, '5 XP')),
                    e('li', null, 'Level 2 → 3: ', e('strong', null, '10 XP')),
                    e('li', null, 'Level 3 → 4: ', e('strong', null, '15 XP')),
                    e('li', null, 'Level 4 → 5: ', e('strong', null, '20 XP'))
                )
            ),
            e(CollapsibleSection, { title: 'When You Level Up', sectionId: 'levelupsteps' },
                e('ol', { className: 'list-decimal list-inside space-y-2 ml-2' },
                    e('li', null, 'Spend the required XP (reduce your XP total)'),
                    e('li', null, 'Move your level peg up one space'),
                    e('li', null, 'Increase max health OR max mana (as shown on dashboard)'),
                    e('li', null, 'Gain that many health/mana tokens immediately'),
                    e('li', null, 'Add treasure tokens to bag as shown on your Level token'),
                    e('li', null, e('strong', null, 'Gain a new skill card'), ' (must meet level requirement)')
                ),
                e('div', { className: 'success-box' },
                    e('p', { className: 'text-green-200' },
                        e('strong', null, 'Ranked Skills:'), ' If a skill has Roman numerals (I, II, etc.), you must have the previous rank before taking the higher rank. The new rank replaces the old.'
                    )
                )
            ),
            e(CollapsibleSection, { title: 'XP Sources', sectionId: 'xpsources' },
                e('ul', { className: 'space-y-1' },
                    e('li', null, '• 1 XP per enemy miniature killed'),
                    e('li', null, '• +2 XP for mob leader (all heroes get this)'),
                    e('li', null, '• +4 XP for roaming monster (all heroes get this)'),
                    e('li', null, '• Quest objectives may also award XP')
                )
            )
        );

    const renderDarknessPhase = () =>
        e('div', { className: 'space-y-4' },
            e('div', { className: 'card-content' },
                e('h3', { className: 'text-xl font-semibold text-purple-200 mb-3' }, 'The Darkness Grows'),
                e('p', { className: 'text-gray-300' }, 'Advance the Darkness Track by 1 space.')
            ),
            e(CollapsibleSection, { title: 'Darkness Track Effects', sectionId: 'darknesstrack' },
                e('div', { className: 'space-y-3' },
                    e('p', null, e('strong', null, 'Check what you landed on:')),
                    e('ul', { className: 'space-y-3' },
                        e('li', { className: 'p-3 bg-gray-700 rounded' },
                            e('strong', { className: 'text-red-300' }, 'Mob Icon (👥):'), ' Spawn a mob at EACH portal zone',
                            e('ul', { className: 'mt-2 ml-4 space-y-1 text-sm' },
                                e('li', null, '• Draw from Mob deck matching Dungeon Level'),
                                e('li', null, `• Place 1 leader + ${playerCount} minion${playerCount > 1 ? 's' : ''}`),
                                e('li', null, '• Draw Monster Item card and treasure tokens'),
                                e('li', null, '• If that mob already in play: activate it instead')
                            )
                        ),
                        e('li', { className: 'p-3 bg-gray-700 rounded' },
                            e('strong', { className: 'text-orange-300' }, 'Roaming Icon (👹):'), ' Spawn a roaming monster at EACH portal zone',
                            e('ul', { className: 'mt-2 ml-4 space-y-1 text-sm' },
                                e('li', null, '• Draw from Roaming deck matching Dungeon Level'),
                                e('li', null, `• Health = number on card × ${playerCount}`),
                                e('li', null, '• Draw treasure tokens as shown'),
                                e('li', null, '• If no cards left in deck: activate all that type instead')
                            )
                        )
                    ),
                    e('div', { className: 'mt-4 p-3 bg-purple-900 rounded border border-purple-500' },
                        e('p', { className: 'text-purple-200' },
                            e('strong', null, 'After Round 10:'), ' Flip Darkness track to backside. Now spawns roaming monsters every 3 rounds.'
                        )
                    )
                )
            ),
            e(CollapsibleSection, { title: 'Dungeon Level', sectionId: 'dungeonlevel' },
                e('div', { className: 'space-y-2' },
                    e('p', null, e('strong', null, 'The Dungeon Level = the highest hero level in the party.')),
                    e('p', { className: 'text-gray-400' }, 'This determines which deck to draw from:'),
                    e('ul', { className: 'mt-2 space-y-1' },
                        e('li', null, '• Levels 1-2: Use Level 1-2 decks'),
                        e('li', null, '• Levels 3-4: Use Level 3-4 decks'),
                        e('li', null, '• Level 5: Use Level 5 decks')
                    )
                )
            )
        );

    const renderPhaseContent = () => {
        switch(currentPhase) {
            case 'hero': return renderHeroPhase();
            case 'enemy': return renderEnemyPhase();
            case 'levelup': return renderLevelUpPhase();
            case 'darkness': return renderDarknessPhase();
            default: return null;
        }
    };

    const renderQuickReference = () =>
        e(CollapsibleSection, { title: '📖 Quick Reference Guide', sectionId: 'quickref' },
            e('div', { className: 'space-y-3' },
                e('div', null,
                    e('h4', { className: 'font-semibold text-purple-300 mb-1' }, 'Dice Results:'),
                    e('ul', { className: 'text-sm space-y-1 ml-4' },
                        e('li', null, '⚔️ Sword = 1 damage dealt'),
                        e('li', null, '🛡️ Shield = blocks 1 damage'),
                        e('li', null, '⚡ Lightning = restore 1 mana (attacker only)'),
                        e('li', null, '☠️ Skull = 1 unblockable damage (monsters only)'),
                        e('li', null, '💀 Monster icon = trigger monster ability'),
                        e('li', null, '👁️ Shadow = trigger hero shadow ability')
                    )
                ),
                e('div', null,
                    e('h4', { className: 'font-semibold text-purple-300 mb-1' }, 'Attack Types:'),
                    e('ul', { className: 'text-sm space-y-1 ml-4' },
                        e('li', null, e('strong', null, 'Melee:'), ' Same zone only'),
                        e('li', null, e('strong', null, 'Magic:'), ' Same zone or 1 zone away (needs line of sight)'),
                        e('li', null, e('strong', null, 'Ranged:'), ' Any distance (needs line of sight, NOT same zone)')
                    )
                ),
                e('div', null,
                    e('h4', { className: 'font-semibold text-purple-300 mb-1' }, 'Important Notes:'),
                    e('ul', { className: 'text-sm space-y-1 ml-4' },
                        e('li', null, '• Minions protect leaders - kill minions first'),
                        e('li', null, '• Heroes in enemy zones lose 1 health per enemy when leaving'),
                        e('li', null, '• Monsters don\'t open doors or interact with objects'),
                        e('li', null, '• Each skill can only be used once per action')
                    )
                )
            )
        );

    const renderClassReference = () => {
        if (!showClassReference || !selectedClass) return null;

        const heroClass = heroClasses.find(c => c.id === selectedClass);
        if (!heroClass) return null;

        return e('div', { 
            className: 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4',
            style: { zIndex: 1000 },
            onClick: closeClassReference
        },
            e('div', {
                className: 'card p-6 max-w-2xl w-full max-h-screen overflow-y-auto',
                onClick: (e) => e.stopPropagation()
            },
                e('div', { className: 'flex items-center justify-between mb-4' },
                    e('h2', { className: 'text-2xl font-bold text-white' }, heroClass.name),
                    e('button', {
                        onClick: closeClassReference,
                        className: 'text-white text-2xl hover:text-purple-300'
                    }, '×')
                ),
                e('p', { className: 'text-gray-300 mb-4 italic' }, heroClass.description),
                
                e('div', { className: 'space-y-4' },
                    e('div', null,
                        e('h3', { className: 'text-lg font-semibold text-purple-300 mb-2' }, '📦 Setup'),
                        e('ul', { className: 'space-y-1 text-gray-200' },
                            heroClass.setup.map((item, idx) =>
                                e('li', { key: idx, className: 'flex items-start' },
                                    e('span', { className: 'text-purple-400 mr-2' }, '•'),
                                    e('span', null, item)
                                )
                            )
                        )
                    ),
                    
                    e('div', null,
                        e('h3', { className: 'text-lg font-semibold text-green-300 mb-2' }, '🎮 Gameplay'),
                        e('ul', { className: 'space-y-1 text-gray-200' },
                            heroClass.gameplay.map((item, idx) =>
                                e('li', { key: idx, className: 'flex items-start' },
                                    e('span', { className: 'text-green-400 mr-2' }, '•'),
                                    e('span', null, item)
                                )
                            )
                        )
                    ),
                    
                    e('div', null,
                        e('h3', { className: 'text-lg font-semibold text-yellow-300 mb-2' }, '💡 Tips'),
                        e('ul', { className: 'space-y-1 text-gray-200' },
                            heroClass.tips.map((item, idx) =>
                                e('li', { key: idx, className: 'flex items-start' },
                                    e('span', { className: 'text-yellow-400 mr-2' }, '→'),
                                    e('span', null, item)
                                )
                            )
                        )
                    )
                ),
                
                e('button', {
                    onClick: closeClassReference,
                    className: 'btn-next mt-6'
                }, 'Close')
            )
        );
    };

    const renderClassButtons = () =>
        e('div', { className: 'card p-4 mb-4' },
            e('h3', { className: 'text-lg font-semibold text-white mb-3 text-center' }, '⚔️ Hero Class Reference'),
            e('div', { className: 'grid grid-cols-2 gap-3' },
                heroClasses.map(heroClass =>
                    e('button', {
                        key: heroClass.id,
                        onClick: () => showClass(heroClass.id),
                        className: `${heroClass.color} text-white font-semibold py-3 px-4 rounded-lg hover:opacity-80 transition-opacity`
                    }, heroClass.name)
                )
            )
        );

    // Player Selection Screen
    if (!gameStarted) {
        return e('div', { className: 'min-h-screen bg-gradient p-6' },
            e('div', { className: 'max-w-2xl mx-auto' },
                e('div', { className: 'text-center mb-8' },
                    e('h1', { className: 'text-4xl font-bold text-white mb-2' }, 'Massive Darkness 2'),
                    e('p', { className: 'text-purple-300 text-lg' }, 'Game Helper')
                ),
                e('div', { className: 'card p-8' },
                    e('div', { className: 'flex items-center justify-center mb-6' },
                        e(Users, { size: 32, className: 'text-purple-400 mr-3' }),
                        e('h2', { className: 'text-2xl font-semibold text-white' }, 'How many players?')
                    ),
                    e('div', { className: 'grid grid-cols-3 gap-4' },
                        [1, 2, 3, 4, 5, 6].map(count =>
                            e('button', {
                                key: count,
                                onClick: () => startGame(count),
                                className: 'btn-primary'
                            }, count)
                        )
                    )
                )
            )
        );
    }

    // Main Game Screen
    return e('div', { className: 'min-h-screen bg-gradient p-4' },
        e('div', { className: 'max-w-4xl mx-auto' },
            // Header
            e('div', { className: 'card p-4 mb-4' },
                e('div', { className: 'flex items-center justify-between' },
                    e('div', null,
                        e('h1', { className: 'text-2xl font-bold text-white' }, 'Massive Darkness 2'),
                        e('p', { className: 'text-purple-300' }, `Players: ${playerCount} | Round: ${roundNumber}`)
                    ),
                    e('button', { onClick: resetGame, className: 'btn-reset' },
                        e(Home, { size: 20 }),
                        'Reset'
                    )
                )
            ),
            // Class Reference Buttons
            renderClassButtons(),
            // Phase Tracker
            e('div', { className: 'card p-4 mb-4' },
                e('div', { className: 'flex items-center justify-between mb-4' },
                    phases.map((phase, index) => {
                        const Icon = phase.icon;
                        const isActive = phase.id === currentPhase;
                        return e(React.Fragment, { key: phase.id },
                            e('div', { className: `flex flex-col items-center ${isActive ? 'scale-110' : 'opacity-50'} transition-all` },
                                e('div', { className: `phase-icon ${isActive ? 'phase-icon-active' : 'phase-icon-inactive'}` },
                                    e(Icon, { size: 24, className: 'text-white' })
                                ),
                                e('span', { className: `text-xs font-semibold ${isActive ? 'text-purple-300' : 'text-gray-400'}` }, phase.name)
                            ),
                            index < phases.length - 1 && e(ArrowRight, { className: 'text-gray-600', size: 20 })
                        );
                    })
                ),
                e('button', { onClick: nextPhase, className: 'btn-next' },
                    currentPhase === 'darkness' ? `Start Round ${roundNumber + 1}` : 'Next Phase'
                )
            ),
            // Phase Content
            e('div', { className: 'card p-6' }, renderPhaseContent()),
            // Quick Reference
            e('div', { className: 'card p-4 mt-4' }, renderQuickReference())
        ),
        // Class Reference Modal
        renderClassReference()
    );
}

// Initialize the app
const domContainer = document.querySelector('#root');
const root = ReactDOM.createRoot(domContainer);
root.render(e(MD2GameHelper));
