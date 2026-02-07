#!/usr/bin/env node
/**
 * extract-docs.ts
 *
 * Validates Base44 SDK documentation structure and generates a report.
 * This script ensures all documentation topics are complete and properly formatted.
 *
 * Usage:
 *   npm run validate-docs
 *   node scripts/extract-docs.ts
 */

import { allDocs } from "../src/docs/index.js";
import { ALL_TOPICS } from "../src/docs/types.js";

interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  stats: {
    topics: number;
    methods: number;
    methodsWithExamples: number;
    totalLines: number;
  };
}

function validate(): ValidationResult {
  const result: ValidationResult = {
    valid: true,
    errors: [],
    warnings: [],
    stats: {
      topics: 0,
      methods: 0,
      methodsWithExamples: 0,
      totalLines: 0,
    },
  };

  console.log("🔍 Validating Base44 SDK documentation...\n");

  // Check all topics present
  const docTopics = allDocs.map((d) => d.topic);
  for (const topic of ALL_TOPICS) {
    if (!docTopics.includes(topic)) {
      result.errors.push(`Missing topic: "${topic}"`);
      result.valid = false;
    }
  }

  if (result.errors.length === 0) {
    result.stats.topics = ALL_TOPICS.length;
    console.log(`  ✅ All ${ALL_TOPICS.length} topics present`);
  }

  // Check each topic has required fields
  for (const doc of allDocs) {
    if (!doc.topic || !doc.title || !doc.namespace || !doc.markdown) {
      result.errors.push(`Topic "${doc.topic}" missing required fields`);
      result.valid = false;
    }

    if (doc.methods.length === 0) {
      result.warnings.push(`Topic "${doc.topic}" has no methods`);
    }

    // Count methods and examples
    for (const method of doc.methods) {
      result.stats.methods++;
      if (method.example && method.example.trim().length > 0) {
        result.stats.methodsWithExamples++;
      }

      // Validate method structure
      if (!method.name || !method.signature || !method.description) {
        result.errors.push(
          `Method in topic "${doc.topic}" missing required fields`
        );
        result.valid = false;
      }
    }

    // Count markdown lines
    result.stats.totalLines += doc.markdown.split("\n").length;
  }

  if (result.errors.length === 0) {
    console.log("  ✅ All topics have required fields");
  }

  // Report statistics
  console.log(
    `  ✅ ${result.stats.methods} methods documented (${result.stats.methodsWithExamples} with examples)`
  );
  console.log(`  ✅ ${result.stats.totalLines} lines of documentation`);

  // Coverage report
  const exampleCoverage = (
    (result.stats.methodsWithExamples / result.stats.methods) *
    100
  ).toFixed(1);
  console.log(`  📊 Example coverage: ${exampleCoverage}%`);

  // Show warnings
  if (result.warnings.length > 0) {
    console.log("\n⚠️  Warnings:");
    result.warnings.forEach((w) => console.log(`  - ${w}`));
  }

  // Show errors
  if (result.errors.length > 0) {
    console.log("\n❌ Errors:");
    result.errors.forEach((e) => console.log(`  - ${e}`));
    console.log("\n❌ Validation failed.");
    process.exit(1);
  }

  console.log("\n✅ Validation passed!");
  return result;
}

// Run validation
const result = validate();

// Generate JSON report if requested
if (process.argv.includes("--json")) {
  console.log("\n" + JSON.stringify(result, null, 2));
}
