# Water and Gas Meter Reading Service

This project is a backend service for managing individualized water and gas consumption readings, using NodeJS, TypeScript, PostgreSQL, and Docker.

## Features

- RESTful API for uploading and managing meter readings
- Integration with Google Gemini AI for extracting measurement values from images
- Data storage in PostgreSQL using Prisma ORM
- Full containerization with Docker and Docker Compose
- Automated testing with Jest

## Prerequisites

- Docker and Docker Compose
- Node.js (for local development)
- Google Gemini API key

## Setup

1. Clone the repository:
   ```
   git clone [YOUR_REPOSITORY_URL]
   cd [DIRECTORY_NAME]
   ```

2. Copy the `.env.example` file to `.env` and fill in the environment variables:
   ```
   cp .env.example .env
   ```

3. Edit the `.env` file and configure the following variables:
   ```
   DATABASE_URL=postgresql://POSTGRES_USER:POSTGRES_PASSWORD@postgres:5432/POSTGRES_DB?schema=public
   GEMINI_API_KEY=your_api_key_here
   POSTGRES_USER=your_username
   POSTGRES_PASSWORD=your_password
   POSTGRES_DB=database_name
   PORT=3000
   ```

## Running the Service

To start the service using Docker:

```
docker-compose up --build
```

The service will be available at `http://localhost:3000`.

## API Endpoints

- `POST /api/upload`: Upload a new meter reading
- `PATCH /api/confirm`: Confirm or correct a reading
- `GET /api/<customer_code>/list`: List readings by customer

For more details on the endpoints, refer to the API documentation (if available).

## Development

For local development:

1. Install dependencies:
   ```
   npm install
   ```

2. Run Prisma migrations:
   ```
   npx prisma migrate dev
   ```

3. Start the development server:
   ```
   npm run dev
   ```

## Testing

This project uses Jest for automated testing. To run the tests:

```
npm test
```

To run tests with coverage:

```
npm run test:coverage
```

Key test files:
- `__tests__/meterReadingController.test.ts`: Tests for the meter reading controller
- `__tests__/meterReadingService.test.ts`: Tests for the meter reading service

## Project Structure

```
.
├── src/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   └── app.ts
├── prisma/
│   └── schema.prisma
├── tests/
├── .env
├── .gitignore
├── docker-compose.yml
├── Dockerfile
├── package.json
└── tsconfig.json
```
