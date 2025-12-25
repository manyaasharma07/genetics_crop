import { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import Papa from 'papaparse';
import { insertCropTraits } from '../../lib/models';

// Configure multer for file upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

export const config = {
  api: {
    bodyParser: false,
  },
};

const runMiddleware = (req: NextApiRequest, res: NextApiResponse, fn: Function) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Run multer middleware
    await runMiddleware(req, res, upload.single('dataset'));

    const file = (req as any).file;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Parse CSV
    const csvData = file.buffer.toString('utf-8');
    const parsed = Papa.parse(csvData, {
      header: true,
      skipEmptyLines: true,
    });

    if (parsed.errors.length > 0) {
      return res.status(400).json({ error: 'Invalid CSV format', details: parsed.errors });
    }

    // Process and validate data
    const traits = parsed.data.map((row: any) => ({
      crop: row.crop || row.Crop,
      region: row.region || row.Region,
      geneticTraits: {
        height: parseFloat(row.height || row.Height) || 0,
        yield: parseFloat(row.yield || row.Yield) || 0,
        diseaseResistance: parseFloat(row.disease_resistance || row['Disease Resistance']) || 0,
      },
      environmentalTraits: {
        temperature: parseFloat(row.temperature || row.Temperature) || 0,
        humidity: parseFloat(row.humidity || row.Humidity) || 0,
        soilPh: parseFloat(row.soil_ph || row['Soil pH']) || 0,
      },
      recommendation: row.recommendation || row.Recommendation || 'Standard',
    }));

    // Insert into database
    const result = await insertCropTraits(traits);

    res.status(200).json({
      message: 'Dataset uploaded successfully',
      insertedCount: result.insertedCount,
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}