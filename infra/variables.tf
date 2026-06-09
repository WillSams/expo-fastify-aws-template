variable "region" {
  description = "AWS region to deploy resources in"
  default     = "us-east-1"
}

variable "environment" {
  description = "Deployment environment name (e.g. demo, staging, prod)"
}

variable "app_name" {
  description = "Base name used to prefix all resources"
  default     = "template"
}

variable "log_retention_in_days" {
  description = "CloudWatch log retention period in days"
  default     = 30
}

variable "frontend_bucket_name" {
  description = "Base name for the S3 bucket hosting static web assets"
  default     = "template-frontend"
}

variable "allowed_origins" {
  description = "List of allowed CORS origins for the API Gateway"
  type        = list(string)
  # WARNING: restrict to your domain(s) before going to prod
  default = ["*"]
}

# ECS / API
variable "api_port" {
  description = "Port the Fastify server listens on inside the container"
  default     = 8080
}

variable "api_cpu" {
  description = "Fargate task CPU units (256 = 0.25 vCPU)"
  default     = 256
}

variable "api_memory" {
  description = "Fargate task memory in MB"
  default     = 512
}

variable "api_desired_count" {
  description = "Number of ECS tasks to run"
  default     = 1
}

# RDS
variable "db_name" {
  description = "Name of the Postgres database"
  default     = "app"
}

variable "db_username" {
  description = "Postgres master username"
  default     = "appuser"
}

variable "db_password" {
  description = "Postgres master password — use a secret manager in prod"
  sensitive   = true
}
