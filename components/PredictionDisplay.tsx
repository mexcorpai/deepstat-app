import React from 'react';
import type { PredictionResult } from '../types';
import TrophyIcon from './icons/TrophyIcon';

interface PredictionDisplayProps {
  result: PredictionResult;
  teamAName: string;
  teamBName: string;
}

const colorMap = {
    teamA: 'bg-blue-600',
    teamB: 'bg-red-600',
    Draw: 'bg-yellow-500'
};

const ProbabilityBar = ({ label, percentage, colorClass }: { label: string, percentage: number, colorClass: string }) => (
    <div>
        <div className="flex justify-between mb-1">
            <span className="text-base font-medium text-gray-300">{label}</span>
            <span className="text-sm font-medium text-white">{percentage.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2.5">
            <div className={`${colorClass} h-2.5 rounded-full transition-all duration-500`} style={{ width: `${percentage}%` }}></div>
        </div>
    </div>
);

const PredictionDisplay: React.FC<PredictionDisplayProps> = ({ result, teamAName, teamBName }) => {
  const teamAProb = result.winProbability[teamAName] ?? 0;
  const teamBProb = result.winProbability[teamBName] ?? 0;
  const drawProb = result.winProbability['Draw'] ?? 0;

  return (
    <div className="space-y-8 animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center">
            <div className="p-6 bg-gray-800/50 border border-gray-700 rounded-xl">
                <h4 className="text-lg font-semibold text-sky-400 mb-2">Predicted Winner</h4>
                <div className="flex items-center justify-center space-x-4">
                    <TrophyIcon className="h-12 w-12 text-yellow-400" />
                    <p className="text-4xl font-black text-white">{result.predictedWinner}</p>
                </div>
            </div>
            <div className="p-6 bg-gray-800/50 border border-gray-700 rounded-xl">
                <h4 className="text-lg font-semibold text-sky-400 mb-2">Predicted Scoreline</h4>
                <p className="text-5xl font-black text-white tracking-wider">{result.predictedScoreline}</p>
            </div>
        </div>

        <div className="p-6 bg-gray-800/50 border border-gray-700 rounded-xl">
            <h4 className="text-xl font-bold text-white mb-4 text-center">Win Probability</h4>
            <div className="space-y-4">
                <ProbabilityBar label={teamAName} percentage={teamAProb} colorClass={colorMap.teamA} />
                <ProbabilityBar label={teamBName} percentage={teamBProb} colorClass={colorMap.teamB} />
                <ProbabilityBar label="Draw" percentage={drawProb} colorClass={colorMap.Draw} />
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="p-6 bg-gray-800/50 border border-gray-700 rounded-xl">
                <h4 className="text-xl font-bold text-white mb-3">Possible Outcomes</h4>
                <ul className="space-y-3 list-disc list-inside text-gray-300">
                    {result.possibleOutcomes.map((outcome, index) => (
                        <li key={index}>{outcome}</li>
                    ))}
                </ul>
            </div>
            <div className="p-6 bg-gray-800/50 border border-gray-700 rounded-xl">
                <h4 className="text-xl font-bold text-white mb-3">AI Analysis</h4>
                <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">{result.analysis}</p>
            </div>
        </div>
    </div>
  );
};

export default PredictionDisplay;
