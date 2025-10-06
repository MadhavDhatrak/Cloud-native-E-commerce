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
