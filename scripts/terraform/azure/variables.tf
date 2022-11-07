# Flags

variable "create_cicd_service_account" {
  type = bool
  default = true
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

variable "taito_provider_billing_account_id" {
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

# Uptime monitoring

variable "taito_uptime_provider" {
  type = string
  default = ""
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
