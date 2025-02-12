'use client';

import { useEffect, useState } from 'react';

export default function NotionPage() {
  const [schema, setSchema] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSchema() {
      try {
        const response = await fetch('/api/notion/schema');
        if (!response.ok) throw new Error('Failed to fetch schema');
        const data = await response.json();
        setSchema(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchSchema();
  }, []);

  if (loading) return <div className="p-4">Loading database structure...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;
  if (!schema) return <div className="p-4">No schema found</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Database: {schema.title}</h1>
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Properties:</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(schema.properties).map(([key, property]: [string, any]) => (
            <div key={key} className="border p-4 rounded-lg">
              <h3 className="font-medium">{key}</h3>
              <p className="text-sm text-gray-600">Type: {property.type}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
