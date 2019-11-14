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
  type = list(string)
}

variable "taito_container_targets" {
  type = list(string)
  default = []
}

/* Storage */

variable "taito_storages" {
  type    = list(string)
  default = []
}

variable "taito_storage_locations" {
  type    = list(string)
  default = []
}

variable "taito_storage_classes" {
  type    = list(string)
  default = []
}

variable "taito_storage_days" {
  type    = list(string)
  default = []
}
