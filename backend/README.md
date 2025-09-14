# Figma Frames API Backend

A TypeScript Express backend for extracting frames from Figma files and generating HTML code.

## Features

- 📋 List all frames from a Figma file URL
- 🎯 Get detailed frame information
- 🔧 Generate HTML/CSS code from frames
- 🖼️ Preview images for frames

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Add your Figma Personal Access Token to `.env`:
```bash
FIGMA_TOKEN=your-figma-personal-access-token-here
PORT=3000
```

4. Start development server:
```bash
npm run dev
```

## API Endpoints

### Health Check
```bash
GET /health
```

### List Frames
```bash
GET /frames?url=<figma-url>
```
Returns all frames from a Figma file with preview images.

### Get Frame Details
```bash
GET /frames/:id?url=<figma-url>
```
Returns complete node information for a specific frame.

### Generate Frame Code
```bash
GET /frames/:id/code?url=<figma-url>
```
Generates HTML/CSS code for a specific frame.

## Example Usage

```bash
# List frames
curl "http://localhost:3000/frames?url=https://www.figma.com/design/your-file-id/your-file-name"

# Get frame details
curl "http://localhost:3000/frames/32:9?url=https://www.figma.com/design/your-file-id/your-file-name"

# Generate HTML
curl "http://localhost:3000/frames/32:9/code?url=https://www.figma.com/design/your-file-id/your-file-name"
```

## Scripts

- `npm run dev` - Start development server with auto-reload
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run typecheck` - Run TypeScript type checking

## Project Structure

```
src/
├── controllers/     # Request handlers
├── services/        # Business logic
├── routes/          # API routes
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
└── index.ts         # Main server file
```