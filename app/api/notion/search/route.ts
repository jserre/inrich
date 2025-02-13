import { NextRequest, NextResponse } from 'next/server';
import { notion } from '@/utils/notion';
import { isFullDatabase } from '@notionhq/client';

export async function GET(request: NextRequest) {
  try {
    // Get database ID from referer
    const referer = request.headers.get('referer');
    if (!referer) {
      return NextResponse.json({ error: 'No referer found' }, { status: 400 });
    }

    const url = new URL(referer);
    const databaseId = url.searchParams.get('id');
    if (!databaseId) {
      return NextResponse.json({ error: 'No database ID found' }, { status: 400 });
    }

    // Get search query from URL params
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query');
    if (!query) {
      return NextResponse.json({ error: 'No search query provided' }, { status: 400 });
    }

    // Get database to verify access and get title and properties
    const database = await notion.databases.retrieve({ database_id: databaseId });
    if (!isFullDatabase(database)) {
      return NextResponse.json({ error: 'Invalid database response' }, { status: 500 });
    }

    // Build search filter for all text-based properties
    const searchableProperties = Object.entries(database.properties)
      .filter(([_, prop]) => ['title', 'rich_text', 'url', 'email', 'phone_number'].includes(prop.type))
      .map(([name, prop]) => {
        const type = prop.type as 'title' | 'rich_text' | 'url' | 'email' | 'phone_number';
        return {
          property: name,
          [type]: {
            contains: query
          }
        };
      });

    if (searchableProperties.length === 0) {
      // If no searchable properties, return empty results
      return NextResponse.json({
        records: [],
        title: database.title[0]?.plain_text || 'Untitled'
      });
    }

    // Search records in database
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        or: searchableProperties
      }
    });

    // Format response
    const records = response.results.map(page => ({
      id: page.id,
      properties: page.properties
    }));

    return NextResponse.json({
      records,
      title: database.title[0]?.plain_text || 'Untitled'
    });

  } catch (error) {
    console.error('Error searching records:', error);
    return NextResponse.json(
      { error: 'Failed to search records' },
      { status: 500 }
    );
  }
}
