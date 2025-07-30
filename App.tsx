import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import TeamInputForm from './components/TeamInputForm';
import PredictionDisplay from './components/PredictionDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import Attribution from './components/Attribution';
import { getPrediction } from './services/geminiService';
import type { PredictionResult, GroundingAttribution } from './types';

const CoffeeModal = ({ onClose }: { onClose: () => void }) => (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fade-in" onClick={onClose}>
        <div className="bg-gray-800 rounded-2xl p-8 m-4 max-w-sm w-full shadow-2xl border border-gray-700" onClick={e => e.stopPropagation()}>
            <h3 className="text-2xl font-bold text-sky-400 mb-4">Buy a coffee for the creator</h3>
            <div className="space-y-3 text-gray-200">
                <p><span className="font-semibold text-gray-400">Account Name:</span> Gbogi David</p>
                <p><span className="font-semibold text-gray-400">Account Number:</span> 9038000666</p>
                <p><span className="font-semibold text-gray-400">Bank Name:</span> Opay</p>
            </div>
            <button
                onClick={onClose}
                className="mt-6 w-full py-2.5 text-lg font-bold text-white bg-sky-600 rounded-lg hover:bg-sky-700 focus:outline-none focus:ring-4 focus:ring-sky-500/50 transition-colors duration-300"
            >
                Close
            </button>
        </div>
    </div>
);


const App: React.FC = () => {
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [attribution, setAttribution] = useState<GroundingAttribution[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [teamNames, setTeamNames] = useState<{a: string, b: string}>({a: '', b: ''});
  const [showCoffeeInfo, setShowCoffeeInfo] = useState<boolean>(false);

  const handlePredict = useCallback(async (matchData: string) => {
    setIsLoading(true);
    setError(null);
    setPrediction(null);
    setAttribution([]);
    setTeamNames({ a: '', b: '' });

    try {
      const { prediction: result, attribution: sources, teamAName, teamBName } = await getPrediction(matchData);
      setPrediction(result);
      setAttribution(sources);
      setTeamNames({ a: teamAName, b: teamBName });
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="bg-gradient-to-br from-gray-900 to-blue-900/50 min-h-screen text-white flex flex-col">
       {showCoffeeInfo && <CoffeeModal onClose={() => setShowCoffeeInfo(false)} />}
       <div className="absolute top-4 right-4 z-10">
          <button 
            onClick={() => setShowCoffeeInfo(true)}
            className="px-4 py-2 text-sm font-semibold text-white bg-gray-700/50 rounded-lg hover:bg-gray-700/80 focus:outline-none focus:ring-4 focus:ring-gray-600/50 transition-colors backdrop-blur-sm"
          >
            Buy a coffee for the creator
          </button>
       </div>

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8">
        <Header />
        
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <TeamInputForm onPredict={handlePredict} isLoading={isLoading} />
          </div>

          {isLoading && <LoadingSpinner />}
          
          {error && (
            <div className="mt-8 text-center p-4 bg-red-900/50 border border-red-700 rounded-lg animate-fade-in">
              <h3 className="text-xl font-bold text-red-300">Error</h3>
              <p className="text-red-400 mt-2">{error}</p>
            </div>
          )}

          {prediction && teamNames.a && teamNames.b && (
            <div>
              <PredictionDisplay result={prediction} teamAName={teamNames.a} teamBName={teamNames.b} />
              <Attribution sources={attribution} />
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;
