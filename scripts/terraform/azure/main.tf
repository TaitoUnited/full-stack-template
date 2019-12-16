provider "azurerm" {
}

/* Convert whitespace delimited strings into list(string) */
locals {
  taito_storages = (var.taito_storages == "" ? [] :
    split(" ", trimspace(replace(var.taito_storages, "/\\s+/", " "))))
}

module "azure" {
  source = "github.com/TaitoUnited/taito-terraform-modules//projects/azure"

  resource_group = var.taito_resource_namespace_id
  project        = var.taito_project
  env            = var.taito_env
  storages       = local.taito_storages
}
