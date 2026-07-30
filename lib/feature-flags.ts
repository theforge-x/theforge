/**
 * Server-side feature flags. Keep sensitive workspace flags default-deny so a
 * missing environment variable cannot accidentally broaden access.
 */
export const featureFlags = {
  forgeOsAdminOnly: process.env.FEATURE_FORGE_OS_ADMIN_ONLY !== "false",
} as const;
