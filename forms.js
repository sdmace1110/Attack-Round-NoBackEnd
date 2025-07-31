/**
 * Import data and functions from other modules
 */
import { players, npcs, monsters } from "./data.js";
import { 
  updateAllDisplays, 
  getCurrentRound, 
  getCurrentInitiative, 
  getCharacterName, 
  getAllTargets, 
  getCharacterType, 
  applyDamageToTarget, 
  applyHealingToTarget 
} from "./script.js";

/**
 * Set up form-related event listeners
 */
export function setupFormEventListeners() {
  // Modal events
  const closeModal = document.querySelector(".close");
  const characterModal = document.getElementById("characterModal");
  
  if (closeModal) {
    closeModal.addEventListener("click", handleCloseModal);
  }
  
  if (characterModal) {
    characterModal.addEventListener("click", handleModalBackgroundClick);
  }
  
  // Stats form events (using event delegation)
  document.addEventListener("click", handleFormButtonClick);
  document.addEventListener("change", handleFormInputChange);
}

/**
 * Handle modal close button click
 */
function handleCloseModal() {
  const characterModal = document.getElementById("characterModal");
  if (characterModal) {
    characterModal.style.display = "none";
  }
  
  const statsModal = document.getElementById("statsModal");
  if (statsModal) {
    statsModal.style.display = "none";
  }
}

/**
 * Handle modal background click to close
 */
function handleModalBackgroundClick(event) {
  if (event.target.id === "characterModal") {
    handleCloseModal();
  }
}

/**
 * Handle form button clicks using event delegation
 */
function handleFormButtonClick(event) {
  const target = event.target;
  
  if (target.id === "add-attack-btn") {
    addNewAttack();
  } else if (target.classList.contains("remove-attack-btn")) {
    const attackIndex = parseInt(target.dataset.attackIndex);
    removeAttack(attackIndex);
  } else if (target.id === "add-action-btn") {
    addNewAction();
  } else if (target.classList.contains("remove-action-btn")) {
    const actionIndex = parseInt(target.dataset.actionIndex);
    removeAction(actionIndex);
  } else if (target.id === "add-magic-btn") {
    addNewMagic();
  } else if (target.classList.contains("remove-magic-btn")) {
    const magicIndex = parseInt(target.dataset.magicIndex);
    removeMagic(magicIndex);
  } else if (target.id === "save-stats-btn") {
    saveStatsForm();
  } else if (target.id === "cancel-stats-btn") {
    closeStatsModal();
  }
}

/**
 * Handle form input changes
 */
function handleFormInputChange(event) {
  const target = event.target;
  
  if (target.name === "healing-type") {
    toggleHealerNameGroup(target.value);
  }
}

/**
 * Toggle healer name group visibility
 */
function toggleHealerNameGroup(healingType) {
  const healerGroup = document.getElementById("healer-name-group");
  if (healerGroup) {
    healerGroup.style.display = healingType === "others" ? "block" : "none";
  }
}

/**
 * Show stats modal for character
 */
export function showStatsModal(character, type) {
  window.currentStatsCharacter = character;
  window.currentStatsType = type;

  let statsModal = document.getElementById("statsModal");
  if (!statsModal) {
    statsModal = document.createElement("div");
    statsModal.id = "statsModal";
    statsModal.className = "modal";
    statsModal.innerHTML = `
      <div class="modal-content">
        <span class="close" onclick="closeStatsModal()">&times;</span>
        <div id="statsModalBody">
          <!-- Form content will be populated here -->
        </div>
      </div>
    `;
    document.body.appendChild(statsModal);
  }

  const statsModalBody = document.getElementById("statsModalBody");
  const characterName = getCharacterName(character, type);
  const currentRound = getCurrentRound();
  const allTargets = getAllTargets();

  const formData = {
    attacks: [{ targetName: "", damage: 0 }],
    damageTaken: 0,
    healingType: "self",
    healingAmount: 0,
    healerName: "",
    magic: [{ spellName: "", numberOfAttacks: 1, totalDamage: 0, notes: "" }],
    actions: [""]
  };

  statsModalBody.innerHTML = generateStatsForm(characterName, allTargets, formData);
  statsModal.style.display = "block";
}

/**
 * Close stats modal
 */
export function closeStatsModal() {
  const statsModal = document.getElementById("statsModal");
  if (statsModal) {
    statsModal.style.display = "none";
  }
}

/**
 * Generate the complete stats form HTML
 */
