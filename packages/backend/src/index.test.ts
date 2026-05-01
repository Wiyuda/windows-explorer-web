import { expect, test, describe } from "bun:test";
import { app } from "./index";

describe("Integration Tests", () => {
  test("GET /api/v1/nodes/tree should return 200 and success status", async () => {
    const response = await app.handle(
      new Request("http://localhost/api/v1/nodes/tree")
    );

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(Array.isArray(body.data)).toBe(true);
  });

  test("GET /api/v1/nodes/search should return search results", async () => {
    const response = await app.handle(
      new Request("http://localhost/api/v1/nodes/search?q=test")
    );

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(Array.isArray(body.data)).toBe(true);
  });

  test("GET /api/v1/nodes/invalid-id/children should return 404 or error", async () => {
    const response = await app.handle(
      new Request("http://localhost/api/v1/nodes/invalid-uuid/children")
    );

    // According to our service, it throws "Invalid ID format" which likely results in a 500 or 400
    // based on how Elysia handles it. Let's check if it returns a non-success response.
    const body = await response.json();
    expect(body.success).toBe(false);
  });
});
