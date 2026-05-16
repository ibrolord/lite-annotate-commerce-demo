import test from 'node:test';
import assert from 'node:assert/strict';
import { formatLoyaltyGreeting, getCustomerById } from '../src/customer.js';

test('formats a known customer loyalty greeting', () => {
  assert.equal(
    formatLoyaltyGreeting('jord-2025'),
    'Welcome back, Jordan Lee. Your Trail Club credit is $24.'
  );
});

test('planted bug: missing customer currently crashes', () => {
  assert.equal(getCustomerById('vip-404'), undefined);
  assert.throws(() => formatLoyaltyGreeting('vip-404'), /Cannot read/);
});

