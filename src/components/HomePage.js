import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createGame, gameExists, generateGameId } from '../services/gameService';
import { signInAnonymous } from '../firebase';

const HomePage = () => {
  const [gameId, setGameId] = useState('');
  const [gameName, setGameName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleCreateGame = async (e) => {
    e.preventDefault();
    if (!gameName.trim()) {
      setError('Please enter a game name');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Sign in anonymously
      await signInAnonymous();
      
      // Generate unique game ID
      let newGameId;
      let exists = true;
      
      while (exists) {
        newGameId = generateGameId();
        exists = await gameExists(newGameId);
      }

      // Create the game
      await createGame(newGameId, gameName);
      
      // Navigate to game page
      navigate(`/game/${newGameId}`);
    } catch (error) {
      console.error('Error creating game:', error);
      setError('Failed to create game. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinGame = async (e) => {
    e.preventDefault();
    if (!gameId.trim()) {
      setError('Please enter a game ID');
      return;
    }

    if (gameId.length !== 6) {
      setError('Game ID must be 6 digits');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Sign in anonymously
      await signInAnonymous();
      
      // Check if game exists
      const exists = await gameExists(gameId);
      
      if (!exists) {
        setError('Game not found. Please check the game ID.');
        return;
      }

      // Navigate to game page
      navigate(`/game/${gameId}`);
    } catch (error) {
      console.error('Error joining game:', error);
      setError('Failed to join game. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-2">
            🃏 PokerCal
          </h1>
          <p className="text-gray-300">
            Track your Texas Hold'em chip records
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Create Game Form */}
        <div className="card">
          <h2 className="text-xl font-semibold text-white mb-4">Create New Game</h2>
          <form onSubmit={handleCreateGame} className="space-y-4">
            <div>
              <label htmlFor="gameName" className="block text-sm font-medium text-gray-300 mb-2">
                Game Name
              </label>
              <input
                type="text"
                id="gameName"
                value={gameName}
                onChange={(e) => setGameName(e.target.value)}
                placeholder="Friday Night Poker"
                className="input-field"
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Game'}
            </button>
          </form>
        </div>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-slate-800 text-gray-400">OR</span>
          </div>
        </div>

        {/* Join Game Form */}
        <div className="card">
          <h2 className="text-xl font-semibold text-white mb-4">Join Existing Game</h2>
          <form onSubmit={handleJoinGame} className="space-y-4">
            <div>
              <label htmlFor="gameId" className="block text-sm font-medium text-gray-300 mb-2">
                Game ID
              </label>
              <input
                type="text"
                id="gameId"
                value={gameId}
                onChange={(e) => setGameId(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="123456"
                className="input-field text-center text-lg tracking-widest"
                disabled={loading}
                maxLength={6}
              />
              <p className="text-xs text-gray-400 mt-1">
                Enter the 6-digit game code
              </p>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Joining...' : 'Join Game'}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-400">
          <p>No login required • Real-time updates</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;