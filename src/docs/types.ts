export interface DocParameter {
  name: string;
  type: string;
  optional: boolean;
  description: string;
}

export interface DocMethod {
  name: string;
  signature: string;
  description: string;
  parameters: DocParameter[];
  returns: string;
  example: string;
  notes: string[];
}

export interface DocTopic {
  topic: string;
  title: string;
  namespace: string;
  methods: DocMethod[];
  notes: string[];
  markdown: string;
}

export const ALL_TOPICS = [
  "entities", "auth", "integrations", "connectors",
  "functions", "analytics", "app-logs", "best-practices",
  "project-structure", "getting-started",
] as const;

export type TopicName = (typeof ALL_TOPICS)[number];
