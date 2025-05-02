export type Alt = string;
export type Matrix = number[][];
export type MatrixDict = Record<Alt, Record<Alt, number>>;
export type OutrankingMatrix = Record<Alt, Record<Alt, boolean>>;

function roundVal(val: number, digits = 3): number {
  const factor = Math.pow(10, digits);
  return Math.round(val * factor) / factor;
}

export function normalizeMatrix(
  matrix: Matrix,
  types: ("min" | "max")[],
  minVals: number[],
  maxVals: number[]
): Matrix {
  const numAlts = matrix.length;
  const numCrits = matrix[0].length;
  const normalized: Matrix = Array.from({ length: numAlts }, () =>
    new Array(numCrits).fill(0)
  );

  for (let i = 0; i < numCrits; i++) {
    for (let j = 0; j < numAlts; j++) {
      const val = matrix[j][i];
      const norm =
        types[i] === "max"
          ? (val - minVals[i]) / (maxVals[i] - minVals[i])
          : (maxVals[i] - val) / (maxVals[i] - minVals[i]);
      normalized[j][i] = roundVal(norm);
    }
  }
  return normalized;
}

export function runElectreI(
  matrix: Matrix,
  weights: number[],
  alts: Alt[],
  muC: number,
  muD: number
): {
  normalized_matrix: Matrix;
  concordance_matrix: MatrixDict;
  discordance_matrix: MatrixDict;
  outranking_matrix: OutrankingMatrix;
  kernel: Alt[];
} {
  const numAlts = matrix.length;
  const numCrits = matrix[0].length;

  const concordanceMatrix: MatrixDict = {};
  const discordanceMatrix: MatrixDict = {};
  const outrankingMatrix: OutrankingMatrix = {};

  // Concordance
  for (let i = 0; i < numAlts; i++) {
    const altI = alts[i];
    concordanceMatrix[altI] = {};
    for (let j = 0; j < numAlts; j++) {
      const altJ = alts[j];
      let concordance = 0;
      for (let k = 0; k < numCrits; k++) {
        if (matrix[i][k] >= matrix[j][k]) {
          concordance += weights[k];
        }
      }
      concordanceMatrix[altI][altJ] = roundVal(concordance);
    }
  }

  // Discordance
  const delta = Math.max(
    ...matrix.flatMap((_, i) =>
      matrix.flatMap((_, j) =>
        i !== j
          ? matrix[i].map((_, k) => Math.abs(matrix[i][k] - matrix[j][k]))
          : [0]
      )
    )
  );

  for (let i = 0; i < numAlts; i++) {
    const altI = alts[i];
    discordanceMatrix[altI] = {};
    for (let j = 0; j < numAlts; j++) {
      const altJ = alts[j];
      let discordance = 0;
      for (let k = 0; k < numCrits; k++) {
        if (matrix[i][k] < matrix[j][k]) {
          const discord = (matrix[j][k] - matrix[i][k]) / delta;
          discordance = Math.max(discordance, discord);
        }
      }
      discordanceMatrix[altI][altJ] = roundVal(discordance);
    }
  }

  // Outranking matrix
  for (let i = 0; i < numAlts; i++) {
    const altI = alts[i];
    outrankingMatrix[altI] = {};
    for (let j = 0; j < numAlts; j++) {
      const altJ = alts[j];
      const outranks =
        concordanceMatrix[altI][altJ] >= muC &&
        discordanceMatrix[altI][altJ] <= muD;
      outrankingMatrix[altI][altJ] = outranks;
    }
  }

  // Kernel (Best Alternatives)
  const kernel: Alt[] = [];
  for (let i = 0; i < numAlts; i++) {
    const alt = alts[i];
    const column = alts
      .filter((a) => a !== alt)
      .map((other) => outrankingMatrix[other][alt]);
    if (!column.includes(true)) {
      kernel.push(alt);
    }
  }

  return {
    normalized_matrix: matrix,
    concordance_matrix: concordanceMatrix,
    discordance_matrix: discordanceMatrix,
    outranking_matrix: outrankingMatrix,
    kernel,
  };
}
