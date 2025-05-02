import React, { useMemo } from "react";
import ReactFlow, {
  Background,
  Controls,
  Edge,
  Node,
} from "react-flow-renderer";
import { ElectreResult } from "../../utils/electre";

interface Props {
  result: ElectreResult;
}

const OutrankingGraph: React.FC<Props> = ({ result }) => {
  const elements = useMemo(() => {
    const nodes: Node[] = result.kernel.map((id, i) => ({
      id,
      data: { label: id },
      position: { x: i * 150, y: 50 },
      style: { border: "2px solid #9333ea", background: "#ede9fe" }, // purple for kernel
    }));

    // Add rest of the alternatives
    for (const id in result.outrankingMatrix) {
      if (!nodes.find((n) => n.id === id)) {
        nodes.push({
          id,
          data: { label: id },
          position: { x: nodes.length * 150, y: 150 },
        });
      }
    }

    const edges: Edge[] = [];
    for (const from in result.outrankingMatrix) {
      for (const to in result.outrankingMatrix[from]) {
        if (result.outrankingMatrix[from][to] && from !== to) {
          edges.push({
            id: `e-${from}-${to}`,
            source: from,
            target: to,
            type: "default",
            animated: true,
            style: { stroke: "#4f46e5" }, // Indigo
          });
        }
      }
    }

    return { nodes, edges };
  }, [result]);

  return (
    <div className="h-[400px] border rounded-lg mt-6 bg-white shadow">
      <ReactFlow nodes={elements.nodes} edges={elements.edges} fitView>
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default OutrankingGraph;
