
import React from 'react';
import { Card } from '@/components/ui/card';
import { ChecksumCalculator } from '@/components/ChecksumCalculator';
import { Calculator, Shield, Network, BookOpen } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-2xl shadow-lg">
              <Calculator className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Checksum Calculator & Verifier
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Learn how checksums ensure data integrity in computer networks through interactive visualization
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calculator className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold mb-2">Interactive Calculation</h3>
            <p className="text-sm text-gray-600">
              Visualize binary addition, carry bits, and complement operations step-by-step
            </p>
          </Card>
          
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <Network className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold mb-2">Error Simulation</h3>
            <p className="text-sm text-gray-600">
              Simulate transmission errors and see how checksums detect data corruption
            </p>
          </Card>
          
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold mb-2">Educational Tool</h3>
            <p className="text-sm text-gray-600">
              Perfect for students and teachers learning computer network concepts
            </p>
          </Card>
        </div>

        {/* Main Calculator Component */}
        <ChecksumCalculator />

        {/* Footer */}
        <div className="text-center mt-16 py-8 border-t border-gray-200">
          <div className="flex items-center justify-center mb-4">
            <Shield className="w-5 h-5 text-blue-600 mr-2" />
            <span className="text-sm text-gray-600">
              Understanding data integrity in computer networks
            </span>
          </div>
          <p className="text-xs text-gray-500">
            Learn • Practice • Master checksum verification
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
