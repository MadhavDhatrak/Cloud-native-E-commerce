# Cloud-Native E-Commerce Platform

A production-ready, cloud-native e-commerce platform built with microservices architecture, deployed on AWS EKS with automated CI/CD.

## 🚀 Overview

This project demonstrates a complete cloud-native application with:

- **Microservices Architecture**: 5 independently deployable services
- **Container Orchestration**: Kubernetes (AWS EKS)
- **Infrastructure as Code**: Terraform for AWS resources
- **CI/CD Pipeline**: GitHub Actions with automated builds and deployments
- **Package Management**: Helm charts for Kubernetes deployments
- **Cloud-Native Storage**: MongoDB Atlas
- **Secrets Management**: AWS Secrets Manager + External Secrets Operator

## 🏗️ Architecture

### Services

1. **Frontend Service** (React + Vite + Nginx) - Port 80
   - User interface for the e-commerce platform
   - Service Type: LoadBalancer (public-facing)

2. **API Gateway** (Node.js + Express) - Port 3000
   - Single entry point for all backend requests
   - Routes to appropriate microservices
   - Service Type: LoadBalancer (public-facing)

3. **User Service** (Node.js + Express) - Port 3002
   - User authentication and profile management
   - Service Type: ClusterIP (internal only)

4. **Product Service** (Node.js + Express) - Port 3001
   - Product catalog and inventory management
   - Service Type: ClusterIP (internal only)

5. **Order Service** (Node.js + Express) - Port 3003
   - Order processing and tracking
   - Service Type: ClusterIP (internal only)

### Cloud Infrastructure

```
Internet → AWS ALB → EKS Cluster → Microservices → MongoDB Atlas
            ↓
        AWS VPC (10.0.0.0/16)
        ├── Public Subnets (3 AZs)
        │   ├── NAT Gateways
        │   └── Load Balancers
        └── Private Subnets (3 AZs)
            └── EKS Worker Nodes (t3.small)
                └── Kubernetes Pods
```


## 🛠️ Technology Stack

| Component | Technology |
|-----------|-----------|
| **Frontend** | React, Vite, Nginx |
| **Backend** | Node.js, Express.js, Mongoose |
| **Database** | MongoDB Atlas |
| **Container Orchestration** | Kubernetes (AWS EKS v1.33) |
| **Container Registry** | AWS ECR |
| **Infrastructure** | Terraform |
| **Deployment** | Helm |
| **CI/CD** | GitHub Actions |
| **Secrets** | AWS Secrets Manager, External Secrets Operator |
| **Networking** | AWS VPC, NAT Gateway, Application Load Balancer |

## 📋 Prerequisites

### For Infrastructure Setup:
- AWS Account with appropriate permissions
- AWS CLI configured
- Terraform (v1.0+)
- MongoDB Atlas account
- kubectl
- Helm 3.x

### For Local Development:
- Node.js (v16 or higher)
- Docker & Docker Compose
- Git

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Cloud-native-E-commerce
```

### 2. Infrastructure Setup

#### Configure Terraform Variables

Create `terraform/terraform.tfvars`:

```hcl
aws_region    = "ap-south-1"
project_name  = "ecommerce"
environment   = "dev"
mongodb_uri   = "your-mongodb-atlas-connection-string"
```

#### Deploy Infrastructure

```bash
cd terraform
terraform init
terraform plan
terraform apply
```

This provisions:
- VPC with public/private subnets across 3 AZs
- EKS cluster (v1.33)
- ECR repositories (5 repos for services)
- AWS Secrets Manager
- IAM roles and policies

#### Update Kubeconfig

```bash
aws eks update-kubeconfig --region ap-south-1 --name ecommerce-dev-cluster
```

### 3. Deploy External Secrets Operator

```bash
helm repo add external-secrets https://charts.external-secrets.io
helm install external-secrets external-secrets/external-secrets -n external-secrets-system --create-namespace
```

### 4. Configure Secrets

Apply the cluster secret store and external secret:

```bash
kubectl apply -f helm/cluster-secret-store.yaml
kubectl apply -f helm/external-secret.yaml
```

### 5. Set Up GitHub Secrets

Add these secrets to your GitHub repository:

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`

### 6. Deploy Services

Push to the `main` branch to trigger the CI/CD pipeline, or deploy manually:

```bash
# Build and push images to ECR
docker build -t <ECR_REGISTRY>/ecommerce-dev-frontend-test:latest ./microservices/frontend-test
docker push <ECR_REGISTRY>/ecommerce-dev-frontend-test:latest

# Deploy with Helm
helm upgrade --install frontend-test ./helm/charts/frontend-test
helm upgrade --install api-gateway ./helm/charts/api-gateway
helm upgrade --install user-service ./helm/charts/user-service
helm upgrade --install product-service ./helm/charts/product-service
helm upgrade --install order-service ./helm/charts/order-service
```

