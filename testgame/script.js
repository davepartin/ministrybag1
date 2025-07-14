const attacks = ['Rock', 'Paper', 'Scissors'];
const modifiers = ['+1', 'Curse', 'Reverse'];
let p1 = { attack: null, mod: null, score: 0 };
let p2 = { attack: null, mod: null, score: 0 };
let yellowPoints = [1, 2, 3, 4, 5];
let currentYellow = 0;

function setup() {
  drawYellow();
  setupPlayer('p1');
  setupPlayer('p2');
}

function drawYellow() {
  currentYellow = yellowPoints[Math.floor(Math.random() * yellowPoints.length)];
  document.getElementById('yellowCard').innerText = "Yellow Card: " + currentYellow + " pts";
}

function setupPlayer(playerId) {
  const hand = document.getElementById(`${playerId}-hand`);
  const mods = document.getElementById(`${playerId}-mods`);
  hand.innerHTML = '';
  mods.innerHTML = '';
  attacks.forEach(atk => {
    const btn = document.createElement('button');
    btn.innerText = atk;
    btn.onclick = () => selectAttack(playerId, atk);
    hand.appendChild(btn);
  });
  modifiers.forEach(mod => {
    const btn = document.createElement('button');
    btn.innerText = mod;
    btn.onclick = () => selectModifier(playerId, mod);
    mods.appendChild(btn);
  });
}

function selectAttack(playerId, value) {
  window[playerId].attack = value;
  document.getElementById(`${playerId}-attack`).innerText = value;
}

function selectModifier(playerId, value) {
  window[playerId].mod = value;
  document.getElementById(`${playerId}-mod`).innerText = value;
}

function playRound() {
  const resultBox = document.getElementById('result');
  if (!p1.attack || !p2.attack) {
    resultBox.innerText = "Both players must select an attack.";
    return;
  }
  let winner = null;
  if (p1.attack === p2.attack) {
    resultBox.innerText = "Tie! Checking modifiers...";
    winner = resolveModifiers(p1.mod, p2.mod);
  } else if (
    (p1.attack === 'Rock' && p2.attack === 'Scissors') ||
    (p1.attack === 'Paper' && p2.attack === 'Rock') ||
    (p1.attack === 'Scissors' && p2.attack === 'Paper')
  ) {
    winner = 'p1';
  } else {
    winner = 'p2';
  }

  if (winner === 'p1') {
    p1.score += currentYellow;
    resultBox.innerText += "\nPlayer 1 wins the round!";
  } else if (winner === 'p2') {
    p2.score += currentYellow;
    resultBox.innerText += "\nPlayer 2 wins the round!";
  } else {
    resultBox.innerText += "\nNo winner.";
  }

  document.getElementById('score1').innerText = p1.score;
  document.getElementById('score2').innerText = p2.score;

  // Reset for next round
  p1.attack = p1.mod = null;
  p2.attack = p2.mod = null;
  document.getElementById('p1-attack').innerText = "None";
  document.getElementById('p1-mod').innerText = "None";
  document.getElementById('p2-attack').innerText = "None";
  document.getElementById('p2-mod').innerText = "None";
  drawYellow();
}

function resolveModifiers(m1, m2) {
  if (m1 === '+1' && m2 !== '+1') return 'p1';
  if (m2 === '+1' && m1 !== '+1') return 'p2';
  if (m1 === 'Curse') p1.score -= 1;
  if (m2 === 'Curse') p2.score -= 1;
  return null;
}

window.onload = setup;
