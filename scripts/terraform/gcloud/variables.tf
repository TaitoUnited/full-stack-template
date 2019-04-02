variable "taito_project" {}
variable "taito_env" {}
variable "taito_domain" {}
variable "taito_zone" {}
variable "taito_namespace" {}
variable "taito_resource_namespace" {}
variable "taito_resource_namespace_id" {}
variable "taito_provider" {}
variable "taito_organization" {}
variable "taito_organization_abbr" {}
variable "taito_storages" {
  type = "list"
  default = []
}
variable "taito_monitoring_names" {
  type = "list"
}
variable "taito_monitoring_paths" {
  type = "list"
}
variable "taito_monitoring_timeouts" {
  type = "list"
}
variable "taito_monitoring_uptime_channels" {
  type = "list"
}

variable "gcloud_org_id" {}
variable "gcloud_region" {}
variable "gcloud_zone" {}
variable "gcloud_storage_locations" {
  type = "list"
}
variable "gcloud_storage_classes" {
  type = "list"
}
