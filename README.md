# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

---

## Live data with Twelve Data (optional)

This project can fetch real stock data from Twelve Data via a small server proxy (keeps your API key out of client-side bundles).

Steps to enable:

1. Copy `.env.example` to `.env` and set your key:

```bash
cp .env.example .env
# Edit .env and set TWELVE_API_KEY to your key
```

2. Install new server dependencies:

```bash
npm install
```

3. Start the proxy server (runs on port 3001 by default):

```bash
npm run server
```

4. Start the frontend dev server:

```bash
npm run dev
```

5. Open the app and pick a symbol from the search box — live data will be fetched via the proxy.

Caching: the proxy uses a small in-memory TTL cache to reduce requests to Twelve Data. Default TTLs:
- `quote`: 15 seconds
- `time_series`: 5 minutes
- `search`: 1 minute

Security note: Do not commit your `.env` file or your API key to source control. Use `.env.example` as a template.
