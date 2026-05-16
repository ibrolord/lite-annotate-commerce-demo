export default function handler(_req, res) {
  res.status(404).json({
    error: 'customer_not_found',
    id: 'vip-404',
    message: 'No loyalty profile exists for this customer.'
  });
}

