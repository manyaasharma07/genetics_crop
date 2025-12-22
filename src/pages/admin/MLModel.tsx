import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ChartCard } from '@/components/dashboard/ChartCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Brain,
  RefreshCw,
  CheckCircle,
  Clock,
  Database,
  TrendingUp,
  BarChart3,
  AlertTriangle,
  Play,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const featureImportance = [
  { name: 'Soil pH', value: 0 },
  { name: 'Rainfall', value: 0 },
  { name: 'Temperature', value: 0 },
  { name: 'NPK Ratio', value: 0 },
  { name: 'Genetic Markers', value: 0 },
  { name: 'Humidity', value: 0 },
];

const modelHistory = [
  { version: 'v0.0.0', date: '2024-01-15', accuracy: 0, status: 'active' },
  { version: 'v0.0.0', date: '2024-01-01', accuracy: 0, status: 'archived' },
  { version: 'v0.0.0', date: '2023-12-15', accuracy: 0, status: 'archived' },
];

export default function MLModel() {
  const { toast } = useToast();
  const [isRetraining, setIsRetraining] = useState(false);
  const [retrainProgress, setRetrainProgress] = useState(0);

  const handleRetrain = () => {
    setIsRetraining(true);
    setRetrainProgress(0);
    
    const interval = setInterval(() => {
      setRetrainProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRetraining(false);
          toast({
            title: "Model Retrained",
            description: "The ML model has been successfully retrained with the latest data.",
          });
          return 100;
        }
        return prev + 5;
      });
    }, 300);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-foreground">ML Model</h1>
            <p className="text-muted-foreground mt-1">Model monitoring, metrics, and retraining controls</p>
          </div>
          <Button 
            variant="hero" 
            className="gap-2"
            onClick={handleRetrain}
            disabled={isRetraining}
          >
            {isRetraining ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Retraining...
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Retrain Model
              </>
            )}
          </Button>
        </motion.div>

        {/* Retraining Progress */}
        {isRetraining && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card variant="elevated" className="border-l-4 border-l-primary">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <RefreshCw className="w-5 h-5 text-primary animate-spin" />
                  <span className="font-medium text-foreground">Retraining in progress...</span>
                </div>
                <Progress value={retrainProgress} className="h-2" />
                <p className="text-sm text-muted-foreground mt-2">{retrainProgress}% complete</p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Model Status Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card variant="elevated">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <div className="flex items-center gap-2 mt-1">
                      <CheckCircle className="w-4 h-4 text-primary" />
                      <span className="font-semibold text-foreground">Operational</span>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Brain className="w-5 h-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card variant="elevated">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Version</p>
                    <p className="text-xl font-bold text-foreground mt-1">v0.0.0</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card variant="elevated">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Training Data</p>
                    <p className="text-xl font-bold text-foreground mt-1">0</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Database className="w-5 h-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card variant="elevated">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Accuracy</p>
                    <p className="text-xl font-bold text-foreground mt-1">0%</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Metrics & Feature Importance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Model Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Model Metrics
                </CardTitle>
                <CardDescription>Performance indicators for the current model</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-foreground">Accuracy</span>
                      <span className="text-sm font-medium text-foreground">0%</span>
                    </div>
                    <Progress value={0} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-foreground">Precision</span>
                      <span className="text-sm font-medium text-foreground">0%</span>
                    </div>
                    <Progress value={0} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-foreground">Recall</span>
                      <span className="text-sm font-medium text-foreground">0%</span>
                    </div>
                    <Progress value={0} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-foreground">F1 Score</span>
                      <span className="text-sm font-medium text-foreground">0%</span>
                    </div>
                    <Progress value={0} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-foreground">Confidence</span>
                      <span className="text-sm font-medium text-foreground">0%</span>
                    </div>
                    <Progress value={0} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Feature Importance */}
          <ChartCard
            title="Feature Importance"
            description="Impact of each feature on predictions"
            type="bar"
            data={featureImportance}
          />
        </div>

        {/* Model History */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Model Version History</CardTitle>
              <CardDescription>Previous model versions and their performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {modelHistory.map((model, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${model.status === 'active' ? 'bg-primary' : 'bg-muted-foreground'}`} />
                      <div>
                        <p className="font-medium text-foreground">{model.version}</p>
                        <p className="text-sm text-muted-foreground">Trained on {model.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground">Accuracy: {model.accuracy}%</span>
                      <Badge variant={model.status === 'active' ? 'default' : 'secondary'}>
                        {model.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Alert */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card variant="elevated" className="border-l-4 border-l-warning">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">New Data Available</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    0 new records have been added since the last training. Consider retraining the model to incorporate the latest data for improved accuracy.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
