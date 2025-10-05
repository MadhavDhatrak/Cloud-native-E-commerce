# E-commerce API Test Frontend

A minimal frontend application to test all the microservices API endpoints end-to-end for the Cloud-native E-commerce platform.

## Overview

This application provides a user-friendly interface to test all the API endpoints of the following microservices:

1. **Product Service** - Manage products, including CRUD operations
2. **User Service** - User authentication and management
3. **Order Service** - Order processing and tracking

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- All microservices running (product-service, user-service, order-service, api-gateway)

### Installation

1. Navigate to the frontend-test directory:
```bash
cd microservices/frontend-test
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open your browser and navigate to `http://localhost:5173`

## Features

### Product Service Testing

- List all products
- Create new products
- View product details
- Update existing products
- Delete products

### User Service Testing

- Register new users
- Login with existing users
- List all users
- View user details
- Update user information
- Delete users

### Order Service Testing

- List all orders
- Create new orders
- View order details
- Find orders by user
- Update order status
- Update payment status
- Cancel orders

## API Connection

The frontend connects to the API Gateway at `http://localhost:3000` through a proxy configuration in Vite. This ensures that all API requests are properly routed to the appropriate microservice.

## Technologies Used

- React
- React Router
- Bootstrap
- Axios
- Vite
