import { Client } from '@notionhq/client';

if (!process.env.NOTION_API_KEY) {
  throw new Error('Missing NOTION_API_KEY environment variable');
}

export const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

export async function getDatabaseSchema(databaseId: string) {
  try {
    const response = await notion.databases.retrieve({
      database_id: databaseId,
    });
    
    return {
      properties: response.properties,
      title: response.title[0]?.plain_text || 'Untitled',
    };
  } catch (error) {
    console.error('Error fetching database schema:', error);
    throw error;
  }
}
