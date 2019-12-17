terraform {
  backend "azurerm" {
  }
  required_version = ">= 0.12"
}

provider "azurerm" {
}

/* Convert whitespace delimited strings into list(string) */
locals {
  taito_uptime_targets = (var.taito_uptime_targets == "" ? [] :
    split(" ", trimspace(replace(var.taito_uptime_targets, "/\\s+/", " "))))
  taito_uptime_paths = (var.taito_uptime_paths == "" ? [] :
    split(" ", trimspace(replace(var.taito_uptime_paths, "/\\s+/", " "))))
  taito_uptime_timeouts = (var.taito_uptime_timeouts == "" ? [] :
    split(" ", trimspace(replace(var.taito_uptime_timeouts, "/\\s+/", " "))))
}

module "azure-uptime" {
  source  = "TaitoUnited/uptime-monitoring/azurerm"
  version = "1.0.3"

  resource_group        = var.taito_uptime_namespace_id
  project               = var.taito_project
  env                   = var.taito_env
  domain                = var.taito_domain

  uptime_targets        = local.taito_uptime_targets
  uptime_paths          = local.taito_uptime_paths
  uptime_timeouts       = local.taito_uptime_timeouts
}
