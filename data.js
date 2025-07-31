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
  {
    playerName: "Gio",
    characterName: "Reverant Tanglespur",
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
    playerName: "Paul",
    characterName: "Blimey",
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
    playerName: "Jon",
    characterName: "Quicken the Rogue",
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
    initiative: 0, // Dead characters have initiative 0
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

// Export the data arrays
export { players, npcs, monsters };
