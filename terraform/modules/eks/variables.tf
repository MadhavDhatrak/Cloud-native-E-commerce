variable "cluster_name" {
  description = "The name of the EKS cluster"
  type        = string
  default     = "cloud-native-cluster"
}

variable "project_name" {
  description = "The name of the project"
  type        = string
  default     = "ecommerce"
}

variable "environment" {
  description = "The environment (dev, test, prod)"
  type        = string
  default     = "dev"
}

variable "kubernetes_version" {
  description = "The version of Kubernetes to use for the EKS cluster"
  type        = string
  default     = "1.33"
}

variable "vpc_id" {
  description = "The ID of the VPC to use for the EKS cluster"
  type        = string
}

variable "subnet_ids" {
  description = "The subnet IDs to use for the EKS cluster worker nodes"
  type        = list(string)
}

variable "control_plane_subnet_ids" {
  description = "The subnet IDs to use for the EKS cluster control plane"
  type        = list(string)
}

variable "instance_types" {
  description = "The instance types to use for the EKS cluster"
  type        = list(string)
  default     = ["t3.small"]
}

variable "min_size" {
  description = "The minimum number of nodes to use for the EKS cluster"
  type        = number
  default     = 2
}

variable "max_size" {
  description = "The maximum number of nodes to use for the EKS cluster"
  type        = number
  default     = 10
}

variable "desired_size" {
  description = "The desired number of nodes to use for the EKS cluster"
  type        = number
  default     = 2
}

variable "additional_iam_policies" {
  description = "Additional IAM policies to attach to node group role"
  type        = map(string)
  default     = {}
}
