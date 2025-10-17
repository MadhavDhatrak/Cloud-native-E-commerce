# Cloud-Native E-Commerce Platform

A production-ready, cloud-native e-commerce platform built with microservices architecture, deployed on AWS EKS with automated CI/CD. This project showcases modern DevOps practices and cloud-native design patterns, featuring Infrastructure as Code with Terraform, containerized microservices orchestrated by Kubernetes, secure secrets management with AWS Secrets Manager.

## 📑 Table of Contents

- [ Overview](#-overview)
- [ Architecture](#️-architecture)
  - [Services](#services)
- [ Technology Stack](#️-technology-stack)
- [ Prerequisites](#-prerequisites)
  - [For Infrastructure Setup](#for-infrastructure-setup)
  - [For Local Development](#for-local-development)
- [ Getting Started](#-getting-started)
  - [1. Clone the Repository](#1-clone-the-repository)
  - [2. Infrastructure Setup](#2-infrastructure-setup)
  - [3. Deploy External Secrets Operator](#3-deploy-external-secrets-operator)
  - [4. Configure Secrets](#4-configure-secrets)
  - [5. Set Up GitHub Secrets](#5-set-up-github-secrets)
  - [6. Deploy Services](#6-deploy-services)
  - [7. Access the Application](#7-access-the-application)
- [ CI/CD Pipeline](#-cicd-pipeline)
- [ API Endpoints](#-api-endpoints)
  - [User Service](#user-service-users)
  - [Product Service](#product-service-products)
  - [Order Service](#order-service-orders)
- [ Monitoring & Operations](#-monitoring--operations)
  - [Check Deployment Status](#check-deployment-status)
  - [Scale Services](#scale-services)
- [ Local Development](#-local-development-optional)

---

## 🚀 Overview

This project demonstrates a complete cloud-native application with:

- **Microservices Architecture**: 5 independently deployable services
- **Container Orchestration**: Kubernetes (AWS EKS)
- **Infrastructure as Code**: Terraform for AWS resources
- **CI/CD Pipeline**: GitHub Actions with automated builds and deployments
- **Package Management**: Helm charts for Kubernetes deployments
- **Cloud-Native Storage**: MongoDB Atlas
- **Secrets Management**: AWS Secrets Manager + External Secrets Operator

---

![PicsArt_10-17-12 48 28 1](https://github.com/user-attachments/assets/fb608b3d-5566-45be-831a-25c968dadd24)

---

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
- Terraform 
- MongoDB Atlas account
- kubectl
- Helm 

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
helm upgrade user-service ./helm/charts/<service-name> --set replicaCount=3
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





