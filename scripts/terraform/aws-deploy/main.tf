terraform {
  backend "s3" {
    profile = "taitounited"
    bucket  = "taito-aws-kubeless1-projects"
    region = "us-east-1"
    key  = "acme-serverless1/terraform/aws"
  }
}

provider "aws" {
  region                  = var.taito_provider_region
  profile                 = coalesce(var.taito_provider_user_profile, var.taito_organization)
  shared_credentials_file = "/home/taito/.aws/credentials"

  /* EXAMPLE: Assume role (e.g. for CI/CD)
  assume_role {
    role_arn     = "arn:aws:iam::ACCOUNT_ID:role/ROLE_NAME"
    session_name = "SESSION_NAME"
    external_id  = "EXTERNAL_ID"
  }
  */
}

locals {
  variables = (
    fileexists("${path.root}/../../terraform-${var.taito_env}-merged.yaml")
      ? yamldecode(file("${path.root}/../../terraform-${var.taito_env}-merged.yaml"))
      : jsondecode(file("${path.root}/../../terraform-merged.json.tmp"))
  )["stack"]
}

module "aws" {
  source  = "TaitoUnited/project-resources/aws"
  version = "2.0.0"

  # Create flags
  create_gateway              = true
  create_containers           = true
  create_functions            = true
  create_function_permissions = true

  # AWS provider
  account_id                  = var.taito_provider_org_id
  region                      = var.taito_provider_region
  user_profile                = coalesce(var.taito_provider_user_profile, var.taito_organization)

  # Labels
  zone_name                   = var.taito_zone
  project                     = var.taito_project
  namespace                   = var.taito_namespace

  # Secrets
  secret_resource_path        = var.taito_secret_resource_path
  secret_name_path            = var.taito_secret_name_path

  # Buckets
  static_assets_bucket        = var.taito_static_assets_bucket
  static_assets_path          = var.taito_static_assets_path
  functions_bucket            = var.taito_functions_bucket
  functions_path              = var.taito_functions_path

  # Deployment details
  env                         = var.taito_env
  build_image_tag             = var.taito_build_image_tag

  # Network
  function_subnet_ids          = data.aws_subnet_ids.private_subnet_ids.ids
  function_security_group_ids  = data.aws_security_groups.security_groups.ids

  # Additional variables as a json file
  variables                   = local.variables
}
