import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  onSnapshot,
  serverTimestamp,
  arrayUnion 
} from 'firebase/firestore';
import { db } from '../firebase';

// Generate a 6-digit game ID
export const generateGameId = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Create a new game
export const createGame = async (gameId, gameName) => {
  try {
    const gameRef = doc(db, 'games', gameId);
    await setDoc(gameRef, {
      name: gameName,
      createdAt: serverTimestamp(),
      players: {}
    });
    return gameId;
  } catch (error) {
    console.error('Error creating game:', error);
    throw error;
  }
};

// Check if a game exists
export const gameExists = async (gameId) => {
  try {
    const gameRef = doc(db, 'games', gameId);
    const gameSnap = await getDoc(gameRef);
    return gameSnap.exists();
  } catch (error) {
    console.error('Error checking game existence:', error);
    throw error;
  }
};

// Get game data
export const getGame = async (gameId) => {
  try {
    const gameRef = doc(db, 'games', gameId);
    const gameSnap = await getDoc(gameRef);
    if (gameSnap.exists()) {
      return { id: gameSnap.id, ...gameSnap.data() };
    } else {
      throw new Error('Game not found');
    }
  } catch (error) {
    console.error('Error getting game:', error);
    throw error;
  }
};

// Subscribe to real-time game updates
export const subscribeToGame = (gameId, callback) => {
  const gameRef = doc(db, 'games', gameId);
  return onSnapshot(gameRef, (doc) => {
    if (doc.exists()) {
      callback({ id: doc.id, ...doc.data() });
    } else {
      callback(null);
    }
  });
};

// Add or update a player
export const updatePlayer = async (gameId, playerId, playerData) => {
  try {
    const gameRef = doc(db, 'games', gameId);
    await updateDoc(gameRef, {
      [`players.${playerId}`]: playerData
    });
  } catch (error) {
    console.error('Error updating player:', error);
    throw error;
  }
};

// Add a rebuy for a player
export const addRebuy = async (gameId, playerId, amount) => {
  try {
    const gameRef = doc(db, 'games', gameId);
    await updateDoc(gameRef, {
      [`players.${playerId}.rebuys`]: arrayUnion(amount)
    });
  } catch (error) {
    console.error('Error adding rebuy:', error);
    throw error;
  }
};

// Update player cash out
export const updateCashOut = async (gameId, playerId, cashOut) => {
  try {
    const gameRef = doc(db, 'games', gameId);
    await updateDoc(gameRef, {
      [`players.${playerId}.cashOut`]: cashOut
    });
  } catch (error) {
    console.error('Error updating cash out:', error);
    throw error;
  }
};

// Calculate player statistics
export const calculatePlayerStats = (player) => {
  const totalRebuys = player.rebuys ? player.rebuys.reduce((sum, rebuy) => sum + rebuy, 0) : 0;
  const totalBuyIn = player.buyIn + totalRebuys;
  const cashOut = player.cashOut || 0;
  const netProfit = cashOut - totalBuyIn;
  
  return {
    totalBuyIn,
    totalRebuys,
    cashOut,
    netProfit
  };
};



// Calculate game summary
export const calculateGameSummary = (players) => {
  let totalBuyIns = 0;
  let totalCashOuts = 0;
  
  Object.values(players).forEach(player => {
    const stats = calculatePlayerStats(player);
    totalBuyIns += stats.totalBuyIn;
    totalCashOuts += stats.cashOut;
  });
  
  return {
    totalBuyIns,
    totalCashOuts,
    difference: totalCashOuts - totalBuyIns
  };
};