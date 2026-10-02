import { createServer } from 'vite';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' });
try {
  const { default: App } = await server.ssrLoadModule('/src/App.jsx');
  const { CartProvider } = await server.ssrLoadModule('/src/context/CartContext.jsx');
  const routes = ['/', '/products/1', '/products/999', '/cart', '/checkout', '/login', '/order-success', '/nope'];
  for (const url of routes) {
    const html = renderToString(
      React.createElement(MemoryRouter, { initialEntries: [url] },
        React.createElement(CartProvider, null, React.createElement(App)))
    );
    const h1 = (html.match(/<h1[^>]*>(.*?)<\/h1>/) || [])[1];
    console.log('OK', url, '| h1:', h1, '| length:', html.length);
  }
} catch (e) {
  console.error('FAIL', e);
  process.exitCode = 1;
} finally {
  await server.close();
}
