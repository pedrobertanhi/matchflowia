import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { analyzeImage, RequestError } from './server/gemini.mjs';

dotenv.config({ quiet: true });
dotenv.config({ path: '.env.local', override: true, quiet: true });

const rootDirectory = path.dirname(fileURLToPath(import.meta.url));
const productionDirectory = path.join(rootDirectory, 'dist');
const isProduction = process.env.NODE_ENV === 'production';
const port = Number(process.env.PORT) || 3000;
const requestLimit = 8 * 1024 * 1024;
const rateLimit = Math.max(1, Number(process.env.API_RATE_LIMIT) || 10);
const rateWindow = 15 * 60 * 1000;
const trustProxy = process.env.TRUST_PROXY === 'true';
const clients = new Map();

const vite = isProduction
  ? null
  : await (await import('vite')).createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });

const sendJson = (response, statusCode, payload, extraHeaders = {}) => {
  response.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    ...extraHeaders,
  });
  response.end(JSON.stringify(payload));
};

const readJson = (request) => new Promise((resolve, reject) => {
  let body = '';
  let exceededLimit = false;

  request.setEncoding('utf8');
  request.on('data', (chunk) => {
    if (exceededLimit) return;

    body += chunk;
    if (Buffer.byteLength(body) > requestLimit) {
      exceededLimit = true;
      body = '';
      reject(new RequestError(413, 'A requisição excede o limite permitido.'));
    }
  });
  request.on('end', () => {
    if (exceededLimit) return;

    try {
      resolve(JSON.parse(body));
    } catch {
      reject(new RequestError(400, 'JSON inválido.'));
    }
  });
  request.on('error', reject);
});

const getClientAddress = (request) => {
  if (trustProxy) {
    const forwarded = request.headers['x-forwarded-for'];
    const address = Array.isArray(forwarded) ? forwarded[0] : forwarded?.split(',')[0];
    if (address) return address.trim();
  }

  return request.socket.remoteAddress || 'unknown';
};

const consumeRateLimit = (request) => {
  const now = Date.now();
  const address = getClientAddress(request);
  const current = clients.get(address);

  if (clients.size > 1000) {
    for (const [clientAddress, state] of clients) {
      if (now >= state.resetAt) clients.delete(clientAddress);
    }
  }

  if (!current || now >= current.resetAt) {
    const next = { count: 1, resetAt: now + rateWindow };
    clients.set(address, next);
    return rateLimit - 1;
  }

  if (current.count >= rateLimit) {
    throw new RequestError(429, 'Limite de análises temporariamente atingido. Tente novamente mais tarde.');
  }

  current.count += 1;
  return rateLimit - current.count;
};

const handleAnalysis = async (request, response) => {
  if (request.method !== 'POST') {
    sendJson(response, 405, { error: 'Método não permitido.' }, { Allow: 'POST' });
    return;
  }

  try {
    const remaining = consumeRateLimit(request);
    const payload = await readJson(request);
    const result = await analyzeImage(payload);
    sendJson(response, 200, result, { 'RateLimit-Remaining': String(remaining) });
  } catch (error) {
    const statusCode = error instanceof RequestError ? error.statusCode : 500;
    const message = error instanceof RequestError
      ? error.message
      : 'Não foi possível concluir a análise agora.';
    sendJson(response, statusCode, { error: message });
  }
};

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
};

const serveProductionFile = async (request, response) => {
  const requestedPath = decodeURIComponent(new URL(request.url ?? '/', 'http://localhost').pathname);
  const relativePath = requestedPath === '/' ? 'index.html' : requestedPath.replace(/^\/+/, '');
  let filePath = path.resolve(productionDirectory, relativePath);

  if (!filePath.startsWith(`${productionDirectory}${path.sep}`)) {
    sendJson(response, 400, { error: 'Caminho inválido.' });
    return;
  }

  try {
    const fileInformation = await stat(filePath);
    if (!fileInformation.isFile()) throw new Error('Not a file');
  } catch {
    if (path.extname(relativePath)) {
      sendJson(response, 404, { error: 'Arquivo não encontrado.' });
      return;
    }

    filePath = path.join(productionDirectory, 'index.html');
  }

  response.writeHead(200, {
    'Content-Type': contentTypes[path.extname(filePath)] ?? 'application/octet-stream',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
  });
  createReadStream(filePath).pipe(response);
};

const handleRequest = async (request, response) => {
  const pathname = new URL(request.url ?? '/', 'http://localhost').pathname;

  if (pathname === '/api/analyze') {
    await handleAnalysis(request, response);
    return;
  }

  if (vite) {
    vite.middlewares(request, response, () => {
      sendJson(response, 404, { error: 'Rota não encontrada.' });
    });
    return;
  }

  await serveProductionFile(request, response);
};

const server = createServer((request, response) => {
  handleRequest(request, response).catch(() => {
    if (!response.headersSent) {
      sendJson(response, 500, { error: 'Erro interno do servidor.' });
    } else {
      response.end();
    }
  });
});

server.listen(port, () => {
  process.stdout.write(`MatchFlow disponível em http://localhost:${port}\n`);
});

const shutdown = () => {
  server.close(() => process.exit(0));
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
