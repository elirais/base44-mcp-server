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

const entitiesDocsData: Omit<DocTopic, "markdown"> = {
  topic: "entities",
  title: "Entity CRUD Operations",
  namespace: "base44.entities.EntityName",
  methods: [
    {
      name: "list",
      signature: "list(sort?: string, limit?: number, skip?: number, fields?: string[]): Promise<Array>",
      description: "Retrieves all records with optional sorting, limiting, pagination, and field selection",
      parameters: [
        {
          name: "sort",
          type: "string",
          optional: true,
          description: "Sort field, prefix '-' for descending",
        },
        {
          name: "limit",
          type: "number",
          optional: true,
          description: "Maximum records to return (max 5,000)",
        },
        {
          name: "skip",
          type: "number",
          optional: true,
          description: "Number of records to skip for pagination",
        },
        {
          name: "fields",
          type: "string[]",
          optional: true,
          description: "Array of field names to return (field selection)",
        },
      ],
      returns: "Promise<Array> - Array of entity records",
      example: `import { base44 } from '@/api/base44Client';

// Get all todos
const todos = await base44.entities.Todo.list();

// Get 10 most recent todos
const recentTodos = await base44.entities.Todo.list('-created_date', 10);

// Pagination - skip first 20, get next 10
const page3 = await base44.entities.Todo.list('-created_date', 10, 20);

// Field selection - only get specific fields
const titles = await base44.entities.Todo.list(undefined, 100, 0, ['title', 'status']);

// Combined: sorted, limited, paginated, with field selection
const results = await base44.entities.Todo.list('-priority', 50, 100, ['title', 'priority', 'due_date']);`,
      notes: [
        "Maximum 5,000 items per request",
        "Use skip parameter for offset-based pagination",
        "Use fields parameter to reduce payload size",
      ],
    },
    {
      name: "filter",
      signature: "filter(query: object, sort?: string, limit?: number, skip?: number, fields?: string[]): Promise<Array>",
      description: "Retrieves records matching specific criteria with optional sorting, limiting, pagination, and field selection",
      parameters: [
        {
          name: "query",
          type: "object",
          optional: false,
          description: "Filter criteria (e.g. {status: 'active'})",
        },
        {
          name: "sort",
          type: "string",
          optional: true,
          description: "Sort field with optional '-' prefix for descending",
        },
        {
          name: "limit",
          type: "number",
          optional: true,
          description: "Maximum records to return (max 5,000)",
        },
        {
          name: "skip",
          type: "number",
          optional: true,
          description: "Number of records to skip for pagination",
        },
        {
          name: "fields",
          type: "string[]",
          optional: true,
          description: "Array of field names to return (field selection)",
        },
      ],
      returns: "Promise<Array> - Array of matching entity records",
      example: `import { base44 } from '@/api/base44Client';

// Filter by status
const activeTodos = await base44.entities.Todo.filter({ status: 'active' });

// Filter with multiple conditions
const myHighPriority = await base44.entities.Todo.filter({
  created_by: user.email,
  priority: 'high'
}, '-created_date', 5);

// Using comparison operators
const recentItems = await base44.entities.Todo.filter({
  created_date: { $gte: '2024-01-01' }
});

// Pagination with filter
const page2 = await base44.entities.Todo.filter(
  { status: 'active' },
  '-created_date',
  20,
  20  // skip first 20
);

// Field selection with filter
const summaries = await base44.entities.Todo.filter(
  { status: 'active' },
  undefined,
  100,
  0,
  ['title', 'status', 'priority']  // only these fields
);`,
      notes: [
        "Maximum 5,000 items per request",
        "Use skip parameter for offset-based pagination",
        "Use fields parameter to reduce payload size",
      ],
    },
    {
      name: "create",
      signature: "create(data: object): Promise<Object>",
      description: "Creates a new entity record",
      parameters: [
        {
          name: "data",
          type: "object",
          optional: false,
          description: "The entity data to create",
        },
      ],
      returns: "Promise<Object> - The created entity with id and metadata",
      example: `import { base44 } from '@/api/base44Client';

const newTodo = await base44.entities.Todo.create({
  title: "Learn Base44 SDK",
  description: "Read the documentation",
  priority: "high",
  completed: false
});

console.log(newTodo.id); // Auto-generated ID`,
      notes: [],
    },
    {
      name: "bulkCreate",
      signature: "bulkCreate(dataArray: Array<object>): Promise<Array>",
      description: "Creates multiple entity records at once",
      parameters: [
        {
          name: "dataArray",
          type: "Array<object>",
          optional: false,
          description: "Array of entity data objects to create",
        },
      ],
      returns: "Promise<Array> - Array of created entities",
      example: `import { base44 } from '@/api/base44Client';

const todos = await base44.entities.Todo.bulkCreate([
  { title: "Task 1", priority: "high" },
  { title: "Task 2", priority: "medium" },
  { title: "Task 3", priority: "low" }
]);`,
      notes: [],
    },
    {
      name: "update",
      signature: "update(id: string, data: object): Promise<Object>",
      description: "Updates an existing entity record by ID",
      parameters: [
        {
          name: "id",
          type: "string",
          optional: false,
          description: "The entity ID to update",
        },
        {
          name: "data",
          type: "object",
          optional: false,
          description: "The fields to update",
        },
      ],
      returns: "Promise<Object> - The updated entity",
      example: `import { base44 } from '@/api/base44Client';

const updated = await base44.entities.Todo.update(todo.id, {
  completed: true,
  completedAt: new Date().toISOString()
});`,
      notes: [],
    },
    {
      name: "delete",
      signature: "delete(id: string): Promise<void>",
      description: "Deletes an entity record by ID",
      parameters: [
        {
          name: "id",
          type: "string",
          optional: false,
          description: "The entity ID to delete",
        },
      ],
      returns: "Promise<void>",
      example: `import { base44 } from '@/api/base44Client';

await base44.entities.Todo.delete(todo.id);`,
      notes: [],
    },
    {
      name: "deleteMany",
      signature: "deleteMany(query: object): Promise<{ deletedCount: number }>",
      description: "Bulk delete records matching a filter query",
      parameters: [
        {
          name: "query",
          type: "object",
          optional: false,
          description: "Filter criteria to match records for deletion",
        },
      ],
      returns: "Promise<{ deletedCount: number }> - Number of records deleted",
      example: `import { base44 } from '@/api/base44Client';

// Delete all completed todos
const result = await base44.entities.Todo.deleteMany({
  completed: true
});
console.log(\`Deleted \${result.deletedCount} todos\`);

// Delete old records
await base44.entities.Log.deleteMany({
  created_date: { $lt: '2024-01-01' }
});

// Delete by multiple conditions
await base44.entities.Task.deleteMany({
  status: 'archived',
  created_by: user.email
});`,
      notes: [
        "Use with caution - this permanently deletes multiple records",
        "Returns the count of deleted records",
        "Maximum 5,000 records can be deleted per request",
      ],
    },
    {
      name: "importEntities",
      signature: "importEntities(data: Array<object>): Promise<{ imported: number, failed: number }>",
      description: "Import multiple records from external data sources",
      parameters: [
        {
          name: "data",
          type: "Array<object>",
          optional: false,
          description: "Array of entity data objects to import",
        },
      ],
      returns: "Promise<{ imported: number, failed: number }> - Import statistics",
      example: `import { base44 } from '@/api/base44Client';

// Import from CSV or external API
const externalData = [
  { title: "Task 1", priority: "high", source: "import" },
  { title: "Task 2", priority: "medium", source: "import" },
  { title: "Task 3", priority: "low", source: "import" }
];

const result = await base44.entities.Todo.importEntities(externalData);
console.log(\`Imported: \${result.imported}, Failed: \${result.failed}\`);

// Import with validation
const csvData = await parseCsvFile(file);
const importResult = await base44.entities.Product.importEntities(
  csvData.map(row => ({
    name: row.name,
    price: parseFloat(row.price),
    category: row.category,
    imported_at: new Date().toISOString()
  }))
);`,
      notes: [
        "Maximum 5,000 records per import request",
        "Failed records are skipped, successful ones are imported",
        "Returns statistics about import success/failure",
        "Useful for data migration and bulk imports",
      ],
    },
    {
      name: "schema",
      signature: "schema(): Promise<Object>",
      description: "Returns the JSON schema of the entity (without built-in fields)",
      parameters: [],
      returns: "Promise<Object> - The entity JSON schema",
      example: `import { base44 } from '@/api/base44Client';

const schema = await base44.entities.Todo.schema();
// Useful for dynamic forms with JsonSchemaForm component`,
      notes: [],
    },
    {
      name: "subscribe",
      signature: "subscribe(callback: function): Function",
      description: "Subscribe to real-time changes on an entity type",
      parameters: [
        {
          name: "callback",
          type: "function",
          optional: false,
          description: "Function called on each change event with {type, id, data}",
        },
      ],
      returns: "Function - Unsubscribe function to stop listening",
      example: `import { base44 } from '@/api/base44Client';

const unsubscribe = base44.entities.Todo.subscribe((event) => {
  console.log(event.type); // 'create', 'update', or 'delete'
  console.log(event.id);
  console.log(event.data);
});

// Cleanup
unsubscribe();`,
      notes: [
        "Event types: 'create', 'update', 'delete'",
        "Returns an unsubscribe function for cleanup",
      ],
    },
    {
      name: "Advanced Filtering",
      signature: "filter(query: object): Promise<Array>",
      description: "Use comparison operators for advanced queries",
      parameters: [
        {
          name: "query",
          type: "object",
          optional: false,
          description: "Query with comparison operators",
        },
      ],
      returns: "Promise<Array> - Filtered results",
      example: `import { base44 } from '@/api/base44Client';

// Greater than / Less than
const expensive = await base44.entities.Product.filter({
  price: { $gte: 100 }
});

const recent = await base44.entities.Order.filter({
  created_date: { $gte: '2024-01-01' }
});

// In / Not in
const categories = await base44.entities.Product.filter({
  category: { $in: ['electronics', 'computers'] }
});

const notDraft = await base44.entities.Post.filter({
  status: { $nin: ['draft', 'archived'] }
});

// Regex pattern matching
const searchResults = await base44.entities.User.filter({
  email: { $regex: '@gmail.com$' }
});

// Multiple conditions (AND)
const filtered = await base44.entities.Task.filter({
  status: 'active',
  priority: { $in: ['high', 'urgent'] },
  created_date: { $gte: '2024-01-01' }
});`,
      notes: [
        "Operators: $gt, $gte, $lt, $lte, $in, $nin, $regex",
        "Multiple conditions are combined with AND logic",
        "Use $regex for pattern matching (case-sensitive)",
      ],
    },
    {
      name: "Pagination",
      signature: "Pagination Patterns",
      description: "Efficiently paginate through large datasets",
      parameters: [],
      returns: "N/A - Pattern examples",
      example: `import { base44 } from '@/api/base44Client';

// Basic pagination
const page1 = await base44.entities.Product.list('-created_date', 20);
const page2 = await base44.entities.Product.filter(
  { created_date: { $lt: page1[page1.length - 1].created_date } },
  '-created_date',
  20
);

// Cursor-based pagination helper
async function paginateEntities(entityName, pageSize = 20) {
  let allItems = [];
  let lastItem = null;
  
  while (true) {
    const query = lastItem
      ? { created_date: { $lt: lastItem.created_date } }
      : {};
    
    const items = await base44.entities[entityName].filter(
      query,
      '-created_date',
      pageSize
    );
    
    if (items.length === 0) break;
    
    allItems = allItems.concat(items);
    lastItem = items[items.length - 1];
    
    if (items.length < pageSize) break;
  }
  
  return allItems;
}

// Usage
const allProducts = await paginateEntities('Product', 50);`,
      notes: [
        "Use cursor-based pagination for large datasets",
        "Sort by created_date for consistent pagination",
        "Limit page size to avoid performance issues",
      ],
    },
    {
      name: "Error Handling",
      signature: "Handling Entity Operation Errors",
      description: "Properly handle errors in entity operations",
      parameters: [],
      returns: "N/A - Pattern examples",
      example: `import { base44 } from '@/api/base44Client';

// Handle validation errors
try {
  await base44.entities.User.create({
    email: 'invalid-email', // Will fail validation
    name: 'John Doe'
  });
} catch (error) {
  if (error.message.includes('validation')) {
    console.error('Validation failed:', error.message);
    // Show user-friendly error
  }
}

// Handle not found
try {
  const items = await base44.entities.Todo.filter({ id: 'nonexistent' });
  if (items.length === 0) {
    throw new Error('Todo not found');
  }
} catch (error) {
  console.error('Error:', error.message);
}

// Handle permission errors
try {
  await base44.entities.User.list(); // May fail if not admin
} catch (error) {
  if (error.message.includes('permission') || error.message.includes('403')) {
    console.error('Access denied');
  }
}

// Retry pattern for transient errors
async function retryOperation(operation, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
    }
  }
}

// Usage
const result = await retryOperation(() =>
  base44.entities.Order.create({ total: 99.99 })
);`,
      notes: [
        "Always wrap entity operations in try-catch",
        "Check for specific error types (validation, permission, not found)",
        "Implement retry logic for transient failures",
        "Provide user-friendly error messages",
      ],
    },
  ],
  notes: [
    "Entity names are PascalCase (e.g., Todo, UserProfile)",
    "Built-in fields: id, created_date, updated_date, created_by",
    "Every entity automatically includes built-in fields - do not define them in your schema",
    "Use comparison operators for advanced filtering",
    "Always handle errors in entity operations",
  ],
};

export const entitiesDocs: DocTopic = {
  ...entitiesDocsData,
  markdown: renderMarkdown(entitiesDocsData as DocTopic),
};