function generateStatsForm(characterName, allTargets, formData) {
  const currentRound = getCurrentRound();
  
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
             style="display: ${formData.healingType === "others" ? "block" : "none"}">
          <label for="healer-name">Healer Name</label>
          <input type="text" id="healer-name" class="form-input" 
                 value="${formData.healerName}" placeholder="Who provided the healing?">
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
  return attacks.map((attack, index) => `
    <div class="attack-inputs" data-attack-index="${index}">
      <div class="attack-header">
        <h5>Attack ${index + 1}</h5>
        ${attacks.length > 1 ? 
          `<button type="button" class="remove-attack-btn" data-attack-index="${index}">Remove</button>` : ""}
      </div>
      <div class="attack-row">
        <div class="form-group">
          <label>Target</label>
          <select class="form-select attack-target">
            <option value="">Select Target</option>
            ${allTargets.map(target => 
              `<option value="${target.name}" data-type="${target.type}" 
                 ${target.name === attack.targetName ? "selected" : ""}>
                 ${target.name} (${target.type})
               </option>`
            ).join("")}
          </select>
        </div>
        <div class="form-group">
          <label>Damage</label>
          <input type="number" class="form-input attack-damage" 
                 value="${attack.damage}" placeholder="0" min="0">
        </div>
      </div>
    </div>
  `).join("");
}

/**
 * Generate action input HTML
 */
function generateActionInputs(actions) {
  return actions.map((action, index) => `
    <div class="action-item" data-action-index="${index}">
      <input type="text" class="form-input action-text" 
             value="${action}" placeholder="Describe action taken">
      ${actions.length > 1 ? 
        `<button type="button" class="remove-action-btn" data-action-index="${index}">Remove</button>` : ""}
    </div>
  `).join("");
}

/**
 * Generate magic input HTML
 */
function generateMagicInputs(magicSpells) {
  return magicSpells.map((spell, index) => `
    <div class="magic-inputs" data-magic-index="${index}">
      <div class="magic-header">
        <h5>Spell ${index + 1}</h5>
        ${magicSpells.length > 1 ? 
          `<button type="button" class="remove-magic-btn" data-magic-index="${index}">Remove</button>` : ""}
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
               value="${spell.notes}" placeholder="List people affected by the spell">
      </div>
    </div>
  `).join("");
}

/**
 * Add new attack input
 */
function addNewAttack() {
  const container = document.getElementById("attacks-container");
  const allTargets = getAllTargets();
  const currentAttacks = container.querySelectorAll(".attack-inputs").length;

  const newAttackHTML = generateAttackInputs([{ targetName: "", damage: 0 }], allTargets);
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = newAttackHTML;
  const newAttackElement = tempDiv.firstElementChild;
  newAttackElement.dataset.attackIndex = currentAttacks;

  container.appendChild(newAttackElement);
}

/**
 * Remove attack input
 */
function removeAttack(attackIndex) {
  const container = document.getElementById("attacks-container");
  const attacks = container.querySelectorAll(".attack-inputs");

  if (attacks.length > 1) {
    attacks[attackIndex].remove();
    
    const remainingAttacks = container.querySelectorAll(".attack-inputs");
    remainingAttacks.forEach((attack, index) => {
      attack.dataset.attackIndex = index;
      const header = attack.querySelector("h5");
      header.textContent = `Attack ${index + 1}`;
    });
  }
}

/**
 * Add new action input
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
 * Remove action input
 */
function removeAction(actionIndex) {
  const container = document.getElementById("actions-container");
  const actions = container.querySelectorAll(".action-item");

  if (actions.length > 1) {
    actions[actionIndex].remove();
    
    const remainingActions = container.querySelectorAll(".action-item");
    remainingActions.forEach((action, index) => {
      action.dataset.actionIndex = index;
    });
  }
}

/**
 * Add new magic input
 */
function addNewMagic() {
  const container = document.getElementById("magic-container");
  const currentMagic = container.querySelectorAll(".magic-inputs").length;

  const newMagicHTML = generateMagicInputs([{ spellName: "", numberOfAttacks: 1, totalDamage: 0, notes: "" }]);
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = newMagicHTML;
  const newMagicElement = tempDiv.firstElementChild;
  newMagicElement.dataset.magicIndex = currentMagic;

  container.appendChild(newMagicElement);
}

/**
 * Remove magic input
 */
function removeMagic(magicIndex) {
  const container = document.getElementById("magic-container");
  const magicInputs = container.querySelectorAll(".magic-inputs");

  if (magicInputs.length > 1) {
    magicInputs[magicIndex].remove();
    
    const remainingMagic = container.querySelectorAll(".magic-inputs");
    remainingMagic.forEach((magic, index) => {
      magic.dataset.magicIndex = index;
      const header = magic.querySelector("h5");
      header.textContent = `Spell ${index + 1}`;
    });
  }
}

/**
 * Save stats form
 */
