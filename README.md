# Memory Game

A fun and interactive memory card-matching game built with React 18, TypeScript, SCSS Modules, and Next.js (Pages Router).

## Features

- **Game Board**: Grid of face-down cards (2×2, 4×4, or 6×6).
- **Gameplay**: Flip two cards per turn; match them to keep them face-up, or they flip back after a delay.
- **Timer**: Starts on first flip, tracks elapsed time.
- **Move Counter**: Increments per pair of flips.
- **Difficulty Levels**: Easy (2×2), Medium (4×4), Hard (6×6).
- **Restart**: Reshuffles and resets the game.
- **Best Score**: Persisted in localStorage (least moves, then time).
- **Responsive Design**: Works down to 320px wide.
- **Accessibility**: Keyboard navigation (Tab/Enter/Space), ARIA labels, live regions.
- **Modern UI**: Clean styling with SCSS Modules, subtle flip animations.

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: SCSS Modules with variables and mixins
- **Bundler**: Next.js (Pages Router)
- **State Management**: React hooks (useState, useEffect)
- **Utilities**: Custom hooks, shuffle function

## Project Structure

```
memory-game/
├── src/
│   ├── components/
│   │   ├── Card/
│   │   ├── GameBoard/
│   │   ├── Controls/
│   │   ├── DifficultySelector/
│   │   └── Timer/
│   ├── hooks/
│   │   └── useTimer.ts
│   ├── types/
│   │   └── game.ts
│   ├── utils/
│   │   └── shuffle.ts
│   ├── styles/
│   │   ├── variables.scss
│   │   └── globals.scss
│   ├── pages/
│   │   ├── index.tsx
│   │   └── _app.tsx
│   ├── App.tsx
│   └── App.module.scss
├── public/
├── package.json
├── tsconfig.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd memory-game
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## How to Play

1. Select a difficulty level from the dropdown.
2. Click on cards to flip them (or use Tab/Enter/Space for keyboard).
3. Try to match pairs of cards.
4. The game ends when all cards are matched.
5. View your best score and try to beat it!

## Accessibility

- Use Tab to navigate between cards and controls.
- Press Enter or Space to flip a card.
- Screen readers will announce moves, time, and game status.

## Deployment

Deploy to Vercel, Netlify, or any static hosting service:

```bash
npm run build
npm run start
```

For Vercel:
```bash
npm i -g vercel
vercel
```

## Contributing

Feel free to submit issues or pull requests for improvements.

## License

MIT License
