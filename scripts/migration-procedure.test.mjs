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
  const installation = report.ownerAuthorization.privateBackendInstallation;
  assert.equal(installation.installTwoPrivatePhpHelpers, true);
  assert.equal(installation.applyReviewedLegacySendDiff, true);
  assert.equal(installation.saveOriginalHandlerForCodeOnlyRollback, true);
  assert.equal(installation.tokenGetChecks, true);
  assert.equal(
    installation.realPostOrDeliveryTestAuthorizedByThisApproval,
    false,
  );
  assert.equal(
    installation.publicSiteActivationAuthorizedByThisApproval,
    false,
  );
  assert.equal(installation.privateDataRestoreAuthorizedByThisApproval, false);
  assert.equal(report.procedure.routes.cpanelApi.nextAuthorityNeeded, null);
  assert.equal(report.serverChangesApplied, true);
  assert.equal(
    report.privateBackendInstallationProgress.appliedBy,
    'owner-authorized-browser-agent-not-this-workspace',
  );
  assert.equal(report.realTestMessagesSent, true);
  assert.equal(
    report.ownerAuthorization.syntheticDeliveryTests
      .maximumSingleLanguageSubmissions,
    5,
  );
  assert.equal(
    report.ownerAuthorization.syntheticDeliveryTests
      .testSenderPersonalContactValuesStoredInRepository,
    false,
  );
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

