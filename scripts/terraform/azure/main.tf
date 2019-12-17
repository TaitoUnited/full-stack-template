terraform {
  backend "azurerm" {
  }
  required_version = ">= 0.12"
}

provider "azurerm" {
}

/* Convert whitespace delimited strings into list(string) */
locals {
  taito_storages = (var.taito_storages == "" ? [] :
    split(" ", trimspace(replace(var.taito_storages, "/\\s+/", " "))))
}

module "azure" {
  source  = "TaitoUnited/project-resources/azurerm"
  version = "1.0.2"

  resource_group = var.taito_resource_namespace_id
  project        = var.taito_project
  env            = var.taito_env
  storages       = local.taito_storages
}
