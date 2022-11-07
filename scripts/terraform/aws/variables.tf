# Flags

variable "create_cicd_service_account" {
  type = bool
  default = true
}

variable "create_kubernetes_service_account" {
  type = bool
  default = true
}

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

# Uptime provider

variable "taito_uptime_provider" {
  type = string
  default = ""
}

variable "taito_uptime_channels" {
  type = list(string)
  default = []
}

# Labels

variable "taito_zone" {
  type = string
  description = "Name of the zone (e.g. \"my-zone\")."
}

variable "taito_project" {
  type = string
  description = "Name of the project (e.g. \"my-project\"). Required if secret_resource_path has not been set"
}

variable "taito_namespace" {
  type = string
  description = "Namespace for the project environment (e.g. \"my-project-dev\"). Required if secret_resource_path has not been set"
}

# Environment

variable "taito_env" {
  type = string
  description = "For example one of these: dev, test, uat, stag, canary, prod"
}

variable "taito_vc_repository" {
  type = string
  description = "For example: \"my-project\""
}

# Network

variable "taito_network_tags" {
  type = map(string)
}

variable "taito_cache_subnet_tags" {
  type = map(string)
}

variable "taito_cache_security_group_tags" {
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

# Containers

variable "taito_container_registry_provider" {
  type    = string
  default = ""
  description = "Container registry provider (e.g. \"aws\")."
}

variable "taito_targets" {
  type = list(string)
  default = []
  description = "All targets."
}

variable "taito_containers" {
  type = list(string)
  default = []
  description = "Container targets."
}

# Kubernetes

variable "kubernetes_name" {
  type = string
  default = ""
}

variable "kubernetes_db_proxy_enabled" {
  type = bool
  default = false
}

variable "kubernetes_service_account_role" {
  type = string
  default = "taito-restricted-pod"
}

# Secrets

variable "taito_cicd_secrets_path" {
  type    = string
  default = ""
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

variable "taito_state_bucket" {
  type    = string
  description = "Storage bucket for terraform state. Required if create_cicd_service_account is true."
}

variable "taito_state_path" {
  type    = string
  description = "Storage bucket path for terraform state. Required if create_cicd_service_account is true."
}

/* SENDGRID
# Sendgrid

variable "sendgrid_api_key" {
  type = string
  sensitive = true
  description = "Sendgrid API KEY for Terraform (1password)."
}
*/
