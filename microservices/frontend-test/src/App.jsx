import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { Container, Nav, Navbar } from 'react-bootstrap';
import ProductsPage from './components/products/ProductsPage';
import UsersPage from './components/users/UsersPage';
import OrdersPage from './components/orders/OrdersPage';

function App() {
  return (
    <div className="App">
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/">E-commerce API Tester</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/products">Products API</Nav.Link>
              <Nav.Link as={Link} to="/users">Users API</Nav.Link>
              <Nav.Link as={Link} to="/orders">Orders API</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="mt-4">
        <Routes>
          <Route path="/" element={
            <div className="jumbotron">
              <h1>E-commerce API Test Frontend</h1>
              <p className="lead">
                Use this application to test all API endpoints of the microservices.
                Select a service from the navigation above to begin testing.
              </p>
              <hr className="my-4" />
              <div className="row">
                <div className="col-md-4 mb-3">
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title">Product Service</h5>
                      <p className="card-text">Test product catalog and inventory management</p>
                      <Link to="/products" className="btn btn-primary">Test Products API</Link>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 mb-3">
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title">User Service</h5>
                      <p className="card-text">Test user authentication and management</p>
                      <Link to="/users" className="btn btn-primary">Test Users API</Link>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 mb-3">
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title">Order Service</h5>
                      <p className="card-text">Test order processing and status tracking</p>
                      <Link to="/orders" className="btn btn-primary">Test Orders API</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          } />
          <Route path="/products/*" element={<ProductsPage />} />
          <Route path="/users/*" element={<UsersPage />} />
          <Route path="/orders/*" element={<OrdersPage />} />
        </Routes>
      </Container>
    </div>
  );
}

export default App;
