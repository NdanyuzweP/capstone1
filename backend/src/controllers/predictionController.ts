import { Request, Response } from 'express';
import { PythonShell } from 'python-shell';
import path from 'path';

interface PredictionRequest {
  Hour: number;
  Day_of_Week: string;
  Road_Name: string;
  Population_Density: string;
  Rainfall: string;
  Public_Holiday: string;
}

interface ModelPrediction {
  prediction: string;
  confidence: number;
  probabilities?: Record<string, number>;
  success?: boolean;
  error?: string;
}

export const predictTraffic = async (req: Request, res: Response): Promise<any> => {
  try {
    const {
      Hour,
      Day_of_Week,
      Road_Name,
      Population_Density,
      Rainfall,
      Public_Holiday
    }: PredictionRequest = req.body;

    // Validate required fields
    if (!Hour || !Day_of_Week || !Road_Name || !Population_Density || !Rainfall || !Public_Holiday) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['Hour', 'Day_of_Week', 'Road_Name', 'Population_Density', 'Rainfall', 'Public_Holiday']
      });
    }

    // Prepare input data for the model
    const inputData = {
      Hour,
      Day_of_Week,
      Road_Name,
      Population_Density,
      Rainfall,
      Public_Holiday
    };

    // Call Python script for ML prediction
    const modelResult = await callMLModel(inputData);
    
    if (modelResult.error) {
      console.error('ML Model Error:', modelResult.error);
      return res.status(500).json({ 
        error: 'Model prediction failed',
        details: modelResult.error 
      });
    }

    // Generate recommendations based on prediction
    const recommendations = generateRecommendations(modelResult.prediction, Rainfall);

    const result = {
      prediction: modelResult.prediction,
      confidence: modelResult.confidence,
      description: `${modelResult.prediction} traffic expected on ${Road_Name}`,
      recommendations,
      analysis: {
        time: `${Hour}:00`,
        road: Road_Name,
        conditions: Rainfall === 'Yes' ? 'Rainy' : 'Clear',
        timestamp: new Date().toISOString()
      },
      probabilities: modelResult.probabilities
    };

    console.log('Traffic prediction:', {
      input: inputData,
      result
    });

    res.json(result);
  } catch (error) {
    console.error('Error in traffic prediction:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

async function callMLModel(inputData: any): Promise<ModelPrediction> {
  return new Promise((resolve, reject) => {
    const options = {
      mode: 'json' as const,
      pythonPath: path.join(__dirname, '../../models/venv/bin/python'),
      scriptPath: path.join(__dirname, '../../models'),
      args: []
    };

    console.log('Calling ML model with options:', options);
    console.log('Input data:', inputData);

    const pyshell = new PythonShell('predict.py', options);
    
    // Send input data to Python script
    pyshell.send(JSON.stringify(inputData));
    
    // Handle response from Python script
    pyshell.on('message', (message: ModelPrediction) => {
      console.log('ML model response:', message);
      resolve(message);
    });
    
    // Handle errors
    pyshell.on('error', (err) => {
      console.error('Python script error:', err);
      resolve({ 
        error: 'Failed to execute ML model',
        prediction: 'Medium',
        confidence: 50
      });
    });
  });
}

function generateRecommendations(prediction: string, rainfall: string): string[] {
  const recommendations = [];
  
  if (prediction === 'High') {
    recommendations.push('Consider alternative routes');
    recommendations.push('Allow extra travel time');
    recommendations.push('Check real-time updates');
  } else if (prediction === 'Medium') {
    recommendations.push('Plan your route in advance');
    recommendations.push('Monitor traffic updates');
  } else {
    recommendations.push('Normal travel conditions expected');
    recommendations.push('Standard travel time should be sufficient');
  }
  
  // Add weather-specific recommendations
  if (rainfall === 'Yes') {
    recommendations.push('Drive carefully in wet conditions');
  }
  
  return recommendations;
} 