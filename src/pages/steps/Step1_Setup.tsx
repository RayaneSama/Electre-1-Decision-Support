import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Step1SetupProps {
  numAlts: number;
  numCrits: number;
  setNumAlts: (value: number) => void;
  setNumCrits: (value: number) => void;
  onNext: () => void;
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Step1_Setup: React.FC<Step1SetupProps> = ({
  numAlts,
  numCrits,
  setNumAlts,
  setNumCrits,
  onNext,
  onImport,
}) => {
  return (
    <div className="space-y-6 bg-white shadow-2xl rounded-3xl px-6 md:px-10 py-8 md:py-12 border border-gray-200">
      <h3 className="text-2xl font-semibold text-center">Step 1: Setup</h3>
      <p className="text-center text-gray-600">
        Enter how many alternatives and criteria you want to compare, or import
        data.
      </p>

      <div className="flex flex-col md:flex-row justify-center gap-6">
        <div>
          <label className="block mb-1 font-medium">
            Number of Alternatives
          </label>
          <Input
            type="number"
            min={1}
            value={numAlts}
            onChange={(e) => setNumAlts(parseInt(e.target.value))}
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Number of Criteria</label>
          <Input
            type="number"
            min={1}
            value={numCrits}
            onChange={(e) => setNumCrits(parseInt(e.target.value))}
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-4">
        <label className="flex items-center gap-2 cursor-pointer text-sm font-medium">
          <span className="bg-blue-100 text-blue-700 px-3 py-2 rounded hover:bg-blue-200 transition">
            Upload Data (JSON)
          </span>
          <input
            type="file"
            accept=".json"
            onChange={onImport}
            className="hidden"
          />
        </label>

        <Button onClick={onNext} className="px-6 py-2 text-lg">
          Next
        </Button>
      </div>
    </div>
  );
};

export default Step1_Setup;
