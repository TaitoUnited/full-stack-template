# Provider

variable "taito_organization" {
  type = string
}

variable "taito_provider_user_profile" {
  type    = string
  default = ""
}

variable "taito_provider_region" {
  type = string
}

# Project

variable "taito_project" {
  type = string
}

variable "taito_domain" {
  type = string
}

variable "taito_env" {
  type = string
}

variable "taito_vc_repository" {
  type = string
}

variable "taito_container_registry_provider" {
  type    = string
  default = ""
}

# Shared infrastructure

variable "taito_functions_bucket" {
  type = string
  default = ""
}

# Targets

variable "taito_ci_cache_all_targets_with_docker" {
  type = bool  # whitespace delimited strings
  default = false
}

variable "taito_targets" {
  type = string  # whitespace delimited strings
  default = ""
}

variable "taito_containers" {
  type = string  # whitespace delimited strings
  default = ""
}

# Storage

variable "taito_storages" {
  type = string  # whitespace delimited strings
  default = ""
}

variable "taito_storage_locations" {
  type = string  # whitespace delimited strings
  default = ""
}

variable "taito_storage_classes" {
  type = string  # whitespace delimited strings
  default = ""
}

variable "taito_storage_days" {
  type = string  # whitespace delimited strings
  default = ""
}
