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
  assert.equal(report.ownerAuthorization.fileManagerMigration, true);
  assert.match(report.procedure.routes.fileManager.role, /owner-selected/);
});

test('created token and failed probe are not confused with confirmed authentication or deploy', () => {
  const api = report.procedure.routes.cpanelApi;
  assert.equal(api.menuOpensAsReportedByAgent, true);
  assert.equal(api.authenticatedProbeRun, true);
  assert.equal(api.authenticationConfirmed, false);
  assert.equal(api.metadataReadConfirmed, false);
  assert.equal(api.probeRun.conclusion, 'failure');
  assert.equal(api.probeRun.retried, false);
  assert.equal(api.uploadBackupActivationAndRollbackTested, false);
  assert.equal(api.tokenCreated, true);
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

test('owner approval is recorded without inferring access, completed gates or real delivery', () => {
  assert.equal(report.productionDeploymentAuthorized, true);
  assert.equal(report.ownerAuthorization.dedicatedExpiringApiToken, true);
  assert.equal(report.ownerAuthorization.protectedGitHubSecretStorage, true);
  assert.equal(report.ownerAuthorization.readOnlyApiProbe, true);
  assert.equal(report.ownerAuthorization.releaseGatesMayBeBypassed, false);
  assert.equal(report.ownerAuthorization.dnsChangesAuthorized, false);
  assert.equal(report.ownerAuthorization.privateDataOverwriteAuthorized, false);
  assert.equal(report.procedure.routes.cpanelApi.nextAuthorityNeeded, null);
  assert.equal(report.serverChangesApplied, false);
  assert.equal(report.realTestMessagesSent, false);
  assert.deepEqual(
    report.deploymentAutomation.automaticRollbackMustNotRestore,
    ['application/data'],
  );
  assert.equal(new Set(report.serverGates).size, report.serverGates.length);
});

test('failed GitHub settings attempt is recorded and not retried without changed access', () => {
  const access = report.accessPreparation;
  assert.equal(access.githubEnvironment.creationHttpStatus, 403);
  assert.equal(access.githubEnvironment.configuredByThisSession, false);
  assert.equal(access.githubEnvironment.tokenStoredByThisSession, false);
  assert.equal(
    access.githubEnvironment.configuredByBrowserAgentAsReported,
    true,
  );
  assert.equal(
    access.githubEnvironment.protectionRulesIndependentlyVerified,
    true,
  );
  assert.equal(
    access.githubEnvironment.currentProtection.canAdminsBypass,
    false,
  );
  assert.deepEqual(access.githubEnvironment.currentProtection.allowedBranches, [
    'main',
  ]);
  assert.deepEqual(access.githubEnvironment.currentProtection.allowedTags, []);
  assert.equal(access.probeWorkflowDispatched, true);
  assert.equal(access.productionUploadAttempted, false);
  assert.equal(access.productionActivationAttempted, false);
  assert.match(
    access.githubEnvironment.retryOnlyAfter,
    /permission-change-or-authorized-browser/,
  );
  assert.ok(
    report.procedure.doNotRepeatWithoutNewEvidence.includes(
      'GitHub-environment-creation-through-current-integration-after-HTTP-403',
    ),
  );
});

test('credential-free TCP failure does not establish runner cause or justify a token retry', () => {
  const network = report.accessPreparation.credentialFreeConnectivity;
  assert.equal(network.tokenUsed, false);
  assert.equal(network.authenticatedApiRequestRetried, false);
  assert.equal(network.tcpConnectionEstablished, false);
  assert.equal(network.tlsHandshakeStarted, false);
  assert.equal(
    network.exactGithubRunnerFailureOrFirewallPolicyEstablished,
    false,
  );
  assert.equal(network.publicWebsiteHttpStatus, 200);
  assert.match(report.procedure.currentDirection, /File-Manager/);
  assert.match(
    report.procedure.routes.cpanelApi.retryOnlyAfter,
    /not-token-recreation/,
  );
});

test('approved private stage does not bypass pending full backup or authorize live overwrites', () => {
  const progress = report.fileManagerProgress;
  assert.equal(
    report.ownerAuthorization.isolatedStageWhileBackupVerificationPending,
    true,
  );
  assert.match(progress.isolatedStage.target, /^\/home2\/dentvita\/releases\//);
  assert.equal(progress.isolatedStage.uploadedAsReported, true);
  assert.equal(progress.isolatedStage.extractedAsReported, true);
  assert.equal(progress.isolatedStage.mayOverwriteExistingTarget, false);
  assert.equal(progress.isolatedStage.mayModifyPublicHtmlOrApplication, false);
  assert.equal(
    progress.isolatedStage.mayActivateWithoutBackupAndFormAcceptance,
    false,
  );
  assert.equal(
    progress.backupVerification.completedFullOffServerCopyVerified,
    false,
  );
  assert.equal(progress.backupVerification.activationGateClosed, false);
  assert.equal(
    progress.backupVerification.policyBypassAttemptedAsReported,
    false,
  );
  assert.ok(
    progress.serverArchive.includesAsReported.includes(
      'application-including-data',
    ),
  );
  assert.match(report.procedure.nextCheck, /without-public-activation/);
});

test('private upload and extraction evidence do not prove server integrity or safe permissions', () => {
  const stage = report.fileManagerProgress.isolatedStage;
  assert.equal(stage.uploadEvidence.displayedProgressPercent, 100);
  assert.equal(
    stage.uploadEvidence.archiveName,
    report.preparedStaticCandidate.archiveName,
  );
  assert.equal(stage.uploadEvidence.serverExactBytesAndSha256Verified, false);
  assert.equal(stage.extractedAsReported, true);
  assert.deepEqual(stage.rootFilesPresentAsReported, [
    'index.html',
    '.htaccess',
    'release-manifest.json',
  ]);
  assert.equal(stage.permissions.correctedAndVerifiedOnServer, false);
  assert.equal(stage.permissions.requiredFiles, '0644');
  assert.equal(stage.permissions.requiredDirectories, '0755');
  assert.match(stage.permissions.scope, /no-symlinks-or-parent-directories/);
  assert.match(
    report.procedure.nextCheck,
    /redacted-legacy-delivery-source-review/,
  );
  assert.ok(
    report.serverGates.includes(
      'static-release-files-0644-and-directories-0755-verified-before-activation',
    ),
  );
  assert.match(
    report.fileManagerProgress.backupVerification
      .localVerificationResponsibility,
    /not-Chrome-only-browser-agent/,
  );
});

test('limited File Manager is recorded; local repack does not imply server correction', () => {
  const permissions = report.fileManagerProgress.isolatedStage.permissions;
  const candidate = report.preparedPermissionNormalizedCandidate;
  const replacement = report.fileManagerProgress.replacementStage;
  assert.equal(
    permissions.fileManagerTypeAwareRecursionAvailableAsReported,
    false,
  );
  assert.equal(
    permissions.permissionDialogClosedWithoutChangesAsReported,
    true,
  );
  assert.equal(permissions.rootDirectoryAsReported, '0755');
  assert.equal(
    candidate.contentGitCommit,
    report.preparedStaticCandidate.gitCommit,
  );
  assert.equal(
    candidate.allExtractedFilesAndManifestByteIdenticalToSource,
    true,
  );
  assert.equal(candidate.totalFilesIncludingManifest, 692);
  assert.equal(candidate.allLocalExtractedFilesMode, '0644');
  assert.equal(candidate.allLocalExtractedDirectoriesMode, '0755');
  assert.equal(candidate.newBuildPerformed, false);
  assert.equal(candidate.serverUploadOrExtractionPerformed, false);
  assert.notEqual(
    replacement.target,
    report.fileManagerProgress.isolatedStage.target,
  );
  assert.equal(replacement.uploadedAsReported, false);
  assert.equal(replacement.extractedAsReported, false);
  assert.equal(replacement.serverPermissionsVerified, false);
  assert.equal(replacement.mayOverwriteExistingTarget, false);
  assert.equal(replacement.mayModifyPublicHtmlOrApplication, false);
  assert.equal(replacement.oldStageMustRemainUntouched, true);
});

test('latest read-only form audit holds new upload and cannot close delivery or runtime gates', () => {
  const audit = report.preActivationReadOnlyReview;
  assert.equal(audit.newUploadHeldUntilBackendPlanResolved, true);
  assert.equal(audit.tokenTemplateInstalledAsReported, false);
  assert.equal(audit.uploadGuardInstalledAsReported, false);
  assert.equal(audit.runtimeIndependentlyVerified, false);
  assert.equal(
    audit.preparedLocalPhpFilesMatchPublicManifestAndPrivateArchive,
    true,
  );
  assert.equal(audit.legacyOkMayFollowDeliveryFailureAsReported, true);
  assert.equal(audit.legacyDeliveryResponseSafelyPatched, false);
  assert.equal(audit.reviewedRedactedCurrentDeliverySourceAvailable, false);
  assert.equal(audit.crmTestSkippedForTestExampleComAsReported, true);
  assert.equal(audit.realEmailOrCrmTestRun, false);
  assert.equal(audit.oldPrivatePatchZipMustNotBeInstalledAsFinalPackage, true);
  assert.equal(
    audit.storageDisplay.exactServerFilesystemFreeSpaceAndInodesVerified,
    false,
  );
  assert.ok(audit.rollbackMustNotRestore.includes('application/data'));
  assert.match(report.procedure.nextCheck, /before-new-upload/);
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
