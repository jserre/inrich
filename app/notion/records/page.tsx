'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

interface NotionRecord {
  id: string;
  properties: Record<string, any>;
}

interface RecordsResponse {
  records: NotionRecord[];
  title: string;
}

// Simple formatter for different Notion property types
function formatPropertyValue(property: any): string {
  if (!property) return '';
  
  switch (property.type) {
    case 'title':
      return property.title?.[0]?.plain_text || '';
    case 'rich_text':
      return property.rich_text?.[0]?.plain_text || '';
    case 'number':
      return property.number?.toString() || '';
    case 'select':
      return property.select?.name || '';
    case 'multi_select':
      return property.multi_select?.map((s: any) => s.name).join(', ') || '';
    case 'date':
      return property.date?.start || '';
    case 'checkbox':
      return property.checkbox ? '✓' : '✗';
    case 'url':
      return property.url || '';
    case 'email':
      return property.email || '';
    case 'phone_number':
      return property.phone_number || '';
    default:
      return '';
  }
}

export default function RecordsPage() {
  const searchParams = useSearchParams();
  const databaseId = searchParams.get('id');
  const [records, setRecords] = useState<RecordsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecords() {
      try {
        const response = await fetch('/api/notion/records');
        if (!response.ok) throw new Error('Failed to fetch records');
        const data = await response.json();
        setRecords(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchRecords();
  }, []);

  if (loading) return <div className="p-4">Loading records...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;
  if (!records) return <div className="p-4">No records found</div>;

  // Get property keys from the first record, excluding internal properties
  const propertyKeys = records.records[0] 
    ? Object.entries(records.records[0].properties)
        .filter(([_, value]) => value.type !== 'formula' && value.type !== 'rollup')
        .map(([key]) => key)
    : [];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Records: {records.title}</h1>
      <div className="overflow-x-auto border rounded-lg">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-50">
            <tr>
              {propertyKeys.map(key => (
                <th key={key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  {key}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {records.records.map((record, rowIndex) => (
              <tr key={record.id} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                {propertyKeys.map(key => (
                  <td key={key} className="px-6 py-4 text-sm text-gray-900 border-b">
                    {formatPropertyValue(record.properties[key])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
