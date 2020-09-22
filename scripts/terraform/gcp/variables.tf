# Project

variable "taito_project" {
  type = string
}

variable "taito_env" {
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
