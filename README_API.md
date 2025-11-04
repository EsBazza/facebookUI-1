API configuration reference

This project calls a remote API for posts. Below are the recommended ways to configure and use the API URL in this project and how to avoid common issues (CORS) when running locally or in production.

1) Quick example (reference only)

- Client-side constant usage (example reference):
  const API_BASE_URL = 'https://facebookapi-2txh.onrender.com';
  // fetch(`${API_BASE_URL}/api/posts`) -> list, create, update, delete

- Vite env usage (preferred for builds):
  // set VITE_API_BASE when building or running dev to override defaults
  // .env
  VITE_API_BASE=https://facebookapi-2txh.onrender.com/api/posts

  // in client code (posts.js)
  const base = import.meta.env.VITE_API_BASE || (import.meta.env.DEV ? '/api/posts' : 'https://facebookapi-2txh.onrender.com/api/posts');

  // or use the exported setter at runtime:
  import { setBaseUrl } from './src/api/posts';
  setBaseUrl('https://facebookapi-2txh.onrender.com/api/posts');

2) Dev server proxy (avoids CORS during development)

- vite.config.js proxy example (already present in this repo):
  server: {
    proxy: {
      '/api': {
        target: 'https://facebookapi-2txh.onrender.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path
      }
    }
  }

- When the dev server proxies `/api`, the browser will call `http://localhost:5173/api/posts` and Vite forwards the request to the remote API. This avoids CORS for development.

3) Production / CORS

- Browsers enforce CORS for cross-origin requests. If your frontend is hosted at https://facebook-ui-wnda.onrender.com and the API at https://facebookapi-2txh.onrender.com, the API server must allow requests from your frontend origin.

- Required response headers (especially for preflight OPTIONS):
  Access-Control-Allow-Origin: https://facebook-ui-wnda.onrender.com
  Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
  Access-Control-Allow-Headers: Content-Type, Authorization
  Access-Control-Allow-Credentials: true  // if using cookies

- Express example (server-side):
  const cors = require('cors');
  app.use(cors({ origin: 'https://facebook-ui-wnda.onrender.com', methods: ['GET','POST','PUT','DELETE','OPTIONS'] }));

4) Troubleshooting

- If `Invoke-RestMethod` or curl returns data but the browser shows `Access to fetch at ... has been blocked by CORS policy`, it's a server CORS issue.
- Check the API logs on Render after attempting a request. If no request appears, the browser blocked it via CORS preflight.
- If requests arrive but DB isn't updated, check server error logs for DB connection errors (credentials, environment variables, connection string).

5) What to change in this repo

- Use `import.meta.env.VITE_API_BASE` when you build/deploy, or set the runtime base via `setBaseUrl` (the project already exports `setBaseUrl` from `src/api/posts.js`).
- For quick testing, update `src/App.jsx` to use the full URL as a constant (example in your message), but remember this will still require the API to allow cross-origin requests in production.

If you'd like, I can:
- Add this reference to the README.md or keep it as `README_API.md` (done).
- Implement a small same-origin proxy and deployment instructions for Render.
- Provide the exact CORS patch for your API stack (Express/Flask/etc.) if you tell me which stack the API uses.

Which next step do you want me to take?