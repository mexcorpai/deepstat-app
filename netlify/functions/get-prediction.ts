import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import type { PredictionResult, GroundingAttribution } from '../../types';

// This interface defines the expected JSON structure from the AI model
interface PredictionJson {
    teamA: string;
    teamB: string;
    predictedWinner: string;
    winProbability: {
        teamA: number;
        teamB: number;
        draw: number;
    };
    predictedScoreline: string;
    possibleOutcomes: string[];
    analysis: string;
}

// The Netlify handler function.
// It's an async function that receives the request event.
export default async (req: Request) => {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405 });
    }

    try {
        // The API key is securely accessed from Netlify's environment variables
        const apiKey = process.env.API_KEY;
        if (!apiKey) {
            throw new Error("API_KEY environment variable not set.");
        }
        const ai = new GoogleGenAI({ apiKey });

        const { matchData } = await req.json();
        if (!matchData) {
            return new Response(JSON.stringify({ error: 'matchData is required' }), { status: 400 });
        }

        const model = 'gemini-2.5-flash';

        const prompt = `
          You are DeepStat, the world's most advanced football match analysis engine, created by Mexcorp Group. Your predictions are extremely precise and accurate.
          Combine your internal knowledge with real-time web search to analyze the provided data for an upcoming football match.
          Your goal is to identify the two teams from the data, predict the winner, win probability, the most likely final score, and two possible narrative outcomes.
          You must also provide a detailed analysis justifying your prediction.
    
          Match Data:
          ---
          ${matchData}
          ---
    
          Instructions:
          1. Carefully parse the 'Match Data' to identify the two competing teams. Name them "teamA" and "teamB" in your JSON output.
          2. Analyze all provided data points: form, tactics, key players, historical performance, etc.
          3. Use web search to find the latest information, including player injuries, team news, and recent head-to-head results to supplement the provided data.
          4. Synthesize all information to make your predictions.
          5. Your entire response MUST be a single, valid JSON object. Do not include any text before or after the JSON object. Do not use markdown backticks like \`\`\`json.
          6. The 'winProbability' values for teamA, teamB, and draw must sum to 100.
    
          The JSON object must have this exact structure:
          {
            "teamA": "string (name of the first team you identified)",
            "teamB": "string (name of the second team you identified)",
            "predictedWinner": "string (name of the winning team, or 'Draw')",
            "winProbability": {
              "teamA": number (percentage, 0-100 for the team in the 'teamA' field),
              "teamB": number (percentage, 0-100 for the team in the 'teamB' field),
              "draw": number (percentage, 0-100)
            },
            "predictedScoreline": "string (e.g., '2-1')",
            "possibleOutcomes": ["string (first likely scenario)", "string (second likely scenario)"],
            "analysis": "string (detailed reasoning for your prediction)"
          }
        `;
        
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }],
            }
        });

        const responseText = response.text.trim();
        let json: PredictionJson;
        try {
            json = JSON.parse(responseText);
        } catch (e) {
             console.error("Failed to parse JSON response:", responseText);
             throw new Error("The AI returned an unexpected response format. Please try again.");
        }
        
        const teamAName = json.teamA;
        const teamBName = json.teamB;

        const prediction: PredictionResult = {
            predictedWinner: json.predictedWinner,
            winProbability: {
                [teamAName]: json.winProbability.teamA,
                [teamBName]: json.winProbability.teamB,
                Draw: json.winProbability.draw,
            },
            predictedScoreline: json.predictedScoreline,
            possibleOutcomes: json.possibleOutcomes,
            analysis: json.analysis,
        };

        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];
        const attribution: GroundingAttribution[] = groundingChunks
            .map(chunk => ({
                uri: chunk.web?.uri ?? '',
                title: chunk.web?.title ?? '',
            }))
            .filter(attr => attr.uri);

        // Return a successful response with the data
        return new Response(JSON.stringify({ prediction, attribution, teamAName, teamBName }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error("Error in serverless function:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown server error occurred.";
        return new Response(JSON.stringify({ error: errorMessage }), { status: 500 });
    }
};
