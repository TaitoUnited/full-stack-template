provider "azurerm" {
  /* TODO
  backend "azurerm" {
    resource_group_name  = "my-zone"
    storage_account_name = "myzone"
    container_name       = "my-zone-projects"
    key                  = "my-project-ENV"
  }
  */
}

/* Convert whitespace delimited strings into list(string) */
locals {
  taito_storages = (var.taito_storages == "" ? [] :
    split(" ", trimspace(replace(var.taito_storages, "/\\s+/", " "))))
}

module "azure" {
  source = "github.com/TaitoUnited/taito-terraform-modules//projects/azure"

  namespace     = var.taito_resource_namespace_id
  project       = var.taito_project
  env           = var.taito_env
  storages      = local.taito_storages
}
