import React, { useState } from 'react';
import { Tab, Nav, Row, Col } from 'react-bootstrap';
import { productService } from '../../services/api';
import ProductList from './ProductList';
import ProductForm from './ProductForm';
import ProductDetail from './ProductDetail';

function ProductsPage() {
  const [activeKey, setActiveKey] = useState('list');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState(null);

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setActiveKey('view');
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setActiveKey('edit');
  };

  const handleDeleteProduct = async (id) => {
    try {
      setError(null);
      const response = await productService.delete(id);
      setResponseData({ action: 'delete', data: response.data });
      setSelectedProduct(null);
      setActiveKey('list');
    } catch (err) {
      setError(err.response?.data || err.message);
    }
  };

  return (
    <div>
      <h2>Product Service API Testing</h2>
      <Tab.Container activeKey={activeKey} onSelect={setActiveKey}>
        <Row>
          <Col sm={3}>
            <Nav variant="pills" className="flex-column">
              <Nav.Item>
                <Nav.Link eventKey="list">List Products</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="create">Create Product</Nav.Link>
              </Nav.Item>
              {selectedProduct && (
                <>
                  <Nav.Item>
                    <Nav.Link eventKey="view">View Product</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="edit">Edit Product</Nav.Link>
                  </Nav.Item>
                </>
              )}
            </Nav>
          </Col>
          <Col sm={9}>
            <Tab.Content>
              <Tab.Pane eventKey="list">
                <ProductList 
                  onViewProduct={handleViewProduct} 
                  onEditProduct={handleEditProduct}
                  onDeleteProduct={handleDeleteProduct}
                  setResponseData={setResponseData}
                  setError={setError}
                />
              </Tab.Pane>
              <Tab.Pane eventKey="create">
                <ProductForm 
                  setResponseData={setResponseData}
                  setError={setError}
                  onSuccess={() => setActiveKey('list')}
                />
              </Tab.Pane>
              {selectedProduct && (
                <>
                  <Tab.Pane eventKey="view">
                    <ProductDetail 
                      product={selectedProduct}
                      onEdit={handleEditProduct}
                      onDelete={handleDeleteProduct}
                    />
                  </Tab.Pane>
                  <Tab.Pane eventKey="edit">
                    <ProductForm 
                      product={selectedProduct}
                      setResponseData={setResponseData}
                      setError={setError}
                      onSuccess={() => setActiveKey('list')}
                    />
                  </Tab.Pane>
                </>
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

export default ProductsPage;
