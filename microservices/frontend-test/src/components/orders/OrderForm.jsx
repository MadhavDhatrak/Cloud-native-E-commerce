import React, { useState } from 'react';
import { Form, Button, Spinner, Row, Col } from 'react-bootstrap';
import { orderService } from '../../services/api';

function OrderForm({ setResponseData, setError, onSuccess }) {
  const [formData, setFormData] = useState({
    userId: '',
    items: [{ productId: '', name: '', price: '', quantity: 1 }],
    totalAmount: 0,
    shippingAddress: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Calculate total amount when items change
  const calculateTotal = () => {
    return formData.items.reduce((total, item) => {
      return total + (Number(item.price) * Number(item.quantity));
    }, 0);
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: field === 'price' || field === 'quantity' ? Number(value) : value
    };
    const newFormData = { ...formData, items: updatedItems };
    // Update total amount
    newFormData.totalAmount = updatedItems.reduce((total, item) => {
      return total + (Number(item.price || 0) * Number(item.quantity || 0));
    }, 0);
    setFormData(newFormData);
  };

  const addItem = () => {
    const newItems = [
      ...formData.items,
      { productId: '', name: '', price: '', quantity: 1 }
    ];
    setFormData({
      ...formData,
      items: newItems,
      totalAmount: newItems.reduce((total, item) => {
        return total + (Number(item.price || 0) * Number(item.quantity || 0));
      }, 0)
    });
  };

  const removeItem = (index) => {
    const updatedItems = [...formData.items];
    updatedItems.splice(index, 1);
    setFormData({ 
      ...formData, 
      items: updatedItems,
      totalAmount: updatedItems.reduce((total, item) => {
        return total + (Number(item.price || 0) * Number(item.quantity || 0));
      }, 0)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      setError(null);
      // Calculate the final total amount just to be sure
      const totalAmount = formData.items.reduce((total, item) => {
        return total + (Number(item.price) * Number(item.quantity));
      }, 0);
      
      const data = {
        userId: formData.userId,
        items: formData.items,
        totalAmount: totalAmount,
        shippingAddress: formData.shippingAddress
      };

      const response = await orderService.create(data);
      setResponseData({ action: 'create', data: response.data });

      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>Create Order</h3>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>User ID</Form.Label>
          <Form.Control
            type="text"
            name="userId"
            value={formData.userId}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <h5>Items</h5>
        {formData.items.map((item, index) => (
          <div key={index} className="card mb-3 p-3">
            <Row>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Product ID</Form.Label>
                  <Form.Control
                    type="text"
                    value={item.productId}
                    onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={item.name}
                    onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group className="mb-3">
                  <Form.Label>Price</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    value={item.price}
                    onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group className="mb-3">
                  <Form.Label>Quantity</Form.Label>
                  <Form.Control
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={2} className="d-flex align-items-end mb-3">
                <Button 
                  variant="danger" 
                  size="sm"
                  onClick={() => removeItem(index)}
                  disabled={formData.items.length <= 1}
                >
                  Remove
                </Button>
              </Col>
            </Row>
          </div>
        ))}
        
        <Button 
          variant="secondary" 
          className="mb-4"
          onClick={addItem}
          type="button"
        >
          Add Item
        </Button>

        <h5>Shipping Address</h5>
        <Form.Group className="mb-4">
          <Form.Label>Shipping Address</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="shippingAddress"
            value={formData.shippingAddress}
            onChange={handleChange}
            placeholder="e.g. 123 Main St, Anytown, USA 12345"
            required
          />
        </Form.Group>
        
        <Form.Group className="mb-4">
          <Form.Label>Total Amount (Calculated)</Form.Label>
          <Form.Control
            type="number"
            step="0.01"
            value={formData.totalAmount.toFixed(2)}
            disabled
            readOnly
          />
        </Form.Group>

        <Button type="submit" disabled={loading}>
          {loading ? <><Spinner size="sm" animation="border" /> Creating Order...</> : 'Create Order'}
        </Button>
      </Form>
    </div>
  );
}

export default OrderForm;
