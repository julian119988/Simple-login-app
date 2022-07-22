import { PlaywrightTestConfig } from "@playwright/test";
const config: PlaywrightTestConfig = {
  use: {
    browserName: "chromium",
    headless: false,
    extraHTTPHeaders: {
      Accept: "application/json",
    },
  },
  reporter: [["json", { outputFile: "results.json" }]],
  testMatch: "test.list.ts",
};
export default config;
