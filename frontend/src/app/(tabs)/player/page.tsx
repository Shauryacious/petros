"use client";

import React from "react";
import PlayerCard from "@/components/PlayerCard"; // Adjust the import path as necessary
import Navbar from "@/components/Navbar";

const App = () => {
  const player = {
    name: "Lionel Messi",
    imageUrl: "/players/messi.png", // Updated path to your Messi image
  };

  return (
    <div className=" bg-black">
      <div className="relative w-full flex items-center justify-center ">
        <Navbar />
      </div>
      <PlayerCard player={player} />
    </div>
  );
};

export default App;
