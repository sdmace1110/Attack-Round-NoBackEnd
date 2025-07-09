// Imports
import { players, npcs, monsters } from "./data.js";

// Global variables
let currentCarouselIndex = 0;
let sortedPlayers = [];
let currentInitiative = 30; // Current initiative count for the round
let currentRound = 1; // Current round number

/**
 * Main application initialization - waits for DOM to load then starts the app
 */
document.addEventListener("DOMContentLoaded", function () {
  initializeApp();
  setupEventListeners();
});

/**
 * Initialize the application by sorting players and populating all card displays
 */
function initializeApp() {
  // Update dead character initiatives to 0
  updateDeadCharacterInitiatives();

  // Sort players by initiative (descending order)
  sortedPlayers = [...players].sort((a, b) => b.initiative - a.initiative);

  // Set initial initiative to highest value (from alive characters)
  const initiativeValues = getAllInitiativeValues();
  currentInitiative = initiativeValues.length > 0 ? initiativeValues[0] : 20;

  // Populate cards
  populatePlayersCarousel();
  populateNPCsGrid();
  populateMonstersGrid();

  // Apply initial initiative effects
  updateInitiativeEffects();
  updateInitiativeDisplay();
  updateRoundDisplay();

  // Update carousel navigation
  updateCarouselNavigation();
}

/**
 * Set up all event listeners for carousel navigation and modal interactions
 */
function setupEventListeners() {
  // Carousel navigation - Previous button click handler
  document.getElementById("prevBtn").addEventListener("click", () => {
    if (currentCarouselIndex > 0) {
      currentCarouselIndex--;
      updateCarousel();
    }
  });

  // Carousel navigation - Next button click handler
  document.getElementById("nextBtn").addEventListener("click", () => {
    if (currentCarouselIndex < sortedPlayers.length - 1) {
      currentCarouselIndex++;
      updateCarousel();
    }
  });

  // Modal close button click handler
  document.querySelector(".close").addEventListener("click", closeModal);

  // Modal background click handler to close modal
  document.getElementById("characterModal").addEventListener("click", (e) => {
    if (e.target.id === "characterModal") {
      closeModal();
    }
  });

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

  // Action control event listeners
  document.getElementById("saveData").addEventListener("click", saveDataToFile);

  // Dropdown event listeners
  setupDropdownListeners();
}

/**
 * Populate the players carousel with sorted player cards
 */
function populatePlayersCarousel() {
  const carousel = document.getElementById("playersCarousel");
  if (!carousel) {
    console.error('Element with id "playersCarousel" not found.');
    return;
  }
  carousel.innerHTML = "";

  sortedPlayers.forEach((player, index) => {
    const card = createPlayerCard(player, index);
    carousel.appendChild(card);
  });
}

/**
 * Populate the NPCs grid with NPC cards
 */
