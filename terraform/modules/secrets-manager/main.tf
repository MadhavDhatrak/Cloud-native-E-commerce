resource "aws_secretsmanager_secret" "mongodb_uri" {
  name        = "mongodb-uri"
  description = "MongoDB connection URI for application"
  
  tags = {
    Environment = "production"
    ManagedBy   = "terraform"
  }
}

# Store the actual secret value from variable
resource "aws_secretsmanager_secret_version" "mongodb_uri_value" {
  secret_id = aws_secretsmanager_secret.mongodb_uri.id
  
  secret_string = jsonencode({
    MONGO_URI = var.mongodb_uri
  })
}


resource "aws_iam_policy" "secrets_reader_policy" {
  name        = "mongodb-secrets-reader-policy"
  description = "Policy to allow reading MongoDB URI from Secrets Manager"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "secretsmanager:GetSecretValue",
          "secretsmanager:DescribeSecret"
        ]
        Resource = aws_secretsmanager_secret.mongodb_uri.arn
      }
    ]
  })
}