import React, { useState, useEffect } from 'react';
import { Plus, Minus, RotateCcw, Users, Target } from 'lucide-react';

const CricketScoreboard = () => {
  const [playerCount, setPlayerCount] = useState(2);
  const [players, setPlayers] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [winner, setWinner] = useState(null);
  const [totalRounds, setTotalRounds] = useState(20);
  const [currentRound, setCurrentRound] = useState(1);
  
  const targets = [20, 19, 18, 17, 16, 15, 'BULL'];
  
  // プレイヤー初期化
  useEffect(() => {
    const initialPlayers = [];
    for (let i = 0; i < playerCount; i++) {
      initialPlayers.push({
        id: i,
        name: `Player ${i + 1}`,
        score: 0,
        hits: {
          20: 0, 19: 0, 18: 0, 17: 0, 16: 0, 15: 0, 'BULL': 0
        }
      });
    }
    setPlayers(initialPlayers);
  }, [playerCount]);
  
  // 勝利判定
  useEffect(() => {
    if (!gameStarted) return;
    
    const checkWinner = () => {
      for (let player of players) {
        const allClosed = targets.every(target => player.hits[target] >= 3);
        if (allClosed) {
          // 全てのターゲットをクローズしたプレイヤーが、他の全プレイヤーの得点以上であれば勝利
          const isWinner = players.every(otherPlayer => 
            otherPlayer.id === player.id || player.score >= otherPlayer.score
          );
          if (isWinner) {
            setWinner(player);
            return;
          }
        }
      }
    };
    
    checkWinner();
  }, [players, gameStarted]);
  
  // ヒット処理
  const handleHit = (playerId, target, hitType) => {
    if (winner) return;
    
    setPlayers(prev => {
      const newPlayers = [...prev];
      const player = newPlayers[playerId];
      const hitValue = hitType === 'single' ? 1 : hitType === 'double' ? 2 : 3;
      
      // 既存のヒット数に追加
      const currentHits = player.hits[target];
      const newHits = Math.min(currentHits + hitValue, 3);
      const excessHits = Math.max(0, currentHits + hitValue - 3);
      
      player.hits[target] = newHits;
      
      // 得点計算（クローズ後の余分なヒットがあり、かつ他のプレイヤーでこのターゲットがクローズされていない場合）
      if (excessHits > 0) {
        // 他のプレイヤーでこのターゲットがまだクローズされていないプレイヤーがいるかチェック
        const hasOpenOpponents = newPlayers.some((p, index) => 
          index !== playerId && p.hits[target] < 3
        );
        
        if (hasOpenOpponents) {
          const pointValue = target === 'BULL' ? 25 : target;
          const points = pointValue * excessHits;
          player.score += points;
        }
      }
      
      return newPlayers;
    });
  };
  
  // リセット
  const resetGame = () => {
    setGameStarted(false);
    setWinner(null);
    setCurrentRound(1);
    setPlayers(prev => prev.map(player => ({
      ...player,
      score: 0,
      hits: {
        20: 0, 19: 0, 18: 0, 17: 0, 16: 0, 15: 0, 'BULL': 0
      }
    })));
  };
  
  // プレイヤー名変更
  const updatePlayerName = (playerId, name) => {
    setPlayers(prev => prev.map(player => 
      player.id === playerId ? { ...player, name } : player
    ));
  };
  
  // ヒットマーク表示（重ねるデザイン）
  const renderHitMarks = (hits) => {
    return (
      <div className="relative w-12 h-12 mx-auto">
        <svg className="w-full h-full" viewBox="0 0 40 40">
          {/* 1本目：斜線 */}
          {hits >= 1 && (
            <line
              x1="8"
              y1="32"
              x2="32"
              y2="8"
              stroke="black"
              strokeWidth="3"
              strokeLinecap="round"
            />
          )}
          {/* 2本目：逆斜線でクロス */}
          {hits >= 2 && (
            <line
              x1="8"
              y1="8"
              x2="32"
              y2="32"
              stroke="black"
              strokeWidth="3"
              strokeLinecap="round"
            />
          )}
          {/* 3本目：丸 */}
          {hits >= 3 && (
            <circle
              cx="20"
              cy="20"
              r="16"
              fill="none"
              stroke="red"
              strokeWidth="3"
            />
          )}
        </svg>
      </div>
    );
  };
  
  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 to-green-700 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <Target className="mx-auto mb-4 text-green-600" size={48} />
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Cricket Darts</h1>
            <p className="text-gray-600">ゲーム設定</p>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ラウンド数
            </label>
            <select 
              value={totalRounds} 
              onChange={(e) => setTotalRounds(Number(e.target.value))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value={15}>15ラウンド</option>
              <option value={20}>20ラウンド</option>
            </select>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              プレイヤー数
            </label>
            <select 
              value={playerCount} 
              onChange={(e) => setPlayerCount(Number(e.target.value))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value={2}>2人</option>
              <option value={3}>3人</option>
              <option value={4}>4人</option>
            </select>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              プレイヤー名
            </label>
            {players.map((player, index) => (
              <input
                key={player.id}
                type="text"
                value={player.name}
                onChange={(e) => updatePlayerName(player.id, e.target.value)}
                className="w-full mb-2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder={`Player ${index + 1}`}
              />
            ))}
          </div>
          
          <button
            onClick={() => setGameStarted(true)}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
          >
            <Users size={20} />
            ゲーム開始
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 to-green-700 p-4">
      <div className="max-w-6xl mx-auto">
        {/* ヘッダー */}
        <div className="bg-white rounded-lg shadow-lg p-4 mb-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Target className="text-green-600" />
              Cricket Scoreboard
            </h1>
            <div className="text-lg font-semibold text-gray-600 mt-1">
              Round {currentRound} / {totalRounds}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentRound(prev => Math.max(1, prev - 1))}
              className="bg-gray-500 text-white px-3 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              disabled={currentRound <= 1}
            >
              ←
            </button>
            <button
              onClick={() => setCurrentRound(prev => Math.min(totalRounds, prev + 1))}
              className="bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              disabled={currentRound >= totalRounds}
            >
              →
            </button>
            <button
              onClick={resetGame}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
            >
              <RotateCcw size={16} />
              リセット
            </button>
          </div>
        </div>
        
        {/* 勝者表示 */}
        {winner && (
          <div className="bg-yellow-400 text-yellow-900 p-4 rounded-lg mb-4 text-center">
            <h2 className="text-2xl font-bold">🎉 {winner.name} の勝利！ 🎉</h2>
          </div>
        )}
        
        {/* スコアボード */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-gray-800 text-white">
                <tr>
                  {/* 左側のプレイヤー */}
                  {players.slice(0, Math.ceil(playerCount / 2)).map(player => (
                    <th key={player.id} className="p-4 text-center">
                      <div className="font-bold text-lg">{player.name}</div>
                      <div className="text-2xl font-bold text-yellow-400">
                        {player.score}
                      </div>
                    </th>
                  ))}
                  {/* ターゲット列 */}
                  <th className="p-4 text-center font-bold bg-gray-900 border-x-4 border-yellow-400">
                    TARGET
                  </th>
                  {/* 右側のプレイヤー */}
                  {players.slice(Math.ceil(playerCount / 2)).map(player => (
                    <th key={player.id} className="p-4 text-center">
                      <div className="font-bold text-lg">{player.name}</div>
                      <div className="text-2xl font-bold text-yellow-400">
                        {player.score}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {targets.map((target, targetIndex) => (
                  <tr key={target} className={targetIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    {/* 左側のプレイヤー */}
                    {players.slice(0, Math.ceil(playerCount / 2)).map(player => (
                      <td key={`${player.id}-${target}`} className="p-4 text-center">
                        <div className="mb-3">
                          {renderHitMarks(player.hits[target])}
                        </div>
                        <div className="flex gap-1 justify-center">
                          <button
                            onClick={() => handleHit(player.id, target, 'single')}
                            className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600 transition-colors"
                            disabled={!!winner}
                          >
                            S
                          </button>
                          <button
                            onClick={() => handleHit(player.id, target, 'double')}
                            className="bg-orange-500 text-white px-2 py-1 rounded text-xs hover:bg-orange-600 transition-colors"
                            disabled={!!winner}
                          >
                            D
                          </button>
                          <button
                            onClick={() => handleHit(player.id, target, 'triple')}
                            className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600 transition-colors"
                            disabled={!!winner}
                          >
                            T
                          </button>
                        </div>
                      </td>
                    ))}
                    {/* ターゲット列 */}
                    <td className="p-4 font-bold text-2xl text-white bg-gray-800 text-center border-x-4 border-yellow-400">
                      {target}
                    </td>
                    {/* 右側のプレイヤー */}
                    {players.slice(Math.ceil(playerCount / 2)).map(player => (
                      <td key={`${player.id}-${target}`} className="p-4 text-center">
                        <div className="mb-3">
                          {renderHitMarks(player.hits[target])}
                        </div>
                        <div className="flex gap-1 justify-center">
                          <button
                            onClick={() => handleHit(player.id, target, 'single')}
                            className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600 transition-colors"
                            disabled={!!winner}
                          >
                            S
                          </button>
                          <button
                            onClick={() => handleHit(player.id, target, 'double')}
                            className="bg-orange-500 text-white px-2 py-1 rounded text-xs hover:bg-orange-600 transition-colors"
                            disabled={!!winner}
                          >
                            D
                          </button>
                          <button
                            onClick={() => handleHit(player.id, target, 'triple')}
                            className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600 transition-colors"
                            disabled={!!winner}
                          >
                            T
                          </button>
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* ゲーム情報 */}
        <div className="bg-white rounded-lg shadow-lg p-4 mt-4">
          <h3 className="font-bold text-lg mb-2">ゲーム状況</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {players.map(player => {
              const closedTargets = targets.filter(target => player.hits[target] >= 3).length;
              const totalTargets = targets.length;
              return (
                <div key={player.id} className="bg-gray-50 p-3 rounded">
                  <div className="font-semibold">{player.name}</div>
                  <div className="text-sm text-gray-600">
                    クローズ: {closedTargets}/{totalTargets}
                  </div>
                  <div className="text-sm text-gray-600">
                    得点: {player.score}点
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CricketScoreboard;
