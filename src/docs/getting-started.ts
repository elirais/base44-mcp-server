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

const gettingStartedDocsData: Omit<DocTopic, "markdown"> = {
  topic: "getting-started",
  title: "Getting Started",
  namespace: "base44",
  methods: [
    {
      name: "Import the SDK",
      signature: `import { base44 } from '@/api/base44Client'`,
      description: "The Base44 SDK is pre-initialized and available in your application",
      parameters: [],
      returns: "Base44 client instance",
      example: `import { base44 } from '@/api/base44Client';`,
      notes: [],
    },
    {
      name: "Define Entities",
      signature: "Entity JSON Schema",
      description: "Entities are your data models. Define them as JSON schemas in the entities/ folder.",
      parameters: [],
      returns: "N/A",
      example: `// entities/Todo.json
{
  "title": {
    "type": "string",
    "description": "The title of the todo item"
  },
  "completed": {
    "type": "boolean",
    "description": "Whether the todo is completed",
    "default": false
  },
  "priority": {
    "type": "string",
    "enum": ["low", "medium", "high"],
    "description": "Priority level of the todo"
  }
}`,
      notes: [
        "Built-in fields: id, created_date, updated_date, created_by",
      ],
    },
    {
      name: "Use the SDK",
      signature: "SDK Usage in React Components",
      description: "Use the SDK with React Query for data fetching in pages and components",
      parameters: [],
      returns: "N/A",
      example: `import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

export default function TodoPage() {
  const queryClient = useQueryClient();

  // Fetch current user
  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me()
  });

  // Fetch todos
  const { data: todos, isLoading } = useQuery({
    queryKey: ['todos'],
    queryFn: () => base44.entities.Todo.list()
  });

  // Create a new todo
  const createTodo = useMutation({
    mutationFn: (data) => base44.entities.Todo.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos'] })
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Welcome, {user?.full_name}</h1>
      <button onClick={() => createTodo.mutate({
        title: 'New Todo',
        priority: 'medium',
        completed: false
      })}>
        Add Todo
      </button>
      <ul>
        {todos?.map(todo => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>
    </div>
  );
}`,
      notes: [],
    },
  ],
  notes: [
    "Authentication is handled by the platform - no need to implement login pages",
    "Use @tanstack/react-query for data fetching and state management",
    "All UI components from shadcn/ui are pre-installed",
    "Entity names are PascalCase",
  ],
};

export const gettingStartedDocs: DocTopic = {
  ...gettingStartedDocsData,
  markdown: renderMarkdown(gettingStartedDocsData as DocTopic),
};
