# Roamly

Roamly is a full-stack travel planning and budget management application built to help users plan trips, organise activities, track spending, and keep all of their travel details in one place.

This project was created as a portfolio-ready product to showcase full-stack engineering, API design, database integration, product thinking, and a polished user experience. It is designed to feel like a real-world travel product rather than a mock interface or static prototype.

## Why this project matters

Travel planning usually happens across multiple tools: one app for budgeting, another for activity planning, and another for keeping track of trip details. Roamly brings these tasks together in a single experience so travellers can manage their entire journey from planning to execution.

## Core features

### Trip planning
- Create, view, update, and delete travel plans
- Organise details such as destination, dates, number of travellers, and trip description
- Keep trip records scoped to the authenticated user

### Itinerary management
- Add activities with a title, date, time, cost, and location
- Maintain structured daily travel plans for each trip
- Review itinerary information in a clear trip dashboard

### Budget and expense tracking
- Log expenses by category such as transport, accommodation, food, activities, and shopping
- Monitor spending against a trip budget
- Review itemised trip costs and totals

### Discover and explore
- Browse destinations and location data through the home dashboard
- Explore location suggestions and map-driven travel information
- Enrich trip context with surrounding travel points of interest

### Authentication and security
- Secure sign-up and login flow
- JWT-based protected routes
- User-specific access to trip and expense data

## Tech stack

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
- dotenv
- CORS

## Architecture

Roamly follows a layered architecture that separates concerns and supports maintainability as the application grows:

```text
React Frontend
    ↓
Express API Routes
    ↓
Service Layer
    ↓
Repository Layer
    ↓
PostgreSQL Database
```

This separation keeps the app easier to extend and reason about. Route handling stays focused on incoming requests, services contain business rules, and repositories manage persistence.

## Project structure

```text
Roamly/
├── client/                 # React frontend
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
│
├── express-server/         # Express backend and API
│   ├── src/
│   ├── package.json
│   └── tsconfig.json
│
├── Plan/                   # Planning and project notes
├── README.md               # Project summary
├── .gitignore
└── .env.example            # Example environment configuration
```

## What makes this a strong portfolio project

Roamly demonstrates a broad set of engineering skills, like:

- full-stack application development
- REST API design
- database modelling and schema usage
- authentication and protected access
- user-focused product design
- maintainable architecture decisions
- modern frontend and backend tooling

It is the kind of project that shows both technical capability and product sense.

## Getting started

### Prerequisites
- Node.js 18 or newer
- PostgreSQL database
- npm

### Install frontend dependencies

```bash
cd client
npm install
```

### Install backend dependencies

```bash
cd ../express-server
npm install
```

### Configure environment variables

Create a `.env` file in the backend with the required variables for:
- PostgreSQL connection details
- JWT secret
- app configuration

### Run the backend

```bash
cd express-server
npm run dev
```

### Run the frontend

```bash
cd client
npm run dev
```

## Current product direction

The app already includes the foundations for a practical trip-planning product: user accounts, trip records, itinerary creation, budget tracking, and a dashboard experience. It is well positioned as a portfolio project that can continue evolving with additional features such as:

- collaborative travel planning
- smarter budget forecasting
- itinerary recommendations
- notifications and reminders
- richer map experiences
- deployment to production

## Conclusion

Roamly is a realistic end-to-end software project built to demonstrate strong full-stack development skills in a way that feels relevant to real product work. It blends technical depth with an intuitive travel use case, making it a credible and impressive portfolio application.

This project is suitable for showcasing engineering ability, product thinking, and the ability to build a complete digital experience from frontend to backend.


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
