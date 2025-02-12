import { NextResponse } from 'next/server';
import { getDatabaseSchema } from '@/utils/notion';

export async function GET() {
  try {
    if (!process.env.NOTION_DATABASE_ID) {
      return NextResponse.json({ error: 'Missing NOTION_DATABASE_ID' }, { status: 500 });
    }

    const schema = await getDatabaseSchema(process.env.NOTION_DATABASE_ID);
    return NextResponse.json(schema);
  } catch (error) {
    console.error('Error in schema route:', error);
    return NextResponse.json({ error: 'Failed to fetch database schema' }, { status: 500 });
  }
}
