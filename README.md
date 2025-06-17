[![NodeJS](https://img.shields.io/badge/Node.js-6DA55F?logo=node.js&logoColor=white)](#) ![Express.js](https://img.shields.io/badge/Express.js-%23404d59.svg?logo=express&logoColor=%2361DAFB) ![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-green) ![License](https://img.shields.io/badge/license-MIT-blue)

# Blogging API

A robust RESTful API for blog management built with Node.js, Express, and MongoDB. Features JWT authentication, content state management, and comprehensive search capabilities.

_Developed as part of AltSchool Backend Engineering curriculum._

## Features

### Authentication & Authorization

- JWT-based authentication with 1-hour token expiry
- User registration and login endpoints
- Protected routes for content management

### Content Management

- Draft and publish workflow for articles
- Full CRUD operations for blog owners
- Auto-calculated reading time
- Read count tracking

### Public API

- Paginated blog listings with search and filtering
- Sort by read count, reading time, or timestamp
- Public access to published content

### Try the Live API

The API is deployed and publicly accessible.

**[`Base API URL`](https://abisoye-express-blog-app.onrender.com/api/)**

You can test the endpoints using:

- **[Postman Documentation](https://documenter.getpostman.com/view/23219595/2sB2x6mrsi)**
- **Any HTTP client (Thunder Client, curl, etc.)**


### Local Development (Optional)

If you want to run the API locally:

```bash
git clone https://github.com/abisoyeo/express-blog-app
cd express-blog-app
npm install
```

### Environment Setup

Create a `.env` file in the root directory:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/blogging-api
JWT_SECRET=your-jwt-secret-key
JWT_REFRESH_SECRET=your-jwt-refresh-secret-key
NODE_ENV=development
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Running the Application

```bash
# Development
npm run dev

# Production
npm --prefix client install && npm --prefix client run build && npm --prefix server install
npm --prefix server run start

# Run tests
cd server && npm test
```

## API Documentation

### Authentication Endpoints

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
GET    /blogs/me   # Get user's blogs (paginated, filterable)
GET    /blogs/me/:id   # Get single user blog
POST   /blogs/me        # Create new blog (draft)
PUT    /blogs/me/:id    # Update blog
PATCH  /blogs/me/:id/publish  # Publish draft
DELETE /blogs/me/:id    # Delete blog
```

### Complete API Documentation

**[View Full API Documentation](https://documenter.getpostman.com/view/23219595/2sB2x6mrsi)**

The complete API documentation includes:

- Detailed request/response examples
- Authentication flows
- Error handling scenarios
- Sample data for testing
- Postman collection for easy testing

## Data Models

### User

```javascript
email: String(required, unique);
first_name: String(required);
last_name: String(required);
password: String(required, hashed);
```

### Blog

```javascript
title: String (required, unique)
description: String
author: ObjectId (User reference)
state: Enum ['draft', 'published']
read_count: Number (default: 0)
reading_time: Number (auto-calculated)
tags: [ObjectId]
body: String (required)
createdAt: Date
updatedAt: Date
```

### Entity Relationship Diagram

**[View Database ERD](https://drawsql.app/teams/-4258/diagrams/abisoye-blogapierd-exam)**

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

## Frontend – React Client

A simple React-based frontend has been developed to interact with this API. It supports:

- Viewing published blog posts
- Author login & protected dashboard
- Post creation, editing, publishing, and deletion
- Image uploads and tag management

The frontend uses the same protected and public routes documented above, with authentication handled via JWT and localStorage.

> **Live Client App:** [Frontend Site](https://abisoye-express-blog-app.onrender.com)  
> **Connected API Base URL:** [API Base URL](https://abisoye-express-blog-app.onrender.com/api/blogs)

## Project Context

This application was developed as a comprehensive backend engineering assessment, demonstrating proficiency in Node.js ecosystem, REST API design, authentication patterns, and database modeling.

## Links

- [Frontend Site](https://abisoye-express-blog-app.onrender.com)
- [API Base URL](https://abisoye-express-blog-app.onrender.com/api/blogs)
- [Complete API Documentation](https://documenter.getpostman.com/view/23219595/2sB2x6mrsi)
- [Database ERD](https://drawsql.app/teams/-4258/diagrams/abisoye-blogapierd-exam)

## License

This project is licensed under the MIT License.
