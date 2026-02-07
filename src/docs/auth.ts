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

const authDocsData: Omit<DocTopic, "markdown"> = {
  topic: "auth",
  title: "Authentication",
  namespace: "base44.auth",
  methods: [
    {
      name: "me",
      signature: "me(): Promise<User>",
      description: "Get the currently authenticated user's information",
      parameters: [],
      returns: "Promise<User> - User object with id, email, full_name, role, and custom fields",
      example: `import { base44 } from '@/api/base44Client';

const user = await base44.auth.me();
console.log(user.id);        // User ID
console.log(user.email);     // Email address
console.log(user.full_name); // Display name
console.log(user.role);      // 'admin' or 'user'`,
      notes: [],
    },
    {
      name: "isAuthenticated",
      signature: "isAuthenticated(): Promise<boolean>",
      description: "Check if the current user is authenticated",
      parameters: [],
      returns: "Promise<boolean>",
      example: `import { base44 } from '@/api/base44Client';

const isLoggedIn = await base44.auth.isAuthenticated();
if (!isLoggedIn) {
  base44.auth.redirectToLogin();
}`,
      notes: [],
    },
    {
      name: "updateMe",
      signature: "updateMe(data: object): Promise<User>",
      description: "Update the current user's custom fields",
      parameters: [
        {
          name: "data",
          type: "object",
          optional: false,
          description: "Custom fields to update on the user",
        },
      ],
      returns: "Promise<User> - The updated user object",
      example: `import { base44 } from '@/api/base44Client';

await base44.auth.updateMe({
  theme: 'dark',
  notifications_enabled: true,
  onboarding_completed: true
});`,
      notes: [
        "Cannot update built-in fields like email, full_name, role",
      ],
    },
    {
      name: "logout",
      signature: "logout(redirectUrl?: string): void",
      description: "Log out the current user and optionally redirect",
      parameters: [
        {
          name: "redirectUrl",
          type: "string",
          optional: true,
          description: "URL to redirect after logout (reloads page if not provided)",
        },
      ],
      returns: "void",
      example: `import { base44 } from '@/api/base44Client';

base44.auth.logout();
base44.auth.logout('/goodbye');`,
      notes: [],
    },
    {
      name: "redirectToLogin",
      signature: "redirectToLogin(nextUrl?: string): void",
      description: "Redirect user to the login page",
      parameters: [
        {
          name: "nextUrl",
          type: "string",
          optional: true,
          description: "URL to redirect to after successful login",
        },
      ],
      returns: "void",
      example: `import { base44 } from '@/api/base44Client';

base44.auth.redirectToLogin();
base44.auth.redirectToLogin('/dashboard');`,
      notes: [],
    },
    {
      name: "User.list",
      signature: "User.list(): Promise<Array<User>>",
      description: "List all users (admin only)",
      parameters: [],
      returns: "Promise<Array<User>>",
      example: `import { base44 } from '@/api/base44Client';

const users = await base44.entities.User.list();`,
      notes: [
        "Admin only - regular users cannot list other users",
      ],
    },
    {
      name: "inviteUser",
      signature: "inviteUser(email: string, role: string): Promise<void>",
      description: "Invite a new user to the application",
      parameters: [
        {
          name: "email",
          type: "string",
          optional: false,
          description: "Email address to invite",
        },
        {
          name: "role",
          type: "string",
          optional: false,
          description: "'user' or 'admin'",
        },
      ],
      returns: "Promise<void>",
      example: `import { base44 } from '@/api/base44Client';

await base44.users.inviteUser('newuser@example.com', 'user');
await base44.users.inviteUser('admin@example.com', 'admin');`,
      notes: [
        "Admin role requires admin permissions",
        "Users cannot be created directly - must use invite system",
      ],
    },
    {
      name: "Role-Based UI Rendering",
      signature: "// Conditional rendering based on user role",
      description: "Pattern for showing/hiding UI elements based on user permissions",
      parameters: [],
      returns: "N/A - This is a UI pattern",
      example: `import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';

function Dashboard() {
  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me()
  });

  const isAdmin = user?.role === 'admin';

  return (
    <div>
      <h1>Dashboard</h1>
      
      {/* Show to all authenticated users */}
      <UserProfile user={user} />
      
      {/* Admin-only section */}
      {isAdmin && (
        <div className="admin-panel">
          <h2>Admin Controls</h2>
          <button onClick={handleDeleteUser}>Delete User</button>
          <button onClick={handleViewLogs}>View Audit Logs</button>
        </div>
      )}
      
      {/* Conditional navigation */}
      <nav>
        <Link to="/profile">My Profile</Link>
        {isAdmin && <Link to="/admin/users">Manage Users</Link>}
        {isAdmin && <Link to="/admin/settings">Settings</Link>}
      </nav>
    </div>
  );
}`,
      notes: [
        "Always verify permissions on the backend too - UI hiding is not security",
        "Use React Query to cache user data and avoid repeated API calls",
      ],
    },
    {
      name: "Protected Routes",
      signature: "// Route protection pattern",
      description: "Pattern for protecting routes that require authentication or specific roles",
      parameters: [],
      returns: "N/A - This is a routing pattern",
      example: `import { base44 } from '@/api/base44Client';
import { Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

// Protected route wrapper
function ProtectedRoute({ children, requireAdmin = false }) {
  const { data: user, isLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
    retry: false
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    // Not authenticated - redirect to login
    base44.auth.redirectToLogin(window.location.pathname);
    return null;
  }

  if (requireAdmin && user.role !== 'admin') {
    // Authenticated but not admin - show error
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

// Usage in routes:
<Route path="/dashboard" element={
  <ProtectedRoute>
    <Dashboard />
  </ProtectedRoute>
} />

<Route path="/admin/users" element={
  <ProtectedRoute requireAdmin={true}>
    <AdminUserManagement />
  </ProtectedRoute>
} />`,
      notes: [
        "Always check authentication on protected routes",
        "Redirect to login with return URL for better UX",
        "Show appropriate error pages for unauthorized access",
      ],
    },
    {
      name: "Session Management",
      signature: "// Session handling pattern",
      description: "Pattern for handling user sessions, auto-logout, and session refresh",
      parameters: [],
      returns: "N/A - This is a session pattern",
      example: `import { base44 } from '@/api/base44Client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

function useAuth() {
  const queryClient = useQueryClient();
  
  const { data: user, error } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false
  });

  // Handle session expiration
  useEffect(() => {
    if (error?.status === 401) {
      // Session expired - clear cache and redirect
      queryClient.clear();
      base44.auth.redirectToLogin(window.location.pathname);
    }
  }, [error, queryClient]);

  // Auto-refresh user data periodically
  useEffect(() => {
    const interval = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    }, 10 * 60 * 1000); // Refresh every 10 minutes

    return () => clearInterval(interval);
  }, [queryClient]);

  return {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    logout: () => {
      queryClient.clear();
      base44.auth.logout();
    }
  };
}

// Usage in components:
function MyComponent() {
  const { user, isAuthenticated, logout } = useAuth();
  
  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }
  
  return (
    <div>
      <p>Welcome, {user.full_name}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}`,
      notes: [
        "Use React Query for automatic session refresh and caching",
        "Handle 401 errors globally to catch session expiration",
        "Clear all cached data on logout for security",
      ],
    },
  ],
  notes: [
    "Login and authentication are handled by the Base44 platform - no need to implement login pages",
    "The User entity has special security rules: regular users can only view/update their own record",
    "Only admins can list, update, or delete other users",
    "Users cannot be created directly - must use the invite system",
    "Always verify permissions on both frontend (UX) and backend (security)",
    "Use React Query to cache user data and avoid repeated API calls",
  ],
};

export const authDocs: DocTopic = {
  ...authDocsData,
  markdown: renderMarkdown(authDocsData as DocTopic),
};
