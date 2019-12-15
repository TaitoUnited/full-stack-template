# Provider

variable "taito_organization" {
}

variable "taito_provider_user_profile" {
  type    = string
  default = ""
}

variable "taito_provider_region" {
}

# Project

variable "taito_project" {
}

variable "taito_domain" {
}

variable "taito_env" {
}

variable "taito_vc_repository" {
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

variable "taito_container_targets" {
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
