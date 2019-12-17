# Provider

variable "taito_provider_region" {
  type = string
}

variable "taito_provider_zone" {
  type = string
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

# Namespaces

variable "taito_uptime_namespace_id" {
  type = string
}

# Monitoring

variable "taito_uptime_targets" {
  type = string  # whitespace delimited strings
  default = ""
}

variable "taito_uptime_paths" {
  type = string  # whitespace delimited strings
  default = ""
}

/* TODO: use timeout */
variable "taito_uptime_timeouts" {
  type = string  # whitespace delimited numbers
  default = ""
}

variable "taito_uptime_channels" {
  type = string  # whitespace delimited strings
  default = ""
}
