// Import data from data.js
import { players, npcs, monsters } from "./data.js";

// Round and initiative global variables
let currentInitiative = 30;
let currentRound = 1;

/**
 * Update initiative values for dead characters (set to 0)
 */
export function updateDeadCharacterInitiatives() {
  // Update players
  players.forEach((player) => {
    if (player.isDead) {
      player.initiative = 0;
    }
  });

  // Update NPCs
  npcs.forEach((npc) => {
    if (npc.isDead) {
      npc.initiative = 0;
    }
  });

  // Update monsters
  monsters.forEach((monster) => {
    if (monster.isDead) {
      monster.initiative = 0;
    }
  });
}

/**
 * Get all unique initiative values from alive characters only
 */
export function getAllInitiativeValues() {
  const allInitiatives = [];

  // Collect initiative values from alive characters only
  players.forEach((player) => {
    if (!player.isDead && player.initiative > 0) {
      allInitiatives.push(player.initiative);
    }
  });

  npcs.forEach((npc) => {
    if (!npc.isDead && npc.initiative > 0) {
      allInitiatives.push(npc.initiative);
    }
  });

  monsters.forEach((monster) => {
    if (!monster.isDead && monster.initiative > 0) {
      allInitiatives.push(monster.initiative);
    }
  });

  // Remove duplicates and sort in descending order
  return [...new Set(allInitiatives)].sort((a, b) => b - a);
}

/**
 * Advance to the next initiative count
 */
export function nextInitiative() {
  const initiativeValues = getAllInitiativeValues();
  const currentIndex = initiativeValues.indexOf(currentInitiative);

  if (currentIndex < initiativeValues.length - 1) {
    currentInitiative = initiativeValues[currentIndex + 1];
  } else {
    currentRound++;
    currentInitiative = initiativeValues.length > 0 ? initiativeValues[0] : 20;
    updateRoundDisplay();
  }

  updateInitiativeEffects();
  updateInitiativeDisplay();
}

/**
 * Go back to the previous initiative count
 */
export function previousInitiative() {
  const initiativeValues = getAllInitiativeValues();
  const currentIndex = initiativeValues.indexOf(currentInitiative);

  if (currentIndex > 0) {
    currentInitiative = initiativeValues[currentIndex - 1];
  } else if (currentIndex === -1) {
    const closestLower = initiativeValues.find(
      (init) => init < currentInitiative
    );
    if (closestLower !== undefined) {
      currentInitiative = closestLower;
    } else {
      currentInitiative = initiativeValues[0] || 20;
    }
  } else {
    return;
  }

  updateInitiativeEffects();
  updateInitiativeDisplay();
}

/**
 * Reset initiative to the beginning of the round
 */
export function resetInitiative() {
  const initiativeValues = getAllInitiativeValues();
  currentInitiative = initiativeValues.length > 0 ? initiativeValues[0] : 20;
  updateInitiativeEffects();
  updateInitiativeDisplay();
}

/**
 * Advance to the next round
 */
export function nextRound() {
  currentRound++;
  updateRoundDisplay();
}

/**
 * Go back to the previous round
 */
export function previousRound() {
  if (currentRound > 1) {
    currentRound--;
    updateRoundDisplay();
  }
}

/**
 * Update the round display in the UI
 */
export function updateRoundDisplay() {
  const roundDisplay = document.getElementById("currentRound");
  if (roundDisplay) {
    roundDisplay.textContent = currentRound;
  }
}

/**
 * Update the initiative display in the UI
 */
export function updateInitiativeDisplay() {
  const initiativeDisplay = document.getElementById("currentInitiative");
  if (initiativeDisplay) {
    initiativeDisplay.textContent = currentInitiative;
  }
}

/**
 * Update visual effects on all cards based on current initiative
 */
export function updateInitiativeEffects() {
  // Import getSortedPlayers from carousel module
  import("./carousel.js").then((carousel) => {
    const sortedPlayers = carousel.getSortedPlayers();

    // Update player cards
    const playerCards = document.querySelectorAll(".card.player");
    playerCards.forEach((card, index) => {
      const player = sortedPlayers[index];
      if (player) {
        updateCardInitiativeEffect(card, player.initiative);
      }
    });
  });

  // Update NPC cards
  const npcCards = document.querySelectorAll(".card.npc");
  npcCards.forEach((card, index) => {
    const npc = npcs[index];
    if (npc) {
      updateCardInitiativeEffect(card, npc.initiative);
    }
  });

  // Update monster cards
  const monsterCards = document.querySelectorAll(".card.monster");
  monsterCards.forEach((card, index) => {
    const monster = monsters[index];
    if (monster) {
      updateCardInitiativeEffect(card, monster.initiative);
    }
  });
}

/**
 * Update the visual effect of a single card based on initiative
 */
export function updateCardInitiativeEffect(card, initiative) {
  // Remove existing initiative classes
  card.classList.remove("current-turn", "upcoming-turn");

  if (initiative === currentInitiative) {
    card.classList.add("current-turn");
  } else if (initiative < currentInitiative) {
    // Keep default card appearance
  } else {
    card.classList.add("upcoming-turn");
  }
}

/**
 * Initialize round and initiative system
 */
export function initializeRoundSystem() {
  updateDeadCharacterInitiatives();
  const initiativeValues = getAllInitiativeValues();
  currentInitiative = initiativeValues.length > 0 ? initiativeValues[0] : 20;
  updateInitiativeEffects();
  updateInitiativeDisplay();
  updateRoundDisplay();
}

/**
 * Set up round and initiative event listeners
 */
export function setupRoundEventListeners() {
  const nextInitBtn = document.getElementById("nextInitiative");
  const prevInitBtn = document.getElementById("prevInitiative");
  const resetInitBtn = document.getElementById("resetInitiative");
  const nextRoundBtn = document.getElementById("nextRound");
  const prevRoundBtn = document.getElementById("prevRound");

  if (nextInitBtn) nextInitBtn.addEventListener("click", nextInitiative);
  if (prevInitBtn) prevInitBtn.addEventListener("click", previousInitiative);
  if (resetInitBtn) resetInitBtn.addEventListener("click", resetInitiative);
  if (nextRoundBtn) nextRoundBtn.addEventListener("click", nextRound);
  if (prevRoundBtn) prevRoundBtn.addEventListener("click", previousRound);
}

/**
 * Get current round
 */
export function getCurrentRound() {
  return currentRound;
}

/**
 * Get current initiative
 */
export function getCurrentInitiative() {
  return currentInitiative;
}
