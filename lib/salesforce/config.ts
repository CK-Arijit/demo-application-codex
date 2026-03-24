import { z } from "zod";

const salesforceEnvSchema = z.object({
  SALESFORCE_LOGIN_URL: z.string().trim().url(),
  SALESFORCE_CLIENT_ID: z.string().trim().min(1),
  SALESFORCE_CLIENT_SECRET: z.string().trim().min(1),
  SALESFORCE_USERNAME: z.string().trim().min(1),
  SALESFORCE_PASSWORD: z.string().trim().min(1),
  SALESFORCE_SECURITY_TOKEN: z.string().trim().min(1),
});

export type SalesforceEnvConfig = z.infer<typeof salesforceEnvSchema>;

export function getSalesforceEnvConfig(): SalesforceEnvConfig {
  return salesforceEnvSchema.parse({
    SALESFORCE_LOGIN_URL: process.env.SALESFORCE_LOGIN_URL,
    SALESFORCE_CLIENT_ID: process.env.SALESFORCE_CLIENT_ID,
    SALESFORCE_CLIENT_SECRET: process.env.SALESFORCE_CLIENT_SECRET,
    SALESFORCE_USERNAME: process.env.SALESFORCE_USERNAME,
    SALESFORCE_PASSWORD: process.env.SALESFORCE_PASSWORD,
    SALESFORCE_SECURITY_TOKEN: process.env.SALESFORCE_SECURITY_TOKEN,
  });
}
