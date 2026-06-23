// Renders a JSON-LD <script> block. Server-safe (no "use client"); Google and
// AI crawlers read ld+json anywhere in the document, so emitting it in the body
// from a server component is fine. Pass one object or an array (array is wrapped
// so each entry is parsed independently).
export default function JsonLd({ data }: { data: object | object[] }) {
  const payload = Array.isArray(data) && data.length === 1 ? data[0] : data;
  return (
    <script
      type="application/ld+json"
      // Schema is build-time static data, never user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  );
}
