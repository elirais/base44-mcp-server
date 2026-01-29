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
import { base44 } from '@/api/base44Client';

export default async function handler(req, res) {
  // Get the OAuth token for Google Calendar
  const token = await base44.asServiceRole.connectors.getAccessToken("googlecalendar");

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
  return data.items;
}`,
      notes: [
        "Must be called from backend functions only",
        "Uses the app builder's connected account, not individual users",
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
