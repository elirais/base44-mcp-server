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

const projectStructureDocsData: Omit<DocTopic, "markdown"> = {
  topic: "project-structure",
  title: "Project Structure",
  namespace: "N/A",
  methods: [
    {
      name: "File Organization",
      signature: "Project Directory Layout",
      description: "Base44 project file structure rules",
      parameters: [],
      returns: "N/A",
      example: `your-app/
├── entities/          # JSON schema files
│   ├── User.json      # Built-in user entity
│   └── Todo.json      # Custom entities
├── pages/             # React page components (FLAT, no subfolders)
│   ├── Home.js
│   └── Settings.js
├── components/        # Reusable components (can have subfolders)
│   ├── Header.js
│   └── dashboard/
│       └── Chart.js
├── functions/         # Backend Deno functions
│   └── myApi.js
├── Layout.js          # App layout wrapper
└── globals.css        # Global styles`,
      notes: [
        "Pages must be flat - no subfolders",
        "Components can have subfolders",
      ],
    },
    {
      name: "Pre-installed Packages",
      signature: "Available npm packages",
      description: "These packages are pre-installed and available in all Base44 projects",
      parameters: [],
      returns: "N/A",
      example: `// The following packages are pre-installed and ready to use:
// - React
// - Tailwind CSS
// - shadcn/ui
// - lucide-react
// - moment
// - recharts
// - react-quill
// - react-hook-form
// - react-router-dom
// - date-fns
// - lodash
// - react-markdown
// - framer-motion
// - three.js
// - react-leaflet
// - @hello-pangea/dnd
// - @tanstack/react-query`,
      notes: [
        "No need to install these - they're pre-configured",
        "Use @tanstack/react-query for data fetching",
      ],
    },
  ],
  notes: [
    "Pages must be flat (no subfolders) - use pages/MyPage.js, not pages/folder/MyPage.js",
    "Components can have subfolders for organization",
    "The User entity is built-in with id, full_name, email, and role fields",
    "All UI components from shadcn/ui are pre-installed",
  ],
};

export const projectStructureDocs: DocTopic = {
  ...projectStructureDocsData,
  markdown: renderMarkdown(projectStructureDocsData as DocTopic),
};
