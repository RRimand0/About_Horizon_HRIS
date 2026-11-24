<?php
declare(strict_types=1);
require_once dirname(__DIR__) . '/src/DemoRequest.php';

use Horizon\Demo\DemoRequest;

$now = new DateTimeImmutable('2026-11-22T08:00:00+08:00');
$good = [
    'fullName' => 'Sample Visitor', 'company' => 'Example Retail Co',
    'email' => 'visitor@example.com', 'phone' => '',
    'topics' => ['Scheduling', 'Payroll & payslips'],
    'notes' => 'We want to learn about scheduling.',
    'preferredAt' => '2026-11-25T10:30',
    'meetingMode' => 'online', 'consent' => true,
];
$count = 0;
function expect(bool $condition, string $message): void {
    global $count;
    $count++;
    if (!$condition) { fwrite(STDERR, "FAIL: $message\n"); exit(1); }
}
$result = DemoRequest::validate($good, $now);
expect(count($result['errors']) === 0, 'valid online request');
expect(str_contains($result['data']['preferredAt'], 'PHT'), 'date labeled PHT');
expect(count($result['data']['topics']) === 2, 'topics preserved');
$bad = $good; $bad['email'] = 'not an email';
expect(isset(DemoRequest::validate($bad, $now)['errors']['email']), 'invalid email rejected');
$bad = $good; $bad['topics'] = ['Nonexistent'];
expect(isset(DemoRequest::validate($bad, $now)['errors']['topics']), 'unsupported topic rejected');
$bad = $good; $bad['preferredAt'] = '2026-11-22T09:00';
expect(isset(DemoRequest::validate($bad, $now)['errors']['preferredAt']), 'short notice rejected');
$bad = $good; $bad['preferredAt'] = '2027-06-01T09:00';
expect(isset(DemoRequest::validate($bad, $now)['errors']['preferredAt']), 'too far future rejected');
$bad = $good; $bad['preferredAt'] = '2026-02-31T09:00';
expect(isset(DemoRequest::validate($bad, $now)['errors']['preferredAt']), 'invalid date rejected');
$bad = $good; $bad['meetingMode'] = 'onsite';
expect(isset(DemoRequest::validate($bad, $now)['errors']['onsiteAddress']), 'onsite requires address');
$bad = $good; $bad['consent'] = false;
expect(isset(DemoRequest::validate($bad, $now)['errors']['consent']), 'consent required');
$bad = $good; $bad['notes'] = "Line one\nLine two";
expect(count(DemoRequest::validate($bad, $now)['errors']) === 0, 'multiline notes allowed');
$bad = $good; $bad['fullName'] = "Some\r\nInjected";
expect(isset(DemoRequest::validate($bad, $now)['errors']['fullName']), 'header injection characters rejected');
expect(DemoRequest::distanceKm(8.48, 124.65, 8.48, 124.65) < 0.01, 'same point within radius');
expect(DemoRequest::distanceKm(8.48, 124.65, 14.6, 121.0) > 200, 'distant point outside radius');
expect(DemoRequest::distanceKm(0, 0, 0, 1) > 110, 'haversine distance calculation');
fwrite(STDOUT, "PASS: $count booking validation and distance assertions\n");
