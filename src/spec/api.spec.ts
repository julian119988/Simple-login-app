import { test, expect } from "@playwright/test";

test.describe("get request", () => {
  test("get user by query", async ({ request }) => {
    const userResponse = await request.get("http://localhost:8080/api", {
      params: {
        email: "test@test.com",
      },
    });
    await expect(userResponse).toBeOK();
  });
  test("get 404", async ({ request }) => {
    const userResponse = await request.get("http://localhost:8080/404");
    expect(userResponse.status()).toEqual(404);
  });
});

test.describe("delete user", () => {
  test("delete user by email", async ({ request }) => {
    const deletedUserResponse = await request.delete(
      "http://localhost:8080/api/deleteUser",
      {
        params: {
          email: "test@test.com",
        },
      }
    );
    expect(deletedUserResponse).toBeOK();
  });
});
