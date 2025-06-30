
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, Plus, Info } from 'lucide-react';
import { DataBlock } from './ChecksumCalculator';
import { useToast } from '@/hooks/use-toast';

interface DataInputSectionProps {
  dataBlocks: DataBlock[];
  setDataBlocks: (blocks: DataBlock[]) => void;
  onCalculate: () => void;
}

export const DataInputSection = ({ dataBlocks, setDataBlocks, onCalculate }: DataInputSectionProps) => {
  const [inputValue, setInputValue] = useState('');
  const [inputType, setInputType] = useState<'binary' | 'decimal'>('binary');
  const { toast } = useToast();

  const validateBinary = (value: string): boolean => {
    return /^[01]{8}$/.test(value);
  };

  const validateDecimal = (value: string): boolean => {
    const num = parseInt(value);
    return !isNaN(num) && num >= 0 && num <= 255;
  };

  const addDataBlock = () => {
    let binary = '';
    let isValid = false;

    if (inputType === 'binary') {
      if (validateBinary(inputValue)) {
        binary = inputValue;
        isValid = true;
      }
    } else {
      if (validateDecimal(inputValue)) {
        const num = parseInt(inputValue);
        binary = num.toString(2).padStart(8, '0');
        isValid = true;
      }
    }

    if (!isValid) {
      toast({
        title: "Invalid input",
        description: inputType === 'binary' 
          ? "Please enter exactly 8 binary digits (0s and 1s)"
          : "Please enter a decimal number between 0 and 255",
        variant: "destructive"
      });
      return;
    }

    const newBlock: DataBlock = {
      id: Date.now().toString(),
      value: inputType === 'binary' ? inputValue : parseInt(inputValue).toString(),
      binary: binary
    };

    setDataBlocks([...dataBlocks, newBlock]);
    setInputValue('');
    
    toast({
      title: "Data block added!",
      description: `Binary: ${binary} (Decimal: ${parseInt(binary, 2)})`,
    });
  };

  const removeBlock = (id: string) => {
    setDataBlocks(dataBlocks.filter(block => block.id !== id));
  };

  const addSampleData = () => {
    const sampleBlocks: DataBlock[] = [
      { id: '1', value: '11010011', binary: '11010011' },
      { id: '2', value: '10101010', binary: '10101010' },
      { id: '3', value: '01110100', binary: '01110100' }
    ];
    setDataBlocks(sampleBlocks);
    
    toast({
      title: "Sample data loaded!",
      description: "Three 8-bit blocks added for demonstration",
    });
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center text-white">
          📝 Step 1: Input Data Blocks
          <div className="ml-auto">
            <Button 
              onClick={addSampleData}
              variant="outline" 
              size="sm"
              className="text-blue-400 border-blue-500 hover:bg-blue-900/50 bg-transparent"
            >
              Load Sample Data
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Input Type Selection */}
        <div className="flex space-x-4">
          <button
            onClick={() => setInputType('binary')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              inputType === 'binary'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Binary (8-bit)
          </button>
          <button
            onClick={() => setInputType('decimal')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              inputType === 'decimal'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Decimal (0-255)
          </button>
        </div>

        {/* Input Field */}
        <div className="flex space-x-3">
          <div className="flex-1">
            <Label htmlFor="dataInput" className="text-sm font-medium text-gray-300">
              {inputType === 'binary' ? 'Enter 8-bit binary data' : 'Enter decimal value'}
            </Label>
            <Input
              id="dataInput"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={inputType === 'binary' ? 'e.g., 11010011' : 'e.g., 211'}
              className="mt-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              maxLength={inputType === 'binary' ? 8 : 3}
            />
          </div>
          <Button 
            onClick={addDataBlock}
            disabled={!inputValue}
            className="mt-6 bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Block
          </Button>
        </div>

        {/* Info Box */}
        <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4">
          <div className="flex items-start">
            <Info className="w-5 h-5 text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
            <div className="text-sm text-blue-300">
              <p className="font-medium mb-1">How it works:</p>
              <p>
                Enter multiple 8-bit data blocks that you want to transmit. The checksum algorithm 
                will add all blocks together, handle any carry bits with wrap-around, and calculate 
                the 1's complement to create the checksum.
              </p>
            </div>
          </div>
        </div>

        {/* Data Blocks Display */}
        {dataBlocks.length > 0 && (
          <div>
            <h3 className="font-semibold mb-3 text-white">Data Blocks ({dataBlocks.length})</h3>
            <div className="space-y-2">
              {dataBlocks.map((block, index) => (
                <div 
                  key={block.id}
                  className="flex items-center justify-between bg-gray-700 p-3 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium text-gray-300">
                      Block {index + 1}:
                    </span>
                    <code className="font-mono text-lg tracking-wider bg-gray-800 px-3 py-1 rounded border border-gray-600 text-blue-300">
                      {block.binary}
                    </code>
                    <span className="text-sm text-gray-400">
                      (Decimal: {parseInt(block.binary, 2)})
                    </span>
                  </div>
                  <Button
                    onClick={() => removeBlock(block.id)}
                    variant="ghost"
                    size="sm"
                    className="text-red-400 hover:text-red-300 hover:bg-red-900/30"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Calculate Button */}
        {dataBlocks.length > 0 && (
          <div className="text-center pt-4">
            <Button 
              onClick={onCalculate}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-3"
            >
              🧮 Calculate Checksum
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
