import { LATEST_API_VERSION } from '@shopify/shopify-api';
import { shopifyApp } from '@shopify/shopify-app-express';
import { restResources } from '@shopify/shopify-api/rest/admin/2023-07';
import { SessionStorage } from '../session/index.js';

const shopify = shopifyApp({
  api: {
    apiVersion: LATEST_API_VERSION,
    restResources,
  },
  auth: {
    path: '/api/auth',
    callbackPath: '/api/auth/callback',
  },
  webhooks: {
    path: '/api/webhooks',
  },
  sessionStorage: SessionStorage,
});

export default shopify;
