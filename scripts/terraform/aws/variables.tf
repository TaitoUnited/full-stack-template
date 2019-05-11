variable "taito_env" {}
variable "taito_domain" {}
variable "taito_project" {}
variable "taito_provider_region" {}
variable "taito_organization" {}
variable "taito_vc_repository" {}

variable "taito_provider_user_profile" {
  type = "string"
  default = ""
}

variable "taito_container_registry_provider" {
  type = "string"
  default = ""
}

variable "taito_targets" {
  type = "list"
}

/* Storage */

variable "taito_storages" {
  type = "list"
  default = []
}
variable "taito_storage_locations" {
  type = "list"
  default = []
}
variable "taito_storage_classes" {
  type = "list"
  default = []
}
variable "taito_storage_days" {
  type = "list"
  default = []
}
