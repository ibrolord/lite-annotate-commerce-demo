import test from 'node:test';
import assert from 'node:assert/strict';
import { formatLoyaltyGreeting, getCustomerById } from '../src/customer.js';

test('formats a known customer loyalty greeting', () => {
  assert.equal(
    formatLoyaltyGreeting('jord-2025'),
    'Welcome back, Jordan Lee. Your Trail Club credit is $24.'
  );
});

test('missing customer returns a readable fallback', () => {
  assert.equal(getCustomerById('vip-404'), undefined);
  assert.equal(formatLoyaltyGreeting('vip-404'), 'Customer not found');
});
