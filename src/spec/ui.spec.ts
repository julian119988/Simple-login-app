import { test, expect } from "@playwright/test";

test("Testing login", async ({ page, request }) => {
  await request.post("http://localhost:8080/api/newUser", {
    data: {
      email: "test@test.com",
      password: "test",
      username: "test",
      password2: "test",
    },
  });
  await page.goto("localhost:8080");
  const emailInput = await page.$("#exampleInputEmail1");
  const passwordInput = await page.$("#exampleInputPassword1");
  const submitButton = await page.$("#submitButton");
  await emailInput.type("test@test.com");
  await passwordInput.type("test");
  await submitButton.click();
  const loginText = await page.$("body > main > h1");
  expect(page.url()).toContain("/login");
  expect(await loginText.innerHTML()).toContain(
    "Congratuliations you are logged in"
  );
});

test("Testing navbar", async ({ page }) => {
  await page.goto("localhost:8080");
  const homeButton = await page.$(
    "body > header > nav > ul > li:nth-child(1) > a"
  );
  await homeButton.click();
  expect(page.url()).toContainEqual("/");
  const createAccountButton = await page.$(
    "body > header > nav > ul > li:nth-child(2) > a"
  );
  await createAccountButton.click();
  expect(page.url()).toContain("/create");
  const simpleLoginAppButton = await page.$("body > header > nav > a");
  await simpleLoginAppButton.click();
  expect(page.url()).toContainEqual("/");
});
