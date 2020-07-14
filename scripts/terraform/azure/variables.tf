# Uptime provider

variable "taito_uptime_provider" {
  type = string
  default = ""
}

variable "taito_uptime_channels" {
  type = string  # whitespace delimited strings
  default = ""
}

# Labels

variable "taito_resource_namespace_id" {
  type = string
}

variable "project" {
  type        = string
  description = "Project name: e.g. \"my-project\""
}

# Environment info

variable "env" {
  type        = string
  description = "Environment: e.g. \"dev\""
}
