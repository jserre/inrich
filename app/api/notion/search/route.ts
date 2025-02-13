import { NextRequest, NextResponse } from 'next/server';
import { notion } from '@/utils/notion';
import { isFullDatabase, isFullPage } from '@notionhq/client';
import { isValidDatabaseId, isValidSearchQuery, createErrorResponse } from '@/utils/validation';
import { APIErrorCode } from '@notionhq/client';

export async function GET(request: NextRequest) {
  try {
    const searchParams = new URL(request.url).searchParams;
    const databaseId = searchParams.get('databaseId');
    const query = searchParams.get('query');

    // Validate required parameters
    if (!databaseId) {
      return createErrorResponse('Missing database ID');
    }

    if (!query) {
      return createErrorResponse('Missing search query');
    }

    // Validate database ID format
    if (!isValidDatabaseId(databaseId)) {
      return createErrorResponse('Invalid database ID format');
    }

    // Validate search query
    if (!isValidSearchQuery(query)) {
      return createErrorResponse('Invalid search query. Must be between 1 and 100 characters');
    }

    try {
      // Get database to check if it exists and get its title
      const database = await notion.databases.retrieve({ database_id: databaseId });

      if (!isFullDatabase(database)) {
        return createErrorResponse('Invalid database response', 500);
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
    } catch (error: unknown) {
      // Handle Notion API errors
      if (error && typeof error === 'object' && 'code' in error) {
        if (error.code === APIErrorCode.ObjectNotFound) {
          return createErrorResponse('Database not found', 404);
        }
        if (error.code === APIErrorCode.ValidationError) {
          return createErrorResponse('Invalid Notion API key or request', 401);
        }
        if (error.code === APIErrorCode.Unauthorized) {
          return createErrorResponse('You do not have access to this database. Make sure to share it with your integration.', 403);
        }
      }
      // Log unexpected errors but don't expose details to client
      console.error('Notion API error:', error);
      throw error; // Re-throw to be caught by outer catch
    }
  } catch (error: unknown) {
    console.error('Error searching database:', error);
    return createErrorResponse('Failed to search database', 500);
  }
}