function saveStatsForm() {
  const character = window.currentStatsCharacter;
  const type = window.currentStatsType;

  if (!character) {
    console.error("No character data available");
    return;
  }

  const formData = collectFormData();

  if (!validateFormData(formData)) {
    return;
  }

  updateCharacterRoundStats(character, type, formData);
  updateAllDisplays();

  console.log(`Stats saved for ${getCharacterName(character, type)} - Round ${getCurrentRound()}`, formData);
  closeStatsModal();
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

  const attackContainers = document.querySelectorAll(".attack-inputs");
  attackContainers.forEach((container) => {
    const targetName = container.querySelector(".attack-target").value;
    const damage = parseInt(container.querySelector(".attack-damage").value) || 0;

    if (targetName || damage > 0) {
      data.attacks.push({ targetName, damage });
    }
  });

  const damageTaken = parseInt(document.getElementById("damage-taken").value) || 0;
  const damageSource = document.getElementById("damage-source").value;
  data.damageTaken = { amount: damageTaken, source: damageSource };

  const healingType = document.querySelector('input[name="healing-type"]:checked').value;
  const healingAmount = parseInt(document.getElementById("healing-amount").value) || 0;
  const healerName = document.getElementById("healer-name").value;

  data.healing = {
    type: healingType,
    amount: healingAmount,
    healer: healerName,
  };

  const magicContainers = document.querySelectorAll(".magic-inputs");
  magicContainers.forEach((container) => {
    const spellName = container.querySelector(".spell-name").value;
    const numberOfAttacks = parseInt(container.querySelector(".spell-attacks").value) || 0;
    const totalDamage = parseInt(container.querySelector(".spell-damage").value) || 0;
    const notes = container.querySelector(".spell-notes").value;

    if (spellName || numberOfAttacks > 0 || totalDamage > 0) {
      data.magic.push({ spellName, numberOfAttacks, totalDamage, notes });
    }
  });

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
  const hasAttacks = data.attacks.length > 0 && data.attacks.some((attack) => attack.damage > 0);
  const hasDamage = data.damageTaken.amount > 0;
  const hasHealing = data.healing.amount > 0;
  const hasActions = data.actions.length > 0;
  const hasMagic = data.magic.length > 0 && data.magic.some((magic) => magic.totalDamage > 0 || magic.spellName);

  if (!hasAttacks && !hasDamage && !hasHealing && !hasActions && !hasMagic) {
    alert("Please enter at least one action, attack, damage taken, healing, or magic spell.");
    return false;
  }

  for (const attack of data.attacks) {
    if (attack.targetName && attack.damage <= 0) {
      alert(`Attack has a target but no damage specified.`);
      return false;
    }
  }

  return true;
}

/**
 * Update character's round stats with form data
 */
function updateCharacterRoundStats(character, type, formData) {
  const currentRound = getCurrentRound();
  
  let roundStats = character.roundStats.find((rs) => rs.roundId === currentRound);

  if (!roundStats) {
    roundStats = {
      roundId: currentRound,
      attacks: [],
      killingBlows: [],
    };
    character.roundStats.push(roundStats);
  }

  const attackEntry = {
    noOfAttacks: formData.attacks.length,
    damageDealt: [],
    damageTaken: [],
    healingDealt: [],
    healingTaken: [],
    actions: formData.actions.map((action) => ({ action })),
  };

  formData.attacks.forEach((attack) => {
    if (attack.damage > 0) {
      attackEntry.damageDealt.push({
        name: attack.targetName || "Unknown Target",
        amount: attack.damage,
      });

      if (attack.targetName) {
        applyDamageToTarget(attack.targetName, attack.damage, character);
      }
    }
  });

  if (formData.damageTaken.amount > 0) {
    attackEntry.damageTaken.push({
      name: formData.damageTaken.source || "Unknown",
      amount: formData.damageTaken.amount,
    });

    character.currentHps = Math.max(0, character.currentHps - formData.damageTaken.amount);

    if (character.currentHps === 0) {
      character.isDead = true;
      character.initiative = 0;
    }
  }

  if (formData.healing.amount > 0) {
    if (formData.healing.type === "self") {
      attackEntry.healingTaken.push({
        name: "Self Healing",
        amount: formData.healing.amount,
      });

      character.currentHps = Math.min(character.maxHps, character.currentHps + formData.healing.amount);
    } else if (formData.healing.type === "others") {
      attackEntry.healingDealt.push({
        name: formData.healing.healer ? `Healing to ${formData.healing.healer}` : "Healing Others",
        amount: formData.healing.amount,
      });
    }
  }

  if (formData.magic && formData.magic.length > 0) {
    formData.magic.forEach((magic) => {
      if (magic.totalDamage > 0) {
        attackEntry.damageDealt.push({
          name: magic.spellName || "Magic Spell",
          amount: magic.totalDamage,
        });
      }

      if (magic.spellName) {
        attackEntry.actions.push({
          action: `Cast ${magic.spellName}${magic.notes ? ` (${magic.notes})` : ""}`,
        });
      }
    });
  }

  roundStats.attacks.push(attackEntry);
}