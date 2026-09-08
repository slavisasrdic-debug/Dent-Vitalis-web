// Parse captured scripts, ignoring source formatting but retaining literal values.
// This is static analysis: no supplied script is evaluated.
import { readFileSync } from 'node:fs';

import { parse } from 'acorn';

function normalize(value) {
  if (Array.isArray(value)) return value.map(normalize);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([key]) => !['start', 'end', 'raw'].includes(key))
        .map(([key, child]) => [key, normalize(child)]),
    );
  }
  return value;
}

function signature(source) {
  try {
    return JSON.stringify(JSON.parse(source));
  } catch {
    return JSON.stringify(normalize(parse(source, { ecmaVersion: 'latest' })));
  }
}

const pairs = JSON.parse(readFileSync(0, 'utf8'));
const results = pairs.map(({ path, handoff, exported }) => ({
  path,
  pairs: handoff.length,
  sameCount: handoff.length === exported.length,
  comparisons: handoff.map((source, index) => {
    try {
      return {
        index,
        sameAst: signature(source) === signature(exported[index]),
      };
    } catch (error) {
      return { index, error: error.message };
    }
  }),
}));
process.stdout.write(JSON.stringify(results));
