<?php
// Private include for the existing /send handler. Never place in public_html.
// Add require __DIR__ . '/form-request-guard.php'; before the handler processes
// input, but only after a verified backup and review of the actual server file.
function dentvitalis_form_request_error(array $post, array $files)
{
    foreach (['name', 'email', 'phone', 'message', 'url', 'lang', 'csrf', 'gct',
              'form_agreement', 'action', 'pos'] as $field) {
        if (isset($post[$field]) && !is_string($post[$field])) {
            return 'invalid_request';
        }
    }
    if (!filter_var($post['email'] ?? '', FILTER_VALIDATE_EMAIL)) {
        return 'invalid_email';
    }
    if (!in_array($post['lang'] ?? '', ['it', 'hr', 'de', 'en', 'sl'], true)) {
        return 'invalid_language';
    }
    $url = parse_url($post['url'] ?? '');
    if ($url === false || ($url['scheme'] ?? '') !== 'https' ||
        !in_array($url['host'] ?? '', ['www.dentvitalis.com', 'dentvitalis.com'], true) ||
        isset($url['user']) || isset($url['pass']) || isset($url['port'])) {
        return 'invalid_source';
    }
    $file = $files['file'] ?? null;
    if ($file === null || (is_array($file) && ($file['error'] ?? null) === UPLOAD_ERR_NO_FILE)) {
        return null;
    }
    if (!is_array($file)) {
        return 'invalid_file';
    }
    foreach (['name', 'tmp_name', 'error', 'size'] as $field) {
        if (!isset($file[$field]) || is_array($file[$field])) {
            return 'invalid_file';
        }
    }
    if ($file['error'] === UPLOAD_ERR_INI_SIZE || $file['error'] === UPLOAD_ERR_FORM_SIZE ||
        $file['size'] > 8388608) {
        return 'file_too_large';
    }
    if ($file['error'] !== UPLOAD_ERR_OK || !is_uploaded_file($file['tmp_name'])) {
        return 'invalid_file';
    }
    $size = filesize($file['tmp_name']);
    if ($size === false || $size <= 0 || $size > 8388608) {
        return $size > 8388608 ? 'file_too_large' : 'invalid_file';
    }
    if (!class_exists('finfo')) {
        return 'upload_validation_unavailable';
    }
    $types = ['pdf' => 'application/pdf', 'jpg' => 'image/jpeg',
              'jpeg' => 'image/jpeg', 'png' => 'image/png'];
    $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    if (!isset($types[$extension]) ||
        (new finfo(FILEINFO_MIME_TYPE))->file($file['tmp_name']) !== $types[$extension]) {
        return 'invalid_file';
    }
    return null;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    $error = 'invalid_request';
} else {
    $error = dentvitalis_form_request_error($_POST, $_FILES);
}
if ($error !== null) {
    $this->setTerminal(true);
    http_response_code(400);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: private, no-store, max-age=0');
    echo json_encode(['status' => 'error', 'code' => $error]);
    exit;
}
