/**
 * Dataset Loading and Validation
 * Loads CSV, validates schema, and handles missing values
 */

import Papa from 'papaparse';
import { ML_CONFIG } from './config';

export interface RawDataRow {
  N: number;
  P: number;
  K: number;
  temperature: number;
  humidity: number;
  ph: number;
  rainfall: number;
  label: string;
}

export interface LoadedDataset {
  features: number[][];
  labels: string[];
  rawData: RawDataRow[];
  stats: DatasetStats;
}

export interface DatasetStats {
  totalRows: number;
  validRows: number;
  invalidRows: number;
  missingValues: Record<string, number>;
  labelDistribution: Record<string, number>;
  featureStats: Record<string, { min: number; max: number; mean: number; std: number }>;
}

/**
 * Load and parse CSV file
 */
export async function loadDataset(csvPath?: string): Promise<LoadedDataset> {
  const path = csvPath || ML_CONFIG.datasetPath;
  
  try {
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(`Failed to load dataset: ${response.statusText}`);
    }
    
    const csvText = await response.text();
    
    return new Promise((resolve, reject) => {
      Papa.parse<Record<string, string>>(csvText, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header) => header.trim(),
        complete: (results) => {
          try {
            const dataset = parseAndValidate(results.data);
            resolve(dataset);
          } catch (error) {
            reject(error);
          }
        },
        error: (error) => reject(error),
      });
    });
  } catch (error) {
    throw new Error(`Error loading dataset from ${path}: ${error}`);
  }
}

/**
 * Parse and validate CSV data
 */
function parseAndValidate(data: Record<string, string>[]): LoadedDataset {
  const features: number[][] = [];
  const labels: string[] = [];
  const rawData: RawDataRow[] = [];
  const invalidRows: number[] = [];
  
  const featureColumns = ML_CONFIG.features;
  const missingCounts: Record<string, number> = {};
  const labelCounts: Record<string, number> = {};
  
  // Initialize missing value counters
  featureColumns.forEach(col => { missingCounts[col] = 0; });
  
  data.forEach((row, index) => {
    try {
      // Validate and parse features
      const featureValues: number[] = [];
      let isValid = true;
      
      for (const col of featureColumns) {
        const value = row[col]?.trim();
        if (!value || value === '' || value === 'NaN' || value === 'null') {
          missingCounts[col]++;
          isValid = false;
          break;
        }
        
        const numValue = parseFloat(value);
        if (isNaN(numValue)) {
          missingCounts[col]++;
          isValid = false;
          break;
        }
        
        featureValues.push(numValue);
      }
      
      // Validate label
      const label = row[ML_CONFIG.target]?.trim();
      if (!label || label === '') {
        isValid = false;
      }
      
      if (!isValid) {
        invalidRows.push(index + 1); // 1-indexed for user display
        return;
      }
      
      // Store valid row
      features.push(featureValues);
      labels.push(label);
      labelCounts[label] = (labelCounts[label] || 0) + 1;
      
      rawData.push({
        N: featureValues[0],
        P: featureValues[1],
        K: featureValues[2],
        temperature: featureValues[3],
        humidity: featureValues[4],
        ph: featureValues[5],
        rainfall: featureValues[6],
        label,
      });
    } catch (error) {
      invalidRows.push(index + 1);
    }
  });
  
  // Calculate feature statistics
  const featureStats: DatasetStats['featureStats'] = {};
  featureColumns.forEach((col, idx) => {
    const values = features.map(row => row[idx]);
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    const std = Math.sqrt(variance);
    
    featureStats[col] = {
      min: Math.min(...values),
      max: Math.max(...values),
      mean,
      std,
    };
  });
  
  const stats: DatasetStats = {
    totalRows: data.length,
    validRows: features.length,
    invalidRows: invalidRows.length,
    missingValues: missingCounts,
    labelDistribution: labelCounts,
    featureStats,
  };
  
  if (features.length === 0) {
    throw new Error('No valid rows found in dataset');
  }
  
  return {
    features,
    labels,
    rawData,
    stats,
  };
}

/**
 * Split dataset into training and testing sets
 */
export function trainTestSplit(
  features: number[][],
  labels: string[],
  testSize: number = ML_CONFIG.training.testSplit,
  randomSeed?: number
): {
  trainFeatures: number[][];
  trainLabels: string[];
  testFeatures: number[][];
  testLabels: string[];
} {
  // Simple shuffle with seed
  const shuffled = features.map((feat, idx) => ({ feat, label: labels[idx] }));
  
  // Simple seeded shuffle (not cryptographically secure, but deterministic)
  if (randomSeed !== undefined) {
    let seed = randomSeed;
    const random = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
    
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
  } else {
    // Fisher-Yates shuffle
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
  }
  
  const splitIndex = Math.floor(shuffled.length * (1 - testSize));
  
  return {
    trainFeatures: shuffled.slice(0, splitIndex).map(item => item.feat),
    trainLabels: shuffled.slice(0, splitIndex).map(item => item.label),
    testFeatures: shuffled.slice(splitIndex).map(item => item.feat),
    testLabels: shuffled.slice(splitIndex).map(item => item.label),
  };
}

