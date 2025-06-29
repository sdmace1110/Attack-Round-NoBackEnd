# D&D Round Tracker - Project Documentation

## Overview

### Role

You are designing a comprehensive SPA (Single Page Application) with no backend for Dungeon Masters playing Dungeons and Dragons. The app serves as a round recording and initiative tracking device. All data persistence occurs at the end of the session by writing data to a local JSON file and/or uploading to Google Sheets. The app displays character information in sortable cards with real-time visual feedback based on combat turn order.

## Data Structures

There are three main data structures: Players, NPCs, and Monsters. Below is a list of those objects, their attributes, and the data type associated with each attribute.

### Core Character Types

- **Players**: attributes include playerName (string), characterName (string), maxHps (number), currentHps (number), initiative (number), roundStats (array), isDead (boolean)
- **NPCs**: attributes include npcName (string), npcRace (string), maxHps, currentHps, initiative, roundStats, isDead
- **Monsters**: attributes include npcType (string), maxHps, currentHps, initiative, roundStats, isDead

### Supporting Data Structures

- **roundStatsObj**: roundStatsObj represents a single element inside roundStats. Attributes include roundId (number), attacks (array (attack)), killingBlows (array (string))
- **attack**: attack is an item used in attacks which holds a player/npc's attack information. Attributes include noOfAttacks (number), damageDealt (array(combatItem)), damageTaken (array (combatItem)), healingDealt (array (combatItem)), healingTaken (array (combatItem)), actions (array (actionItem))
- **combatItem**: attributes include name (string), amount (number)
- **actionItem**: attributes include action (string)

### Global State Variables

- **currentRound**: (number) Tracks the current combat round
- **currentInitiative**: (number) Tracks the current initiative count (20 down to 1)
- **currentCarouselIndex**: (number) Tracks player carousel position
- **sortedPlayers**: (array) Players sorted by initiative in descending order

## App Architecture & Layout

### HTML Structure

```html
<header>
  <h1>D&D Round Tracker</h1>
  <div class="header-controls">
    <div class="round-counter">
      <!-- Round display with increment/decrement buttons -->
    </div>
    <div class="initiative-controls">
      <!-- Initiative display with navigation and reset -->
    </div>
    <div class="action-controls">
      <!-- Add/Remove character dropdowns + Save button -->
    </div>
  </div>
</header>

<section class="players-section">
  <!-- Carousel for players sorted by initiative -->
</section>

<section class="bottom-section">
  <div class="grid-container">
    <!-- NPCs grid on left, Monsters grid on right -->
  </div>
</section>

<div class="modal">
  <!-- Character detail modal for interactions -->
</div>
```

### CSS Architecture

#### Color Scheme (Dark Mode)
```css
:root {
  /* Primary backgrounds */
  --bg-primary: #1a1a1a;
  --bg-secondary: #2d2d2d;
  --bg-tertiary: #3a3a3a;
  
  /* Character type accent colors */
  --player-accent: #22c55e;    /* Green */
  --npc-accent: #eab308;       /* Yellow */
  --monster-accent: #ef4444;   /* Red */
  
  /* Status indicators */
  --dead-color: #7f1d1d;
  --wounded-color: #f59e0b;
  --healthy-color: #10b981;
}
```

#### Visual Effects System
- **Initiative-based effects**: Cards change appearance based on turn order
  - `.current-turn`: Golden glow for characters whose initiative matches current
  - `.upcoming-turn`: Blur and darken for characters who haven't acted yet
  - Normal appearance for characters who have already acted

#### Responsive Design
- Mobile-first approach with breakpoint at 768px
- Stacked layout on mobile devices
- Flexible grid systems for character cards

### JavaScript Functionality

#### Core Functions

1. **Initialization Functions**
   - `initializeApp()`: Sorts players, populates cards, applies visual effects
   - `setupEventListeners()`: Configures all user interaction handlers

