# Cursor MCP (optional)

After `pnpm --filter @itrust/mcp-research build`, register a stdio server in Cursor pointing at:

- **Command**: `node`
- **Args**: `["/absolute/path/to/repo/apps/mcp-research/dist/index.js"]`
- **Env**: optionally set `ITRUST_DATA_DIR` to your uploads directory

Tools exposed: `search_academic`, `search_realworld`, `search_uploads`, `fetch_document`, `synthesize_evidence`, `list_citations`, `ingest_upload`.
