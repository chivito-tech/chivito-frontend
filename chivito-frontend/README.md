## Chivito Frontend (Next.js)

## Local Development

### Prerequisites
- Node.js 18+ (or the version you normally use for Next.js)

### Setup
1) Install dependencies
```bash
npm install
```

2) Create `.env.local` with the backend URL
```bash
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8002/api
```

3) Start the dev server
```bash
npm run dev
```

Open `http://localhost:3000`.

### Notes
- Make sure the backend is running on port `8002` (or update the env value).
- If you change the backend port or host, update `.env.local`.

### Troubleshooting
- Blank data or fetch errors: confirm the backend is running and `NEXT_PUBLIC_API_BASE_URL` matches it.
- CORS errors: ensure your backend allows requests from `http://localhost:3000`.
- Port in use: stop the process using `3000` or run `npm run dev -- --port 3001`.
