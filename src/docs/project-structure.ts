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
    {
      name: "Environment Variables",
      signature: "Environment Configuration",
      description: "How to use environment variables and configuration in Base44 projects",
      parameters: [],
      returns: "N/A",
      example: `// Access environment variables in frontend code
import { appParams } from '@/lib/app-params';

// Available environment variables:
console.log(appParams.appId);        // Your Base44 app ID
console.log(appParams.apiUrl);       // Base44 API endpoint
console.log(appParams.environment);  // 'development' or 'production'

// In backend functions (Deno):
const apiKey = Deno.env.get('MY_API_KEY');
const dbUrl = Deno.env.get('DATABASE_URL');

// Set environment variables in Base44 dashboard:
// Settings > Environment Variables > Add Variable`,
      notes: [
        "Frontend: Use appParams from @/lib/app-params",
        "Backend: Use Deno.env.get() in functions",
        "Never commit sensitive keys to git",
        "Set production variables in Base44 dashboard",
      ],
    },
    {
      name: "Routing Patterns",
      signature: "React Router Configuration",
      description: "How routing works in Base44 projects with React Router",
      parameters: [],
      returns: "N/A",
      example: `// Routes are automatically generated from pages/ directory
// pages/Home.js → /
// pages/About.js → /about
// pages/UserProfile.js → /user-profile

// Dynamic routes with parameters:
import { useParams } from 'react-router-dom';

function ProductDetail() {
  const { id } = useParams(); // Get route parameter
  
  return <div>Product ID: {id}</div>;
}

// Navigation:
import { Link, useNavigate } from 'react-router-dom';

function MyComponent() {
  const navigate = useNavigate();
  
  return (
    <>
      <Link to="/about">About</Link>
      <button onClick={() => navigate('/products/123')}>
        View Product
      </button>
    </>
  );
}`,
      notes: [
        "Pages are auto-routed based on filename",
        "Use kebab-case for URLs (UserProfile.js → /user-profile)",
        "Dynamic routes use :param syntax in route config",
        "Use useNavigate() for programmatic navigation",
      ],
    },
    {
      name: "Asset Management",
      signature: "Static Assets and Media",
      description: "How to handle images, fonts, and other static assets in Base44 projects",
      parameters: [],
      returns: "N/A",
      example: `// Option 1: Use UploadFile for user-uploaded content
import { base44 } from '@/api/base44Client';

const { file_url } = await base44.integrations.Core.UploadFile({
  file: userImage
});
// Store file_url in entity: "https://storage.base44.com/uploads/abc123.png"

// Option 2: Use public/ directory for static assets
// Place files in public/ folder, reference with absolute paths:
<img src="/logo.png" alt="Logo" />
<link rel="stylesheet" href="/custom-fonts.css" />

// Option 3: Import assets in components (bundled)
import logoImage from './assets/logo.png';
<img src={logoImage} alt="Logo" />

// Best practices:
// - User uploads → UploadFile (dynamic, stored in cloud)
// - App assets (logo, icons) → public/ folder
// - Component-specific assets → import in component`,
      notes: [
        "User uploads: Use UploadFile integration",
        "Static assets: Use public/ folder",
        "Component assets: Import directly",
        "Uploaded files are automatically CDN-optimized",
      ],
    },
  ],
  notes: [
    "Pages must be flat (no subfolders) - use pages/MyPage.js, not pages/folder/MyPage.js",
    "Components can have subfolders for organization",
    "The User entity is built-in with id, full_name, email, and role fields",
    "All UI components from shadcn/ui are pre-installed",
    "Routes are auto-generated from page filenames",
    "Use UploadFile for user-uploaded content, public/ for static assets",
  ],
};

export const projectStructureDocs: DocTopic = {
  ...projectStructureDocsData,
  markdown: renderMarkdown(projectStructureDocsData as DocTopic),
};
