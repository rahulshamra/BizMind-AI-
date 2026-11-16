# Pulse – Frontend

React + Vite + Tailwind CSS v4 dashboard. API calls use the built-in `fetch` (`src/services/api.js`).

```bash
npm install
npm run dev
```

## Fake data
`.env` has `VITE_USE_MOCK=true`, so `api.js` returns the data from `src/data/mockData.js`.
When your backend is ready, set `VITE_USE_MOCK=false` and `VITE_API_URL=<your url>`.

Expected endpoints: GET /stats, /revenue, /customers, /forecast, /sentiment, /demand and POST /chat ({ message } -> { reply }).
