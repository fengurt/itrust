# Environment variables

| Variable | Purpose |
|----------|---------|
| `AGENT_API_URL` | Next rewrites target for `/api/agent/*` (default `http://127.0.0.1:3001`) |
| `PORT` | Agent API listen port (default `3001`) |
| `ITRUST_DATA_DIR` | Absolute path for uploads + `manifest.jsonl` (default `<cwd>/data/uploads`) |

Copy values into a local `.env` file for tooling that reads dotenv (not committed).
