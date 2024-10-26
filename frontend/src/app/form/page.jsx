"use client"; // Ensure the component is client-side
import { teams } from "./teams";
import Image from "next/image";
import { players } from "./players";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Import from 'next/navigation' for client-side routing
import Droplist from "../components/Droplist"; // Assuming Droplist is a valid component from your project
import FromInputs from "./forminputs";
import Predictedoutput from "./Predictedoutput";
import PlayerDetails from "./PlayerDetails";
import Navbar from "@/components/Navbar";
export default function Page() {
  const [loading, setLoading] = useState(false);
  const [playerName, setPlayerName] = useState(""); // State for player name
  const [playerTeam, setPlayerTeam] = useState(""); // State for player team
  const [opponentTeam, setOpponentTeam] = useState(""); // State for opponent team
  const [status, setStatus] = useState(""); // State for status
  const [model, setModel] = useState(""); // State for model
  const [submitted, setSubmitted] = useState(false); // State to toggle between form and result
  const [resultLines, setResultLines] = useState([]);
  const [report, setReport] = useState([]);
  const router = useRouter(); // Initialize router from 'next/navigation'

  const allTeams = ["Team A", "Team B", "Team C", "Team D"];
  const playerArray = ["Player 1", "Player 2", "Player 3", "Player 4"];
  const statusArray = ["Winner", "Loser"];
  const modelArray = [
    "xgboost_model",
    "svr_model",
    "linear_regression_model",
    "knn_model",
  ];

  const getAvailableTeams = (selectedTeams) => {
    return teams.filter((team) => !selectedTeams.includes(team));
  };

  const availableTeamsForPlayerTeam = getAvailableTeams([opponentTeam]);
  const availableTeamsForOpponentTeam = getAvailableTeams([playerTeam]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const cookies = document.cookie.split("; ").reduce((acc, cookie) => {
        const [name, value] = cookie.split("=");
        acc[name] = value;
        return acc;
      }, {});

      if (!cookies.authToken) {
        router.push("/");
      }
    }
  }, [router]);

  async function handleSubmit() {
    setLoading(true);
    const payload = {
      model_name: model,
      player: playerName,
      team: playerTeam,
      opponent: opponentTeam,
      status: status === "Winner" ? 1 : 0,
    };

    try {
      const submitResponse = await fetch("http://localhost:3002/auth/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!submitResponse.ok) {
        throw new Error(
          "Error in submitting form: Network response was not ok"
        );
      }

      const submitResult = await submitResponse.json();
      const resultLines = submitResult.result
        .split("\r\n")
        .map((line) => line.trim())
        .filter((line) => line);
      setResultLines(resultLines);
      setSubmitted(true);

      const reportResponse = await fetch(
        "http://localhost:3002/auth/getreport",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ player: playerName }),
        }
      );

      if (!reportResponse.ok) {
        throw new Error(
          "Error in fetching report: Network response was not ok"
        );
      }

      const reportData = await reportResponse.json();
      setReport(reportData.result);
    } catch (error) {
      console.error("Error during form submission:", error);
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div>
        <div className="relative w-full flex items-center justify-center ">
          <Navbar />
        </div>
        <div
          style={{
            textAlign: "center",
            marginTop: "30px",
            fontWeight: "600px",
            fontSize: "30px",
            marginTop: "120px",
          }}
        >
          <h1 className="mt-20 md:mt-0 text-6xl md:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
            Predicted Output
          </h1>
        </div>

        <div className="container mx-auto p-6 flex space-x-6">
          <div style={{ position: "sticky", top: "0", height: "fit-content" }}>
            <Predictedoutput
              playerName={playerName}
              playerTeam={playerTeam}
              opponentTeam={opponentTeam}
              status={status}
              model={model}
              resultLines={resultLines}
              setSubmitted={setSubmitted}
            />
          </div>
          <div style={{ flexGrow: 1, overflowY: "auto", height: "100vh" }}>
            <PlayerDetails result={report} teamname={playerTeam} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div
        style={{
          textAlign: "center",
          fontSize: "30px",
          fontWeight: "600",
          marginTop: 100,
        }}
      >
        <h1 className="mt-20 md:mt-0 text-6xl md:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
          Socculator 1.0
        </h1>
      </div>
      {loading && (
        <div className="flex justify-center items-center mt-20">
          <div role="status">
            <svg
              aria-hidden="true"
              className="w-8 h-8 text-gray-200 animate-spin fill-blue-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      )}
      {!loading && (
        <>
          <div className="relative w-full flex items-center justify-center ">
            <Navbar />
          </div>
          <FromInputs
            players={players}
            playerName={playerName}
            playerTeam={playerTeam}
            opponentTeam={opponentTeam}
            status={status}
            model={model}
            availableTeamsForPlayerTeam={availableTeamsForPlayerTeam}
            availableTeamsForOpponentTeam={availableTeamsForOpponentTeam}
            statusArray={statusArray}
            modelArray={modelArray}
            setPlayerName={setPlayerName}
            setPlayerTeam={setPlayerTeam}
            setOpponentTeam={setOpponentTeam}
            setStatus={setStatus}
            setModel={setModel}
            handleSubmit={handleSubmit}
          />
        </>
      )}
    </div>
  );
}
