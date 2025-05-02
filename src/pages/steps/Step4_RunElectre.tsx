import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Step4Props {
  muC: number;
  muD: number;
  setMuC: (value: number) => void;
  setMuD: (value: number) => void;
  onRun: () => void;
  onBack: () => void;
}

const Step4_RunElectre: React.FC<Step4Props> = ({
  muC,
  muD,
  setMuC,
  setMuD,
  onRun,
  onBack,
}) => {
  return (
    <div className="space-y-6 bg-white shadow-2xl rounded-3xl px-6 md:px-10 py-8 md:py-12 border border-gray-200">
      <h3 className="text-2xl font-semibold text-center">Step 4: Thresholds</h3>
      <p className="text-center text-gray-600">
        Set the concordance (muC) and discordance (muD) thresholds, then run the
        ELECTRE I method.
      </p>

      <div className="flex flex-col md:flex-row justify-center gap-6">
        <div>
          <label className="block mb-1 font-medium">
            muC (Concordance Threshold)
          </label>
          <Input
            type="number"
            step="0.01"
            value={muC}
            onChange={(e) => setMuC(parseFloat(e.target.value))}
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">
            muD (Discordance Threshold)
          </label>
          <Input
            type="number"
            step="0.01"
            value={muD}
            onChange={(e) => setMuD(parseFloat(e.target.value))}
          />
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="secondary" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onRun}>Run ELECTRE I</Button>
      </div>
    </div>
  );
};

export default Step4_RunElectre;
