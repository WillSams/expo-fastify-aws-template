variable "region" {
  description = "AWS region to deploy resources in"
  default     = "us-east-1"
}

variable "environment" {
  description = "Deployment environment name (e.g. demo, staging, prod)"
}

variable "function_name" {
  description = "Base name for the Lambda function"
  default     = "fastify-template-function"
}

variable "function_timeout" {
  description = "Lambda function timeout in seconds"
  default     = 10
}

variable "log_retention_in_days" {
  description = "CloudWatch log retention period in days"
  default     = 30
}

variable "frontend_bucket_name" {
  description = "Base name for the S3 bucket hosting the React frontend"
  default     = "template-frontend"
}

variable "allowed_origins" {
  description = "List of allowed CORS origins for the API Gateway"
  type        = list(string)
  # WARNING: "*" allows all origins. Restrict this to your frontend domain(s) before going to prod.
  default = ["*"]
}
