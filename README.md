# Notion Integration Seed Project

A production-ready Next.js template for integrating with Notion's API, featuring TypeScript, Tailwind CSS, and robust error handling.

## Why This Project?

Building reliable Notion integrations can be challenging due to complex typing requirements and API peculiarities. This seed project provides a battle-tested foundation that:

- ✅ Implements proper TypeScript types for Notion's API
- ✅ Handles edge cases and partial responses
- ✅ Demonstrates clean architecture patterns
- ✅ Provides production-ready error handling
- ✅ Shows correct environment variable setup

## Features

- **Type-Safe Notion Integration**: Properly typed database schema fetching using `@notionhq/client`
- **Modern Stack**: Next.js 15+, React 19, TypeScript, and Tailwind CSS
- **Clean Architecture**: Separation of concerns between UI, API routes, and Notion utilities
- **Production Ready**: Environment validation, error handling, and proper HTTP status codes
- **Developer Experience**: Hot reloading, ESLint configuration, and TypeScript strict mode

## Getting Started

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your environment variables:
   ```bash
   # .env.local
   NOTION_API_KEY=your_notion_api_key
   NOTION_DATABASE_ID=your_database_id
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) to view your app

## Project Structure

```
notion-seed/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   └── notion/       # Notion-specific endpoints
│   ├── notion/           # Notion database viewer
│   └── page.tsx          # Home page
├── utils/
│   └── notion.ts         # Notion client setup & utilities
└── .env.local            # Environment variables
```

## Key Implementation Details

### Notion Client Setup
```typescript
// utils/notion.ts
import { Client, isFullDatabase } from '@notionhq/client';

export const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});
```

### Type-Safe Database Queries
```typescript
// Proper typing for Notion's database responses
type NotionPropertyConfig = DatabaseObjectResponse['properties'][string];

// Type guard usage
if (!isFullDatabase(response)) {
  throw new Error('Received incomplete database response');
}
```

### Error Handling
- Environment variable validation at startup
- Type guard checks for API responses
- Proper error propagation
- Clean error responses with appropriate HTTP status codes

## Environment Variables

Required environment variables:
- `NOTION_API_KEY`: Your Notion integration token
- `NOTION_DATABASE_ID`: ID of the Notion database to connect to

## Common Pitfalls Solved

This seed project addresses several common challenges in Notion integration:

1. **Type Safety**: Proper usage of Notion's TypeScript types
2. **Partial Responses**: Handling incomplete database responses
3. **Error States**: Comprehensive error handling throughout the stack
4. **Configuration**: Clean separation of Notion client setup
5. **API Design**: Production-ready API route implementation

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this seed project as a starting point for your own Notion integrations.
