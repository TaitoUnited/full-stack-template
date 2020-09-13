# Provider

variable "taito_provider_region" {
  type = string
}

variable "taito_provider_zone" {
  type = string
}

# Uptime provider

variable "taito_uptime_provider" {
  type = string
  default = ""
}

variable "taito_uptime_channels" {
  type = string  # whitespace delimited strings
  default = ""
}

# Project

variable "taito_project" {
  type = string
}

variable "taito_env" {
  type = string
}

variable "taito_domain" {
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

# Namespaces

variable "taito_namespace" {
  type = string
}

variable "taito_resource_namespace_id" {
  type = string
}

variable "taito_logging_namespace_id" {
  type = string
}

variable "taito_uptime_namespace_id" {
  type = string
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

variable "taito_storage_cors" {
  type = string  # whitespace delimited strings
  default = ""
}

variable "taito_storage_admins" {
  type = string  # whitespace delimited strings
  default = ""
}

variable "taito_storage_object_admins" {
  type = string  # whitespace delimited strings
  default = ""
}

variable "taito_storage_object_viewers" {
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
