<?php
declare(strict_types=1);

namespace Horizon\Demo;

use PHPMailer\PHPMailer\PHPMailer;
use RuntimeException;

final class Mailer
{
    public static function send(array $data, ?float $distanceKm = null): void
    {
        $host = trim((string) getenv('SMTP_HOST'));
        $user = trim((string) getenv('SMTP_USERNAME'));
        $password = (string) getenv('SMTP_PASSWORD');
        $from = trim((string) getenv('SMTP_FROM'));
        $recipient = trim((string) getenv('DEMO_RECIPIENT_EMAIL'));
        $port = (int) (getenv('SMTP_PORT') ?: 587);
        if ($host === '' || $user === '' || $password === '' || !filter_var($from, FILTER_VALIDATE_EMAIL)
            || !filter_var($recipient, FILTER_VALIDATE_EMAIL) || !in_array($port, [465, 587], true)) {
            throw new RuntimeException('Demo booking email service is not configured.', 503);
        }
        $mailer = new PHPMailer(true);
        $mailer->isSMTP();
        $mailer->Host = $host;
        $mailer->SMTPAuth = true;
        $mailer->Username = $user;
        $mailer->Password = $password;
        $mailer->Port = $port;
        $mailer->SMTPSecure = $port === 465 ? PHPMailer::ENCRYPTION_SMTPS : PHPMailer::ENCRYPTION_STARTTLS;
        $mailer->Timeout = 15;
        $mailer->CharSet = PHPMailer::CHARSET_UTF8;
        $mailer->setFrom($from, 'Horizon HRIS Website');
        $mailer->addAddress($recipient);
        $mailer->addReplyTo($data['email'], $data['fullName']);
        $mailer->Subject = 'New Horizon HRIS demo request — ' . $data['company'];
        $values = [
            'Name' => $data['fullName'],
            'Company' => $data['company'],
            'Email' => $data['email'],
            'Phone' => $data['phone'] ?: 'Not provided',
            'Topics' => implode(', ', $data['topics']),
            'Preferred schedule (PHT)' => $data['preferredAt'],
            'Meeting mode' => $data['meetingMode'] === 'onsite' ? 'Onsite' : 'Online',
            'Onsite address' => $data['meetingMode'] === 'onsite' ? $data['onsiteAddress'] : 'Not applicable',
            'Onsite distance' => $distanceKm === null ? 'Not applicable' : round($distanceKm, 1) . ' km straight-line',
            'Other details' => $data['notes'] ?: 'Not provided',
        ];
        $mailer->isHTML(true);
        $mailer->Body = '<h2>Horizon HRIS — Demo request</h2><p><strong>Meeting not yet confirmed.</strong> Reply to the visitor to arrange a schedule.</p><table cellpadding="8" cellspacing="0" border="1" style="border-collapse:collapse">';
        foreach ($values as $label => $value) {
            $safeLabel = htmlspecialchars($label, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
            $safeValue = nl2br(htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'));
            $mailer->Body .= '<tr><th align="left">' . $safeLabel . '</th><td>' . $safeValue . '</td></tr>';
        }
        $mailer->Body .= '</table>';
        $lines = ['HORIZON HRIS — NEW DEMO REQUEST', 'Meeting is not confirmed. Reply to arrange a schedule.', ''];
        foreach ($values as $label => $value) $lines[] = $label . ': ' . $value;
        $mailer->AltBody = implode("\n", $lines);
        $mailer->send();
    }
}
