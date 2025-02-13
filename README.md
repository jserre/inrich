# Notion Browser & LinkedIn Viewer

A production-ready Next.js application featuring two main integrations:
1. Notion database browsing and searching
2. LinkedIn profile data visualization

## Production Status

This application is **STABLE** and deployed in production. Current stable features include:

### Notion Integration
- List all accessible Notion databases
- View database details and structure
- Navigate between databases seamlessly
- Search records by title within any database
- Real-time search results with clean interface

### LinkedIn Integration
- Fetch and display LinkedIn profile data
- Beautiful dark-themed UI
- Support for profile picture, experience, education, and skills
- Graceful error handling and loading states
- Raw JSON data toggle for debugging

## Technical Stack

- **Framework**: Next.js 15+ with App Router
- **UI**: React 19 with Tailwind CSS
- **Type Safety**: TypeScript with strict mode
- **API Integrations**: 
  - Official Notion Client (@notionhq/client)
  - LinkedIn API via RapidAPI

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
   X_RapidAPI_Key=your_rapidapi_key
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
│   │   ├── notion/       # Notion endpoints (search, records)
│   │   └── linkedin/     # LinkedIn profile endpoint
│   ├── databases/        # Database listing page
│   ├── notion/          # Database viewing and search
│   └── linkedin/        # LinkedIn profile viewer
├── utils/                # Shared utilities
│   └── validation.ts    # Input validation utilities
└── components/          # Reusable React components
```

## Feature Details

### Notion Integration
#### Database Browsing
- **Database List**: View all accessible Notion databases
- **Database Details**: Examine database structure and properties
- **Navigation**: Intuitive links between databases and records

#### Search Implementation
- **Title Search**: Fast and reliable search through database titles
- **Real-time Updates**: Immediate search results as you type
- **Error Handling**: Robust error handling for API failures
- **Loading States**: Smooth loading transitions with Suspense

### LinkedIn Integration
#### Profile Viewer
- **Data Display**: 
  - Profile header with photo and headline
  - Experience timeline with company and dates
  - Education history
  - Skills with endorsement counts
  
- **User Experience**:
  - Dark theme with excellent contrast
  - Loading indicators with spinners
  - Error messages with helpful suggestions
  - Form submission via Enter key
  - URL validation and formatting help
  
- **Developer Features**:
  - Raw JSON data toggle
  - Comprehensive error logging
  - TypeScript interfaces for type safety
  - Modular component structure

## API Configuration

### Notion API
- Requires a Notion integration token
- Set `NOTION_API_KEY` in environment variables
- Permissions needed: Read access to databases

### LinkedIn API (via RapidAPI)
- Uses the LinkedIn API from RapidAPI
- Set `X_RapidAPI_Key` in environment variables
- Endpoint: `linkedin-api8.p.rapidapi.com`
- Features: Profile data retrieval by URL

## Error Handling

Both integrations implement comprehensive error handling:

### Notion
- Database access permissions
- API rate limiting
- Network failures
- Invalid database IDs

### LinkedIn
- Invalid profile URLs
- Non-existing profiles
- API authentication errors
- Network timeouts
- Rate limiting

## Contributing

This project is actively maintained. Feel free to submit issues and pull requests.

## Deployment

The application is configured for automatic deployment via Vercel:
1. Push changes to the repository
2. Vercel automatically builds and deploys
3. Environment variables must be configured in Vercel dashboard
