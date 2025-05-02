/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { runElectreI, CriterionType, ElectreResult } from "../utils/electre";
import Step1_Setup from "./steps/Step1_Setup";
import Step2_DefineCriteria from "./steps/Step2_DefineCriteria";
import Step3_FillMatrix from "./steps/Step3_FillMatrix";
import Step4_RunElectre from "./steps/Step4_RunElectre";
import Step5_Results from "./steps/Step5_Results";

const ElectreWizard: React.FC = () => {
  const [step, setStep] = useState(1);

  const [numAlts, setNumAlts] = useState(3);
  const [numCrits, setNumCrits] = useState(3);
  const [alts, setAlts] = useState<string[]>([]);
  const [crits, setCrits] = useState<string[]>([]);
  const [types, setTypes] = useState<CriterionType[]>([]);
  const [weights, setWeights] = useState<number[]>([]);
  const [minVals, setMinVals] = useState<number[]>([]);
  const [maxVals, setMaxVals] = useState<number[]>([]);
  const [matrix, setMatrix] = useState<number[][]>([]);
  const [muC, setMuC] = useState(0.6);
  const [muD, setMuD] = useState(0.4);
  const [result, setResult] = useState<ElectreResult | null>(null);

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        setAlts(data.alts || []);
        setCrits(data.crits || []);
        setTypes(data.types || []);
        setWeights(data.weights || []);
        setMinVals(data.minVals || []);
        setMaxVals(data.maxVals || []);
        setMatrix(data.matrix || []);
        setMuC(data.mu_c || 0.6);
        setMuD(data.mu_d || 0.4);
        setResult(null);
        setStep(3);
      } catch (err) {
        alert("Invalid file format. Make sure it's a valid ELECTRE JSON.");
      }
    };
    reader.readAsText(file);
  };

  const handleRun = () => {
    const output = runElectreI(
      matrix,
      weights,
      types,
      alts,
      crits,
      muC,
      muD,
      minVals,
      maxVals
    );
    setResult(output);
    setStep(5);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-gray-100 to-white p-6">
      {/* Step Progress Bar */}
      <div className="w-full max-w-4xl mb-8">
        <div className="flex justify-between text-sm text-gray-600 font-medium mb-2">
          {["Setup", "Criteria", "Matrix", "Thresholds", "Results"].map(
            (label, i) => (
              <span
                key={i}
                className={`flex-1 text-center ${
                  step === i + 1 ? "text-indigo-600 font-bold" : ""
                }`}
              >
                {label}
              </span>
            )
          )}
        </div>
        <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-indigo-500 transition-all duration-300"
            style={{ width: `${(step - 1) * 25}%` }}
          />
        </div>
      </div>

      {/* Main Step Content */}
      <div className="w-full max-w-5xl space-y-6">
        <h2 className="text-3xl font-bold text-center mb-6">
          ELECTRE I Decision Support Wizard
        </h2>

        {step === 1 && (
          <Step1_Setup
            numAlts={numAlts}
            numCrits={numCrits}
            setNumAlts={setNumAlts}
            setNumCrits={setNumCrits}
            onImport={handleImportData}
            onNext={() => {
              setAlts(Array.from({ length: numAlts }, (_, i) => `A${i + 1}`));
              setCrits(Array.from({ length: numCrits }, (_, i) => `C${i + 1}`));
              setTypes(Array.from({ length: numCrits }, () => "max"));
              setWeights(Array.from({ length: numCrits }, () => 1));
              setMinVals(Array.from({ length: numCrits }, () => 0));
              setMaxVals(Array.from({ length: numCrits }, () => 1));
              setStep(2);
            }}
          />
        )}

        {step === 2 && (
          <Step2_DefineCriteria
            alts={alts}
            crits={crits}
            types={types}
            weights={weights}
            minVals={minVals}
            maxVals={maxVals}
            setAlts={setAlts}
            setCrits={setCrits}
            setTypes={setTypes}
            setWeights={setWeights}
            setMinVals={setMinVals}
            setMaxVals={setMaxVals}
            onNext={() => {
              setMatrix(
                Array.from({ length: numAlts }, () =>
                  Array.from({ length: numCrits }, () => 0)
                )
              );
              setStep(3);
            }}
            onBack={() => setStep(1)}
          />
        )}

        {step === 3 && (
          <Step3_FillMatrix
            alts={alts}
            crits={crits}
            matrix={matrix}
            setMatrix={setMatrix}
            onNext={() => setStep(4)}
            onBack={() => setStep(2)}
          />
        )}

        {step === 4 && (
          <Step4_RunElectre
            muC={muC}
            muD={muD}
            setMuC={setMuC}
            setMuD={setMuD}
            onRun={handleRun}
            onBack={() => setStep(3)}
          />
        )}

        {step === 5 && result && (
          <Step5_Results result={result} onRestart={() => setStep(1)} />
        )}
      </div>
    </div>
  );
};

export default ElectreWizard;
