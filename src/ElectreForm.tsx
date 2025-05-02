/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { runElectreI, CriterionType, ElectreResult } from "./utils/electre";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MatrixTable from "./MatrixTable";

const ElectreForm: React.FC = () => {
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

  const handleMatrixChange = (i: number, j: number, value: string) => {
    const newMatrix = [...matrix];
    newMatrix[i][j] = parseFloat(value);
    setMatrix(newMatrix);
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
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      } catch (err) {
        alert("Invalid file format. Make sure it's a proper JSON.");
      }
    };
    reader.readAsText(file);
  };

  const handleExport = () => {
    if (!result) return;
    const blob = new Blob([JSON.stringify(result, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "electre_results.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleGenerate = () => {
    setAlts(Array.from({ length: numAlts }, (_, i) => `A${i + 1}`));
    setCrits(Array.from({ length: numCrits }, (_, i) => `C${i + 1}`));
    setTypes(Array.from({ length: numCrits }, () => "max"));
    setWeights(Array.from({ length: numCrits }, () => 1));
    setMinVals(Array.from({ length: numCrits }, () => 0));
    setMaxVals(Array.from({ length: numCrits }, () => 1));
    setMatrix(
      Array.from({ length: numAlts }, () =>
        Array.from({ length: numCrits }, () => 0)
      )
    );
    setResult(null);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <h2 className="text-3xl font-bold text-center border-b-2">
        ELECTRE I Decision Support
      </h2>

      <div className="flex flex-wrap gap-4 items-center">
        <Input
          type="number"
          value={numAlts}
          onChange={(e) => setNumAlts(parseInt(e.target.value))}
          placeholder="Number of Alternatives"
        />
        <Input
          type="number"
          value={numCrits}
          onChange={(e) => setNumCrits(parseInt(e.target.value))}
          placeholder="Number of Criteria"
        />
        <Button onClick={handleGenerate}>Generate Table</Button>
      </div>

      {alts.length > 0 && crits.length > 0 && (
        <>
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="flex gap-4">
              <Input type="file" accept=".json" onChange={handleFileUpload} />
              <Button onClick={handleExport} disabled={!result}>
                Export Results
              </Button>
            </div>
            <div className="flex gap-4">
              <Input
                type="number"
                step="0.01"
                value={muC}
                onChange={(e) => setMuC(parseFloat(e.target.value))}
                placeholder="mu_c"
              />
              <Input
                type="number"
                step="0.01"
                value={muD}
                onChange={(e) => setMuD(parseFloat(e.target.value))}
                placeholder="mu_d"
              />
              <Button onClick={handleRun}>Run ELECTRE I</Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="table-auto border border-collapse w-full">
              <thead>
                <tr>
                  <th className="border px-2 py-1">Alt / Crit</th>
                  {crits.map((crit, j) => (
                    <th key={j} className="border px-2 py-1">
                      <Input
                        value={crit}
                        onChange={(e) => {
                          const updated = [...crits];
                          updated[j] = e.target.value;
                          setCrits(updated);
                        }}
                        className="mb-1"
                      />
                      <select
                        value={types[j]}
                        onChange={(e) => {
                          const updated = [...types];
                          updated[j] = e.target.value as CriterionType;
                          setTypes(updated);
                        }}
                        className="text-sm border rounded w-full mb-1"
                      >
                        <option value="max">max</option>
                        <option value="min">min</option>
                      </select>
                      <Input
                        type="number"
                        value={weights[j]}
                        onChange={(e) => {
                          const updated = [...weights];
                          updated[j] = parseFloat(e.target.value);
                          setWeights(updated);
                        }}
                        placeholder="weight"
                      />
                      <div className="flex gap-1 text-xs mt-1">
                        <Input
                          type="number"
                          value={minVals[j]}
                          onChange={(e) => {
                            const updated = [...minVals];
                            updated[j] = parseFloat(e.target.value);
                            setMinVals(updated);
                          }}
                          placeholder="min"
                        />
                        <Input
                          type="number"
                          value={maxVals[j]}
                          onChange={(e) => {
                            const updated = [...maxVals];
                            updated[j] = parseFloat(e.target.value);
                            setMaxVals(updated);
                          }}
                          placeholder="max"
                        />
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {alts.map((alt, i) => (
                  <tr key={i}>
                    <td className="border px-2 py-1">
                      <Input
                        value={alt}
                        onChange={(e) => {
                          const updated = [...alts];
                          updated[i] = e.target.value;
                          setAlts(updated);
                        }}
                      />
                    </td>
                    {crits.map((_, j) => (
                      <td key={j} className="border px-2 py-1">
                        <Input
                          type="number"
                          value={matrix[i][j]}
                          onChange={(e) =>
                            handleMatrixChange(i, j, e.target.value)
                          }
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {result && (
        <Tabs defaultValue="kernel" className="mt-6">
          <TabsList className="flex gap-2 flex-wrap">
            <TabsTrigger value="kernel">Kernel</TabsTrigger>
            <TabsTrigger value="normalized">Normalized Matrix</TabsTrigger>
            <TabsTrigger value="concordance">Concordance Matrix</TabsTrigger>
            <TabsTrigger value="discordance">Discordance Matrix</TabsTrigger>
            <TabsTrigger value="outranking">Outranking Matrix</TabsTrigger>
          </TabsList>
          <TabsContent value="kernel">
            <div className="bg-gray-100 p-4 rounded">
              <p className="font-semibold mb-2">Kernel Alternatives:</p>
              <ul className="list-disc pl-6">
                {result.kernel.map((alt) => (
                  <li key={alt}>{alt}</li>
                ))}
              </ul>
            </div>
          </TabsContent>
          <TabsContent value="normalized">
            <MatrixTable data={result.normalizedMatrix} />
          </TabsContent>
          <TabsContent value="concordance">
            <MatrixTable data={result.concordanceMatrix} />
          </TabsContent>
          <TabsContent value="discordance">
            <MatrixTable data={result.discordanceMatrix} />
          </TabsContent>
          <TabsContent value="outranking">
            <MatrixTable data={result.outrankingMatrix} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default ElectreForm;
