import { DocTopic, TopicName } from "./types.js";
import { entitiesDocs } from "./entities.js";
import { authDocs } from "./auth.js";
import { integrationsDocs } from "./integrations.js";
import { connectorsDocs } from "./connectors.js";
import { functionsDocs } from "./functions.js";
import { analyticsDocs } from "./analytics.js";
import { bestPracticesDocs } from "./best-practices.js";
import { projectStructureDocs } from "./project-structure.js";
import { gettingStartedDocs } from "./getting-started.js";

export const allDocs: DocTopic[] = [
  entitiesDocs,
  authDocs,
  integrationsDocs,
  connectorsDocs,
  functionsDocs,
  analyticsDocs,
  bestPracticesDocs,
  projectStructureDocs,
  gettingStartedDocs,
];

export const docsByTopic: Record<TopicName, DocTopic> = {
  entities: entitiesDocs,
  auth: authDocs,
  integrations: integrationsDocs,
  connectors: connectorsDocs,
  functions: functionsDocs,
  analytics: analyticsDocs,
  "best-practices": bestPracticesDocs,
  "project-structure": projectStructureDocs,
  "getting-started": gettingStartedDocs,
};
