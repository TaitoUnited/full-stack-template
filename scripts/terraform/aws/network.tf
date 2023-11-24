data "aws_vpcs" "vpcs" {
  tags = var.taito_network_tags
}

data "aws_subnets" "elasticache_subnets" {
  filter {
    name = "vpc-id"
    values = [sort(data.aws_vpcs.vpcs.ids)[0]]
  }

  tags = var.taito_cache_subnet_tags
}

data "aws_security_groups" "elasticache_security_groups" {
  tags = var.taito_cache_security_group_tags

  # Use default security group by default, if no tags have been defined
  dynamic "filter" {
    for_each = length(var.taito_cache_security_group_tags) > 0 ? [] : [1]
    content {
      name   = "group-name"
      values = ["default"]
    }
  }

  filter {
    name   = "vpc-id"
    values = [ sort(data.aws_vpcs.vpcs.ids)[0] ]
  }
}
