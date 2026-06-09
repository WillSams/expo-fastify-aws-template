resource "aws_cloudwatch_log_group" "ecs" {
  name              = "/ecs/${var.environment}-${var.app_name}-api"
  retention_in_days = var.log_retention_in_days
}

resource "aws_cloudwatch_log_group" "api_gateway" {
  name              = "/aws/apigateway/${var.environment}-${var.app_name}-api"
  retention_in_days = var.log_retention_in_days
}
