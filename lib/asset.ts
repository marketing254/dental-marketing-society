// Prefixes local "/assets/..." paths with the GitHub Pages base path so they
// resolve on a project-repo site (…github.io/<repo>/). next/image does not do
// this automatically for unoptimized/static-export images. No-op in dev or when
// served from a domain root. Must mirror the basePath logic in next.config.ts.
// (When the custom domain goes live, set the production fallback to "".)
export const BASE_PATH =
  process.env.NEXT_PUBLIC_BASE_PATH ??
  (process.env.NODE_ENV === "production" ? "/msm" : "");

/** Prefix a root-relative local path (e.g. "/assets/logo.png") with BASE_PATH. */
export function asset(path: string): string {
  return `${BASE_PATH}${path}`;
}
