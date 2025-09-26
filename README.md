# AI Code Helper

## Environment

Create a `.env` file in project root with:

```
ANTHROPIC_API_KEY=your_key_here
CLAUDE_MODEL=claude-3-5-sonnet-latest
# Optional OpenRouter fallback
OPENROUTER_API_KEY=your_openrouter_key
OPENROUTER_MODEL=anthropic/claude-3.5-sonnet
```

If `ANTHROPIC_API_KEY` is missing or cannot be used, the server will try OpenRouter if `OPENROUTER_API_KEY` is set; otherwise it falls back to mock responses.

## Run

- Server: `npm run server`
- Client: `npm run dev`

## Rate Limiting

Server limits to ~30 requests/min per IP by default. Adjust in `server/index.js`.
