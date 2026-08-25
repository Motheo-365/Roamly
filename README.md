# Roamly ✈️

Roamly is a full-stack travel planning application designed to help users organise trips, manage expenses, track activities, and monitor their travel budgets in one place.

The project is being developed with a focus on **clean architecture, maintainability, and practical software design patterns**. Rather than adding design patterns simply for demonstration, each pattern is being introduced to solve a specific architectural or business problem within the application.

## 🎯 Project Goals

The main goals of Roamly are to:

* Build a complete full-stack application with a real relational database.
* Create a clean separation between the frontend, backend, business logic, and data access.
* Apply software design patterns to solve realistic development problems.
* Demonstrate understanding of scalable backend architecture.
* Create a polished project suitable for a professional software development portfolio.

## 🏗️ Architecture

Roamly follows a **layered architecture** where different parts of the application have clearly defined responsibilities.

```text
Frontend
   ↓
Routes / Controllers
   ↓
Service Layer
   ↓
Repositories
   ↓
PostgreSQL Database
```

This structure prevents individual components from becoming responsible for too many things.

For example, a controller should handle HTTP requests and responses rather than containing database queries and business rules.

## 🧩 Design Patterns

### 1. Repository Pattern

**Problem:**
Controllers and services should not need to know how PostgreSQL queries are implemented.

**Solution:**
The Repository Pattern separates database access from the rest of the application.

```text
Controller
    ↓
Service
    ↓
Repository
    ↓
PostgreSQL
```

Repositories will handle operations such as:

* `getTripsByUserId()`
* `getTripById()`
* `createTrip()`
* `updateTrip()`
* `deleteTrip()`

This makes the database layer easier to test, maintain, and change independently of the business logic.

---

### 2. Service Layer Pattern

**Problem:**
Putting validation and business rules directly inside routes would make controllers difficult to maintain.

**Solution:**
The Service Layer contains the application's business logic.

For example, when creating a trip, the `TripService` could enforce rules such as:

* The start date cannot be after the end date.
* A budget cannot be negative.
* A user must own the trip they are modifying.
* Activities must belong to the relevant trip.

The resulting flow becomes:

```text
Controller
    ↓
TripService
    ↓
TripRepository
    ↓
Database
```

This keeps HTTP handling, business logic, and database access separate.

---

### 3. Strategy Pattern

**Problem:**
Roamly may need to calculate travel costs in different ways without creating one large calculator containing every possible algorithm.

**Solution:**
The Strategy Pattern allows different budget calculation algorithms to be swapped at runtime.

Potential strategies include:

```text
BudgetStrategy
    ├── TotalCostStrategy
    ├── DailyCostStrategy
    └── PerPersonStrategy
```

For example:

```text
Budget Calculator
       ↓
Selected Strategy
       ↓
Calculate Budget
```

A new calculation method can therefore be added without rewriting the existing calculator.

---

### 4. Factory Pattern

**Problem:**
Roamly will support different types of expenses, such as accommodation, transport, food, activities, and other expenses.

**Solution:**
The Factory Pattern centralises the creation of expense objects.

```text
ExpenseFactory
      │
      ├── Accommodation
      ├── Transport
      ├── Food
      ├── Activities
      └── Other
```

Instead of spreading expense creation logic throughout the application, the factory provides a single entry point for creating the appropriate expense type.

---

### 5. Observer Pattern

**Problem:**
Different parts of the application may need to react when something happens to a trip.

For example, updating a trip could trigger:

* A budget warning.
* An activity reminder.
* An entry in the activity log.
* A notification.

**Solution:**
The Observer Pattern allows interested components to subscribe to trip-related events.

```text
Trip Event
    │
    ├── Notification System
    ├── Budget Tracker
    └── Activity Log
```

The trip itself does not need to know exactly what each component does when an event occurs.

This can be implemented using an event-driven system on the Node.js backend.

## Planned Backend Structure

```text
server/
│
├── controllers/
│   ├── authController.ts
│   ├── tripController.ts
│   └── expenseController.ts
│
├── services/
│   ├── authService.ts
│   ├── tripService.ts
│   └── budgetService.ts
│
├── repositories/
│   ├── userRepository.ts
│   ├── tripRepository.ts
│   └── expenseRepository.ts
│
├── strategies/
│   ├── totalCostStrategy.ts
│   ├── dailyCostStrategy.ts
│   └── perPersonStrategy.ts
│
├── factories/
│   └── expenseFactory.ts
│
├── events/
│   └── tripEvents.ts
│
├── routes/
│   ├── authRoutes.ts
│   ├── tripRoutes.ts
│   └── expenseRoutes.ts
│
└── db/
    └── connection.ts
```

## Design Pattern Overview

| Pattern               | Used For            | Purpose                                                  |
| --------------------- | ------------------- | -------------------------------------------------------- |
| **Repository**        | Database access     | Separates PostgreSQL logic from application logic        |
| **Service Layer**     | Business logic      | Keeps controllers thin and centralises application rules |
| **Strategy**          | Budget calculations | Allows calculation algorithms to be swapped              |
| **Factory**           | Expense creation    | Centralises creation of different expense types          |
| **Observer / Events** | Notifications       | Allows components to react to trip-related events        |

## 🚀 Development Plan

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

## 💡 What This Project Demonstrates

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