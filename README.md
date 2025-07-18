# Netzet Events API

This project implements an event tracking system using NestJS. It integrates with the Klaviyo API to create and manage events, profiles, and metrics.

## Features

- Create single or bulk events via API
- Validate incoming payloads with Swagger and DTOs
- Automatically logs events to the local database
- Deletes logs older than 7 days via a scheduled CRON job
- Handles Klaviyo API errors with a consistent structure for UI consumption

## Tech Stack

- **Backend Framework**: NestJS
- **Database**: SQLite (can be swapped for PostgreSQL or MySQL)
- **ORM**: TypeORM
- **Scheduler**: @nestjs/schedule
- **HTTP Client**: Axios
- **Validation & Documentation**: class-validator, class-transformer, Swagger

## Getting Started

### Prerequisites

- Node.js >= 18.x
- Yarn or npm

### Installation

```bash
# Install dependencies
yarn install
```

```bash
# cp environment vars
cp .env.example .env
```

### Run the application

```bash
yarn start:dev

```

### API Documentation

#### Once the application is running, visit

http://localhost:3000/api
