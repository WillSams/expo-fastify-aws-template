resource "aws_db_subnet_group" "postgres" {
  name       = "${var.environment}-${var.app_name}-db-subnet"
  subnet_ids = aws_subnet.public[*].id
}

resource "aws_db_instance" "postgres" {
  identifier        = "${var.environment}-${var.app_name}-db"
  engine            = "postgres"
  engine_version    = "16"
  instance_class    = "db.t3.micro"
  allocated_storage = 20

  db_name  = var.db_name
  username = var.db_username
  password = var.db_password

  db_subnet_group_name   = aws_db_subnet_group.postgres.name
  vpc_security_group_ids = [aws_security_group.rds.id]

  # Automated backups — set to 0 to disable (saves a bit in dev)
  backup_retention_period = 7
  skip_final_snapshot     = true

  # Keep publicly accessible = false; only ECS can reach it via security group
  publicly_accessible = false
}

output "db_address" {
  description = "RDS endpoint address"
  value       = aws_db_instance.postgres.address
  sensitive   = true
}
