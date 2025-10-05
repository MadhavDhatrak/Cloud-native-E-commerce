import React, { useState } from 'react';
import { Tab, Nav, Row, Col } from 'react-bootstrap';
import OrderList from './OrderList';
import OrderForm from './OrderForm';
import OrderDetail from './OrderDetail';
import OrderByUser from './OrderByUser';

function OrdersPage() {
  const [activeKey, setActiveKey] = useState('list');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState(null);

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setActiveKey('view');
  };

  return (
    <div>
      <h2>Order Service API Testing</h2>
      <Tab.Container activeKey={activeKey} onSelect={setActiveKey}>
        <Row>
          <Col sm={3}>
            <Nav variant="pills" className="flex-column">
              <Nav.Item>
                <Nav.Link eventKey="list">All Orders</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="create">Create Order</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="user">Orders by User</Nav.Link>
              </Nav.Item>
              {selectedOrder && (
                <Nav.Item>
                  <Nav.Link eventKey="view">View Order</Nav.Link>
                </Nav.Item>
              )}
            </Nav>
          </Col>
          <Col sm={9}>
            <Tab.Content>
              <Tab.Pane eventKey="list">
                <OrderList 
                  onViewOrder={handleViewOrder}
                  setResponseData={setResponseData}
                  setError={setError}
                />
              </Tab.Pane>
              <Tab.Pane eventKey="create">
                <OrderForm 
                  setResponseData={setResponseData}
                  setError={setError}
                  onSuccess={() => setActiveKey('list')}
                />
              </Tab.Pane>
              <Tab.Pane eventKey="user">
                <OrderByUser 
                  onViewOrder={handleViewOrder}
                  setResponseData={setResponseData}
                  setError={setError}
                />
              </Tab.Pane>
              {selectedOrder && (
                <Tab.Pane eventKey="view">
                  <OrderDetail 
                    order={selectedOrder}
                    setResponseData={setResponseData}
                    setError={setError}
                    onStatusUpdate={() => setActiveKey('list')}
                  />
                </Tab.Pane>
              )}
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>

      {responseData && (
        <div className="mt-4">
          <h4>API Response</h4>
          <div className="response-container">
            <pre>{JSON.stringify(responseData, null, 2)}</pre>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 alert alert-danger">
          <h4>Error</h4>
          <pre>{JSON.stringify(error, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default OrdersPage;
