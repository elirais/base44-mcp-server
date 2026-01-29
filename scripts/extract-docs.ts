#!/usr/bin/env node
/**
 * extract-docs.ts
 *
 * This script is a placeholder for the automated documentation extraction pipeline.
 * When the hub's SDK documentation pages (src/pages/*Docs.jsx) change, this script
 * would parse the JSX and regenerate the src/docs/*.ts files in the MCP server.
 *
 * For now, the documentation files are hand-maintained. This script validates that
 * the existing doc files are structurally correct.
 */

import { allDocs } from "../src/docs/index.js";
import { ALL_TOPICS } from "../src/docs/types.js";

function validate() {
  console.log("Validating Base44 SDK documentation...\n");

  // Check all topics present
  const docTopics = allDocs.map((d) => d.topic);
  for (const topic of ALL_TOPICS) {
    if (!docTopics.includes(topic)) {
      console.error(`MISSING: Topic "${topic}" not found in docs`);
      process.exit(1);
    }
  }
  console.log(`  ✔ All ${ALL_TOPICS.length} topics present`);

  // Check each topic has required fields
  for (const doc of allDocs) {
    if (!doc.topic || !doc.title || !doc.namespace || !doc.markdown) {
      console.error(`INVALID: Topic "${doc.topic}" missing required fields`);
      process.exit(1);
    }
    if (doc.methods.length === 0) {
      console.warn(`  ⚠ Topic "${doc.topic}" has no methods`);
    }
  }
  console.log("  ✔ All topics have required fields");

  // Check methods have examples
  let methodCount = 0;
  let withExamples = 0;
  for (const doc of allDocs) {
    for (const method of doc.methods) {
      methodCount++;
      if (method.example) withExamples++;
    }
  }
  console.log(`  ✔ ${methodCount} methods documented (${withExamples} with examples)`);

  console.log("\nValidation passed.");
}

validate();
