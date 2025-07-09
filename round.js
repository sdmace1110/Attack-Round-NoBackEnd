// Import data from data.js
import { players, npcs, monsters } from "./data.js";

// Round and initiative global variables
let currentInitiative = 30; // Current initiative count for the round
let currentRound = 1; // Current round number

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
 * Get all unique initiative values from alive characters only, sorted in descending order
 * @returns {Array} - Array of unique initiative values sorted high to low (excludes 0)
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
 * Advance to the next initiative count (jump to next alive character's initiative)
 */
export function nextInitiative() {
  const initiativeValues = getAllInitiativeValues();
  const currentIndex = initiativeValues.indexOf(currentInitiative);

  if (currentIndex < initiativeValues.length - 1) {
    // Move to next lower initiative value
    currentInitiative = initiativeValues[currentIndex + 1];
  } else {
    // At the lowest initiative - advance to next round and reset initiative
    currentRound++;
    currentInitiative = initiativeValues.length > 0 ? initiativeValues[0] : 20;
    updateRoundDisplay();
  }

  updateInitiativeEffects();
  updateInitiativeDisplay();
}

/**
 * Go back to the previous initiative count (jump to previous alive character's initiative)
 */
export function previousInitiative() {
  const initiativeValues = getAllInitiativeValues();
  const currentIndex = initiativeValues.indexOf(currentInitiative);

  if (currentIndex > 0) {
    // Move to next higher initiative value
    currentInitiative = initiativeValues[currentIndex - 1];
  } else if (currentIndex === -1) {
    // Current initiative not in list, find the closest lower value
    const closestLower = initiativeValues.find(
      (init) => init < currentInitiative
    );
    if (closestLower !== undefined) {
      currentInitiative = closestLower;
    } else {
      // No lower value found, go to highest
      currentInitiative = initiativeValues[0] || 20;
    }
  } else {
    // Already at the highest initiative, stay there
    return;
  }

  updateInitiativeEffects();
  updateInitiativeDisplay();
}

/**
 * Reset initiative to the beginning of the round (highest alive character's initiative)
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
 * @param {HTMLElement} card - The card element to update
 * @param {number} initiative - The character's initiative value
 */
export function updateCardInitiativeEffect(card, initiative) {
  // Remove existing initiative classes
  card.classList.remove("current-turn", "upcoming-turn");

  if (initiative === currentInitiative) {
    // Character's turn is now - golden glow
    card.classList.add("current-turn");
  } else if (initiative < currentInitiative) {
    // Character has already acted this round - no special effect
    // Keep default card appearance
  } else {
    // Character hasn't acted yet this round - blur and darken
    card.classList.add("upcoming-turn");
  }
}

/**
 * Initialize round and initiative system
 */
export function initializeRoundSystem() {
  // Update dead character initiatives to 0
  updateDeadCharacterInitiatives();

  // Set initial initiative to highest value (from alive characters)
  const initiativeValues = getAllInitiativeValues();
  currentInitiative = initiativeValues.length > 0 ? initiativeValues[0] : 20;

  // Apply initial initiative effects
  updateInitiativeEffects();
  updateInitiativeDisplay();
  updateRoundDisplay();
}

/**
 * Set up round and initiative event listeners
 */
export function setupRoundEventListeners() {
  // Initiative control event listeners
  document
    .getElementById("nextInitiative")
    .addEventListener("click", nextInitiative);
  document
    .getElementById("prevInitiative")
    .addEventListener("click", previousInitiative);
  document
    .getElementById("resetInitiative")
    .addEventListener("click", resetInitiative);

  // Round control event listeners
  document.getElementById("nextRound").addEventListener("click", nextRound);
  document.getElementById("prevRound").addEventListener("click", previousRound);
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

/**
 * Set current round
 */
export function setCurrentRound(round) {
  if (round >= 1) {
    currentRound = round;
    updateRoundDisplay();
  }
}

/**
 * Set current initiative
 */
export function setCurrentInitiative(initiative) {
  currentInitiative = initiative;
  updateInitiativeDisplay();
  updateInitiativeEffects();
}
