import { describe, it, expect } from "vitest";
import { spawn } from "child_process";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe("stdio server", () => {
  it("should start without errors", async () => {
    const stdioPath = join(__dirname, "..", "build", "stdio.js");
    
    // Start the server process
    const serverProcess = spawn("node", [stdioPath], {
      stdio: ["pipe", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";

    serverProcess.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    serverProcess.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    // Wait a bit for the server to initialize
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Server should be running (not exited)
    expect(serverProcess.exitCode).toBeNull();

    // No errors in stderr
    expect(stderr).toBe("");

    // Clean up
    serverProcess.kill("SIGTERM");

    // Wait for process to exit
    await new Promise((resolve) => {
      serverProcess.on("exit", resolve);
    });
  }, 10000); // 10 second timeout

  it("build/stdio.js should exist and be executable", async () => {
    const { access, constants } = await import("fs/promises");
    const stdioPath = join(__dirname, "..", "build", "stdio.js");

    // Check file exists
    await expect(access(stdioPath, constants.F_OK)).resolves.toBeUndefined();

    // Check file is executable
    await expect(access(stdioPath, constants.X_OK)).resolves.toBeUndefined();
  });
});

// Made with Bob
