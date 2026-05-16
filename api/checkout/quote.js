export default function handler(_req, res) {
  res.status(200).json({
    subtotal: 214,
    shipping: 0,
    tax: 17.12,
    total: 231.12
  });
}

