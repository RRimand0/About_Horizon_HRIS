<?php
declare(strict_types=1);

namespace Horizon\Demo;

use RuntimeException;

final class ServiceArea
{
    /**
     * Geocode the visitor-supplied address on the server and enforce a 200 km straight-line radius.
     * No browser-supplied coordinates or distances are trusted.
     *
     * @return float Distance in kilometers.
     */
    public static function verify(string $address): float
    {
        $latitude = getenv('ONSITE_BASE_LAT');
        $longitude = getenv('ONSITE_BASE_LNG');
        $apiKey = getenv('GOOGLE_GEOCODING_API_KEY');
        if (getenv('ONSITE_ENABLED') !== 'true' || !is_string($latitude) || !is_string($longitude)
            || !is_numeric($latitude) || !is_numeric($longitude)
            || (float) $latitude < -90 || (float) $latitude > 90
            || (float) $longitude < -180 || (float) $longitude > 180
            || !is_string($apiKey) || trim($apiKey) === '') {
            throw new RuntimeException('Onsite demo requests are not available yet.', 503);
        }
        if (!function_exists('curl_init')) {
            throw new RuntimeException('Onsite verification is temporarily unavailable.', 503);
        }
        $url = 'https://maps.googleapis.com/maps/api/geocode/json?' . http_build_query([
            'address' => $address,
            'components' => 'country:PH',
            'key' => $apiKey,
        ], '', '&', PHP_QUERY_RFC3986);
        $handle = curl_init($url);
        if ($handle === false) {
            throw new RuntimeException('Onsite verification is temporarily unavailable.', 503);
        }
        curl_setopt_array($handle, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_CONNECTTIMEOUT => 4,
            CURLOPT_TIMEOUT => 9,
            CURLOPT_FOLLOWLOCATION => false,
            CURLOPT_SSL_VERIFYPEER => true,
            CURLOPT_SSL_VERIFYHOST => 2,
            CURLOPT_HTTPHEADER => ['Accept: application/json'],
        ]);
        $body = curl_exec($handle);
        $httpStatus = curl_getinfo($handle, CURLINFO_HTTP_CODE);
        curl_close($handle);
        if (!is_string($body) || $httpStatus !== 200) {
            throw new RuntimeException('We could not verify this meeting address. Please choose Online or try again.', 503);
        }
        $result = json_decode($body, true);
        if (!is_array($result) || ($result['status'] ?? null) !== 'OK'
            || !is_array($result['results'] ?? null) || count($result['results']) === 0) {
            throw new RuntimeException('Please enter a recognizable complete onsite address, or choose Online.', 422);
        }
        $location = $result['results'][0]['geometry']['location'] ?? null;
        $precision = $result['results'][0]['geometry']['location_type'] ?? null;
        $partial = $result['results'][0]['partial_match'] ?? false;
        if (!is_array($location) || !is_numeric($location['lat'] ?? null)
            || !is_numeric($location['lng'] ?? null) || $partial === true
            || !in_array($precision, ['ROOFTOP', 'RANGE_INTERPOLATED', 'GEOMETRIC_CENTER'], true)) {
            throw new RuntimeException('Please provide a more specific meeting address, or choose Online.', 422);
        }
        $distance = DemoRequest::distanceKm((float) $latitude, (float) $longitude, (float) $location['lat'], (float) $location['lng']);
        if ($distance > 200.0) {
            throw new RuntimeException('This location is beyond our 200 km onsite service radius. Please choose an online demo.', 422);
        }
        return $distance;
    }
}
