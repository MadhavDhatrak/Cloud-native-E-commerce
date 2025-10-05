import React, { useState, useEffect } from 'react';
import { Table, Button, Spinner } from 'react-bootstrap';
import { orderService } from '../../services/api';

function OrderList({ onViewOrder, setResponseData, setError }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      setError(null);
      const response = await orderService.getAll();
      setOrders(response.data);
      setResponseData({ action: 'list', data: response.data });
    } catch (err) {
      setError(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Order List</h3>
        <Button onClick={fetchOrders} disabled={loading}>
          {loading ? <><Spinner size="sm" animation="border" /> Refreshing...</> : 'Refresh'}
        </Button>
      </div>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
          <p>Loading orders...</p>
        </div>
      ) : orders.length > 0 ? (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>User ID</th>
              <th>Status</th>
              <th>Total</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id || order.id}>
                <td>{order._id || order.id}</td>
                <td>{order.userId}</td>
                <td>
                  <span className={`badge bg-${getStatusBadgeColor(order.status)}`}>
                    {order.status}
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
      ) : (
        <div className="alert alert-info">No orders found.</div>
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

// Helper function to calculate order total
function calculateTotal(order) {
  return order.items?.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0) || order.total || 0;
}

export default OrderList;
