import { DocTopic } from "./types.js";

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

const appLogsDocsData: Omit<DocTopic, "markdown"> = {
  topic: "app-logs",
  title: "App Logs",
  namespace: "base44.appLogs",
  methods: [
    {
      name: "logUserInApp",
      signature: "logUserInApp(pageName: string): Promise<void>",
      description: "Log user activity on a specific page or screen in your application",
      parameters: [
        {
          name: "pageName",
          type: "string",
          optional: false,
          description: "Name or path of the page/screen being accessed",
        },
      ],
      returns: "Promise<void>",
      example: `import { base44 } from '@/api/base44Client';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Log page views automatically
function PageTracker() {
  const location = useLocation();

  useEffect(() => {
    base44.appLogs.logUserInApp(location.pathname);
  }, [location]);

  return null;
}

// Manual logging in components
function Dashboard() {
  useEffect(() => {
    base44.appLogs.logUserInApp('/dashboard');
  }, []);

  return <div>Dashboard Content</div>;
}

// Log specific user actions
async function handleFeatureAccess() {
  await base44.appLogs.logUserInApp('/features/premium-feature');
  // Show premium feature
}

// Log with descriptive names
function ProductDetail({ productId }) {
  useEffect(() => {
    base44.appLogs.logUserInApp(\`/products/\${productId}\`);
  }, [productId]);

  return <div>Product Details</div>;
}`,
      notes: [
        "Automatically captures user ID, timestamp, and session information",
        "Use consistent naming conventions for pages (e.g., URL paths)",
        "Logs are stored in the Base44 platform and can be queried",
        "Useful for user behavior analysis and feature usage tracking",
      ],
    },
    {
      name: "App Logs vs Analytics SDK",
      signature: "// Comparison of logging approaches",
      description: "Understanding when to use App Logs vs Analytics SDK",
      parameters: [],
      returns: "N/A - This is a comparison guide",
      example: `import { base44 } from '@/api/base44Client';

// APP LOGS - Simple page/screen tracking
// ✅ Use for: Basic user activity logging
// ✅ Automatic: User ID, timestamp, session info
// ✅ Simple: Just pass page name

function PageA() {
  useEffect(() => {
    base44.appLogs.logUserInApp('/page-a');
  }, []);
  return <div>Page A</div>;
}

// ANALYTICS SDK - Detailed event tracking
// ✅ Use for: Custom events with metadata
// ✅ Flexible: Track any event with custom properties
// ✅ Detailed: Add context, categories, values

function PageB() {
  useEffect(() => {
    base44.analytics.trackEvent('page_view', {
      page: '/page-b',
      category: 'navigation',
      referrer: document.referrer,
      device: 'mobile'
    });
  }, []);
  return <div>Page B</div>;
}

// COMBINED APPROACH - Best of both worlds
function ProductPage({ product }) {
  useEffect(() => {
    // Simple page log
    base44.appLogs.logUserInApp(\`/products/\${product.id}\`);
    
    // Detailed analytics
    base44.analytics.trackEvent('product_view', {
      product_id: product.id,
      product_name: product.name,
      category: product.category,
      price: product.price
    });
  }, [product]);

  return <div>Product: {product.name}</div>;
}

// WHEN TO USE WHAT:
// 
// App Logs:
// - Page/screen navigation tracking
// - Simple user presence logging
// - Basic activity monitoring
// - When you just need "who was where when"
//
// Analytics SDK:
// - Button clicks, form submissions
// - Feature usage with context
// - Business metrics (purchases, signups)
// - A/B testing and conversion tracking
// - When you need detailed event metadata`,
      notes: [
        "App Logs: Simpler, automatic user/session tracking, page-focused",
        "Analytics SDK: More flexible, custom events, metadata-rich",
        "Use both together for comprehensive tracking",
        "App Logs are stored separately from Analytics events",
      ],
    },
    {
      name: "Query App Logs",
      signature: "// Querying logged user activity",
      description: "How to query and analyze app logs data",
      parameters: [],
      returns: "N/A - This is a querying pattern",
      example: `import { base44 } from '@/api/base44Client';

// App logs are stored in a special entity
// Query them like any other entity

// Get recent logs for current user
const myLogs = await base44.entities.AppLog.filter(
  { user_id: currentUser.id },
  '-created_date',
  50
);

// Get logs for specific page
const dashboardLogs = await base44.entities.AppLog.filter({
  page_name: '/dashboard'
});

// Get logs within date range
const recentLogs = await base44.entities.AppLog.filter({
  created_date: {
    $gte: '2024-01-01',
    $lte: '2024-01-31'
  }
});

// Count unique users on a page
const uniqueUsers = await base44.entities.AppLog.filter({
  page_name: '/premium-feature'
});
const userIds = new Set(uniqueUsers.map(log => log.user_id));
console.log(\`\${userIds.size} unique users accessed premium feature\`);

// Admin dashboard - most visited pages
async function getMostVisitedPages() {
  const logs = await base44.entities.AppLog.list();
  
  const pageCounts = logs.reduce((acc, log) => {
    acc[log.page_name] = (acc[log.page_name] || 0) + 1;
    return acc;
  }, {});
  
  return Object.entries(pageCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10);
}`,
      notes: [
        "App logs are stored in the AppLog entity",
        "Each log includes: user_id, page_name, created_date, session_id",
        "Query using standard entity methods (filter, list, etc.)",
        "Useful for building admin dashboards and usage reports",
      ],
    },
    {
      name: "Automatic Logging Setup",
      signature: "// Setup automatic page tracking",
      description: "Pattern for automatically logging all page views in your app",
      parameters: [],
      returns: "N/A - This is a setup pattern",
      example: `import { base44 } from '@/api/base44Client';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Global page tracker component
function AppLogsTracker() {
  const location = useLocation();

  useEffect(() => {
    // Log every route change
    base44.appLogs.logUserInApp(location.pathname);
  }, [location.pathname]);

  return null;
}

// Add to your app root
function App() {
  return (
    <Router>
      <AppLogsTracker />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/products/:id" element={<ProductDetail />} />
      </Routes>
    </Router>
  );
}

// With custom hook
function usePageTracking() {
  const location = useLocation();

  useEffect(() => {
    base44.appLogs.logUserInApp(location.pathname);
  }, [location.pathname]);
}

// Use in any component
function MyComponent() {
  usePageTracking();
  return <div>Content</div>;
}

// With error handling
function usePageTrackingWithErrorHandling() {
  const location = useLocation();

  useEffect(() => {
    base44.appLogs.logUserInApp(location.pathname).catch(err => {
      console.error('Failed to log page view:', err);
      // Don't block user experience if logging fails
    });
  }, [location.pathname]);
}`,
      notes: [
        "Set up once at app root level for automatic tracking",
        "Works with React Router, Next.js, or any routing library",
        "Add error handling to prevent logging failures from affecting UX",
        "Consider debouncing for rapid navigation",
      ],
    },
  ],
  notes: [
    "App Logs module is new in SDK v0.8.18",
    "Simpler alternative to Analytics SDK for basic page tracking",
    "Automatically captures user context (ID, session, timestamp)",
    "Logs are queryable through the AppLog entity",
    "Use Analytics SDK for detailed event tracking with custom metadata",
    "Both App Logs and Analytics can be used together",
    "Useful for user behavior analysis and feature usage monitoring",
  ],
};

export const appLogsDocs: DocTopic = {
  ...appLogsDocsData,
  markdown: renderMarkdown(appLogsDocsData as DocTopic),
};

// Made with Bob
