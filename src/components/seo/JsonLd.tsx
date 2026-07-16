/** Renders schema.org JSON-LD. `data` may be a single object or an array. */
export function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is safe here (no user-controlled </script> sequences
      // in our schema builders); values are plain text fields.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
