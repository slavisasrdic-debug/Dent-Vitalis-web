import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { promisify } from 'node:util';

const run = promisify(execFile);
const root = new URL('../', import.meta.url);
const report = JSON.parse(
  await readFile(new URL('data/migration-readiness.json', root), 'utf8'),
);

test('current migration procedure does not require SSH or a hosting request', () => {
  assert.equal(report.procedure.sshIsMigrationPrerequisite, false);
  assert.equal(report.procedure.hostingSupportRequestRequired, false);
  assert.equal(report.procedure.automaticProductionDeploymentReady, false);
  assert.ok(!report.serverGates.some((gate) => gate.startsWith('SSH-')));
  assert.match(
    report.procedure.routes.sshStage.retryOnlyAfter,
    /new-owner-decision/,
  );
  assert.match(report.procedure.routes.fileManager.status, /not-tested/);
});

test('confirmed API menu is not confused with authenticated or successful deploy operations', () => {
  const api = report.procedure.routes.cpanelApi;
  assert.equal(api.menuOpensAsReportedByAgent, true);
  assert.equal(api.authenticatedProbeRun, false);
  assert.equal(api.uploadBackupActivationAndRollbackTested, false);
  assert.equal(api.tokenCreated, false);
  assert.equal(
    report.procedure.routes.cpanelGit.previousUploadDeployMethod,
    'not-established',
  );
  assert.ok(
    report.procedure.doNotRepeatWithoutNewEvidence.includes(
      'API-menu-inspection',
    ),
  );
});

test('no production approval, private data rollback or real mail submission is inferred', () => {
  assert.equal(report.productionDeploymentAuthorized, false);
  assert.equal(report.serverChangesApplied, false);
  assert.equal(report.realTestMessagesSent, false);
  assert.deepEqual(
    report.deploymentAutomation.automaticRollbackMustNotRestore,
    ['application/data'],
  );
  assert.equal(new Set(report.serverGates).size, report.serverGates.length);
});

test('paused SSH workflow exits before checkout/build/server connection', async () => {
  const workflow = await readFile(
    new URL('.github/workflows/stage-cpanel-release.yml', root),
    'utf8',
  );
  const match = workflow.match(
    /- name: Stop paused SSH stage before any connection\n {8}if: \$\{\{ inputs\.stage_to_cpanel \}\}\n {8}run: \|\n((?: {10}.*\n)+)/,
  );
  assert.ok(match, 'Explicit SSH rejection guard must remain present.');
  assert.ok(match.index < workflow.indexOf('- uses: actions/checkout'));
  const script = match[1]
    .split('\n')
    .map((line) => line.slice(10))
    .join('\n');
  assert.doesNotMatch(script, /\b(?:ssh|scp|curl)\s+/);
  await assert.rejects(run('bash', ['-c', script]), (error) => {
    assert.equal(error.code, 1);
    assert.match(error.stdout, /no server connection attempted/);
    return true;
  });
});

test('API probe workflow is manual/main-only and produces no private artifacts', async () => {
  const workflow = await readFile(
    new URL('.github/workflows/probe-cpanel-api.yml', root),
    'utf8',
  );
  assert.match(workflow, /workflow_dispatch:/);
  assert.match(workflow, /environment: cpanel-api-readonly/);
  assert.match(workflow, /test "\$GITHUB_REF" = 'refs\/heads\/main'/);
  assert.match(workflow, /test "\$APPROVE_READ_ONLY" = 'true'/);
  assert.doesNotMatch(
    workflow,
    /actions\/upload-artifact|stage_to_cpanel|release:prepare|\bssh\s|\bscp\s/,
  );
  assert.match(workflow, /persist-credentials: false/);
});
