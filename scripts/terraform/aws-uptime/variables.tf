variable "taito_provider_region" {
  type = string
}

variable "taito_organization" {
}

variable "taito_provider_user_profile" {
  type    = string
  default = ""
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

/* Monitoring */
variable "taito_uptime_targets" {
  type = list(string)
}

variable "taito_uptime_paths" {
  type = list(string)
}

/* TODO: use timeout */
variable "taito_uptime_timeouts" {
  type = list(string)
}

variable "taito_uptime_channels" {
  type = list(string)
}
