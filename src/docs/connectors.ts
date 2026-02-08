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

const connectorsDocsData: Omit<DocTopic, "markdown"> = {
  topic: "connectors",
  title: "App Connectors (OAuth)",
  namespace: "base44.asServiceRole.connectors",
  methods: [
    {
      name: "getAccessToken",
      signature: "getAccessToken(integration_type: string): Promise<string>",
      description: "Get an OAuth access token for a connected service. Must be called from a backend function using asServiceRole.",
      parameters: [
        {
          name: "integration_type",
          type: "string",
          optional: false,
          description: "The service to get a token for. One of: googlecalendar, googledrive, gmail, googlesheets, googledocs, slack, notion, salesforce, hubspot, linkedin, tiktok",
        },
      ],
      returns: "Promise<string> - OAuth access token",
      example: `// Backend function: fetch Google Calendar events
import Base44 from 'npm:@base44/sdk@0.8.6';

const base44 = Base44.createClientFromRequest;

Deno.serve(async (req) => {
  const client = base44(req);

  // Get the OAuth token for Google Calendar
  const token = await client.asServiceRole.connectors.getAccessToken("googlecalendar");

  // Use the token to call Google Calendar API
  const response = await fetch(
    "https://www.googleapis.com/calendar/v3/calendars/primary/events?" +
    new URLSearchParams({
      timeMin: new Date().toISOString(),
      maxResults: "10",
      singleEvents: "true",
      orderBy: "startTime"
    }),
    {
      headers: {
        Authorization: \`Bearer \${token}\`
      }
    }
  );

  const data = await response.json();
  return new Response(JSON.stringify(data.items), {
    headers: { "Content-Type": "application/json" }
  });
});`,
      notes: [
        "Must be called from backend functions only",
        "Uses the app builder's connected account, not individual users",
        "Tokens are automatically refreshed when expired",
      ],
    },
    {
      name: "Google Calendar Integration",
      signature: "Google Calendar API Examples",
      description: "Complete examples for integrating with Google Calendar to manage events, calendars, and availability.",
      parameters: [],
      returns: "N/A - Reference examples",
      example: `import Base44 from 'npm:@base44/sdk@0.8.6';

const base44 = Base44.createClientFromRequest;

Deno.serve(async (req) => {
  const client = base44(req);
  const token = await client.asServiceRole.connectors.getAccessToken("googlecalendar");

  // List upcoming events
  const eventsResponse = await fetch(
    "https://www.googleapis.com/calendar/v3/calendars/primary/events?" +
    new URLSearchParams({
      timeMin: new Date().toISOString(),
      maxResults: "10",
      singleEvents: "true",
      orderBy: "startTime"
    }),
    { headers: { Authorization: \`Bearer \${token}\` } }
  );
  const events = await eventsResponse.json();

  // Create a new event
  const newEvent = {
    summary: "Team Meeting",
    description: "Weekly sync",
    start: { dateTime: "2024-03-20T10:00:00-07:00", timeZone: "America/Los_Angeles" },
    end: { dateTime: "2024-03-20T11:00:00-07:00", timeZone: "America/Los_Angeles" },
    attendees: [{ email: "team@example.com" }],
    reminders: { useDefault: false, overrides: [{ method: "email", minutes: 24 * 60 }] }
  };

  const createResponse = await fetch(
    "https://www.googleapis.com/calendar/v3/calendars/primary/events",
    {
      method: "POST",
      headers: {
        Authorization: \`Bearer \${token}\`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newEvent)
    }
  );
  const created = await createResponse.json();

  return new Response(JSON.stringify({ events: events.items, created }), {
    headers: { "Content-Type": "application/json" }
  });
});`,
      notes: [
        "Scopes: calendar.readonly, calendar.events",
        "Use timeZone parameter for proper timezone handling",
        "Events can include attendees, reminders, and recurrence rules",
      ],
    },
    {
      name: "Gmail Integration",
      signature: "Gmail API Examples",
      description: "Send emails, read messages, and manage labels using the Gmail API.",
      parameters: [],
      returns: "N/A - Reference examples",
      example: `import Base44 from 'npm:@base44/sdk@0.8.6';

const base44 = Base44.createClientFromRequest;

Deno.serve(async (req) => {
  const client = base44(req);
  const token = await client.asServiceRole.connectors.getAccessToken("gmail");

  // Send an email
  const email = [
    'To: recipient@example.com',
    'Subject: Hello from Base44',
    'Content-Type: text/html; charset=utf-8',
    '',
    '<h1>Hello!</h1><p>This email was sent via Gmail API.</p>'
  ].join('\\r\\n');

  const encodedEmail = btoa(email).replace(/\\+/g, '-').replace(/\\//g, '_').replace(/=+$/, '');

  const sendResponse = await fetch(
    "https://www.googleapis.com/gmail/v1/users/me/messages/send",
    {
      method: "POST",
      headers: {
        Authorization: \`Bearer \${token}\`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ raw: encodedEmail })
    }
  );
  const sent = await sendResponse.json();

  // List recent messages
  const listResponse = await fetch(
    "https://www.googleapis.com/gmail/v1/users/me/messages?maxResults=10",
    { headers: { Authorization: \`Bearer \${token}\` } }
  );
  const messages = await listResponse.json();

  return new Response(JSON.stringify({ sent, messages: messages.messages }), {
    headers: { "Content-Type": "application/json" }
  });
});`,
      notes: [
        "Scopes: gmail.send, gmail.readonly, gmail.modify",
        "Email must be base64url encoded for sending",
        "Use gmail.modify scope to manage labels and mark as read/unread",
      ],
    },
    {
      name: "Google Sheets Integration",
      signature: "Google Sheets API Examples",
      description: "Read and write data to Google Sheets, create spreadsheets, and manage worksheets.",
      parameters: [],
      returns: "N/A - Reference examples",
      example: `import Base44 from 'npm:@base44/sdk@0.8.6';

const base44 = Base44.createClientFromRequest;

Deno.serve(async (req) => {
  const client = base44(req);
  const token = await client.asServiceRole.connectors.getAccessToken("googlesheets");

  const spreadsheetId = "your-spreadsheet-id";

  // Read data from a range
  const readResponse = await fetch(
    \`https://sheets.googleapis.com/v4/spreadsheets/\${spreadsheetId}/values/Sheet1!A1:D10\`,
    { headers: { Authorization: \`Bearer \${token}\` } }
  );
  const data = await readResponse.json();

  // Write data to a range
  const values = [
    ["Name", "Email", "Status", "Date"],
    ["John Doe", "john@example.com", "Active", new Date().toISOString()]
  ];

  const writeResponse = await fetch(
    \`https://sheets.googleapis.com/v4/spreadsheets/\${spreadsheetId}/values/Sheet1!A1:D2?valueInputOption=RAW\`,
    {
      method: "PUT",
      headers: {
        Authorization: \`Bearer \${token}\`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ values })
    }
  );
  const written = await writeResponse.json();

  // Append data
  const appendResponse = await fetch(
    \`https://sheets.googleapis.com/v4/spreadsheets/\${spreadsheetId}/values/Sheet1!A:D:append?valueInputOption=RAW\`,
    {
      method: "POST",
      headers: {
        Authorization: \`Bearer \${token}\`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ values: [["New", "Row", "Data", new Date().toISOString()]] })
    }
  );
  const appended = await appendResponse.json();

  return new Response(JSON.stringify({ data: data.values, written, appended }), {
    headers: { "Content-Type": "application/json" }
  });
});`,
      notes: [
        "Scopes: spreadsheets",
        "Use A1 notation for ranges (e.g., Sheet1!A1:D10)",
        "valueInputOption can be RAW or USER_ENTERED",
      ],
    },
    {
      name: "Slack Integration",
      signature: "Slack API Examples",
      description: "Post messages, read channels, and interact with Slack workspaces.",
      parameters: [],
      returns: "N/A - Reference examples",
      example: `import Base44 from 'npm:@base44/sdk@0.8.6';

const base44 = Base44.createClientFromRequest;

Deno.serve(async (req) => {
  const client = base44(req);
  const token = await client.asServiceRole.connectors.getAccessToken("slack");

  // Post a message to a channel
  const postResponse = await fetch(
    "https://slack.com/api/chat.postMessage",
    {
      method: "POST",
      headers: {
        Authorization: \`Bearer \${token}\`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        channel: "#general",
        text: "Hello from Base44!",
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "*Hello from Base44!*\\nThis is a rich message with formatting."
            }
          },
          {
            type: "actions",
            elements: [
              {
                type: "button",
                text: { type: "plain_text", text: "Click Me" },
                value: "button_click",
                action_id: "button_1"
              }
            ]
          }
        ]
      })
    }
  );
  const posted = await postResponse.json();

  // List channels
  const channelsResponse = await fetch(
    "https://slack.com/api/conversations.list",
    { headers: { Authorization: \`Bearer \${token}\` } }
  );
  const channels = await channelsResponse.json();

  // Get user info
  const userResponse = await fetch(
    "https://slack.com/api/users.info?user=U123456",
    { headers: { Authorization: \`Bearer \${token}\` } }
  );
  const user = await userResponse.json();

  return new Response(JSON.stringify({ posted, channels: channels.channels, user }), {
    headers: { "Content-Type": "application/json" }
  });
});`,
      notes: [
        "Scopes: users:read, channels:read, chat:write, files:read",
        "Uses user tokens (not bot tokens) - actions performed as connected user",
        "Supports rich message formatting with blocks",
      ],
    },
    {
      name: "Notion Integration",
      signature: "Notion API Examples",
      description: "Create pages, query databases, and manage Notion content.",
      parameters: [],
      returns: "N/A - Reference examples",
      example: `import Base44 from 'npm:@base44/sdk@0.8.6';

const base44 = Base44.createClientFromRequest;

Deno.serve(async (req) => {
  const client = base44(req);
  const token = await client.asServiceRole.connectors.getAccessToken("notion");

  const databaseId = "your-database-id";

  // Query a database
  const queryResponse = await fetch(
    \`https://api.notion.com/v1/databases/\${databaseId}/query\`,
    {
      method: "POST",
      headers: {
        Authorization: \`Bearer \${token}\`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        filter: {
          property: "Status",
          select: { equals: "In Progress" }
        },
        sorts: [{ property: "Created", direction: "descending" }]
      })
    }
  );
  const results = await queryResponse.json();

  // Create a new page in the database
  const createResponse = await fetch(
    "https://api.notion.com/v1/pages",
    {
      method: "POST",
      headers: {
        Authorization: \`Bearer \${token}\`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        parent: { database_id: databaseId },
        properties: {
          Name: { title: [{ text: { content: "New Task" } }] },
          Status: { select: { name: "To Do" } },
          Priority: { select: { name: "High" } }
        },
        children: [
          {
            object: "block",
            type: "paragraph",
            paragraph: {
              rich_text: [{ type: "text", text: { content: "Task description here" } }]
            }
          }
        ]
      })
    }
  );
  const created = await createResponse.json();

  return new Response(JSON.stringify({ results: results.results, created }), {
    headers: { "Content-Type": "application/json" }
  });
});`,
      notes: [
        "Scopes: read_content, update_content, insert_content",
        "Requires Notion-Version header (use 2022-06-28)",
        "Database properties must match the database schema",
      ],
    },
    {
      name: "Google Drive Integration",
      signature: "Google Drive API Examples",
      description: "Upload files, create folders, and manage Google Drive content. Note: drive.file scope limits access to files created by the app.",
      parameters: [],
      returns: "N/A - Reference examples",
      example: `import Base44 from 'npm:@base44/sdk@0.8.6';

const base44 = Base44.createClientFromRequest;

Deno.serve(async (req) => {
  const client = base44(req);
  const token = await client.asServiceRole.connectors.getAccessToken("googledrive");

  // Upload a file
  const fileContent = "Hello from Base44!";
  const metadata = {
    name: "example.txt",
    mimeType: "text/plain"
  };

  const form = new FormData();
  form.append("metadata", new Blob([JSON.stringify(metadata)], { type: "application/json" }));
  form.append("file", new Blob([fileContent], { type: "text/plain" }));

  const uploadResponse = await fetch(
    "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
    {
      method: "POST",
      headers: { Authorization: \`Bearer \${token}\` },
      body: form
    }
  );
  const uploaded = await uploadResponse.json();

  // List files created by the app
  const listResponse = await fetch(
    "https://www.googleapis.com/drive/v3/files?pageSize=10",
    { headers: { Authorization: \`Bearer \${token}\` } }
  );
  const files = await listResponse.json();

  // Create a folder
  const folderMetadata = {
    name: "My Folder",
    mimeType: "application/vnd.google-apps.folder"
  };

  const folderResponse = await fetch(
    "https://www.googleapis.com/drive/v3/files",
    {
      method: "POST",
      headers: {
        Authorization: \`Bearer \${token}\`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(folderMetadata)
    }
  );
  const folder = await folderResponse.json();

  return new Response(JSON.stringify({ uploaded, files: files.files, folder }), {
    headers: { "Content-Type": "application/json" }
  });
});`,
      notes: [
        "Scopes: drive.file (limited to app-created files only)",
        "Cannot access user's existing files - only files created or opened by the app",
        "Use multipart upload for files with metadata",
      ],
    },
    {
      name: "Google Docs Integration",
      signature: "Google Docs API Examples",
      description: "Create and edit Google Docs programmatically with rich text formatting.",
      parameters: [],
      returns: "N/A - Reference examples",
      example: `import Base44 from 'npm:@base44/sdk@0.8.6';

const base44 = Base44.createClientFromRequest;

Deno.serve(async (req) => {
  const client = base44(req);
  const token = await client.asServiceRole.connectors.getAccessToken("googledocs");

  // Create a new document
  const createResponse = await fetch(
    "https://docs.googleapis.com/v1/documents",
    {
      method: "POST",
      headers: {
        Authorization: \`Bearer \${token}\`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ title: "My Document" })
    }
  );
  const doc = await createResponse.json();

  // Insert text into the document
  const requests = [
    {
      insertText: {
        location: { index: 1 },
        text: "Hello from Base44!\\n\\nThis is a new paragraph."
      }
    },
    {
      updateTextStyle: {
        range: { startIndex: 1, endIndex: 19 },
        textStyle: { bold: true, fontSize: { magnitude: 14, unit: "PT" } },
        fields: "bold,fontSize"
      }
    }
  ];

  const updateResponse = await fetch(
    \`https://docs.googleapis.com/v1/documents/\${doc.documentId}:batchUpdate\`,
    {
      method: "POST",
      headers: {
        Authorization: \`Bearer \${token}\`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ requests })
    }
  );
  const updated = await updateResponse.json();

  return new Response(JSON.stringify({ doc, updated }), {
    headers: { "Content-Type": "application/json" }
  });
});`,
      notes: [
        "Scopes: documents",
        "Use batchUpdate for multiple operations in one request",
        "Index 1 is the start of the document body",
      ],
    },
    {
      name: "Salesforce Integration",
      signature: "Salesforce API Examples",
      description: "Query and manage Salesforce CRM data including accounts, contacts, and opportunities.",
      parameters: [],
      returns: "N/A - Reference examples",
      example: `import Base44 from 'npm:@base44/sdk@0.8.6';

const base44 = Base44.createClientFromRequest;

Deno.serve(async (req) => {
  const client = base44(req);
  const token = await client.asServiceRole.connectors.getAccessToken("salesforce");

  // Get Salesforce instance URL (needed for API calls)
  const instanceUrl = "https://your-instance.salesforce.com"; // Get from OAuth response

  // Query contacts using SOQL
  const query = "SELECT Id, Name, Email, Phone FROM Contact LIMIT 10";
  const queryResponse = await fetch(
    \`\${instanceUrl}/services/data/v58.0/query?q=\${encodeURIComponent(query)}\`,
    { headers: { Authorization: \`Bearer \${token}\` } }
  );
  const contacts = await queryResponse.json();

  // Create a new contact
  const newContact = {
    FirstName: "John",
    LastName: "Doe",
    Email: "john.doe@example.com",
    Phone: "+1234567890"
  };

  const createResponse = await fetch(
    \`\${instanceUrl}/services/data/v58.0/sobjects/Contact\`,
    {
      method: "POST",
      headers: {
        Authorization: \`Bearer \${token}\`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newContact)
    }
  );
  const created = await createResponse.json();

  // Update a contact
  const updateResponse = await fetch(
    \`\${instanceUrl}/services/data/v58.0/sobjects/Contact/\${created.id}\`,
    {
      method: "PATCH",
      headers: {
        Authorization: \`Bearer \${token}\`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ Phone: "+9876543210" })
    }
  );

  return new Response(JSON.stringify({ contacts: contacts.records, created }), {
    headers: { "Content-Type": "application/json" }
  });
});`,
      notes: [
        "Scopes: api, refresh_token",
        "Requires instance URL from OAuth response",
        "Use SOQL (Salesforce Object Query Language) for queries",
      ],
    },
    {
      name: "HubSpot Integration",
      signature: "HubSpot API Examples",
      description: "Manage HubSpot CRM contacts, companies, and deals programmatically.",
      parameters: [],
      returns: "N/A - Reference examples",
      example: `import Base44 from 'npm:@base44/sdk@0.8.6';

const base44 = Base44.createClientFromRequest;

Deno.serve(async (req) => {
  const client = base44(req);
  const token = await client.asServiceRole.connectors.getAccessToken("hubspot");

  // List contacts
  const listResponse = await fetch(
    "https://api.hubapi.com/crm/v3/objects/contacts?limit=10",
    { headers: { Authorization: \`Bearer \${token}\` } }
  );
  const contacts = await listResponse.json();

  // Create a new contact
  const newContact = {
    properties: {
      email: "contact@example.com",
      firstname: "Jane",
      lastname: "Smith",
      phone: "+1234567890",
      company: "Example Corp"
    }
  };

  const createResponse = await fetch(
    "https://api.hubapi.com/crm/v3/objects/contacts",
    {
      method: "POST",
      headers: {
        Authorization: \`Bearer \${token}\`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newContact)
    }
  );
  const created = await createResponse.json();

  // Update a contact
  const updateResponse = await fetch(
    \`https://api.hubapi.com/crm/v3/objects/contacts/\${created.id}\`,
    {
      method: "PATCH",
      headers: {
        Authorization: \`Bearer \${token}\`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        properties: { phone: "+9876543210" }
      })
    }
  );
  const updated = await updateResponse.json();

  // Search contacts
  const searchResponse = await fetch(
    "https://api.hubapi.com/crm/v3/objects/contacts/search",
    {
      method: "POST",
      headers: {
        Authorization: \`Bearer \${token}\`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        filterGroups: [{
          filters: [{
            propertyName: "email",
            operator: "EQ",
            value: "contact@example.com"
          }]
        }]
      })
    }
  );
  const searchResults = await searchResponse.json();

  return new Response(JSON.stringify({ contacts: contacts.results, created, updated, searchResults }), {
    headers: { "Content-Type": "application/json" }
  });
});`,
      notes: [
        "Scopes: crm.objects.contacts.read, crm.objects.contacts.write",
        "Use v3 API for modern features",
        "Properties are nested under 'properties' object",
      ],
    },
    {
      name: "LinkedIn Integration",
      signature: "LinkedIn API Examples",
      description: "Access LinkedIn profile data and post updates to LinkedIn.",
      parameters: [],
      returns: "N/A - Reference examples",
      example: `import Base44 from 'npm:@base44/sdk@0.8.6';

const base44 = Base44.createClientFromRequest;

Deno.serve(async (req) => {
  const client = base44(req);
  const token = await client.asServiceRole.connectors.getAccessToken("linkedin");

  // Get user profile
  const profileResponse = await fetch(
    "https://api.linkedin.com/v2/me",
    { headers: { Authorization: \`Bearer \${token}\` } }
  );
  const profile = await profileResponse.json();

  // Get email address
  const emailResponse = await fetch(
    "https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))",
    { headers: { Authorization: \`Bearer \${token}\` } }
  );
  const email = await emailResponse.json();

  // Share a post (requires w_member_social scope)
  const post = {
    author: \`urn:li:person:\${profile.id}\`,
    lifecycleState: "PUBLISHED",
    specificContent: {
      "com.linkedin.ugc.ShareContent": {
        shareCommentary: {
          text: "Excited to share this update! #Base44"
        },
        shareMediaCategory: "NONE"
      }
    },
    visibility: {
      "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"
    }
  };

  const shareResponse = await fetch(
    "https://api.linkedin.com/v2/ugcPosts",
    {
      method: "POST",
      headers: {
        Authorization: \`Bearer \${token}\`,
        "Content-Type": "application/json",
        "X-Restli-Protocol-Version": "2.0.0"
      },
      body: JSON.stringify(post)
    }
  );
  const shared = await shareResponse.json();

  return new Response(JSON.stringify({ profile, email, shared }), {
    headers: { "Content-Type": "application/json" }
  });
});`,
      notes: [
        "Scopes: r_liteprofile, r_emailaddress, w_member_social",
        "Requires X-Restli-Protocol-Version header for some endpoints",
        "Profile ID format: urn:li:person:{id}",
      ],
    },
    {
      name: "TikTok Integration",
      signature: "TikTok API Examples",
      description: "Fetch TikTok user information and video lists. Read-only integration.",
      parameters: [],
      returns: "N/A - Reference examples",
      example: `import Base44 from 'npm:@base44/sdk@0.8.6';

const base44 = Base44.createClientFromRequest;

Deno.serve(async (req) => {
  const client = base44(req);
  const token = await client.asServiceRole.connectors.getAccessToken("tiktok");

  // Get user info
  const userResponse = await fetch(
    "https://open.tiktokapis.com/v2/user/info/?fields=open_id,union_id,avatar_url,display_name",
    { headers: { Authorization: \`Bearer \${token}\` } }
  );
  const user = await userResponse.json();

  // List user's videos
  const videosResponse = await fetch(
    "https://open.tiktokapis.com/v2/video/list/?fields=id,title,video_description,duration,cover_image_url,create_time",
    {
      method: "POST",
      headers: {
        Authorization: \`Bearer \${token}\`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        max_count: 20
      })
    }
  );
  const videos = await videosResponse.json();

  return new Response(JSON.stringify({ user: user.data, videos: videos.data }), {
    headers: { "Content-Type": "application/json" }
  });
});`,
      notes: [
        "Scopes: user.info.basic, video.list",
        "Read-only integration - cannot post videos or comments",
        "Use v2 API endpoints",
      ],
    },
    {
      name: "Error Handling & Retry Patterns",
      signature: "Best Practices for Connector Error Handling",
      description: "Handle OAuth token errors, rate limits, and implement retry logic for connector integrations.",
      parameters: [],
      returns: "N/A - Best practice patterns",
      example: `import Base44 from 'npm:@base44/sdk@0.8.6';

const base44 = Base44.createClientFromRequest;

// Retry helper with exponential backoff
async function fetchWithRetry(url: string, options: RequestInit, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);
      
      // Handle rate limiting
      if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After');
        const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : Math.pow(2, i) * 1000;
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }
      
      // Handle token expiration (tokens auto-refresh, but handle edge cases)
      if (response.status === 401) {
        throw new Error('Authentication failed - token may be invalid');
      }
      
      if (!response.ok) {
        throw new Error(\`HTTP \${response.status}: \${await response.text()}\`);
      }
      
      return response;
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
    }
  }
  throw new Error('Max retries exceeded');
}

Deno.serve(async (req) => {
  const client = base44(req);
  
  try {
    const token = await client.asServiceRole.connectors.getAccessToken("googlecalendar");
    
    const response = await fetchWithRetry(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events",
      {
        headers: {
          Authorization: \`Bearer \${token}\`,
          "Content-Type": "application/json"
        }
      }
    );
    
    const data = await response.json();
    
    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error('Connector error:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to fetch data',
        message: error.message
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
});`,
      notes: [
        "Always implement retry logic with exponential backoff",
        "Handle 429 (rate limit) and 401 (auth) status codes",
        "Respect Retry-After headers from APIs",
        "Log errors for debugging but don't expose sensitive data",
      ],
    },
    {
      name: "Supported Services",
      signature: "Supported OAuth Services",
      description: "Reference of all supported OAuth integration types and their scopes. This is not a callable method but a documentation reference for available services.",
      parameters: [],
      returns: "N/A - Reference only",
      example: `// Available integration types:
// "googlecalendar" - Google Calendar (scopes: calendar.readonly, calendar.events)
// "googledrive"    - Google Drive (scopes: drive.file)
// "gmail"          - Gmail (scopes: gmail.send, gmail.readonly, gmail.modify)
// "googlesheets"   - Google Sheets (scopes: spreadsheets)
// "googledocs"     - Google Docs (scopes: documents)
// "slack"          - Slack (scopes: users:read, channels:read, chat:write, files:read)
// "notion"         - Notion (scopes: read_content, update_content, insert_content)
// "salesforce"     - Salesforce (scopes: api, refresh_token)
// "hubspot"        - HubSpot (scopes: crm.objects.contacts.read, crm.objects.contacts.write)
// "linkedin"       - LinkedIn (scopes: r_liteprofile, r_emailaddress, w_member_social)
// "tiktok"         - TikTok (scopes: user.info.basic, video.list)`,
      notes: [
        "Google Drive only supports the drive.file scope, which limits access to files created or opened by the app",
        "TikTok integration is read-only - you can fetch user info and video lists but cannot post",
        "Slack uses user tokens (not bot tokens), so actions are performed as the connected user",
        "LinkedIn supported scopes: r_liteprofile, r_emailaddress, w_member_social",
        "All tokens are automatically refreshed when expired - no manual refresh handling needed",
      ],
    },
  ],
  notes: [
    "App connectors connect the app builder's account, not individual users' accounts",
    "OAuth tokens can only be accessed in backend functions using base44.asServiceRole.connectors.getAccessToken()",
    "Never expose tokens in frontend code",
    "Supported services: Google Calendar, Google Drive, Gmail, Google Sheets, Google Docs, Slack, Notion, Salesforce, HubSpot, LinkedIn, TikTok",
  ],
};

export const connectorsDocs: DocTopic = {
  ...connectorsDocsData,
  markdown: renderMarkdown(connectorsDocsData as DocTopic),
};
