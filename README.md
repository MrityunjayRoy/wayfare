# Wayfare

Wayfare is a digital travel journal application designed to help users document their journeys and memories. It provides a dual-view interface allowing users to visualize their trips both as an interactive timeline map and a static grid collection.

## Features

### Travel View
- **Interactive Map**: specific locations and routes are visualized using a custom map interface.
- **Road Timeline**: A chronological display of memories along a path, offering a unique scrolling experience.

### Static View
- **Grid Layout**: A clean, organized grid view of all stored memories for quick browsing.
- **Memory Cards**: Detailed cards showing photos, dates, and messages associated with each memory.

### Memory Management
- **Add Memories**: Users can upload photos, assign dates, and add messages to create new memories.
- **Delete Memories**: Option to remove unwanted memories from the journal.
- **Optimistic Updates**: Immediate UI feedback for actions while data persists in the background.

## Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **Database**: LibSQL (using Turso)
- **Storage**: Vercel Blob (for image storage)
- **Icons**: React Icons

## Getting Started

Follow these instructions to set up the project locally.

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- A Turso database instance
- A Vercel Blob store

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd wayfare
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add the following keys:

   ```env
   TURSO_DATABASE_URL=your_turso_database_url
   TURSO_AUTH_TOKEN=your_turso_auth_token
   BLOB_READ_WRITE_TOKEN=your_vercel_blob_token
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open http://localhost:3000 in your browser to see the application.

## Project Structure

- `src/app`: Application routes and pages.
- `src/components`: Reusable UI components.
  - `travel`: Components specific to the Travel view (Map, Timeline).
  - `static`: Components specific to the Static view (Grid).
- `src/context`: React Context providers (MemoryContext) for state management.
- `src/lib`: Utility functions, database configuration, and TypeScript types.
