// Players data
const players = [
  {
    playerName: "Alex",
    characterName: "Thorin Ironbeard",
    maxHps: 45,
    currentHps: 38,
    initiative: 16,
    isDead: false,
    roundStats: [
      {
        roundId: 1,
        attacks: [
          {
            noOfAttacks: 2,
            damageDealt: [
              { name: "Battleaxe", amount: 12 },
              { name: "Bonus Attack", amount: 8 },
            ],
            damageTaken: [{ name: "Orc Scimitar", amount: 7 }],
            healingDealt: [],
            healingTaken: [],
            actions: [{ action: "Action Surge" }, { action: "Second Wind" }],
          },
        ],
        killingBlows: ["Goblin Scout"],
      },
    ],
  },
  {
    playerName: "Sarah",
    characterName: "Luna Starweaver",
    maxHps: 32,
    currentHps: 32,
    initiative: 14,
    isDead: false,
    roundStats: [
      {
        roundId: 1,
        attacks: [
          {
            noOfAttacks: 1,
            damageDealt: [{ name: "Fireball", amount: 28 }],
            damageTaken: [],
            healingDealt: [{ name: "Cure Wounds", amount: 9 }],
            healingTaken: [],
            actions: [
              { action: "Cast Fireball" },
              { action: "Healing Word on Thorin" },
            ],
          },
        ],
        killingBlows: ["Orc Warrior", "Orc Shaman"],
      },
    ],
  },
  {
    playerName: "Mike",
    characterName: "Shadow",
    maxHps: 28,
    currentHps: 21,
    initiative: 18,
    isDead: false,
    roundStats: [
      {
        roundId: 1,
        attacks: [
          {
            noOfAttacks: 2,
            damageDealt: [
              { name: "Sneak Attack", amount: 15 },
              { name: "Dagger Offhand", amount: 4 },
            ],
            damageTaken: [
              { name: "Goblin Arrow", amount: 5 },
              { name: "Trap Damage", amount: 2 },
            ],
            healingDealt: [],
            healingTaken: [{ name: "Healing Potion", amount: 7 }],
            actions: [{ action: "Hide" }, { action: "Cunning Action" }],
          },
        ],
        killingBlows: [],
      },
    ],
  },
];

// NPCs data
const npcs = [
  {
    npcName: "Captain Aldric",
    npcRace: "Human",
    maxHps: 58,
    currentHps: 58,
    initiative: 12,
    isDead: false,
    roundStats: [
      {
        roundId: 1,
        attacks: [
          {
            noOfAttacks: 1,
            damageDealt: [{ name: "Longsword", amount: 10 }],
            damageTaken: [],
            healingDealt: [],
            healingTaken: [],
            actions: [{ action: "Rally Troops" }, { action: "Shield Wall" }],
          },
        ],
        killingBlows: [],
      },
    ],
  },
  {
    npcName: "Elara Moonwhisper",
    npcRace: "Elf",
    maxHps: 27,
    currentHps: 27,
    initiative: 15,
    isDead: false,
    roundStats: [
      {
        roundId: 1,
        attacks: [
          {
            noOfAttacks: 1,
            damageDealt: [],
            damageTaken: [],
            healingDealt: [{ name: "Mass Cure Wounds", amount: 15 }],
            healingTaken: [],
            actions: [
              { action: "Cast Mass Cure Wounds" },
              { action: "Bless Party" },
            ],
          },
        ],
        killingBlows: [],
      },
    ],
  },
  {
    npcName: "Grimjaw the Merchant",
    npcRace: "Halfling",
    maxHps: 18,
    currentHps: 18,
    initiative: 8,
    isDead: false,
    roundStats: [
      {
        roundId: 1,
        attacks: [
          {
            noOfAttacks: 0,
            damageDealt: [],
            damageTaken: [],
            healingDealt: [],
            healingTaken: [],
            actions: [
              { action: "Hide behind cover" },
              { action: "Call for help" },
            ],
          },
        ],
        killingBlows: [],
      },
    ],
  },
];

