import { DocTopic } from "../types.js";

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

// Event with properties
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
});`,
      notes: [
        "Properties can only contain primitive values: strings, numbers, booleans, or null",
        "Use snake_case for event names and property keys",
        "Never include PII in properties",
      ],
    },
    {
      name: "Event Naming Conventions",
      signature: "Best Practices for Event Names",
      description: "Standard naming patterns for consistent analytics tracking.",
      parameters: [],
      returns: "N/A - Best practice guide",
      example: `import { base44 } from '@/api/base44Client';

// ✅ GOOD: Use snake_case with verb_noun pattern
base44.analytics.track({ eventName: 'button_clicked' });
base44.analytics.track({ eventName: 'form_submitted' });
base44.analytics.track({ eventName: 'purchase_completed' });

// ❌ BAD: Inconsistent naming
base44.analytics.track({ eventName: 'ButtonClick' }); // PascalCase
base44.analytics.track({ eventName: 'form-submit' }); // kebab-case

// Recommended categories:
// User Actions: button_clicked, link_clicked, tab_switched
// Navigation: page_viewed, section_scrolled, modal_opened
// Forms: form_started, form_submitted, form_abandoned
// E-commerce: product_viewed, add_to_cart, purchase_completed
// Content: video_played, article_read, download_started
// Features: feature_used, search_performed, filter_applied`,
      notes: [
        "Use snake_case for all event names",
        "Follow verb_noun pattern (e.g., button_clicked, not click_button)",
        "Be specific but concise",
      ],
    },
    {
      name: "Funnel Tracking",
      signature: "Multi-Step Conversion Funnels",
      description: "Track user progress through multi-step processes.",
      parameters: [],
      returns: "N/A - Pattern examples",
      example: `import { base44 } from '@/api/base44Client';

// Checkout funnel
const trackCheckout = {
  started: (cartValue) => {
    base44.analytics.track({
      eventName: 'checkout_started',
      properties: {
        funnel: 'checkout',
        step: 1,
        cart_value: cartValue
      }
    });
  },
  
  shipping: (method) => {
    base44.analytics.track({
      eventName: 'checkout_shipping',
      properties: {
        funnel: 'checkout',
        step: 2,
        shipping_method: method
      }
    });
  },
  
  completed: (orderId, total) => {
    base44.analytics.track({
      eventName: 'checkout_completed',
      properties: {
        funnel: 'checkout',
        step: 3,
        order_id: orderId,
        total_amount: total
      }
    });
  }
};`,
      notes: [
        "Use consistent funnel name across all steps",
        "Include step number for each stage",
        "Track both completion and abandonment",
      ],
    },
    {
      name: "Conversion Tracking",
      signature: "Measuring Key Business Metrics",
      description: "Track important business conversions and KPIs.",
      parameters: [],
      returns: "N/A - Pattern examples",
      example: `import { base44 } from '@/api/base44Client';

// Signup conversion
base44.analytics.track({
  eventName: 'signup_completed',
  properties: {
    signup_method: 'email',
    time_to_signup_seconds: 45
  }
});

// Feature adoption
base44.analytics.track({
  eventName: 'feature_first_use',
  properties: {
    feature_name: 'export_data',
    days_since_signup: 3
  }
});

// Revenue tracking
base44.analytics.track({
  eventName: 'purchase_completed',
  properties: {
    order_id: 'ord_123',
    revenue: 99.99,
    currency: 'USD',
    item_count: 3,
    is_first_purchase: true
  }
});`,
      notes: [
        "Track the full conversion path",
        "Include time-based metrics when relevant",
        "For revenue, always include currency and order_id",
      ],
    },
  ],
  notes: [
    "Use descriptive event names with snake_case",
    "Track both successes and failures for important actions",
    "Never include PII (emails, names, addresses) in properties",
    "Properties must be primitive values only (string, number, boolean, null)",
  ],
};

export const analyticsDocs: DocTopic = {
  ...analyticsDocsData,
  markdown: renderMarkdown(analyticsDocsData as DocTopic),
};
