<?php
declare(strict_types=1);

namespace Horizon\Demo;

use RuntimeException;

final class RateLimiter
{
    public static function check(string $address): void
    {
        $folder = getenv('RATE_LIMIT_DIR') ?: sys_get_temp_dir() . '/horizon_demo_rate_limits';
        if (!is_dir($folder) && !mkdir($folder, 0700, true) && !is_dir($folder)) {
            throw new RuntimeException('Booking is temporarily unavailable.', 503);
        }
        $file = rtrim($folder, '/\\') . DIRECTORY_SEPARATOR . hash('sha256', $address) . '.json';
        $stream = @fopen($file, 'c+');
        if (!$stream) throw new RuntimeException('Booking is temporarily unavailable.', 503);
        try {
            if (!flock($stream, LOCK_EX)) throw new RuntimeException('Booking is temporarily unavailable.', 503);
            $raw = stream_get_contents($stream);
            $attempts = is_string($raw) ? json_decode($raw, true) : null;
            if (!is_array($attempts)) $attempts = [];
            $now = time();
            $attempts = array_values(array_filter($attempts, static fn($v): bool => is_int($v) && $v > $now - 3600));
            $recent = array_filter($attempts, static fn($v): bool => $v > $now - 600);
            if (count($attempts) >= 8 || count($recent) >= 3) {
                throw new RuntimeException('Too many requests. Please try again later.', 429);
            }
            $attempts[] = $now;
            rewind($stream);
            if (!ftruncate($stream, 0) || fwrite($stream, json_encode($attempts, JSON_THROW_ON_ERROR)) === false || !fflush($stream)) {
                throw new RuntimeException('Booking is temporarily unavailable.', 503);
            }
        } finally {
            flock($stream, LOCK_UN);
            fclose($stream);
        }
    }
}
