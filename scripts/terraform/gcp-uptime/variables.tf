# Provider

variable "taito_provider_region" {
}

variable "taito_provider_zone" {
}

# Project

variable "taito_project" {
}

variable "taito_env" {
}

variable "taito_domain" {
}

# Namespaces

variable "taito_uptime_namespace_id" {
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
  type = string  # whitespace delimited strings
  default = ""
}

variable "taito_uptime_channels" {
  type = string  # whitespace delimited strings
  default = ""
}