// Monsters data
const monsters = [
  {
    npcType: "Orc Berserker",
    maxHps: 67,
    currentHps: 23,
    initiative: 13,
    isDead: false,
    roundStats: [
      {
        roundId: 1,
        attacks: [
          {
            noOfAttacks: 2,
            damageDealt: [
              { name: "Greataxe", amount: 13 },
              { name: "Rage Bite", amount: 6 },
            ],
            damageTaken: [
              { name: "Fireball", amount: 28 },
              { name: "Battleaxe", amount: 12 },
              { name: "Sneak Attack", amount: 15 },
            ],
            healingDealt: [],
            healingTaken: [],
            actions: [{ action: "Rage" }, { action: "Reckless Attack" }],
          },
        ],
        killingBlows: [],
      },
    ],
  },
  {
    npcType: "Ancient Red Dragon",
    maxHps: 546,
    currentHps: 546,
    initiative: 10,
    isDead: false,
    roundStats: [
      {
        roundId: 1,
        attacks: [
          {
            noOfAttacks: 1,
            damageDealt: [{ name: "Fire Breath", amount: 91 }],
            damageTaken: [],
            healingDealt: [],
            healingTaken: [],
            actions: [
              { action: "Fire Breath (Recharge 5-6)" },
              { action: "Frightful Presence" },
            ],
          },
        ],
        killingBlows: [],
      },
    ],
  },
  {
    npcType: "Goblin Archer",
    maxHps: 7,
    currentHps: 0,
    initiative: 14,
    isDead: true,
    roundStats: [
      {
        roundId: 1,
        attacks: [
          {
            noOfAttacks: 1,
            damageDealt: [{ name: "Shortbow", amount: 5 }],
            damageTaken: [{ name: "Sneak Attack", amount: 15 }],
            healingDealt: [],
            healingTaken: [],
            actions: [{ action: "Aimed Shot" }],
          },
        ],
        killingBlows: [],
      },
    ],
  },
];

// Global variables
let currentCarouselIndex = 0;
let sortedPlayers = [];
let currentInitiative = 20; // Current initiative count for the round
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
  // Sort players by initiative (descending order)
  sortedPlayers = [...players].sort((a, b) => b.initiative - a.initiative);

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
        
        ${
          lastRoundStats
            ? `
            <h3>Round ${lastRoundStats.roundId} Stats:</h3>
            ${lastRoundStats.attacks
              .map(
                (attack) => `
                <div style="margin: 15px 0; padding: 15px; background-color: var(--bg-tertiary); border-radius: 8px;">
                    <strong>Attacks Made:</strong> ${attack.noOfAttacks}<br>
                    
                    ${
                      attack.damageDealt.length > 0
                        ? `
                        <strong>Damage Dealt:</strong><br>
                        ${attack.damageDealt
                          .map((dmg) => `• ${dmg.name}: ${dmg.amount}`)
                          .join("<br>")}
                    `
                        : ""
                    }
                    
                    ${
                      attack.damageTaken.length > 0
                        ? `
                        <br><strong>Damage Taken:</strong><br>
                        ${attack.damageTaken
                          .map((dmg) => `• ${dmg.name}: ${dmg.amount}`)
                          .join("<br>")}
                    `
                        : ""
                    }
                    
                    ${
                      attack.healingDealt.length > 0
                        ? `
                        <br><strong>Healing Dealt:</strong><br>
                        ${attack.healingDealt
                          .map((heal) => `• ${heal.name}: ${heal.amount}`)
                          .join("<br>")}
                    `
                        : ""
                    }
                    
                    ${
                      attack.healingTaken.length > 0
                        ? `
                        <br><strong>Healing Received:</strong><br>
                        ${attack.healingTaken
                          .map((heal) => `• ${heal.name}: ${heal.amount}`)
                          .join("<br>")}
                    `
                        : ""
                    }
                    
                    ${
                      attack.actions.length > 0
                        ? `
                        <br><strong>Actions:</strong><br>
                        ${attack.actions
                          .map((action) => `• ${action.action}`)
                          .join("<br>")}
                    `
                        : ""
                    }
                </div>
            `
              )
              .join("")}
            
            ${
              lastRoundStats.killingBlows.length > 0
                ? `
                <div style="margin: 15px 0; padding: 15px; background-color: var(--dead-color); border-radius: 8px;">
                    <strong>Killing Blows:</strong><br>
                    ${lastRoundStats.killingBlows
                      .map((kill) => `• ${kill}`)
                      .join("<br>")}
                </div>
            `
                : ""
            }
        `
            : "<p>No round stats available.</p>"
        }
    `;

  modal.style.display = "block";
}

/**
 * Close the character details modal and hide it from view
 */
function closeModal() {
  document.getElementById("characterModal").style.display = "none";
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
 * Advance to the next initiative count
 */
function nextInitiative() {
  if (currentInitiative > 1) {
    currentInitiative--;
    updateInitiativeEffects();
    updateInitiativeDisplay();
  }
}

/**
 * Go back to the previous initiative count
 */
function previousInitiative() {
  if (currentInitiative < 20) {
    currentInitiative++;
    updateInitiativeEffects();
    updateInitiativeDisplay();
  }
}

/**
 * Reset initiative to the beginning of the round
 */
function resetInitiative() {
  currentInitiative = 20;
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
