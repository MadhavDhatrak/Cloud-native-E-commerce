# Cloud-native E-commerce Microservices

This project implements a cloud-native e-commerce platform using a microservices architecture. It consists of four main services:

1. **Product Service**: Manages product catalog and inventory
2. **User Service**: Handles user authentication and profile management
3. **Order Service**: Processes orders and tracks their status
4. **API Gateway**: Single entry point that routes requests to appropriate services

## Architecture

```
                   ┌─────────────────┐
                   │                 │
                   │   API Gateway   │
                   │   (Port 3000)   │
                   │                 │
                   └────────┬────────┘
                            │
              ┌─────────────┼─────────────┐
              │             │             │
    ┌─────────▼─────┐ ┌─────▼─────┐ ┌─────▼─────┐
    │               │ │           │ │           │
    │Product Service│ │User Service│ │Order Service│
    │  (Port 3001)  │ │(Port 3002)│ │(Port 3003)│
    │               │ │           │ │           │
    └───────┬───────┘ └─────┬─────┘ └─────┬─────┘
            │               │             │
            └───────────────┼─────────────┘
                            │
                    ┌───────▼───────┐
                    │               │
                    │   MongoDB     │
                    │  (Port 27017) │
                    │               │
                    └───────────────┘
```

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

## Getting Started

1. Clone the repository:
```
git clone <repository-url>
cd Cloud-native-E-commerce
```

2. Set up environment variables:
   - Create `.env` files in each service directory following the examples in `.env.example`

3. Install dependencies for each service:
```bash
cd microservices/product-service && npm install
cd ../user-service && npm install
cd ../order-service && npm install
cd ../api-gateway && npm install
```

4. Start each service (in separate terminals):
```bash
# Terminal 1 - Product Service
cd microservices/product-service && npm run dev

# Terminal 2 - User Service
cd microservices/user-service && npm run dev

# Terminal 3 - Order Service
cd microservices/order-service && npm run dev

# Terminal 4 - API Gateway
cd microservices/api-gateway && npm run dev
```

## API Endpoints

All requests should go through the API Gateway at `http://localhost:3000`

### Product Service
- `POST /products` - Create a new product
- `GET /products` - Get all products
- `GET /products/:id` - Get a product by ID
- `PUT /products/:id` - Update a product
- `DELETE /products/:id` - Delete a product

### User Service
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login a user
- `GET /auth` - Get all users
- `GET /auth/:id` - Get a user by ID
- `PUT /auth/:id` - Update a user
- `DELETE /auth/:id` - Delete a user

### Order Service
- `POST /orders` - Create a new order
- `GET /orders` - Get all orders
- `GET /orders/user/:userId` - Get orders by user ID
- `GET /orders/:id` - Get an order by ID
- `PATCH /orders/:id/status` - Update order status
- `PATCH /orders/:id/payment` - Update payment status
- `PATCH /orders/:id/cancel` - Cancel an order

## Project Structure

```
microservices/
├── api-gateway/
│   ├── src/
│   │   └── index.js
│   ├── .env
│   └── package.json
├── product-service/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── db/
│   │   └── index.js
│   ├── .env
│   └── package.json
├── user-service/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── db/
│   │   └── index.js
│   ├── .env
│   └── package.json
├── order-service/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── db/
│   │   └── index.js
│   ├── .env
│   └── package.json
└── .gitignore
```

## Testing with Postman

Import the Postman collection from `postman/Cloud-native-E-commerce.postman_collection.json` to test all API endpoints.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
