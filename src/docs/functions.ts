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

const functionsDocsData: Omit<DocTopic, "markdown"> = {
  topic: "functions",
  title: "Backend Functions",
  namespace: "base44.functions",
  methods: [
    {
      name: "invoke",
      signature: "invoke(functionName: string, data?: object): Promise<AxiosResponse>",
      description: "Call a backend function from frontend code",
      parameters: [
        {
          name: "functionName",
          type: "string",
          optional: false,
          description: "The name of the backend function to call",
        },
        {
          name: "data",
          type: "object",
          optional: true,
          description: "Request body to send to the backend function",
        },
      ],
      returns: "Promise<AxiosResponse> - Axios response with .data and .status",
      example: `import { base44 } from '@/api/base44Client';

// Call a backend function with no data
const response = await base44.functions.invoke("sendWelcomeEmail");
console.log(response.data);

// Call a backend function with data
const result = await base44.functions.invoke("processPayment", {
  amount: 2999,
  currency: "usd",
  customerId: "cus_123"
});

console.log(result.data); // Response from the backend function
console.log(result.status); // HTTP status code`,
      notes: [],
    },
    {
      name: "createClientFromRequest",
      signature: "createClientFromRequest(req: Request): Base44Client",
      description: "Initialize the Base44 SDK client inside a backend function from the incoming request",
      parameters: [
        {
          name: "req",
          type: "Request",
          optional: false,
          description: "The Deno request object passed to the serve handler",
        },
      ],
      returns: "Base44Client - initialized SDK client",
      example: `import Base44 from 'npm:@base44/sdk@0.8.6';

const base44 = Base44.createClientFromRequest;

Deno.serve(async (req) => {
  const client = base44(req);
  const { entities } = client;

  // Now you can use SDK methods
  const todos = await entities.Todo.list();

  return new Response(JSON.stringify(todos), {
    headers: { "Content-Type": "application/json" }
  });
});`,
      notes: [
        "Import from 'npm:@base44/sdk@0.8.6'",
        "Must be called before using any SDK methods in backend",
      ],
    },
    {
      name: "asServiceRole",
      signature: "base44.asServiceRole.entities.EntityName.method()",
      description: "Execute operations with elevated (admin) permissions in backend functions",
      parameters: [],
      returns: "varies - depends on the method called",
      example: `import Base44 from 'npm:@base44/sdk@0.8.6';

const base44 = Base44.createClientFromRequest;

Deno.serve(async (req) => {
  const client = base44(req);

  // List all users with admin privileges (bypasses security rules)
  const allUsers = await client.asServiceRole.entities.User.list();

  // Call an integration with elevated permissions
  const oauthTokens = await client.asServiceRole.integrations.getTokens("google");

  // Create a record as the service role
  await client.asServiceRole.entities.AuditLog.create({
    action: "admin_access",
    timestamp: new Date().toISOString()
  });

  return new Response(JSON.stringify({ users: allUsers }), {
    headers: { "Content-Type": "application/json" }
  });
});`,
      notes: [
        "Only available in backend functions",
        "Bypasses per-user security rules",
      ],
    },
    {
      name: "secrets",
      signature: "Deno.env.get(key: string): string | undefined",
      description: "Access environment secrets configured in the Base44 dashboard",
      parameters: [
        {
          name: "key",
          type: "string",
          optional: false,
          description: "The name of the secret to retrieve",
        },
      ],
      returns: "string | undefined",
      example: `import Stripe from 'npm:stripe@17.4.0';

Deno.serve(async (req) => {
  // Access secrets set in the Base44 dashboard
  const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
  const apiToken = Deno.env.get("EXTERNAL_API_TOKEN");

  // Use secrets with external services
  const stripe = new Stripe(stripeKey);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: 1000,
    currency: "usd"
  });

  return new Response(JSON.stringify(paymentIntent), {
    headers: { "Content-Type": "application/json" }
  });
});`,
      notes: [
        "Set secrets in the Base44 dashboard",
        "Never hardcode secrets in code",
      ],
    },
    {
      name: "Webhook Verification",
      signature: "Verifying Webhook Signatures",
      description: "Securely verify webhook signatures from external services like Stripe, GitHub, etc.",
      parameters: [],
      returns: "N/A - Pattern examples",
      example: `import Base44 from 'npm:@base44/sdk@0.8.6';
import Stripe from 'npm:stripe@17.4.0';

const base44 = Base44.createClientFromRequest;

Deno.serve(async (req) => {
  const client = base44(req);
  
  // Get webhook secret from environment
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  
  if (!webhookSecret) {
    return new Response(
      JSON.stringify({ error: "Webhook secret not configured" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
  
  // Get raw body and signature
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");
  
  if (!signature) {
    return new Response(
      JSON.stringify({ error: "Missing signature" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
  
  try {
    // Verify webhook signature (use constructEventAsync for Deno)
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY"));
    const event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      webhookSecret
    );
    
    // Process verified webhook
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        await client.entities.Order.create({
          stripe_payment_id: paymentIntent.id,
          amount: paymentIntent.amount / 100,
          status: 'paid'
        });
        break;
        
      case 'customer.subscription.created':
        const subscription = event.data.object;
        await client.entities.Subscription.create({
          stripe_subscription_id: subscription.id,
          customer_id: subscription.customer,
          status: subscription.status
        });
        break;
    }
    
    return new Response(
      JSON.stringify({ received: true }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
    
  } catch (error) {
    console.error('Webhook verification failed:', error);
    return new Response(
      JSON.stringify({ error: 'Invalid signature' }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
});`,
      notes: [
        "Always verify webhook signatures before processing",
        "Use constructEventAsync (not constructEvent) for Stripe in Deno",
        "Store webhook secrets in environment variables",
        "Return 400 for invalid signatures, 200 for success",
      ],
    },
    {
      name: "CORS Configuration",
      signature: "Handling Cross-Origin Requests",
      description: "Configure CORS headers for frontend API calls",
      parameters: [],
      returns: "N/A - Pattern examples",
      example: `import Base44 from 'npm:@base44/sdk@0.8.6';

const base44 = Base44.createClientFromRequest;

// CORS headers helper
const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // Or specific domain: "https://myapp.com"
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Max-Age": "86400", // 24 hours
};

Deno.serve(async (req) => {
  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }
  
  const client = base44(req);
  
  try {
    // Your function logic
    const data = await client.entities.Product.list();
    
    return new Response(
      JSON.stringify(data),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      }
    );
  }
});

// Restricted CORS (specific domain only)
const restrictedCorsHeaders = {
  "Access-Control-Allow-Origin": "https://myapp.com",
  "Access-Control-Allow-Credentials": "true",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};`,
      notes: [
        "Always handle OPTIONS preflight requests",
        "Use specific origins in production (not *)",
        "Include CORS headers in all responses (success and error)",
        "Set Access-Control-Allow-Credentials: true for cookies",
      ],
    },
    {
      name: "Request Validation",
      signature: "Validating Request Data",
      description: "Validate and sanitize incoming request data",
      parameters: [],
      returns: "N/A - Pattern examples",
      example: `import Base44 from 'npm:@base44/sdk@0.8.6';

const base44 = Base44.createClientFromRequest;

Deno.serve(async (req) => {
  const client = base44(req);
  
  // Validate HTTP method
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { "Content-Type": "application/json" } }
    );
  }
  
  // Parse and validate JSON body
  let body;
  try {
    body = await req.json();
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Invalid JSON" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
  
  // Validate required fields
  const { email, name, age } = body;
  
  if (!email || !name) {
    return new Response(
      JSON.stringify({ error: "Missing required fields: email, name" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
  
  // Validate email format
  const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
  if (!emailRegex.test(email)) {
    return new Response(
      JSON.stringify({ error: "Invalid email format" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
  
  // Validate data types and ranges
  if (age !== undefined) {
    if (typeof age !== 'number' || age < 0 || age > 150) {
      return new Response(
        JSON.stringify({ error: "Age must be between 0 and 150" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
  }
  
  // Sanitize string inputs
  const sanitizedName = name.trim().substring(0, 100);
  
  // Process validated data
  const user = await client.entities.User.create({
    email: email.toLowerCase().trim(),
    name: sanitizedName,
    age
  });
  
  return new Response(
    JSON.stringify(user),
    { status: 201, headers: { "Content-Type": "application/json" } }
  );
});`,
      notes: [
        "Always validate HTTP method",
        "Validate required fields before processing",
        "Sanitize string inputs (trim, limit length)",
        "Return 400 status for validation errors",
      ],
    },
  ],
  notes: [
    "Backend functions use the Deno.serve(async (req) => { ... }) pattern",
    "Import packages with npm: or jsr: prefix (e.g., npm:stripe)",
    "Always include version in imports: npm:@base44/sdk@0.8.6",
    "Use camelCase for function names (no spaces, hyphens, or slashes)",
    "File operations only allowed in /tmp directory",
    "No local imports - each function is deployed independently",
    "Return Response objects, not plain strings",
    "Use constructEventAsync (not constructEvent) for Stripe webhooks in Deno",
    "Always verify webhook signatures before processing",
    "Handle CORS for frontend API calls",
    "Validate all incoming request data",
  ],
};

export const functionsDocs: DocTopic = {
  ...functionsDocsData,
  markdown: renderMarkdown(functionsDocsData as DocTopic),
};
