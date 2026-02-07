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

const bestPracticesDocsData: Omit<DocTopic, "markdown"> = {
  topic: "best-practices",
  title: "Best Practices",
  namespace: "N/A",
  methods: [
    {
      name: "Admin-Only Functions",
      signature: "// Role-based access control pattern",
      description:
        "Verify user roles before executing sensitive operations to ensure only authorized users can perform admin actions",
      parameters: [],
      returns: "N/A - This is a best practice pattern",
      example: `import { base44 } from '@/api/base44Client';

// Always check user role before sensitive operations
const user = await base44.auth.me();

if (user.role !== 'admin') {
  return Response.json(
    { error: 'Unauthorized: Admin access required' },
    { status: 403 }
  );
}

// Proceed with admin-only operation
const allUsers = await base44.entities.User.list();
await base44.entities.AuditLog.create({
  action: 'user_list_accessed',
  performed_by: user.email
});`,
      notes: [],
    },
    {
      name: "Input Validation",
      signature: "// Input validation pattern",
      description:
        "Validate and sanitize all user inputs before processing to prevent invalid data and security vulnerabilities",
      parameters: [],
      returns: "N/A - This is a best practice pattern",
      example: `import { base44 } from '@/api/base44Client';

export default async function handler(req) {
  const { email, name, age } = req.body;

  // Validate required fields
  if (!email || !name) {
    return Response.json(
      { error: 'Email and name are required' },
      { status: 400 }
    );
  }

  // Validate email format
  const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
  if (!emailRegex.test(email)) {
    return Response.json(
      { error: 'Invalid email format' },
      { status: 400 }
    );
  }

  // Validate data types
  if (age !== undefined && (typeof age !== 'number' || age < 0 || age > 150)) {
    return Response.json(
      { error: 'Age must be a valid number between 0 and 150' },
      { status: 400 }
    );
  }

  // Sanitize string inputs
  const sanitizedName = name.trim().substring(0, 100);

  const record = await base44.entities.Contact.create({
    email: email.toLowerCase().trim(),
    name: sanitizedName,
    age
  });

  return Response.json(record);
}`,
      notes: [],
    },
    {
      name: "Secure Secrets Management",
      signature: "// Secrets management pattern",
      description:
        "Never hardcode secrets or API keys in your code. Use environment variables or secure configuration for all sensitive values",
      parameters: [],
      returns: "N/A - This is a best practice pattern",
      example: `// BAD - Never hardcode secrets
const API_KEY = 'sk-1234567890abcdef';
const response = await fetch('https://api.example.com/data', {
  headers: { 'Authorization': 'Bearer sk-1234567890abcdef' }
});

// GOOD - Use environment variables or secrets configuration
const API_KEY = process.env.EXAMPLE_API_KEY;

if (!API_KEY) {
  return Response.json(
    { error: 'API key not configured' },
    { status: 500 }
  );
}

const response = await fetch('https://api.example.com/data', {
  headers: { 'Authorization': \`Bearer \${API_KEY}\` }
});`,
      notes: [],
    },
    {
      name: "Parallel Operations",
      signature: "// Parallel operations with Promise.all",
      description:
        "Use Promise.all for independent async operations to improve performance instead of awaiting each operation sequentially",
      parameters: [],
      returns: "N/A - This is a best practice pattern",
      example: `import { base44 } from '@/api/base44Client';

// BAD - Sequential operations (slow)
const users = await base44.entities.User.list();
const orders = await base44.entities.Order.list();
const products = await base44.entities.Product.list();
// Total time: time(users) + time(orders) + time(products)

// GOOD - Parallel operations (fast)
const [users, orders, products] = await Promise.all([
  base44.entities.User.list(),
  base44.entities.Order.list(),
  base44.entities.Product.list()
]);
// Total time: max(time(users), time(orders), time(products))

// Also useful for batch updates
const updatePromises = items.map(item =>
  base44.entities.Item.update(item.id, { status: 'processed' })
);
await Promise.all(updatePromises);`,
      notes: [],
    },
    {
      name: "Efficient Filtering",
      signature: "// Database-level filtering pattern",
      description:
        "Use entity filters to query data at the database level instead of fetching all records and filtering on the client side",
      parameters: [],
      returns: "N/A - This is a best practice pattern",
      example: `import { base44 } from '@/api/base44Client';

// BAD - Fetching all data and filtering client-side
const allOrders = await base44.entities.Order.list();
const activeOrders = allOrders.filter(o => o.status === 'active');
const recentActive = activeOrders.filter(o =>
  new Date(o.created_date) > new Date('2024-01-01')
);

// GOOD - Filter at the database level
const recentActive = await base44.entities.Order.filter({
  status: 'active',
  created_date: { $gte: '2024-01-01' }
}, '-created_date', 50);

// GOOD - Combine filtering with limiting
const topCustomers = await base44.entities.Customer.filter(
  { lifetime_value: { $gte: 1000 } },
  '-lifetime_value',
  10
);`,
      notes: [],
    },
    {
      name: "Error Handling",
      signature: "// Error handling pattern",
      description:
        "Provide clear error messages and proper HTTP status codes. Wrap operations in try-catch blocks and return meaningful responses",
      parameters: [],
      returns: "N/A - This is a best practice pattern",
      example: `import { base44 } from '@/api/base44Client';

export default async function handler(req) {
  try {
    const { id } = req.params;

    if (!id) {
      return Response.json(
        { error: 'Missing required parameter: id' },
        { status: 400 }
      );
    }

    const items = await base44.entities.Item.filter({ id });

    if (items.length === 0) {
      return Response.json(
        { error: 'Item not found' },
        { status: 404 }
      );
    }

    const updated = await base44.entities.Item.update(id, {
      status: 'processed',
      processed_at: new Date().toISOString()
    });

    return Response.json(updated);
  } catch (error) {
    console.error('Failed to process item:', error);
    return Response.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}`,
      notes: [],
    },
    {
      name: "Caching Strategies",
      signature: "// React Query caching pattern",
      description:
        "Use React Query for efficient data caching and automatic background updates to reduce API calls and improve performance",
      parameters: [],
      returns: "N/A - This is a best practice pattern",
      example: `import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

function ProductList() {
  const queryClient = useQueryClient();

  // Cache products with 5-minute stale time
  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => base44.entities.Product.list(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000    // Keep in cache for 10 minutes
  });

  // Mutation with automatic cache update
  const createProduct = useMutation({
    mutationFn: (newProduct) => base44.entities.Product.create(newProduct),
    onSuccess: () => {
      // Invalidate and refetch products list
      queryClient.invalidateQueries({ queryKey: ['products'] });
    }
  });

  // Optimistic update for better UX
  const updateProduct = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Product.update(id, data),
    onMutate: async ({ id, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['products'] });
      
      // Snapshot previous value
      const previous = queryClient.getQueryData(['products']);
      
      // Optimistically update cache
      queryClient.setQueryData(['products'], (old) =>
        old.map(p => p.id === id ? { ...p, ...data } : p)
      );
      
      return { previous };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      queryClient.setQueryData(['products'], context.previous);
    }
  });

  return (
    <div>
      {isLoading ? <div>Loading...</div> : (
        products.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onUpdate={(data) => updateProduct.mutate({ id: product.id, data })}
          />
        ))
      )}
    </div>
  );
}`,
      notes: [
        "Use staleTime to control how long data is considered fresh",
        "Use gcTime (garbage collection time) to control cache retention",
        "Invalidate queries after mutations to keep data in sync",
        "Use optimistic updates for instant UI feedback",
      ],
    },
    {
      name: "Rate Limiting",
      signature: "// Rate limiting pattern for backend functions",
      description:
        "Implement rate limiting in backend functions to prevent abuse and protect your application from excessive requests",
      parameters: [],
      returns: "N/A - This is a best practice pattern",
      example: `import { base44 } from '@/api/base44Client';

// Simple in-memory rate limiter (for single-instance functions)
const rateLimits = new Map();

function checkRateLimit(identifier, maxRequests = 10, windowMs = 60000) {
  const now = Date.now();
  const userLimits = rateLimits.get(identifier) || { count: 0, resetTime: now + windowMs };
  
  // Reset if window expired
  if (now > userLimits.resetTime) {
    userLimits.count = 0;
    userLimits.resetTime = now + windowMs;
  }
  
  userLimits.count++;
  rateLimits.set(identifier, userLimits);
  
  return {
    allowed: userLimits.count <= maxRequests,
    remaining: Math.max(0, maxRequests - userLimits.count),
    resetTime: userLimits.resetTime
  };
}

export default async function handler(req) {
  try {
    const user = await base44.auth.me();
    
    // Rate limit by user email
    const limit = checkRateLimit(user.email, 100, 60000); // 100 requests per minute
    
    if (!limit.allowed) {
      return Response.json(
        {
          error: 'Rate limit exceeded',
          retryAfter: Math.ceil((limit.resetTime - Date.now()) / 1000)
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': limit.resetTime.toString()
          }
        }
      );
    }
    
    // Process request
    const result = await processRequest(req);
    
    return Response.json(result, {
      headers: {
        'X-RateLimit-Remaining': limit.remaining.toString(),
        'X-RateLimit-Reset': limit.resetTime.toString()
      }
    });
  } catch (error) {
    console.error('Request failed:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}`,
      notes: [
        "Use entity-based rate limiting for distributed systems",
        "Return 429 status code with Retry-After header",
        "Include rate limit info in response headers",
        "Consider different limits for different user roles",
      ],
    },
    {
      name: "Testing Best Practices",
      signature: "// Testing patterns for Base44 apps",
      description:
        "Patterns for testing Base44 applications including mocking SDK calls and testing React components",
      parameters: [],
      returns: "N/A - This is a best practice pattern",
      example: `import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi } from 'vitest';
import { base44 } from '@/api/base44Client';

// Mock the Base44 SDK
vi.mock('@/api/base44Client', () => ({
  base44: {
    entities: {
      Product: {
        list: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn()
      }
    },
    auth: {
      me: vi.fn()
    }
  }
}));

describe('ProductList', () => {
  let queryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false }
      }
    });
    vi.clearAllMocks();
  });

  it('displays products from API', async () => {
    // Mock API response
    base44.entities.Product.list.mockResolvedValue([
      { id: '1', name: 'Product 1', price: 100 },
      { id: '2', name: 'Product 2', price: 200 }
    ]);

    render(
      <QueryClientProvider client={queryClient}>
        <ProductList />
      </QueryClientProvider>
    );

    // Wait for products to load
    await waitFor(() => {
      expect(screen.getByText('Product 1')).toBeInTheDocument();
      expect(screen.getByText('Product 2')).toBeInTheDocument();
    });

    // Verify API was called
    expect(base44.entities.Product.list).toHaveBeenCalledTimes(1);
  });

  it('handles API errors gracefully', async () => {
    // Mock API error
    base44.entities.Product.list.mockRejectedValue(
      new Error('Network error')
    );

    render(
      <QueryClientProvider client={queryClient}>
        <ProductList />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });
});`,
      notes: [
        "Mock the Base44 SDK for unit tests",
        "Use React Testing Library for component tests",
        "Test both success and error scenarios",
        "Use QueryClient with retry: false for faster tests",
      ],
    },
  ],
  notes: [
    "Follow security best practices: validate inputs, check roles, verify webhooks",
    "Optimize performance: use Promise.all, filter at database level, implement caching",
    "Handle errors gracefully with proper HTTP status codes",
    "Implement rate limiting to prevent abuse",
    "Write tests to ensure code quality and catch regressions",
  ],
};

export const bestPracticesDocs: DocTopic = {
  ...bestPracticesDocsData,
  markdown: renderMarkdown(bestPracticesDocsData as DocTopic),
};
