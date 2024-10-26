"use client";

import React from "react";

// Define the shape of the player object
interface Player {
  name: string;
  imageUrl: string;
}

// Define the props for the PlayerCard component
interface PlayerCardProps {
  player: Player;
}

// Define the PlayerCard component
const PlayerCard: React.FC<PlayerCardProps> = ({ player }) => {
  return (
    <div className="max-w-xs text-white rounded-lg border-2 border-gray-50">
      {/* Player Name */}
      <h1 className="text-5xl font-bold text-center">{player.name}</h1>
      {/* Player Image */}
      <img
        src={player.imageUrl}
        alt={`Image of ${player.name}`}
        className="w-96 h-96 object-cover mx-auto"
      />
    </div>
  );
};

export default PlayerCard;
