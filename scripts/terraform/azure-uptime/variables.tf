variable "taito_uptime_namespace_id" {
  type = string
}

variable "taito_project" {
  type = string
}

variable "taito_env" {
  type = string
}

variable "taito_domain" {
  type = string
}

variable "taito_uptime_targets" {
  type = string  # whitespace delimited strings
  default = ""
}

variable "taito_uptime_paths" {
  type = string  # whitespace delimited strings
  default = ""
}

variable "taito_uptime_timeouts" {
  type = string  # whitespace delimited strings
  default = ""
}
