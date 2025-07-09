// Import data from data.js
import { players, npcs, monsters } from "./data.js";

// Global variable for tracking viewed characters
let viewedCharacters = new Set();

/**
 * Create a player card DOM element with all player information and stats
 * @param {Object} player - Player data object
 * @param {number} index - Index position in the sorted players array
 * @returns {HTMLElement} - Complete player card element
 */
export function createPlayerCard(player, index) {
  const card = document.createElement("div");
  card.className = `card player ${player.isDead ? "dead" : ""}`;
  card.setAttribute("data-index", index);
  card.setAttribute("data-type", "player");

  const hpPercentage = (player.currentHps / player.maxHps) * 100;
  const hpClass = getHPClass(hpPercentage);

  const lastRoundStats = getLastRoundStats(player.roundStats);
  const attacksCount = lastRoundStats
    ? lastRoundStats.attacks.reduce(
        (sum, attack) => sum + attack.noOfAttacks,
        0
      )
    : 0;

  card.innerHTML = `
        <div class="card-header">
            <div class="character-name">${player.characterName}</div>
            <div class="initiative-badge">Init: ${player.initiative}</div>
        </div>
        <div class="player-info">Player: ${player.playerName}</div>
        <div class="hp-bar-container">
            <div class="hp-text">
                <span>HP: ${player.currentHps}/${player.maxHps}</span>
                <span>${Math.round(hpPercentage)}%</span>
            </div>
            <div class="hp-bar">
                <div class="hp-fill ${hpClass}" style="width: ${hpPercentage}%"></div>
            </div>
        </div>
        <div class="round-stats">
            <span class="attacks-count">⚔️ ${attacksCount} attacks</span>
            ${
              lastRoundStats && lastRoundStats.killingBlows.length > 0
                ? `<span>💀 ${lastRoundStats.killingBlows.length} kills</span>`
                : ""
            }
        </div>
    `;

  card.addEventListener("click", () => {
    markCharacterAsViewed(player, "player");
    showCharacterModal(player, "player");
  });
  return card;
}

/**
 * Create an NPC card DOM element with all NPC information and stats
 * @param {Object} npc - NPC data object
 * @returns {HTMLElement} - Complete NPC card element
 */
export function createNPCCard(npc) {
  const card = document.createElement("div");
  card.className = `card npc ${npc.isDead ? "dead" : ""}`;
  card.setAttribute("data-type", "npc");

  const hpPercentage = (npc.currentHps / npc.maxHps) * 100;
  const hpClass = getHPClass(hpPercentage);

  const lastRoundStats = getLastRoundStats(npc.roundStats);
  const attacksCount = lastRoundStats
    ? lastRoundStats.attacks.reduce(
        (sum, attack) => sum + attack.noOfAttacks,
        0
      )
    : 0;

  card.innerHTML = `
        <div class="card-header">
            <div class="character-name">${npc.npcName}</div>
            <div class="initiative-badge">Init: ${npc.initiative}</div>
        </div>
        <div class="npc-info">Race: ${npc.npcRace}</div>
        <div class="hp-bar-container">
            <div class="hp-text">
                <span>HP: ${npc.currentHps}/${npc.maxHps}</span>
                <span>${Math.round(hpPercentage)}%</span>
            </div>
            <div class="hp-bar">
                <div class="hp-fill ${hpClass}" style="width: ${hpPercentage}%"></div>
            </div>
        </div>
        <div class="round-stats">
            <span class="attacks-count">⚔️ ${attacksCount} attacks</span>
            ${
              lastRoundStats && lastRoundStats.killingBlows.length > 0
                ? `<span>💀 ${lastRoundStats.killingBlows.length} kills</span>`
                : ""
            }
        </div>
    `;

  card.addEventListener("click", () => {
    markCharacterAsViewed(npc, "npc");
    showCharacterModal(npc, "npc");
  });
  return card;
}

/**
 * Create a monster card DOM element with all monster information and stats
 * @param {Object} monster - Monster data object
 * @returns {HTMLElement} - Complete monster card element
 */
