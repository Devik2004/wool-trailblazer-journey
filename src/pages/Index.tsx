
import { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Dashboard from '@/components/Dashboard';
import FarmRegistry from '@/components/FarmRegistry';
import BatchTracking from '@/components/BatchTracking';
import SupplyChainFlow from '@/components/SupplyChainFlow';
import Analytics from '@/components/Analytics';

const Index = () => {
  const location = useLocation();
  
  return (
    <div className="min-h-screen flex flex-col bg-wool-cream/30">
      <Navbar />
      
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/farm-registry" element={<FarmRegistry />} />
          <Route path="/batch-tracking" element={<BatchTracking />} />
          <Route path="/supply-chain" element={<SupplyChainFlow />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </main>
      
      <footer className="bg-wool-cream border-t border-wool-beige p-4 text-center text-sm text-wool-gray">
        <p>WoolTracer - Farm to Fabric Tracking System © 2025</p>
      </footer>
    </div>
  );
};

export default Index;
