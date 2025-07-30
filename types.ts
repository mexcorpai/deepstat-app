export interface PredictionResult {
  predictedWinner: string;
  winProbability: {
    [key: string]: number; // e.g., { "Team A": 45, "Team B": 35, "Draw": 20 }
  };
  predictedScoreline: string;
  possibleOutcomes: string[];
  analysis: string;
}

export interface GroundingAttribution {
  uri: string;
  title: string;
}
