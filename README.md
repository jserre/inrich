# Notion Browser

A production-ready Next.js application for browsing and searching Notion databases, featuring TypeScript, Tailwind CSS, and robust error handling.

## Production Status

This application is **STABLE** and deployed in production. Current stable features include:

### Database Browsing
- List all accessible Notion databases
- View database details and structure
- Navigate between databases seamlessly

### Search Functionality
- Search records by title within any database
- Real-time search results
- Clean and intuitive search interface

## Technical Stack

- **Framework**: Next.js 15+ with App Router
- **UI**: React 19 with Tailwind CSS
- **Type Safety**: TypeScript with strict mode
- **API Integration**: Official Notion Client (@notionhq/client)

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
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
notion-browser/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   └── notion/       # Notion endpoints (search, records)
│   ├── databases/        # Database listing page
│   └── notion/          # Database viewing and search
├── utils/                # Shared utilities
│   └── notion.ts        # Notion client configuration
└── components/          # Reusable React components
```

## Key Features

### Database Browsing
- **Database List**: View all accessible Notion databases
- **Database Details**: Examine database structure and properties
- **Navigation**: Intuitive links between databases and records

### Search Implementation
- **Title Search**: Fast and reliable search through database titles
- **Real-time Updates**: Immediate search results as you type
- **Error Handling**: Robust error handling for API failures
- **Loading States**: Smooth loading transitions with Suspense

## Contributing

This project is actively maintained. Feel free to submit issues and pull requests.
