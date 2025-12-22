import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DataTable } from '@/components/dashboard/DataTable';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  Brain,
  Loader2,
  Upload,
  FileSpreadsheet,
  X,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Bookmark,
  History,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const predictionHistory = [
  { id: 1, date: '2024-01-15', inputType: 'Manual', recommendedCrop: 'Rice', yield: '0 t/ha', suitability: '0%', risk: 'Low', saved: true },
  { id: 2, date: '2024-01-14', inputType: 'CSV', recommendedCrop: 'Wheat', yield: '0 t/ha', suitability: '0%', risk: 'Medium', saved: false },
  { id: 3, date: '2024-01-12', inputType: 'Manual', recommendedCrop: 'Maize', yield: '0 t/ha', suitability: '0%', risk: 'Low', saved: true },
  { id: 4, date: '2024-01-10', inputType: 'CSV', recommendedCrop: 'Cotton', yield: '0 t/ha', suitability: '0%', risk: 'High', saved: false },
];

const historyColumns = [
  { key: 'date', label: 'Date' },
  { key: 'inputType', label: 'Input Type' },
  { key: 'recommendedCrop', label: 'Recommended Crop' },
  { key: 'yield', label: 'Expected Yield' },
  { key: 'suitability', label: 'Suitability' },
  { 
    key: 'risk', 
    label: 'Risk Level',
    render: (v: string) => (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
        v === 'Low' ? 'bg-primary/10 text-primary' :
        v === 'Medium' ? 'bg-amber-500/10 text-amber-600' :
        'bg-destructive/10 text-destructive'
      }`}>
        {v === 'Low' ? <CheckCircle2 className="w-3 h-3" /> : 
         v === 'Medium' ? <AlertTriangle className="w-3 h-3" /> :
         <AlertTriangle className="w-3 h-3" />}
        {v}
      </span>
    )
  },
  { 
    key: 'saved', 
    label: 'Saved',
    render: (v: boolean) => v ? <Bookmark className="w-4 h-4 text-primary fill-primary" /> : <Bookmark className="w-4 h-4 text-muted-foreground" />
  },
];

interface PredictionResult {
  crops: Array<{
    name: string;
    yield: string;
    suitability: number;
    risk: string;
    confidence: number;
  }>;
}

export default function Predictions() {
  const [isPrediciting, setIsPredicting] = useState(false);
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleManualPrediction = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPredicting(true);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setPredictionResult({
      crops: [
        { name: 'IR64 Rice', yield: '0 t/ha', suitability: 0, risk: 'Low', confidence: 0 },
        { name: 'Pusa Basmati', yield: '0 t/ha', suitability: 0, risk: 'Low', confidence: 0 },
        { name: 'HD2967 Wheat', yield: '0 t/ha', suitability: 0, risk: 'Medium', confidence: 0 },
        { name: 'NK6240 Maize', yield: '0 t/ha', suitability: 0, risk: 'Medium', confidence: 0 },
        { name: 'BT Cotton', yield: '0 t/ha', suitability: 0, risk: 'High', confidence: 0 },
      ],
    });
    
    setIsPredicting(false);
    toast({
      title: 'Prediction Complete',
      description: 'View recommended crops below.',
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && (file.type === 'text/csv' || file.name.endsWith('.csv'))) {
      setUploadedFile(file);
      toast({
        title: 'CSV Uploaded',
        description: `${file.name} ready for batch prediction.`,
      });
    }
  };

  const handleCSVPrediction = async () => {
    if (!uploadedFile) return;
    
    setIsPredicting(true);
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    setPredictionResult({
      crops: [
        { name: 'Multiple Recommendations', yield: '0 t/ha (avg)', suitability: 0, risk: 'Varies', confidence: 0 },
      ],
    });
    
    setIsPredicting(false);
    toast({
      title: 'Batch Prediction Complete',
      description: '0 rows processed successfully.',
    });
  };

  const handleSavePrediction = () => {
    toast({
      title: 'Prediction Saved',
      description: 'Added to your prediction history.',
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Brain className="w-8 h-8 text-primary" />
            Predictions
          </h1>
          <p className="text-muted-foreground mt-1">Generate crop recommendations using ML models</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Input Data</CardTitle>
                <CardDescription>Enter soil and climate data manually or upload CSV</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="manual" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="manual">Manual Input</TabsTrigger>
                    <TabsTrigger value="csv">CSV Upload</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="manual">
                    <form onSubmit={handleManualPrediction} className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label>Soil pH</Label>
                          <Input type="number" step="0.1" placeholder="0.0" />
                        </div>
                        <div className="space-y-2">
                          <Label>Nitrogen (kg/ha)</Label>
                          <Input type="number" placeholder="0" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label>Phosphorus (kg/ha)</Label>
                          <Input type="number" placeholder="0" />
                        </div>
                        <div className="space-y-2">
                          <Label>Potassium (kg/ha)</Label>
                          <Input type="number" placeholder="0" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label>Temperature (°C)</Label>
                          <Input type="number" placeholder="0" />
                        </div>
                        <div className="space-y-2">
                          <Label>Rainfall (mm)</Label>
                          <Input type="number" placeholder="0" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label>Humidity (%)</Label>
                          <Input type="number" placeholder="0" />
                        </div>
                        <div className="space-y-2">
                          <Label>Region</Label>
                          <Select defaultValue="tropical">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="tropical">Tropical</SelectItem>
                              <SelectItem value="subtropical">Subtropical</SelectItem>
                              <SelectItem value="temperate">Temperate</SelectItem>
                              <SelectItem value="arid">Arid</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <Button 
                        type="submit" 
                        variant="hero" 
                        className="w-full"
                        disabled={isPrediciting}
                      >
                        {isPrediciting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Generating Predictions...
                          </>
                        ) : (
                          <>
                            <Brain className="w-4 h-4" />
                            Get Predictions
                          </>
                        )}
                      </Button>
                    </form>
                  </TabsContent>
                  
                  <TabsContent value="csv">
                    <div className="space-y-4">
                      <div 
                        className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".csv"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                        <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                        <p className="text-sm font-medium text-foreground">
                          {uploadedFile ? uploadedFile.name : 'Upload CSV for Batch Prediction'}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Include soil, climate, and location data
                        </p>
                      </div>

                      {uploadedFile && (
                        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <div className="flex items-center gap-3">
                            <FileSpreadsheet className="w-5 h-5 text-primary" />
                            <div>
                              <p className="text-sm font-medium">{uploadedFile.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {(uploadedFile.size / 1024).toFixed(1)} KB
                              </p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => setUploadedFile(null)}>
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      )}

                      <Button 
                        variant="hero" 
                        className="w-full"
                        disabled={!uploadedFile || isPrediciting}
                        onClick={handleCSVPrediction}
                      >
                        {isPrediciting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Processing CSV...
                          </>
                        ) : (
                          <>
                            <Brain className="w-4 h-4" />
                            Run Batch Prediction
                          </>
                        )}
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>

          {/* Results Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Prediction Results</span>
                  {predictionResult && (
                    <Button variant="outline" size="sm" onClick={handleSavePrediction}>
                      <Bookmark className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                  )}
                </CardTitle>
                <CardDescription>Recommended crops ranked by suitability</CardDescription>
              </CardHeader>
              <CardContent>
                {predictionResult ? (
                  <div className="space-y-4">
                    {predictionResult.crops.map((crop, i) => (
                      <motion.div
                        key={crop.name}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * i }}
                        className="p-4 rounded-lg border border-border bg-muted/30"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-foreground flex items-center gap-2">
                              {i === 0 && <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">Top Pick</span>}
                              {crop.name}
                            </h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              Expected Yield: {crop.yield}
                            </p>
                          </div>
                          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            crop.risk === 'Low' ? 'bg-primary/10 text-primary' :
                            crop.risk === 'Medium' ? 'bg-amber-500/10 text-amber-600' :
                            'bg-destructive/10 text-destructive'
                          }`}>
                            {crop.risk === 'Low' ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                            {crop.risk} Risk
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Suitability</span>
                            <span className="font-medium text-foreground">{crop.suitability}%</span>
                          </div>
                          <Progress value={crop.suitability} className="h-2" />
                        </div>
                        <div className="flex items-center justify-between text-sm mt-2">
                          <span className="text-muted-foreground">Confidence</span>
                          <span className="font-medium text-primary">{crop.confidence}%</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Brain className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Enter data and run prediction to see recommendations
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Prediction History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <DataTable
            title="Prediction History"
            description="Your past predictions and saved results"
            columns={historyColumns}
            data={predictionHistory}
            actions={
              <Button variant="outline" size="sm">
                <History className="w-4 h-4 mr-2" />
                View All
              </Button>
            }
          />
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
