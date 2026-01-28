import React, { useState } from 'react';
import { Users, Sword, Move, ArrowRight, Skull, TrendingUp, Moon, BookOpen, ChevronDown, ChevronUp, Home } from 'lucide-react';

const MD2GameHelper = () => {
  const [playerCount, setPlayerCount] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [currentPhase, setCurrentPhase] = useState('hero');
  const [expandedSection, setExpandedSection] = useState(null);
  const [roundNumber, setRoundNumber] = useState(1);

  const phases = [
    { id: 'hero', name: 'Hero Phase', icon: Sword },
    { id: 'enemy', name: 'Enemy Phase', icon: Skull },
    { id: 'levelup', name: 'Level Up Phase', icon: TrendingUp },
    { id: 'darkness', name: 'Darkness Phase', icon: Moon }
  ];

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

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Massive Darkness 2</h1>
            <p className="text-purple-300 text-lg">Game Helper</p>
          </div>
          
          <div className="bg-gray-800 rounded-lg shadow-2xl p-8 border border-purple-500">
            <div className="flex items-center justify-center mb-6">
              <Users className="text-purple-400 mr-3" size={32} />
              <h2 className="text-2xl font-semibold text-white">How many players?</h2>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map(count => (
                <button
                  key={count}
                  onClick={() => startGame(count)}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-6 px-4 rounded-lg text-2xl transition-all transform hover:scale-105 shadow-lg"
                >
                  {count}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const CollapsibleSection = ({ title, children, sectionId }) => (
    <div className="bg-gray-700 rounded-lg mb-3 overflow-hidden border border-purple-500">
      <button
        onClick={() => toggleSection(sectionId)}
        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-600 transition-colors"
      >
        <span className="font-semibold text-purple-200">{title}</span>
        {expandedSection === sectionId ? <ChevronUp size={20} className="text-purple-400" /> : <ChevronDown size={20} className="text-purple-400" />}
      </button>
      {expandedSection === sectionId && (
        <div className="px-4 py-3 bg-gray-800 text-gray-200 border-t border-gray-600">
          {children}
        </div>
      )}
    </div>
  );

  const renderPhaseContent = () => {
    switch(currentPhase) {
      case 'hero':
        return (
          <div className="space-y-4">
            <div className="bg-purple-900 bg-opacity-50 rounded-lg p-4 border border-purple-400">
              <h3 className="text-xl font-semibold text-purple-200 mb-3">Heroes Take Actions</h3>
              <p className="text-gray-300 mb-3">Players decide the order. Each hero gets 3 actions:</p>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2">•</span>
                  <span><strong>Movement:</strong> Gain 2 movement points (move zones, open doors, interact)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2">•</span>
                  <span><strong>Combat:</strong> Attack an enemy with your weapon</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2">•</span>
                  <span><strong>Trade & Equip:</strong> All heroes in zone can trade/equip items</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2">•</span>
                  <span><strong>Special Action:</strong> Use skill/item abilities marked [Action]</span>
                </li>
              </ul>
            </div>

            <CollapsibleSection title="Opening a Door" sectionId="door">
              <div className="space-y-3">
                <p><strong>When a hero spends 1 MP to open a door to a new chamber:</strong></p>
                <ol className="list-decimal list-inside space-y-2 ml-2">
                  <li><strong>Draw a Door Card</strong> and resolve any event</li>
                  <li><strong>Spawn Monsters:</strong> Draw from the Mob deck matching the Dungeon Level. Place 1 leader + {playerCount} minion{playerCount > 1 ? 's' : ''}. If that mob type is already in play, activate that mob immediately instead!</li>
                  <li><strong>Draw Monster Item:</strong> Draw 1 card from Monster Item deck (matching Dungeon Level) and place under the Mob card</li>
                  <li><strong>Draw Treasure:</strong> Check the Mob card for treasure tokens, draw that many and place on the card</li>
                  <li><strong>Place Treasure:</strong> For each treasure spawn icon in the chamber, draw 1 token from bag and place in that zone</li>
                </ol>
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="Combat Quick Reference" sectionId="combat">
              <div className="space-y-3">
                <p><strong>Attack Steps:</strong></p>
                <ol className="list-decimal list-inside space-y-2 ml-2">
                  <li>Gather attacker's weapon dice + shadow die (if in shadow zone)</li>
                  <li>Add defender's defense dice + monster dice (1 per minion if mob)</li>
                  <li>Roll all dice together</li>
                  <li>Reroll and add bonus dice as desired</li>
                  <li>Resolve: Gain mana (⚡), trigger monster abilities (💀), take retaliation damage (☠️), deal wounds (⚔️ minus 🛡️), trigger shadow ability (👁️)</li>
                </ol>
                <div className="mt-3 p-3 bg-gray-900 rounded">
                  <p className="text-yellow-300"><strong>Remember:</strong> Minions protect the leader! Kill all minions before the leader can take wounds.</p>
                </div>
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="Shadow Mode" sectionId="shadow">
              <p className="mb-2">Heroes in dark zones (Shadow Zones) are in Shadow Mode.</p>
              <ul className="space-y-1">
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2">✓</span>
                  <span>Add the purple shadow die when attacking</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2">✓</span>
                  <span>Can trigger your shadow ability when shadow die shows 👁️</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2">✓</span>
                  <span>Some skills only work in Shadow Mode</span>
                </li>
              </ul>
            </CollapsibleSection>

            <CollapsibleSection title="Interacting with Zones" sectionId="interact">
              <p className="mb-2">Spend 1 MP to interact with everything in your zone:</p>
              <ul className="space-y-2">
                <li><strong>Treasure tokens:</strong> Pick up, draw matching cards, may equip immediately</li>
                <li><strong>Normal Chest (📦):</strong> Draw 2 tokens, choose 1, keep that card, return both tokens</li>
                <li><strong>Special Chest (✨):</strong> Draw 3 tokens, choose 2, keep those cards, return all 3 tokens</li>
                <li><strong>Fountain:</strong> Special action available: Heal 4 health</li>
                <li><strong>Forge:</strong> Discard any 3 items, draw 1 item card one rarity higher than lowest discarded</li>
              </ul>
              <p className="mt-2 text-yellow-300">After using a chest, place a Disabled token on it.</p>
            </CollapsibleSection>

            <CollapsibleSection title="Special Zones & Traps" sectionId="traps">
              <ul className="space-y-2">
                <li><strong>Spike Trap (⚠️):</strong> When entering, roll 1 orange die, take 1 wound per ⚔️ rolled</li>
                <li><strong>Bear Trap (🪤):</strong> When entering, roll 1 orange die, lose 1 action if ⚔️ rolled</li>
                <li><strong>Pillar:</strong> Blocks line of sight for ranged/magic attacks</li>
                <li><strong>Abyss:</strong> Cannot enter these zones</li>
              </ul>
            </CollapsibleSection>
          </div>
        );

      case 'enemy':
        return (
          <div className="space-y-4">
            <div className="bg-red-900 bg-opacity-50 rounded-lg p-4 border border-red-400">
              <h3 className="text-xl font-semibold text-red-200 mb-3">Monsters Activate</h3>
              <p className="text-gray-300 mb-3">Players choose the order. Each mob and roaming monster activates separately.</p>
            </div>

            <CollapsibleSection title="Mob Activation" sectionId="mobactivate">
              <div className="space-y-3">
                <p><strong>Each mob performs 2 actions:</strong></p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">1.</span>
                    <span>If can attack a hero (within weapon range & line of sight): ATTACK</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">2.</span>
                    <span>Otherwise: MOVE 1 zone toward hero with most XP</span>
                  </li>
                </ul>
                
                <div className="mt-4 p-3 bg-gray-900 rounded">
                  <p className="font-semibold mb-2">Mob Attack Steps:</p>
                  <ol className="list-decimal list-inside space-y-1 text-sm ml-2">
                    <li>Gather weapon dice + 1 monster die per minion</li>
                    <li>Add hero's defense dice</li>
                    <li>Roll all dice</li>
                    <li>Trigger monster ability if enough 💀 rolled</li>
                    <li>Hero takes wounds: ⚔️ minus 🛡️, plus ☠️ (unblockable)</li>
                  </ol>
                </div>

                <div className="mt-3 p-3 bg-yellow-900 bg-opacity-30 rounded border border-yellow-600">
                  <p className="text-yellow-200"><strong>Target Priority:</strong> Attack hero with highest level. If tied, hero with most unspent XP. If still tied, players choose.</p>
                </div>
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="Roaming Monster Activation" sectionId="roamingactivate">
              <div className="space-y-2">
                <p>Roaming monsters follow special instructions on their cards:</p>
                <ol className="list-decimal list-inside space-y-2 ml-2">
                  <li>Check first condition - if met, do first effect and end activation</li>
                  <li>Check second condition - if met, do second effect and end activation</li>
                  <li>If neither met, activate like a normal mob (2 actions)</li>
                </ol>
                <p className="mt-3 text-gray-400 italic">Roaming monsters use the dice shown on their card, not monster item cards.</p>
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="Hero Knocked Out" sectionId="knockout">
              <div className="space-y-2">
                <p className="text-red-300"><strong>When a hero reaches 0 health:</strong></p>
                <ul className="space-y-1">
                  <li>Tip miniature on its side</li>
                  <li>Cannot perform actions or be targeted</li>
                  <li>At start of next round, spend 1 Lifebringer token to revive them</li>
                  <li>They return with full health and mana</li>
                </ul>
                <div className="mt-3 p-3 bg-red-900 rounded border border-red-500">
                  <p className="text-red-200"><strong>⚠️ You have {2} Lifebringer tokens total. If you need to spend one and have none left, YOU LOSE.</strong></p>
                </div>
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="Fire & Frost Tokens" sectionId="tokens">
              <ul className="space-y-2">
                <li><strong>🔥 Fire:</strong> When miniature activates, roll 1 orange die per Fire token. Takes 1 wound per ⚔️. Then remove Fire tokens.</li>
                <li><strong>❄️ Frost:</strong> When hero/mob would perform an action, remove 1 Frost token instead. (Bosses & roaming monsters immune to Frost)</li>
              </ul>
            </CollapsibleSection>
          </div>
        );

      case 'levelup':
        return (
          <div className="space-y-4">
            <div className="bg-green-900 bg-opacity-50 rounded-lg p-4 border border-green-400">
              <h3 className="text-xl font-semibold text-green-200 mb-3">Heroes May Level Up</h3>
              <p className="text-gray-300">Each hero can spend accumulated XP to increase their level.</p>
            </div>

            <div className="bg-gray-700 rounded-lg p-4">
              <h4 className="font-semibold text-green-300 mb-3">XP Requirements:</h4>
              <ul className="space-y-1 text-gray-300">
                <li>Level 1 → 2: <strong>5 XP</strong></li>
                <li>Level 2 → 3: <strong>10 XP</strong></li>
                <li>Level 3 → 4: <strong>15 XP</strong></li>
                <li>Level 4 → 5: <strong>20 XP</strong></li>
              </ul>
            </div>

            <CollapsibleSection title="When You Level Up" sectionId="levelupsteps">
              <ol className="list-decimal list-inside space-y-2 ml-2">
                <li>Spend the required XP (reduce your XP total)</li>
                <li>Move your level peg up one space</li>
                <li>Increase max health OR max mana (as shown on dashboard)</li>
                <li>Gain that many health/mana tokens immediately</li>
                <li>Add treasure tokens to bag as shown on your Level token</li>
                <li><strong>Gain a new skill card</strong> (must meet level requirement)</li>
              </ol>
              <div className="mt-3 p-3 bg-green-900 bg-opacity-30 rounded">
                <p className="text-green-200"><strong>Ranked Skills:</strong> If a skill has Roman numerals (I, II, etc.), you must have the previous rank before taking the higher rank. The new rank replaces the old.</p>
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="XP Sources" sectionId="xpsources">
              <ul className="space-y-1">
                <li>• 1 XP per enemy miniature killed</li>
                <li>• +2 XP for mob leader (all heroes get this)</li>
                <li>• +4 XP for roaming monster (all heroes get this)</li>
                <li>• Quest objectives may also award XP</li>
              </ul>
            </CollapsibleSection>
          </div>
        );

      case 'darkness':
        return (
          <div className="space-y-4">
            <div className="bg-purple-900 bg-opacity-50 rounded-lg p-4 border border-purple-400">
              <h3 className="text-xl font-semibold text-purple-200 mb-3">The Darkness Grows</h3>
              <p className="text-gray-300">Advance the Darkness Track by 1 space.</p>
            </div>

            <CollapsibleSection title="Darkness Track Effects" sectionId="darknesstrack">
              <div className="space-y-3">
                <p><strong>Check what you landed on:</strong></p>
                <ul className="space-y-3">
                  <li className="p-3 bg-gray-700 rounded">
                    <strong className="text-red-300">Mob Icon (👥):</strong> Spawn a mob at EACH portal zone
                    <ul className="mt-2 ml-4 space-y-1 text-sm">
                      <li>• Draw from Mob deck matching Dungeon Level</li>
                      <li>• Place 1 leader + {playerCount} minion{playerCount > 1 ? 's' : ''}</li>
                      <li>• Draw Monster Item card and treasure tokens</li>
                      <li>• If that mob already in play: activate it instead</li>
                    </ul>
                  </li>
                  <li className="p-3 bg-gray-700 rounded">
                    <strong className="text-orange-300">Roaming Icon (👹):</strong> Spawn a roaming monster at EACH portal zone
                    <ul className="mt-2 ml-4 space-y-1 text-sm">
                      <li>• Draw from Roaming deck matching Dungeon Level</li>
                      <li>• Health = number on card × {playerCount}</li>
                      <li>• Draw treasure tokens as shown</li>
                      <li>• If no cards left in deck: activate all that type instead</li>
                    </ul>
                  </li>
                </ul>

                <div className="mt-4 p-3 bg-purple-900 rounded border border-purple-500">
                  <p className="text-purple-200"><strong>After Round 10:</strong> Flip Darkness track to backside. Now spawns roaming monsters every 3 rounds.</p>
                </div>
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="Dungeon Level" sectionId="dungeonlevel">
              <div className="space-y-2">
                <p><strong>The Dungeon Level = the highest hero level in the party.</strong></p>
                <p className="text-gray-400">This determines which deck to draw from:</p>
                <ul className="mt-2 space-y-1">
                  <li>• Levels 1-2: Use Level 1-2 decks</li>
                  <li>• Levels 3-4: Use Level 3-4 decks</li>
                  <li>• Level 5: Use Level 5 decks</li>
                </ul>
              </div>
            </CollapsibleSection>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-gray-800 rounded-lg shadow-2xl p-4 mb-4 border border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Massive Darkness 2</h1>
              <p className="text-purple-300">Players: {playerCount} | Round: {roundNumber}</p>
            </div>
            <button
              onClick={resetGame}
              className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
            >
              <Home size={20} />
              Reset
            </button>
          </div>
        </div>

        {/* Phase Tracker */}
        <div className="bg-gray-800 rounded-lg shadow-2xl p-4 mb-4 border border-purple-500">
          <div className="flex items-center justify-between mb-4">
            {phases.map((phase, index) => {
              const Icon = phase.icon;
              const isActive = phase.id === currentPhase;
              return (
                <React.Fragment key={phase.id}>
                  <div className={`flex flex-col items-center ${isActive ? 'scale-110' : 'opacity-50'} transition-all`}>
                    <div className={`rounded-full p-3 mb-2 ${isActive ? 'bg-purple-600' : 'bg-gray-700'}`}>
                      <Icon size={24} className="text-white" />
                    </div>
                    <span className={`text-xs font-semibold ${isActive ? 'text-purple-300' : 'text-gray-400'}`}>
                      {phase.name}
                    </span>
                  </div>
                  {index < phases.length - 1 && (
                    <ArrowRight className="text-gray-600" size={20} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
          
          <button
            onClick={nextPhase}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg transition-all transform hover:scale-105 shadow-lg"
          >
            {currentPhase === 'darkness' ? `Start Round ${roundNumber + 1}` : 'Next Phase'}
          </button>
        </div>

        {/* Phase Content */}
        <div className="bg-gray-800 rounded-lg shadow-2xl p-6 border border-purple-500">
          {renderPhaseContent()}
        </div>

        {/* Quick Reference */}
        <div className="mt-4 bg-gray-800 rounded-lg shadow-2xl p-4 border border-purple-500">
          <CollapsibleSection title="📖 Quick Reference Guide" sectionId="quickref">
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold text-purple-300 mb-1">Dice Results:</h4>
                <ul className="text-sm space-y-1 ml-4">
                  <li>⚔️ Sword = 1 damage dealt</li>
                  <li>🛡️ Shield = blocks 1 damage</li>
                  <li>⚡ Lightning = restore 1 mana (attacker only)</li>
                  <li>☠️ Skull = 1 unblockable damage (monsters only)</li>
                  <li>💀 Monster icon = trigger monster ability</li>
                  <li>👁️ Shadow = trigger hero shadow ability</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-purple-300 mb-1">Attack Types:</h4>
                <ul className="text-sm space-y-1 ml-4">
                  <li><strong>Melee:</strong> Same zone only</li>
                  <li><strong>Magic:</strong> Same zone or 1 zone away (needs line of sight)</li>
                  <li><strong>Ranged:</strong> Any distance (needs line of sight, NOT same zone)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-purple-300 mb-1">Important Notes:</h4>
                <ul className="text-sm space-y-1 ml-4">
                  <li>• Minions protect leaders - kill minions first</li>
                  <li>• Heroes in enemy zones lose 1 health per enemy when leaving</li>
                  <li>• Monsters don't open doors or interact with objects</li>
                  <li>• Each skill can only be used once per action</li>
                </ul>
              </div>
            </div>
          </CollapsibleSection>
        </div>
      </div>
    </div>
  );
};

export default MD2GameHelper;