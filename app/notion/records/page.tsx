'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  PageObjectResponse,
  PropertyValueType,
  SelectPropertyItemObjectResponse,
  MultiSelectPropertyItemObjectResponse,
  DatePropertyItemObjectResponse,
  NumberPropertyItemObjectResponse,
  TitlePropertyItemObjectResponse,
  CheckboxPropertyItemObjectResponse,
  URLPropertyItemObjectResponse,
  EmailPropertyItemObjectResponse,
  PhoneNumberPropertyItemObjectResponse,
  RichTextPropertyItemObjectResponse
} from '@notionhq/client/build/src/api-endpoints';

interface NotionRecord {
  id: string;
  properties: PageObjectResponse['properties'];
}

interface RecordsResponse {
  records: NotionRecord[];
  title: string;
}

// Type guard for property values
function isPropertyType<T extends PropertyValueType>(
  property: PropertyValueType,
  type: T['type']
): property is T {
  return property.type === type;
}

// Strongly typed property formatter
function formatPropertyValue(property: PropertyValueType): string {
  if (!property) return '';

  switch (property.type) {
    case 'title':
      if (isPropertyType<TitlePropertyItemObjectResponse>(property, 'title')) {
        return property.title[0]?.plain_text || '';
      }
      break;
    case 'rich_text':
      if (isPropertyType<RichTextPropertyItemObjectResponse>(property, 'rich_text')) {
        return property.rich_text[0]?.plain_text || '';
      }
      break;
    case 'number':
      if (isPropertyType<NumberPropertyItemObjectResponse>(property, 'number')) {
        return property.number?.toString() || '';
      }
      break;
    case 'select':
      if (isPropertyType<SelectPropertyItemObjectResponse>(property, 'select')) {
        return property.select?.name || '';
      }
      break;
    case 'multi_select':
      if (isPropertyType<MultiSelectPropertyItemObjectResponse>(property, 'multi_select')) {
        return property.multi_select.map(s => s.name).join(', ');
      }
      break;
    case 'date':
      if (isPropertyType<DatePropertyItemObjectResponse>(property, 'date')) {
        return property.date?.start || '';
      }
      break;
    case 'checkbox':
      if (isPropertyType<CheckboxPropertyItemObjectResponse>(property, 'checkbox')) {
        return property.checkbox ? '✓' : '✗';
      }
      break;
    case 'url':
      if (isPropertyType<URLPropertyItemObjectResponse>(property, 'url')) {
        return property.url || '';
      }
      break;
    case 'email':
      if (isPropertyType<EmailPropertyItemObjectResponse>(property, 'email')) {
        return property.email || '';
      }
      break;
    case 'phone_number':
      if (isPropertyType<PhoneNumberPropertyItemObjectResponse>(property, 'phone_number')) {
        return property.phone_number || '';
      }
      break;
  }
  return '';
}

export default function RecordsPage() {
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
        .filter(([, value]) => !['formula', 'rollup'].includes(value.type))
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
