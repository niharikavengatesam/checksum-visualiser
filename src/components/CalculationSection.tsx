
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalculationStep } from './ChecksumCalculator';
import { ChevronRight, RotateCcw } from 'lucide-react';

interface CalculationSectionProps {
  steps: CalculationStep[];
  checksum: string;
}

export const CalculationSection = ({ steps, checksum }: CalculationSectionProps) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const nextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStepIndex(currentStepIndex + 1);
        setIsAnimating(false);
      }, 300);
    }
  };

  const resetAnimation = () => {
    setCurrentStepIndex(0);
  };

  const formatBinaryWithCarry = (binary: string, carry: string) => {
    if (!carry || carry === '0') return binary;
    return binary.split('').map((bit, index) => (
      <span key={index} className={index === 0 ? 'text-red-600 font-bold' : ''}>
        {bit}
      </span>
    ));
  };

  const currentStep = steps[currentStepIndex];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          🧮 Step 2: Checksum Calculation
          <div className="flex space-x-2">
            <Button 
              onClick={resetAnimation}
              variant="outline"
              size="sm"
              disabled={currentStepIndex === 0}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button 
              onClick={nextStep}
              disabled={currentStepIndex >= steps.length - 1}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
            >
              Next Step
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress Indicator */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Step {currentStepIndex + 1} of {steps.length}</span>
          <div className="flex space-x-1">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index <= currentStepIndex ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Current Step Display */}
        <div className={`transition-all duration-300 ${isAnimating ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border">
            <h3 className="font-semibold text-lg mb-4 text-center">
              {currentStep.description}
            </h3>
            
            <div className="space-y-4">
              {/* Binary Addition Display */}
              <div className="bg-white p-4 rounded-lg font-mono text-center">
                {currentStep.operand2 && (
                  <>
                    <div className="flex justify-center items-center space-x-4 text-lg">
                      <span className="text-gray-600">+</span>
                      <code className="tracking-wider">
                        {formatBinaryWithCarry(currentStep.operand1, currentStep.carry)}
                      </code>
                    </div>
                    <div className="flex justify-center items-center space-x-4 text-lg mt-2">
                      <span className="invisible">+</span>
                      <code className="tracking-wider">{currentStep.operand2}</code>
                    </div>
                    <div className="border-t-2 border-gray-300 mt-2 mb-2"></div>
                  </>
                )}
                
                <div className="flex justify-center items-center space-x-4 text-lg font-bold">
                  <span className={currentStep.operand2 ? "invisible" : "text-gray-600"}>
                    {currentStep.description.includes("complement") ? "~" : "="}
                  </span>
                  <code className={`tracking-wider ${
                    currentStep.description.includes("complement") ? "text-green-600" : "text-blue-600"
                  }`}>
                    {currentStep.result}
                  </code>
                </div>
                
                {currentStep.carry && currentStep.carry !== '0' && (
                  <div className="mt-3 text-sm text-red-600">
                    <span>Carry: {currentStep.carry} (wrapped around)</span>
                  </div>
                )}
              </div>

              {/* Step Explanation */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="text-sm text-yellow-800">
                  {currentStep.description.includes("complement") ? (
                    <div>
                      <p className="font-medium mb-2">1's Complement Calculation:</p>
                      <p>Flip every bit: 0 becomes 1, and 1 becomes 0</p>
                      <div className="mt-2 font-mono text-xs">
                        Original: {currentStep.operand1} → 
                        Complement: {currentStep.result}
                      </div>
                    </div>
                  ) : currentStep.carry && currentStep.carry !== '0' ? (
                    <div>
                      <p className="font-medium mb-2">Carry Wrap-around:</p>
                      <p>Sum exceeded 8 bits, so carry bit(s) wrap around and are added to the result</p>
                    </div>
                  ) : (
                    <div>
                      <p className="font-medium mb-2">Binary Addition:</p>
                      <p>Adding two 8-bit binary numbers using standard binary arithmetic</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Final Result */}
        {currentStepIndex === steps.length - 1 && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
            <h3 className="font-bold text-xl text-green-800 mb-3">
              ✅ Checksum Calculated!
            </h3>
            <div className="bg-white p-4 rounded-lg inline-block">
              <div className="text-sm text-gray-600 mb-2">Final Checksum:</div>
              <code className="text-2xl font-bold text-green-600 tracking-wider">
                {checksum}
              </code>
              <div className="text-sm text-gray-600 mt-2">
                (Decimal: {parseInt(checksum, 2)})
              </div>
            </div>
            <p className="text-sm text-green-700 mt-4">
              This checksum will be appended to your data for transmission
            </p>
          </div>
        )}

        {/* All Steps Summary */}
        {currentStepIndex === steps.length - 1 && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold mb-3">Complete Calculation Steps:</h4>
            <div className="space-y-2 text-sm">
              {steps.map((step, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                    {step.step}
                  </span>
                  <span className="flex-1">{step.description}</span>
                  <code className="font-mono text-xs bg-white px-2 py-1 rounded">
                    {step.result}
                  </code>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
