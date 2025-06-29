# D&D Round Tracker

A comprehensive Single Page Application (SPA) for Dungeon Masters to track combat rounds, initiative order, and character statistics during Dungeons & Dragons sessions. Built with vanilla HTML, CSS, and JavaScript with no backend dependencies.

## Features

### 🎯 Initiative & Round Management

- **Initiative Tracking**: Visual countdown from 20 to 1 with automatic turn highlighting
- **Round Counter**: Track combat rounds with increment/decrement controls
- **Visual Turn Indicators**: Golden glow for current turn, blur effect for upcoming turns
- **Quick Reset**: Reset initiative to 20 with one click

### 👥 Character Management

- **Player Carousel**: Horizontally scrollable cards sorted by initiative (descending)
- **NPC Grid**: Yellow-accented cards for friendly NPCs
- **Monster Grid**: Red-accented cards for enemies and monsters
- **Add/Remove Framework**: Dropdown menus for future character management

### 📊 Character Information Display

- **Health Tracking**: Visual HP bars with percentage and color-coded status
- **Combat Statistics**: Attack counts and killing blows per round
- **Initiative Display**: Clear initiative badges on each character card
- **Status Indicators**: Dead characters marked with skull overlay

### 💾 Data Management

- **JSON Export**: Save complete game state with timestamp
- **Sample Data**: Pre-loaded with 3 players, 3 NPCs, and 3 monsters
- **Round Statistics**: Detailed combat tracking per character per round

### 🎨 User Interface

- **Dark Mode**: Professional dark theme optimized for low-light gaming
- **Responsive Design**: Mobile-friendly layout with touch navigation
- **Color-Coded Types**: Green (players), Yellow (NPCs), Red (monsters)
- **Smooth Animations**: CSS transitions for all interactions

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- No server setup required - runs entirely in the browser

### Installation

1. Download or clone the project files
2. Ensure all files are in the same directory:
   ```
   /no_backend/
   ├── index.html
   ├── styles.css
   ├── script.js
   ├── data.js
   └── README.md
   ```
3. Open `index.html` in your web browser

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
├── index.html          # Main application structure and layout
├── styles.css          # Complete styling with dark theme and responsive design
├── script.js           # All application logic, event handling, and UI updates
├── data.js             # Sample character data and data structure definitions
└── README.md           # This documentation file
```

## Technical Details

### Browser Compatibility

- **Modern Browsers**: Chrome 60+, Firefox 55+, Safari 12+, Edge 79+
- **Features Used**: ES6+ JavaScript, CSS Grid, CSS Custom Properties
- **No Dependencies**: Pure vanilla JavaScript, no frameworks required

### Data Structure

Characters are stored in three arrays (players, npcs, monsters) with the following structure:

```javascript
{
  characterName: "string",
  maxHps: number,
  currentHps: number,
  initiative: number,
  isDead: boolean,
  roundStats: [
    {
      roundId: number,
      attacks: [
        {
          noOfAttacks: number,
          damageDealt: [{name: "string", amount: number}],
          damageTaken: [{name: "string", amount: number}],
          healingDealt: [{name: "string", amount: number}],
          healingTaken: [{name: "string", amount: number}],
          actions: [{action: "string"}]
        }
      ],
      killingBlows: ["string"]
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
