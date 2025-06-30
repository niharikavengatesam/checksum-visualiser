
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DataInputSection } from './DataInputSection';
import { CalculationSection } from './CalculationSection';
import { TransmissionSection } from './TransmissionSection';
import { VerificationSection } from './VerificationSection';
import { useToast } from '@/hooks/use-toast';

export interface DataBlock {
  id: string;
  value: string;
  binary: string;
}

export interface CalculationStep {
  step: number;
  description: string;
  operand1: string;
  operand2: string;
  result: string;
  carry: string;
}

export const ChecksumCalculator = () => {
  const [dataBlocks, setDataBlocks] = useState<DataBlock[]>([]);
  const [checksum, setChecksum] = useState<string>('');
  const [calculationSteps, setCalculationSteps] = useState<CalculationStep[]>([]);
  const [transmittedData, setTransmittedData] = useState<string>('');
  const [currentStep, setCurrentStep] = useState<number>(1);
  const { toast } = useToast();

  const calculateChecksum = () => {
    if (dataBlocks.length === 0) {
      toast({
        title: "No data to calculate",
        description: "Please add at least one data block first.",
        variant: "destructive"
      });
      return;
    }

    const steps: CalculationStep[] = [];
    let sum = 0;
    let stepNumber = 1;

    // Add all blocks
    for (let i = 0; i < dataBlocks.length; i++) {
      const blockValue = parseInt(dataBlocks[i].binary, 2);
      const previousSum = sum;
      sum += blockValue;
      
      // Handle carry wrap-around
      if (sum > 255) {
        const carry = Math.floor(sum / 256);
        sum = (sum % 256) + carry;
        
        steps.push({
          step: stepNumber++,
          description: `Add Block ${i + 1} with carry wrap-around`,
          operand1: previousSum.toString(2).padStart(8, '0'),
          operand2: dataBlocks[i].binary,
          result: sum.toString(2).padStart(8, '0'),
          carry: carry.toString()
        });
      } else {
        steps.push({
          step: stepNumber++,
          description: `Add Block ${i + 1}`,
          operand1: i === 0 ? '00000000' : previousSum.toString(2).padStart(8, '0'),
          operand2: dataBlocks[i].binary,
          result: sum.toString(2).padStart(8, '0'),
          carry: '0'
        });
      }
    }

    // Calculate 1's complement
    const complement = (~sum & 0xFF);
    const checksumBinary = complement.toString(2).padStart(8, '0');
    
    steps.push({
      step: stepNumber,
      description: "Calculate 1's complement (flip all bits)",
      operand1: sum.toString(2).padStart(8, '0'),
      operand2: '',
      result: checksumBinary,
      carry: ''
    });

    setCalculationSteps(steps);
    setChecksum(checksumBinary);
    
    // Create transmitted data (all blocks + checksum)
    const transmitted = dataBlocks.map(block => block.binary).join(' ') + ' ' + checksumBinary;
    setTransmittedData(transmitted);
    
    setCurrentStep(2);
    
    toast({
      title: "Checksum calculated!",
      description: `Checksum: ${checksumBinary}`,
    });
  };

  const resetCalculator = () => {
    setDataBlocks([]);
    setChecksum('');
    setCalculationSteps([]);
    setTransmittedData('');
    setCurrentStep(1);
    
    toast({
      title: "Calculator reset",
      description: "Ready for new calculation",
    });
  };

  return (
    <div className="space-y-8">
      {/* Progress Steps */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-4">
            {[
              { num: 1, label: "Input Data", icon: "📝" },
              { num: 2, label: "Calculate", icon: "🧮" },
              { num: 3, label: "Transmit", icon: "📡" },
              { num: 4, label: "Verify", icon: "✅" }
            ].map((step, index) => (
              <div key={step.num} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                  currentStep >= step.num 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step.icon}
                </div>
                <span className={`ml-2 text-sm ${
                  currentStep >= step.num ? 'text-blue-600 font-semibold' : 'text-gray-500'
                }`}>
                  {step.label}
                </span>
                {index < 3 && (
                  <div className={`w-8 h-0.5 mx-4 ${
                    currentStep > step.num ? 'bg-blue-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Step 1: Data Input */}
      <DataInputSection 
        dataBlocks={dataBlocks}
        setDataBlocks={setDataBlocks}
        onCalculate={calculateChecksum}
      />

      {/* Step 2: Calculation Visualization */}
      {calculationSteps.length > 0 && (
        <CalculationSection 
          steps={calculationSteps}
          checksum={checksum}
        />
      )}

      {/* Step 3: Transmission */}
      {transmittedData && (
        <TransmissionSection 
          transmittedData={transmittedData}
          dataBlocks={dataBlocks}
          checksum={checksum}
          onNext={() => setCurrentStep(4)}
        />
      )}

      {/* Step 4: Verification */}
      {currentStep >= 4 && transmittedData && (
        <VerificationSection 
          originalData={transmittedData}
          dataBlocks={dataBlocks}
          checksum={checksum}
        />
      )}

      {/* Reset Button */}
      {dataBlocks.length > 0 && (
        <div className="text-center">
          <Button 
            onClick={resetCalculator}
            variant="outline"
            className="bg-white hover:bg-gray-50"
          >
            🔄 Start New Calculation
          </Button>
        </div>
      )}
    </div>
  );
};
