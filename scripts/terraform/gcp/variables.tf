# Flags

variable "create_cicd_service_account" {
  type = bool
  default = false # TODO: true
}

variable "create_kubernetes_service_account" {
  type = bool
  default = true
}

# Project

variable "taito_project" {
  type = string
}

variable "taito_env" {
  type = string
}

variable "taito_namespace" {
  type = string
}

# Cloud provider

variable "taito_resource_namespace_id" {
  type = string
}

variable "taito_provider_region" {
  type = string
}

variable "taito_provider_zone" {
  type = string
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

# Version control

variable "taito_vc_provider" {
  type = string
}

variable "taito_vc_organization" {
  type = string
}

variable "taito_vc_repository" {
  type = string
}

variable "taito_branch" {
  type = string
}

# CI/CD

variable "taito_ci_provider" {
  type = string
  default = ""
}

variable "taito_ci_namespace_id" {
  type = string
}

# Logging

variable "taito_logging_provider" {
  type = string
  default = ""
}

variable "taito_logging_namespace_id" {
  type = string
}

# Uptime monitoring

variable "taito_uptime_provider" {
  type = string
  default = ""
}

variable "taito_uptime_namespace_id" {
  type = string
}

variable "taito_uptime_channels" {
  type = string  # whitespace delimited strings
  default = ""
}

/* SENDGRID
# Sendgrid

variable "sendgrid_api_key" {
  type = string
  sensitive = true
  description = "Sendgrid API KEY for Terraform (1password)."
}
*/
