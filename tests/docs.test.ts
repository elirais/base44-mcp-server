import { describe, it, expect } from "vitest";
import { allDocs } from "../src/docs/index.js";
import { ALL_TOPICS } from "../src/docs/types.js";

describe("docs", () => {
  it("should have all 9 topics", () => {
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

    const docTopics = allDocs.map((d) => d.topic);

    for (const topic of expectedTopics) {
      expect(docTopics).toContain(topic);
    }

    expect(allDocs).toHaveLength(9);
  });

  it("should match ALL_TOPICS constant", () => {
    expect(ALL_TOPICS).toHaveLength(9);
    const docTopics = allDocs.map((d) => d.topic);
    for (const topic of ALL_TOPICS) {
      expect(docTopics).toContain(topic);
    }
  });

  it("each doc should have required top-level fields", () => {
    for (const doc of allDocs) {
      expect(doc).toHaveProperty("topic");
      expect(doc).toHaveProperty("title");
      expect(doc).toHaveProperty("namespace");
      expect(doc).toHaveProperty("methods");
      expect(doc).toHaveProperty("notes");
      expect(doc).toHaveProperty("markdown");

      expect(typeof doc.topic).toBe("string");
      expect(typeof doc.title).toBe("string");
      expect(typeof doc.namespace).toBe("string");
      expect(Array.isArray(doc.methods)).toBe(true);
      expect(Array.isArray(doc.notes)).toBe(true);
      expect(typeof doc.markdown).toBe("string");
    }
  });

  it("each method should have required fields", () => {
    for (const doc of allDocs) {
      for (const method of doc.methods) {
        expect(method).toHaveProperty("name");
        expect(method).toHaveProperty("signature");
        expect(method).toHaveProperty("description");
        expect(method).toHaveProperty("parameters");
        expect(method).toHaveProperty("returns");
        expect(method).toHaveProperty("example");
        expect(method).toHaveProperty("notes");

        expect(typeof method.name).toBe("string");
        expect(typeof method.signature).toBe("string");
        expect(typeof method.description).toBe("string");
        expect(Array.isArray(method.parameters)).toBe(true);
        expect(typeof method.returns).toBe("string");
        expect(typeof method.example).toBe("string");
        expect(Array.isArray(method.notes)).toBe(true);
      }
    }
  });

  it("entities doc should have expected methods", () => {
    const entitiesDoc = allDocs.find((d) => d.topic === "entities");
    expect(entitiesDoc).toBeDefined();

    const methodNames = entitiesDoc!.methods.map((m) => m.name);
    const expectedMethods = [
      "list",
      "filter",
      "create",
      "bulkCreate",
      "update",
      "delete",
      "schema",
      "subscribe",
    ];

    for (const name of expectedMethods) {
      expect(methodNames).toContain(name);
    }
  });

  it("auth doc should have expected methods", () => {
    const authDoc = allDocs.find((d) => d.topic === "auth");
    expect(authDoc).toBeDefined();

    const methodNames = authDoc!.methods.map((m) => m.name);
    const expectedMethods = ["me", "isAuthenticated", "updateMe"];

    for (const name of expectedMethods) {
      expect(methodNames).toContain(name);
    }
  });

  it("integrations doc should have expected methods", () => {
    const integrationsDoc = allDocs.find((d) => d.topic === "integrations");
    expect(integrationsDoc).toBeDefined();

    const methodNames = integrationsDoc!.methods.map((m) => m.name);
    const expectedMethods = [
      "InvokeLLM",
      "SendEmail",
      "UploadFile",
      "GenerateImage",
    ];

    for (const name of expectedMethods) {
      expect(methodNames).toContain(name);
    }
  });

  it("connectors doc markdown should mention all supported services", () => {
    const connectorsDoc = allDocs.find((d) => d.topic === "connectors");
    expect(connectorsDoc).toBeDefined();

    const services = [
      "Google Calendar",
      "Slack",
      "Notion",
      "Salesforce",
      "HubSpot",
      "LinkedIn",
      "TikTok",
      "Google Drive",
      "Gmail",
      "Google Sheets",
      "Google Docs",
    ];

    for (const service of services) {
      expect(connectorsDoc!.markdown).toContain(service);
    }
  });

  it("analytics doc should have a track method", () => {
    const analyticsDoc = allDocs.find((d) => d.topic === "analytics");
    expect(analyticsDoc).toBeDefined();

    const trackMethod = analyticsDoc!.methods.find((m) => m.name === "track");
    expect(trackMethod).toBeDefined();
  });
});
