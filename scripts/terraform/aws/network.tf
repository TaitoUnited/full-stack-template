data "aws_vpcs" "vpcs" {
  tags = {
    name = var.taito_zone
  }
}

data "aws_subnet_ids" "elasticache_subnet_ids" {
  vpc_id = sort(data.aws_vpcs.vpcs.ids)[0]

  tags = {
    tier = "elasticache"
  }
}

# TODO: proper security group
data "aws_security_groups" "security_groups" {
  filter {
    name   = "group-name"
    values = ["default"]
  }

  filter {
    name   = "vpc-id"
    values = [ sort(data.aws_vpcs.vpcs.ids)[0] ]
  }
}
