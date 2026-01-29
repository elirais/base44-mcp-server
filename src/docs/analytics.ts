import { DocTopic } from "../types";

function renderMarkdown(doc: DocTopic): string {
  let md = `# ${doc.title}\n\n`;
  md += `**Namespace:** \`${doc.namespace}\`\n\n`;

  for (const method of doc.methods) {
    md += `## ${method.name}\n\n`;
    md += `\`\`\`typescript\n${method.signature}\n\`\`\`\n\n`;
    md += `${method.description}\n\n`;

    if (method.parameters.length > 0) {
      md += `### Parameters\n\n`;
      md += `| Name | Type | Optional | Description |\n`;
      md += `|------|------|----------|-------------|\n`;
      for (const param of method.parameters) {
        md += `| ${param.name} | \`${param.type}\` | ${param.optional ? "Yes" : "No"} | ${param.description} |\n`;
      }
      md += `\n`;
    }

    md += `**Returns:** ${method.returns}\n\n`;

    if (method.example) {
      md += `### Example\n\n\`\`\`typescript\n${method.example}\n\`\`\`\n\n`;
    }

    if (method.notes.length > 0) {
      md += `### Notes\n\n`;
      for (const note of method.notes) {
        md += `- ${note}\n`;
      }
      md += `\n`;
    }
  }

  if (doc.notes.length > 0) {
    md += `## Notes\n\n`;
    for (const note of doc.notes) {
      md += `- ${note}\n`;
    }
    md += `\n`;
  }

  return md.trim();
}

const analyticsDocsData: Omit<DocTopic, "markdown"> = {
  topic: "analytics",
  title: "Analytics",
  namespace: "base44.analytics",
  methods: [
    {
      name: "track",
      signature:
        "track(params: { eventName: string, properties?: Record<string, string | number | boolean | null> }): void",
      description:
        "Track custom events to understand user behavior and measure conversions",
      parameters: [
        {
          name: "eventName",
          type: "string",
          optional: false,
          description: "The name of the event to track",
        },
        {
          name: "properties",
          type: "object",
          optional: true,
          description:
            "Key-value pairs with primitive values only (strings, numbers, booleans, or null)",
        },
      ],
      returns: "void",
      example: `import { base44 } from '@/api/base44Client';

// Simple event tracking
base44.analytics.track({ eventName: 'button_clicked' });

// Event with properties (e.g., add to cart)
base44.analytics.track({
  eventName: 'add_to_cart',
  properties: {
    product_id: 'prod_123',
    product_name: 'Wireless Headphones',
    price: 59.99,
    quantity: 1
  }
});

// Page view tracking
base44.analytics.track({
  eventName: 'page_viewed',
  properties: {
    page_name: 'pricing',
    referrer: 'homepage'
  }
});

// Form submission tracking
base44.analytics.track({
  eventName: 'form_submitted',
  properties: {
    form_name: 'contact_us',
    has_attachment: false,
    field_count: 5
  }
});`,
      notes: [
        "Properties can only contain primitive values: strings, numbers, booleans, or null",
        "Use snake_case for event names and property keys",
        "Never include PII in properties",
      ],
    },
  ],
  notes: [
    "Use descriptive event names (e.g., 'button_clicked', 'form_submitted')",
    "Track both successes and failures for important actions",
    "Suggested event names: button_clicked, link_clicked, form_submitted, search_performed, page_viewed, purchase_completed, feature_used",
  ],
};

export const analyticsDocs: DocTopic = {
  ...analyticsDocsData,
  markdown: renderMarkdown(analyticsDocsData as DocTopic),
};
