# CodeAlpha Restaurant Management System

A backend API for managing a restaurant's menu, tables, reservations, inventory, and orders — built as part of the CodeAlpha Backend Development internship (Task 3).

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- dotenv, cors, nodemon

## Features

- **Menu management** — full CRUD for menu items (name, price, category, availability)
- **Table management** — full CRUD for restaurant tables with status tracking
- **Reservations** — create/view/cancel reservations with availability checking (table capacity + date/time conflict detection)
- **Inventory management** — full CRUD for stock items, with a low-stock report endpoint
- **Orders** — place orders with server-side price/total calculation and automatic inventory deduction based on a menu-item-to-inventory-item mapping

## Project Structure

```text
codealpha-restaurant-management/
├── controllers/
│   ├── menuController.js
│   ├── tableController.js
│   ├── reservationController.js
│   ├── inventoryController.js
│   └── orderController.js
├── models/
│   ├── MenuItem.js
│   ├── Table.js
│   ├── Reservation.js
│   ├── Inventory.js
│   └── Order.js
├── routes/
│   ├── menuRoutes.js
│   ├── tableRoutes.js
│   ├── reservationRoutes.js
│   ├── inventoryRoutes.js
│   └── orderRoutes.js
├── index.js
├── .env
├── .gitignore
├── package.json
└── package-lock.json
```

## Setup

1. Clone the repository and install dependencies:
   ```
   npm install
   ```
2. Create a `.env` file in the project root:
   ```
   PORT=5003
   MONGO_URI=your_mongodb_connection_string
   ```
3. Start the server:
   ```
   npm run dev
   ```

## API Endpoints

### Menu

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/menu` | View all menu items |
| POST | `/api/menu` | Create menu item |
| GET | `/api/menu/:id` | View one menu item |
| PUT | `/api/menu/:id` | Update menu item |
| DELETE | `/api/menu/:id` | Delete menu item |

### Tables

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/tables` | View tables |
| POST | `/api/tables` | Add table |
| GET | `/api/tables/:id` | View one table |
| PUT | `/api/tables/:id` | Update table |
| DELETE | `/api/tables/:id` | Delete table |

### Reservations

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/reservations` | Create reservation (checks capacity + date/time conflicts) |
| GET | `/api/reservations` | View reservations |
| GET | `/api/reservations/:id` | View one reservation |
| DELETE | `/api/reservations/:id` | Cancel reservation |

### Inventory

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/inventory` | View inventory |
| POST | `/api/inventory` | Add inventory item |
| GET | `/api/inventory/low-stock` | View items at or below their low-stock threshold |
| GET | `/api/inventory/:id` | View one inventory item |
| PUT | `/api/inventory/:id` | Update inventory |
| DELETE | `/api/inventory/:id` | Delete inventory item |

### Orders

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/orders` | Place order (validates items, calculates total server-side, deducts linked inventory) |
| GET | `/api/orders` | View orders |
| GET | `/api/orders/:id` | View one order |
| PUT | `/api/orders/:id/status` | Update order status |

## Key Design Decisions

- **Order totals are always calculated server-side** from the current menu price in the database, never trusted from client input.
- **Inventory deduction uses an explicit 1:1 mapping**: a `MenuItem` can optionally link to one `Inventory` item via `linkedInventoryItem`, with a `consumptionQty` per unit ordered. Menu items without a mapping don't affect inventory.
- **Order validation happens in two passes**: all items are validated (existence, availability, sufficient stock) before any inventory is deducted, to avoid partial deduction if a later item in the order fails validation.
- **Reservation availability** checks the requested table's capacity and any existing *confirmed* reservation for the same table, date, and time — rather than relying solely on the table's global status field.
- **Reservation cancellation** is a soft delete: the `DELETE` endpoint sets `status: "cancelled"` rather than removing the document, preserving history.

## Testing

All endpoints were manually tested with `curl` during development. Example:

```bash
curl -X POST http://localhost:5003/api/menu \
  -H "Content-Type: application/json" \
  -d '{"name": "Paneer Butter Masala", "description": "Creamy paneer curry", "price": 220, "category": "main course"}'
```

## Author

Built as part of the CodeAlpha Backend Development Internship.
