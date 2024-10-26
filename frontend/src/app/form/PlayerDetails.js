'use client';
import React from 'react';
import { Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, LineElement, PointElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, ArcElement, LineElement, PointElement, CategoryScale, LinearScale);

export default function PlayerDetails({ result, teamname }) {
    // Destructure the result object with default values for safety
    const {
        away_goals = 0,
        goals_against_teams = {},
        goals_by_date = {},
        goals_in_losses = 0,
        goals_in_wins = 0,
        home_goals = 0,
        own_goals = 0,
        penalty_goals = 0,
        total_goals = 0
    } = result || {};

    // Remove the teamname from goals_against_teams if it exists
    const filteredGoalsAgainstTeams = { ...goals_against_teams };
    if (teamname in filteredGoalsAgainstTeams) {
        delete filteredGoalsAgainstTeams[teamname];
    }

    // Prepare data for the pie chart
    const pieData = {
        labels: Object.keys(filteredGoalsAgainstTeams),
        datasets: [
            {
                label: 'Goals Against Teams',
                data: Object.values(filteredGoalsAgainstTeams),
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#FF9F40',
                    '#C9CB00',
                    '#E7E9ED',
                    '#FF6F61',
                    '#6B8E23',
                    '#FF8C00',
                    '#20B2AA',
                    '#87CEFA',
                    '#D3D3D3'
                ],
                borderColor: 'rgba(255, 255, 255, 0.5)',
                borderWidth: 1,
            },
        ],
    };

    // Prepare data for the line chart
    const lineLabels = Object.keys(goals_by_date).sort((a, b) => new Date(a) - new Date(b)); // Sort dates if necessary
    const lineData = {
        labels: lineLabels,
        datasets: [
            {
                label: 'Goals by Date',
                data: lineLabels.map(date => goals_by_date[date] || 0), // Ensure data matches labels
                borderColor: '#4BC0C0',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderWidth: 2,
                fill: true,
            },
        ],
    };

    return (
        <div className="p-6 max-w-4xl mx-auto bg-[#0d0d12] shadow-lg rounded-lg flex flex-col space-y-6">
            <h2 className="text-3xl font-bold mb-4 text-center" style={{color: '#c2c2c2'}}>Player Stats</h2>

            <div className="flex flex-wrap gap-6">
                {/* Total Goals */}
                <div className="flex-1 min-w-[150px] bg-[#1a1a22] p-4 rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold text-[#c2c2c2]">Total Goals</h3>
                    <p className="text-2xl font-bold text-[#ffffff]">{total_goals}</p>
                </div>

                {/* Goals in Wins */}
                <div className="flex-1 min-w-[150px] bg-[#1a1a22] p-4 rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold text-[#c2c2c2]">Goals in Wins</h3>
                    <p className="text-2xl font-bold text-[#ffffff]">{goals_in_wins}</p>
                </div>

                {/* Goals in Losses */}
                <div className="flex-1 min-w-[150px] bg-[#1a1a22] p-4 rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold text-[#c2c2c2]">Goals in Losses</h3>
                    <p className="text-2xl font-bold text-[#ffffff]">{goals_in_losses}</p>
                </div>
            </div>

            <div className="flex flex-wrap gap-6">
                {/* Home Goals */}
                <div className="flex-1 min-w-[150px] bg-[#1a1a22] p-4 rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold text-[#c2c2c2]">Home Goals</h3>
                    <p className="text-2xl font-bold text-[#ffffff]">{home_goals}</p>
                </div>

                {/* Away Goals */}
                <div className="flex-1 min-w-[150px] bg-[#1a1a22] p-4 rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold text-[#c2c2c2]">Away Goals</h3>
                    <p className="text-2xl font-bold text-[#ffffff]">{away_goals}</p>
                </div>

                {/* Own Goals */}
                <div className="flex-1 min-w-[150px] bg-[#1a1a22] p-4 rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold text-[#c2c2c2]">Own Goals</h3>
                    <p className="text-2xl font-bold text-[#ffffff]">{own_goals}</p>
                </div>

                {/* Penalty Goals */}
                <div className="flex-1 min-w-[150px] bg-[#1a1a22] p-4 rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold text-[#c2c2c2]">Penalty Goals</h3>
                    <p className="text-2xl font-bold text-[#ffffff]">{penalty_goals}</p>
                </div>
            </div>

            {/* Goals Against Teams Pie Chart */}
            {Object.keys(filteredGoalsAgainstTeams).length > 0 && (
                <div className="bg-[#1a1a22] p-4 rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold text-[#c2c2c2] mb-4">Goals Against Teams</h3>
                    <div className="relative h-64">
                        <Pie data={pieData} options={{ responsive: true, maintainAspectRatio: false }} />
                    </div>
                </div>
            )}

            {/* Goals by Date Line Chart */}
            {Object.keys(goals_by_date).length > 0 && (
                <div className="bg-[#1a1a22] p-4 rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold text-[#c2c2c2] mb-4">Goals by Date</h3>
                    <div className="relative h-64">
                        <Line data={lineData} options={{ responsive: true, maintainAspectRatio: false }} />
                    </div>
                </div>
            )}
        </div>
    );
}