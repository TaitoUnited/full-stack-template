variable "taito_env" {
}

variable "taito_domain" {
}

variable "taito_project" {
}

variable "taito_provider_region" {
}

variable "taito_organization" {
}

variable "taito_vc_repository" {
}

variable "taito_provider_user_profile" {
  type    = string
  default = ""
}

variable "taito_container_registry_provider" {
  type    = string
  default = ""
}

variable "taito_targets" {
  type = string  # whitespace delimited strings
}

variable "taito_container_targets" {
  type = string  # whitespace delimited strings
  default = ""
}

/* Storage */

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
