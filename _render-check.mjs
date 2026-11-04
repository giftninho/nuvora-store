import { createServer } from 'vite';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import assert from 'node:assert/strict';

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' });
try {
  const { default: App } = await server.ssrLoadModule('/src/App.jsx');
  const { CartProvider } = await server.ssrLoadModule('/src/context/CartContext.jsx');
  const { AuthProvider } = await server.ssrLoadModule('/src/context/AuthContext.jsx');
  const routes = [
    ['/', 'Explore Our Collection'],
    ['/products/1'],
    ['/products/999'],
    ['/cart', 'Shopping Cart'],
    ['/checkout', 'Checkout'],
    ['/login', 'Welcome to Nuvora Store'],
    ['/signup', 'Create your account'],
    ['/forgot-password', 'Reset your password'],
    ['/reset-password', 'Checking your reset link'],
    ['/order-success', 'No Order Found'],
    ['/nope', '404'],
  ];
  for (const [url, expectedHeading] of routes) {
    const html = renderToString(
      React.createElement(MemoryRouter, { initialEntries: [url] },
        React.createElement(AuthProvider, null,
          React.createElement(CartProvider, null, React.createElement(App))))
    );
    const h1 = (html.match(/<h1[^>]*>(.*?)<\/h1>/) || [])[1];
    if (expectedHeading) assert.equal(h1, expectedHeading, `Unexpected page heading at ${url}`);
    assert.ok(html.length > 0, `Route did not render: ${url}`);
    console.log('OK', url, expectedHeading ? `| h1: ${h1}` : '| rendered');
  }
} catch (e) {
  console.error('FAIL', e);
  process.exitCode = 1;
} finally {
  await server.close();
}