### 7. Access the Application

Get the LoadBalancer URLs:

```bash
kubectl get services
```

- **Frontend**: `http://<frontend-service-EXTERNAL-IP>`
- **API Gateway**: `http://<api-gateway-EXTERNAL-IP>:3000`

## 🔄 CI/CD Pipeline

The GitHub Actions pipeline automatically:

1. ✅ Checks out code
2. ✅ Authenticates with AWS
3. ✅ Builds Docker images for all 5 services
4. ✅ Tags images with commit SHA + latest
5. ✅ Pushes images to AWS ECR
6. ✅ Deploys to EKS using Helm

**Trigger**: Push to `main` branch

## 📡 API Endpoints

All API requests go through the API Gateway.

### User Service (`/users`)
- `POST /users/register` - Register a new user
- `POST /users/login` - Login a user
- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Product Service (`/products`)
- `POST /products` - Create a new product
- `GET /products` - Get all products
- `GET /products/:id` - Get product by ID
- `PUT /products/:id` - Update product
- `DELETE /products/:id` - Delete product

### Order Service (`/orders`)
- `POST /orders` - Create a new order
- `GET /orders` - Get all orders
- `GET /orders/user/:userId` - Get orders by user ID
- `GET /orders/:id` - Get order by ID
- `PATCH /orders/:id/status` - Update order status
- `PATCH /orders/:id/payment` - Update payment status
- `PATCH /orders/:id/cancel` - Cancel an order

## 📁 Project Structure

```
Cloud-native-E-commerce/
├── .github/
│   └── workflows/
│       └── ci-cd-pipeline.yml          # GitHub Actions CI/CD
├── microservices/
│   ├── frontend-test/                  # React frontend
│   │   ├── src/
│   │   ├── Dockerfile
│   │   └── nginx.conf
│   ├── api-gateway/                    # API Gateway
│   │   ├── src/
│   │   │   └── index.js
│   │   └── Dockerfile
│   ├── user-service/                   # User microservice
│   │   ├── src/
│   │   │   ├── controllers/
│   │   │   ├── models/
│   │   │   ├── routes/
│   │   │   └── db/
│   │   └── Dockerfile
│   ├── product-service/                # Product microservice
│   │   ├── src/
│   │   │   ├── controllers/
│   │   │   ├── models/
│   │   │   ├── routes/
│   │   │   └── db/
│   │   └── Dockerfile
│   └── order-service/                  # Order microservice
│       ├── src/
│       │   ├── controllers/
│       │   ├── models/
│       │   ├── routes/
│       │   └── db/
│       └── Dockerfile
├── helm/
│   ├── charts/
│   │   ├── frontend-test/              # Frontend Helm chart
│   │   ├── api-gateway/                # API Gateway Helm chart
│   │   ├── user-service/               # User service Helm chart
│   │   ├── product-service/            # Product service Helm chart
│   │   └── order-service/              # Order service Helm chart
│   ├── cluster-secret-store.yaml       # AWS Secrets integration
│   └── external-secret.yaml            # MongoDB secret sync
├── terraform/
│   ├── main.tf                         # Main Terraform config
│   ├── variables.tf
│   ├── outputs.tf
│   └── modules/
│       ├── vpc/                        # VPC module
│       ├── eks/                        # EKS cluster module
│       ├── ecr/                        # Container registry module
│       └── secrets-manager/            # Secrets management module
├── ARCHITECTURE.md                     # Detailed architecture documentation
└── README.md
```

## 🔐 Security Features

- ✅ **Network Isolation**: Backend services in private subnets
- ✅ **ClusterIP Services**: Internal services not exposed externally
- ✅ **Secrets Management**: AWS Secrets Manager for sensitive data
- ✅ **IAM Roles**: Fine-grained permissions for EKS nodes
- ✅ **Container Scanning**: ECR image scanning enabled
- ✅ **Multi-AZ Deployment**: High availability across 3 availability zones

## 📊 Monitoring & Operations

### Check Deployment Status

```bash
# View all pods
kubectl get pods -n default

# View all services
kubectl get services -n default

# Check pod logs
kubectl logs <pod-name> -n default

# Describe a pod
kubectl describe pod <pod-name> -n default
```

### Scale Services

```bash
# Scale a deployment
kubectl scale deployment user-service --replicas=3

# Or update Helm values
helm upgrade user-service ./helm/charts/user-service --set replicaCount=3
```

## 🧪 Local Development (Optional)

For local testing with Docker Compose:

```bash
# Start all services locally
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For issues or questions, please open an issue on GitHub.

---

**Built with ❤️ using modern cloud-native technologies**




