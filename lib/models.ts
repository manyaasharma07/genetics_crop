import clientPromise from './mongodb';

export interface User {
  _id?: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  name: string;
  createdAt: Date;
}

export interface CropTrait {
  _id?: string;
  crop: string;
  region: string;
  geneticTraits: Record<string, number>;
  environmentalTraits: Record<string, number>;
  recommendation: string;
  uploadedAt: Date;
}

export interface MLModelStatus {
  _id?: string;
  isTrained: boolean;
  trainedAt?: Date;
  datasetName?: string;
  modelVersion?: string;
  accuracy?: number;
  trainingStats?: {
    trainSize: number;
    testSize: number;
  };
}

// Initialize database indexes
export async function initDatabase() {
  const client = await clientPromise;
  const db = client.db('crop_genetics');

  // Create unique index on users.email
  await db.collection('users').createIndex({ email: 1 }, { unique: true });

  console.log('Database indexes initialized');
}

// Users collection functions
export async function createUser(user: Omit<User, '_id' | 'createdAt'>) {
  const client = await clientPromise;
  const db = client.db('crop_genetics');
  const result = await db.collection('users').insertOne({
    ...user,
    createdAt: new Date(),
  });
  return result;
}

export async function findUserByEmail(email: string) {
  const client = await clientPromise;
  const db = client.db('crop_genetics');
  return await db.collection('users').findOne({ email });
}

// Crop traits functions
export async function insertCropTraits(traits: Omit<CropTrait, '_id' | 'uploadedAt'>[]) {
  const client = await clientPromise;
  const db = client.db('crop_genetics');
  const result = await db.collection('crop_traits').insertMany(
    traits.map(trait => ({
      ...trait,
      uploadedAt: new Date(),
    }))
  );
  return result;
}

export async function getAllCropTraits() {
  const client = await clientPromise;
  const db = client.db('crop_genetics');
  return await db.collection('crop_traits').find({}).toArray();
}

// ML Model Status functions
export async function getMLModelStatus() {
  const client = await clientPromise;
  const db = client.db('crop_genetics');
  return await db.collection('ml_model_status').findOne({});
}

export async function updateMLModelStatus(status: Partial<MLModelStatus>) {
  const client = await clientPromise;
  const db = client.db('crop_genetics');
  return await db.collection('ml_model_status').updateOne(
    {},
    { $set: status },
    { upsert: true }
  );
}

// Store model binary
export async function storeModel(modelBuffer: Buffer, filename: string) {
  const client = await clientPromise;
  const db = client.db('crop_genetics');
  const bucket = new (await import('mongodb')).GridFSBucket(db, { bucketName: 'models' });
  const uploadStream = bucket.openUploadStream(filename);
  uploadStream.write(modelBuffer);
  uploadStream.end();
  return new Promise((resolve, reject) => {
    uploadStream.on('finish', resolve);
    uploadStream.on('error', reject);
  });
}

export async function getModel(filename: string) {
  const client = await clientPromise;
  const db = client.db('crop_genetics');
  const bucket = new (await import('mongodb')).GridFSBucket(db, { bucketName: 'models' });
  return bucket.openDownloadStreamByName(filename);
}