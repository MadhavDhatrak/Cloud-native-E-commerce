output "mongodb_secret_arn" {
  value       = aws_secretsmanager_secret.mongodb_uri.arn
  description = "ARN of the MongoDB URI secret"
}

output "mongodb_secret_name" {
  value       = aws_secretsmanager_secret.mongodb_uri.name
  description = "Name of the MongoDB URI secret"
}

output "secrets_policy_arn" {
  value       = aws_iam_policy.secrets_reader_policy.arn
  description = "IAM policy ARN for accessing MongoDB secrets"
}