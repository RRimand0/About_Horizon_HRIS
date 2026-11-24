<?php
declare(strict_types=1);

use Horizon\Demo\DemoRequest;
use Horizon\Demo\Mailer;
use Horizon\Demo\RateLimiter;
use Horizon\Demo\ServiceArea;

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');
header('Referrer-Policy: no-referrer');

function respond(int $status, string $message, array $errors = []): never
{
    http_response_code($status);
    echo json_encode(['ok' => $status >= 200 && $status < 300, 'message' => $message, 'errors' => $errors], JSON_UNESCAPED_UNICODE);
    exit;
}

$allowedOrigin = rtrim(trim((string) getenv('SITE_ORIGIN')), '/');
$origin = (string) ($_SERVER['HTTP_ORIGIN'] ?? '');
if ($allowedOrigin === '' || !preg_match('#^https?://[^/]+$#', $allowedOrigin)) {
    respond(503, 'Demo booking is not configured yet.');
}
if ($origin !== '' && $origin !== $allowedOrigin) {
    respond(403, 'Origin not allowed.');
}
if ($origin === $allowedOrigin) {
    header('Access-Control-Allow-Origin: ' . $allowedOrigin);
    header('Vary: Origin');
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
}
if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') respond(204, '');
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') respond(405, 'Method not allowed.');
if (stripos((string) ($_SERVER['CONTENT_TYPE'] ?? ''), 'application/json') !== 0) respond(415, 'Send JSON data.');
if ((int) ($_SERVER['CONTENT_LENGTH'] ?? 0) > 16384) respond(413, 'Request too large.');

require_once dirname(__DIR__) . '/src/DemoRequest.php';
require_once dirname(__DIR__) . '/src/RateLimiter.php';
require_once dirname(__DIR__) . '/src/ServiceArea.php';
require_once dirname(__DIR__) . '/src/Mailer.php';

try {
    $body = file_get_contents('php://input', false, null, 0, 16385);
    if (!is_string($body) || strlen($body) > 16384) respond(413, 'Request too large.');
    $payload = json_decode($body, true, 16, JSON_THROW_ON_ERROR);
    if (!is_array($payload) || array_is_list($payload)) respond(400, 'Invalid request.');
    // Accept spam quietly, without email delivery.
    if (!empty($payload['website'])) respond(200, 'Request received.');

    RateLimiter::check((string) ($_SERVER['REMOTE_ADDR'] ?? 'unknown'));
    $validated = DemoRequest::validate($payload);
    if ($validated['errors'] !== []) {
        respond(422, 'Please review the highlighted form fields.', $validated['errors']);
    }
    $data = $validated['data'];
    $distance = $data['meetingMode'] === 'onsite' ? ServiceArea::verify($data['onsiteAddress']) : null;
    $autoload = dirname(__DIR__) . '/vendor/autoload.php';
    if (!is_file($autoload)) respond(503, 'Demo booking email service is not ready yet.');
    require_once $autoload;
    Mailer::send($data, $distance);
    respond(200, 'Your demo request was sent. We will reply to confirm a schedule.');
} catch (JsonException $error) {
    respond(400, 'Invalid JSON request.');
} catch (RuntimeException $error) {
    $code = (int) $error->getCode();
    if (!in_array($code, [422, 429, 503], true)) $code = 503;
    if ($code === 429) header('Retry-After: 600');
    respond($code, $error->getMessage());
} catch (Throwable $error) {
    error_log('Horizon demo request: internal delivery error (' . get_class($error) . ')');
    respond(503, 'Unable to deliver the request right now. Please try again later.');
}
