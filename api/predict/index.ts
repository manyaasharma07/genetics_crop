import { NextApiRequest, NextApiResponse } from 'next';
import { RandomForestClassifier } from 'ml-random-forest';
import { getMLModelStatus, getModel } from '../../lib/models';
import { LabelEncoder, Scaler } from '../../lib/ml/preprocessing';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { geneticTraits, environmentalTraits } = req.body;

    if (!geneticTraits || !environmentalTraits) {
      return res.status(400).json({ error: 'Missing geneticTraits or environmentalTraits' });
    }

    // Check if model is trained
    const status = await getMLModelStatus();
    if (!status?.isTrained || !status.modelVersion) {
      return res.status(400).json({ error: 'Model not trained yet' });
    }

    // Load model
    const downloadStream = getModel(status.modelVersion);
    let modelData = '';

    await new Promise((resolve, reject) => {
      downloadStream.on('data', (chunk) => {
        modelData += chunk.toString();
      });
      downloadStream.on('end', resolve);
      downloadStream.on('error', reject);
    });

    const { model: modelJSON, labelEncoder: encoderJSON, scaler: scalerJSON } = JSON.parse(modelData);

    // Reconstruct model
    const model = RandomForestClassifier.load(modelJSON);
    const labelEncoder = new LabelEncoder();
    labelEncoder.fromJSON(encoderJSON);
    const scaler = new Scaler();
    scaler.fromJSON(scalerJSON);

    // Prepare input
    const features = [
      ...Object.values(geneticTraits),
      ...Object.values(environmentalTraits),
    ];

    // Scale features
    const scaledFeatures = scaler.transform([features]);

    // Predict
    const prediction = model.predict(scaledFeatures)[0];
    const recommendation = labelEncoder.inverseTransform(prediction);

    res.status(200).json({
      recommendation,
      confidence: 0.85, // Placeholder - could calculate actual confidence
    });
  } catch (error) {
    console.error('Prediction error:', error);
    res.status(500).json({ error: 'Prediction failed', details: error.message });
  }
}