test('private staging and owner backup confirmation do not authorize live overwrites or prove restoration', () => {
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
  assert.match(
    progress.backupVerification.verificationBasis,
    /owner-confirmation/,
  );
  assert.equal(
    progress.backupVerification
      .localArchiveSizeAndIntegrityIndependentlyVerified,
    false,
  );
  assert.equal(
    progress.backupVerification.additionalBackupAsReportedByOwner,
    true,
  );
  assert.equal(progress.backupVerification.restoreTestPerformed, false);
  assert.equal(
    progress.backupVerification.completedFullOffServerCopyVerified,
    true,
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
    /awaiting-owner-IT-DE-EN-SL-CRM-and-readable-PDF-confirmations/,
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
  assert.equal(audit.reviewedRedactedCurrentDeliverySourceAvailable, true);
  assert.equal(audit.localDeliveryTransportPatchPrepared, true);
  assert.equal(audit.localMockedDeliveryTestsPassed, true);
  assert.equal(audit.realCrmBusinessResponseContractVerified, false);
  assert.equal(audit.crm2xxIsTransportAcceptanceNotLeadCreationProof, true);
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

test('private backend candidate is not a replacement handler or evidence of live delivery', () => {
  const candidate = report.preparedPrivateBackendCandidate;
  assert.equal(candidate.totalFilesIncludingManifest, 5);
  assert.equal(candidate.allExtractedHashesVerifiedLocally, true);
  assert.equal(candidate.allLocalExtractedFilesMode, '0644');
  assert.equal(candidate.fullHandlerIncluded, false);
  assert.equal(candidate.configurationIncluded, false);
  assert.equal(candidate.privateDataIncluded, false);
  assert.equal(candidate.serverUploadedAsReported, true);
  assert.equal(candidate.serverExtractedAsReported, true);
  assert.equal(
    candidate.serverStage,
    '/home2/dentvita/releases/20261001-private-backend-delivery-v1/',
  );
  assert.equal(candidate.serverExtractionErrorsReported, false);
  assert.equal(candidate.serverAllFivePayloadFilesPresentAsReported, true);
  assert.equal(candidate.serverExtractedFileModeAsReported, '0644');
  assert.equal(candidate.serverStageDirectoryModeAsReported, '0755');
  assert.equal(candidate.serverAllHashesIndependentlyVerified, false);
  assert.equal(candidate.serverInstalled, true);
  assert.equal(candidate.legacySendPatchApplied, true);
  assert.equal(candidate.realDeliveryTestPerformed, true);
  assert.equal(candidate.crmBusinessResponseContractVerified, false);
  assert.equal(candidate.manualReviewedDiffRequired, true);
});

test('installed backend and independent GET acceptance do not imply browser, POST or CRM acceptance', () => {
  const installed = report.privateBackendInstallationProgress;
  assert.equal(installed.helpersInstalledAsReported, true);
  assert.equal(installed.patchReadBackMatchesAsReported, true);
  assert.equal(installed.helperAndHandlerModeAsReported, '0644');
  assert.equal(installed.rollbackDirectoryModeAsReported, '0700');
  assert.equal(installed.rollbackHandlerModeAsReported, '0600');
  assert.equal(installed.agentTokenGetOutcome, 'ERR_BLOCKED_BY_CLIENT');
  assert.equal(installed.browserBlockCauseEstablished, false);
  assert.equal(installed.ordinaryBrowserFlowVerified, false);
  const get = report.productionGetTokenAcceptance;
  assert.equal(get.method, 'GET-only');
  assert.equal(get.formTokensStatus, 200);
  assert.equal(get.gctStatus, 200);
  assert.equal(get.csrfAndGctNonEmpty, true);
  assert.equal(get.gctMatchesJsonInSameSession, true);
  assert.equal(get.repeatedCsrfAndGctUnchanged, true);
  assert.equal(get.sessionCookieObservedAndUnchanged, true);
  assert.equal(get.formTokensCacheControl, 'private, no-store, max-age=0');
  assert.equal(get.corsAllowOriginPresent, false);
  assert.equal(get.tokenOrCookieValuesRecorded, false);
  assert.equal(get.effectivePhpVersionAndExtensionsVerified, false);
  assert.equal(get.realPostOrDeliveryTestRun, false);
  assert.equal(get.ordinaryBrowserFlowVerified, false);
  assert.equal(get.sessionCookieAttributes.secure, true);
  assert.equal(get.sessionCookieAttributes.httpOnly, false);
  assert.equal(get.sessionCookieAttributes.sameSite, null);
  const ownerGet = report.ownerBrowserTokenGetAcceptance;
  assert.equal(ownerGet.csrfAndGctFieldsVisibleAndNonEmpty, true);
  assert.equal(ownerGet.clientBlockVisible, false);
  assert.equal(ownerGet.httpStatusAndHeadersVerifiedFromScreenshot, false);
  assert.equal(ownerGet.tokenValuesOrScreenshotCopiedIntoRepository, false);
  assert.equal(ownerGet.postOrDeliveryTestPerformed, false);
  assert.equal(ownerGet.endToEndNewFrontendSubmissionVerified, false);
  assert.equal(installed.publicSiteActivated, false);
  assert.equal(report.realTestMessagesSent, true);
});

test('owner-accepted HR delivery and readable PDFs do not prove file hashes or all five languages', () => {
  const progress = report.syntheticDeliveryTestProgress;
  const first = progress.firstTest;
  assert.equal(progress.maximumApprovedSubmissions, 5);
  assert.equal(progress.submissionsAttempted, 5);
  assert.equal(progress.automaticRetriesPerformed, 0);
  assert.deepEqual(progress.pendingLanguages, []);
  assert.deepEqual(progress.pendingReceiptLanguages, ['it', 'de', 'en', 'sl']);
  assert.equal(
    progress.pendingLanguagesHeldUntilFirstInboxAndCrmReceiptConfirmed,
    false,
  );
  assert.equal(
    progress.pendingLanguagesHeldUntilFirstCrmAttachmentReadableConfirmed,
    false,
  );
  assert.equal(first.language, 'hr');
  assert.equal(first.httpStatus, 200);
  assert.equal(first.responseStatus, 'ok');
  assert.equal(first.attachment.type, 'application/pdf');
  assert.equal(first.attachment.containsPatientData, false);
  assert.equal(first.personalContactOrTokenValuesRecorded, false);
  assert.equal(first.inboxReceiptConfirmed, true);
  assert.equal(first.mailReceiptEvidence.testMarkerMatches, true);
  assert.equal(
    first.mailReceiptEvidence.attachmentOpenedAndNeutralTestTextVisible,
    true,
  );
  assert.equal(
    first.mailReceiptEvidence.downloadedAttachmentHashVerified,
    false,
  );
  assert.equal(
    first.mailReceiptEvidence.independentRecipientMailboxAccessPerformed,
    false,
  );
  assert.equal(
    first.mailReceiptEvidence
      .screenshotPersonalContactOrMailboxValuesCopiedIntoRepository,
    false,
  );
  assert.equal(first.crmLeadConfirmed, true);
  assert.equal(first.crmReceiptEvidence.testMarkerMatches, true);
  assert.equal(first.crmReceiptEvidence.languageIsCroatian, true);
  assert.equal(first.crmReceiptEvidence.sourceIsWeb, true);
  assert.equal(first.crmReceiptEvidence.attachmentLinkVisible, true);
  assert.equal(first.crmReceiptEvidence.pdfOpenedAndReadableConfirmed, true);
  assert.equal(first.crmReceiptEvidence.pdfOpenedAndContentsConfirmed, false);
  assert.equal(
    first.crmReceiptEvidence.downloadedAttachmentHashVerified,
    false,
  );
  assert.equal(
    first.crmReceiptEvidence.screenshotOrPersonalContactCopiedIntoRepository,
    false,
  );
  assert.equal(first.crmAttachmentConfirmed, true);
  assert.equal(first.deliveryReceiptAndReadableAttachmentsAccepted, true);
  assert.equal(first.mailAttachmentConfirmed, true);
  assert.equal(first.newFrontendEndToEndTest, false);
  assert.equal(progress.publicSiteActivated, false);
  const cloudflare = report.procedure.cloudflarePreviewRetirement;
  assert.equal(cloudflare.projectDeletionConfirmed, false);
  assert.equal(cloudflare.deletionAttemptBlockedByTooManyDeployments, true);
  assert.equal(
    cloudflare.status,
    'paused-at-owner-request-do-not-retry-during-migration',
  );
});

test('owner-confirmed remaining emails exhaust approval without claiming CRM, PDFs or new frontend acceptance', () => {
  const progress = report.syntheticDeliveryTestProgress;
  const tests = progress.remainingLanguageTests;
  assert.equal(tests.length, 4);
  assert.deepEqual(
    tests.map((entry) => entry.language),
    ['it', 'de', 'en', 'sl'],
  );
  assert.equal(new Set(tests.map((entry) => entry.marker)).size, 4);
  assert.equal(
    progress.submissionsAttempted,
    report.ownerAuthorization.syntheticDeliveryTests
      .maximumSingleLanguageSubmissions,
  );
  assert.equal(progress.automaticRetriesPerformed, 0);
  for (const entry of tests) {
    assert.equal(entry.httpStatus, 200);
    assert.equal(entry.responseStatus, 'ok');
    assert.equal(
      entry.status,
      'owner-confirms-email-awaiting-CRM-and-readable-attachments',
    );
    assert.match(entry.sourcePageUrl, /^https:\/\/www\.dentvitalis\.com\//);
    assert.equal(entry.tokenPreflight.csrfAndGctNonempty, true);
    assert.equal(entry.tokenPreflight.sessionCookieEstablished, true);
    assert.equal(entry.tokenPreflight.tokenValuesRecorded, false);
    assert.equal(entry.personalContactOrTokenValuesRecorded, false);
    assert.equal(entry.existingMailRecipientsAndCrmNotChanged, true);
    assert.equal(entry.attachment.type, 'application/pdf');
    assert.equal(entry.attachment.bytes, 640);
    assert.equal(entry.attachment.containsPatientData, false);
    assert.match(entry.attachment.sha256, /^[a-f0-9]{64}$/);
    assert.equal(entry.inboxReceiptConfirmed, true);
    assert.equal(entry.mailReceiptEvidence.reportedOn, '2026-10-04');
    assert.equal(
      entry.mailReceiptEvidence.independentRecipientMailboxAccessPerformed,
      false,
    );
    assert.equal(
      entry.mailReceiptEvidence.attachmentOpenedAndReadableConfirmed,
      false,
    );
    assert.equal(
      entry.mailReceiptEvidence.personalContactOrMailboxValuesRecorded,
      false,
    );
    assert.equal(entry.crmLeadConfirmed, false);
    assert.equal(entry.mailAttachmentConfirmed, false);
    assert.equal(entry.crmAttachmentConfirmed, false);
    assert.equal(entry.newFrontendEndToEndTest, false);
  }
  assert.equal(
    tests.find((entry) => entry.language === 'sl').sourcePageUrl,
    'https://www.dentvitalis.com/si',
  );
  assert.equal(progress.publicSiteActivated, false);
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
