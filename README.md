# 🎲 D&D Round Tracker

<div align="center">

**A comprehensive Single Page Application for Dungeon Masters**

_Track initiative, manage combat rounds, and record detailed character statistics_

[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)](https://www.javascript.com/)
[![CSS](https://img.shields.io/badge/CSS-Glassneomorphism-blue.svg)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

</div>

---

## ✨ Features

### 🎯 **Combat Management**

- **Initiative Tracking**: Automatic turn order based on character initiative values
- **Round Management**: Navigate between rounds with automatic initiative reset
- **Dead Character Handling**: Dead characters automatically set to initiative 0 and excluded from turn order
- **Visual Turn Indicators**: Golden glow for current turn, blur effect for upcoming characters

### 👥 **Character Management**

- **Three Character Types**: Players, NPCs, and Monsters with unique styling
- **Health Tracking**: Dynamic HP bars with color-coded health status
- **Status Indicators**: Visual badges for dead characters and viewed status
- **Detailed Character Modals**: Click any character for comprehensive stats

### 📊 **Statistics Tracking**

- **Round-by-Round Data**: Detailed combat statistics for each character
- **Attack Tracking**: Number of attacks, damage dealt/taken, targets
- **Healing Management**: Self-healing vs healing others with source tracking
- **Magic System**: Spell tracking with damage, notes, and affected targets
- **Action Logging**: Record all actions taken during combat
- **Killing Blow Tracking**: Automatically track when attacks result in character deaths

### 🎨 **Modern Interface**

- **Dark Theme**: Professional dark mode with high contrast
- **Glassneomorphism**: Modern frosted glass aesthetic with subtle shadows
- **Responsive Design**: Mobile-optimized layout with touch-friendly controls
- **Smooth Animations**: CSS transitions and hover effects throughout
- **Color-Coded Elements**: Green (Players), Yellow (NPCs), Red (Monsters)

---

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/dnd-round-tracker.git

# Navigate to the project directory
cd dnd-round-tracker/no_backend

# Open in your preferred browser
open index.html
```

### Sample Data

The app comes pre-loaded with sample characters:

**Players:**

- Shadow (Initiative 18) - Rogue with sneak attacks
- Thorin Ironbeard (Initiative 16) - Fighter with multiple attacks
- Luna Starweaver (Initiative 14) - Wizard with area spells

**NPCs:**

- Elara Moonwhisper (Initiative 15) - Elf healer
- Captain Aldric (Initiative 12) - Human guard captain
- Grimjaw the Merchant (Initiative 8) - Halfling non-combatant

**Monsters:**

- Goblin Archer (Initiative 14) - Ranged attacker (deceased)
- Orc Berserker (Initiative 13) - Heavily damaged melee fighter
- Ancient Red Dragon (Initiative 10) - Boss-level threat

## Usage Guide

### Basic Navigation

#### Initiative Management

1. **Current Initiative**: Displayed in header (starts at 20)
2. **Navigation**: Use [-] and [+] buttons to move through initiative order
3. **Reset**: Click "Reset" to return to initiative 20
4. **Visual Feedback**: Cards automatically highlight current turn

#### Round Tracking

1. **Current Round**: Displayed in header (starts at 1)
2. **Advance Round**: Use [+] button to go to next round
3. **Previous Round**: Use [-] button to go back

#### Character Interaction

1. **View Details**: Click any character card to open detailed modal
2. **Player Navigation**: Use arrow buttons to scroll through player carousel
3. **Export Data**: Click "Save" button to download JSON file

### Advanced Features

#### Character Cards Display

Each card shows:

- Character name and type-specific info
- Initiative value in a badge
- Current/Max HP with visual bar
- Combat statistics from current round
- Color-coded borders by character type

#### Modal Details

Character modals display:

- Complete character information
- Round-by-round combat history
- Damage dealt and taken
- Healing given and received
- Actions performed
- Killing blows achieved

#### Data Export

The Save button creates a timestamped JSON file containing:

- All character data
- Current round and initiative state
- Complete combat history
- Filename format: `dnd-round-tracker-YYYY-MM-DD.json`

## File Structure

```
/no_backend/
├── 📄 index.html          # Main application structure
├── 🎨 styles.css          # Complete styling with dark theme & glassneomorphism
├── ⚙️ script.js           # Main application logic and modal systems
├── 🎠 carousel.js         # Player carousel functionality and navigation
├── 🃏 cards.js            # Character card creation and display logic
├── 🎯 round.js            # Round and initiative management system
├── 📊 [data.js](http://_vscodecontentref_/0)             # Sample character data and exports
├── 📖 README.md           # This documentation file
└── 📋 prompts.md          # Comprehensive project documentation
```

## Technical Details

### Browser Compatibility

- **Modern Browsers**: Chrome 60+, Firefox 55+, Safari 12+, Edge 79+
- **Features Used**: ES6+ JavaScript, CSS Grid, CSS Custom Properties
- **No Dependencies**: Pure vanilla JavaScript, no frameworks required

### Data Structure

Characters are stored in three arrays (players, npcs, monsters) with the following structure:

```javascript
// Character Object Structure
{
  playerName: "Alex",                    // Player name (players only)
  characterName: "Thorin Ironbeard",     // Character name (players only)
  npcName: "Captain Aldric",             // NPC name (NPCs only)
  npcRace: "Human",                      // NPC race (NPCs only)
  npcType: "Orc Berserker",              // Monster type (monsters only)
  maxHps: 45,                            // Maximum hit points
  currentHps: 38,                        // Current hit points
  initiative: 16,                        // Initiative value (0 if dead)
  isDead: false,                         // Death status
  roundStats: [                          // Combat statistics array
    {
      roundId: 1,                        // Round number
      attacks: [                         // Attack data array
        {
          noOfAttacks: 2,                // Number of attacks made
          damageDealt: [                 // Damage dealt to targets
            { name: "Battleaxe", amount: 12 }
          ],
          damageTaken: [                 // Damage received from sources
            { name: "Orc Scimitar", amount: 7 }
          ],
          healingDealt: [],              // Healing provided to others
          healingTaken: [],              // Healing received
          actions: [                     // Actions taken
            { action: "Action Surge" }
          ]
        }
      ],
      killingBlows: ["Goblin Scout"]     // Characters killed this round
    }
  ]
}
```

### Performance Features

- **Efficient DOM Updates**: Minimal redraws and smart element caching
- **CSS Transitions**: Hardware-accelerated animations
- **Responsive Images**: Optimized for various screen sizes
- **Memory Management**: Event listeners properly managed

## Customization

### Adding Your Own Characters

1. Open `data.js` in a text editor
2. Modify the `players`, `npcs`, or `monsters` arrays
3. Follow the existing data structure format
4. Refresh the browser to see changes

### Styling Modifications

1. Open `styles.css` to modify appearance
2. Change CSS custom properties in `:root` for color scheme
3. Modify responsive breakpoints in media queries
4. Adjust animation timings and effects

### Functional Enhancements

1. Open `script.js` to add new features
2. The codebase includes frameworks for:
   - Character add/remove functionality
   - Google Sheets integration
   - Advanced combat tracking
   - Import functionality

## Future Enhancements

The current codebase provides a foundation for:

- **Dynamic Character Management**: Full add/remove character functionality
- **Cloud Storage**: Google Sheets integration for session persistence
- **Import/Export**: Load previous sessions from JSON files
- **Advanced Combat**: Spell slot tracking, condition monitoring
- **Multiplayer**: Real-time updates for multiple DMs

## Troubleshooting

### Common Issues

1. **Cards Not Displaying**: Ensure all files are in the same directory
2. **JavaScript Errors**: Check browser console for syntax errors in data.js
3. **Save Not Working**: Verify browser allows file downloads
4. **Mobile Issues**: Ensure viewport meta tag is present in HTML

### Browser Support

If experiencing issues:

1. Update to the latest browser version
2. Enable JavaScript in browser settings
3. Clear browser cache and reload
4. Try a different modern browser

## License

This project is open source and available under the MIT License.

## Contributing

Feel free to fork this project and submit pull requests for:

- Bug fixes
- Feature enhancements
- Documentation improvements
- Performance optimizations

---

**Happy Gaming!** 🎲

<style>
:root {
  /* Primary Colors */
  --bg-primary: #0f0f0f;           /* Main background */
  --bg-secondary: #1a1a1a;         /* Card backgrounds */
  --bg-tertiary: #2a2a2a;          /* Button backgrounds */

  /* Character Type Colors */
  --player-accent: #22c55e;        /* Green for players */
  --npc-accent: #eab308;           /* Yellow for NPCs */
  --monster-accent: #ef4444;       /* Red for monsters */

  /* Text Colors */
  --text-primary: #ffffff;         /* Primary text */
  --text-secondary: #a1a1aa;       /* Secondary text */
  --border-color: #374151;         /* Border color */
}
</style>

/_ Mobile First Design _/
@media (max-width: 768px) {
/_ Tablet and mobile styles _/
}

@media (max-width: 480px) {
/_ Mobile-specific styles _/
}
