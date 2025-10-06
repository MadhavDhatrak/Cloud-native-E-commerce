resource "aws_ecr_repository" "ecr_repository" {
  for_each             = toset(var.repository_names)
  name                 = each.key
  image_tag_mutability = var.image_tag_mutability
  
  image_scanning_configuration {
    scan_on_push = var.scan_on_push
  }

  tags = var.tags
}

resource "aws_ecr_lifecycle_policy" "lifecycle_policy" {
  for_each   = toset(var.repository_names)
  repository = aws_ecr_repository.ecr_repository[each.key].name

  policy = jsonencode({
    rules = [
      {
        rulePriority = 1
        description  = "Keep last 5 images"
        selection = {
          tagStatus     = "any"
          countType     = "imageCountMoreThan"
          countNumber   = 5
        }
        action = {
          type = "expire"
        }
      }
    ]
  })
}