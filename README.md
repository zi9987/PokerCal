# PokerCal - Texas Hold'em Chip Tracker

A real-time web application for tracking Texas Hold'em homegame chip records built with React and Firebase.

## Features

- **Create or Join Games**: Generate or enter 6-digit game codes
- **Anonymous Access**: No login required, uses Firebase anonymous authentication
- **Real-time Updates**: Live synchronization of player data across all devices
- **Chip Tracking**: Track buy-ins, rebuys, and cash-outs for each player
- **Automatic Calculations**: Real-time profit/loss calculations and game summaries
- **Balance Verification**: Automatic checking that total buy-ins match total cash-outs

## Tech Stack

- **Frontend**: React 18 with Hooks, TailwindCSS
- **Backend**: Firebase Firestore (NoSQL Database)
- **Hosting**: Firebase Hosting
- **Authentication**: Firebase Anonymous Auth

## Setup Instructions

### 1. Prerequisites
- Node.js 16+ installed
- Firebase CLI installed (`npm install -g firebase-tools`)

### 2. Firebase Project Setup
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Firestore Database
4. Enable Authentication with Anonymous sign-in
5. Get your Firebase config object

### 3. Configure Firebase
1. Update `src/firebase.js` with your Firebase config:
```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

2. Update `.firebaserc` with your project ID:
```json
{
  "projects": {
    "default": "your-project-id"
  }
}
```

### 4. Install Dependencies
```bash
npm install
```

### 5. Development
```bash
npm start
```
The app will open at `http://localhost:3000`

### 6. Deploy to Firebase
```bash
# Build the project
npm run build

# Login to Firebase (if not already logged in)
firebase login

# Deploy
firebase deploy
```

## Project Structure

```
src/
├── components/
│   ├── HomePage.js      # Create/join games
│   └── GamePage.js      # Game interface with player tracking
├── services/
│   └── gameService.js   # Firestore operations and game logic
├── firebase.js          # Firebase configuration
├── App.js              # Main app with routing
├── index.js            # React entry point
└── index.css           # Tailwind styles
```

## Firestore Structure

```
games/{gameId}
├── name: string
├── createdAt: timestamp
└── players: {
    [playerId]: {
      nickname: string
      buyIn: number
      rebuys: number[]
      cashOut: number
    }
  }
```

## Usage

1. **Create a Game**: Enter a game name and get a 6-digit code
2. **Join a Game**: Enter the 6-digit code and your nickname
3. **Set Buy-in**: Enter your initial buy-in amount
4. **Add Rebuys**: Add additional buy-ins during the game
5. **Cash Out**: Enter your final cash-out amount when leaving
6. **View Summary**: See real-time profit/loss for all players

## Firebase Security Rules

The included Firestore rules ensure:
- Players can only edit their own data
- Game data is readable by anyone with the game ID
- Proper data validation for all fields

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project for your poker games!