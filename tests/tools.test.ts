import { describe, it, expect } from "vitest";
import { lookupDocs } from "../src/tools/lookup.js";
import { searchDocs } from "../src/tools/search.js";
import { listTopics } from "../src/tools/list-topics.js";

describe("lookupDocs", () => {
  it("should return entities documentation with topic overview", () => {
    const result = lookupDocs("entities");
    expect(result).toContain("Entity CRUD");
    expect(result).toContain("list");
    expect(result).toContain("filter");
  });

  it("should return specific method docs when method is provided", () => {
    const result = lookupDocs("entities", "list");
    expect(result).toContain("list");
    expect(result).toContain("sort");
  });

  it("should return not found for unknown topic", () => {
    const result = lookupDocs("unknown-topic");
    expect(
      result.toLowerCase().includes("not found") ||
      result.includes("Unknown topic")
    ).toBe(true);
  });

  it("should return not found for nonexistent method", () => {
    const result = lookupDocs("entities", "nonexistent");
    expect(result.toLowerCase()).toContain("not found");
  });
});

describe("searchDocs", () => {
  it("should find docs matching 'filter'", () => {
    const result = searchDocs("filter");
    expect(result.toLowerCase()).toContain("filter");
  });

  it("should find docs matching 'InvokeLLM'", () => {
    const result = searchDocs("InvokeLLM");
    expect(result).toContain("InvokeLLM");
  });

  it("should return no results for nonsense query", () => {
    const result = searchDocs("xyznonexistent123");
    expect(
      result.toLowerCase().includes("no results") ||
      result.toLowerCase().includes("not found")
    ).toBe(true);
  });

  it("should be case-insensitive", () => {
    const upperResult = searchDocs("FILTER");
    const lowerResult = searchDocs("filter");
    // Both should return results (contain "filter" case-insensitively)
    expect(upperResult.toLowerCase()).toContain("filter");
    expect(lowerResult.toLowerCase()).toContain("filter");
  });
});

describe("listTopics", () => {
  it("should list all 9 topic names", () => {
    const result = listTopics();
    const expectedTopics = [
      "entities",
      "auth",
      "integrations",
      "connectors",
      "functions",
      "analytics",
      "best-practices",
      "project-structure",
      "getting-started",
    ];

    for (const topic of expectedTopics) {
      expect(result).toContain(topic);
    }
  });

  it("should include method names", () => {
    const result = listTopics();
    expect(result).toContain("list");
    expect(result).toContain("filter");
    expect(result).toContain("me");
  });
});
