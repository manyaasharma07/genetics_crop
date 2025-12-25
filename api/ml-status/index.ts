import { NextApiRequest, NextApiResponse } from 'next';
import { getMLModelStatus } from '../../lib/models';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const status = await getMLModelStatus();
    res.status(200).json(status || { isTrained: false });
  } catch (error) {
    console.error('Status fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch ML status' });
  }
}