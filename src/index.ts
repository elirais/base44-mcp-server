import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { lookupDocs } from "./tools/lookup.js";
import { searchDocs } from "./tools/search.js";
import { listTopics } from "./tools/list-topics.js";
import { allDocs } from "./docs/index.js";
import { ALL_TOPICS } from "./docs/types.js";

// Default export for Smithery CLI
export default function createServer({ config = {} } = {}) {
  const server = new McpServer({
    name: "Base44 SDK Docs",
    version: "1.0.0",
  });

  // Tool: lookup — Get documentation for a specific topic or method
  server.tool(
    "lookup",
    "Look up Base44 SDK documentation for a specific topic, optionally filtered to a single method",
    {
      topic: z.string().describe(
        `The documentation topic. One of: ${ALL_TOPICS.join(", ")}`
      ),
      method: z.string().optional().describe(
        "Optional method name within the topic for detailed docs"
      ),
    },
    async ({ topic, method }) => ({
      content: [{ type: "text", text: lookupDocs(topic, method) }],
    })
  );

  // Tool: search — Full-text search across all documentation
  server.tool(
    "search",
    "Search Base44 SDK documentation for methods, concepts, or keywords",
    {
      query: z.string().describe("Search query — a method name, keyword, or concept"),
    },
    async ({ query }) => ({
      content: [{ type: "text", text: searchDocs(query) }],
    })
  );

  // Tool: list-topics — List all available documentation topics
  server.tool(
    "list-topics",
    "List all available Base44 SDK documentation topics and their methods",
    {},
    async () => ({
      content: [{ type: "text", text: listTopics() }],
    })
  );

  // Resources: one per topic at base44://docs/{topic}
  for (const doc of allDocs) {
    server.resource(
      doc.topic,
      `base44://docs/${doc.topic}`,
      { description: `${doc.title} — ${doc.namespace}`, mimeType: "text/markdown" },
      async () => ({
        contents: [
          {
            uri: `base44://docs/${doc.topic}`,
            mimeType: "text/markdown",
            text: doc.markdown,
          },
        ],
      })
    );
  }

  // Resource: full reference
  server.resource(
    "full-reference",
    "base44://docs/full-reference",
    { description: "Complete Base44 SDK reference (all topics)", mimeType: "text/markdown" },
    async () => ({
      contents: [
        {
          uri: "base44://docs/full-reference",
          mimeType: "text/markdown",
          text: allDocs.map((d) => d.markdown).join("\n\n---\n\n"),
        },
      ],
    })
  );

  return server.server;
}
