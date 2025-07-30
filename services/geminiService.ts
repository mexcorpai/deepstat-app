import type { PredictionResult, GroundingAttribution } from '../types';

export const getPrediction = async (
    matchData: string
): Promise<{ prediction: PredictionResult; attribution: GroundingAttribution[], teamAName: string, teamBName: string }> => {
    // The frontend now calls our own secure serverless function.
    // The function's path is determined by its filename in the netlify/functions directory.
    const endpoint = '/.netlify/functions/get-prediction';

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ matchData }),
        });

        if (!response.ok) {
            const errorBody = await response.json();
            throw new Error(errorBody.error || `Request failed with status ${response.status}`);
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error("Error calling serverless function:", error);
        if (error instanceof Error) {
            throw new Error(`An error occurred while fetching the prediction: ${error.message}`);
        }
        throw new Error("An unknown error occurred while fetching the prediction.");
    }
};
