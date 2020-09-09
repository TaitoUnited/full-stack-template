# AWS provider

variable "taito_provider_org_id" {
  type = string
  description = "AWS account id."
}

variable "taito_provider_region" {
  type = string
  description = "AWS region."
}

variable "taito_provider_user_profile" {
  type    = string
  default = ""
  description = "AWS user profile that is used to create the resources."
}

variable "taito_organization" {
  type = string
  default = ""
}

# Labels

variable "taito_zone" {
  type = string
  description = "Name of the zone (e.g. \"my-zone\"). It is required if gateway_asset_reader or secret_resource_path has not been set. "
}

variable "taito_project" {
  type = string
  description = "Name of the project (e.g. \"my-project\"). Required if secret_resource_path has not been set"
}

variable "taito_namespace" {
  type = string
  description = "Namespace for the project environment (e.g. \"my-project-dev\"). Required if secret_resource_path has not been set"
}

# Network

variable "taito_network_tags" {
  type = map(string)
}

variable "taito_function_subnet_tags" {
  type = map(string)
}

variable "taito_function_security_group_tags" {
  type    = map(string)
  default = {}
}

# Permissions

variable "taito_cicd_policies" {
  type    = list(string)
  description = "Policy ARN:s attached to the CI/CD role. The policies should provide access to Kubernetes, assets bucket, functions bucket, secrets, etc."
}

variable "taito_gateway_policies" {
  type    = list(string)
  description = "Role used by API Gateway to read static assets from assets bucket."
}

# Secrets

variable "taito_secret_resource_path" {
  type    = string
}

variable "taito_secret_name_path" {
  type    = string
}

# Buckets

variable "taito_static_assets_bucket" {
  type    = string
  description = "Storage bucket for static assets (html, css, js). Required if create_ingress is true."
}

variable "taito_static_assets_path" {
  type    = string
  description = "Storage bucket path for static assets (html, css, js). Required if create_ingress is true."
}

variable "taito_functions_bucket" {
  type    = string
  description = "Storage bucket for function zip-packages. Required if create_functions is true."
}

variable "taito_functions_path" {
  type    = string
  description = "Storage bucket path for function zip-packages. Required if create_functions is true."
}

# Deployment details

variable "taito_env" {
  type = string
  description = "For example one of these: dev, test, uat, stag, canary, prod"
}

variable "taito_build_image_tag" {
  type = string
  description = "For example git commit hash (ddee8c8da71393b4b2ef95de507358abe54d7e78)."
}
