import React, { useState, useEffect } from 'react';
import { Table, Button, Spinner } from 'react-bootstrap';
import { productService } from '../../services/api';

function ProductList({ onViewProduct, onEditProduct, onDeleteProduct, setResponseData, setError }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      setError(null);
      const response = await productService.getAll();
      setProducts(response.data);
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
        <h3>Product List</h3>
        <Button onClick={fetchProducts} disabled={loading}>
          {loading ? <><Spinner size="sm" animation="border" /> Refreshing...</> : 'Refresh'}
        </Button>
      </div>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
          <p>Loading products...</p>
        </div>
      ) : products.length > 0 ? (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id || product.id}>
                <td>{product._id || product.id}</td>
                <td>{product.name}</td>
                <td>${product.price.toFixed(2)}</td>
                <td>
                  <Button 
                    variant="info" 
                    size="sm" 
                    className="me-2"
                    onClick={() => onViewProduct(product)}
                  >
                    View
                  </Button>
                  <Button 
                    variant="warning" 
                    size="sm" 
                    className="me-2"
                    onClick={() => onEditProduct(product)}
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="danger" 
                    size="sm"
                    onClick={() => onDeleteProduct(product._id || product.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <div className="alert alert-info">No products found.</div>
      )}
    </div>
  );
}

export default ProductList;
