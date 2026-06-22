// Slug helper shared by client components and build-time static generation.
// (Kept in its own non-"use client" module so it can run on the server too.)
export function slugify(v: string): string {
  return (
    String(v || "item")
      .toLowerCase()
      .replace(/&/g, " and ")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 72) || "item"
  );
}