2. **Card Management**
   - `createPlayerCard()`, `createNPCCard()`, `createMonsterCard()`: Generate character cards
   - `populatePlayersCarousel()`, `populateNPCsGrid()`, `populateMonstersGrid()`: Populate displays

3. **Initiative & Round Management**
   - `updateInitiativeEffects()`: Apply visual effects based on current initiative
   - `nextInitiative()`, `previousInitiative()`, `resetInitiative()`: Initiative navigation
   - `nextRound()`, `previousRound()`: Round management

4. **UI State Management**
   - `updateCarousel()`: Handle player carousel navigation
   - `updateInitiativeDisplay()`, `updateRoundDisplay()`: Sync UI with state
   - `showCharacterModal()`, `closeModal()`: Character detail interactions

5. **Data Persistence**
   - `saveDataToFile()`: Export complete game state as JSON file
   - `setupDropdownListeners()`: Handle add/remove character actions (framework)

## App Functionality & User Experience

### Visual Layout

#### Header Controls
```
[D&D Round Tracker]     [Round: 1 [-][+]] [Initiative: 20 [-][+][Reset]] [Add▼] [Remove▼] [Save]
```

#### Main Content Area
```
Players (Carousel - sorted by initiative descending)
[◀] [Player Card] [Player Card] [Player Card] [▶]

NPCs (Grid)                    Monsters (Grid)
[NPC Card] [NPC Card]         [Monster Card] [Monster Card]
[NPC Card] [NPC Card]         [Monster Card] [Monster Card]
```

### Character Cards

Each card displays:
- **Header**: Character name + Initiative badge
- **Info**: Player name/Race/Type based on character type
- **HP Bar**: Visual health indicator with percentage
- **Stats**: Attack count and kill count from current round
- **Visual State**: Border color (type-based) + initiative effects

### Initiative System

The app tracks initiative with visual feedback:
1. **Current Turn**: Golden glow around cards with matching initiative
2. **Completed Turns**: Normal appearance for lower initiative values
3. **Upcoming Turns**: Blurred and darkened for higher initiative values

### Interactive Features

#### Carousel Navigation
- Left/Right arrows to navigate through players
- Automatic disable when at boundaries
- Smooth CSS transitions

#### Dropdown Menus
- **Add Character**: Hover-activated dropdown (Player/NPC/Monster)
- **Remove Character**: Similar dropdown for removal options
- **Smooth animations** with invisible bridge for better UX

#### Modal System
- Click any character card to view detailed stats
- Shows complete round-by-round combat history
- Damage dealt/taken, healing, actions, and killing blows

#### Data Export
- **Save button**: Downloads JSON file with complete game state
- Includes timestamp, round data, and all character information
- Filename format: `dnd-round-tracker-YYYY-MM-DD.json`

### File Structure

```
/no_backend/
├── index.html          # Main application structure
├── styles.css          # Complete styling with dark theme
├── script.js           # All application logic and interactions
├── data.js             # Sample character data (3 of each type)
└── prompts.md          # This documentation file
```

### Technical Implementation Notes

#### Event Handling
- Uses modern ES6+ features (arrow functions, template literals, destructuring)
- Modular function design with clear separation of concerns
- Comprehensive error checking for DOM elements

#### Performance Considerations
- CSS transitions for smooth visual effects
- Efficient DOM manipulation with minimal redraws
- Responsive design patterns for mobile optimization

#### Accessibility Features
- Semantic HTML structure
- Clear visual hierarchy
- Keyboard navigation support through standard HTML controls
- High contrast color scheme in dark mode

### Future Enhancement Framework

The codebase includes placeholder functionality for:
- **Character Management**: Add/remove character dialogs (currently logs to console)
- **Google Sheets Integration**: Framework for cloud data persistence
- **Advanced Combat Tracking**: Expandable round stats system
- **Import/Export**: JSON file loading for session restoration
