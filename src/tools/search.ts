import { allDocs } from "../docs/index.js";
import { DocTopic, DocMethod } from "../docs/types.js";

interface SearchResult {
  topic: string;
  title: string;
  method?: string;
  snippet: string;
}

function matchesQuery(text: string, query: string): boolean {
  return text.toLowerCase().includes(query.toLowerCase());
}

export function searchDocs(query: string): string {
  const results: SearchResult[] = [];
  const lowerQuery = query.toLowerCase();

  for (const doc of allDocs) {
    // Search in topic-level fields
    if (
      matchesQuery(doc.title, query) ||
      matchesQuery(doc.namespace, query) ||
      doc.notes.some((n) => matchesQuery(n, query))
    ) {
      results.push({
        topic: doc.topic,
        title: doc.title,
        snippet: doc.notes.find((n) => matchesQuery(n, query)) || doc.title,
      });
    }

    // Search in methods
    for (const method of doc.methods) {
      if (
        matchesQuery(method.name, query) ||
        matchesQuery(method.description, query) ||
        matchesQuery(method.signature, query) ||
        matchesQuery(method.example, query) ||
        method.notes.some((n) => matchesQuery(n, query)) ||
        method.parameters.some(
          (p) => matchesQuery(p.name, query) || matchesQuery(p.description, query)
        )
      ) {
        results.push({
          topic: doc.topic,
          title: doc.title,
          method: method.name,
          snippet: matchesQuery(method.description, query)
            ? method.description
            : matchesQuery(method.name, query)
              ? method.description
              : `Found in ${method.name}`,
        });
      }
    }

    // Search in markdown
    if (matchesQuery(doc.markdown, query) && !results.some((r) => r.topic === doc.topic)) {
      results.push({
        topic: doc.topic,
        title: doc.title,
        snippet: `Found "${query}" in ${doc.title} documentation`,
      });
    }
  }

  if (results.length === 0) {
    return `No results found for "${query}". Try searching for a topic name, method name, or keyword.`;
  }

  let output = `# Search Results for "${query}"\n\n`;
  output += `Found ${results.length} result(s):\n\n`;

  for (const r of results) {
    if (r.method) {
      output += `- **${r.title}** → \`${r.method}\`: ${r.snippet}\n`;
    } else {
      output += `- **${r.title}**: ${r.snippet}\n`;
    }
  }

  output += `\nUse the \`lookup\` tool with a topic name for full details.`;

  return output.trim();
}
