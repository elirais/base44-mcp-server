# Base44 SDK MCP Server (Unofficial)

> ⚠️ **DISCLAIMER**: This is an **unofficial community project** and is **NOT officially maintained by Base44**. The documentation may become outdated or inaccurate. For official Base44 SDK documentation, please visit the official Base44 website.

An MCP (Model Context Protocol) server that exposes Base44 SDK documentation to AI agents and coding assistants. Zero configuration required — no API keys, no credentials.

## 📚 Documentation Website

**Full documentation available at: [https://doc-sdk.base44.app](https://doc-sdk.base44.app)**

Browse the complete Base44 SDK documentation with examples, guides, and API references.

## What it does

This MCP server allows AI agents (Claude Desktop, Cursor, etc.) to look up Base44 SDK documentation while helping developers write code. It provides:

- **3 Tools**: `lookup`, `search`, `list-topics`
- **10 Resources**: One per documentation topic + full reference
- **9 Documentation Topics**: entities, auth, integrations, connectors, functions, analytics, best-practices, project-structure, getting-started

## Installation

### Via Smithery (recommended)

Install directly from [Smithery.ai](https://smithery.ai):

```bash
npx @smithery/cli install base44-sdk-mcp
```

### Manual (Claude Desktop)

Add to your Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "base44-docs": {
      "command": "npx",
      "args": ["-y", "@smithery/cli", "run", "base44-sdk-mcp"]
    }
  }
}
```

Then restart Claude Desktop.

## Tools

### `lookup`
Look up documentation for a specific topic or method.

```
lookup({ topic: "entities" })                    // Full entities docs
lookup({ topic: "entities", method: "filter" })  // Just the filter method
lookup({ topic: "integrations", method: "InvokeLLM" })
```

### `search`
Full-text search across all documentation.

```
search({ query: "filter" })        // Find anything about filtering
search({ query: "OAuth" })         // Find OAuth-related docs
search({ query: "InvokeLLM" })     // Find LLM integration docs
```

### `list-topics`
List all available documentation topics and their methods.

```
list-topics()
```

## Resources

Each topic is available as an MCP resource at `base44://docs/{topic}`:

- `base44://docs/entities`
- `base44://docs/auth`
- `base44://docs/integrations`
- `base44://docs/connectors`
- `base44://docs/functions`
- `base44://docs/analytics`
- `base44://docs/best-practices`
- `base44://docs/project-structure`
- `base44://docs/getting-started`
- `base44://docs/full-reference` (all topics combined)

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run in dev mode (with MCP Inspector)
npm run dev
```

## Architecture

```
src/
├── index.ts              # Entry point — exports createServer()
├── stdio.ts              # stdio transport for Claude Desktop
├── docs/
│   ├── types.ts          # DocTopic, DocMethod, DocParameter interfaces
│   ├── index.ts          # Barrel export of all docs
│   ├── entities.ts       # Entity CRUD documentation
│   ├── auth.ts           # Authentication documentation
│   ├── integrations.ts   # Core integrations (LLM, email, files, images)
│   ├── connectors.ts     # OAuth connectors (11 services)
│   ├── functions.ts      # Backend Deno functions
│   ├── analytics.ts      # Event tracking
│   ├── best-practices.ts # Security, performance, error handling patterns
│   ├── project-structure.ts # File organization and pre-installed packages
│   └── getting-started.ts   # SDK setup and React Query patterns
└── tools/
    ├── lookup.ts         # Topic/method lookup logic
    ├── search.ts         # Full-text search logic
    └── list-topics.ts    # Topic listing logic
```

## Disclaimer

This is a **community-maintained project** and is **not officially supported by Base44**. The documentation provided may:
- Become outdated as the Base44 SDK evolves
- Contain inaccuracies or errors
- Not reflect the latest SDK features

For the most up-to-date and accurate information, always refer to the official Base44 SDK documentation.

## Contributing

Contributions are welcome! If you notice outdated or incorrect documentation, please open an issue or submit a pull request.

## License

MIT License - See LICENSE file for details.

This project is not affiliated with, endorsed by, or sponsored by Base44.
