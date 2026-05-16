const customers = [
  {
    id: 'jord-2025',
    name: 'Jordan Lee',
    tier: 'Trail Club',
    credits: 24
  }
];

export function getCustomerById(customerId) {
  return customers.find((customer) => customer.id === customerId);
}

export function formatLoyaltyGreeting(customerId) {
  const customer = getCustomerById(customerId);
  return `Welcome back, ${customer.name}. Your ${customer.tier} credit is $${customer.credits}.`;
}

