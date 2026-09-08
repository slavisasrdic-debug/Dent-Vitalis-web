// Parse a source configuration as data; never execute the supplied Webflow code.
// Acorn is already present in this project's installed dependency graph.
import { readFileSync } from 'node:fs';

import { parseExpressionAt } from 'acorn';

const file = process.argv[2];
const code = readFileSync(file, 'utf8');
const marker = /Webflow\.require\(["']ix2["']\)\.init\(/g;
const match = marker.exec(code);
if (!match) throw new Error('No IX2 initialization found');
const expression = parseExpressionAt(code, marker.lastIndex, {
  ecmaVersion: 'latest',
});

function literal(node) {
  if (node.type === 'Literal') return node.value;
  if (node.type === 'ObjectExpression') {
    return Object.fromEntries(
      node.properties.map((property) => {
        if (
          property.type !== 'Property' ||
          property.computed ||
          property.method
        )
          throw new Error('Nonliteral object property');
        return [
          property.key.name ?? property.key.value,
          literal(property.value),
        ];
      }),
    );
  }
  if (node.type === 'ArrayExpression') return node.elements.map(literal);
  if (node.type === 'UnaryExpression') {
    const value = literal(node.argument);
    if (node.operator === '!') return !value;
    if (node.operator === '-') return -value;
    if (node.operator === '+') return +value;
  }
  throw new Error(`Nonliteral configuration expression: ${node.type}`);
}

process.stdout.write(JSON.stringify(literal(expression)));
