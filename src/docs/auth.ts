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
  ],
  notes: [
    "Login and authentication are handled by the Base44 platform - no need to implement login pages",
    "The User entity has special security rules: regular users can only view/update their own record",
    "Only admins can list, update, or delete other users",
    "Users cannot be created directly - must use the invite system",
  ],
};

export const authDocs: DocTopic = {
  ...authDocsData,
  markdown: renderMarkdown(authDocsData as DocTopic),
};
