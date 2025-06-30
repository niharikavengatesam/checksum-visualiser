
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DataBlock } from './ChecksumCalculator';
import { Send, Radio, Antenna } from 'lucide-react';

interface TransmissionSectionProps {
  transmittedData: string;
  dataBlocks: DataBlock[];
  checksum: string;
  onNext: () => void;
}

export const TransmissionSection = ({ 
  transmittedData, 
  dataBlocks, 
  checksum, 
  onNext 
}: TransmissionSectionProps) => {
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [transmitted, setTransmitted] = useState(false);

  const handleTransmit = () => {
    setIsTransmitting(true);
    
    // Simulate transmission delay
    setTimeout(() => {
      setIsTransmitting(false);
      setTransmitted(true);
      
      // Auto-proceed to verification after a short delay
      setTimeout(() => {
        onNext();
      }, 1500);
    }, 2000);
  };

  const allBlocks = transmittedData.split(' ');

  return (
    <Card>
      <CardHeader>
        <CardTitle>📡 Step 3: Data Transmission</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Packet Structure */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-semibold mb-4 text-center">
            📦 Complete Data Packet
          </h3>
          
          <div className="space-y-4">
            {/* Original Data Blocks */}
            <div>
              <div className="text-sm font-medium text-gray-600 mb-2">
                Original Data Blocks:
              </div>
              <div className="flex flex-wrap gap-2">
                {dataBlocks.map((block, index) => (
                  <div 
                    key={block.id}
                    className="bg-white border-2 border-blue-300 rounded-lg p-3 text-center"
                  >
                    <div className="text-xs text-gray-500 mb-1">Block {index + 1}</div>
                    <code className="font-mono text-sm font-bold">
                      {block.binary}
                    </code>
                    <div className="text-xs text-gray-500 mt-1">
                      ({parseInt(block.binary, 2)})
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Plus Symbol */}
            <div className="text-center text-2xl text-gray-400 font-bold">+</div>

            {/* Checksum */}
            <div>
              <div className="text-sm font-medium text-gray-600 mb-2">
                Checksum:
              </div>
              <div className="flex justify-center">
                <div className="bg-white border-2 border-green-300 rounded-lg p-3 text-center">
                  <div className="text-xs text-gray-500 mb-1">Checksum</div>
                  <code className="font-mono text-sm font-bold text-green-600">
                    {checksum}
                  </code>
                  <div className="text-xs text-gray-500 mt-1">
                    ({parseInt(checksum, 2)})
                  </div>
                </div>
              </div>
            </div>

            {/* Equals Symbol */}
            <div className="text-center text-2xl text-gray-400 font-bold">=</div>

            {/* Complete Packet */}
            <div>
              <div className="text-sm font-medium text-gray-600 mb-2">
                Complete Transmission Packet:
              </div>
              <div className="bg-gradient-to-r from-purple-100 to-blue-100 border-2 border-purple-300 rounded-lg p-4">
                <code className="font-mono text-lg font-bold text-center block tracking-wide">
                  {transmittedData}
                </code>
                <div className="text-center text-xs text-gray-600 mt-2">
                  {dataBlocks.length} data blocks + 1 checksum = {dataBlocks.length + 1} total blocks
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Transmission Animation */}
        {!transmitted && (
          <div className="text-center">
            {!isTransmitting ? (
              <Button 
                onClick={handleTransmit}
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-8 py-3"
              >
                <Send className="w-5 h-5 mr-2" />
                Transmit Data Packet
              </Button>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-4">
                  <div className="animate-spin">
                    <Radio className="w-8 h-8 text-blue-600" />
                  </div>
                  <span className="text-lg font-medium">Transmitting...</span>
                  <div className="animate-pulse">
                    <Antenna className="w-8 h-8 text-purple-600" />
                  </div>
                </div>
                <div className="flex justify-center space-x-1">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"
                      style={{ animationDelay: `${i * 0.2}s` }}
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-600">
                  Sending data through network...
                </p>
              </div>
            )}
          </div>
        )}

        {/* Transmission Complete */}
        {transmitted && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center animate-fade-in">
            <h3 className="font-bold text-xl text-green-800 mb-3">
              ✅ Transmission Complete!
            </h3>
            <p className="text-green-700 mb-4">
              Data packet successfully sent to the receiver
            </p>
            <div className="bg-white p-3 rounded-lg inline-block">
              <code className="font-mono text-sm text-gray-700">
                {transmittedData}
              </code>
            </div>
            <p className="text-sm text-gray-600 mt-4">
              Proceeding to verification step...
            </p>
          </div>
        )}

        {/* Information Box */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="bg-purple-100 rounded-full p-2 mr-3">
              <Radio className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-sm text-purple-800">
              <p className="font-medium mb-1">Network Transmission:</p>
              <p>
                The complete packet (original data + checksum) is transmitted over the network. 
                During transmission, data might get corrupted due to noise, interference, or 
                hardware issues. The checksum will help detect such errors at the receiver.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
