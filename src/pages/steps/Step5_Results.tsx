import React from "react";
import { ElectreResult } from "../../utils/electre";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MatrixTable from "../../MatrixTable";
import { Button } from "@/components/ui/button";
import OutrankingGraph from "./OutrankingGraph";
import OutrankingGraph2 from "./OutrankingGraph2";

interface Step5Props {
  result: ElectreResult;
  onRestart: () => void;
}

const Step5_Results: React.FC<Step5Props> = ({ result, onRestart }) => {
  const handleExport = () => {
    const blob = new Blob([JSON.stringify(result, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "electre_results.json";
    link.click();
  };

  return (
    <div className="space-y-10 bg-white shadow-2xl rounded-3xl px-6 md:px-10 py-10 border border-gray-200">
      <h3 className="text-3xl font-bold text-center">Step 5: Results</h3>
      <p className="text-center text-gray-600 max-w-2xl mx-auto">
        Based on your input, here are the ELECTRE I decision support results,
        including matrix breakdowns and outranking visualizations.
      </p>

      {/* Results Tabs */}
      <Tabs defaultValue="kernel" className="w-full">
        <TabsList className="flex flex-wrap gap-2 justify-center">
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

      {/* Graph Section */}
      <div className="space-y-10">
        <div>
          <h4 className="text-xl font-semibold mb-2 text-center">
            Outranking Graph (SVG Representation)
          </h4>
          <OutrankingGraph result={result} />
        </div>

        <div>
          <h4 className="text-xl font-semibold mb-2 text-center">
            Outranking Graph (Alternative View)
          </h4>
          <OutrankingGraph2 result={result} />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-4 pt-6">
        <Button onClick={onRestart} variant="outline">
          Start Over
        </Button>
        <Button onClick={handleExport}>Export Results</Button>
      </div>
    </div>
  );
};

export default Step5_Results;
