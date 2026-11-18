const fs = require('node:fs');
const assert = require('node:assert/strict');
const headers = fs.readFileSync('_headers', 'utf8');
for (const rule of ["frame-ancestors 'none'", "object-src 'none'", "base-uri 'self'", "form-action 'self'", 'X-Frame-Options: DENY', 'X-Content-Type-Options: nosniff']) assert.ok(headers.includes(rule), rule);
assert.ok(headers.includes('/sw.js\n  Cache-Control: no-cache'));
console.log('security headers: framing, base URL, objects, forms and worker updates protected');
