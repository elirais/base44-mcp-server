import { allDocs } from "../docs/index.js";

export function listTopics(): string {
  let output = "# Base44 SDK Documentation Topics\n\n";

  for (const doc of allDocs) {
    output += `## ${doc.topic}\n`;
    output += `**${doc.title}** (namespace: \`${doc.namespace}\`)\n`;

    if (doc.methods.length > 0) {
      output += `Methods: ${doc.methods.map((m) => m.name).join(", ")}\n`;
    }

    output += `\n`;
  }

  output += `Use the \`lookup\` tool with a topic name for full details.\n`;
  output += `Use the \`search\` tool to find specific methods or concepts.`;

  return output;
}
