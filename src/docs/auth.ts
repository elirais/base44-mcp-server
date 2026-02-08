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
      name: "loginWithProvider",
      signature: "loginWithProvider(provider: string, nextUrl?: string): void",
      description: "Initiate OAuth login with a third-party provider (Google, GitHub, etc.)",
      parameters: [
        {
          name: "provider",
          type: "string",
          optional: false,
          description: "OAuth provider name (e.g., 'google', 'github')",
        },
        {
          name: "nextUrl",
          type: "string",
          optional: true,
          description: "URL to redirect to after successful login",
        },
      ],
      returns: "void",
      example: `import { base44 } from '@/api/base44Client';

// Login with Google
base44.auth.loginWithProvider('google');

// Login with GitHub and redirect to dashboard
base44.auth.loginWithProvider('github', '/dashboard');

// Login button component
function LoginButtons() {
  return (
    <div>
      <button onClick={() => base44.auth.loginWithProvider('google')}>
        Sign in with Google
      </button>
      <button onClick={() => base44.auth.loginWithProvider('github')}>
        Sign in with GitHub
      </button>
    </div>
  );
}`,
      notes: [
        "OAuth providers must be configured in Base44 platform settings",
        "Redirects to provider's login page, then back to your app",
      ],
    },
    {
      name: "loginViaEmailPassword",
      signature: "loginViaEmailPassword(email: string, password: string): Promise<User>",
      description: "Login with email and password credentials",
      parameters: [
        {
          name: "email",
          type: "string",
          optional: false,
          description: "User's email address",
        },
        {
          name: "password",
          type: "string",
          optional: false,
          description: "User's password",
        },
      ],
      returns: "Promise<User> - The authenticated user object",
      example: `import { base44 } from '@/api/base44Client';
import { useState } from 'react';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const user = await base44.auth.loginViaEmailPassword(email, password);
      console.log('Logged in as:', user.email);
      window.location.href = '/dashboard';
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      {error && <p className="error">{error}</p>}
      <button type="submit">Login</button>
    </form>
  );
}`,
      notes: [
        "Email/password authentication must be enabled in platform settings",
        "Returns user object on success, throws error on failure",
      ],
    },
    {
      name: "setToken",
      signature: "setToken(token: string): void",
      description: "Manually set authentication token (for custom auth flows)",
      parameters: [
        {
          name: "token",
          type: "string",
          optional: false,
          description: "JWT authentication token",
        },
      ],
      returns: "void",
      example: `import { base44 } from '@/api/base44Client';

// Custom authentication flow
async function customLogin(credentials) {
  const response = await fetch('/api/custom-auth', {
    method: 'POST',
    body: JSON.stringify(credentials)
  });
  
  const { token } = await response.json();
  
  // Set the token in Base44 SDK
  base44.auth.setToken(token);
  
  // Now SDK calls will use this token
  const user = await base44.auth.me();
}`,
      notes: [
        "Use for custom authentication flows or SSO integrations",
        "Token must be a valid JWT issued by Base44 platform",
      ],
    },
    {
      name: "register",
      signature: "register(email: string, password: string, fullName: string): Promise<User>",
      description: "Register a new user account with email and password",
      parameters: [
        {
          name: "email",
          type: "string",
          optional: false,
          description: "User's email address",
        },
        {
          name: "password",
          type: "string",
          optional: false,
          description: "User's password (must meet security requirements)",
        },
        {
          name: "fullName",
          type: "string",
          optional: false,
          description: "User's full name",
        },
      ],
      returns: "Promise<User> - The newly created user object",
      example: `import { base44 } from '@/api/base44Client';
import { useState } from 'react';

function RegisterForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: ''
  });
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const user = await base44.auth.register(
        formData.email,
        formData.password,
        formData.fullName
      );
      console.log('Registered:', user.email);
      window.location.href = '/onboarding';
    } catch (err) {
      setError(err.message || 'Registration failed');
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <input
        type="text"
        value={formData.fullName}
        onChange={(e) => setFormData({...formData, fullName: e.target.value})}
        placeholder="Full Name"
      />
      <input
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({...formData, email: e.target.value})}
        placeholder="Email"
      />
      <input
        type="password"
        value={formData.password}
        onChange={(e) => setFormData({...formData, password: e.target.value})}
        placeholder="Password"
      />
      {error && <p className="error">{error}</p>}
      <button type="submit">Register</button>
    </form>
  );
}`,
      notes: [
        "Self-registration must be enabled in platform settings",
        "Password must meet minimum security requirements",
        "User is automatically logged in after successful registration",
      ],
    },
    {
      name: "verifyOtp",
      signature: "verifyOtp(email: string, otp: string): Promise<User>",
      description: "Verify one-time password (OTP) for email-based authentication",
      parameters: [
        {
          name: "email",
          type: "string",
          optional: false,
          description: "User's email address",
        },
        {
          name: "otp",
          type: "string",
          optional: false,
          description: "One-time password code sent to email",
        },
      ],
      returns: "Promise<User> - The authenticated user object",
      example: `import { base44 } from '@/api/base44Client';
import { useState } from 'react';

function OtpLoginForm() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const sendOtp = async () => {
    // Request OTP (implementation depends on your backend)
    await fetch('/api/send-otp', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
    setOtpSent(true);
  };

  const verifyOtp = async () => {
    try {
      const user = await base44.auth.verifyOtp(email, otp);
      console.log('Logged in:', user.email);
      window.location.href = '/dashboard';
    } catch (err) {
      alert('Invalid OTP code');
    }
  };

  return (
    <div>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      {!otpSent ? (
        <button onClick={sendOtp}>Send OTP</button>
      ) : (
        <>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP code"
          />
          <button onClick={verifyOtp}>Verify</button>
        </>
      )}
    </div>
  );
}`,
      notes: [
        "OTP authentication must be enabled in platform settings",
        "OTP codes typically expire after 10 minutes",
        "Use for passwordless authentication flows",
      ],
    },
    {
      name: "resetPasswordRequest",
      signature: "resetPasswordRequest(email: string): Promise<void>",
      description: "Request a password reset email for the user",
      parameters: [
        {
          name: "email",
          type: "string",
          optional: false,
          description: "User's email address",
        },
      ],
      returns: "Promise<void>",
      example: `import { base44 } from '@/api/base44Client';
import { useState } from 'react';

function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      await base44.auth.resetPasswordRequest(email);
      setSent(true);
    } catch (err) {
      alert('Failed to send reset email');
    }
  };

  if (sent) {
    return (
      <div>
        <p>Password reset email sent to {email}</p>
        <p>Check your inbox and follow the instructions.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleReset}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
      />
      <button type="submit">Reset Password</button>
    </form>
  );
}`,
      notes: [
        "Sends email with password reset link",
        "Link expires after a configured time period",
        "User must click link and set new password",
      ],
    },
    {
      name: "changePassword",
      signature: "changePassword(currentPassword: string, newPassword: string): Promise<void>",
      description: "Change the current user's password",
      parameters: [
        {
          name: "currentPassword",
          type: "string",
          optional: false,
          description: "User's current password",
        },
        {
          name: "newPassword",
          type: "string",
          optional: false,
          description: "New password (must meet security requirements)",
        },
      ],
      returns: "Promise<void>",
      example: `import { base44 } from '@/api/base44Client';
import { useState } from 'react';

function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleChange = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await base44.auth.changePassword(currentPassword, newPassword);
      alert('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError('Current password is incorrect');
    }
  };

  return (
    <form onSubmit={handleChange}>
      <input
        type="password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        placeholder="Current Password"
      />
      <input
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        placeholder="New Password"
      />
      <input
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Confirm New Password"
      />
      {error && <p className="error">{error}</p>}
      <button type="submit">Change Password</button>
    </form>
  );
}`,
      notes: [
        "User must be authenticated to change password",
        "Current password must be correct",
        "New password must meet security requirements",
      ],
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
