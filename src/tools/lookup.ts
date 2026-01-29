import { docsByTopic } from "../docs/index.js";
import { TopicName, ALL_TOPICS } from "../docs/types.js";

export function lookupDocs(topic: string, method?: string): string {
  if (!ALL_TOPICS.includes(topic as TopicName)) {
    return `Unknown topic: "${topic}". Available topics: ${ALL_TOPICS.join(", ")}`;
  }

  const doc = docsByTopic[topic as TopicName];

  if (method) {
    const found = doc.methods.find(
      (m) => m.name.toLowerCase() === method.toLowerCase()
    );
    if (!found) {
      return `Method "${method}" not found in topic "${topic}". Available methods: ${doc.methods.map((m) => m.name).join(", ")}`;
    }

    let result = `# ${doc.title} — ${found.name}\n\n`;
    result += `**Signature:** \`${found.signature}\`\n\n`;
    result += `${found.description}\n\n`;

    if (found.parameters.length > 0) {
      result += `## Parameters\n\n`;
      for (const p of found.parameters) {
        result += `- **${p.name}** (\`${p.type}\`${p.optional ? ", optional" : ""}): ${p.description}\n`;
      }
      result += `\n`;
    }

    result += `**Returns:** ${found.returns}\n\n`;

    if (found.example) {
      result += `## Example\n\n\`\`\`typescript\n${found.example}\n\`\`\`\n\n`;
    }

    if (found.notes.length > 0) {
      result += `## Notes\n\n`;
      for (const n of found.notes) {
        result += `- ${n}\n`;
      }
    }

    return result.trim();
  }

  // Return full topic markdown
  return doc.markdown;
}
