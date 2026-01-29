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

const integrationsDocsData: Omit<DocTopic, "markdown"> = {
  topic: "integrations",
  title: "Core Integrations",
  namespace: "base44.integrations.Core",
  methods: [
    {
      name: "InvokeLLM",
      signature:
        "InvokeLLM(params: { prompt: string, add_context_from_internet?: boolean, response_json_schema?: object, file_urls?: string[] }): Promise<string | object>",
      description:
        "Generate AI responses with optional web context and file attachments. Supports structured JSON output.",
      parameters: [
        {
          name: "prompt",
          type: "string",
          optional: false,
          description: "The text prompt to send to the language model",
        },
        {
          name: "add_context_from_internet",
          type: "boolean",
          optional: true,
          description:
            "When true, augments the prompt with relevant web search results. Default: false",
        },
        {
          name: "response_json_schema",
          type: "object",
          optional: true,
          description:
            "JSON schema for structured output. When provided, the response is parsed and returned as an object",
        },
        {
          name: "file_urls",
          type: "string[]",
          optional: true,
          description:
            "Array of file URLs to include as context (e.g. images for analysis)",
        },
      ],
      returns:
        "`Promise<string | object>` - String response by default, or a parsed object when response_json_schema is provided",
      example: `import { base44 } from '@/api/base44Client';

// Simple text prompt
const response = await base44.integrations.Core.InvokeLLM({
  prompt: "Summarize the benefits of TypeScript in 3 bullet points"
});
console.log(response); // "- Type safety catches bugs at compile time..."

// Structured JSON output
const analysis = await base44.integrations.Core.InvokeLLM({
  prompt: "Analyze this product review: 'Great laptop, fast performance but battery is weak'",
  response_json_schema: {
    type: "object",
    properties: {
      sentiment: { type: "string", enum: ["positive", "negative", "mixed"] },
      pros: { type: "array", items: { type: "string" } },
      cons: { type: "array", items: { type: "string" } },
      rating: { type: "number", minimum: 1, maximum: 5 }
    }
  }
});
console.log(analysis.sentiment); // "mixed"
console.log(analysis.pros);      // ["fast performance"]

// Image analysis with file attachment
const description = await base44.integrations.Core.InvokeLLM({
  prompt: "Describe what you see in this image",
  file_urls: ["https://storage.base44.com/uploads/photo.jpg"]
});`,
      notes: [
        "Returns a string by default, or a parsed object when response_json_schema is provided",
        "Use add_context_from_internet for questions that need up-to-date information",
      ],
    },
    {
      name: "SendEmail",
      signature:
        "SendEmail(params: { to: string, subject: string, body: string, from_name?: string }): Promise<void>",
      description:
        "Send transactional emails with customizable sender name. Body supports HTML.",
      parameters: [
        {
          name: "to",
          type: "string",
          optional: false,
          description: "Recipient email address",
        },
        {
          name: "subject",
          type: "string",
          optional: false,
          description: "Email subject line",
        },
        {
          name: "body",
          type: "string",
          optional: false,
          description: "Email body content. Supports HTML formatting",
        },
        {
          name: "from_name",
          type: "string",
          optional: true,
          description: "Display name for the sender",
        },
      ],
      returns: "`Promise<void>`",
      example: `import { base44 } from '@/api/base44Client';

await base44.integrations.Core.SendEmail({
  to: "customer@example.com",
  subject: "Your order has been confirmed",
  body: \`
    <h1>Order Confirmation</h1>
    <p>Thank you for your purchase!</p>
    <p>Order #12345 has been confirmed and will ship within 2 business days.</p>
    <a href="https://myapp.base44.com/orders/12345">View Order</a>
  \`,
  from_name: "MyApp Orders"
});`,
      notes: [],
    },
    {
      name: "UploadFile",
      signature:
        "UploadFile(params: { file: File }): Promise<{ file_url: string }>",
      description:
        "Upload files to public storage. Returns a URL for accessing the file.",
      parameters: [
        {
          name: "file",
          type: "File",
          optional: false,
          description: "The file object to upload",
        },
      ],
      returns: "`Promise<{ file_url: string }>` - Object containing the public URL of the uploaded file",
      example: `import { base44 } from '@/api/base44Client';

// Upload a file from an input element
const fileInput = document.querySelector('input[type="file"]');
const file = fileInput.files[0];

const { file_url } = await base44.integrations.Core.UploadFile({ file });
console.log(file_url); // "https://storage.base44.com/uploads/abc123.png"

// Store the URL in an entity
await base44.entities.Product.update(productId, {
  image_url: file_url
});`,
      notes: [],
    },
    {
      name: "UploadPrivateFile",
      signature:
        "UploadPrivateFile(params: { file: File }): Promise<{ file_uri: string }>",
      description:
        "Upload files to private storage. Requires signed URLs for access.",
      parameters: [
        {
          name: "file",
          type: "File",
          optional: false,
          description: "The file object to upload to private storage",
        },
      ],
      returns: "`Promise<{ file_uri: string }>` - Object containing the private file URI",
      example: `import { base44 } from '@/api/base44Client';

const fileInput = document.querySelector('input[type="file"]');
const file = fileInput.files[0];

const { file_uri } = await base44.integrations.Core.UploadPrivateFile({ file });
console.log(file_uri); // "private://uploads/secure-doc-456.pdf"

// Store the URI in an entity for later access
await base44.entities.Document.create({
  name: file.name,
  file_uri: file_uri,
  uploaded_by: currentUser.email
});`,
      notes: [],
    },
    {
      name: "CreateFileSignedUrl",
      signature:
        "CreateFileSignedUrl(params: { file_uri: string, expires_in?: number }): Promise<{ signed_url: string }>",
      description:
        "Generate a time-limited signed URL to access a private file.",
      parameters: [
        {
          name: "file_uri",
          type: "string",
          optional: false,
          description:
            "The private file URI returned from UploadPrivateFile",
        },
        {
          name: "expires_in",
          type: "number",
          optional: true,
          description:
            "Expiration time in seconds. Default: 300 (5 minutes)",
        },
      ],
      returns: "`Promise<{ signed_url: string }>` - Object containing a temporary signed URL",
      example: `import { base44 } from '@/api/base44Client';

// Get a signed URL for a private file
const { signed_url } = await base44.integrations.Core.CreateFileSignedUrl({
  file_uri: "private://uploads/secure-doc-456.pdf"
});
// signed_url is valid for 5 minutes by default

// Custom expiration (1 hour)
const { signed_url: longUrl } = await base44.integrations.Core.CreateFileSignedUrl({
  file_uri: document.file_uri,
  expires_in: 3600
});

// Use the signed URL to display or download the file
window.open(signed_url);`,
      notes: [],
    },
    {
      name: "GenerateImage",
      signature:
        "GenerateImage(params: { prompt: string, existing_image_urls?: string[] }): Promise<{ url: string }>",
      description:
        "Generate AI images from text prompts. Can use reference images for style or editing.",
      parameters: [
        {
          name: "prompt",
          type: "string",
          optional: false,
          description: "Text description of the image to generate",
        },
        {
          name: "existing_image_urls",
          type: "string[]",
          optional: true,
          description:
            "Reference image URLs for style guidance or image editing",
        },
      ],
      returns: "`Promise<{ url: string }>` - Object containing the URL of the generated image",
      example: `import { base44 } from '@/api/base44Client';

// Generate an image from a text prompt
const { url } = await base44.integrations.Core.GenerateImage({
  prompt: "A modern minimalist logo for a coffee shop called 'Bean & Brew'"
});
console.log(url); // "https://storage.base44.com/generated/img-789.png"

// Generate with a reference image for style
const { url: styledUrl } = await base44.integrations.Core.GenerateImage({
  prompt: "Same style but with a tea cup instead",
  existing_image_urls: [url]
});

// Save generated image to an entity
await base44.entities.Brand.update(brandId, {
  logo_url: url
});`,
      notes: [],
    },
    {
      name: "ExtractDataFromUploadedFile",
      signature:
        "ExtractDataFromUploadedFile(params: { file_url: string, json_schema: object }): Promise<{ status: string, output: object }>",
      description:
        "Extract structured data from uploaded files (CSV, PDF, images). Requires a target JSON schema.",
      parameters: [
        {
          name: "file_url",
          type: "string",
          optional: false,
          description: "URL of the uploaded file to extract data from",
        },
        {
          name: "json_schema",
          type: "object",
          optional: false,
          description:
            "JSON schema defining the structure of the data to extract",
        },
      ],
      returns:
        "`Promise<{ status: string, output: object }>` - Extraction status and the structured output matching the provided schema",
      example: `import { base44 } from '@/api/base44Client';

// Extract invoice data from a PDF
const { file_url } = await base44.integrations.Core.UploadFile({ file: invoicePdf });

const result = await base44.integrations.Core.ExtractDataFromUploadedFile({
  file_url,
  json_schema: {
    type: "object",
    properties: {
      vendor_name: { type: "string" },
      invoice_number: { type: "string" },
      date: { type: "string", format: "date" },
      line_items: {
        type: "array",
        items: {
          type: "object",
          properties: {
            description: { type: "string" },
            quantity: { type: "number" },
            unit_price: { type: "number" }
          }
        }
      },
      total_amount: { type: "number" }
    }
  }
});

console.log(result.status);                // "success"
console.log(result.output.vendor_name);    // "Acme Corp"
console.log(result.output.total_amount);   // 1250.00
console.log(result.output.line_items);     // [{ description: "Widget", quantity: 5, unit_price: 250 }]`,
      notes: [],
    },
  ],
  notes: [
    "All integrations are accessed via base44.integrations.Core.MethodName(params)",
    "InvokeLLM returns a string by default, or a parsed object when response_json_schema is provided",
    "File uploads return URLs that can be stored in entity fields",
  ],
};

export const integrationsDocs: DocTopic = {
  ...integrationsDocsData,
  markdown: renderMarkdown(integrationsDocsData as DocTopic),
};
