const fallbackSiteUrl = "http://localhost:3000";

export function getSiteUrl() {
  const configuredUrls = [
    process.env.NEXT_PUBLIC_APP_URL,
    process.env.BETTER_AUTH_URL,
  ];

  for (const value of configuredUrls) {
    if (!value) continue;
    try {
      const url = new URL(value);
      if (url.protocol === "http:" || url.protocol === "https:") {
        return url.origin;
      }
    } catch {
      // Ignore malformed optional environment values and use the next source.
    }
  }

  return fallbackSiteUrl;
}
