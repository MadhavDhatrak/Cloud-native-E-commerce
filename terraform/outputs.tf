output "ecr_repository_urls" {
  description = "The URLs of the ECR repositories"
  value       = module.ecr.repository_urls
}

output "ecr_repository_arns" {
  description = "The ARNs of the ECR repositories"
  value       = module.ecr.repository_arns
}
