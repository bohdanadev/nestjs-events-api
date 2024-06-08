# NESTJS-EVENTS-API
NestJS REST API with GraphQL Integration

This project is a robust, full-featured REST API built using modern development practices and tools. The API is developed using the NestJS framework, TypeORM, and MySQL, with authentication managed by Passport.js and JWT. Additionally, it includes GraphQL capabilities with Apollo, making the API reusable and highly flexible. The functionality of the API is verified through unit and end-to-end (e2e) tests.

## Table of Contents
- [Technologies](#technologies)
- [Features](#features)
- [Getting Started](#getting-started)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Testing](#testing)
- [API Documentation](#api-documentation)
- [GraphQL Integration](#graphql-integration)

## Technologies
- **NestJS Framework**: Efficient and scalable architecture for building server-side applications.
- **TypeORM**: Elegant ORM for working with MySQL databases.
- **Authentication**: Secure authentication using Passport.js and JWT.
- **GraphQL with Apollo**: Enhanced flexibility and reusability of the API.
- **Testing**: Comprehensive unit and e2e tests to ensure code quality and functionality.
- **Docker**: A containerization platform that allows for easy deployment and scaling of applications.

## Features
- **Create and Manage Events**: Easily create new events, update their details, and delete them as needed.
- **Event Attendees**: Keep track of event attendance, attendees statuses, and handle participant information.
-**Search and Filter**: Efficiently search and filter events based on various criteria such as date, category, location, etc.
-**GraphQL API**: Utilize the power of GraphQL to fetch precisely the data you need, optimizing API performance.


## Getting Started
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites
- Node.js
- npm or yarn
- MySQL
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

### Installation
Clone the repository:

```bash
git clone https://github.com/bohdanadev/nestjs-events-api

cd nestjs-events-api
```

Install the dependencies:

```bash
npm install
# or
yarn install
```

### Configuration
Create dev.env and e2e.env files in the root directory and add the following configuration variables:

```dev.env
PORT=3000
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=example
DB_NAME=nest-events
DB_DROP_SCHEMA=1
AUTH_SECRET=secret12345
JWT_EXP=60m
```
```e2e.env
PORT=3000
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=example
DB_NAME=nest-events-e2e
DB_DROP_SCHEMA=1
AUTH_SECRET=secret123
JWT_EXP=60m
```

### Running the Application

Host the Database.
1. You can host MySQL for local development using Docker:

```bash
docker-compose up
```
The Adminer for database managing will be running at http://localhost:8080.

2. Run the app.

```bash
npm run start
# or
yarn start
```
The application will be running at http://localhost:3000.

### Testing

Run unit tests:

```bash
npm run test
# or
yarn test
```

Run e2e tests:

```bash
npm run test:e2e
# or
yarn test:e2e
```

### API Documentation
The REST API documentation is available at http://localhost:3000/api. It provides detailed information on the available endpoints, request/response structures, and authentication methods.

### GraphQL Integration
GraphQL endpoint is available at http://localhost:3000/graphql. You can use the Apollo Playground to explore and test the GraphQL API.

```graphql
query {
  users {
    id
    name
    email
  }
}
```
