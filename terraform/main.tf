provider "aws" {
  region = var.aws_region
}

locals {
  microservices = [
    "api-gateway",
    "frontend-test",
    "order-service",
    "product-service",
    "user-service"
  ]
  
  repository_names = [for service in local.microservices : "${var.project_name}-${var.environment}-${service}"]
  
  common_tags = {
    Project     = var.project_name
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}




module "ecr" {
  source = "./modules/ecr"
  
  repository_names    = local.repository_names
  image_tag_mutability = "MUTABLE"
  scan_on_push        = true
  tags                = local.common_tags
}

module "vpc" {
  source = "./modules/vpc"
  vpc_name = "${var.project_name}-${var.environment}-vpc"
  vpc_cidr = "10.0.0.0/16"
  tags = local.common_tags
}

# Add Secrets Manager module for MongoDB credentials (before EKS to get policy ARN)
module "secrets_manager" {
  source      = "./modules/secrets-manager"
  mongodb_uri = var.mongodb_uri
}

module "eks" {
  source = "./modules/eks"
  cluster_name = "${var.project_name}-${var.environment}-cluster"
  project_name = var.project_name
  environment = var.environment
  kubernetes_version = "1.33"
  vpc_id = module.vpc.vpc_id
  subnet_ids = module.vpc.private_subnets
  control_plane_subnet_ids = module.vpc.public_subnets
  instance_types = ["t3.small"]
  min_size = 2
  max_size = 10
  desired_size = 2
  
  # Attach the MongoDB secrets reader policy to the node group
  additional_iam_policies = {
    SecretsManagerPolicy = module.secrets_manager.secrets_policy_arn
  }
}