function populateNPCsGrid() {
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
function populateMonstersGrid() {
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
 * Create a player card DOM element with all player information and stats
 * @param {Object} player - Player data object
 * @param {number} index - Index position in the sorted players array
 * @returns {HTMLElement} - Complete player card element
 */
function createPlayerCard(player, index) {
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
 * @param {Object} npc - NPC data object
 * @returns {HTMLElement} - Complete NPC card element
 */
function createNPCCard(npc) {
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
 * @param {Object} monster - Monster data object
 * @returns {HTMLElement} - Complete monster card element
 */
function createMonsterCard(monster) {
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
 * Determine HP bar color class based on health percentage
 * @param {number} percentage - Current HP as percentage of max HP
 * @returns {string} - CSS class name for HP bar styling
 */
function getHPClass(percentage) {
  if (percentage > 60) return "hp-healthy";
  if (percentage > 25) return "hp-wounded";
  return "hp-critical";
}

/**
 * Get the most recent round stats from a character's round stats array
 * @param {Array} roundStats - Array of round stat objects
 * @returns {Object|null} - Most recent round stats or null if no stats exist
 */
function getLastRoundStats(roundStats) {
  if (!roundStats || roundStats.length === 0) return null;
  return roundStats[roundStats.length - 1];
}

/**
 * Update the round display in the UI
 */
function updateRoundDisplay() {
  const roundDisplay = document.getElementById("currentRound");
  if (roundDisplay) {
    roundDisplay.textContent = currentRound;
  }
}

/**
 * Update the initiative display in the UI
 */
function updateInitiativeDisplay() {
  const initiativeDisplay = document.getElementById("currentInitiative");
  if (initiativeDisplay) {
    initiativeDisplay.textContent = currentInitiative;
  }
}

/**
 * Update the carousel position by translating the carousel container
 */
function updateCarousel() {
  const carousel = document.getElementById("playersCarousel");
  const cardWidth = 320; // card width + gap
  carousel.style.transform = `translateX(-${
    currentCarouselIndex * cardWidth
  }px)`;
  updateCarouselNavigation();
}

/**
 * Update the enabled/disabled state of carousel navigation buttons
 */
function updateCarouselNavigation() {
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  prevBtn.disabled = currentCarouselIndex === 0;
  nextBtn.disabled = currentCarouselIndex >= sortedPlayers.length - 1;
}

/**
 * Display detailed character information in a modal dialog
 * @param {Object} character - Character data object (player, NPC, or monster)
 * @param {string} type - Character type ("player", "npc", or "monster")
 */
function showCharacterModal(character, type) {
  const modal = document.getElementById("characterModal");
  const modalBody = document.getElementById("modalBody");

  let characterName, characterInfo;

  if (type === "player") {
    characterName = character.characterName;
    characterInfo = `Player: ${character.playerName}`;
  } else if (type === "npc") {
    characterName = character.npcName;
    characterInfo = `Race: ${character.npcRace}`;
  } else {
    characterName = character.npcType;
    characterInfo = `Type: ${character.npcType}`;
  }

  const lastRoundStats = getLastRoundStats(character.roundStats);

  modalBody.innerHTML = `
        <h2>${characterName}</h2>
        <p>${characterInfo}</p>
        <div style="margin: 20px 0;">
            <strong>Initiative:</strong> ${character.initiative}<br>
            <strong>HP:</strong> ${character.currentHps}/${character.maxHps}<br>
            <strong>Status:</strong> ${character.isDead ? "Dead" : "Alive"}
        </div>
        <button id="enter-stats-btn" class="stats-btn enter-stats">Enter Round Stats</button>
        <button id="get-attack-btn" class="stats-btn start-attack">Start Attack!</button>
       
        `;

  // Add event listener for the dynamically created Start Attack button
  const getAttackBtn = document.getElementById("get-attack-btn");
  if (getAttackBtn) {
    getAttackBtn.addEventListener("click", function () {
      printCharacterRoundStats(character, type);
    });
  }

  // Add event listener for the dynamically created Enter Stats button
  const enterStatsBtn = document.getElementById("enter-stats-btn");
  if (enterStatsBtn) {
    enterStatsBtn.addEventListener("click", function () {
      showStatsModal(character, type);
    });
  }

  //      ${
  //       lastRoundStats
  //         ? `
  //         <h3>Round ${lastRoundStats.roundId} Stats:</h3>
  //         ${lastRoundStats.attacks
  //           .map(
  //             (attack) => `
  //             <div style="margin: 15px 0; padding: 15px; background-color: var(--bg-tertiary); border-radius: 8px;">
  //                 <strong>Attacks Made:</strong> ${attack.noOfAttacks}<br>

  //                 ${
  //                   attack.damageDealt.length > 0
  //                     ? `
  //                     <strong>Damage Dealt:</strong><br>
  //                     ${attack.damageDealt
  //                       .map((dmg) => `• ${dmg.name}: ${dmg.amount}`)
  //                       .join("<br>")}
  //                 `
  //                     : ""
  //                 }

  //                 ${
  //                   attack.damageTaken.length > 0
  //                     ? `
  //                     <br><strong>Damage Taken:</strong><br>
  //                     ${attack.damageTaken
  //                       .map((dmg) => `• ${dmg.name}: ${dmg.amount}`)
  //                       .join("<br>")}
  //                 `
  //                     : ""
  //                 }

  //                 ${
  //                   attack.healingDealt.length > 0
  //                     ? `
  //                     <br><strong>Healing Dealt:</strong><br>
  //                     ${attack.healingDealt
  //                       .map((heal) => `• ${heal.name}: ${heal.amount}`)
  //                       .join("<br>")}
  //                 `
  //                     : ""
  //                 }

  //                 ${
  //                   attack.healingTaken.length > 0
  //                     ? `
  //                     <br><strong>Healing Received:</strong><br>
  //                     ${attack.healingTaken
  //                       .map((heal) => `• ${heal.name}: ${heal.amount}`)
  //                       .join("<br>")}
  //                 `
  //                     : ""
  //                 }

  //                 ${
  //                   attack.actions.length > 0
  //                     ? `
  //                     <br><strong>Actions:</strong><br>
  //                     ${attack.actions
  //                       .map((action) => `• ${action.action}`)
  //                       .join("<br>")}
  //                 `
  //                     : ""
  //                 }
  //             </div>
  //         `
  //           )
  //           .join("")}

  //         ${
  //           lastRoundStats.killingBlows.length > 0
  //             ? `
  //             <div style="margin: 15px 0; padding: 15px; background-color: var(--dead-color); border-radius: 8px;">
  //                 <strong>Killing Blows:</strong><br>
  //                 ${lastRoundStats.killingBlows
  //                   .map((kill) => `• ${kill}`)
  //                   .join("<br>")}
  //             </div>
  //         `
  //             : ""
  //         }
  //     `
  //         : "<p>No round stats available.</p>"
  //     }

  modal.style.display = "block";
}

/**
 * Close the character details modal and hide it from view
 */
function closeModal() {
  document.getElementById("characterModal").style.display = "none";
}

/**
 * Show the stats entry modal for entering round statistics
 * @param {Object} character - Character data object (player, NPC, or monster)
 * @param {string} type - Character type ("player", "npc", or "monster")
 */
function showStatsModal(character, type) {
  const characterName = getCharacterName(character, type);

  // Store current character and type for later use
  window.currentStatsCharacter = character;
  window.currentStatsType = type;

  let statsModal = document.getElementById("statsModal");
  if (!statsModal) {
    statsModal = document.createElement("div");
    statsModal.id = "statsModal";
    statsModal.className = "modal stats-modal";

    statsModal.innerHTML = `
      <div class="modal-content stats-modal-content">
        <span class="close stats-close">&times;</span>
        <div id="statsModalBody">
          <!-- Stats form content will be populated here -->
        </div>
      </div>
    `;
    document.body.appendChild(statsModal);

    const statsCloseBtn = statsModal.querySelector(".stats-close");
    if (statsCloseBtn) {
      statsCloseBtn.addEventListener("click", closeStatsModal);
    }

    statsModal.addEventListener("click", (e) => {
      if (e.target.id === "statsModal") {
        closeStatsModal();
      }
    });
  }

  const statsModalBody = document.getElementById("statsModalBody");

  // Get all possible targets for attacks and healing
  const allTargets = getAllTargets();

  // Initialize form data
  const formData = {
    attacks: [{ targetName: "", damage: "" }],
    damageTaken: "",
    healingType: "self",
    healingAmount: "",
    healerName: "",
    actions: [""],
    magic: [{ spellName: "", numberOfAttacks: 1, totalDamage: 0, notes: "" }],
  };

  statsModalBody.innerHTML = generateStatsForm(
    characterName,
    allTargets,
    formData
  );

  // Add event listeners
  addStatsFormEventListeners();

  statsModal.style.display = "block";
}

/**
 * Close the stats entry modal
 */
function closeStatsModal() {
  const statsModal = document.getElementById("statsModal");
  if (statsModal) {
    statsModal.style.display = "none";
  }
}

/**
 * Update visual effects on all cards based on current initiative
 */
function updateInitiativeEffects() {
  // Update player cards
  const playerCards = document.querySelectorAll(".card.player");
  playerCards.forEach((card, index) => {
    const player = sortedPlayers[index];
    updateCardInitiativeEffect(card, player.initiative);
  });

  // Update NPC cards
  const npcCards = document.querySelectorAll(".card.npc");
  npcCards.forEach((card, index) => {
    const npc = npcs[index];
    updateCardInitiativeEffect(card, npc.initiative);
  });

  // Update monster cards
  const monsterCards = document.querySelectorAll(".card.monster");
  monsterCards.forEach((card, index) => {
    const monster = monsters[index];
    updateCardInitiativeEffect(card, monster.initiative);
  });
}

/**
 * Update the visual effect of a single card based on initiative
 * @param {HTMLElement} card - The card element to update
 * @param {number} initiative - The character's initiative value
 */
function updateCardInitiativeEffect(card, initiative) {
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
 * Update initiative values for dead characters (set to 0)
 */
function updateDeadCharacterInitiatives() {
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

  // Re-sort players since initiatives may have changed
  sortedPlayers = [...players].sort((a, b) => b.initiative - a.initiative);
}

/**
 * Get all unique initiative values from alive characters only, sorted in descending order
 * @returns {Array} - Array of unique initiative values sorted high to low (excludes 0)
 */
function getAllInitiativeValues() {
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
/**
 * Advance to the next initiative count (jump to next alive character's initiative)
 */
function nextInitiative() {
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
function previousInitiative() {
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
function resetInitiative() {
  const initiativeValues = getAllInitiativeValues();
  currentInitiative = initiativeValues.length > 0 ? initiativeValues[0] : 20;
  updateInitiativeEffects();
  updateInitiativeDisplay();
}

/**
 * Advance to the next round
 */
function nextRound() {
  currentRound++;
  updateRoundDisplay();
}

/**
 * Go back to the previous round
 */
function previousRound() {
  if (currentRound > 1) {
    currentRound--;
    updateRoundDisplay();
  }
}

/**
 * Set up dropdown event listeners for add/remove character functionality
 */
function setupDropdownListeners() {
  // Add character dropdown items
  const addDropdownItems = document.querySelectorAll(
    "#addDropdown .dropdown-item"
  );
  addDropdownItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      const type = e.target.getAttribute("data-type");
      console.log(`Add Character selected: ${type}`);
    });
  });

  // Remove character dropdown items
  const removeDropdownItems = document.querySelectorAll(
    "#removeDropdown .dropdown-item"
  );
  removeDropdownItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      const type = e.target.getAttribute("data-type");
      console.log(`Remove Character selected: ${type}`);
    });
  });
}

/**
 * Save current game data to a local text file
 */
function saveDataToFile() {
  const gameData = {
    round: currentRound,
    initiative: currentInitiative,
    players: players,
    npcs: npcs,
    monsters: monsters,
    timestamp: new Date().toISOString(),
  };

  const dataStr = JSON.stringify(gameData, null, 2);
  const dataBlob = new Blob([dataStr], { type: "application/json" });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(dataBlob);
  link.download = `dnd-round-tracker-${
    new Date().toISOString().split("T")[0]
  }.json`;

  // Trigger download
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  console.log("Game data saved to file");
}

/**
 * Print character's round stats by round to the console
 * @param {Object} character - Character data object (player, NPC, or monster)
 * @param {string} type - Character type ("player", "npc", or "monster")
 */
function printCharacterRoundStats(character, type) {
  let characterName;

  if (type === "player") {
    characterName = character.characterName;
  } else if (type === "npc") {
    characterName = character.npcName;
  } else {
    characterName = character.npcType;
  }

  console.log(`\n=== ROUND STATS FOR ${characterName.toUpperCase()} ===`);
  console.log(`Type: ${type.toUpperCase()}`);
  console.log(`Initiative: ${character.initiative}`);
  console.log(`Current HP: ${character.currentHps}/${character.maxHps}`);
  console.log(`Status: ${character.isDead ? "DEAD" : "ALIVE"}`);
  console.log(`\n--- ROUND-BY-ROUND BREAKDOWN ---`);

  if (!character.roundStats || character.roundStats.length === 0) {
    console.log("No round stats available.");
    return;
  }

  character.roundStats.forEach((roundStat, _index) => {
    console.log(`\n🎯 ROUND ${roundStat.roundId}:`);

    if (roundStat.attacks && roundStat.attacks.length > 0) {
      roundStat.attacks.forEach((attack, attackIndex) => {
        console.log(`  Attack Set ${attackIndex + 1}:`);
        console.log(`    Number of Attacks: ${attack.noOfAttacks}`);

        if (attack.damageDealt && attack.damageDealt.length > 0) {
          console.log(`    Damage Dealt:`);
          attack.damageDealt.forEach((dmg) => {
            console.log(`      • ${dmg.name}: ${dmg.amount} damage`);
          });
        }

        if (attack.damageTaken && attack.damageTaken.length > 0) {
          console.log(`    Damage Taken:`);
          attack.damageTaken.forEach((dmg) => {
            console.log(`      • ${dmg.name}: ${dmg.amount} damage`);
          });
        }

        if (attack.healingDealt && attack.healingDealt.length > 0) {
          console.log(`    Healing Dealt:`);
          attack.healingDealt.forEach((heal) => {
            console.log(`      • ${heal.name}: ${heal.amount} healing`);
          });
        }

        if (attack.healingTaken && attack.healingTaken.length > 0) {
          console.log(`    Healing Received:`);
          attack.healingTaken.forEach((heal) => {
            console.log(`      • ${heal.name}: ${heal.amount} healing`);
          });
        }

        if (attack.actions && attack.actions.length > 0) {
          console.log(`    Actions Taken:`);
          attack.actions.forEach((action) => {
            console.log(`      • ${action.action}`);
          });
        }
      });
    } else {
      console.log(`  No attacks recorded this round.`);
    }

    if (roundStat.killingBlows && roundStat.killingBlows.length > 0) {
      console.log(`  💀 KILLING BLOWS:`);
      roundStat.killingBlows.forEach((kill) => {
        console.log(`    • ${kill}`);
      });
    }
  });

  console.log(`\n=== END STATS FOR ${characterName.toUpperCase()} ===\n`);
}

/**
 * Generate the complete stats form HTML
 */
function generateStatsForm(characterName, allTargets, formData) {
  const dndAbilities = [
    "Attack",
    "Spell Attack",
    "Sneak Attack",
    "Smite",
    "Rage Attack",
    "Action Surge",
    "Extra Attack",
    "Dual Wielding",
    "Magic Missile",
    "Fireball",
    "Healing Word",
    "Cure Wounds",
    "Shield",
    "Counterspell",
    "Manual Entry",
  ];

  return `
    <h2>Enter Round Stats</h2>
    <h3>${characterName}</h3>
    <p>Round ${currentRound} Statistics Entry</p>
    
    <form id="stats-form" class="stats-form">
      <!-- Attack Section -->
      <div class="stats-form-section">
        <h4>⚔️ Attacks</h4>        
        <div id="attacks-container">
          ${generateAttackInputs(formData.attacks, allTargets)}
        </div>
        
        <button type="button" id="add-attack-btn" class="add-attack-btn">+ Add Attack</button>
      </div>

      <!-- Damage Taken Section -->
      <div class="stats-form-section">
        <h4>🛡️ Damage Taken</h4>
        <div class="form-group">
          <label for="damage-taken">Total Damage Received</label>
          <input type="number" id="damage-taken" class="form-input" 
                 value="${formData.damageTaken}" placeholder="0" min="0">
        </div>
        <div class="form-group">
          <label for="damage-source">Damage Source</label>
          <input type="text" id="damage-source" class="form-input" 
                 placeholder="e.g., Orc Sword, Fire Trap">
        </div>
      </div>

      <!-- Healing Section -->
      <div class="stats-form-section">
        <h4>💚 Healing</h4>
        <div class="healing-toggle">
          <label>
            <input type="radio" name="healing-type" value="self" 
                   ${formData.healingType === "self" ? "checked" : ""}>
            Self Healing
          </label>
          <label>
            <input type="radio" name="healing-type" value="others" 
                   ${formData.healingType === "others" ? "checked" : ""}>
            Heal Others
          </label>
        </div>
        
        <div class="form-group">
          <label for="healing-amount">Healing Amount</label>
          <input type="number" id="healing-amount" class="form-input" 
                 value="${formData.healingAmount}" placeholder="0" min="0">
        </div>
        
        <div id="healer-name-group" class="form-group" 
             style="display: ${
               formData.healingType === "others" ? "block" : "none"
             }">
          <label for="healer-name">Healer Name</label>
          <input type="text" id="healer-name" class="form-input" 
                 value="${
                   formData.healerName
                 }" placeholder="Who provided the healing?">
        </div>
      </div>

      <!-- Magic Section -->
      <div class="stats-form-section">
        <h4>✨ Magic</h4>
        <div id="magic-container">
          ${generateMagicInputs(formData.magic)}
        </div>
        <button type="button" id="add-magic-btn" class="add-magic-btn">+ Add Spell</button>
      </div>

      <!-- Actions Section -->
      <div class="stats-form-section full-width">
        <h4>🎯 Actions Taken</h4>
        <div id="actions-container" class="actions-list">
          ${generateActionInputs(formData.actions)}
        </div>
        <button type="button" id="add-action-btn" class="add-action-btn">+ Add Action</button>
      </div>
    </form>
    
    <div class="stats-modal-buttons">
      <button id="save-stats-btn" class="stats-btn save-stats">Save Round Stats</button>
      <button id="cancel-stats-btn" class="stats-btn cancel-stats">Cancel</button>
    </div>
  `;
}

/**
 * Generate attack input HTML
 */
function generateAttackInputs(attacks, allTargets) {
  return attacks
    .map(
      (attack, index) => `
    <div class="attack-inputs" data-attack-index="${index}">
      <div class="attack-header">
        <h5>Attack ${index + 1}</h5>
        ${
          attacks.length > 1
            ? `<button type="button" class="remove-attack-btn" data-attack-index="${index}">Remove</button>`
            : ""
        }
      </div>
      <div class="attack-row">
        <div class="form-group">
          <label>Target</label>
          <select class="form-select attack-target">
            <option value="">Select Target</option>
            ${allTargets
              .map(
                (target) =>
                  `<option value="${target.name}" data-type="${target.type}" ${
                    target.name === attack.targetName ? "selected" : ""
                  }>${target.name} (${target.type})</option>`
              )
              .join("")}
          </select>
        </div>
        <div class="form-group">
          <label>Damage</label>
          <input type="number" class="form-input attack-damage" 
                 value="${attack.damage}" placeholder="0" min="0">
        </div>
      </div>
    </div>
  `
    )
    .join("");
}

/**
 * Generate magic input HTML
 */
function generateMagicInputs(magicSpells) {
  return magicSpells
    .map(
      (spell, index) => `
    <div class="magic-inputs" data-magic-index="${index}">
      <div class="magic-header">
        <h5>Spell ${index + 1}</h5>
        ${
          magicSpells.length > 1
            ? `<button type="button" class="remove-magic-btn" data-magic-index="${index}">Remove</button>`
            : ""
        }
      </div>
      <div class="magic-row">
        <div class="form-group">
          <label>Spell Name</label>
          <input type="text" class="form-input spell-name" 
                 value="${spell.spellName}" placeholder="e.g., Fireball">
        </div>
        <div class="form-group">
          <label>Number of Attacks</label>
          <input type="number" class="form-input spell-attacks" 
                 value="${spell.numberOfAttacks}" placeholder="1" min="1">
        </div>
        <div class="form-group">
          <label>Total Damage</label>
          <input type="number" class="form-input spell-damage" 
                 value="${spell.totalDamage}" placeholder="0" min="0">
        </div>
      </div>
      <div class="form-group">
        <label>Notes (People Hit)</label>
        <input type="text" class="form-input spell-notes" 
               value="${
                 spell.notes
               }" placeholder="List people affected by the spell">
      </div>
    </div>
  `
    )
    .join("");
}

/**
 * Generate action input HTML
 */
function generateActionInputs(actions) {
  return actions
    .map(
      (action, index) => `
    <div class="action-item" data-action-index="${index}">
      <input type="text" class="form-input action-text" 
             value="${action}" placeholder="Describe action taken">
      ${
        actions.length > 1
          ? `<button type="button" class="remove-action-btn" data-action-index="${index}">Remove</button>`
          : ""
      }
    </div>
  `
    )
    .join("");
}

/**
 * Get all possible targets for attacks and healing
 */
function getAllTargets() {
  const targets = [];

  // Add players
  players.forEach((player) => {
    if (!player.isDead) {
      targets.push({
        name: player.characterName,
        type: "Player",
        character: player,
      });
    }
  });

  // Add NPCs
  npcs.forEach((npc) => {
    if (!npc.isDead) {
      targets.push({
        name: npc.npcName,
        type: "NPC",
        character: npc,
      });
    }
  });

  // Add monsters
  monsters.forEach((monster) => {
    if (!monster.isDead) {
      targets.push({
        name: monster.npcType,
        type: "Monster",
        character: monster,
      });
    }
  });

  return targets;
}

/**
 * Add event listeners for the stats form
 */
function addStatsFormEventListeners() {
  // Add attack button
  const addAttackBtn = document.getElementById("add-attack-btn");
  if (addAttackBtn) {
    addAttackBtn.addEventListener("click", addNewAttack);
  }

  // Healing type radio buttons
  const healingRadios = document.querySelectorAll('input[name="healing-type"]');
  healingRadios.forEach((radio) => {
    radio.addEventListener("change", function () {
      const healerGroup = document.getElementById("healer-name-group");

      if (this.value === "others") {
        healerGroup.style.display = "block";
      } else {
        healerGroup.style.display = "none";
      }
    });
  });

  // Add magic button
  const addMagicBtn = document.getElementById("add-magic-btn");
  if (addMagicBtn) {
    addMagicBtn.addEventListener("click", addNewMagic);
  }

  // Add action button
  const addActionBtn = document.getElementById("add-action-btn");
  if (addActionBtn) {
    addActionBtn.addEventListener("click", addNewAction);
  }

  // Remove attack buttons (use event delegation)
  document.addEventListener("click", function (e) {
    if (e.target.classList.contains("remove-attack-btn")) {
      const attackIndex = parseInt(e.target.dataset.attackIndex);
      removeAttack(attackIndex);
    }
  });

  // Remove magic buttons (use event delegation)
  document.addEventListener("click", function (e) {
    if (e.target.classList.contains("remove-magic-btn")) {
      const magicIndex = parseInt(e.target.dataset.magicIndex);
      removeMagic(magicIndex);
    }
  });

  // Remove action buttons (use event delegation)
  document.addEventListener("click", function (e) {
    if (e.target.classList.contains("remove-action-btn")) {
      const actionIndex = parseInt(e.target.dataset.actionIndex);
      removeAction(actionIndex);
    }
  });

  // Save and cancel buttons
  const saveStatsBtn = document.getElementById("save-stats-btn");
  const cancelStatsBtn = document.getElementById("cancel-stats-btn");

  if (saveStatsBtn) {
    saveStatsBtn.addEventListener("click", saveStatsForm);
  }

  if (cancelStatsBtn) {
    cancelStatsBtn.addEventListener("click", closeStatsModal);
  }
}

/**
 * Add a new attack input group
 */
function addNewAttack() {
  const container = document.getElementById("attacks-container");
  const allTargets = getAllTargets();
  const currentAttacks = container.querySelectorAll(".attack-inputs").length;

  const newAttackHTML = generateAttackInputs(
    [{ targetName: "", damage: "" }],
    allTargets
  );
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = newAttackHTML;
  const newAttackElement = tempDiv.firstElementChild;
  newAttackElement.dataset.attackIndex = currentAttacks;

  // Update attack number in header
  const header = newAttackElement.querySelector("h5");
  header.textContent = `Attack ${currentAttacks + 1}`;

  container.appendChild(newAttackElement);
}

/**
 * Remove an attack input group
 */
function removeAttack(attackIndex) {
  const container = document.getElementById("attacks-container");
  const attacks = container.querySelectorAll(".attack-inputs");

  if (attacks.length > 1) {
    attacks[attackIndex].remove();

    // Reindex remaining attacks
    const remainingAttacks = container.querySelectorAll(".attack-inputs");
    remainingAttacks.forEach((attack, index) => {
      attack.dataset.attackIndex = index;
      const header = attack.querySelector("h5");
      header.textContent = `Attack ${index + 1}`;

      const removeBtn = attack.querySelector(".remove-attack-btn");
      if (removeBtn) {
        removeBtn.dataset.attackIndex = index;
      }
    });
  }
}

/**
 * Add a new magic spell input to the form
 */
function addNewMagic() {
  const container = document.getElementById("magic-container");
  const currentMagic = container.querySelectorAll(".magic-inputs").length;

  const newMagicHTML = generateMagicInputs([
    { spellName: "", numberOfAttacks: 1, totalDamage: 0, notes: "" },
  ]);
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = newMagicHTML;
  const newMagicElement = tempDiv.firstElementChild;
  newMagicElement.dataset.magicIndex = currentMagic;

  // Update spell number in header
  const header = newMagicElement.querySelector("h5");
  header.textContent = `Spell ${currentMagic + 1}`;

  container.appendChild(newMagicElement);
}

/**
 * Remove a magic spell input from the form
 */
function removeMagic(magicIndex) {
  const container = document.getElementById("magic-container");
  const magicInputs = container.querySelectorAll(".magic-inputs");

  if (magicInputs.length > 1) {
    magicInputs[magicIndex].remove();

    // Update remaining magic indices and headers
    const remainingMagic = container.querySelectorAll(".magic-inputs");
    remainingMagic.forEach((magic, index) => {
      magic.dataset.magicIndex = index;
      const header = magic.querySelector("h5");
      header.textContent = `Spell ${index + 1}`;

      const removeBtn = magic.querySelector(".remove-magic-btn");
      if (removeBtn) {
        removeBtn.dataset.magicIndex = index;
      }
    });
  }
}

/**
 * Add a new action input
 */
function addNewAction() {
  const container = document.getElementById("actions-container");
  const currentActions = container.querySelectorAll(".action-item").length;

  const newActionHTML = generateActionInputs([""]);
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = newActionHTML;
  const newActionElement = tempDiv.firstElementChild;
  newActionElement.dataset.actionIndex = currentActions;

  container.appendChild(newActionElement);
}

/**
 * Remove an action input
 */
function removeAction(actionIndex) {
  const container = document.getElementById("actions-container");
  const actions = container.querySelectorAll(".action-item");

  if (actions.length > 1) {
    actions[actionIndex].remove();

    // Reindex remaining actions
    const remainingActions = container.querySelectorAll(".action-item");
    remainingActions.forEach((action, index) => {
      action.dataset.actionIndex = index;

      const removeBtn = action.querySelector(".remove-action-btn");
      if (removeBtn) {
        removeBtn.dataset.actionIndex = index;
      }
    });
  }
}

/**
 * Save the stats form data
 */
function saveStatsForm() {
  const character = window.currentStatsCharacter;
  const type = window.currentStatsType;

  if (!character) {
    console.error("No character data available");
    return;
  }

  // Collect form data
  const formData = collectFormData();

  // Validate form data
  if (!validateFormData(formData)) {
    return;
  }

  // Update character's round stats
  updateCharacterRoundStats(character, type, formData);

  // Update displays
  updateAllDisplays();

  console.log(
    `Stats saved for ${getCharacterName(
      character,
      type
    )} - Round ${currentRound}`,
    formData
  );
  closeStatsModal();
}

/**
 * Update all displays after data changes
 */
function updateAllDisplays() {
  // Update dead character initiatives
  updateDeadCharacterInitiatives();

  // Re-sort players
  sortedPlayers = [...players].sort((a, b) => b.initiative - a.initiative);

  // Repopulate all card displays
  populatePlayersCarousel();
  populateNPCsGrid();
  populateMonstersGrid();

  // Update initiative effects
  updateInitiativeEffects();

  // Update carousel navigation
  updateCarouselNavigation();
}

/**
 * Collect all form data
 */
function collectFormData() {
  const data = {
    attacks: [],
    damageTaken: { amount: 0, source: "" },
    healing: { type: "self", amount: 0, healer: "" },
    actions: [],
    magic: [],
  };

  // Get attacks
  const attackContainers = document.querySelectorAll(".attack-inputs");
  attackContainers.forEach((container) => {
    const targetName = container.querySelector(".attack-target").value;
    const damage =
      parseInt(container.querySelector(".attack-damage").value) || 0;

    if (targetName || damage > 0) {
      data.attacks.push({ targetName, damage });
    }
  });

  // Get damage taken
  const damageTaken =
    parseInt(document.getElementById("damage-taken").value) || 0;
  const damageSource = document.getElementById("damage-source").value;
  data.damageTaken = { amount: damageTaken, source: damageSource };

  // Get healing
  const healingType = document.querySelector(
    'input[name="healing-type"]:checked'
  ).value;
  const healingAmount =
    parseInt(document.getElementById("healing-amount").value) || 0;
  const healerName = document.getElementById("healer-name").value;

  data.healing = {
    type: healingType,
    amount: healingAmount,
    healer: healerName,
  };

  // Get magic
  const magicContainers = document.querySelectorAll(".magic-inputs");
  magicContainers.forEach((container) => {
    const spellName = container.querySelector(".spell-name").value;
    const numberOfAttacks =
      parseInt(container.querySelector(".spell-attacks").value) || 0;
    const totalDamage =
      parseInt(container.querySelector(".spell-damage").value) || 0;
    const notes = container.querySelector(".spell-notes").value;

    if (spellName || numberOfAttacks > 0 || totalDamage > 0) {
      data.magic.push({ spellName, numberOfAttacks, totalDamage, notes });
    }
  });

  // Get actions
  const actionInputs = document.querySelectorAll(".action-text");
  actionInputs.forEach((input) => {
    if (input.value.trim()) {
      data.actions.push(input.value.trim());
    }
  });

  return data;
}

/**
 * Validate form data
 */
function validateFormData(data) {
  // Check if at least one meaningful action was taken
  const hasAttacks =
    data.attacks.length > 0 && data.attacks.some((attack) => attack.damage > 0);
  const hasDamage = data.damageTaken.amount > 0;
  const hasHealing = data.healing.amount > 0;
  const hasActions = data.actions.length > 0;
  const hasMagic =
    data.magic.length > 0 &&
    data.magic.some((magic) => magic.totalDamage > 0 || magic.spellName);

  if (!hasAttacks && !hasDamage && !hasHealing && !hasActions && !hasMagic) {
    alert(
      "Please enter at least one action, attack, damage taken, healing, or magic spell."
    );
    return false;
  }

  // Validate attacks with targets have damage
  for (const attack of data.attacks) {
    if (attack.targetName && attack.damage <= 0) {
      alert(
        `Attack "${
          attack.attackName || "Unnamed"
        }" has a target but no damage specified.`
      );
      return false;
    }
  }

  return true;
}

/**
 * Update character's round stats with form data
 */
function updateCharacterRoundStats(character, _type, formData) {
  // Find or create round stats for current round
  let roundStats = character.roundStats.find(
    (rs) => rs.roundId === currentRound
  );

  if (!roundStats) {
    roundStats = {
      roundId: currentRound,
      attacks: [],
      killingBlows: [],
    };
    character.roundStats.push(roundStats);
  }

  // Create attack entry
  const attackEntry = {
    noOfAttacks: formData.attacks.length,
    damageDealt: [],
    damageTaken: [],
    healingDealt: [],
    healingTaken: [],
    actions: formData.actions.map((action) => ({ action })),
  };

  // Add damage dealt
  formData.attacks.forEach((attack) => {
    if (attack.damage !== 0) {
      attackEntry.damageDealt.push({
        name: attack.attackName || "Attack",
        amount: attack.damage,
      });

      // Apply damage to target
      if (attack.targetName) {
        applyDamageToTarget(attack.targetName, attack.damage, character);
      }
    }
  });

  // Add damage taken
  if (formData.damageTaken.amount > 0) {
    attackEntry.damageTaken.push({
      name: formData.damageTaken.source || "Unknown",
      amount: formData.damageTaken.amount,
    });

    // Apply damage to current character
    character.currentHps = Math.max(
      0,
      character.currentHps - formData.damageTaken.amount
    );

    // Check if character died
    if (character.currentHps === 0) {
      character.isDead = true;
      character.initiative = 0;
    }
  }

  // Add healing
  if (formData.healing.amount > 0) {
    if (formData.healing.type === "self") {
      attackEntry.healingTaken.push({
        name: "Self Healing",
        amount: formData.healing.amount,
      });

      // Apply healing to current character
      character.currentHps = Math.min(
        character.maxHps,
        character.currentHps + formData.healing.amount
      );
    } else if (formData.healing.type === "others") {
      attackEntry.healingDealt.push({
        name: formData.healing.healer
          ? `Healing from ${formData.healing.healer}`
          : "Healing Others",
        amount: formData.healing.amount,
      });
    }
  }

  // Add magic
  if (formData.magic && formData.magic.length > 0) {
    formData.magic.forEach((magic) => {
      if (magic.totalDamage > 0) {
        attackEntry.damageDealt.push({
          name: magic.spellName || "Magic Spell",
          amount: magic.totalDamage,
        });

        // Note: Magic damage typically doesn't have specific targets in this form
        // but could be extended in the future to support targeted spells
      }

      // Add magic actions
      if (magic.spellName) {
        attackEntry.actions.push({
          action: `Cast ${magic.spellName}${
            magic.notes ? ` (${magic.notes})` : ""
          }`,
        });
      }
    });
  }

  // Add to round stats
  roundStats.attacks.push(attackEntry);
}

/**
 * Apply damage to a target character
 */
function applyDamageToTarget(targetName, damage, attackerCharacter = null) {
  // Find target in all character types
  const allCharacters = [...players, ...npcs, ...monsters];

  for (const char of allCharacters) {
    const charName = getCharacterName(char, getCharacterType(char));

    if (charName === targetName) {
      const originalHp = char.currentHps;
      char.currentHps = Math.max(0, char.currentHps - damage);

      // Check if character died from this attack
      if (originalHp > 0 && char.currentHps === 0) {
        char.isDead = true;
        char.initiative = 0;

        // Track killing blow if we have an attacker
        if (attackerCharacter) {
          // Find the current round stats for the attacker
          const currentRoundStats = attackerCharacter.roundStats.find(
            (rs) => rs.roundId === currentRound
          );

          if (currentRoundStats) {
            // Initialize killingBlows array if it doesn't exist
            if (!currentRoundStats.killingBlows) {
              currentRoundStats.killingBlows = [];
            }

            // Add the target's name to the killing blows
            currentRoundStats.killingBlows.push(targetName);
          }
        }
      }
      break;
    }
  }
}

/**
 * Apply healing to a target character
 */
function applyHealingToTarget(targetName, healing) {
  // Find target in all character types
  const allCharacters = [...players, ...npcs, ...monsters];

  for (const char of allCharacters) {
    const charName = getCharacterName(char, getCharacterType(char));

    if (charName === targetName) {
      char.currentHps = Math.min(char.maxHps, char.currentHps + healing);

      // If character was dead and now has HP, revive them
      if (char.isDead && char.currentHps > 0) {
        char.isDead = false;
        // Restore initiative (you might want to ask for new initiative)
        if (char.initiative === 0) {
          // For now, set to 1, but this could be enhanced
          char.initiative = 1;
        }
      }
      break;
    }
  }
}

/**
 * Get character type from character object
 */
function getCharacterType(character) {
  if (character.characterName) return "player";
  if (character.npcName) return "npc";
  if (character.npcType) return "monster";
  return "unknown";
}

/**
 * Get character name based on character object and type
 */
function getCharacterName(character, type) {
  if (type === "player") {
    return character.characterName;
  } else if (type === "npc") {
    return character.npcName;
  } else if (type === "monster") {
    return character.npcType;
  }
  return "Unknown";
}
