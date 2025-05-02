import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CriterionType } from "../../utils/electre";

interface Step2Props {
  alts: string[];
  crits: string[];
  types: CriterionType[];
  weights: number[];
  minVals: number[];
  maxVals: number[];
  setAlts: (value: string[]) => void;
  setCrits: (value: string[]) => void;
  setTypes: (value: CriterionType[]) => void;
  setWeights: (value: number[]) => void;
  setMinVals: (value: number[]) => void;
  setMaxVals: (value: number[]) => void;
  onNext: () => void;
  onBack: () => void;
}

const Step2_DefineCriteria: React.FC<Step2Props> = ({
  alts,
  crits,
  types,
  weights,
  minVals,
  maxVals,
  setAlts,
  setCrits,
  setTypes,
  setWeights,
  setMinVals,
  setMaxVals,
  onNext,
  onBack,
}) => {
  return (
    <div className="space-y-6 bg-white shadow-2xl rounded-3xl px-6 md:px-10 py-8 md:py-12 border border-gray-200">
      <h3 className="text-2xl font-semibold text-center">
        Step 2: Define Criteria
      </h3>
      <p className="text-center text-gray-600">
        Customize your alternatives and criteria.
      </p>

      <div className="overflow-x-auto">
        <table className="table-auto w-full border border-collapse">
          <thead>
            <tr>
              <th className="border px-2 py-1">Alt / Crit</th>
              {crits.map((_, j) => (
                <th key={j} className="border px-2 py-1 text-sm">
                  C{j + 1}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-2 py-1 font-medium">Criteria Names</td>
              {crits.map((crit, j) => (
                <td key={j} className="border px-2 py-1">
                  <Input
                    value={crit}
                    onChange={(e) => {
                      const updated = [...crits];
                      updated[j] = e.target.value;
                      setCrits(updated);
                    }}
                  />
                </td>
              ))}
            </tr>
            <tr>
              <td className="border px-2 py-1 font-medium">Type (min/max)</td>
              {types.map((type, j) => (
                <td key={j} className="border px-2 py-1">
                  <select
                    value={type}
                    onChange={(e) => {
                      const updated = [...types];
                      updated[j] = e.target.value as CriterionType;
                      setTypes(updated);
                    }}
                    className="w-full border rounded px-1 py-1"
                  >
                    <option value="max">max</option>
                    <option value="min">min</option>
                  </select>
                </td>
              ))}
            </tr>
            <tr>
              <td className="border px-2 py-1 font-medium">Weight</td>
              {weights.map((weight, j) => (
                <td key={j} className="border px-2 py-1">
                  <Input
                    type="number"
                    value={weight}
                    onChange={(e) => {
                      const updated = [...weights];
                      updated[j] = parseFloat(e.target.value);
                      setWeights(updated);
                    }}
                  />
                </td>
              ))}
            </tr>
            <tr>
              <td className="border px-2 py-1 font-medium">Min</td>
              {minVals.map((val, j) => (
                <td key={j} className="border px-2 py-1">
                  <Input
                    type="number"
                    value={val}
                    onChange={(e) => {
                      const updated = [...minVals];
                      updated[j] = parseFloat(e.target.value);
                      setMinVals(updated);
                    }}
                  />
                </td>
              ))}
            </tr>
            <tr>
              <td className="border px-2 py-1 font-medium">Max</td>
              {maxVals.map((val, j) => (
                <td key={j} className="border px-2 py-1">
                  <Input
                    type="number"
                    value={val}
                    onChange={(e) => {
                      const updated = [...maxVals];
                      updated[j] = parseFloat(e.target.value);
                      setMaxVals(updated);
                    }}
                  />
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <label className="font-semibold">Alternative Names</label>
          <div className="flex flex-wrap gap-2 mt-2">
            {alts.map((alt, i) => (
              <Input
                key={i}
                value={alt}
                onChange={(e) => {
                  const updated = [...alts];
                  updated[i] = e.target.value;
                  setAlts(updated);
                }}
                className="w-24"
              />
            ))}
          </div>
        </div>
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

export default Step2_DefineCriteria;
