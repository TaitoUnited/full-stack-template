variable "taito_project" {}
variable "taito_env" {}
variable "taito_domain" {}
variable "taito_zone" {}
variable "taito_namespace" {}
variable "taito_resource_namespace" {}
variable "taito_resource_namespace_id" {}
variable "taito_provider" {}
variable "taito_provider_region" {}
variable "taito_provider_zone" {}
variable "taito_organization" {}
variable "taito_organization_abbr" {}

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

/* Backup */
variable "taito_backup_locations" {
  type = "list"
  default = []
}
variable "taito_backup_days" {
  type = "list"
  default = []
}

/* Monitoring */
variable "taito_monitoring_targets" {
  type = "list"
  default = []
}
variable "taito_monitoring_paths" {
  type = "list"
  default = []
}
variable "taito_monitoring_timeouts" {
  type = "list"
  default = []
}
variable "taito_monitoring_uptime_channels" {
  type = "list"
  default = []
}

/* Google Cloud */
variable "gcloud_service_account_enabled" {}
