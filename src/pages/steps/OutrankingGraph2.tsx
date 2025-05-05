/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useRef } from "react";
import { ElectreResult } from "../../utils/electre";
import { toPng } from "html-to-image";
import { Button } from "@/components/ui/button";

interface Props {
  result: ElectreResult;
}

const OutrankingGraph: React.FC<Props> = ({ result }) => {
  const graphRef = useRef<HTMLDivElement>(null);

  const handleExport = async () => {
    if (graphRef.current === null) return;

    try {
      const dataUrl = await toPng(graphRef.current);
      const link = document.createElement("a");
      link.download = "outranking-graph.png";
      link.href = dataUrl;
      link.click();
    } catch (err) {
      alert("Failed to export graph.");
    }
  };

  const nodes = Object.keys(result.outrankingMatrix);
  const radius = 200;
  const centerX = 350;
  const centerY = 250;
  const angleStep = (2 * Math.PI) / nodes.length;

  const positions = nodes.reduce((acc, node, index) => {
    const angle = index * angleStep;
    acc[node] = {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    };
    return acc;
  }, {} as Record<string, { x: number; y: number }>);

  const edges: { from: string; to: string }[] = [];
  for (const from of nodes) {
    for (const to of nodes) {
      if (from !== to && result.outrankingMatrix[from][to]) {
        edges.push({ from, to });
      }
    }
  }

  return (
    <div className="mt-8 space-y-2">
      <div
        ref={graphRef}
        className="bg-white border rounded-xl shadow p-4 w-full max-w-4xl mx-auto overflow-x-auto"
      >
        <div className="relative w-full pb-[71.42%]">
          {" "}
          {/* Maintains 700x500 ratio */}
          <svg
            viewBox="0 0 700 500"
            preserveAspectRatio="xMidYMid meet"
            className="absolute top-0 left-0 w-full h-full"
          >
            <defs>
              <marker
                id="arrow"
                markerWidth="10"
                markerHeight="10"
                refX="10"
                refY="5"
                orient="auto"
                markerUnits="strokeWidth"
              >
                <path d="M0,0 L10,5 L0,10" fill="#4f46e5" />
              </marker>
            </defs>

            {edges.map(({ from, to }, i) => {
              const fromPos = positions[from];
              const toPos = positions[to];
              const dx = toPos.x - fromPos.x;
              const dy = toPos.y - fromPos.y;
              const len = Math.sqrt(dx * dx + dy * dy);
              const offset = 30;

              const fromX = fromPos.x + (dx / len) * offset;
              const fromY = fromPos.y + (dy / len) * offset;
              const toX = toPos.x - (dx / len) * offset;
              const toY = toPos.y - (dy / len) * offset;

              return (
                <line
                  key={i}
                  x1={fromX}
                  y1={fromY}
                  x2={toX}
                  y2={toY}
                  stroke="#4f46e5"
                  strokeWidth="2"
                  markerEnd="url(#arrow)"
                />
              );
            })}

            {nodes.map((node) => {
              const { x, y } = positions[node];
              const isKernel = result.kernel.includes(node);
              return (
                <g key={node}>
                  <circle
                    cx={x}
                    cy={y}
                    r="25"
                    fill={isKernel ? "#9333ea" : "#60a5fa"}
                  />
                  <text
                    x={x}
                    y={y + 5}
                    textAnchor="middle"
                    fontSize="14"
                    fontWeight="bold"
                    fill="white"
                  >
                    {node}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
        <p className="text-center text-sm text-gray-500 mt-2">
          Arrows show outranking. Purple nodes = Kernel.
        </p>
      </div>

      <div className="text-center">
        <Button onClick={handleExport} variant="secondary">
          Export Graph as PNG
        </Button>
      </div>
    </div>
  );
};

export default OutrankingGraph;
