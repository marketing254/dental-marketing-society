// Prefixes local "/assets/..." paths with the GitHub Pages base path so they
// resolve on a project-repo site (…github.io/<repo>/). next/image does not do
// this automatically for unoptimized/static-export images. The site now serves
// from the custom domain root, so this is empty by default. Must mirror the
// basePath logic in next.config.ts — set NEXT_PUBLIC_BASE_PATH to revert.
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Prefix a root-relative local path (e.g. "/assets/logo.png") with BASE_PATH. */
export function asset(path: string): string {
  return `${BASE_PATH}${path}`;
}
