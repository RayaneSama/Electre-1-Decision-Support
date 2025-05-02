import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Step3Props {
  alts: string[];
  crits: string[];
  matrix: number[][];
  setMatrix: (value: number[][]) => void;
  onNext: () => void;
  onBack: () => void;
}

const Step3_FillMatrix: React.FC<Step3Props> = ({
  alts,
  crits,
  matrix,
  setMatrix,
  onNext,
  onBack,
}) => {
  const handleMatrixChange = (i: number, j: number, value: string) => {
    const updated = [...matrix];
    updated[i][j] = parseFloat(value);
    setMatrix(updated);
  };

  return (
    <div className="space-y-6 bg-white shadow-2xl rounded-3xl px-6 md:px-10 py-8 md:py-12 border border-gray-200">
      <h3 className="text-2xl font-semibold text-center">
        Step 3: Fill Matrix
      </h3>
      <p className="text-center text-gray-600">
        Enter how each alternative performs under each criterion.
      </p>

      <div className="overflow-x-auto">
        <table className="table-auto border border-collapse w-full">
          <thead>
            <tr>
              <th className="border px-2 py-1">Alt / Crit</th>
              {crits.map((crit, j) => (
                <th key={j} className="border px-2 py-1">
                  {crit}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {alts.map((alt, i) => (
              <tr key={i}>
                <td className="border px-2 py-1 font-medium">{alt}</td>
                {crits.map((_, j) => (
                  <td key={j} className="border px-2 py-1">
                    <Input
                      type="number"
                      value={matrix[i][j]}
                      onChange={(e) => handleMatrixChange(i, j, e.target.value)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="secondary" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onNext}>Next</Button>
      </div>
    </div>
  );
};

export default Step3_FillMatrix;
