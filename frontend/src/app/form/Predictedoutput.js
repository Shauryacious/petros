import React from 'react';
import { Button } from '@nextui-org/button'; // Assuming Button is coming from @nextui-org/button

export default function PredictedOutput({
  playerName,
  playerTeam,
  opponentTeam,
  status,
  model,
  resultLines,
  setSubmitted
}) {
  return (
    <div className="flex justify-center items-center min-h-screen p-6 bg-black">
      <div className="w-full max-w-lg p-8 rounded-lg shadow-lg bg-[#0d0d12] backdrop-blur-md border border-[#2a2a3d]" style={{position: 'sticky', top: '0px', left: "0px"}}>
        <h2 className="text-4xl font-extrabold mb-6 text-center text-neutral-300">Prediction Result</h2>
        <p className="text-center text-neutral-400 mb-6">Here are the details you submitted:</p>
        
        <div className="space-y-4 mb-6">
          <p className="text-neutral-400 text-lg"><strong>Player Name:</strong> {playerName}</p>
          <p className="text-neutral-400 text-lg"><strong>Player Team:</strong> {playerTeam}</p>
          <p className="text-neutral-400 text-lg"><strong>Opponent Team:</strong> {opponentTeam}</p>
          <p className="text-neutral-400 text-lg"><strong>Status:</strong> {status}</p>
          <p className="text-neutral-400 text-lg"><strong>Model:</strong> {model}</p>
        </div>

        <div className="mb-6">
          <h3 className="text-2xl font-semibold text-neutral-300 mb-3">Prediction Result:</h3>
          {resultLines.length > 0 ? (
            <ul className="list-disc pl-5 space-y-2">
              {resultLines.map((line, index) => (
                <li key={index} className="text-neutral-400 text-base">{line}</li>
              ))}
            </ul>
          ) : (
            <p className="text-neutral-400 text-base">No results available.</p>
          )}
        </div>

        <div className="text-center">
          <Button
            onClick={() => setSubmitted(false)}
            color="primary"
            size="lg"
            auto
            className="transition-transform transform hover:scale-105"
            style={{
              background: 'linear-gradient(110deg, #0d0d12, 45%, #1a1a22, 55%, #0d0d12)',
              color: '#ffffff'
            }}
          >
            Back to Form
          </Button>
        </div>
      </div>
    </div>
  );
}