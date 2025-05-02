import React from "react";

export type MatrixTableProps = {
  data: number[][] | Record<string, Record<string, number | boolean>>;
  labels?: string[];
};

const MatrixTable: React.FC<MatrixTableProps> = ({ data, labels }) => {
  let rows: string[] = [];
  let matrix: (number | boolean)[][] = [];

  if (Array.isArray(data)) {
    // Handle 2D array
    matrix = data;
    rows = labels ?? data.map((_, i) => `A${i + 1}`);
  } else {
    // Handle Record<string, Record<string, value>>
    rows = Object.keys(data);
    matrix = rows.map((row) => rows.map((col) => data[row][col]));
  }

  return (
    <div className="overflow-auto rounded border">
      <table className="min-w-full border-collapse text-sm text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">#</th>
            {rows.map((col) => (
              <th key={col} className="border p-2 text-center">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row}>
              <td className="border p-2 font-semibold">{row}</td>
              {matrix[i].map((val, j) => (
                <td key={j} className="border p-2 text-center">
                  {typeof val === "number" ? val.toFixed(3) : val ? "✔️" : "✖️"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MatrixTable;
