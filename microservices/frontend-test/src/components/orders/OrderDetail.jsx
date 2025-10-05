import React, { useState } from 'react';
import { Button, Card, Table, Form } from 'react-bootstrap';
import { orderService } from '../../services/api';

function OrderDetail({ order, setResponseData, setError, onStatusUpdate }) {
  const [loading, setLoading] = useState({
    status: false,
    payment: false,
    cancel: false
  });
  const [orderStatus, setOrderStatus] = useState(order.status || 'Pending');
  const [paymentStatus, setPaymentStatus] = useState(order.paymentStatus || 'Pending');

  const updateOrderStatus = async () => {
    setLoading({...loading, status: true});
    try {
      setError(null);
      console.log('Updating order status:', order._id || order.id, orderStatus);
      
      // Using direct axios call instead of service to debug
      const orderId = order._id || order.id;
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "status": orderStatus })
      });
      
      const data = await response.json();
      console.log('Status update response:', data);
      
      setResponseData({ action: 'update-status', data: data });
      if (onStatusUpdate) onStatusUpdate();
    } catch (err) {
      console.error('Status update error:', err);
      setError(err.response?.data || err.message);
    } finally {
      setLoading({...loading, status: false});
    }
  };

  const updatePaymentStatus = async () => {
    setLoading({...loading, payment: true});
    try {
      setError(null);
      console.log('Updating payment status:', order._id || order.id, paymentStatus);
      
      // Using direct fetch call instead of service to debug
      const orderId = order._id || order.id;
      const response = await fetch(`/api/orders/${orderId}/payment`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "paymentStatus": paymentStatus })
      });
      
      const data = await response.json();
      console.log('Payment update response:', data);
      
      setResponseData({ action: 'update-payment', data: data });
      if (onStatusUpdate) onStatusUpdate();
    } catch (err) {
      console.error('Payment update error:', err);
      setError(err.response?.data || err.message);
    } finally {
      setLoading({...loading, payment: false});
    }
  };

  const cancelOrder = async () => {
    setLoading({...loading, cancel: true});
    try {
      setError(null);
      console.log('Canceling order:', order._id || order.id);
      
      // Using direct fetch call instead of service
      const orderId = order._id || order.id;
      const response = await fetch(`/api/orders/${orderId}/cancel`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      const data = await response.json();
      console.log('Cancel order response:', data);
      
      setResponseData({ action: 'cancel', data: data });
      if (onStatusUpdate) onStatusUpdate();
    } catch (err) {
      console.error('Cancel order error:', err);
      setError(err.response?.data || err.message);
    } finally {
      setLoading({...loading, cancel: false});
    }
  };

  return (
    <div>
      <h3>Order Details</h3>
      <Card className="mb-4">
        <Card.Header>
          <h4>Order #{order._id || order.id}</h4>
        </Card.Header>
        <Card.Body>
          <p><strong>User ID:</strong> {order.userId}</p>
          <p><strong>Total Amount:</strong> ${order.totalAmount?.toFixed(2)}</p>
          <p>
            <strong>Status:</strong> 
            <span className={`badge bg-${getStatusBadgeColor(order.status)} ms-2`}>
              {order.status}
            </span>
          </p>
          <p>
            <strong>Payment Status:</strong>
            <span className={`badge bg-${getPaymentStatusBadgeColor(order.paymentStatus)} ms-2`}>
              {order.paymentStatus}
            </span>
          </p>
          {order.createdAt && <p><strong>Created:</strong> {new Date(order.createdAt).toLocaleString()}</p>}
          {order.updatedAt && <p><strong>Updated:</strong> {new Date(order.updatedAt).toLocaleString()}</p>}
        </Card.Body>
      </Card>

      <h5>Items</h5>
      <Table striped bordered>
        <thead>
          <tr>
            <th>Product ID</th>
            <th>Name</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {order.items?.map((item, index) => (
            <tr key={index}>
              <td>{item.productId}</td>
              <td>{item.name}</td>
              <td>${item.price?.toFixed(2)}</td>
              <td>{item.quantity}</td>
              <td>${(item.price * item.quantity).toFixed(2)}</td>
            </tr>
          ))}
          <tr>
            <td colSpan="4" className="text-end"><strong>Total:</strong></td>
            <td><strong>${calculateTotal(order).toFixed(2)}</strong></td>
          </tr>
        </tbody>
      </Table>

      <h5>Shipping Address</h5>
      <Card className="mb-4">
        <Card.Body>
          <p>{order.shippingAddress}</p>
        </Card.Body>
      </Card>

      <h5>Update Order</h5>
      <div className="row">
        <div className="col-md-4 mb-3">
          <Card>
            <Card.Body>
              <h6>Update Order Status</h6>
              <Form.Group className="mb-3">
                <Form.Select 
                  value={orderStatus} 
                  onChange={(e) => setOrderStatus(e.target.value)}
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                </Form.Select>
              </Form.Group>
              <Button 
                variant="primary" 
                onClick={updateOrderStatus} 
                disabled={loading.status || order.status === 'cancelled'}
              >
                {loading.status ? 'Updating...' : 'Update Status'}
              </Button>
            </Card.Body>
          </Card>
        </div>
        
        <div className="col-md-4 mb-3">
          <Card>
            <Card.Body>
              <h6>Update Payment Status</h6>
              <Form.Group className="mb-3">
                <Form.Select 
                  value={paymentStatus} 
                  onChange={(e) => setPaymentStatus(e.target.value)}
                >
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                  <option value="Failed">Failed</option>
                </Form.Select>
              </Form.Group>
              <Button 
                variant="success" 
                onClick={updatePaymentStatus} 
                disabled={loading.payment || order.status === 'cancelled'}
              >
                {loading.payment ? 'Updating...' : 'Update Payment'}
              </Button>
            </Card.Body>
          </Card>
        </div>
        
        <div className="col-md-4 mb-3">
          <Card>
            <Card.Body>
              <h6>Cancel Order</h6>
              <p>This action cannot be undone.</p>
              <Button 
                variant="danger" 
                onClick={cancelOrder} 
                disabled={loading.cancel || order.status === 'cancelled'}
              >
                {loading.cancel ? 'Cancelling...' : 'Cancel Order'}
              </Button>
            </Card.Body>
          </Card>
        </div>
      </div>
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

export default OrderDetail;
