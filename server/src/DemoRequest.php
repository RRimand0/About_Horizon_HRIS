<?php
declare(strict_types=1);

namespace Horizon\Demo;

use DateTimeImmutable;
use DateTimeZone;

final class DemoRequest
{
    public const TOPICS = [
        'Scheduling', 'Attendance & worktime', 'Brands & branches',
        'Mobile kiosk', 'Payroll & payslips', 'SMS workflows',
    ];

    /** @return array{data: array<string,mixed>, errors: array<string,string>} */
    public static function validate(array $input, ?DateTimeImmutable $now = null): array
    {
        $errors = [];
        $fields = [
            'fullName' => [2, 100], 'company' => [2, 130],
            'email' => [3, 190], 'phone' => [0, 35],
            'notes' => [0, 1200], 'onsiteAddress' => [0, 300],
        ];
        $data = [];
        foreach ($fields as $name => [$min, $max]) {
            $value = $input[$name] ?? '';
            if (!is_string($value)) {
                $errors[$name] = 'Please enter a valid value.';
                $value = '';
            }
            $value = trim($value);
            if (strlen($value) < $min || strlen($value) > $max) {
                $errors[$name] = $min ? 'Please enter a valid value.' : 'This entry is too long.';
            }
            if ($name !== 'notes' && preg_match('/[\x00-\x1F\x7F]/', $value)) {
                $errors[$name] = 'Control characters are not allowed.';
            }
            if ($name === 'notes' && preg_match('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/', $value)) {
                $errors[$name] = 'Control characters are not allowed.';
            }
            $data[$name] = $value;
        }
        if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            $errors['email'] = 'Please enter a valid email address.';
        }
        if ($data['phone'] !== '' && !preg_match('/^\+?[0-9][0-9\s().-]{5,34}$/', $data['phone'])) {
            $errors['phone'] = 'Please enter a valid phone number.';
        }

        $topics = $input['topics'] ?? null;
        if (!is_array($topics) || count($topics) === 0 || count($topics) > count(self::TOPICS)) {
            $errors['topics'] = 'Select at least one topic.';
            $topics = [];
        }
        foreach ($topics as $topic) {
            if (!is_string($topic) || !in_array($topic, self::TOPICS, true)) {
                $errors['topics'] = 'One or more topics are invalid.';
            }
        }
        $data['topics'] = array_values(array_unique(array_filter($topics, 'is_string')));

        $zone = new DateTimeZone('Asia/Manila');
        $now = ($now ?? new DateTimeImmutable('now'))->setTimezone($zone);
        $preferredAt = $input['preferredAt'] ?? '';
        $date = is_string($preferredAt) && preg_match('/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/D', $preferredAt)
            ? DateTimeImmutable::createFromFormat('!Y-m-d\TH:i', $preferredAt, $zone)
            : false;
        if (!$date || $date->format('Y-m-d\TH:i') !== $preferredAt
            || $date->getTimestamp() < $now->getTimestamp() + 86400
            || $date->getTimestamp() > $now->getTimestamp() + 90 * 86400) {
            $errors['preferredAt'] = 'Choose a valid Philippine date and time, 24 hours to 90 days from now.';
        }
        $data['preferredAt'] = $date ? $date->format('F j, Y \a\t g:i A') . ' PHT' : '';

        $mode = $input['meetingMode'] ?? null;
        if (!in_array($mode, ['online', 'onsite'], true)) {
            $errors['meetingMode'] = 'Choose online or onsite.';
            $mode = 'online';
        }
        $data['meetingMode'] = $mode;
        if ($mode === 'onsite' && strlen($data['onsiteAddress']) < 10) {
            $errors['onsiteAddress'] = 'Enter the complete onsite meeting address.';
        }
        if ($input['consent'] !== true) {
            $errors['consent'] = 'Please agree to be contacted about your request.';
        }

        return ['data' => $data, 'errors' => $errors];
    }

    public static function distanceKm(float $lat1, float $lng1, float $lat2, float $lng2): float
    {
        $toRadians = static fn(float $v): float => deg2rad($v);
        $dLat = $toRadians($lat2 - $lat1);
        $dLng = $toRadians($lng2 - $lng1);
        $a = sin($dLat / 2) ** 2 + cos($toRadians($lat1)) * cos($toRadians($lat2)) * sin($dLng / 2) ** 2;
        return 6371.0088 * 2 * asin(min(1.0, sqrt($a)));
    }
}
