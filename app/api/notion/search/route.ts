import { NextRequest, NextResponse } from 'next/server';
import { notion } from '@/utils/notion';
import { isFullDatabase, isFullPage } from '@notionhq/client';

export async function GET(request: NextRequest) {
  try {
    const searchParams = new URL(request.url).searchParams;
    const databaseId = searchParams.get('databaseId');
    const query = searchParams.get('query');

    if (!databaseId) {
      return NextResponse.json({ error: 'Missing database ID' }, { status: 400 });
    }

    if (!query) {
      return NextResponse.json({ error: 'Missing search query' }, { status: 400 });
    }

    // Get database to check if it exists and get its title
    const database = await notion.databases.retrieve({ database_id: databaseId });

    if (!isFullDatabase(database)) {
      return NextResponse.json(
        { error: 'Invalid database response' },
        { status: 500 }
      );
    }

    // Search records in database using title property
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: 'title',
        title: {
          contains: query
        }
      }
    });

    // Format response
    const records = response.results
      .filter(isFullPage)
      .map(page => ({
        id: page.id,
        properties: page.properties
      }));

    return NextResponse.json({
      records,
      title: database.title[0]?.plain_text || 'Untitled'
    });
  } catch (error) {
    console.error('Error searching database:', error);
    return NextResponse.json(
      { error: 'Failed to search database' },
      { status: 500 }
    );
  }
}
