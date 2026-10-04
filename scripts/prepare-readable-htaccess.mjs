import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { readableHtaccess } from './readable-htaccess.mjs';
import decisions from '../data/seo/cpanel-redirect-decisions.json' with { type: 'json' };

const attachment = process.argv[2];
assert.ok(
  attachment && process.argv.length === 3,
  'Supply the owner attachment for the comparison',
);
const original = await readFile(attachment, 'utf8');
const accepted = await readFile('docs/seo/handoff-simple-20261004/.htaccess');
const output = readableHtaccess(accepted);
const current = new Map(
  [
    ...accepted.toString().matchAll(/^Redirect\s+301\s+(\S+)\s+(\S+)\s*$/gm),
  ].map((m) => [m[1], m[2]]),
);
for (const m of accepted
  .toString()
  .matchAll(/^RewriteRule \^(.*?)\/\?\$ (\/\S+) \[R=301,L,NE\]$/gm))
  current.set('/' + m[1].replace(/\\(.)/g, '$1'), m[2]);
const attached = [
  ...original.matchAll(
    /^RewriteRule \^(.*?)\/\?\$ https:\/\/www\.dentvitalis\.com(\S+) \[R=301,L,NE\]$/gm,
  ),
].map((m) => ({ from: '/' + m[1].replace(/\\(.)/g, '$1'), to: m[2] }));
assert.equal(attached.length, 186, 'Attachment inventory changed');
const documents = JSON.parse(await readFile('dist/page-routes.json', 'utf8'));
const sha = (bytes) => createHash('sha256').update(bytes).digest('hex');
const report = {
  status: 'local-review-candidate-not-installed-not-packaged',
  attachmentSha256: sha(original),
  acceptedSourceSha256: sha(accepted),
  outputSha256: sha(output),
  outputBytes: Buffer.byteLength(output),
  outputLines: output.trimEnd().split('\n').length,
  attachedContentRedirects: attached.length,
  duplicateAttachedSources: attached.filter(
    (r, i) => attached.findIndex((p) => p.from === r.from) !== i,
  ),
  missingStaticTargets: attached.filter(
    (r) => r.to !== '/' && !documents[r.to],
  ),
  nativeSourceCollisions: attached.filter((r) => documents[r.from]),
  unchangedAttachedMappings: attached.filter(
    (r) => current.get(r.from) === r.to,
  ).length,
  retargetedExistingMappings: attached
    .filter((r) => current.has(r.from) && current.get(r.from) !== r.to)
    .map((r) => ({ ...r, acceptedTo: current.get(r.from) })),
  newMappingsRequiringContentApproval: attached.filter(
    (r) => !current.has(r.from),
  ),
  preservedPhpPagesInterceptedByAttachment: attached.filter((r) =>
    decisions.preservedPhpPages.includes(r.from),
  ),
  acceptedMappingOmittedFromAttachment: [...current]
    .filter(([from]) => !attached.some((r) => r.from === from))
    .map(([from, to]) => ({ from, to })),
  outputLegacy301UniqueRules: 57,
  removedIdenticalLegacyDuplicateOccurrences: 7,
  outputApprovedContent301: 8,
  outputReviewContent301: 8,
  reviewRulesStillRequireProductionApproval: true,
  productionChanged: false,
  v6ArchiveChanged: false,
  realFormSubmissionPerformed: false,
};
const folder = 'docs/seo/handoff-readable-20261004';
await mkdir(folder, { recursive: true });
await writeFile(folder + '/.htaccess', output);
await writeFile(folder + '/htaccess-novi.txt', output);
await writeFile(
  'data/seo/htaccess-attachment-review-20261004.json',
  JSON.stringify(report, null, 2) + '\n',
);
console.log(
  JSON.stringify(
    {
      file: folder + '/.htaccess',
      lines: report.outputLines,
      bytes: report.outputBytes,
      attached: attached.length,
      retargeted: report.retargetedExistingMappings.length,
      newUnconfirmed: report.newMappingsRequiringContentApproval.length,
      protectedPhp: report.preservedPhpPagesInterceptedByAttachment.length,
      sha256: report.outputSha256,
    },
    null,
    2,
  ),
);
