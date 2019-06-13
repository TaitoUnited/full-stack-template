variable "taito_project" {}
variable "taito_env" {}
variable "taito_domain" {}
variable "taito_uptime_namespace_id" {}

/* Monitoring */
variable "taito_uptime_targets" {
  type = "list"
}
variable "taito_uptime_paths" {
  type = "list"
}
variable "taito_uptime_timeouts" {
  type = "list"
}
variable "taito_uptime_channels" {
  type = "list"
}
