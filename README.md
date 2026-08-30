# Roamly

Roamly is a full-stack travel planning and expense management application designed to help travellers plan, organise, and track every aspect of a trip in one place. The platform enables users to create multi-day itineraries, monitor trip budgets, manage expenses by category, and review trip details through a modern dashboard experience.

This project was built as a portfolio-ready application to demonstrate practical experience across frontend development, backend API design, database integration, authentication, and full-stack product thinking. The goal was to create a real, usable travel product rather than a toy demo.

## Overview

Roamly brings together the core workflows a traveller needs when planning a trip:

- Create and manage travel trips with dates, destination, and travel details
- Track activities and itinerary items for each trip
- Record expenses by category and view spending against the trip budget
- Explore destinations using location and imagery services
- Authenticate users securely and manage protected trip data
- Navigate a responsive, modern dashboard designed for quick trip review

## Problem it solves

Travellers often have to split trip planning across multiple tools: one app for budgeting, another for activity planning, another for logistics, and another for tracking spending. Roamly centralises those tasks into a single product experience, making it easier to stay organised before and during a trip.

## Key Features

### Trip management
- Create, update, view, and delete trips
- Organise trip data by destination, date range, traveller count, and description
- Keep trip records linked to the authenticated user

### Itinerary planning
- Add activities with title, date, time, location, and cost
- View travel plans in a simple itinerary layout
- Keep plans grouped under each trip

### Budget and expense tracking
- Record expenses by category such as accommodation, food, transport, activities, and shopping
- Monitor trip spending against a user-defined budget
- Review total costs and itemised trip expenses

### Travel dashboard experience
- Dedicated trip dashboard with trip overview and trip detail sections
- Responsive interface for browsing trip information quickly
- Clean UX designed for both planning and review

### Authentication and protected access
- Secure sign-up and login experience
- JWT-based authentication with protected route access
- Restricted access to user-owned trip and expense data

### Location and destination support
- Lookup and enrich trip details using location-based services
- Use destination images and travel metadata to improve trip context

## Tech Stack

### Frontend
- React
- TypeScript
- Vite
- React Router
- Framer Motion
- Leaflet

### Backend
- Node.js
- Express
- PostgreSQL
- JWT
- bcrypt
- CORS
- dotenv

### Additional tools
- PostgreSQL database integration
- REST API architecture
- Environment-based configuration
- Type-safe backend and frontend development

## Architecture

The application follows a layered architecture designed to separate concerns and keep the system maintainable.

```text
Client (React + Vite)
    ↓
API Routes / Controllers
    ↓
Service Layer
    ↓
Repository Layer
    ↓
PostgreSQL Database
```

This structure helps keep business rules, HTTP handling, and persistence logic distinct. It also makes the codebase easier to extend as the application grows.

## Project Structure

```text
Roamly/
├── client/                 # React frontend
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
│
├── express-server/         # Express API + business logic
│   ├── src/
│   ├── package.json
│   └── tsconfig.json
│
├── Plan/                   # Planning notes and implementation docs
├── README.md               # Project overview
├── .gitignore
└── package.json            # Root project metadata if present
```

## API Highlights

The backend exposes REST endpoints for:

- Authentication
- Trip creation and retrieval
- Activity management
- Expense tracking
- Budget logic
- Location services
- Route data
- Image services

These endpoints are organised around the authenticated user, ensuring that trip data remains scoped to the correct owner.

## Design and Implementation Notes

Roamly reflects a practical software engineering approach with clear separation between:

- UI concerns in the frontend
- API route definitions in the backend
- validation and business logic in service layers
- database access in repository functions
- event-driven updates for trip-related behaviour

This reflects the kind of architecture used in real-world product teams and demonstrates a strong understanding of maintainability and scalability.

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm

### 1. Clone the repository

```bash
git clone https://github.com/your-username/roamly.git
cd roamly
```

### 2. Install frontend dependencies

```bash
cd client
npm install
```

### 3. Install backend dependencies

```bash
cd ../express-server
npm install
```

### 4. Configure environment variables

Create a `.env` file in the backend root with the required PostgreSQL and app settings, including database connection values and JWT secret configuration.

### 5. Run the backend

```bash
cd express-server
npm run dev
```

### 6. Run the frontend

```bash
cd client
npm run dev
```

## Portfolio Value

Roamly represents a complete, end-to-end software product built with modern tooling and a realistic architecture. It demonstrates:

- full-stack application development
- API and database design
- authentication flows
- business logic implementation
- user-facing product design
- maintainable architecture patterns
- practical portfolio-level engineering judgment

## Future Improvements

The project is already structured for continued growth. Potential future enhancements include:

- multi-user collaboration and shared trip access
- AI-assisted trip recommendations
- improved budget forecasting
- richer itinerary suggestions
- notifications and reminders
- map-based travel planning experience
- deployment pipeline and production-ready configuration

## Conclusion

Roamly is a realistic travel planning application built to showcase modern software engineering capabilities in a full-stack context. It combines practical product thinking with a structured backend, clean frontend experience, and an architecture designed to scale beyond a prototype.

This project is suitable for demonstrating both technical skill and product sense in a portfolio, interview, or professional review setting.


| Pattern               | Used For            | Purpose                                                  |
| --------------------- | ------------------- | -------------------------------------------------------- |
| **Repository**        | Database access     | Separates PostgreSQL logic from application logic        |
| **Service Layer**     | Business logic      | Keeps controllers thin and centralises application rules |
| **Strategy**          | Budget calculations | Allows calculation algorithms to be swapped              |
| **Factory**           | Expense creation    | Centralises creation of different expense types          |
| **Observer / Events** | Notifications       | Allows components to react to trip-related events        |

## Development Plan

Roamly will be developed incrementally rather than implementing every architectural feature at once.

### Phase 1 — Database

* Design the PostgreSQL schema.
* Create relationships between users, trips, activities, and expenses.
* Add initial test data.
* Establish the backend database connection.

### Phase 2 — Backend Foundation

* Set up the Node.js/Express backend.
* Create routes and controllers.
* Implement the Repository and Service layers.
* Add authentication and authorisation.

### Phase 3 — Core Features

* Create and manage trips.
* Add destinations and activities.
* Add and manage expenses.
* Calculate trip budgets.

### Phase 4 — Design Patterns

* Introduce Strategy for budget calculations.
* Introduce Factory for expense creation.
* Introduce Observer/Event architecture for notifications.
* Refactor where necessary to keep responsibilities separated.

### Phase 5 — Frontend

* Build the React interface.
* Connect the frontend to the backend API.
* Create dashboards for trips and budgets.
* Add forms for trips, activities, and expenses.
* Build a responsive user experience.

### Phase 6 — Deployment

* Deploy the frontend.
* Deploy the backend API.
* Connect the production application to PostgreSQL.
* Configure environment variables and security settings.
* Test the complete production system.

## What This Project Demonstrates

Roamly is intended to demonstrate more than the ability to create CRUD functionality.

The project showcases:

* Full-stack application development.
* REST API design.
* PostgreSQL database design.
* Layered architecture.
* Separation of concerns.
* Object-oriented design principles.
* Software design patterns.
* Business logic implementation.
* Event-driven architecture.
* Frontend/backend integration.
* Deployment and production configuration.

The goal is to build an application where the architecture is **justified by the problems it solves**, rather than using design patterns simply to increase the project's technical vocabulary.
