import React from 'react';
import { Button, Card } from 'react-bootstrap';

function ProductDetail({ product, onEdit, onDelete }) {
  return (
    <div>
      <h3>Product Details</h3>
      <Card>
        <Card.Header>
          <h4>{product.name}</h4>
        </Card.Header>
        <Card.Body>
          <p><strong>ID:</strong> {product._id || product.id}</p>
          <p><strong>Description:</strong> {product.description || 'N/A'}</p>
          <p><strong>Price:</strong> ${product.price.toFixed(2)}</p>
          <p><strong>Stock:</strong> {product.stock}</p>
          {product.createdAt && <p><strong>Created:</strong> {new Date(product.createdAt).toLocaleString()}</p>}
          {product.updatedAt && <p><strong>Updated:</strong> {new Date(product.updatedAt).toLocaleString()}</p>}
        </Card.Body>
        <Card.Footer>
          <Button 
            variant="warning" 
            className="me-2"
            onClick={() => onEdit(product)}
          >
            Edit
          </Button>
          <Button 
            variant="danger"
            onClick={() => onDelete(product._id || product.id)}
          >
            Delete
          </Button>
        </Card.Footer>
      </Card>
    </div>
  );
}

export default ProductDetail;
