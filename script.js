// Imports
import { players, npcs, monsters } from "./data.js";

// Global variables
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
  populatePlayersGrid();
  populateNPCsGrid();
  populateMonstersGrid();

  // Apply initial initiative effects
  updateInitiativeEffects();
  updateInitiativeDisplay();
  updateRoundDisplay();
}

/**
 * Set up all event listeners for modal interactions and controls
 */
function setupEventListeners() {
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
 * Populate the players grid with sorted player cards
 */
function populatePlayersGrid() {
  const grid = document.getElementById("playersGrid");
  if (!grid) {
    console.error('Element with id "playersGrid" not found.');
    return;
  }
  grid.innerHTML = "";

  sortedPlayers.forEach((player, index) => {
    const card = createPlayerCard(player, index);
    grid.appendChild(card);
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
 */
function createPlayerCard(player, index) {
  const card = document.createElement("div");
  const hasActed = hasCharacterActed(player);
  card.className = `card player ${player.isDead ? "dead" : ""} ${
    hasActed ? "turn-used" : ""
  }`;
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

  // Only add click listener if character hasn't acted
  if (!hasActed) {
    card.addEventListener("click", () => showStatsModal(player, "player"));
  }

  return card;
}

/**
 * Create an NPC card DOM element with all NPC information and stats
 */
function createNPCCard(npc) {
  const card = document.createElement("div");
  const hasActed = hasCharacterActed(npc);
  card.className = `card npc ${npc.isDead ? "dead" : ""} ${
    hasActed ? "turn-used" : ""
  }`;
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

  // Only add click listener if character hasn't acted
  if (!hasActed) {
    card.addEventListener("click", () => showStatsModal(npc, "npc"));
  }

  return card;
}

/**
 * Create a monster card DOM element with all monster information and stats
 */
function createMonsterCard(monster) {
  const card = document.createElement("div");
  const hasActed = hasCharacterActed(monster);
  card.className = `card monster ${monster.isDead ? "dead" : ""} ${
    hasActed ? "turn-used" : ""
  }`;
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

  // Only add click listener if character hasn't acted
  if (!hasActed) {
    card.addEventListener("click", () => showStatsModal(monster, "monster"));
  }

  return card;
}

/**
 * Show the stats entry modal for entering round statistics
 * @param {Object} character - Character data object (player, NPC, or monster)
 * @param {string} type - Character type ("player", "npc", or "monster")
 */
function showStatsModal(character, type) {
  // Reset form counters
  resetFormCounters();

  // Store character reference for form submission
  window.currentStatsCharacter = character;
  window.currentStatsType = type;

  const characterName = getCharacterName(character, type);
  const modalContent = `
    <h2>📊 Round ${currentRound} Stats for ${characterName}</h2>
    <form id="statsForm">
      ${generateStatsFormHTML(character, type)}
      <div class="stats-modal-buttons">
        <button type="button" class="stats-btn save-stats" onclick="saveStatsForm()">💾 Save Stats</button>
        <button type="button" class="stats-btn cancel-stats" onclick="closeStatsModal()">❌ Cancel</button>
      </div>
    </form>
  `;

  // Create and show stats modal
  let statsModal = document.getElementById("statsModal");
  if (!statsModal) {
    statsModal = document.createElement("div");
    statsModal.id = "statsModal";
    statsModal.className = "modal stats-modal";
    document.body.appendChild(statsModal);
  }

  statsModal.innerHTML = `
    <div class="stats-modal-content">
      <span class="stats-close" onclick="closeStatsModal()">&times;</span>
      ${modalContent}
    </div>
  `;

  statsModal.style.display = "block";

  // Set up initial remove button visibility
  setTimeout(() => {
    updateRemoveButtonVisibility("attackInputs", ".remove-attack-btn");
    updateRemoveButtonVisibility("magicInputs", ".remove-attack-btn");
    updateRemoveButtonVisibility("actionsList", ".remove-action-btn");
  }, 100);
}

/**
 * Save the stats form data (without auto-advancing initiative)
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

  // Mark character as having acted this turn
  markCharacterAsActed(character);

  // Apply visual effect immediately
  applyTurnUsedEffect(character);

  // Update displays
  updateAllDisplays();

  // Remove auto-advancement - let user control initiative manually
  // nextInitiative(); // <-- REMOVED THIS LINE

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
 * Mark character as having acted this turn (visual indicator)
 */
function markCharacterAsActed(character) {
  // Add a property to track if character acted this turn
  if (!character.turnTracking) {
    character.turnTracking = {};
  }
  character.turnTracking[
    `round_${currentRound}_init_${currentInitiative}`
  ] = true;
}

/**
 * Check if character has acted at current initiative
 */
function hasCharacterActed(character) {
  if (!character.turnTracking) return false;
  return (
    character.turnTracking[`round_${currentRound}_init_${currentInitiative}`] ||
    false
  );
}

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

    // Clear turn tracking for the NEW round (this will clear previous round's data)
    clearTurnTracking();
  }

  updateInitiativeEffects();
  updateInitiativeDisplay();
}

/**
 * Clear turn tracking for all characters (start of new round)
 */
function clearTurnTracking() {
  [...players, ...npcs, ...monsters].forEach((character) => {
    if (character.turnTracking) {
      // Clear turn tracking data for the PREVIOUS round when starting new round
      Object.keys(character.turnTracking).forEach((key) => {
        if (key.startsWith(`round_${currentRound - 1}`)) {
          delete character.turnTracking[key];
        }
      });
    }
  });

  // Update displays to remove blur effects from previous round
  updateAllDisplays();
}

/**
 * Clear all turn-used visual effects from cards
 */
function clearAllTurnEffects() {
  document.querySelectorAll(".card").forEach((card) => {
    card.classList.remove("turn-used");
    card.style.pointerEvents = "";
  });
}

/**
 * Apply turn-used visual effects to specific character card
 */
function applyTurnUsedEffect(character) {
  const characterName = getCharacterName(
    character,
    getCharacterType(character)
  );
  const cards = document.querySelectorAll(".card");

  cards.forEach((card) => {
    const cardName = card.querySelector(".character-name")?.textContent;
    if (cardName === characterName) {
      card.classList.add("turn-used");
    }
  });
}

// Utility functions
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
 * Close the stats entry modal
 */
function closeStatsModal() {
  const statsModal = document.getElementById("statsModal");
  if (statsModal) {
    statsModal.style.display = "none";
  }
}

/**
 * Generate the complete stats form HTML
 */
function generateStatsFormHTML(character, type) {
  return `
    <div class="stats-form">
      <!-- Attacks Section -->
      <div class="stats-form-section">
        <h4>⚔️ Attacks</h4>
        <div class="attack-inputs" id="attackInputs">
          <div class="attack-row" data-attack-index="0">
            <div class="attack-header">
              <h5>Attack 1</h5>
              <button type="button" class="remove-attack-btn" onclick="removeAttackRow(0)" style="display: none;">×</button>
            </div>
            <select class="form-select attack-target" name="target_0">
              <option value="">Select Target</option>
              ${generateTargetOptions()}
            </select>
            <input type="number" class="form-input attack-damage" name="damage_0" placeholder="Damage Amount" min="0">
          </div>
        </div>
        <button type="button" class="add-attack-btn" onclick="addAttackRow()">+ Add Another Attack</button>
      </div>

      <!-- Damage Taken Section -->
      <div class="stats-form-section">
        <h4>🛡️ Damage Taken</h4>
        <input type="number" class="form-input" name="damageTaken" placeholder="Damage Amount" min="0">
        <input type="text" class="form-input" name="damageSource" placeholder="Source of Damage">
      </div>

      <!-- Healing Section -->
      <div class="stats-form-section">
        <h4>💚 Healing</h4>
        <div class="healing-toggle">
          <label><input type="radio" name="healingType" value="self"> Self Healing</label>
          <label><input type="radio" name="healingType" value="other"> Healed by Others</label>
        </div>
        <input type="number" class="form-input" name="healingAmount" placeholder="Healing Amount" min="0">
        <input type="text" class="form-input" name="healingSource" placeholder="Healing Source/Healer">
      </div>

      <!-- Magic Section -->
      <div class="stats-form-section">
        <h4>✨ Magic/Spells</h4>
        <div class="magic-inputs" id="magicInputs">
          <div class="magic-row" data-magic-index="0">
            <div class="attack-header">
              <h5>Spell 1</h5>
              <button type="button" class="remove-attack-btn" onclick="removeMagicRow(0)" style="display: none;">×</button>
            </div>
            <input type="text" class="form-input" name="spellName_0" placeholder="Spell Name">
            <input type="number" class="form-input" name="spellAttacks_0" placeholder="Number of Attacks" min="0">
            <input type="number" class="form-input" name="spellDamage_0" placeholder="Total Damage" min="0">
            <input type="text" class="form-input" name="spellNotes_0" placeholder="Notes/Targets">
          </div>
        </div>
        <button type="button" class="add-magic-btn" onclick="addMagicRow()">+ Add Another Spell</button>
      </div>

      <!-- Actions Section -->
      <div class="stats-form-section full-width">
        <h4>🎯 Actions Taken</h4>
        <div class="actions-list" id="actionsList">
          <div class="action-item">
            <input type="text" class="form-input" name="action_0" placeholder="Describe action taken">
            <button type="button" class="remove-action-btn" onclick="removeActionRow(0)" style="display: none;">×</button>
          </div>
        </div>
        <button type="button" class="add-action-btn" onclick="addActionRow()">+ Add Another Action</button>
      </div>
    </div>
  `;
}

// Attack row management functions
let attackCount = 1;

/**
 * Add a new attack input row
 */
window.addAttackRow = function () {
  const attackInputs = document.getElementById("attackInputs");
  const newAttackRow = document.createElement("div");
  newAttackRow.className = "attack-row";
  newAttackRow.setAttribute("data-attack-index", attackCount);

  newAttackRow.innerHTML = `
    <div class="attack-header">
      <h5>Attack ${attackCount + 1}</h5>
      <button type="button" class="remove-attack-btn" onclick="removeAttackRow(${attackCount})">×</button>
    </div>
    <select class="form-select attack-target" name="target_${attackCount}">
      <option value="">Select Target</option>
      ${generateTargetOptions()}
    </select>
    <input type="number" class="form-input attack-damage" name="damage_${attackCount}" placeholder="Damage Amount" min="0">
  `;

  attackInputs.appendChild(newAttackRow);
  attackCount++;

  // Show remove buttons for all attacks if there's more than one
  updateRemoveButtonVisibility("attackInputs", ".remove-attack-btn");
};

/**
 * Remove an attack input row
 */
window.removeAttackRow = function (index) {
  const attackRow = document.querySelector(`[data-attack-index="${index}"]`);
  if (attackRow) {
    attackRow.remove();

    // Renumber remaining attacks
    renumberAttackRows();

    // Update remove button visibility
    updateRemoveButtonVisibility("attackInputs", ".remove-attack-btn");
  }
};

/**
 * Renumber attack rows after removal
 */
function renumberAttackRows() {
  const attackRows = document.querySelectorAll("#attackInputs .attack-row");
  attackCount = attackRows.length;

  attackRows.forEach((row, index) => {
    row.setAttribute("data-attack-index", index);

    // Update header
    const header = row.querySelector("h5");
    if (header) {
      header.textContent = `Attack ${index + 1}`;
    }

    // Update remove button onclick
    const removeBtn = row.querySelector(".remove-attack-btn");
    if (removeBtn) {
      removeBtn.setAttribute("onclick", `removeAttackRow(${index})`);
    }

    // Update input names
    const targetSelect = row.querySelector(".attack-target");
    const damageInput = row.querySelector(".attack-damage");

    if (targetSelect) {
      targetSelect.name = `target_${index}`;
    }
    if (damageInput) {
      damageInput.name = `damage_${index}`;
    }
  });
}

// Magic row management functions
let magicCount = 1;

/**
 * Add a new magic input row
 */
window.addMagicRow = function () {
  const magicInputs = document.getElementById("magicInputs");
  const newMagicRow = document.createElement("div");
  newMagicRow.className = "magic-row";
  newMagicRow.setAttribute("data-magic-index", magicCount);

  newMagicRow.innerHTML = `
    <div class="attack-header">
      <h5>Spell ${magicCount + 1}</h5>
      <button type="button" class="remove-attack-btn" onclick="removeMagicRow(${magicCount})">×</button>
    </div>
    <input type="text" class="form-input" name="spellName_${magicCount}" placeholder="Spell Name">
    <input type="number" class="form-input" name="spellAttacks_${magicCount}" placeholder="Number of Attacks" min="0">
    <input type="number" class="form-input" name="spellDamage_${magicCount}" placeholder="Total Damage" min="0">
    <input type="text" class="form-input" name="spellNotes_${magicCount}" placeholder="Notes/Targets">
  `;

  magicInputs.appendChild(newMagicRow);
  magicCount++;

  // Show remove buttons for all spells if there's more than one
  updateRemoveButtonVisibility("magicInputs", ".remove-attack-btn");
};

/**
 * Remove a magic input row
 */
window.removeMagicRow = function (index) {
  const magicRow = document.querySelector(`[data-magic-index="${index}"]`);
  if (magicRow) {
    magicRow.remove();

    // Renumber remaining spells
    renumberMagicRows();

    // Update remove button visibility
    updateRemoveButtonVisibility("magicInputs", ".remove-attack-btn");
  }
};

/**
 * Renumber magic rows after removal
 */
function renumberMagicRows() {
  const magicRows = document.querySelectorAll("#magicInputs .magic-row");
  magicCount = magicRows.length;

  magicRows.forEach((row, index) => {
    row.setAttribute("data-magic-index", index);

    // Update header
    const header = row.querySelector("h5");
    if (header) {
      header.textContent = `Spell ${index + 1}`;
    }

    // Update remove button onclick
    const removeBtn = row.querySelector(".remove-attack-btn");
    if (removeBtn) {
      removeBtn.setAttribute("onclick", `removeMagicRow(${index})`);
    }

    // Update input names
    const inputs = row.querySelectorAll("input");
    inputs.forEach((input) => {
      const namePrefix = input.name.split("_")[0];
      input.name = `${namePrefix}_${index}`;
    });
  });
}

// Action row management functions
let actionCount = 1;

/**
 * Add a new action input row
 */
window.addActionRow = function () {
  const actionsList = document.getElementById("actionsList");
  const newActionItem = document.createElement("div");
  newActionItem.className = "action-item";
  newActionItem.setAttribute("data-action-index", actionCount);

  newActionItem.innerHTML = `
    <input type="text" class="form-input" name="action_${actionCount}" placeholder="Describe action taken">
    <button type="button" class="remove-action-btn" onclick="removeActionRow(${actionCount})">×</button>
  `;

  actionsList.appendChild(newActionItem);
  actionCount++;

  // Show remove buttons for all actions if there's more than one
  updateRemoveButtonVisibility("actionsList", ".remove-action-btn");
};

/**
 * Remove an action input row
 */
window.removeActionRow = function (index) {
  const actionItem = document.querySelector(`[data-action-index="${index}"]`);
  if (actionItem) {
    actionItem.remove();

    // Renumber remaining actions
    renumberActionRows();

    // Update remove button visibility
    updateRemoveButtonVisibility("actionsList", ".remove-action-btn");
  }
};

/**
 * Renumber action rows after removal
 */
function renumberActionRows() {
  const actionItems = document.querySelectorAll("#actionsList .action-item");
  actionCount = actionItems.length;

  actionItems.forEach((item, index) => {
    item.setAttribute("data-action-index", index);

    // Update remove button onclick
    const removeBtn = item.querySelector(".remove-action-btn");
    if (removeBtn) {
      removeBtn.setAttribute("onclick", `removeActionRow(${index})`);
    }

    // Update input name
    const input = item.querySelector("input");
    if (input) {
      input.name = `action_${index}`;
    }
  });
}

/**
 * Update visibility of remove buttons based on number of items
 */
function updateRemoveButtonVisibility(containerId, buttonSelector) {
  const container = document.getElementById(containerId);
  const removeButtons = container.querySelectorAll(buttonSelector);

  // Hide remove buttons if there's only one item, show them otherwise
  removeButtons.forEach((button) => {
    button.style.display = removeButtons.length > 1 ? "block" : "none";
  });
}

/**
 * Reset form counters when opening stats modal
 */
function resetFormCounters() {
  attackCount = 1;
  magicCount = 1;
  actionCount = 1;
}

/**
 * Collect form data from the stats form
 */
function collectFormData() {
  const form = document.getElementById("statsForm");
  if (!form) return null;

  const formData = {
    attacks: [],
    damageTaken: { amount: 0, source: "" },
    healing: { type: "self", amount: 0, healer: "" },
    magic: [],
    actions: [],
  };

  // Collect attack data
  const attackRows = form.querySelectorAll(".attack-row");
  attackRows.forEach((row) => {
    const target = row.querySelector(".attack-target")?.value || "";
    const damage = parseInt(row.querySelector(".attack-damage")?.value) || 0;

    if (target || damage > 0) {
      formData.attacks.push({
        targetName: target,
        damage: damage,
        attackName: "Attack",
      });
    }
  });

  // Collect damage taken
  const damageTaken =
    parseInt(form.querySelector("[name='damageTaken']")?.value) || 0;
  const damageSource = form.querySelector("[name='damageSource']")?.value || "";

  if (damageTaken > 0) {
    formData.damageTaken = { amount: damageTaken, source: damageSource };
  }

  // Collect healing data
  const healingType =
    form.querySelector("[name='healingType']:checked")?.value || "self";
  const healingAmount =
    parseInt(form.querySelector("[name='healingAmount']")?.value) || 0;
  const healerName = form.querySelector("[name='healingSource']")?.value || "";

  if (healingAmount > 0) {
    formData.healing = {
      type: healingType,
      amount: healingAmount,
      healer: healerName,
    };
  }

  // Collect magic data
  const magicRows = form.querySelectorAll(".magic-row");
  magicRows.forEach((row) => {
    const spellName = row.querySelector("[name^='spellName_']")?.value || "";
    const numberOfAttacks =
      parseInt(row.querySelector("[name^='spellAttacks_']")?.value) || 0;
    const totalDamage =
      parseInt(row.querySelector("[name^='spellDamage_']")?.value) || 0;
    const notes = row.querySelector("[name^='spellNotes_']")?.value || "";

    if (spellName && totalDamage > 0) {
      formData.magic.push({
        spellName: spellName,
        numberOfAttacks: numberOfAttacks,
        totalDamage: totalDamage,
        notes: notes,
      });
    }
  });

  // Collect action data
  const actionItems = form.querySelectorAll(".action-item");
  actionItems.forEach((item) => {
    const actionDescription = item.querySelector("input")?.value || "";
    if (actionDescription) {
      formData.actions.push(actionDescription);
    }
  });

  return formData;
}

/**
 * Validate form data
 */
function validateFormData(formData) {
  if (!formData) {
    console.error("No form data to validate");
    return false;
  }
  return true;
}

/**
 * Update all displays after stats change
 */
function updateAllDisplays() {
  populatePlayersGrid();
  populateNPCsGrid();
  populateMonstersGrid();
  updateInitiativeEffects();
  updateInitiativeDisplay();
  updateRoundDisplay();
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

// Global function declarations for HTML onclick handlers
window.saveStatsForm = saveStatsForm;
window.closeStatsModal = closeStatsModal;
window.addAttackRow = addAttackRow;
window.removeAttackRow = removeAttackRow;
window.addMagicRow = addMagicRow;
window.removeMagicRow = removeMagicRow;
window.addActionRow = addActionRow;
window.removeActionRow = removeActionRow;

/**
 * Update dead characters to have initiative 0
 */
function updateDeadCharacterInitiatives() {
  [...players, ...npcs, ...monsters].forEach((character) => {
    if (character.isDead) {
      character.initiative = 0;
    }
  });
}

/**
 * Get all initiative values from alive characters, sorted in descending order
 */
function getAllInitiativeValues() {
  const allCharacters = [...players, ...npcs, ...monsters];
  return allCharacters
    .filter((char) => !char.isDead && char.initiative > 0)
    .map((char) => char.initiative)
    .sort((a, b) => b - a)
    .filter((value, index, arr) => arr.indexOf(value) === index); // Remove duplicates
}

/**
 * Update visual effects based on current initiative
 */
function updateInitiativeEffects() {
  // Remove existing initiative classes
  document.querySelectorAll(".card").forEach((card) => {
    card.classList.remove("current-turn", "upcoming-turn");
  });

  // Apply current turn highlighting
  const allCharacters = [...players, ...npcs, ...monsters];
  allCharacters.forEach((character) => {
    if (character.initiative === currentInitiative && !character.isDead) {
      const characterName = getCharacterName(
        character,
        getCharacterType(character)
      );
      const cards = document.querySelectorAll(".card");

      cards.forEach((card) => {
        const cardName = card.querySelector(".character-name")?.textContent;
        if (cardName === characterName) {
          card.classList.add("current-turn");
        }
      });
    }
  });
}

/**
 * Move to previous initiative count
 */
function previousInitiative() {
  const initiativeValues = getAllInitiativeValues();
  const currentIndex = initiativeValues.indexOf(currentInitiative);

  if (currentIndex > 0) {
    // Move to next higher initiative value
    currentInitiative = initiativeValues[currentIndex - 1];
  } else {
    // At the highest initiative - go to previous round and set to lowest initiative
    if (currentRound > 1) {
      currentRound--;
      currentInitiative =
        initiativeValues.length > 0
          ? initiativeValues[initiativeValues.length - 1]
          : 1;
      updateRoundDisplay();
    }
  }

  updateInitiativeEffects();
  updateInitiativeDisplay();
}

/**
 * Reset initiative to the highest value
 */
function resetInitiative() {
  const initiativeValues = getAllInitiativeValues();
  currentInitiative = initiativeValues.length > 0 ? initiativeValues[0] : 20;
  updateInitiativeEffects();
  updateInitiativeDisplay();
}

/**
 * Move to the next round
 */
function nextRound() {
  currentRound++;
  const initiativeValues = getAllInitiativeValues();
  currentInitiative = initiativeValues.length > 0 ? initiativeValues[0] : 20;

  // Clear turn tracking for new round
  clearTurnTracking();

  updateInitiativeEffects();
  updateInitiativeDisplay();
  updateRoundDisplay();
}

/**
 * Move to the previous round
 */
function previousRound() {
  if (currentRound > 1) {
    currentRound--;
    const initiativeValues = getAllInitiativeValues();
    currentInitiative = initiativeValues.length > 0 ? initiativeValues[0] : 20;

    // Clear turn tracking when round changes
    clearTurnTracking();

    updateInitiativeEffects();
    updateInitiativeDisplay();
    updateRoundDisplay();
  }
}

/**
 * Generate target options for attack dropdowns
 */
function generateTargetOptions() {
  const allCharacters = [...players, ...npcs, ...monsters];
  const aliveCharacters = allCharacters.filter((char) => !char.isDead);

  return aliveCharacters
    .map((char) => {
      const name = getCharacterName(char, getCharacterType(char));
      return `<option value="${name}">${name}</option>`;
    })
    .join("");
}

/**
 * Setup dropdown event listeners
 */
function setupDropdownListeners() {
  // Add dropdown functionality if needed
  // This function can be expanded based on your dropdown requirements
  console.log("Setting up dropdown listeners...");
}

/**
 * Save data to file (placeholder function)
 */
function saveDataToFile() {
  const gameData = {
    players,
    npcs,
    monsters,
    currentRound,
    currentInitiative,
  };

  const dataStr = JSON.stringify(gameData, null, 2);
  const dataBlob = new Blob([dataStr], { type: "application/json" });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(dataBlob);
  link.download = `dnd-session-round-${currentRound}.json`;
  link.click();

  console.log("Game data saved");
}
