import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { ONSITE_RADIUS_KM, SERVICE_CENTER, straightLineDistanceKm } from './onsiteDistance.js';

test('service center is inside the radius', () => {
  assert.equal(straightLineDistanceKm(SERVICE_CENTER, SERVICE_CENTER), 0);
  assert.equal(ONSITE_RADIUS_KM, 200);
});

test('farther regions fall outside 200 km straight