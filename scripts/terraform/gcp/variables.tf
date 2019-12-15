# Provider

variable "taito_provider_region" {
}

variable "taito_provider_zone" {
}

variable "gcp_service_account_enabled" {
}

# Project

variable "taito_project" {
}

variable "taito_env" {
}

variable "taito_domain" {
}

# Namespaces

variable "taito_namespace" {
}

variable "taito_resource_namespace_id" {
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

# Backup

variable "taito_backup_locations" {
  type = string  # whitespace delimited strings
  default = ""
}

variable "taito_backup_days" {
  type = string  # whitespace delimited strings
  default = ""
}
