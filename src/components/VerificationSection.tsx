
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DataBlock } from './ChecksumCalculator';
import { CheckCircle, XCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VerificationSectionProps {
  originalData: string;
  dataBlocks: DataBlock[];
  checksum: string;
}

export const VerificationSection = ({ 
  originalData, 
  dataBlocks, 
  checksum 
}: VerificationSectionProps) => {
  const [receivedData, setReceivedData] = useState(originalData);
  const [verificationResult, setVerificationResult] = useState<{
    isValid: boolean;
    message: string;
    receivedSum: string;
  } | null>(null);
  const [flippedBitIndex, setFlippedBitIndex] = useState<{ blockIndex: number; bitIndex: number } | null>(null);
  const { toast } = useToast();

  const flipBit = (blockIndex: number, bitIndex: number) => {
    const blocks = receivedData.split(' ');
    const block = blocks[blockIndex];
    const newBit = block[bitIndex] === '0' ? '1' : '0';
    const newBlock = block.substring(0, bitIndex) + newBit + block.substring(bitIndex + 1);
    blocks[blockIndex] = newBlock;
    
    setReceivedData(blocks.join(' '));
    setFlippedBitIndex({ blockIndex, bitIndex });
    setVerificationResult(null);
    
    toast({
      title: "Bit flipped!",
      description: `Simulated transmission error in block ${blockIndex + 1}, bit ${bitIndex + 1}`,
      variant: "destructive"
    });
  };

  const resetData = () => {
    setReceivedData(originalData);
    setFlippedBitIndex(null);
    setVerificationResult(null);
    
    toast({
      title: "Data reset",
      description: "Restored original transmitted data",
    });
  };

  const verifyChecksum = () => {
    const blocks = receivedData.split(' ');
    let sum = 0;
    
    // Add all received blocks (including the checksum)
    for (const block of blocks) {
      const value = parseInt(block, 2);
      sum += value;
      
      // Handle carry wrap-around
      if (sum > 255) {
        const carry = Math.floor(sum / 256);
        sum = (sum % 256) + carry;
      }
    }
    
    const receivedSumBinary = sum.toString(2).padStart(8, '0');
    const isValid = sum === 255; // All 1s means no error
    
    setVerificationResult({
      isValid,
      message: isValid 
        ? "✅ Data integrity verified - No errors detected!" 
        : "❌ Error detected - Data corruption during transmission!",
      receivedSum: receivedSumBinary
    });

    toast({
      title: isValid ? "Verification passed!" : "Error detected!",
      description: isValid 
        ? "Checksum verification successful"
        : "Data corruption detected by checksum",
      variant: isValid ? "default" : "destructive"
    });
  };

  const allBlocks = receivedData.split(' ');
  const hasError = flippedBitIndex !== null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          ✅ Step 4: Receiver Verification
          <Button 
            onClick={resetData}
            variant="outline"
            size="sm"
            disabled={!hasError}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset Data
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Received Data Display */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
          <h3 className="font-semibold mb-4 text-center">
            📥 Received Data at Destination
          </h3>
          
          <div className="space-y-4">
            {/* Interactive Data Blocks */}
            <div className="grid gap-4">
              {allBlocks.map((block, blockIndex) => (
                <div key={blockIndex} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">
                      {blockIndex === allBlocks.length - 1 ? 'Checksum:' : `Data Block ${blockIndex + 1}:`}
                    </span>
                    {blockIndex < allBlocks.length - 1 && (
                      <span className="text-xs text-gray-500">
                        Click any bit to simulate error
                      </span>
                    )}
                  </div>
                  
                  <div className={`flex space-x-1 p-3 rounded-lg border-2 ${
                    blockIndex === allBlocks.length - 1 
                      ? 'bg-green-50 border-green-300' 
                      : hasError && flippedBitIndex?.blockIndex === blockIndex
                      ? 'bg-red-50 border-red-300'
                      : 'bg-white border-gray-300'
                  }`}>
                    {block.split('').map((bit, bitIndex) => (
                      <button
                        key={bitIndex}
                        onClick={() => blockIndex < allBlocks.length - 1 && flipBit(blockIndex, bitIndex)}
                        disabled={blockIndex === allBlocks.length - 1}
                        className={`w-8 h-8 text-sm font-bold rounded border-2 transition-all ${
                          blockIndex === allBlocks.length - 1
                            ? 'bg-green-100 border-green-300 text-green-700 cursor-not-allowed'
                            : hasError && flippedBitIndex?.blockIndex === blockIndex && flippedBitIndex?.bitIndex === bitIndex
                            ? 'bg-red-200 border-red-400 text-red-800 animate-pulse'
                            : 'bg-white border-gray-300 hover:bg-blue-50 hover:border-blue-300 cursor-pointer'
                        }`}
                      >
                        {bit}
                      </button>
                    ))}
                  </div>
                  
                  {hasError && flippedBitIndex?.blockIndex === blockIndex && (
                    <div className="flex items-center text-sm text-red-600">
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Error simulated at bit position {flippedBitIndex.bitIndex + 1}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Verification Controls */}
        <div className="text-center">
          <Button 
            onClick={verifyChecksum}
            size="lg"
            className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold px-8 py-3"
          >
            🔍 Verify Data Integrity
          </Button>
        </div>

        {/* Verification Result */}
        {verificationResult && (
          <div className={`border-2 rounded-xl p-6 ${
            verificationResult.isValid 
              ? 'bg-green-50 border-green-300' 
              : 'bg-red-50 border-red-300'
          }`}>
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                {verificationResult.isValid ? (
                  <CheckCircle className="w-12 h-12 text-green-600" />
                ) : (
                  <XCircle className="w-12 h-12 text-red-600" />
                )}
              </div>
              
              <h3 className={`font-bold text-xl mb-3 ${
                verificationResult.isValid ? 'text-green-800' : 'text-red-800'
              }`}>
                {verificationResult.message}
              </h3>

              {/* Verification Calculation */}
              <div className="bg-white p-4 rounded-lg mb-4">
                <div className="text-sm text-gray-600 mb-2">
                  Verification Calculation:
                </div>
                <div className="font-mono text-sm space-y-1">
                  {allBlocks.map((block, index) => (
                    <div key={index}>
                      {index === 0 ? '' : '+ '}{block} 
                      {index === allBlocks.length - 1 ? ' (checksum)' : ` (block ${index + 1})`}
                    </div>
                  ))}
                  <div className="border-t pt-1 font-bold">
                    = {verificationResult.receivedSum}
                  </div>
                </div>
                
                <div className={`mt-3 text-sm ${
                  verificationResult.isValid ? 'text-green-700' : 'text-red-700'
                }`}>
                  Expected: 11111111 (all 1s for valid data)
                  <br />
                  Received: {verificationResult.receivedSum}
                  <br />
                  Status: {verificationResult.isValid ? 'MATCH ✅' : 'MISMATCH ❌'}
                </div>
              </div>

              {verificationResult.isValid ? (
                <p className="text-green-700">
                  The sum of all blocks (including checksum) equals 11111111, 
                  confirming data integrity.
                </p>
              ) : (
                <p className="text-red-700">
                  The sum doesn't equal 11111111, indicating data corruption 
                  was detected during transmission.
                </p>
              )}
            </div>
          </div>
        )}

        {/* How Verification Works */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="bg-blue-100 rounded-full p-2 mr-3">
              <CheckCircle className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">How Checksum Verification Works:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Add all received blocks including the checksum</li>
                <li>Handle carry wrap-around as before</li>
                <li>If result is 11111111 (all 1s), data is valid</li>
                <li>If result is anything else, an error occurred</li>
              </ol>
              <p className="mt-2 font-medium">
                Try flipping a bit above to simulate transmission errors!
              </p>
            </div>
          </div>
        </div>

        {/* Additional Learning */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="text-sm text-purple-800">
            <p className="font-medium mb-2">🎓 Learning Note:</p>
            <p>
              Checksums can detect single-bit errors and some multi-bit errors, but they're not 
              foolproof. More advanced error detection methods include CRC (Cyclic Redundancy Check) 
              and error correction codes like Hamming codes for mission-critical applications.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
