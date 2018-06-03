terraform {
  backend "local" {
    path = "./${var.taito_resource_namespace}/terraform.tfstate"
  }
}
