import React, { useState } from 'react';
import { Form, Button, Spinner } from 'react-bootstrap';
import { productService } from '../../services/api';

function ProductForm({ product, setResponseData, setError, onSuccess }) {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || '',
    stock: product?.stock || 0
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      setError(null);
      // Convert numeric fields
      const data = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock)
      };

      let response;
      if (product) {
        response = await productService.update(product._id || product.id, data);
        setResponseData({ action: 'update', data: response.data });
      } else {
        response = await productService.create(data);
        setResponseData({ action: 'create', data: response.data });
      }

      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>{product ? 'Edit Product' : 'Create Product'}</h3>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Price</Form.Label>
          <Form.Control
            type="number"
            step="0.01"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Stock</Form.Label>
          <Form.Control
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Button type="submit" disabled={loading}>
          {loading ? 
            <><Spinner size="sm" animation="border" /> {product ? 'Updating...' : 'Creating...'}</> : 
            (product ? 'Update Product' : 'Create Product')}
        </Button>
      </Form>
    </div>
  );
}

export default ProductForm;