export function createMonsterCard(monster) {
  const card = document.createElement("div");
  card.className = `card monster ${monster.isDead ? "dead" : ""}`;
  card.setAttribute("data-type", "monster");

  const hpPercentage = (monster.currentHps / monster.maxHps) * 100;
  const hpClass = getHPClass(hpPercentage);

  const lastRoundStats = getLastRoundStats(monster.roundStats);
  const attacksCount = lastRoundStats
    ? lastRoundStats.attacks.reduce(
        (sum, attack) => sum + attack.noOfAttacks,
        0
      )
    : 0;

  card.innerHTML = `
        <div class="card-header">
            <div class="character-name">${monster.npcType}</div>
            <div class="initiative-badge">Init: ${monster.initiative}</div>
        </div>
        <div class="monster-info">Type: ${monster.npcType}</div>
        <div class="hp-bar-container">
            <div class="hp-text">
                <span>HP: ${monster.currentHps}/${monster.maxHps}</span>
                <span>${Math.round(hpPercentage)}%</span>
            </div>
            <div class="hp-bar">
                <div class="hp-fill ${hpClass}" style="width: ${hpPercentage}%"></div>
            </div>
        </div>
        <div class="round-stats">
            <span class="attacks-count">⚔️ ${attacksCount} attacks</span>
            ${
              lastRoundStats && lastRoundStats.killingBlows.length > 0
                ? `<span>💀 ${lastRoundStats.killingBlows.length} kills</span>`
                : ""
            }
        </div>
    `;

  card.addEventListener("click", () => {
    markCharacterAsViewed(monster, "monster");
    showCharacterModal(monster, "monster");
  });
  return card;
}

/**
 * Populate the NPCs grid with NPC cards
 */
export function populateNPCsGrid() {
  const grid = document.getElementById("npcsGrid");
  if (!grid) {
    console.error('Element with id "npcsGrid" not found.');
    return;
  }
  grid.innerHTML = "";

  npcs.forEach((npc) => {
    const card = createNPCCard(npc);
    grid.appendChild(card);
  });
}

/**
 * Populate the monsters grid with monster cards
 */
export function populateMonstersGrid() {
  const grid = document.getElementById("monstersGrid");
  if (!grid) {
    console.error('Element with id "monstersGrid" not found.');
    return;
  }
  grid.innerHTML = "";

  monsters.forEach((monster) => {
    const card = createMonsterCard(monster);
    grid.appendChild(card);
  });
}

/**
 * Determine HP bar color class based on health percentage
 * @param {number} percentage - Current HP as percentage of max HP
 * @returns {string} - CSS class name for HP bar styling
 */
export function getHPClass(percentage) {
  if (percentage > 60) return "hp-healthy";
  if (percentage > 25) return "hp-wounded";
  return "hp-critical";
}

/**
 * Get the most recent round stats from a character's round stats array
 * @param {Array} roundStats - Array of round stat objects
 * @returns {Object|null} - Most recent round stats or null if no stats exist
 */
export function getLastRoundStats(roundStats) {
  if (!roundStats || roundStats.length === 0) return null;
  return roundStats[roundStats.length - 1];
}

/**
 * Generate a unique character ID for tracking purposes
 * @param {Object} character - Character data object
 * @param {string} type - Character type ("player", "npc", or "monster")
 * @returns {string} - Unique character identifier
 */
export function generateCharacterId(character, type) {
  if (type === "player") {
    return `player-${character.characterName}-${character.playerName}`;
  } else if (type === "npc") {
    return `npc-${character.npcName}-${character.initiative}`;
  } else if (type === "monster") {
    return `monster-${character.npcType}-${character.initiative}`;
  }
  return `unknown-${Date.now()}`;
}

/**
 * Mark a character as viewed and update UI
 * @param {Object} character - Character data object
 * @param {string} type - Character type ("player", "npc", or "monster")
 */
export function markCharacterAsViewed(character, type) {
  const characterId = generateCharacterId(character, type);
  viewedCharacters.add(characterId);
  updateCardViewedStates();
}

/**
 * Update all cards to show viewed states
 */
export function updateCardViewedStates() {
  // Update player cards
  const playerCards = document.querySelectorAll(".card.player");
  playerCards.forEach((card, index) => {
    const player = players[index];
    if (player) {
      const characterId = generateCharacterId(player, "player");
      if (viewedCharacters.has(characterId)) {
        card.classList.add("viewed");
      }
    }
  });

  // Update NPC cards
  const npcCards = document.querySelectorAll(".card.npc");
  npcCards.forEach((card, index) => {
    const npc = npcs[index];
    if (npc) {
      const characterId = generateCharacterId(npc, "npc");
      if (viewedCharacters.has(characterId)) {
        card.classList.add("viewed");
      }
    }
  });

  // Update monster cards
  const monsterCards = document.querySelectorAll(".card.monster");
  monsterCards.forEach((card, index) => {
    const monster = monsters[index];
    if (monster) {
      const characterId = generateCharacterId(monster, "monster");
      if (viewedCharacters.has(characterId)) {
        card.classList.add("viewed");
      }
    }
  });
}

/**
 * Update all card displays after data changes
 */
export function updateAllCardDisplays() {
  populateNPCsGrid();
  populateMonstersGrid();
  updateCardViewedStates();
}

/**
 * Get viewed characters set
 */
export function getViewedCharacters() {
  return viewedCharacters;
}

// Import functions from other modules
import { showCharacterModal } from "./script.js";
