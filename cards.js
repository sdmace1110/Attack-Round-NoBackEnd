// Import data from data.js
import { players, npcs, monsters } from "./data.js";

/**
 * Create a player card DOM element with all player information and stats
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

  card.addEventListener("click", () => showCharacterModal(player, "player"));
  return card;
}

/**
 * Create an NPC card DOM element with all NPC information and stats
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

  card.addEventListener("click", () => showCharacterModal(npc, "npc"));
  return card;
}

/**
 * Create a monster card DOM element with all monster information and stats
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

  card.addEventListener("click", () => showCharacterModal(monster, "monster"));
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
 */
export function getHPClass(percentage) {
  if (percentage > 60) return "hp-healthy";
  if (percentage > 25) return "hp-wounded";
  return "hp-critical";
}

/**
 * Get the most recent round stats from a character's round stats array
 */
export function getLastRoundStats(roundStats) {
  if (!roundStats || roundStats.length === 0) return null;
  return roundStats[roundStats.length - 1];
}

/**
 * Update all card displays after data changes
 */
export function updateAllCardDisplays() {
  populateNPCsGrid();
  populateMonstersGrid();
}

/**
 * Set up card-related event listeners
 */
export function setupCardEventListeners() {
  // Event delegation for dynamically created cards
  document.addEventListener("click", handleCardClick);
}

function handleCardClick(event) {
  const card = event.target.closest(".card");
  if (!card) return;

  const cardType = card.getAttribute("data-type");
  const cardIndex = card.getAttribute("data-index");

  if (cardType === "player") {
    const player = getSortedPlayers()[cardIndex];
    showCharacterModal(player, "player");
  } else if (cardType === "npc") {
    const npc = npcs[cardIndex];
    showCharacterModal(npc, "npc");
  } else if (cardType === "monster") {
    const monster = monsters[cardIndex];
    showCharacterModal(monster, "monster");
  }
}

// Import function from other modules
import { showCharacterModal } from "./script.js";
