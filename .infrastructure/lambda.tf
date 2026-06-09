resource "aws_lambda_function" "this" {
  function_name = "${var.environment}-${var.function_name}"
  timeout       = var.function_timeout
  image_uri     = "${local.account_id}.dkr.ecr.${var.region}.amazonaws.com/${var.function_name}:latest"
  package_type  = "Image"

  role = aws_iam_role.lambda_function_role.arn

  environment {
    variables = {
      ENVIRONMENT = var.environment
      ABOUT_MESSAGE = "This message should not exist.  Did you not modify the template?"
    }
  }

  depends_on = [
    aws_iam_role_policy_attachment.lambda_logs,
    aws_cloudwatch_log_group.lambda,
  ]
}