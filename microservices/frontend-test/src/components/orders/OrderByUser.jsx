import React, { useState } from 'react';
import { Form, Button, Spinner, Table } from 'react-bootstrap';
import { orderService } from '../../services/api';

function OrderByUser({ onViewOrder, setResponseData, setError }) {
  const [userId, setUserId] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) return;
    
    setLoading(true);
    setSubmitted(true);
    
    try {
      setError(null);
      const response = await orderService.getByUser(userId);
      setOrders(response.data);
      setResponseData({ action: 'get-by-user', data: response.data });
    } catch (err) {
      setError(err.response?.data || err.message);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>Find Orders by User</h3>
      <Form onSubmit={handleSubmit} className="mb-4">
        <Form.Group className="mb-3">
          <Form.Label>User ID</Form.Label>
          <Form.Control
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="Enter user ID"
            required
          />
        </Form.Group>
        
        <Button type="submit" disabled={loading || !userId}>
          {loading ? <><Spinner size="sm" animation="border" /> Searching...</> : 'Search'}
        </Button>
      </Form>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
          <p>Loading orders...</p>
        </div>
      ) : submitted && (
        orders.length > 0 ? (
          <>
            <h4>Orders for User: {userId}</h4>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Status</th>
                  <th>Payment</th>
                  <th>Total</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id || order.id}>
                    <td>{order._id || order.id}</td>
                    <td>
                      <span className={`badge bg-${getStatusBadgeColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>
                      <span className={`badge bg-${getPaymentStatusBadgeColor(order.paymentStatus)}`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td>${calculateTotal(order).toFixed(2)}</td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>
                      <Button 
                        variant="info" 
                        size="sm" 
                        onClick={() => onViewOrder(order)}
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </>
        ) : (
          <div className="alert alert-info">No orders found for user {userId}.</div>
        )
      )}
    </div>
  );
}

// Helper function to get appropriate badge color
function getStatusBadgeColor(status) {
  switch (status?.toLowerCase()) {
    case 'pending':
      return 'warning';
    case 'processing':
      return 'info';
    case 'shipped':
      return 'primary';
    case 'delivered':
      return 'success';
    case 'cancelled':
      return 'danger';
    default:
      return 'secondary';
  }
}

// Helper function to get payment status badge color
function getPaymentStatusBadgeColor(status) {
  switch (status?.toLowerCase()) {
    case 'paid':
      return 'success';
    case 'pending':
      return 'warning';
    case 'failed':
      return 'danger';
    default:
      return 'secondary';
  }
}

// Helper function to calculate order total
function calculateTotal(order) {
  return order.items?.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0) || order.total || 0;
}

export default OrderByUser;
