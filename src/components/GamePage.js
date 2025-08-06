import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import {
  subscribeToGame,
  updatePlayer,
  addRebuy,
  updateCashOut,
  calculatePlayerStats,
  calculateGameSummary
} from '../services/gameService';

const GamePage = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [nickname, setNickname] = useState('');
  const [buyIn, setBuyIn] = useState('');
  const [rebuyAmount, setRebuyAmount] = useState('');
  const [cashOut, setCashOut] = useState('');
  const [hasJoined, setHasJoined] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const initializeUser = async () => {
      try {
        // Create a new anonymous user for each game session
        // This ensures each browser tab/window has a unique user ID
        const { createNewAnonymousUser } = await import('../firebase');
        const user = await createNewAnonymousUser();
        
        if (user) {
          setCurrentUserId(user.uid);
          console.log('Current user ID:', user.uid);
        }

        // Subscribe to game updates
        const unsubscribe = subscribeToGame(gameId, (gameData) => {
          if (gameData) {
            setGame(gameData);
            
            // Debug: Log all players
            const playerCount = gameData.players ? Object.keys(gameData.players).length : 0;
            console.log(`遊戲更新 - 玩家數量: ${playerCount}`, gameData.players);
            
            // Check if current user has already joined
            if (user && gameData.players && gameData.players[user.uid]) {
              setHasJoined(true);
              const playerData = gameData.players[user.uid];
              setNickname(playerData.nickname);
              setBuyIn(playerData.buyIn.toString());
              setCashOut(playerData.cashOut ? playerData.cashOut.toString() : '');
              console.log('User already joined:', playerData.nickname);
            } else {
              setHasJoined(false);
              console.log('User not joined yet');
            }
            
            setLoading(false);
          } else {
            setError('Game not found');
            setLoading(false);
          }
        });

        return () => unsubscribe();
      } catch (error) {
        console.error('Error initializing user:', error);
        setError('Failed to initialize user');
        setLoading(false);
      }
    };

    initializeUser();
  }, [gameId]);

  const handleJoinGame = async (e) => {
    e.preventDefault();
    if (!nickname.trim() || !buyIn || buyIn <= 0) {
      setError('Please enter a valid nickname and buy-in amount');
      return;
    }

    try {
      const playerData = {
        nickname: nickname.trim(),
        buyIn: parseFloat(buyIn),
        rebuys: [],
        cashOut: 0
      };

      await updatePlayer(gameId, currentUserId, playerData);
      setHasJoined(true);
      setError('');
    } catch (error) {
      console.error('Error joining game:', error);
      setError('Failed to join game. Please try again.');
    }
  };

  const handleAddRebuy = async (e) => {
    e.preventDefault();
    if (!rebuyAmount || rebuyAmount <= 0) {
      setError('Please enter a valid rebuy amount');
      return;
    }

    try {
      await addRebuy(gameId, currentUserId, parseFloat(rebuyAmount));
      setRebuyAmount('');
      setError('');
    } catch (error) {
      console.error('Error adding rebuy:', error);
      setError('Failed to add rebuy. Please try again.');
    }
  };

  const handleUpdateCashOut = async (e) => {
    e.preventDefault();
    const cashOutValue = cashOut ? parseFloat(cashOut) : 0;

    try {
      await updateCashOut(gameId, currentUserId, cashOutValue);
      setError('');
    } catch (error) {
      console.error('Error updating cash out:', error);
      setError('Failed to update cash out. Please try again.');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatProfit = (amount) => {
    const formatted = formatCurrency(Math.abs(amount));
    if (amount > 0) {
      return <span className="text-green-400">+{formatted}</span>;
    } else if (amount < 0) {
      return <span className="text-red-400">-{formatted}</span>;
    } else {
      return <span className="text-gray-400">{formatted}</span>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-white text-xl">Loading game...</div>
      </div>
    );
  }

  if (error && !game) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">{error}</div>
          <button
            onClick={() => navigate('/')}
            className="btn-primary"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const players = game?.players || {};
  const gameSummary = calculateGameSummary(players);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">{game?.name}</h1>
            <p className="text-gray-300">Game ID: <span className="font-mono text-lg">{gameId}</span></p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="btn-secondary"
          >
            Leave Game
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Join Game Form */}
        {!hasJoined && (
          <div className="card max-w-md">
            <h2 className="text-xl font-semibold text-white mb-4">Join Game</h2>
            <form onSubmit={handleJoinGame} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nickname
                </label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="Your nickname"
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Buy-in Amount
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={buyIn}
                  onChange={(e) => setBuyIn(e.target.value)}
                  placeholder="1000"
                  className="input-field"
                  required
                />
              </div>
              <button type="submit" className="w-full btn-primary">
                Join Game
              </button>
            </form>
          </div>
        )}

        {/* Player Controls */}
        {hasJoined && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Add Rebuy */}
            <div className="card">
              <h3 className="text-lg font-semibold text-white mb-4">加碼買入</h3>
              <form onSubmit={handleAddRebuy} className="space-y-4">
                <div>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={rebuyAmount}
                    onChange={(e) => setRebuyAmount(e.target.value)}
                    placeholder="加碼金額"
                    className="input-field"
                  />
                </div>
                <button type="submit" className="w-full btn-success">
                  加碼買入
                </button>
              </form>
            </div>

            {/* Update Cash Out */}
            <div className="card">
              <h3 className="text-lg font-semibold text-white mb-4">現金結算</h3>
              <form onSubmit={handleUpdateCashOut} className="space-y-4">
                <div>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={cashOut}
                    onChange={(e) => setCashOut(e.target.value)}
                    placeholder="結算金額"
                    className="input-field"
                  />
                </div>
                <button type="submit" className="w-full btn-danger">
                  更新結算
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Players Table */}
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white">Players</h2>
            <div className="text-sm text-gray-300">
              {Object.keys(players).length} player{Object.keys(players).length !== 1 ? 's' : ''}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-600">
                  <th className="text-left py-3 px-4 text-gray-300">玩家</th>
                  <th className="text-right py-3 px-4 text-gray-300">初始買入</th>
                  <th className="text-right py-3 px-4 text-gray-300">加碼次數</th>
                  <th className="text-right py-3 px-4 text-gray-300">加碼金額</th>
                  <th className="text-right py-3 px-4 text-gray-300">總投入</th>
                  <th className="text-right py-3 px-4 text-gray-300">結算金額</th>
                  <th className="text-right py-3 px-4 text-gray-300">損益</th>
                  <th className="text-center py-3 px-4 text-gray-300">狀態</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(players).map(([playerId, player]) => {
                  const stats = calculatePlayerStats(player);
                  const isCurrentUser = playerId === currentUserId;
                  const rebuyCount = player.rebuys ? player.rebuys.length : 0;
                  const isActive = stats.cashOut === 0; // Player hasn't cashed out yet
                  
                  return (
                    <tr 
                      key={playerId} 
                      className={`border-b border-gray-700 ${isCurrentUser ? 'bg-blue-900/20' : ''}`}
                    >
                      <td className="py-3 px-4">
                        <div className="flex flex-col">
                          <div className="flex items-center space-x-2">
                            <span className="text-white font-medium">{player.nickname}</span>
                            {isCurrentUser && (
                              <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">您</span>
                            )}
                          </div>
                          {/* Real-time status indicator */}
                          <div className="flex items-center space-x-1 mt-1">
                            <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                            <span className="text-xs text-gray-400">
                              {isActive ? '進行中' : '已結算'}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="text-right py-3 px-4 text-white">
                        {formatCurrency(player.buyIn)}
                      </td>
                      <td className="text-right py-3 px-4 text-white">
                        {rebuyCount > 0 ? (
                          <span className="bg-yellow-600 text-white px-2 py-1 rounded text-xs">
                            {rebuyCount} 次
                          </span>
                        ) : (
                          <span className="text-gray-400">0</span>
                        )}
                      </td>
                      <td className="text-right py-3 px-4 text-white">
                        {stats.totalRebuys > 0 ? formatCurrency(stats.totalRebuys) : '-'}
                      </td>
                      <td className="text-right py-3 px-4 text-white font-medium bg-gray-700 rounded">
                        {formatCurrency(stats.totalBuyIn)}
                      </td>
                      <td className="text-right py-3 px-4 text-white">
                        {stats.cashOut > 0 ? formatCurrency(stats.cashOut) : (
                          <span className="text-gray-400">待結算</span>
                        )}
                      </td>
                      <td className="text-right py-3 px-4 font-medium">
                        {stats.cashOut > 0 ? formatProfit(stats.netProfit) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="text-center py-3 px-4">
                        {isActive ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-600 text-white">
                            🎲 遊戲中
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-600 text-white">
                            ✅ 已離桌
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Game Summary */}
        <div className="card">
          <h2 className="text-xl font-semibold text-white mb-4">遊戲統計</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-700 rounded-lg">
              <div className="text-2xl font-bold text-white">{formatCurrency(gameSummary.totalBuyIns)}</div>
              <div className="text-sm text-gray-300">總買入金額</div>
            </div>
            <div className="text-center p-4 bg-gray-700 rounded-lg">
              <div className="text-2xl font-bold text-white">{formatCurrency(gameSummary.totalCashOuts)}</div>
              <div className="text-sm text-gray-300">總結算金額</div>
            </div>
            <div className="text-center p-4 bg-gray-700 rounded-lg">
              <div className={`text-2xl font-bold ${
                Math.abs(gameSummary.difference) < 0.01 
                  ? 'text-green-400' 
                  : 'text-red-400'
              }`}>
                {formatCurrency(gameSummary.difference)}
              </div>
              <div className="text-sm text-gray-300">
                差額 {Math.abs(gameSummary.difference) < 0.01 ? '✓' : '⚠️'}
              </div>
            </div>
          </div>
          {Math.abs(gameSummary.difference) >= 0.01 && (
            <div className="mt-4 p-3 bg-yellow-900 border border-yellow-700 rounded-lg">
              <p className="text-yellow-100 text-sm">
                ⚠️ 總買入金額與總結算金額不符，請檢查所有金額。
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GamePage;