// import { useEffect, useState } from "react"
import socket from "./socket"
import '../App.css'


import React, { useState, useEffect } from 'react';

interface Player {
  name: string;
  score: number;
}

const Players: React.FC<{ currentUsername: string }> = ({  currentUsername }) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentplayerdrawing, setcurrentplayerdrawing] = useState('')
  useEffect(() => {
    const handlePlayers = (data: Player[]) => {
      setPlayers(data);
    };

    socket.on('players', handlePlayers); 

    return () => {
      socket.off('players', handlePlayers); 
    };
  }, [socket]);



  const renderPlayer = (player: Player, index: number) => {
    const isCurrentUser = player.name === currentUsername;
    const className = isCurrentUser ? 'player-box-me' : 'player-box';

    return (
      <>
      <div key={index} className={`   ${className} `}>
        <div className="user">{player.name}</div>
        <div className="score"> {player.score} points</div>
      </div>
      </>
    );
  };

  return (
    <div id="containerPlayers" className="w-[200px] bg-white rounded-md">
      <div id="list-player" className="flex justify-center flex-col items-center">
        {players.map(renderPlayer)}
      </div>
    </div>
  );
};

export default Players;