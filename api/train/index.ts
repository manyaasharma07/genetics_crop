import { NextApiRequest, NextApiResponse } from 'next';
import { RandomForestClassifier } from 'ml-random-forest';
import { getAllCropTraits, updateMLModelStatus, storeModel } from '../../lib/models';
import { LabelEncoder, Scaler } from '../../lib/ml/preprocessing';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('🚀 Starting ML model training...');

    // Get data from database
    const traits = await getAllCropTraits();
    if (traits.length === 0) {
      return res.status(400).json({ error: 'No training data available. Please upload a dataset first.' });
    }

    console.log(`📊 Training on ${traits.length} samples`);

    // Prepare data
    const X = traits.map(trait => [
      ...Object.values(trait.geneticTraits),
      ...Object.values(trait.environmentalTraits),
    ]);

    const y = traits.map(trait => trait.recommendation);

    // Encode labels
    const labelEncoder = new LabelEncoder();
    const yEncoded = y.map(label => labelEncoder.fitTransform(label));

    // Scale features
    const scaler = new Scaler();
    const XScaled = scaler.fitTransform(X);

    // Split data (80/20)
    const splitIndex = Math.floor(XScaled.length * 0.8);
    const XTrain = XScaled.slice(0, splitIndex);
    const XTest = XScaled.slice(splitIndex);
    const yTrain = yEncoded.slice(0, splitIndex);
    const yTest = yEncoded.slice(splitIndex);

    // Train model
    console.log('🤖 Training RandomForest model...');
    const model = new RandomForestClassifier({
      nEstimators: 100,
      maxDepth: 10,
      randomSeed: 42,
    });
    model.train(XTrain, yTrain);

    // Evaluate
    const predictions = model.predict(XTest);
    const accuracy = predictions.reduce((acc, pred, i) =>
      acc + (pred === yTest[i] ? 1 : 0), 0) / predictions.length;

    console.log(`✅ Model trained with ${accuracy.toFixed(4)} accuracy`);

    // Serialize model
    const modelData = {
      model: model.toJSON(),
      labelEncoder: labelEncoder.toJSON(),
      scaler: scaler.toJSON(),
    };

    const modelBuffer = Buffer.from(JSON.stringify(modelData));

    // Store model
    const filename = `model_v${Date.now()}.json`;
    await storeModel(modelBuffer, filename);

    // Update status
    await updateMLModelStatus({
      isTrained: true,
      trainedAt: new Date(),
      datasetName: 'crop_traits',
      modelVersion: filename,
      accuracy,
      trainingStats: {
        trainSize: XTrain.length,
        testSize: XTest.length,
      },
    });

    res.status(200).json({
      message: 'Model trained successfully',
      accuracy,
      trainingStats: {
        trainSize: XTrain.length,
        testSize: XTest.length,
      },
    });
  } catch (error) {
    console.error('Training error:', error);
    res.status(500).json({ error: 'Training failed', details: error.message });
  }
}