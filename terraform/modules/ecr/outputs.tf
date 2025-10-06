output "repository_urls" {
  description = "The URLs of the ECR repositories"
  value       = { for name, repo in aws_ecr_repository.ecr_repository : name => repo.repository_url }
}

output "repository_arns" {
  description = "The ARNs of the ECR repositories"
  value       = { for name, repo in aws_ecr_repository.ecr_repository : name => repo.arn }
}
