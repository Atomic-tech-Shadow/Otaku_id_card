import fs from "fs";
import path from "path";
import app from "./app";
import { logger } from "./lib/logger";

// Check for generated code (api-zod, api-client-react) and warn if missing
const root = path.resolve(__dirname, "..", "..", "..");
const apiZodGen = path.resolve(root, "lib", "api-zod", "src", "generated");
const apiClientGen = path.resolve(root, "lib", "api-client-react", "src", "generated");

const missing: string[] = [];
if (!fs.existsSync(apiZodGen)) missing.push(apiZodGen);
if (!fs.existsSync(apiClientGen)) missing.push(apiClientGen);

if (missing.length > 0) {
  logger.warn({ missing }, "Codegen outputs not found. Run: pnpm --filter @workspace/api-spec run codegen to generate api-zod and api-client-react outputs.");
}

const rawPort = process.env["PORT"];

if (!rawPort) {
  logger.error({ env: process.env }, "PORT environment variable is required but was not provided. Example (UNIX): PORT=3000 pnpm --filter @workspace/api-server run dev");
  throw new Error(
    "PORT environment variable is required but was not provided. See logs for details.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");
});
