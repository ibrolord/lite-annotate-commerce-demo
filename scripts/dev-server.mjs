import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(fileURLToPath(new URL('..', import.meta.url)));
const port = Number.parseInt(process.env.PORT || '4174', 10);

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml; charset=utf-8'
};

const server = createServer(async (req, res) => {
  const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);

  if (url.pathname === '/api/customers/vip-404') {
    await delay(90);
    sendJson(res, 404, {
      error: 'customer_not_found',
      id: 'vip-404',
      message: 'No loyalty profile exists for this customer.'
    });
    return;
  }

  if (url.pathname === '/api/checkout/quote') {
    await delay(65);
    sendJson(res, 200, {
      subtotal: 214,
      shipping: 0,
      tax: 17.12,
      total: 231.12
    });
    return;
  }

  const filePath = resolveStaticPath(url.pathname);
  try {
    const file = await readFile(filePath);
    res.writeHead(200, {
      'Content-Type': mimeTypes[extname(filePath)] || 'application/octet-stream',
      'Cache-Control': 'no-store'
    });
    res.end(file);
  } catch {
    if (extname(url.pathname)) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' });
      res.end('Missing demo asset');
      return;
    }

    try {
      const html = await readFile(join(root, 'index.html'));
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
      res.end(html);
    } catch {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not found');
    }
  }
});

server.listen(port, () => {
  console.log(`Cedar & Sail demo running at http://localhost:${port}`);
});

function resolveStaticPath(pathname) {
  const decoded = decodeURIComponent(pathname);
  const candidate = decoded === '/' ? '/index.html' : decoded;
  const normalized = normalize(candidate).replace(/^(\.\.[/\\])+/, '');
  return join(root, normalized);
}

function sendJson(res, status, body) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store'
  });
  res.end(`${JSON.stringify(body)}\n`);
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
