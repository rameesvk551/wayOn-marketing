# WayOn Lead Mining Backend

## Setup

1. Install dependencies:
   ```bash
   cd backend
   npm install
   ```

2. Copy `.env.example` to `.env` and configure:
   ```bash
   cp .env.example .env
   ```

3. Start MongoDB and Redis locally.

4. Start the API server:
   ```bash
   npm run dev
   ```

5. Start the mining worker (separate process):
   ```bash
   npm run worker
   ```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | /api/lead-mining/start | Create & queue a new mining job |
| GET | /api/lead-mining/jobs | List all jobs (paginated) |
| GET | /api/lead-mining/jobs/:jobId | Get job details |
| GET | /api/lead-mining/jobs/:jobId/progress | Get job progress |
| GET | /api/lead-mining/jobs/:jobId/results | Get leads for a job |
| POST | /api/lead-mining/export | Export leads (CSV or Excel) |

## Architecture

- **API Server**: Express handles HTTP requests
- **Queue**: Bull (Redis-backed) for job distribution
- **Workers**: Separate processes for scraping
- **Scrapers**: Google Maps + Yellow Pages directory
- **Storage**: MongoDB with deduplication
