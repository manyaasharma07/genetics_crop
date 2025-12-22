import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dna, Leaf, Brain, BarChart3, Shield, Users, ArrowRight, ChevronRight } from 'lucide-react';

import cropRice from '@/assets/crop-rice.jpg';
import cropWheat from '@/assets/crop-wheat.jpg';
import cropCorn from '@/assets/crop-corn.jpg';

const features = [
  {
    icon: Dna,
    title: 'Genetic Analysis',
    description: 'Analyze genetic markers and traits to understand crop characteristics and inheritance patterns.',
  },
  {
    icon: Leaf,
    title: 'Crop Recommendations',
    description: 'Get AI-powered recommendations based on soil, climate, and genetic data.',
  },
  {
    icon: Brain,
    title: 'ML Predictions',
    description: 'Advanced machine learning models for yield prediction and performance scoring.',
  },
  {
    icon: BarChart3,
    title: 'Data Visualization',
    description: 'Interactive charts and dashboards for comprehensive data analysis.',
  },
  {
    icon: Shield,
    title: 'Secure Data',
    description: 'Enterprise-grade security for your research data and findings.',
  },
  {
    icon: Users,
    title: 'Collaboration',
    description: 'Work together with researchers and students on shared projects.',
  },
];

const cropImages = [
  { src: cropRice, alt: 'Rice paddy field', label: 'Rice' },
  { src: cropWheat, alt: 'Wheat field', label: 'Wheat' },
  { src: cropCorn, alt: 'Corn field', label: 'Corn' },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
              <Dna className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-xl">CropGen AI</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link to="/login">
              <Button variant="hero">
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 overflow-hidden">
        <div className="container mx-auto text-center relative">
          {/* Background decoration */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-3xl -z-10" />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Leaf className="w-4 h-4" />
              Agricultural Intelligence Platform
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Genetic Traits & Crop<br />
              <span className="text-gradient">Recommendation System</span>
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
              Harness the power of machine learning to analyze genetic traits, predict crop yields, 
              and make data-driven agricultural decisions. Built for researchers and agronomists.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/login">
                <Button variant="hero" size="xl">
                  Start Analyzing
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Button variant="outline" size="xl">
                View Documentation
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </motion.div>

          {/* Crop Images */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16"
          >
            {cropImages.map((crop, i) => (
              <div key={i} className="relative group overflow-hidden rounded-2xl shadow-lg">
                <img 
                  src={crop.src} 
                  alt={crop.alt}
                  className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white font-semibold text-lg">
                  {crop.label}
                </div>
              </div>
            ))}
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16"
          >
            {[
              { value: '0', label: 'Data Records' },
              { value: '0', label: 'Crop Varieties' },
              { value: '0%', label: 'Model Accuracy' },
              { value: '0', label: 'Researchers' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Powerful Features for Agricultural Research
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to analyze genetic data, predict crop performance, 
              and make informed decisions.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Card variant="elevated" className="h-full hover:shadow-xl transition-all duration-300 group">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4 group-hover:shadow-glow transition-all duration-300">
                      <feature.icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Card className="gradient-hero border-0 overflow-hidden relative">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50" />
              <CardContent className="p-12 text-center relative z-10">
                <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-4">
                  Ready to Transform Your Research?
                </h2>
                <p className="text-primary-foreground/90 mb-8 max-w-xl mx-auto">
                  Join researchers and agronomists who are using CropGen AI to make 
                  data-driven decisions and improve crop yields.
                </p>
                <Link to="/login">
                  <Button 
                    size="xl" 
                    className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                  >
                    Get Started Free
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Dna className="w-5 h-5 text-primary" />
            <span className="font-medium">CropGen AI</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 CropGen AI. Genetic Traits & Crop Recommendation System.
          </p>
        </div>
      </footer>
    </div>
  );
}
