import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { DataTable, StatusBadge } from '@/components/dashboard/DataTable';
import { ChartCard } from '@/components/dashboard/ChartCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Leaf,
  Dna,
  CloudSun,
  FlaskConical,
  Brain,
  TrendingUp,
  Search,
  Loader2,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const stats = [
  { title: 'Crop Varieties', value: '847', change: '+23 this month', changeType: 'positive' as const, icon: Leaf },
  { title: 'Genetic Markers', value: '12,450', change: 'Active database', changeType: 'neutral' as const, icon: Dna },
  { title: 'Climate Records', value: '5,892', change: 'Updated daily', changeType: 'positive' as const, icon: CloudSun },
  { title: 'Predictions Made', value: '234', change: 'Your analyses', changeType: 'neutral' as const, icon: Brain },
];

const cropRecords = [
  { id: 1, name: 'IR64 Rice', variety: 'Indica', yieldPotential: 'High', diseaseResistance: 'Moderate', status: 'Active' },
  { id: 2, name: 'BT Cotton', variety: 'Hybrid', yieldPotential: 'Very High', diseaseResistance: 'High', status: 'Active' },
  { id: 3, name: 'NK6240 Maize', variety: 'Hybrid', yieldPotential: 'High', diseaseResistance: 'Low', status: 'Active' },
  { id: 4, name: 'HD2967 Wheat', variety: 'Aestivum', yieldPotential: 'Moderate', diseaseResistance: 'High', status: 'Active' },
];

const cropColumns = [
  { key: 'name', label: 'Crop Name' },
  { key: 'variety', label: 'Variety' },
  { key: 'yieldPotential', label: 'Yield Potential' },
  { key: 'diseaseResistance', label: 'Disease Resistance' },
  { key: 'status', label: 'Status', render: (v: string) => <StatusBadge status={v} /> },
];

const yieldTrends = [
  { name: 'Week 1', value: 78 },
  { name: 'Week 2', value: 82 },
  { name: 'Week 3', value: 85 },
  { name: 'Week 4', value: 91 },
  { name: 'Week 5', value: 88 },
  { name: 'Week 6', value: 95 },
];

export default function UserDashboard() {
  const [isPrediciting, setIsPredicting] = useState(false);
  const [predictionResult, setPredictionResult] = useState<null | {
    crop: string;
    confidence: number;
    yield: string;
    recommendations: string[];
  }>(null);
  const { toast } = useToast();

  const handlePrediction = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPredicting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setPredictionResult({
      crop: 'IR64 Rice',
      confidence: 94.2,
      yield: '6.8 tons/hectare',
      recommendations: [
        'Optimal planting window: March-April',
        'Recommended fertilizer: NPK 120-60-40',
        'Irrigation schedule: Every 5-7 days',
        'Consider drought-resistant variety for backup',
      ],
    });
    
    setIsPredicting(false);
    toast({
      title: 'Prediction Complete',
      description: 'Your crop recommendation is ready.',
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-foreground">Research Dashboard</h1>
          <p className="text-muted-foreground mt-1">Analyze data and get crop recommendations</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <StatCard key={stat.title} {...stat} delay={i * 0.1} />
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Prediction Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-primary" />
                  Crop Prediction
                </CardTitle>
                <CardDescription>
                  Enter environmental data to get recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePrediction} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="soilType">Soil Type</Label>
                    <Select defaultValue="loamy">
                      <SelectTrigger>
                        <SelectValue placeholder="Select soil type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="loamy">Loamy Soil</SelectItem>
                        <SelectItem value="clay">Clay Soil</SelectItem>
                        <SelectItem value="sandy">Sandy Soil</SelectItem>
                        <SelectItem value="silt">Silt Soil</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="ph">Soil pH</Label>
                      <Input id="ph" type="number" step="0.1" placeholder="6.5" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nitrogen">N (kg/ha)</Label>
                      <Input id="nitrogen" type="number" placeholder="120" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="rainfall">Rainfall (mm)</Label>
                      <Input id="rainfall" type="number" placeholder="1200" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="temp">Avg Temp (°C)</Label>
                      <Input id="temp" type="number" placeholder="28" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="region">Region</Label>
                    <Select defaultValue="tropical">
                      <SelectTrigger>
                        <SelectValue placeholder="Select region" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tropical">Tropical</SelectItem>
                        <SelectItem value="subtropical">Subtropical</SelectItem>
                        <SelectItem value="temperate">Temperate</SelectItem>
                        <SelectItem value="arid">Arid</SelectItem>
                      </SelectContent>
                    </Select>
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
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Brain className="w-4 h-4" />
                        Get Prediction
                      </>
                    )}
                  </Button>
                </form>

                {/* Prediction Result */}
                {predictionResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/20"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-foreground">Recommended Crop</h4>
                      <span className="text-sm text-primary font-medium">
                        {predictionResult.confidence}% confidence
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-primary mb-2">
                      {predictionResult.crop}
                    </p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Expected Yield: {predictionResult.yield}
                    </p>
                    <div className="space-y-2">
                      {predictionResult.recommendations.map((rec, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm">
                          <TrendingUp className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">{rec}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Charts & Data */}
          <div className="lg:col-span-2 space-y-6">
            <ChartCard
              title="Yield Trend Analysis"
              description="Weekly yield predictions based on current conditions"
              type="bar"
              data={yieldTrends}
            />
            
            <DataTable
              title="Crop Database"
              description="Browse available crop varieties"
              columns={cropColumns}
              data={cropRecords}
              actions={
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="Search crops..." className="pl-9 w-48" />
                  </div>
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </div>
              }
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
