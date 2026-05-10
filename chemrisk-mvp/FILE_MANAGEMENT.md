# File Management Feature

## Overview
The ChemRisk MVP now includes a complete file management system that allows users to:
- View all previously uploaded SDS files
- See extraction results for each file
- Manage (delete) uploaded files
- Re-view file details and export data

## Architecture

### Components

#### 1. **File Storage API** (`app/api/files/route.ts`)
- Stores file metadata and extraction results in JSON format
- Location: `data/files.json` (ignored in git)
- Provides RESTful endpoints:
  - `GET /api/files` - Retrieve all files
  - `POST /api/files` - Save a new file
  - `DELETE /api/files?id={id}` - Delete a file by ID

#### 2. **Files Management Page** (`app/files/page.tsx`)
- Main UI for displaying all uploaded files
- Fetches files from the API on page load
- Shows loading state and error handling

#### 3. **FilesClient Component** (`app/files/FilesClient.tsx`)
- Client-side component for rendering file list
- Features:
  - Expandable file details
  - Product name, ingredients, hazard info display
  - Delete functionality
  - Link to view full results
- Handles user interactions and state updates

### File Storage Format

```json
{
  "id": "1715000000000",
  "fileName": "acetone.pdf",
  "uploadDate": "2024-05-10T12:00:00.000Z",
  "data": {
    "fileName": "acetone.pdf",
    "productName": "Acetone",
    "ingredients": [...],
    "hazardClasses": [...],
    "hStatements": [...],
    "pStatements": [...]
  }
}
```

## User Flow

1. **Upload Files**
   - User uploads SDS PDF files on the home page
   - System extracts data using Google Generative AI
   - Files are automatically saved to persistent storage
   
2. **View Files**
   - Navigate to "Dokumentumok kezelése" (File Management)
   - See list of all previously uploaded files
   - Click on a file to expand and view details
   
3. **Manage Files**
   - View detailed extraction results
   - Delete files from the system
   - Re-view or export file data

## Integration with Upload Flow

When files are uploaded successfully:
1. Extraction results are displayed immediately
2. Data is stored in sessionStorage for the current session
3. **New**: File metadata and results are saved to persistent storage via API
4. User can view the results page or navigate to file management

## Navigation Updates

- Home page (`/`) - Upload new files
- Files page (`/files`) - Manage previously uploaded files
- Results page (`/results`) - View extraction results

All pages have updated navigation headers to link between sections.

## Configuration Changes

### Removed Static Export
Changed `next.config.ts` to remove `output: "export"` to enable:
- Dynamic API routes
- Server-side file persistence
- Full backend capabilities

This change allows the application to run as a Node.js server with full SSR and API support.

## Testing

Added comprehensive tests for FilesClient component:
- Empty state rendering
- File list rendering
- Expandable details
- Ingredient information display

Run tests with: `npm test`

## Future Enhancements

- Search and filter files by product name or upload date
- Bulk operations (delete multiple files)
- File export to different formats (Excel, CSV)
- User authentication for multi-user scenarios
- Database migration (from JSON to PostgreSQL/MongoDB)
