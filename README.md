# Blogging API

A robust RESTful API for blog management built with Node.js, Express, and MongoDB. Features JWT authentication, content state management, and comprehensive search capabilities.

_Developed as part of AltSchool Backend Engineering curriculum._

## Features

**Authentication & Authorization**

- JWT-based authentication with 1-hour token expiry
- User registration and login endpoints
- Protected routes for content management

**Content Management**

- Draft and publish workflow for articles
- Full CRUD operations for blog owners
- Auto-calculated reading time
- Read count tracking

**Public API**

- Paginated blog listings with search and filtering
- Sort by read count, reading time, or timestamp
- Public access to published content

## Quick Start

### Prerequisites

- Node.js (v14 or higher)
- MongoDB instance
- npm or yarn

### Installation

```bash
git clone https://github.com/abisoyeo/alt-school-blog-api-exam.git
cd alt-school-blog-api-exam
npm install
```

### Environment Setup

Create a `.env` file in the root directory:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/blogging-api
JWT_SECRET=your-jwt-secret-key
NODE_ENV=development
```

### Running the Application

```bash
# Development
npm run dev

# Production
npm start

# Run tests
npm test
```

## API Documentation

### Authentication

```
POST /auth/signup    # User registration
POST /auth/login     # User login
```

### Public Endpoints

```
GET  /blogs          # List published blogs (paginated, searchable)
GET  /blogs/:id      # Get single blog (increments read count)
```

### Protected Endpoints

```
POST   /blogs        # Create new blog (draft)
GET    /user/blogs   # Get user's blogs (paginated, filterable)
PUT    /blogs/:id    # Update blog
PATCH  /blogs/:id/publish  # Publish draft
DELETE /blogs/:id    # Delete blog
```

### Query Parameters

**GET /blogs**

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)
- `search` - Search in title, author, tags
- `sort` - Sort by: read_count, reading_time, timestamp
- `order` - asc or desc

**GET /user/blogs**

- `state` - Filter by draft or published
- `page`, `limit` - Pagination

## Data Models

### User

```
email: String (required, unique)
first_name: String (required)
last_name: String (required)
password: String (required, hashed)
```

### Blog

```
title: String (required, unique)
description: String
author: ObjectId (User reference)
state: Enum ['draft', 'published']
read_count: Number (default: 0)
reading_time: Number (auto-calculated)
tags: [String]
body: String (required)
createdAt: Date
updatedAt: Date
```

## Architecture

Built using MVC pattern:

```
├── controllers/     # Request handlers
├── models/         # Database schemas
├── routes/         # API routes
├── middleware/     # Custom middleware
├── utils/          # Helper functions
├── tests/          # Test suites
└── config/         # Configuration files
```

## Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage
```

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT
- **Testing:** Jest & Supertest
- **Validation:** Joi

---

**Project Context:** This API was developed as a comprehensive backend engineering assessment, demonstrating proficiency in Node.js ecosystem, REST API design, authentication patterns, and database modeling.
