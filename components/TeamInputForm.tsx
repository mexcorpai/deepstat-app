import React, { useState } from 'react';

interface TeamInputFormProps {
  onPredict: (matchData: string) => void;
  isLoading: boolean;
}

const TeamInputForm: React.FC<TeamInputFormProps> = ({ onPredict, isLoading }) => {
  const [matchData, setMatchData] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (matchData) {
      onPredict(matchData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-4 p-6 bg-white/5 border border-white/20 rounded-xl backdrop-blur-lg">
        <h3 className="text-2xl font-bold text-white">Match Data</h3>
        <div>
          <label htmlFor="match-data" className="block text-sm font-medium text-gray-300 mb-1">
            Enter all available information about the two competing teams below.
          </label>
          <textarea
            id="match-data"
            rows={8}
            value={matchData}
            onChange={(e) => setMatchData(e.target.value)}
            className="w-full bg-white/10 text-white rounded-md border-gray-600 focus:ring-sky-500 focus:border-sky-500 transition"
            placeholder="e.g., Manchester City (Form: WWWDW, Key Players: Haaland) vs Liverpool (Form: WLDWW, Key Players: Salah)..."
            required
          />
           <p className="text-xs text-gray-400 mt-2">Include team names, form, key players, tactics, injuries, and any other relevant data.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <button
            type="submit"
            disabled={isLoading || !matchData}
            className="w-full sm:w-auto px-12 py-4 text-lg font-bold text-white bg-gradient-to-r from-sky-500 to-blue-600 rounded-lg hover:from-sky-600 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-sky-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
        >
          {isLoading ? 'Analyzing...' : 'Get Results'}
        </button>
      </div>
    </form>
  );
};

export default TeamInputForm;
