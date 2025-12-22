import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DataTable, StatusBadge } from '@/components/dashboard/DataTable';
import { ChartCard } from '@/components/dashboard/ChartCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dna,
  Search,
  Upload,
  FileSpreadsheet,
  Filter,
  Download,
  X,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const geneticMarkers = [
  { id: 1, crop: 'IR64 Rice', markerId: 'SNP_001', traitAffected: 'Yield', effectType: 'Positive', confidenceScore: '0%' },
  { id: 2, crop: 'IR64 Rice', markerId: 'SNP_002', traitAffected: 'Drought Tolerance', effectType: 'Positive', confidenceScore: '0%' },
  { id: 3, crop: 'BT Cotton', markerId: 'BT_GENE_1', traitAffected: 'Pest Resistance', effectType: 'Positive', confidenceScore: '0%' },
  { id: 4, crop: 'HD2967 Wheat', markerId: 'GW2_ALLELE', traitAffected: 'Grain Weight', effectType: 'Positive', confidenceScore: '0%' },
  { id: 5, crop: 'NK6240 Maize', markerId: 'ZmY1', traitAffected: 'Disease Susceptibility', effectType: 'Negative', confidenceScore: '0%' },
  { id: 6, crop: 'Pusa Basmati', markerId: 'BADH2', traitAffected: 'Aroma', effectType: 'Positive', confidenceScore: '0%' },
  { id: 7, crop: 'Soybean JS335', markerId: 'GmFT2a', traitAffected: 'Flowering Time', effectType: 'Positive', confidenceScore: '0%' },
];

const traitImportanceData = [
  { name: 'Yield', value: 0 },
  { name: 'Drought', value: 0 },
  { name: 'Pest Res.', value: 0 },
  { name: 'Disease Res.', value: 0 },
  { name: 'Grain Quality', value: 0 },
  { name: 'Flowering', value: 0 },
];

const markerColumns = [
  { key: 'crop', label: 'Crop' },
  { key: 'markerId', label: 'Gene/Marker ID' },
  { key: 'traitAffected', label: 'Trait Affected' },
  { 
    key: 'effectType', 
    label: 'Effect Type', 
    render: (v: string) => (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
        v === 'Positive' 
          ? 'bg-primary/10 text-primary' 
          : 'bg-destructive/10 text-destructive'
      }`}>
        {v === 'Positive' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
        {v}
      </span>
    )
  },
  { key: 'confidenceScore', label: 'Confidence' },
];

export default function GeneticTraits() {
  const [markers, setMarkers] = useState(geneticMarkers);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCrop, setFilterCrop] = useState('all');
  const [filterTrait, setFilterTrait] = useState('all');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const uniqueCrops = [...new Set(markers.map(m => m.crop))];
  const uniqueTraits = [...new Set(markers.map(m => m.traitAffected))];

  const filteredMarkers = markers.filter(marker => {
    const matchesSearch = marker.markerId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      marker.crop.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCrop = filterCrop === 'all' || marker.crop === filterCrop;
    const matchesTrait = filterTrait === 'all' || marker.traitAffected === filterTrait;
    return matchesSearch && matchesCrop && matchesTrait;
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && (file.type === 'text/csv' || file.name.endsWith('.csv'))) {
      setUploadedFile(file);
      toast({
        title: 'GWAS/SNP Data Uploaded',
        description: `${file.name} ready for processing.`,
      });
    }
  };

  const handleProcessUpload = () => {
    if (uploadedFile) {
      toast({
        title: 'Genetic Data Processed',
        description: '0 markers imported from dataset.',
      });
      setUploadedFile(null);
    }
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
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <Dna className="w-8 h-8 text-primary" />
              Genetic Traits
            </h1>
            <p className="text-muted-foreground mt-1">Store and analyze genetic markers affecting crop traits</p>
          </div>
        </motion.div>

        {/* Upload and Chart Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* CSV Upload Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card variant="elevated" className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5 text-primary" />
                  Upload Genetic Datasets
                </CardTitle>
                <CardDescription>Import GWAS or SNP CSV files</CardDescription>
              </CardHeader>
              <CardContent>
                <div 
                  className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer mb-4"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <FileSpreadsheet className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm font-medium text-foreground">
                    {uploadedFile ? uploadedFile.name : 'Upload GWAS/SNP Dataset'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Supports CSV files with genetic marker data
                  </p>
                </div>
                {uploadedFile && (
                  <div className="flex items-center gap-2">
                    <Button variant="hero" onClick={handleProcessUpload} className="flex-1">
                      Process Dataset
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setUploadedFile(null)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Trait Importance Chart */}
          <ChartCard
            title="Trait Importance Analysis"
            description="Relative importance of genetic traits"
            type="bar"
            data={traitImportanceData}
          />
        </div>

        {/* Data Table */}
        <DataTable
          title="Genetic Markers Database"
          description={`${filteredMarkers.length} markers found`}
          columns={markerColumns}
          data={filteredMarkers}
          actions={
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Search markers..." 
                  className="pl-9 w-40"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={filterCrop} onValueChange={setFilterCrop}>
                <SelectTrigger className="w-36">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Crop" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Crops</SelectItem>
                  {uniqueCrops.map(crop => (
                    <SelectItem key={crop} value={crop}>{crop}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterTrait} onValueChange={setFilterTrait}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Trait" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Traits</SelectItem>
                  {uniqueTraits.map(trait => (
                    <SelectItem key={trait} value={trait}>{trait}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          }
        />
      </div>
    </DashboardLayout>
  );
}
