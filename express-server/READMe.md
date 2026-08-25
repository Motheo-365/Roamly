I designed a full-stack travel planning application using a layered architecture and implemented Repository, Service, Strategy, Factory and Observer patterns where they solved specific architectural problems.

Absolutely — and Roamly is actually a good project for demonstrating design patterns without forcing them in just to say you used them.

For a portfolio project, I'd aim for 3–5 patterns, with each solving an actual problem.

1. Repository Pattern — ⭐⭐⭐⭐⭐

This is probably the most useful one for your backend.

Instead of your Express routes directly talking to PostgreSQL:

❌ Route
   ↓
PostgreSQL

you have:

Route
  ↓
Service
  ↓
Repository
  ↓
PostgreSQL

For example:

tripRoutes.ts
      ↓
tripService.ts
      ↓
tripRepository.ts
      ↓
PostgreSQL

Your repository handles things like:

getTripsByUserId()
getTripById()
createTrip()
updateTrip()
deleteTrip()

This keeps your database logic separate from your business logic.

Portfolio benefit: This is something you can genuinely discuss in a technical interview.

2. Service Layer Pattern — ⭐⭐⭐⭐⭐

This pairs really nicely with Repository.

Imagine creating a trip.

The route shouldn't contain all the logic:

router.post("/trips", async (req, res) => {
   // validate
   // calculate stuff
   // database query
   // error handling
   // ...
});

Instead:

Controller
     ↓
TripService
     ↓
TripRepository
     ↓
Database

The TripService can handle business rules such as:

start date can't be after end date
budget can't be negative
user must own the trip
activities must belong to that trip

This makes the backend much easier to maintain.

3. Factory Pattern — ⭐⭐⭐⭐

This could work nicely for expenses.

Roamly could have different expense categories:

Accommodation
Transport
Food
Activities
Other

Instead of scattering category-specific creation logic everywhere:

ExpenseFactory.create({
    type: "transport",
    amount: 450
});

The factory determines what kind of expense object should be created.

It's not essential, but it gives you a legitimate place to demonstrate the Factory Pattern.

4. Strategy Pattern — ⭐⭐⭐⭐⭐

This one could be really cool for Roamly.

Suppose you eventually allow users to calculate trip budgets in different ways.

Budget Calculation

├── Total Cost
├── Cost Per Day
├── Cost Per Person
└── Remaining Budget

You could have:

BudgetStrategy
     │
     ├── TotalCostStrategy
     ├── DailyCostStrategy
     └── PerPersonStrategy

Then:

budgetCalculator.setStrategy(
    new DailyCostStrategy()
);

budgetCalculator.calculate(trip);

You can add new calculation methods without rewriting the existing calculator.

That's a much more convincing use of Strategy than just adding a random pattern to the project.

5. Observer Pattern — ⭐⭐⭐⭐

This could be used for notifications.

Imagine:

Trip updated
     ↓
Notification System
     ├── Budget warning
     ├── Upcoming activity
     └── Trip reminder

When something happens to a trip, interested components can react.

For example:

Trip Event
    ↓
┌───────────────┐
│ Notification  │
│ Budget Tracker│
│ Activity Log  │
└───────────────┘

You could implement this with an event emitter on the Node backend.


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


| Pattern            | Where               | Why                         |
| ------------------ | ------------------- | --------------------------- |
| **Repository**     | Database            | Separates DB access         |
| **Service Layer**  | Backend             | Business logic              |
| **Strategy**       | Budget calculations | Swappable algorithms        |
| **Factory**        | Expenses            | Centralised object creation |
| **Observer/Event** | Notifications       | React to trip events        |


