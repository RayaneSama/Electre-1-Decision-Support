export type CriterionType = "max" | "min";

export interface ElectreResult {
  normalizedMatrix: number[][];
  concordanceMatrix: Record<string, Record<string, number>>;
  discordanceMatrix: Record<string, Record<string, number>>;
  outrankingMatrix: Record<string, Record<string, boolean>>;
  kernel: string[];
}

export function runElectreI(
  rawMatrix: number[][],
  weights: number[],
  types: CriterionType[],
  alts: string[],
  crits: string[],
  mu_c: number,
  mu_d: number,
  minVals: number[],
  maxVals: number[]
): ElectreResult {
  const normWeights = weights.map((w) => w / weights.reduce((a, b) => a + b));

  // Step 1: Normalize matrix using given min and max values
  const normalizedMatrix = normalizeMatrixPythonStyle(
    rawMatrix,
    types,
    minVals,
    maxVals
  );

  const numAlts = alts.length;
  const numCrits = crits.length;

  const concordanceMatrix: Record<string, Record<string, number>> = {};
  const discordanceMatrix: Record<string, Record<string, number>> = {};

  // Step 2: Concordance Matrix
  for (let i = 0; i < numAlts; i++) {
    const ai = alts[i];
    concordanceMatrix[ai] = {};
    for (let j = 0; j < numAlts; j++) {
      const aj = alts[j];
      let score = 0;
      for (let k = 0; k < numCrits; k++) {
        if (normalizedMatrix[i][k] >= normalizedMatrix[j][k]) {
          score += normWeights[k];
        }
      }
      concordanceMatrix[ai][aj] = parseFloat(score.toFixed(3));
    }
  }

  // Step 3: Calculate delta
  let delta = 0;
  for (let k = 0; k < numCrits; k++) {
    for (let i = 0; i < numAlts; i++) {
      for (let j = i + 1; j < numAlts; j++) {
        delta = Math.max(
          delta,
          Math.abs(normalizedMatrix[i][k] - normalizedMatrix[j][k])
        );
      }
    }
  }

  // Step 4: Discordance Matrix
  for (let i = 0; i < numAlts; i++) {
    const ai = alts[i];
    discordanceMatrix[ai] = {};
    for (let j = 0; j < numAlts; j++) {
      const aj = alts[j];
      let score = 0;
      for (let k = 0; k < numCrits; k++) {
        if (normalizedMatrix[i][k] < normalizedMatrix[j][k]) {
          const diff =
            (normalizedMatrix[j][k] - normalizedMatrix[i][k]) / delta;
          score = Math.max(score, diff);
        }
      }
      discordanceMatrix[ai][aj] = parseFloat(score.toFixed(3));
    }
  }

  // Step 5: Outranking Matrix
  const outrankingMatrix: Record<string, Record<string, boolean>> = {};
  for (const ai of alts) {
    outrankingMatrix[ai] = {};
    for (const aj of alts) {
      const c = concordanceMatrix[ai][aj];
      const d = discordanceMatrix[ai][aj];
      outrankingMatrix[ai][aj] = c >= mu_c && d <= mu_d;
    }
  }

  // Step 6: Kernel
  const kernel: string[] = [];
  for (const alt of alts) {
    const col = alts.filter(
      (other) => other !== alt && outrankingMatrix[other][alt]
    );
    if (col.length === 0) kernel.push(alt);
  }

  return {
    normalizedMatrix,
    concordanceMatrix,
    discordanceMatrix,
    outrankingMatrix,
    kernel,
  };
}

// Updated normalization: exact translation of the Python version
function normalizeMatrixPythonStyle(
  matrix: number[][],
  types: CriterionType[],
  minVals: number[],
  maxVals: number[]
): number[][] {
  const numAlts = matrix.length;
  const numCrits = matrix[0].length;
  const normalized: number[][] = [];

  for (let i = 0; i < numAlts; i++) {
    normalized[i] = [];
    for (let j = 0; j < numCrits; j++) {
      const val = matrix[i][j];
      const min = minVals[j];
      const max = maxVals[j];
      const denom = max - min || 1;
      let norm = 0;
      if (types[j] === "max") {
        norm = (val - min) / denom;
      } else {
        norm = (max - val) / denom;
      }
      normalized[i][j] = parseFloat(norm.toFixed(3));
    }
  }

  return normalized;
}
