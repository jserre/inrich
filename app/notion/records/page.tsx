'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  PageObjectResponse,
  SelectPropertyItemObjectResponse,
  MultiSelectPropertyItemObjectResponse,
  DatePropertyItemObjectResponse,
  NumberPropertyItemObjectResponse,
  CheckboxPropertyItemObjectResponse,
  UrlPropertyItemObjectResponse,
  EmailPropertyItemObjectResponse,
  PhoneNumberPropertyItemObjectResponse,
  RichTextItemResponse
} from '@notionhq/client/build/src/api-endpoints';

type NotionPropertyValue = PageObjectResponse['properties'][string];

// Define title property type based on Notion's API
interface TitlePropertyValue {
  type: "title";
  title: RichTextItemResponse[];
  id: string;
}

// Define rich text property type based on Notion's API
interface RichTextPropertyValue {
  type: "rich_text";
  rich_text: RichTextItemResponse[];
  id: string;
}

interface NotionRecord {
  id: string;
  properties: PageObjectResponse['properties'];
}

interface RecordsResponse {
  records: NotionRecord[];
  title: string;
}

// Type guard for property values
function isPropertyType<T extends NotionPropertyValue>(
  property: NotionPropertyValue,
  type: T['type']
): property is T {
  return property.type === type;
}

// Strongly typed property formatter
function formatPropertyValue(property: NotionPropertyValue): string {
  if (!property) return '';

  switch (property.type) {
    case 'title':
      if (isPropertyType<TitlePropertyValue>(property, 'title')) {
        return property.title.map(t => t.plain_text).join(' ') || '';
      }
      break;
    case 'rich_text':
      if (isPropertyType<RichTextPropertyValue>(property, 'rich_text')) {
        return property.rich_text.map(t => t.plain_text).join(' ') || '';
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
      if (isPropertyType<UrlPropertyItemObjectResponse>(property, 'url')) {
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
  const [searchQuery, setSearchQuery] = useState('');
  const searchParams = useSearchParams();
  const databaseId = searchParams.get('id');

  const fetchRecords = async (query?: string) => {
    try {
      setLoading(true);
      const endpoint = query 
        ? `/api/notion/search?databaseId=${databaseId}&query=${encodeURIComponent(query)}`
        : `/api/notion/records?id=${databaseId}`;
      const response = await fetch(endpoint);
      if (!response.ok) throw new Error('Failed to fetch records');
      const data = await response.json();
      setRecords(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRecords(searchQuery);
  };

  const handleReset = () => {
    setSearchQuery('');
    fetchRecords();
  };

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
      <div className="flex flex-col space-y-4">
        <h1 className="text-2xl font-bold">Records: {records.title}</h1>
        
        {/* Search form */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            placeholder="Search records..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
          {searchQuery && (
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Reset
            </button>
          )}
        </form>

        {/* Records table */}
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
    </div>
  );
}
